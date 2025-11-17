'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const supabase = createClient()

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
            })

            if (error) throw error

            setMessage({
                type: 'success',
                text: 'Link de recuperação enviado! Verifique seu email.',
            })
            setEmail('')
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Erro ao enviar link de recuperação',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Recuperar Senha</CardTitle>
                    <CardDescription>
                        Digite seu email para receber um link de recuperação de senha
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleResetPassword} className="space-y-4">
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
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                        </Button>
                    </form>

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

                    <div className="mt-6">
                        <Link
                            href="/login"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Voltar para o login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
