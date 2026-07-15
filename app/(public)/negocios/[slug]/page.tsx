import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import StartupPageContent from './StartupPageContent'

type Props = {
    params: Promise<{ slug: string }>
}

function JsonLd({ startup }: { startup: { name: string; description: string | null; logo_url: string | null; segmento: string | null; cidade: string | null; estado: string | null; website: string | null; linkedin: string | null } }) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: startup.name,
        description: startup.description || undefined,
        image: startup.logo_url || undefined,
        address: {
            '@type': 'PostalAddress',
            addressLocality: startup.cidade || undefined,
            addressRegion: startup.estado || undefined,
        },
        url: startup.website || undefined,
        sameAs: [startup.linkedin, startup.website].filter(Boolean),
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const supabase = await createClient()

    const { data: startup } = await supabase
        .from('startups')
        .select('name, description, logo_url, segmento, cidade, estado, website, linkedin')
        .eq('slug', slug)
        .single()

    if (!startup) {
        return {
            title: 'Startup não encontrada | Monólitos Valley',
        }
    }

    const title = `${startup.name} | Monólitos Valley`
    const description = startup.description || `Conheça ${startup.name}, startup de ${startup.segmento}`
    const imageUrl = startup.logo_url || 'https://monolitos-valley-portal.vercel.app/monolitos-valley-logo-title.svg'

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: startup.name,
                },
            ],
            type: 'website',
            siteName: 'Monólitos Valley',
            locale: 'pt_BR',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/negocios/${slug}`,
        },
    }
}

export default async function StartupPage({ params }: Props) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: startup } = await supabase
        .from('startups')
        .select('name, description, logo_url, segmento, cidade, estado, website, linkedin')
        .eq('slug', slug)
        .single()

    return (
        <>
            {startup && <JsonLd startup={startup} />}
            <StartupPageContent slug={slug} />
        </>
    )
}
