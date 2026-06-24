import { createClient, createServiceClient } from "@/lib/supabase/server"
import { deleteStorageFileServer } from "@/lib/supabase/storage-server"
import { NextRequest, NextResponse } from "next/server"

async function checkAuth() {
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

  return { user, profile, serviceClient }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const serviceClient = await createServiceClient()

    const { data, error } = await serviceClient
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Blog post fetch error:", error)
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 })
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
    const auth = await checkAuth()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { id } = await params
    const body = await request.json()

    // Verifying permission (author or admin)
    const { data: post, error: fetchError } = await auth.serviceClient!
      .from("blog_posts")
      .select("author_id")
      .eq("id", id)
      .single()

    if (fetchError || !post) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 })
    }

    if (post.author_id !== auth.user!.id && auth.profile?.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const { data, error: updateError } = await auth.serviceClient!
      .from("blog_posts")
      .update({
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
        content: body.content,
        excerpt: body.excerpt,
        image_url: body.image_url,
      })
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      console.error("Blog post update error:", updateError)
      return NextResponse.json({ error: "Erro ao atualizar post" }, { status: 500 })
    }

    return NextResponse.json({ data })
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
    const auth = await checkAuth()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { id } = await params
    
    const { data: post, error: fetchError } = await auth.serviceClient!
      .from("blog_posts")
      .select("author_id, image_url")
      .eq("id", id)
      .single()

    if (fetchError || !post) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 })
    }

    if (post.author_id !== auth.user!.id && auth.profile?.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    // Delete image from storage
    if (post.image_url) {
      await deleteStorageFileServer("blog", post.image_url)
    }

    const { error: deleteError } = await auth.serviceClient!
      .from("blog_posts")
      .delete()
      .eq("id", id)

    if (deleteError) {
      console.error("Error deleting post:", deleteError)
      return NextResponse.json({ error: "Erro ao excluir post" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Post excluído com sucesso" })
  } catch (error) {
    console.error("❌ Unexpected error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
