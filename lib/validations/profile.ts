import { z } from "zod"

export const profileSchema = z.object({
  full_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  bio: z.string().max(500, "Bio deve ter no máximo 500 caracteres").optional(),
  phone: z.string().optional(),
  linkedin: z.string().url("URL inválida").optional().or(z.literal("")),
  avatar_url: z.string().url("URL inválida").optional().or(z.literal(""))
})

export const seekingSchema = z.object({
  seeking_details: z
    .string()
    .max(1000, "Detalhes devem ter no máximo 1000 caracteres")
    .optional()
})

export type ProfileFormData = z.infer<typeof profileSchema>
export type SeekingFormData = z.infer<typeof seekingSchema>
