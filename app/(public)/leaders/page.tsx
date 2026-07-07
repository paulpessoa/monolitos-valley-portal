'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
    Users, Linkedin, Instagram, Sparkles, MapPin, 
    ArrowUpRight, Loader2, Award 
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Leader {
    id: string
    full_name: string
    role_title: string
    startup_name: string | null
    linkedin_url: string | null
    instagram_url: string | null
}

export default function PublicLeadersPage() {
    const [leaders, setLeaders] = useState<Leader[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchLeaders() {
            try {
                const { data, error } = await supabase
                    .from('community_leaders')
                    .select('*')
                    .order('full_name', { ascending: true })

                if (!error && data) {
                    setLeaders(data)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchLeaders()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500 mb-2" />
                <p className="text-muted-foreground text-sm">Carregando lideranças da comunidade...</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                <Badge className="bg-amber-100 text-amber-800 border border-amber-300 font-semibold px-3 py-1 text-xs rounded-full">
                    ⭐ Time de Guardiões
                </Badge>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-stone-900">
                    Lideranças da Comunidade
                </h1>
                <p className="text-lg text-stone-600">
                    Conheça os voluntários que lideram iniciativas, apoiam startups locais e ajudam a impulsionar o ecossistema do Sertão Central.
                </p>
            </div>

            {leaders.length === 0 ? (
                <Card className="max-w-md mx-auto">
                    <CardContent className="py-12 text-center">
                        <Users className="h-12 w-12 text-stone-400 mx-auto mb-3 opacity-60" />
                        <p className="text-stone-500 font-medium">Nenhum líder cadastrado publicamente ainda.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {leaders.map(leader => (
                        <Card key={leader.id} className="relative group overflow-hidden border border-stone-200/80 bg-white hover:shadow-xl hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between">
                            {/* Decorative badge header */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-orange-500" />
                            
                            <CardHeader className="pt-6 pb-2">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-600 font-bold border border-amber-200 shadow-sm text-lg">
                                        {leader.full_name.charAt(0)}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {leader.linkedin_url && (
                                            <Link 
                                                href={leader.linkedin_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-stone-400 hover:text-blue-600 transition-colors p-1"
                                                title="LinkedIn"
                                            >
                                                <Linkedin className="h-4 w-4" />
                                            </Link>
                                        )}
                                        {leader.instagram_url && (
                                            <Link 
                                                href={leader.instagram_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-stone-400 hover:text-pink-600 transition-colors p-1"
                                                title="Instagram"
                                            >
                                                <Instagram className="h-4 w-4" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg text-stone-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                                        {leader.full_name}
                                    </h3>
                                    <p className="text-xs font-semibold text-stone-500 tracking-wide uppercase">
                                        {leader.role_title}
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-6 pt-2 space-y-4 flex-grow flex flex-col justify-end">
                                {leader.startup_name && (
                                    <div className="bg-stone-50 border border-stone-200/50 rounded-lg p-2.5 flex items-center justify-between hover:bg-amber-50/20 transition-colors">
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Startup Ativa</p>
                                            <p className="text-xs font-bold text-stone-800">{leader.startup_name}</p>
                                        </div>
                                        <Award className="h-4 w-4 text-amber-500" />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
