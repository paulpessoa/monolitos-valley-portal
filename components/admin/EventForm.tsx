'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function EventForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        image_url: '',
    })
    const supabase = createClient()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Usuário não autenticado')

            const { error } = await supabase.from('events').insert({
                title: formData.title,
                description: formData.description,
                date: formData.date,
                time: formData.time,
                location: formData.location,
                image_url: formData.image_url,
                created_by: user.id,
                approved: false,
            })

            if (error) throw error

            toast.success('Evento criado com sucesso!')
            setFormData({ title: '', description: '', date: '', time: '', location: '', image_url: '' })
            onSuccess()
        } catch (error) {
            toast.error('Erro ao criar evento')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Adicionar Evento</CardTitle>
                <CardDescription>Crie um novo evento para a comunidade</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Título do evento"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <Textarea
                        placeholder="Descrição do evento"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        rows={4}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                        <Input
                            type="time"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            required
                        />
                    </div>
                    <Input
                        placeholder="Local do evento"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                    />
                    <Input
                        placeholder="URL da imagem"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    />
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Criar Evento
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
