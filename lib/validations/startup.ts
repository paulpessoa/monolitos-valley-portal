import { z } from "zod"

export const startupSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  segmento: z.string().min(1, "Segmento é obrigatório"),
  estagio_maturidade: z.enum(["ideia", "mvp", "tracao", "escala"]),
  ano_fundacao: z.number().int().min(1900).max(new Date().getFullYear()),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  linkedin: z.string().url("URL inválida").optional().or(z.literal("")),
  instagram: z.string().url("URL inválida").optional().or(z.literal("")),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().length(2, "Estado deve ter 2 caracteres"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  tecnologias: z.array(z.string()).optional(),
  tem_esg: z.boolean().default(false),
  detalhes_esg: z.string().optional(),
  logo_url: z.string().url("URL inválida").optional().or(z.literal("")),
  pitch_deck_url: z.string().url("URL inválida").optional().or(z.literal(""))
})

export type StartupFormData = z.infer<typeof startupSchema>
