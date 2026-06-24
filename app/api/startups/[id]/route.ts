import { createClient, createServiceClient } from "@/lib/supabase/server"
import { startupSchema } from "@/lib/validations/startup"
import { deleteStorageFileServer } from "@/lib/supabase/storage-server"
import { NextRequest, NextResponse } from "next/server"

// Middleware to check if user is admin
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // We can allow public access to GET a startup by ID, or keep it admin only.
    // If it's for the admin edit form, public access is fine since startups are public.
    const serviceClient = await createServiceClient()

    const { data, error } = await serviceClient
      .from("startups")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Startup fetch error:", error)
      return NextResponse.json({ error: "Startup não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await checkAdmin()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }
    
    const { id } = await params
    const body = await request.json()
    const { startup: startupData } = body

    if (!startupData) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    // Validate the complete data since it's a PUT
    try {
      const validatedStartup = startupSchema.parse(startupData)

      const { data, error: startupError } = await auth.serviceClient!
        .from("startups")
        .update(validatedStartup)
        .eq("id", id)
        .select()
        .single()

      if (startupError) {
        console.error("Startup update error:", startupError)
        return NextResponse.json({ error: "Erro ao atualizar startup" }, { status: 500 })
      }

      return NextResponse.json({ startup: data })
    } catch (validationError: any) {
      const firstError = validationError.errors?.[0]
      return NextResponse.json(
        { error: firstError?.message || "Dados inválidos" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await checkAdmin()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { id } = await params
    const serviceClient = auth.serviceClient!

    // 1. Fetch startup to get files
    const { data: startup, error: fetchError } = await serviceClient
      .from("startups")
      .select("id, logo_url, pitch_deck_url")
      .eq("id", id)
      .maybeSingle()

    if (fetchError || !startup) {
      return NextResponse.json({ error: "Startup não encontrada" }, { status: 404 })
    }

    // 2. Fetch team members to get photos
    const { data: teamMembers } = await serviceClient
      .from("team_members")
      .select("photo_url")
      .eq("startup_id", id)
      
    // 3. Delete files from storage
    if (startup.logo_url) {
      await deleteStorageFileServer("logos", startup.logo_url)
    }
    
    if (startup.pitch_deck_url) {
      await deleteStorageFileServer("pitch-decks", startup.pitch_deck_url)
    }

    if (teamMembers && teamMembers.length > 0) {
      for (const member of teamMembers) {
        if (member.photo_url) {
          await deleteStorageFileServer("team-members", member.photo_url)
        }
      }
    }

    // 4. Delete the startup from the database
    const { error: deleteError } = await serviceClient
      .from("startups")
      .delete()
      .eq("id", id)

    if (deleteError) {
      console.error("Error deleting startup:", deleteError)
      return NextResponse.json({ error: "Erro ao excluir startup" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Startup excluída com sucesso" })
  } catch (error) {
    console.error("❌ Unexpected error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
