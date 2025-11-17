import { z } from "zod"

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_PDF_SIZE = 10 * 1024 * 1024 // 10MB

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp"
]
const ACCEPTED_PDF_TYPES = ["application/pdf"]

export const imageUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_IMAGE_SIZE,
      "Imagem deve ter no máximo 5MB"
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Apenas arquivos JPEG, PNG ou WebP são aceitos"
    ),
  bucket: z.string(),
  path: z.string().optional()
})

export const pdfUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_PDF_SIZE, "PDF deve ter no máximo 10MB")
    .refine(
      (file) => ACCEPTED_PDF_TYPES.includes(file.type),
      "Apenas arquivos PDF são aceitos"
    ),
  bucket: z.string(),
  path: z.string().optional()
})

export type ImageUploadData = z.infer<typeof imageUploadSchema>
export type PdfUploadData = z.infer<typeof pdfUploadSchema>
