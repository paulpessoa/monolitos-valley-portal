'use client'

import { useEffect, useRef, useState } from 'react'
import { Startup, TeamMember } from '@/types/database'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, Globe, FileText, Leaf, TrendingUp, Users, Linkedin, Github, Briefcase, BookOpen, Instagram, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatCNPJ } from '@/lib/utils'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

interface StartupDetailsModalProps {
    startup: Startup | null
    open: boolean
    onOpenChange: (open: boolean) => void
    showTeamMembers?: boolean
    showFullPageButton?: boolean
}

const ESTAGIO_LABELS: Record<string, string> = {
    ideia: 'Ideação',
    validacao: 'Validação',
    mvp: 'MVP',
    tracao: 'Tração',
    escala: 'Escala',
    crescimento: 'Crescimento',
}

export function StartupDetailsModal({
    startup,
    open,
    onOpenChange,
    showTeamMembers = true,
    showFullPageButton = false
}: StartupDetailsModalProps) {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
    const [loadingMembers, setLoadingMembers] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        if (!open || !containerRef.current) return

        const ctx = gsap.context(() => {
            const elements = containerRef.current?.querySelectorAll('.animate-in')
            if (elements && elements.length) {
                gsap.fromTo(elements,
                    { opacity: 0, y: 24 },
                    { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out' }
                )
            }
        }, containerRef)

        return () => ctx.revert()
    }, { dependencies: [open], scope: containerRef })

    useEffect(() => {
        if (startup && open && showTeamMembers) {
            fetchTeamMembers()
        } else {
            setTeamMembers([])
        }
    }, [startup, open, showTeamMembers])

    const fetchTeamMembers = async () => {
        if (!startup) return

        setLoadingMembers(true)
        try {
            const res = await fetch(`/api/team-members?startupId=${startup.id}`)
            if (res.ok) {
                const { data } = await res.json()
                setTeamMembers(data || [])
            }
        } catch (error) {
            console.error('Error fetching team members:', error)
        } finally {
            setLoadingMembers(false)
        }
    }

    const handleOpenFullPage = () => {
        if (startup?.slug) {
            window.open(`/negocios/${startup.slug}`, '_blank')
        }
    }

    if (!startup) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
                <div ref={containerRef} className="relative">
                    {/* Banner Image */}
                    {startup.banner_url ? (
                        <div className="relative h-40 w-full bg-stone-100">
                            <Image
                                src={startup.banner_url}
                                alt={`${startup.name} banner`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="h-20 w-full bg-gradient-to-r from-amber-500/20 to-orange-600/20 border-b" />
                    )}

                    <div className="px-6 pb-6">
                        <DialogHeader className="mt-[-2.5rem] sm:mt-[-3.5rem]">
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                {/* Logo */}
                                {startup.logo_url ? (
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-[3px] border-white bg-white shadow-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={startup.logo_url}
                                            alt={startup.name}
                                            fill
                                            className="object-contain p-1.5"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-[3px] border-white bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                                        {startup.name.charAt(0)}
                                    </div>
                                )}

                                {/* Title and meta */}
                                <div className="flex-1 min-w-0 pt-2 sm:pt-10">
                                    <DialogTitle className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                                        {startup.name}
                                    </DialogTitle>
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-semibold">
                                            {startup.segmento}
                                        </Badge>
                                        <Badge className="bg-blue-100 text-blue-900 border-blue-300 font-semibold">
                                            <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                                            {ESTAGIO_LABELS[startup.estagio_maturidade] || startup.estagio_maturidade}
                                        </Badge>
                                        {startup.tem_esg && (
                                            <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold">
                                                <Leaf className="w-3.5 h-3.5 mr-1.5" />
                                                ESG
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="mt-6 space-y-6">
                            {/* Sobre */}
                            {startup.description && (
                                <section className="animate-in">
                                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">Sobre</h3>
                                    <p className="text-sm leading-relaxed text-stone-700">{startup.description}</p>
                                </section>
                            )}

                            {/* Programas e Investimentos */}
                            {startup.programas_investimentos && (
                                <section className="animate-in">
                                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">Programas e Investimentos</h3>
                                    <p className="text-sm leading-relaxed text-stone-700">{startup.programas_investimentos}</p>
                                </section>
                            )}

                            {/* Meta / Localização / Fundação */}
                            <section className="animate-in">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                                        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Localização</h3>
                                        <p className="text-sm font-semibold text-stone-900">{startup.cidade}, {startup.estado}</p>
                                    </div>
                                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                                        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Fundação</h3>
                                        <p className="text-sm font-semibold text-stone-900">{startup.ano_fundacao}</p>
                                    </div>
                                    {startup.cnpj && startup.cnpj.replace(/\D/g, '') !== '00000000000000' && startup.cnpj.trim() !== '' && (
                                        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                                            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">CNPJ</h3>
                                            <p className="text-sm font-semibold text-stone-900">{formatCNPJ(startup.cnpj)}</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Tecnologias */}
                            {startup.tecnologias && startup.tecnologias.length > 0 && (
                                <section className="animate-in">
                                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">Tecnologias</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {startup.tecnologias.map((tech) => (
                                            <Badge key={tech} variant="outline" className="text-xs font-medium">
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* ESG */}
                            {startup.tem_esg && startup.detalhes_esg && (
                                <section className="animate-in">
                                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Leaf className="h-4 w-4 text-emerald-600" />
                                        Práticas ESG
                                    </h3>
                                    <p className="text-sm leading-relaxed text-stone-700">{startup.detalhes_esg}</p>
                                </section>
                            )}

                            {/* Links */}
                            {(startup.website || startup.linkedin || startup.instagram || startup.pitch_deck_url) && (
                                <section className="animate-in">
                                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">Links</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {startup.website && (
                                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full" asChild>
                                                <Link href={startup.website} target="_blank" rel="noopener noreferrer">
                                                    <Globe className="h-4 w-4 mr-2" />
                                                    Website
                                                </Link>
                                            </Button>
                                        )}
                                        {startup.linkedin && (
                                            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full" asChild>
                                                <Link href={startup.linkedin} target="_blank" rel="noopener noreferrer">
                                                    <Linkedin className="h-4 w-4 mr-2" />
                                                    LinkedIn
                                                </Link>
                                            </Button>
                                        )}
                                        {startup.instagram && (
                                            <Button size="sm" className="bg-pink-600 hover:bg-pink-700 text-white rounded-full" asChild>
                                                <Link href={startup.instagram} target="_blank" rel="noopener noreferrer">
                                                    <Instagram className="h-4 w-4 mr-2" />
                                                    Instagram
                                                </Link>
                                            </Button>
                                        )}
                                        {startup.pitch_deck_url && (
                                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white rounded-full" asChild>
                                                <Link href={`/api/pitch-deck/${startup.owner_id}`} target="_blank" rel="noopener noreferrer">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Pitch Deck
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* Full Page Button */}
                            {showFullPageButton && startup?.slug && (
                                <div className="animate-in pt-2">
                                    <Button
                                        onClick={handleOpenFullPage}
                                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                                        size="lg"
                                    >
                                        <ExternalLink className="h-5 w-5 mr-2" />
                                        Explorar Startup Completa
                                    </Button>
                                </div>
                            )}

                            {/* Team Members */}
                            {showTeamMembers && (
                                <section className="animate-in">
                                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Time
                                    </h3>
                                    {loadingMembers ? (
                                        <p className="text-sm text-stone-500">Carregando time...</p>
                                    ) : teamMembers.length === 0 ? (
                                        <p className="text-sm text-stone-500">Nenhum membro cadastrado.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {teamMembers.map((member) => (
                                                <div key={member.id} className="bg-white border border-stone-200 rounded-xl p-4">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        {member.photo_url ? (
                                                            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-stone-200">
                                                                <Image
                                                                    src={member.photo_url}
                                                                    alt={member.full_name}
                                                                    width={40}
                                                                    height={40}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                                                {member.full_name.charAt(0)}
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-stone-900 truncate">
                                                                {member.full_name}
                                                            </p>
                                                            <p className="text-xs text-amber-700 font-medium">{member.role}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {member.linkedin && (
                                                            <Link href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                                                <Linkedin className="h-4 w-4" />
                                                            </Link>
                                                        )}
                                                        {member.github && (
                                                            <Link href={member.github} target="_blank" rel="noopener noreferrer" className="text-stone-800 hover:text-stone-900">
                                                                <Github className="h-4 w-4" />
                                                            </Link>
                                                        )}
                                                        {member.behance && (
                                                            <Link href={member.behance} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                                                                <Briefcase className="h-4 w-4" />
                                                            </Link>
                                                        )}
                                                        {member.portfolio && (
                                                            <Link href={member.portfolio} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700">
                                                                <Globe className="h-4 w-4" />
                                                            </Link>
                                                        )}
                                                        {member.lattes && (
                                                            <Link href={member.lattes} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700">
                                                                <BookOpen className="h-4 w-4" />
                                                            </Link>
                                                        )}
                                                        {member.instagram && (
                                                            <Link href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                                                                <Instagram className="h-4 w-4" />
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
