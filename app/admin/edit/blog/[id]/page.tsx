'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BlogPostForm } from '@/components/admin/BlogPostForm'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import React from 'react'

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = React.use(params)
    const [post, setPost] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function fetchPost() {
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

                // Fetch blog post
                const res = await fetch(`/api/admin/blog-posts/${unwrappedParams.id}`)
                if (!res.ok) throw new Error('Post não encontrado')
                
                const { data } = await res.json()
                setPost(data)
            } catch (error) {
                console.error(error)
                toast.error('Erro ao carregar post')
                router.push('/admin')
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [unwrappedParams.id, router, supabase])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!post) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-muted-foreground">Post não encontrado</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Editar Post do Blog</h1>
                <p className="text-muted-foreground">Administração: Editando conteúdo</p>
            </div>

            <BlogPostForm 
                initialData={post}
                onSuccess={() => {
                    router.push('/admin')
                }} 
            />
        </div>
    )
}
