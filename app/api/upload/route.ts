import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_PDF_SIZE = 100 * 1024 * 1024 // 100MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp"
]
const ACCEPTED_PDF_TYPE = "application/pdf"

type BucketName =
  | "avatars"
  | "logos"
  | "pitch-decks"
  | "events"
  | "blog"
  | "products"
  | "team-members"

export async function POST(request: NextRequest) {
  try {
    // Validate authentication
    const supabase = await createClient()
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const bucket = formData.get("bucket") as BucketName | null
    const profileId = formData.get("profileId") as string | null

    if (!file) {
      return NextResponse.json(
        { error: "Arquivo não fornecido" },
        { status: 400 }
      )
    }

    if (!bucket) {
      return NextResponse.json(
        { error: "Bucket não especificado" },
        { status: 400 }
      )
    }

    // Validate bucket
    const validBuckets: BucketName[] = [
      "avatars",
      "logos",
      "pitch-decks",
      "events",
      "blog",
      "products",
      "team-members"
    ]
    if (!validBuckets.includes(bucket)) {
      return NextResponse.json({ error: "Bucket inválido" }, { status: 400 })
    }

    // Validate file type and size
    const isPdf = file.type === ACCEPTED_PDF_TYPE
    const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type)

    if (!isPdf && !isImage) {
      return NextResponse.json(
        { error: "Tipo de arquivo não suportado. Use JPEG, PNG, WebP ou PDF" },
        { status: 400 }
      )
    }

    // Validate size based on type
    if (isPdf && file.size > MAX_PDF_SIZE) {
      return NextResponse.json(
        { error: "PDF deve ter no máximo 100MB" },
        { status: 400 }
      )
    }

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Imagem deve ter no máximo 5MB" },
        { status: 400 }
      )
    }

    // Validate bucket-file type compatibility
    if (bucket === "pitch-decks" && !isPdf) {
      return NextResponse.json(
        { error: "Bucket pitch-decks aceita apenas arquivos PDF" },
        { status: 400 }
      )
    }

    if (bucket !== "pitch-decks" && !isImage) {
      return NextResponse.json(
        { error: `Bucket ${bucket} aceita apenas imagens` },
        { status: 400 }
      )
    }

    // Determine target folder prefix
    let targetFolder = user.id
    if (profileId && profileId !== user.id) {
      // Verify if current user is admin
      const serviceClient = await createServiceClient()
      const { data: profile } = await serviceClient
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()
      if (profile?.role === "admin") {
        targetFolder = profileId
      }
    }

    // Generate unique filename with sanitization
    const fileExt = file.name.split(".").pop()
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    // Sanitize: remove special characters and spaces
    const sanitizedName = `${timestamp}-${randomStr}.${fileExt}`
    const fileName = `${targetFolder}/${sanitizedName}`

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json(
        { error: "Erro ao fazer upload do arquivo" },
        { status: 500 }
      )
    }

    // Get public URL
    const {
      data: { publicUrl }
    } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return NextResponse.json(
      {
        url: publicUrl,
        path: data.path,
        bucket
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
