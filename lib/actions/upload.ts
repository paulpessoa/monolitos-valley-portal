'use server'

import { createClient } from "@/lib/supabase/server"

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

export async function uploadFileAction(formData: FormData) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: "Não autenticado" }
    }

    const file = formData.get("file") as File | null
    const bucket = formData.get("bucket") as BucketName | null

    if (!file || !(file instanceof File)) {
      return { error: "Arquivo inválido ou não fornecido" }
    }

    if (!bucket) {
      return { error: "Bucket não especificado" }
    }

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
      return { error: "Bucket inválido" }
    }

    const isPdf = file.type === ACCEPTED_PDF_TYPE
    const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type)

    if (!isPdf && !isImage) {
      return { error: "Tipo de arquivo não suportado. Use JPEG, PNG, WebP ou PDF" }
    }

    if (isPdf && file.size > MAX_PDF_SIZE) {
      return { error: "PDF deve ter no máximo 100MB" }
    }

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return { error: "Imagem deve ter no máximo 5MB" }
    }

    if (bucket === "pitch-decks" && !isPdf) {
      return { error: "Bucket pitch-decks aceita apenas arquivos PDF" }
    }

    if (bucket !== "pitch-decks" && !isImage) {
      return { error: `Bucket ${bucket} aceita apenas imagens` }
    }

    const fileExt = file.name.split(".").pop()
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const sanitizedName = `${timestamp}-${randomStr}.${fileExt}`
    const fileName = `${user.id}/${sanitizedName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return { error: "Erro ao fazer upload do arquivo" }
    }

    const {
      data: { publicUrl }
    } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return {
      url: publicUrl,
      path: data.path,
      bucket
    }
  } catch (error) {
    console.error("Unexpected error in Server Action uploadFileAction:", error)
    return { error: "Erro interno do servidor ao processar arquivo" }
  }
}
