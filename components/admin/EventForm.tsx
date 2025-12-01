'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/supabase/storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

export function EventForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_datetime: '',
        duration_minutes: '120',
        location: '',
        image_url: '',
    })
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const url = await uploadImage(file, 'events', 'images')
            setFormData({ ...formData, image_url: url })
            toast.success('Imagem enviada com sucesso!')
        } catch (error) {
            toast.error('Erro ao enviar imagem')
            console.error(error)
        } finally {
            setUploading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Usuário não autenticado')

            // Converter para ISO timestamp completo (com data e hora)
            const datetime = new Date(formData.event_datetime)
            const isoDate = datetime.toISOString() // Formato completo: 2025-12-03T19:00:00.000Z

            const eventData: any = {
                title: formData.title,
                description: formData.description,
                event_date: isoDate, // Data e hora completas
                location: formData.location,
                created_by: user.id,
                approved: false,
            }

            // Adicionar image_url apenas se existir
            if (formData.image_url) {
                eventData.image_url = formData.image_url
            }

            console.log('📤 Enviando evento:', eventData)

            const { error } = await supabase.from('events').insert(eventData)

            if (error) throw error

            toast.success('Evento criado com sucesso!')
            setFormData({ title: '', description: '', event_datetime: '', duration_minutes: '120', location: '', image_url: '' })
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
                    <div>
                        <label className="text-sm font-medium">Data e Hora do Evento</label>
                        <Input
                            type="datetime-local"
                            value={formData.event_datetime}
                            onChange={(e) => setFormData({ ...formData, event_datetime: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Duração (minutos)</label>
                        <Input
                            type="number"
                            min="30"
                            max="480"
                            value={formData.duration_minutes}
                            onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                            required
                        />
                    </div>
                    <Input
                        placeholder="Local do evento"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Imagem do evento</label>
                        <div className="flex gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                {uploading ? 'Enviando...' : 'Selecionar imagem'}
                            </Button>
                            {formData.image_url && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setFormData({ ...formData, image_url: '' })}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        {formData.image_url && (
                            <p className="text-xs text-muted-foreground truncate">
                                ✓ Imagem selecionada
                            </p>
                        )}
                    </div>

                    <Button type="submit" disabled={loading || uploading} className="w-full">
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Criar Evento
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
