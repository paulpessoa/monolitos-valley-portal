'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { StartupForm } from '@/components/features/startups/StartupForm'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Startup } from '@/types/database'
import React from 'react'

export default function EditStartupPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = React.use(params)
    const [startup, setStartup] = useState<Startup | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function fetchStartup() {
            try {
                // Verify admin
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    router.push('/login')
                    return
                }

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                if (profile?.role !== 'admin') {
                    router.push('/')
                    toast.error('Acesso negado')
                    return
                }

                // Fetch startup
                const res = await fetch(`/api/startups/${unwrappedParams.id}`)
                if (!res.ok) throw new Error('Startup não encontrada')
                
                const { data } = await res.json()
                setStartup(data)
            } catch (error) {
                console.error(error)
                toast.error('Erro ao carregar startup')
                router.push('/admin')
            } finally {
                setLoading(false)
            }
        }

        fetchStartup()
    }, [unwrappedParams.id, router, supabase])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!startup) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-muted-foreground">Startup não encontrada</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Editar Startup</h1>
                <p className="text-muted-foreground">Administração: Editando o cadastro de {startup.name}</p>
            </div>

            <div className="bg-card border rounded-xl p-6">
                <StartupForm 
                    startup={startup} 
                    isAdminEdit={true} 
                    onSuccess={() => {
                        router.push('/admin')
                    }} 
                />
            </div>
        </div>
    )
}
