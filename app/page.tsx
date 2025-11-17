import { EventCarousel } from '@/components/features/events/EventCarousel'
import { StartupGrid } from '@/components/features/startups/StartupGrid'
import { BlogGrid } from '@/components/features/blog/BlogGrid'
import { OpportunityTabs } from '@/components/features/opportunities/OpportunityTabs'
import { Button } from '@/components/ui/button'
import { MessageCircle, Rocket, Users, Target, TrendingUp, Award } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

async function getEvents() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/events?limit=5`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.data || []
  } catch {
    return []
  }
}

async function getStartups() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/startups?limit=6`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.data || []
  } catch {
    return []
  }
}

async function getBlogPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog-posts?limit=3`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.data || []
  } catch {
    return []
  }
}

async function getOpportunities() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/opportunities`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.data || []
  } catch {
    return []
  }
}

async function getPartners() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/partners`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.data || []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [events, startups, blogPosts, opportunities, partners] = await Promise.all([
    getEvents(),
    getStartups(),
    getBlogPosts(),
    getOpportunities(),
    getPartners(),
  ])

  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || '#'

  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bem-vindo à Monólitos Valley
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Comunidade de Startups do Sertão Central Cearense
            </p>
            <Button size="lg" asChild className="bg-background text-foreground hover:bg-background/90">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                Junte-se à Comunidade
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Sobre a Comunidade */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Sobre a Comunidade</h2>
            <p className="text-lg text-muted-foreground mb-8">
              A Monólitos Valley é uma comunidade vibrante que conecta startups, investidores,
              talentos e parceiros no Sertão Central Cearense. Nosso objetivo é fortalecer o
              ecossistema de inovação regional, promovendo colaboração, conhecimento e
              oportunidades de crescimento.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="flex flex-col items-center">
                <Rocket className="w-12 h-12 mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Startups Inovadoras</h3>
                <p className="text-sm text-muted-foreground">
                  Conecte-se com startups que estão transformando o sertão
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="w-12 h-12 mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Networking</h3>
                <p className="text-sm text-muted-foreground">
                  Amplie sua rede de contatos no ecossistema
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Target className="w-12 h-12 mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Oportunidades</h3>
                <p className="text-sm text-muted-foreground">
                  Acesse editais, investimentos e vagas exclusivas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Próximos Eventos */}
      {events.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Próximos Eventos</h2>
              <Button variant="outline" asChild>
                <Link href="/events">Ver todos</Link>
              </Button>
            </div>
            <EventCarousel events={events} />
          </div>
        </section>
      )}

      {/* Startups em Destaque */}
      {startups.length > 0 && (
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Startups em Destaque</h2>
              <Button variant="outline" asChild>
                <Link href="/startups">Ver todas</Link>
              </Button>
            </div>
            <StartupGrid startups={startups} />
          </div>
        </section>
      )}

      {/* Blog Posts Recentes */}
      {blogPosts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Últimas do Blog</h2>
              <Button variant="outline" asChild>
                <Link href="/blog">Ver todos</Link>
              </Button>
            </div>
            <BlogGrid posts={blogPosts} />
          </div>
        </section>
      )}

      {/* Parceiros */}
      {partners.length > 0 && (
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nossos Parceiros</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
              {partners.map((partner: any) => (
                <a
                  key={partner.id}
                  href={partner.website || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-4 bg-background rounded-lg hover:shadow-lg transition-shadow"
                >
                  {partner.logo_url ? (
                    <Image
                      src={partner.logo_url}
                      alt={partner.name}
                      width={120}
                      height={60}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-sm font-medium">{partner.name}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Oportunidades */}
      {opportunities.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Oportunidades</h2>
            <OpportunityTabs opportunities={opportunities} isAuthenticated={false} />
          </div>
        </section>
      )}

      {/* Benefícios da Comunidade */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Benefícios da Comunidade</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg">
              <TrendingUp className="w-10 h-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Crescimento Acelerado</h3>
              <p className="text-muted-foreground">
                Acesse mentorias, workshops e recursos para acelerar o crescimento da sua startup
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <Users className="w-10 h-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Networking Qualificado</h3>
              <p className="text-muted-foreground">
                Conecte-se com investidores, mentores e outros empreendedores do ecossistema
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <Award className="w-10 h-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Visibilidade</h3>
              <p className="text-muted-foreground">
                Ganhe destaque no ecossistema regional e atraia investimentos e talentos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para fazer parte da transformação?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se à comunidade e ajude a construir o futuro do Sertão Central
          </p>
          <Button size="lg" asChild className="bg-background text-foreground hover:bg-background/90">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 mr-2" />
              Entrar no WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}
