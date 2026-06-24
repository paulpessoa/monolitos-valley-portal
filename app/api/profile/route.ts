import { createClient, createServiceClient } from "@/lib/supabase/server"
import { profileSchema } from "@/lib/validations/profile"
import { startupSchema } from "@/lib/validations/startup"
import { deleteStorageFileServer } from "@/lib/supabase/storage-server"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const serviceClient = await createServiceClient()

    // Fetch profile
    let { data: profile, error: profileError } = await serviceClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    // If profile doesn't exist, create it
    if (!profile && !profileError) {
      const { data: newProfile, error: createError } = await serviceClient
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null
        })
        .select()
        .single()

      if (createError) {
        console.error("Profile create error:", createError)
        return NextResponse.json(
          { error: "Erro ao criar perfil" },
          { status: 500 }
        )
      }

      profile = newProfile
    }

    if (profileError) {
      console.error("Profile fetch error:", profileError)
      return NextResponse.json(
        { error: "Erro ao buscar perfil" },
        { status: 500 }
      )
    }

    // Fetch startup (if exists)
    const { data: startup, error: startupError } = await serviceClient
      .from("startups")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle()

    if (startupError) {
      console.error("Startup fetch error:", startupError)
      return NextResponse.json(
        { error: "Erro ao buscar startup" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      profile,
      startup
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// PATCH para atualização parcial (apenas campos enviados)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { profile: profileData, startup: startupData } = body

    const serviceClient = await createServiceClient()
    let updatedProfile = null
    let updatedStartup = null

    // Update profile if provided (partial update)
    if (profileData) {
      try {
        // Não valida, apenas filtra campos vazios
        const cleanData = Object.fromEntries(
          Object.entries(profileData).filter(([_, v]) => v !== undefined)
        )

        const { data, error: profileError } = await serviceClient
          .from("profiles")
          .update(cleanData)
          .eq("id", user.id)
          .select()
          .single()

        if (profileError) {
          console.error("Profile update error:", profileError)
          return NextResponse.json(
            { error: "Erro ao atualizar perfil" },
            { status: 500 }
          )
        }

        updatedProfile = data
      } catch (error: any) {
        console.error("❌ Profile update error:", error)
        return NextResponse.json(
          { error: "Erro ao atualizar perfil" },
          { status: 500 }
        )
      }
    }

    // Update startup if provided (partial update)
    if (startupData) {
      try {
        const cleanData = Object.fromEntries(
          Object.entries(startupData).filter(([_, v]) => v !== undefined)
        )

        const { data: existingStartup } = await serviceClient
          .from("startups")
          .select("id")
          .eq("owner_id", user.id)
          .maybeSingle()

        if (existingStartup) {
          const { data, error: startupError } = await serviceClient
            .from("startups")
            .update(cleanData)
            .eq("owner_id", user.id)
            .select()
            .single()

          if (startupError) {
            console.error("Startup update error:", startupError)
            return NextResponse.json(
              { error: "Erro ao atualizar startup" },
              { status: 500 }
            )
          }

          updatedStartup = data
        } else {
          return NextResponse.json(
            { error: "Startup não encontrada. Use PUT para criar." },
            { status: 404 }
          )
        }
      } catch (error: any) {
        console.error("❌ Startup update error:", error)
        return NextResponse.json(
          { error: "Erro ao atualizar startup" },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      profile: updatedProfile,
      startup: updatedStartup
    })
  } catch (error) {
    console.error("❌ Unexpected error:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// PUT para atualização completa (com validação)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { profile: profileData, startup: startupData } = body

    const serviceClient = await createServiceClient()
    let updatedProfile = null
    let updatedStartup = null

    // Update profile if provided
    if (profileData) {
      try {
        const validatedProfile = profileSchema.parse(profileData)

        const { data, error: profileError } = await serviceClient
          .from("profiles")
          .update(validatedProfile)
          .eq("id", user.id)
          .select()
          .single()

        if (profileError) {
          console.error("Profile update error:", profileError)
          return NextResponse.json(
            { error: "Erro ao atualizar perfil" },
            { status: 500 }
          )
        }

        updatedProfile = data
      } catch (validationError: any) {
        const firstError = validationError.errors?.[0]
        const friendlyMessage =
          firstError?.message || "Dados do perfil inválidos"

        console.error("❌ Profile validation error:", validationError.errors)

        return NextResponse.json(
          {
            error: friendlyMessage,
            field: firstError?.path?.[0],
            details: validationError.errors
          },
          { status: 400 }
        )
      }
    }

    // Update or create startup if provided
    if (startupData) {
      try {
        const validatedStartup = startupSchema.parse(startupData)

        // Check if startup exists
        const { data: existingStartup } = await serviceClient
          .from("startups")
          .select("id")
          .eq("owner_id", user.id)
          .maybeSingle()

        if (existingStartup) {
          // Update existing startup
          const { data, error: startupError } = await serviceClient
            .from("startups")
            .update(validatedStartup)
            .eq("owner_id", user.id)
            .select()
            .single()

          if (startupError) {
            console.error("Startup update error:", startupError)
            return NextResponse.json(
              { error: "Erro ao atualizar startup" },
              { status: 500 }
            )
          }

          updatedStartup = data
        } else {
          // Create new startup
          const { data, error: startupError } = await serviceClient
            .from("startups")
            .insert({
              ...validatedStartup,
              owner_id: user.id
            })
            .select()
            .single()

          if (startupError) {
            console.error("Startup create error:", startupError)
            return NextResponse.json(
              { error: "Erro ao criar startup" },
              { status: 500 }
            )
          }

          updatedStartup = data
        }
      } catch (validationError: any) {
        const firstError = validationError.errors?.[0]
        const friendlyMessage =
          firstError?.message || "Dados da startup inválidos"

        console.error("❌ Startup validation error:", validationError.errors)

        return NextResponse.json(
          {
            error: friendlyMessage,
            field: firstError?.path?.[0],
            details: validationError.errors
          },
          { status: 400 }
        )
      }
    }

    return NextResponse.json({
      profile: updatedProfile,
      startup: updatedStartup
    })
  } catch (error) {
    console.error("❌ Unexpected error:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const serviceClient = await createServiceClient()

    // 1. Fetch startup to get files
    const { data: startup, error: fetchError } = await serviceClient
      .from("startups")
      .select("id, logo_url, pitch_deck_url")
      .eq("owner_id", user.id)
      .maybeSingle()

    if (fetchError) {
      console.error("Error fetching startup for deletion:", fetchError)
      return NextResponse.json({ error: "Erro ao buscar startup para exclusão" }, { status: 500 })
    }

    if (!startup) {
      return NextResponse.json({ error: "Startup não encontrada" }, { status: 404 })
    }

    // 2. Fetch team members to get photos
    const { data: teamMembers } = await serviceClient
      .from("team_members")
      .select("photo_url")
      .eq("startup_id", startup.id)
      
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

    // 4. Delete the startup from the database (cascade will handle team members DB records)
    const { error: deleteError } = await serviceClient
      .from("startups")
      .delete()
      .eq("owner_id", user.id)

    if (deleteError) {
      console.error("Error deleting startup:", deleteError)
      return NextResponse.json({ error: "Erro ao excluir startup" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Startup excluída com sucesso" })
  } catch (error) {
    console.error("❌ Unexpected error:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

