'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            router.push('/profile')
            router.refresh()
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Erro ao fazer login' })
        } finally {
            setLoading(false)
        }
    }

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback?next=/profile`,
                },
            })

            if (error) throw error

            setMessage({ type: 'success', text: 'Link mágico enviado! Verifique seu email.' })
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Erro ao enviar link mágico' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Bem-vindo ao Portal Monólitos Valley</CardTitle>
                    <CardDescription>
                        Faça login para acessar sua conta e gerenciar seu perfil
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="password" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="password">Email e Senha</TabsTrigger>
                            <TabsTrigger value="magic">Link Mágico</TabsTrigger>
                        </TabsList>

                        <TabsContent value="password">
                            <form onSubmit={handleEmailLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Senha</Label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-sm text-primary hover:underline"
                                        >
                                            Esqueci minha senha
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Entrando...' : 'Entrar'}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="magic">
                            <form onSubmit={handleMagicLink} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="magic-email">Email</Label>
                                    <Input
                                        id="magic-email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Enviaremos um link de acesso para seu email
                                    </p>
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Enviando...' : 'Enviar Link Mágico'}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>

                    {message && (
                        <div
                            className={`mt-4 rounded-md p-3 text-sm ${message.type === 'success'
                                ? 'bg-green-50 text-green-800'
                                : 'bg-red-50 text-red-800'
                                }`}
                        >
                            {message.text}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
