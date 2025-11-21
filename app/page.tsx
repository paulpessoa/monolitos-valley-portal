import { EventCarousel } from '@/components/features/events/EventCarousel'
import { StartupGrid } from '@/components/features/startups/StartupGrid'
import { HeroSection } from '@/components/features/home/HeroSection'
import { MagicLinkCTA } from '@/components/features/home/MagicLinkCTA'
import { FAQ } from '@/components/features/home/FAQ'
import { Testimonials } from '@/components/features/home/Testimonials'
import { Rocket, Users, Target, TrendingUp, Award } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

async function getEvents() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/events?limit=3`, {
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
  const [events, startups, partners] = await Promise.all([
    getEvents(),
    getStartups(),
    getPartners(),
  ])

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

  const faqItems = [
    {
      id: 'faq-1',
      question: 'Como faço para entrar na comunidade?',
      answer: 'É simples! Basta fornecer seu e-mail e você receberá um link mágico para acessar a plataforma. Não precisa de senha, apenas clique no link que enviamos.',
    },
    {
      id: 'faq-2',
      question: 'Preciso ter uma startup para participar?',
      answer: 'Não necessariamente! Aceitamos founders, investidores, mentores, desenvolvedores e profissionais que querem contribuir com o ecossistema de inovação.',
    },
    {
      id: 'faq-3',
      question: 'Qual o custo para participar?',
      answer: 'A comunidade é gratuita! Você tem acesso a todos os eventos, networking e oportunidades. Algumas funcionalidades premium podem ter custo adicional.',
    },
    {
      id: 'faq-4',
      question: 'Quais são os benefícios imediatos?',
      answer: 'Acesso a uma rede de 200+ empreendedores, eventos exclusivos, oportunidades de investimento, parcerias estratégicas e mentorias com especialistas.',
    },
    {
      id: 'faq-5',
      question: 'Como funciona o processo de seleção?',
      answer: 'Não há processo de seleção rigoroso. Queremos incluir todos que estejam genuinamente interessados em inovação e empreendedorismo.',
    },
    {
      id: 'faq-6',
      question: 'Posso trazer minha equipe?',
      answer: 'Sim! Encorajamos que você traga sua equipe. Quanto mais pessoas engajadas, melhor para toda a comunidade.',
    },
  ]

  const testimonials = [
    {
      id: 'test-1',
      name: 'Pedro Daniel',
      role: 'Designer',
      company: 'Dan Design Studio',
      content: 'Uma Experiência única, fazer parte de tudo isso é algo tão lindo, se sentir parte de algo tão grandioso assim, faz meus olhos brilharem ❤️',
      rating: 5,
      avatar: 'https://pedrodaniel.my.canva.site/_assets/media/1e769daa2e635bb6cf51369531f14706.jpg'
    },
    {
      id: 'test-2',
      name: 'Ana Paula Silva',
      role: 'Fundadora',
      company: 'EduConnect',
      content: 'Encontrei aqui uma comunidade que realmente entende os desafios de empreender no interior. Os eventos são incríveis e as conexões são reais.',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/women/38.jpg'
    },
    {
      id: 'test-3',
      name: 'Rafael Costa',
      role: 'Investidor',
      company: 'Anjo Investidor',
      content: 'A qualidade das startups que encontro na Monólitos Valley é excepcional. É um ecossistema que está crescendo rapidamente e gerando ótimas oportunidades.',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/13.jpg'
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
              Por que fazer parte da <span className="text-amber-600">Monólitos Valley?</span>
            </h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              A comunidade de startups do Sertão Central oferece tudo que você precisa para transformar sua ideia em um negócio de sucesso
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          </div>
        </div>
      </section>

      {/* Events Section */}
      {events.length > 0 && (
        <section className="py-20 bg-stone-100">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">Próximos Eventos</h2>
                  <p className="text-stone-600">Participe dos nossos eventos e expanda sua rede de contatos</p>
                </div>
                <Link href="/events" className="text-amber-600 hover:text-amber-700 font-semibold text-sm border border-amber-500 px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors w-fit">
                  Ver todos →
                </Link>
              </div>
            </div>
            <EventCarousel events={events} />
          </div>
        </section>
      )}

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
                <Link href="/startups" className="text-amber-600 hover:text-amber-700 font-semibold text-sm border border-amber-500 px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors w-fit">
                  Ver todas →
                </Link>
              </div>
            </div>
            <StartupGrid startups={startups} />
          </div>
        </section>
      )}



      {/* Testimonials Section */}
      <Testimonials testimonials={testimonials} />

      {/* Partners Section */}
      {(() => {
        console.log('🔍 Partners array completo:', partners)
        console.log('🔍 Total de parceiros:', partners.length)
        return null
      })()}
      {partners.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-stone-900 text-center mb-12">Nossos Parceiros</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
              {partners.map((partner: any) => (
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
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <FAQ items={faqItems} />

      {/* CTA Final Section */}
      {/* <section id="cta" className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 py-20 md:py-28">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 300">
            <defs>
              <pattern id="grid-cta" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="1200" height="300" fill="url(#grid-cta)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <MagicLinkCTA
            title="Pronto para transformar sua startup?"
            description="Junte-se a dezenas de empreenderoes e ajude a construir o futuro do Sertão Central Cearense hoje mesmo."
          />
        </div>
      </section> */}
    </div>
  )
}
