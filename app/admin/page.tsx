'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Loader2, Check, X, Edit } from 'lucide-react'
import { toast } from 'sonner'
import { AnimateOnScroll } from '@/components/features/home/AnimateOnScroll'
import { AdminLeaders } from '@/components/admin/AdminLeaders'

interface PendingItem {
    id: string
    title: string
    created_at: string
}

export default function AdminPage() {
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [viewMode, setViewMode] = useState<'pending' | 'approved'>('pending')
    const [startups, setStartups] = useState<{
        pending: PendingItem[]
        approved: PendingItem[]
    }>({
        pending: [],
        approved: [],
    })
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        checkAdmin()
    }, [])

    async function checkAdmin() {
        try {
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

            setIsAdmin(true)
            await fetchPending()
        } catch (error) {
            console.error('Error checking admin:', error)
            router.push('/')
        } finally {
            setLoading(false)
        }
    }

    async function fetchPending() {
        const [pendingRes, approvedRes] = await Promise.all([
            supabase.from('startups').select('id, name, created_at').eq('approved', false),
            supabase.from('startups').select('id, name, created_at').eq('approved', true),
        ])

        if (pendingRes.error) {
            toast.error('Erro ao buscar startups pendentes')
            console.error(pendingRes.error)
            return
        }

        if (approvedRes.error) {
            toast.error('Erro ao buscar startups aprovadas')
            console.error(approvedRes.error)
            return
        }

        setStartups({
            pending: (pendingRes.data || []).map(item => ({ ...item, title: item.name })),
            approved: (approvedRes.data || []).map(item => ({ ...item, title: item.name })),
        })
    }

    async function handleApprove(id: string) {
        try {
            const { error } = await supabase
                .from('startups')
                .update({ approved: true })
                .eq('id', id)

            if (error) throw error

            toast.success('Startup aprovada!')
            await fetchPending()
        } catch (error) {
            toast.error('Erro ao aprovar startup')
            console.error(error)
        }
    }

    async function handleReject(id: string) {
        try {
            const { error } = await supabase
                .from('startups')
                .delete()
                .eq('id', id)

            if (error) throw error

            toast.success('Startup rejeitada e removida')
            await fetchPending()
        } catch (error) {
            toast.error('Erro ao rejeitar startup')
            console.error(error)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        )
    }

    if (!isAdmin) return null

    const currentData = viewMode === 'pending' ? startups.pending : startups.approved

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Painel de Administração</h1>
                    <p className="text-muted-foreground">
                        {startups.pending.length} {startups.pending.length === 1 ? 'startup pendente' : 'startups pendentes'} de aprovação
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={viewMode === 'pending' ? 'default' : 'outline'}
                        onClick={() => setViewMode('pending')}
                    >
                        Pendentes
                    </Button>
                    <Button
                        variant={viewMode === 'approved' ? 'default' : 'outline'}
                        onClick={() => setViewMode('approved')}
                    >
                        Aprovadas
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="startups" className="w-full">
                <AnimateOnScroll>
                    <div className="flex justify-center mb-6">
                        <TabsList className="flex-wrap h-auto">
                            <TabsTrigger value="startups">
                                Startups {currentData.length > 0 && <Badge className="ml-2">{currentData.length}</Badge>}
                            </TabsTrigger>
                            <TabsTrigger value="leaders">Lideranças</TabsTrigger>
                        </TabsList>
                    </div>
                </AnimateOnScroll>

                <TabsContent value="startups" className="mt-6">
                    {currentData.length === 0 ? (
                        <AnimateOnScroll>
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <p className="text-muted-foreground">Nenhuma startup {viewMode === 'pending' ? 'pendente' : 'aprovada'}</p>
                                </CardContent>
                            </Card>
                        </AnimateOnScroll>
                    ) : (
                        <div className="space-y-4">
                            {currentData.map((item: PendingItem) => (
                                <AnimateOnScroll key={item.id}>
                                    <Card>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">{item.title}</CardTitle>
                                                <CardDescription>
                                                    Criado em {new Date(item.created_at).toLocaleDateString('pt-BR')}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-2 flex-wrap">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    router.push(`/admin/edit/startup/${item.id}`)
                                                }}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Editar
                                            </Button>
                                            {viewMode === 'pending' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleApprove(item.id)}
                                                >
                                                    <Check className="h-4 w-4 mr-2" />
                                                    Aprovar
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleReject(item.id)}
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                {viewMode === 'pending' ? 'Rejeitar' : 'Excluir'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </AnimateOnScroll>
                        ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="leaders" className="mt-6">
                    <AdminLeaders />
                </TabsContent>
            </Tabs>
        </div>
    )
}
