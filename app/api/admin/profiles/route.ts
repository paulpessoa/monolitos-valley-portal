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

    const serviceClient = auth.serviceClient!

    // Fetch all profiles
    const { data: profiles, error: profilesError } = await serviceClient
      .from("profiles")
      .select("id, full_name, email, avatar_url, role")
      .order("full_name", { ascending: true })

    if (profilesError) {
      console.error("Profiles fetch error:", profilesError)
      return NextResponse.json({ error: "Erro ao buscar perfis" }, { status: 500 })
    }

    return NextResponse.json({ data: profiles || [] })
  } catch (error) {
    console.error("Unexpected error in GET profiles:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
