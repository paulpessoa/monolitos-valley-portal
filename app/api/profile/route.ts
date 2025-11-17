import { createClient, createServiceClient } from "@/lib/supabase/server"
import { profileSchema } from "@/lib/validations/profile"
import { startupSchema } from "@/lib/validations/startup"
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
    }

    // Update or create startup if provided
    if (startupData) {
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
    }

    return NextResponse.json({
      profile: updatedProfile,
      startup: updatedStartup
    })
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error },
        { status: 400 }
      )
    }

    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
