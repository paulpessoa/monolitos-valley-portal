'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function BlogPostForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        image_url: '',
    })
    const supabase = createClient()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Usuário não autenticado')

            const { error } = await supabase.from('blog_posts').insert({
                title: formData.title,
                slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
                content: formData.content,
                excerpt: formData.excerpt,
                image_url: formData.image_url,
                author_id: user.id,
                approved: false,
            })

            if (error) throw error

            toast.success('Post criado com sucesso!')
            setFormData({ title: '', slug: '', content: '', excerpt: '', image_url: '' })
            onSuccess()
        } catch (error) {
            toast.error('Erro ao criar post')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Adicionar Post</CardTitle>
                <CardDescription>Crie um novo post para o blog</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Título do post"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <Input
                        placeholder="Slug (deixe em branco para gerar automaticamente)"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                    <Textarea
                        placeholder="Resumo do post"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        required
                        rows={2}
                    />
                    <Textarea
                        placeholder="Conteúdo do post"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        required
                        rows={6}
                    />
                    <Input
                        placeholder="URL da imagem de capa"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    />
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Criar Post
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
