'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/supabase/storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Loader2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

export function BlogPostForm({ onSuccess, initialData }: { onSuccess: () => void, initialData?: any }) {
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        content: initialData?.content || '',
        excerpt: initialData?.excerpt || '',
        image_url: initialData?.image_url || '',
    })
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const url = await uploadImage(file, 'blog', 'images')
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

            if (initialData?.id) {
                // Update existing post
                const res = await fetch(`/api/admin/blog-posts/${initialData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                })

                if (!res.ok) throw new Error('Erro ao atualizar post')
                toast.success('Post atualizado com sucesso!')
            } else {
                // Create new post
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
            }
            onSuccess()
        } catch (error) {
            toast.error('Erro ao criar post')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete() {
        setDeleting(true)
        try {
            const res = await fetch(`/api/admin/blog-posts/${initialData.id}`, {
                method: 'DELETE'
            })

            if (!res.ok) throw new Error('Erro ao excluir post')

            toast.success('Post excluído com sucesso!')
            if (typeof window !== 'undefined') {
                window.location.href = '/admin'
            } else {
                onSuccess()
            }
        } catch (error) {
            toast.error('Erro ao excluir post')
            console.error(error)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{initialData ? 'Editar Post' : 'Adicionar Post'}</CardTitle>
                <CardDescription>{initialData ? 'Edite as informações do post' : 'Crie um novo post para o blog'}</CardDescription>
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

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Imagem de capa</label>
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

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                        <Button type="submit" disabled={loading || uploading || deleting} className="flex-1">
                            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {initialData ? 'Salvar Alterações' : 'Criar Post'}
                        </Button>

                        {initialData && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" type="button" disabled={loading || uploading || deleting}>
                                        {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        Excluir Post
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta ação não pode ser desfeita. Isso excluirá permanentemente o post do blog.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            Sim, excluir post
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
