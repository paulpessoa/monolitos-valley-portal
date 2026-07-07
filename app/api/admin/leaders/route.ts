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

export async function GET(request: NextRequest) {
  try {
    const auth = await checkAdmin()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { data: leaders, error: fetchError } = await auth.serviceClient!
      .from("community_leaders")
      .select("*, profiles(full_name, email, avatar_url)")

    if (fetchError) {
      console.error("Leaders fetch error:", fetchError)
      return NextResponse.json({ error: "Erro ao buscar lideranças" }, { status: 500 })
    }

    return NextResponse.json({ data: leaders || [] })
  } catch (error) {
    console.error("Unexpected error in GET leaders:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await checkAdmin()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const body = await request.json()
    const { role_title, startup_name, linkedin_url, instagram_url, profile_id, avatar_url, dedicated_hours } = body

    if (!profile_id || !role_title) {
      return NextResponse.json({ error: "Perfil e cargo são obrigatórios" }, { status: 400 })
    }

    if (avatar_url !== undefined) {
      const { error: profileError } = await auth.serviceClient!
        .from("profiles")
        .update({ avatar_url })
        .eq("id", profile_id)
      if (profileError) {
        console.error("Profile avatar update error in POST:", profileError)
      }
    }

    const { data: leader, error: insertError } = await auth.serviceClient!
      .from("community_leaders")
      .insert({
        role_title,
        startup_name: startup_name || null,
        linkedin_url: linkedin_url || null,
        instagram_url: instagram_url || null,
        profile_id,
        dedicated_hours: dedicated_hours || 0,
        hours_approved: false,
        approved_by: [],
        checklist: [],
        monthly_engagement: []
      })
      .select("*, profiles(full_name, email, avatar_url)")
      .single()

    if (insertError) {
      console.error("Leaders insert error:", insertError)
      return NextResponse.json({ error: "Erro ao cadastrar liderança" }, { status: 500 })
    }

    return NextResponse.json({ data: leader })
  } catch (error) {
    console.error("Unexpected error in POST leaders:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
