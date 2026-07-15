export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  phone: string | null
  linkedin: string | null
  role: string
  seeking_details: string | null
  created_at: string
  updated_at: string
}

export type EstagioMaturidade =
  | "ideia"
  | "validacao"
  | "mvp"
  | "tracao"
  | "escala"
  | "crescimento"

export interface Startup {
  id: string
  owner_id: string
  name: string
  description: string
  logo_url: string | null
  segmento: string
  estagio_maturidade: EstagioMaturidade
  ano_fundacao: number
  website: string | null
  linkedin: string | null
  instagram: string | null
  cidade: string
  estado: string
  latitude: number | null
  longitude: number | null
  tecnologias: string[]
  tem_esg: boolean
  detalhes_esg: string | null
  pitch_deck_url: string | null
  cnpj: string | null
  slug: string | null
  banner_url: string | null
  programas_investimentos: string | null
  approved: boolean
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string | null
  event_date: string
  date?: string // Deprecated - usar event_date
  start_time: string | null
  end_time: string | null
  image_url: string | null
  location: string | null // Deprecated - usar address ou link
  address: string | null // Endereço físico
  link: string | null // Link online (Google Meet, Zoom, etc)
  created_by: string | null
  approved: boolean
  created_at: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  content: string
  image_url: string | null
  author_id: string | null
  approved: boolean
  created_at: string
  updated_at: string
  author?: Profile
}

export type OpportunityType =
  | "investimento"
  | "edital"
  | "inovacao_aberta"
  | "beneficio"
  | "vaga"

export interface Opportunity {
  id: string
  title: string
  description: string | null
  type: OpportunityType
  is_paid_feature: boolean
  deadline: string | null
  image_url: string | null
  application_url: string | null
  active: boolean
  approved: boolean
  created_at: string
}

export interface Partner {
  id: string
  name: string
  description: string | null
  image_url: string | null
  website: string | null
  category: string | null
  approved: boolean
  created_at: string
}

export interface StoreProduct {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  external_link: string
  approved: boolean
  created_at: string
}

export interface TeamMember {
  id: string
  startup_id: string
  full_name: string
  photo_url: string | null
  role: string
  linkedin: string | null
  github: string | null
  behance: string | null
  portfolio: string | null
  lattes: string | null
  instagram: string | null
  outros: string | null
  position_order: number
  created_at: string
  updated_at: string
}

export interface CommunityLeader {
  id: string
  profile_id: string
  role_title: string
  startup_name: string | null
  linkedin_url: string | null
  instagram_url: string | null
  dedicated_hours: number
  hours_approved: boolean
  approved_by: string[] // Array of UUIDs representing validator profile IDs
  checklist: string[] // Array of completed task IDs
  monthly_engagement: {
    month: string // e.g. "2026-07"
    completed: string[] // List of monthly tasks completed
    retro: string | null
  }[]
  created_at: string
  updated_at: string
  profiles?: {
    full_name: string | null
    email: string
    avatar_url: string | null
  } | null
}

