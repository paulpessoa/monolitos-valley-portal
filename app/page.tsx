import { StartupHighlightList } from '@/components/features/home/StartupHighlightList'
import { HeroSection } from '@/components/features/home/HeroSection'
import { AnimateOnScroll } from '@/components/features/home/AnimateOnScroll'
import { Rocket, Users, Target, TrendingUp, Award } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import partnersData from '@/data/partners.json'
import type { Partner } from '@/types/database'

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

export default async function HomePage() {
  const startups = await getStartups()

  const stats = [
    { value: '50+', label: 'Startups Ativas' },
    { value: '200+', label: 'Membros' },
    { value: '30+', label: 'Eventos/Ano' },
  ]

  const benefits = [
    {
      icon: Users,
      title: 'Networking Qualificado',
      description: 'Conecte-se com empreendedores, investidores e mentores do ecossistema de inovação do Ceará',
    },
    {
      icon: Rocket,
      title: 'Startups Inovadoras',
      description: 'Conheça e colabore com startups que estão transformando o mercado regional e nacional',
    },
    {
      icon: Users,
      title: 'Comunidade Ativa',
      description: 'Faça parte de uma comunidade vibrante com eventos, workshops e oportunidades de colaboração',
    },
    {
      icon: Target,
      title: 'Eventos Exclusivos',
      description: 'Participe de meetups, palestras e hackathons com grandes nomes do empreendedorismo',
    },
    {
      icon: TrendingUp,
      title: 'Crescimento Acelerado',
      description: 'Acesso a mentorias, programas de aceleração e recursos para escalar seu negócio',
    },
    {
      icon: Award,
      title: 'Oportunidades Reais',
      description: 'Vagas de emprego, parcerias estratégicas e possibilidades de investimento',
    },
  ]

  return (
    <div className="flex flex-col bg-stone-100">
      {/* Hero Section */}
      <HeroSection
        subtitle="Conectando startups inovadoras, talentos e investidores no coração do Ceará. Transforme sua ideia em realidade."
        cta={{
          text: 'Entrar na Comunidade',
          href: process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || '#',
        }}
        stats={stats}
      />

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-900 mb-4">
              Por que fazer parte da Monólitos Valley?
            </h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              A comunidade de startups do Sertão Central oferece tudo que você precisa para transformar sua ideia em um negócio de sucesso
            </p>
          </div>

          <AnimateOnScroll className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <div
                  key={idx}
                  className="bg-stone-100 border-2 border-stone-200 rounded-lg p-8 hover:border-amber-500 hover:shadow-lg transition-all duration-300"
                >
                  <div className="bg-gradient-to-br from-amber-400 to-orange-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-900 mb-3">{benefit.title}</h3>
                  <p className="text-stone-600">{benefit.description}</p>
                </div>
              )
            })}
          </AnimateOnScroll>
        </div>
      </section>

      {/* Startups Section */}
      {startups.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">Startups em Destaque</h2>
                  <p className="text-stone-600">Conheça as startups inovadoras que estão transformando o Sertão Central</p>
                </div>
                <Link href="/negocios" className="text-[#F2CB05] hover:text-[#d4b304] font-semibold text-sm border border-[#F2CB05] px-4 py-2 rounded-lg hover:bg-[#F2CB05]/10 transition-colors w-fit">
                  Ver todas →
                </Link>
              </div>
            </div>
            <AnimateOnScroll>
              <StartupHighlightList startups={startups} />
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* Partners Section */}
      {partnersData.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-stone-900 text-center mb-12">Nossos Parceiros</h2>
            <AnimateOnScroll className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
              {partnersData.map((partner: Partner) => (
                <a
                  key={partner.id}
                  href={partner.website || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-4 hover:opacity-80 transition-opacity"
                >
                  {partner.image_url ? (
                    <Image
                      src={partner.image_url}
                      alt={partner.name}
                      width={140}
                      height={70}
                      className="object-contain max-h-16"
                    />
                  ) : (
                    <span className="text-sm font-medium text-stone-700 text-center">{partner.name}</span>
                  )}
                </a>
              ))}
            </AnimateOnScroll>
          </div>
        </section>
      )}
    </div>
  )
}
