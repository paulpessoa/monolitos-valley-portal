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

export type EstagioMaturidade = "ideia" | "mvp" | "tracao" | "escala"

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
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string | null
  event_date: string
  image_url: string | null
  location: string | null
  created_at: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  content: string
  image_url: string | null
  author_id: string | null
  created_at: string
  updated_at: string
  author?: Profile
}

export type OpportunityType =
  | "Investidor"
  | "Edital"
  | "InovacaoAberta"
  | "Beneficio"
  | "Talento"
  | "Vaga"

export interface Opportunity {
  id: string
  title: string
  description: string | null
  type: OpportunityType
  is_paid_feature: boolean
  deadline: string | null
  created_at: string
}

export interface Partner {
  id: string
  name: string
  logo_url: string | null
  website: string | null
  created_at: string
}

export interface StoreProduct {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  external_link: string
  created_at: string
}
