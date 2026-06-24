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
import { OpportunityForm } from '@/components/admin/OpportunityForm'
import { EventForm } from '@/components/admin/EventForm'
import { BlogPostForm } from '@/components/admin/BlogPostForm'
import { PartnerForm } from '@/components/admin/PartnerForm'

interface PendingItem {
    id: string
    title: string
    itemType: string  // 'blog' | 'event' | 'opportunity' | 'partner' | 'product'
    created_at: string
}

export default function AdminPage() {
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [viewMode, setViewMode] = useState<'pending' | 'approved'>('pending')
    const [pending, setPending] = useState<{
        blog: PendingItem[]
        events: PendingItem[]
        opportunities: PendingItem[]
        partners: PendingItem[]
        products: PendingItem[]
        startups: PendingItem[]
    }>({
        blog: [], events: [], opportunities: [], partners: [], products: [], startups: [],
    })
    const [approved, setApproved] = useState<{
        blog: PendingItem[]
        events: PendingItem[]
        opportunities: PendingItem[]
        partners: PendingItem[]
        products: PendingItem[]
        startups: PendingItem[]
    }>({
        blog: [], events: [], opportunities: [], partners: [], products: [], startups: [],
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
        const supabase = createClient()

        const [blogP, eventsP, oppsP, partnersP, productsP, startupsP] = await Promise.all([
            supabase.from('blog_posts').select('id, title, created_at').eq('approved', false),
            supabase.from('events').select('id, title, created_at').eq('approved', false),
            supabase.from('opportunities').select('id, title, type, created_at').eq('approved', false),
            supabase.from('partners').select('id, name, created_at').eq('approved', false),
            supabase.from('store_products').select('id, name, created_at').eq('approved', false),
            supabase.from('startups').select('id, name, created_at').eq('approved', false),
        ])

        const [blogA, eventsA, oppsA, partnersA, productsA, startupsA] = await Promise.all([
            supabase.from('blog_posts').select('id, title, created_at').eq('approved', true),
            supabase.from('events').select('id, title, created_at').eq('approved', true),
            supabase.from('opportunities').select('id, title, type, created_at').eq('approved', true),
            supabase.from('partners').select('id, name, created_at').eq('approved', true),
            supabase.from('store_products').select('id, name, created_at').eq('approved', true),
            supabase.from('startups').select('id, name, created_at').eq('approved', true),
        ])

        const mapData = (data: any[] | null, typeStr: string, nameField: string = 'title') => 
            (data || []).map((item: any) => ({ ...item, title: item[nameField], itemType: typeStr }))

        setPending({
            blog: mapData(blogP.data, 'blog'),
            events: mapData(eventsP.data, 'event'),
            opportunities: mapData(oppsP.data, 'opportunity'),
            partners: mapData(partnersP.data, 'partner', 'name'),
            products: mapData(productsP.data, 'product', 'name'),
            startups: mapData(startupsP.data, 'startup', 'name'),
        })

        setApproved({
            blog: mapData(blogA.data, 'blog'),
            events: mapData(eventsA.data, 'event'),
            opportunities: mapData(oppsA.data, 'opportunity'),
            partners: mapData(partnersA.data, 'partner', 'name'),
            products: mapData(productsA.data, 'product', 'name'),
            startups: mapData(startupsA.data, 'startup', 'name'),
        })
    }

    async function handleApprove(id: string, table: string) {
        try {
            const { error } = await supabase
                .from(table)
                .update({ approved: true })
                .eq('id', id)

            if (error) throw error

            toast.success('Item aprovado!')
            await fetchPending()
        } catch (error) {
            toast.error('Erro ao aprovar item')
            console.error(error)
        }
    }

    async function handleReject(id: string, table: string) {
        try {
            const { error } = await supabase
                .from(table)
                .delete()
                .eq('id', id)

            if (error) throw error

            toast.success('Item rejeitado e removido')
            await fetchPending()
        } catch (error) {
            toast.error('Erro ao rejeitar item')
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

    const totalPending = Object.values(pending).reduce((acc, items) => acc + items.length, 0)
    const currentData = viewMode === 'pending' ? pending : approved

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Painel de Administração</h1>
                    <p className="text-muted-foreground">
                        {totalPending} {totalPending === 1 ? 'item pendente' : 'itens pendentes'} de aprovação
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
                        Aprovados
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="create" className="w-full">
                <div className="flex justify-center mb-6">
                    <TabsList className="flex-wrap h-auto">
                        <TabsTrigger value="create">Criar Conteúdo</TabsTrigger>
                        <TabsTrigger value="blog">
                            Blog {currentData.blog.length > 0 && <Badge className="ml-2">{currentData.blog.length}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger value="events">
                            Eventos {currentData.events.length > 0 && <Badge className="ml-2">{currentData.events.length}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger value="opportunities">
                            Oportunidades {currentData.opportunities.length > 0 && <Badge className="ml-2">{currentData.opportunities.length}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger value="partners">
                            Parceiros {currentData.partners.length > 0 && <Badge className="ml-2">{currentData.partners.length}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger value="products">
                            Produtos {currentData.products.length > 0 && <Badge className="ml-2">{currentData.products.length}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger value="startups">
                            Startups {currentData.startups.length > 0 && <Badge className="ml-2">{currentData.startups.length}</Badge>}
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="create" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <BlogPostForm onSuccess={fetchPending} />
                        <EventForm onSuccess={fetchPending} />
                        <OpportunityForm onSuccess={fetchPending} />
                        <PartnerForm onSuccess={fetchPending} />
                    </div>
                </TabsContent>

                {Object.entries(currentData).map(([key, items]) => (
                    <TabsContent key={key} value={key} className="mt-6">
                        {items.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <p className="text-muted-foreground">Nenhum item {viewMode === 'pending' ? 'pendente' : 'aprovado'}</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item: any) => (
                                    <Card key={item.id}>
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-lg">{item.title}</CardTitle>
                                                    <CardDescription>
                                                        Criado em {new Date(item.created_at).toLocaleDateString('pt-BR')}
                                                    </CardDescription>
                                                </div>
                                                {item.type && key === 'opportunities' && (
                                                    <Badge variant="secondary">{item.type}</Badge>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex gap-2 flex-wrap">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        const editRoutes: Record<string, string> = {
                                                            blog: `/admin/edit/blog/${item.id}`,
                                                            events: `/admin/edit/event/${item.id}`,
                                                            opportunities: `/admin/edit/opportunity/${item.id}`,
                                                            partners: `/admin/edit/partner/${item.id}`,
                                                            products: `/admin/edit/product/${item.id}`,
                                                            startups: `/admin/edit/startup/${item.id}`,
                                                        }
                                                        router.push(editRoutes[key] || '/')
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Editar
                                                </Button>
                                                {viewMode === 'pending' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => {
                                                            const tableMap: Record<string, string> = {
                                                                blog: 'blog_posts',
                                                                products: 'store_products',
                                                            }
                                                            const table = tableMap[key] || key
                                                            handleApprove(item.id, table)
                                                        }}
                                                    >
                                                        <Check className="h-4 w-4 mr-2" />
                                                        Aprovar
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => {
                                                        if(key === 'startups' || key === 'blog') {
                                                            // For Startups and Blog, we use their API to handle storage cascade deletion
                                                            fetch(`/api/${key === 'startups' ? 'startups' : 'admin/blog-posts'}/${item.id}`, { method: 'DELETE' })
                                                                .then(() => {
                                                                    toast.success('Excluído com sucesso')
                                                                    fetchPending()
                                                                }).catch(() => toast.error('Erro ao excluir'))
                                                        } else {
                                                            // Regular delete for other tables
                                                            const tableMap: Record<string, string> = {
                                                                blog: 'blog_posts',
                                                                products: 'store_products',
                                                            }
                                                            const table = tableMap[key] || key
                                                            handleReject(item.id, table)
                                                        }
                                                    }}
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    {viewMode === 'pending' ? 'Rejeitar' : 'Excluir'}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                ))}


            </Tabs>
        </div>
    )
}
