import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { error: "Não autenticado", status: 401 }
  }

  const serviceClient = await createServiceClient()
  const { data: profile } = await serviceClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    return { error: "Acesso negado", status: 403 }
  }

  return { user, serviceClient }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await checkAdmin()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const body = await request.json()
    const {
      role_title,
      startup_name,
      linkedin_url,
      instagram_url,
      profile_id,
      checklist,
      monthly_engagement,
      avatar_url,
      dedicated_hours,
      hours_approved,
      approved_by
    } = body

    const updateData: any = {}
    if (role_title !== undefined) updateData.role_title = role_title
    if (startup_name !== undefined) updateData.startup_name = startup_name || null
    if (linkedin_url !== undefined) updateData.linkedin_url = linkedin_url || null
    if (instagram_url !== undefined) updateData.instagram_url = instagram_url || null
    if (profile_id !== undefined) updateData.profile_id = profile_id
    if (checklist !== undefined) updateData.checklist = checklist
    if (monthly_engagement !== undefined) updateData.monthly_engagement = monthly_engagement
    if (dedicated_hours !== undefined) updateData.dedicated_hours = dedicated_hours
    if (hours_approved !== undefined) updateData.hours_approved = hours_approved
    if (approved_by !== undefined) updateData.approved_by = approved_by

    updateData.updated_at = new Date().toISOString()

    if (avatar_url !== undefined) {
      const finalProfileId = profile_id || (await auth.serviceClient!
        .from("community_leaders")
        .select("profile_id")
        .eq("id", id)
        .single()
      ).data?.profile_id

      if (finalProfileId) {
        const { error: profileError } = await auth.serviceClient!
          .from("profiles")
          .update({ avatar_url })
          .eq("id", finalProfileId)
        if (profileError) {
          console.error("Profile avatar update error in PUT:", profileError)
        }
      }
    }

    const { data: leader, error: updateError } = await auth.serviceClient!
      .from("community_leaders")
      .update(updateData)
      .eq("id", id)
      .select("*, profiles(full_name, email, avatar_url)")
      .single()

    if (updateError) {
      console.error("Leaders update error:", updateError)
      return NextResponse.json({ error: "Erro ao atualizar liderança" }, { status: 500 })
    }

    return NextResponse.json({ data: leader })
  } catch (error) {
    console.error("Unexpected error in PUT leader:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await checkAdmin()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { error: deleteError } = await auth.serviceClient!
      .from("community_leaders")
      .delete()
      .eq("id", id)

    if (deleteError) {
      console.error("Leaders delete error:", deleteError)
      return NextResponse.json({ error: "Erro ao deletar liderança" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error in DELETE leader:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
