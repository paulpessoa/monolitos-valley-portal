'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function PartnerForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        website: '',
        logo_url: '',
        category: '',
    })
    const supabase = createClient()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Usuário não autenticado')

            const { error } = await supabase.from('partners').insert({
                name: formData.name,
                description: formData.description,
                website: formData.website,
                logo_url: formData.logo_url,
                category: formData.category,
                created_by: user.id,
                approved: false,
            })

            if (error) throw error

            toast.success('Parceiro criado com sucesso!')
            setFormData({ name: '', description: '', website: '', logo_url: '', category: '' })
            onSuccess()
        } catch (error) {
            toast.error('Erro ao criar parceiro')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Adicionar Parceiro</CardTitle>
                <CardDescription>Crie um novo parceiro para a comunidade</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Nome do parceiro"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Textarea
                        placeholder="Descrição do parceiro"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        rows={3}
                    />
                    <Input
                        placeholder="Categoria (ex: Tecnologia, Consultoria, Investimento)"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                    />
                    <Input
                        placeholder="Website"
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                    <Input
                        placeholder="URL do logo"
                        value={formData.logo_url}
                        onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    />
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Criar Parceiro
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
