'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Startup, TeamMember } from '@/types/database'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, Globe, FileText, Leaf, TrendingUp, Share2, Camera, Users, Linkedin, Github, Briefcase, BookOpen, Instagram, ArrowLeft, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatCNPJ } from '@/lib/utils'
import { toast } from 'sonner'

const ESTAGIO_LABELS: Record<string, string> = {
    ideia: 'Ideação',
    validacao: 'Validação',
    mvp: 'MVP',
    tracao: 'Tração',
    escala: 'Escala',
    crescimento: 'Crescimento',
}

export default function StartupPageContent({ slug }: { slug: string }) {
    const router = useRouter()
    const [startup, setStartup] = useState<Startup | null>(null)
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (slug) {
            fetchStartup()
        }
    }, [slug])

    const fetchStartup = async () => {
        try {
            const res = await fetch(`/api/startups?slug=${slug}`)
            if (!res.ok) {
                router.push('/startups')
                return
            }
            const { data } = await res.json()
            if (data && data.length > 0) {
                setStartup(data[0])
                fetchTeamMembers(data[0].id)
            } else {
                router.push('/startups')
            }
        } catch (error) {
            console.error('Error fetching startup:', error)
            router.push('/startups')
        } finally {
            setLoading(false)
        }
    }

    const fetchTeamMembers = async (startupId: string) => {
        try {
            const res = await fetch(`/api/team-members?startupId=${startupId}`)
            if (res.ok) {
                const { data } = await res.json()
                setTeamMembers(data || [])
            }
        } catch (error) {
            console.error('Error fetching team members:', error)
        }
    }

    const handleShare = async () => {
        const url = window.location.href

        if (navigator.share) {
            try {
                await navigator.share({
                    title: startup?.name,
                    text: startup?.description || '',
                    url: url,
                })
            } catch (error) {
                // User cancelled or error
            }
        } else {
            try {
                await navigator.clipboard.writeText(url)
                setCopied(true)
                toast.success('Link copiado!')
                setTimeout(() => setCopied(false), 2000)
            } catch (error) {
                toast.error('Erro ao copiar link')
            }
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        )
    }

    if (!startup) {
        return null
    }

    return (
        <div className="min-h-screen bg-stone-50">
            <div className="bg-white border-b border-stone-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="text-stone-600 hover:text-stone-900"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Voltar
                        </Button>
                        <Button
                            onClick={handleShare}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Copiado!
                                </>
                            ) : (
                                <>
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Compartilhar
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden mb-6">
                    {/* Banner Image */}
                    {startup.banner_url ? (
                        <div className="relative h-48 w-full bg-stone-100">
                            <Image
                                src={startup.banner_url}
                                alt={`${startup.name} banner`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="h-28 w-full bg-gradient-to-r from-amber-500/20 to-orange-600/20 border-b" />
                    )}

                    <div className="p-8">
                        <div className="flex flex-col md:flex-row items-start gap-6 mb-6 -mt-16 md:-mt-20">
                            {startup.logo_url ? (
                                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-xl border-4 border-white bg-white shadow-md overflow-hidden flex-shrink-0">
                                    <Image
                                        src={startup.logo_url}
                                        alt={startup.name}
                                        fill
                                        className="object-contain p-1"
                                    />
                                </div>
                            ) : (
                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl border-4 border-white bg-gradient-to-br from-amber-400 to-orange-500 shadow-md flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                                    {startup.name.charAt(0)}
                                </div>
                            )}
                            <div className="flex-1 min-w-0 md:pt-10">
                                <h1 className="text-3xl font-bold mb-3">{startup.name}</h1>
                                {startup.cnpj && (
                                    <p className="text-sm text-stone-600 mb-4">CNPJ: {formatCNPJ(startup.cnpj)}</p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    <Badge className="bg-amber-100 text-amber-800 border border-amber-300">
                                        {startup.segmento}
                                    </Badge>
                                    <Badge className="bg-blue-100 text-blue-800 border border-blue-300">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        {ESTAGIO_LABELS[startup.estagio_maturidade] || startup.estagio_maturidade}
                                    </Badge>
                                    {startup.tem_esg && (
                                        <Badge className="bg-green-100 text-green-800 border border-green-300">
                                            <Leaf className="w-3 h-3 mr-1" />
                                            ESG
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {startup.description && (
                            <div className="border-l-4 border-amber-500 pl-4 mb-6">
                                <h2 className="font-semibold text-lg mb-2">Sobre</h2>
                                <p className="text-stone-700">{startup.description}</p>
                            </div>
                        )}

                        {startup.programas_investimentos && (
                            <div className="border-l-4 border-blue-500 pl-4 mb-6">
                                <h2 className="font-semibold text-lg mb-2">Programas e Investimentos</h2>
                                <p className="text-stone-700">{startup.programas_investimentos}</p>
                            </div>
                        )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-sm flex items-center gap-2 text-blue-900 mb-2">
                                <MapPin className="h-4 w-4" />
                                Localização
                            </h3>
                            <p className="text-blue-800">
                                {startup.cidade}, {startup.estado}
                            </p>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <h3 className="font-semibold text-sm flex items-center gap-2 text-purple-900 mb-2">
                                <Calendar className="h-4 w-4" />
                                Fundação
                            </h3>
                            <p className="text-purple-800">{startup.ano_fundacao}</p>
                        </div>
                    </div>

                    {startup.tecnologias && startup.tecnologias.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Tecnologias</h3>
                            <div className="flex flex-wrap gap-2">
                                {startup.tecnologias.map((tech) => (
                                    <Badge key={tech} variant="outline">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {startup.tem_esg && startup.detalhes_esg && (
                        <div className="mb-6">
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <Leaf className="h-5 w-5 text-green-600" />
                                Práticas ESG
                            </h3>
                            <p className="text-stone-700">{startup.detalhes_esg}</p>
                        </div>
                    )}

                    {(startup.website || startup.linkedin || startup.instagram || startup.pitch_deck_url) && (
                        <div>
                            <h3 className="font-semibold mb-3">Links</h3>
                            <div className="flex flex-wrap gap-3">
                                {startup.website && (
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                                        <Link href={startup.website} target="_blank" rel="noopener noreferrer">
                                            <Globe className="h-4 w-4 mr-2" />
                                            Website
                                        </Link>
                                    </Button>
                                )}
                                {startup.linkedin && (
                                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" asChild>
                                        <Link href={startup.linkedin} target="_blank" rel="noopener noreferrer">
                                            <Linkedin className="h-4 w-4 mr-2" />
                                            LinkedIn
                                        </Link>
                                    </Button>
                                )}
                                {startup.instagram && (
                                    <Button size="sm" className="bg-pink-600 hover:bg-pink-700 text-white" asChild>
                                        <Link href={startup.instagram} target="_blank" rel="noopener noreferrer">
                                            <Camera className="h-4 w-4 mr-2" />
                                            Instagram
                                        </Link>
                                    </Button>
                                )}
                                {startup.pitch_deck_url && (
                                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
                                        <Link href={`/api/pitch-deck/${startup.owner_id}`} target="_blank" rel="noopener noreferrer">
                                            <FileText className="h-4 w-4 mr-2" />
                                            Pitch Deck
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                </div>

                {teamMembers.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
                        <h2 className="font-semibold text-xl mb-6 flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Time
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {teamMembers.map((member) => (
                                <div key={member.id} className="bg-stone-50 border border-stone-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        {member.photo_url ? (
                                            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={member.photo_url}
                                                    alt={member.full_name}
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                                                {member.full_name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-stone-900 truncate">
                                                {member.full_name}
                                            </p>
                                            <p className="text-sm text-amber-600">{member.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {member.linkedin && (
                                            <Link href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                                <Linkedin className="h-5 w-5" />
                                            </Link>
                                        )}
                                        {member.github && (
                                            <Link href={member.github} target="_blank" rel="noopener noreferrer" className="text-stone-800 hover:text-stone-900">
                                                <Github className="h-5 w-5" />
                                            </Link>
                                        )}
                                        {member.behance && (
                                            <Link href={member.behance} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                                                <Briefcase className="h-5 w-5" />
                                            </Link>
                                        )}
                                        {member.portfolio && (
                                            <Link href={member.portfolio} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700">
                                                <Globe className="h-5 w-5" />
                                            </Link>
                                        )}
                                        {member.lattes && (
                                            <Link href={member.lattes} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700">
                                                <BookOpen className="h-5 w-5" />
                                            </Link>
                                        )}
                                        {member.instagram && (
                                            <Link href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                                                <Instagram className="h-5 w-5" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
