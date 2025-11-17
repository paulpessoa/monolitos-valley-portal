'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function OpportunityForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        deadline: '',
    })
    const supabase = createClient()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Usuário não autenticado')

            const { error } = await supabase.from('opportunities').insert({
                title: formData.title,
                description: formData.description,
                category: formData.category,
                deadline: formData.deadline,
                created_by: user.id,
                approved: false,
            })

            if (error) throw error

            toast.success('Oportunidade criada com sucesso!')
            setFormData({ title: '', description: '', category: '', deadline: '' })
            onSuccess()
        } catch (error) {
            toast.error('Erro ao criar oportunidade')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Adicionar Oportunidade</CardTitle>
                <CardDescription>Crie uma nova oportunidade para a comunidade</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Título da oportunidade"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <Textarea
                        placeholder="Descrição detalhada"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        rows={4}
                    />
                    <Input
                        placeholder="Categoria (ex: Investimento, Mentoria, Parceria)"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                    />
                    <Input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        required
                    />
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Criar Oportunidade
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
