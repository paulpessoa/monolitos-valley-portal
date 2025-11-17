'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [checking, setChecking] = useState(true)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                setMessage({
                    type: 'error',
                    text: 'Sessão inválida. Por favor, solicite um novo link de recuperação.'
                })
                setTimeout(() => {
                    router.push('/forgot-password')
                }, 3000)
            }
            setChecking(false)
        }

        checkSession()
    }, [supabase, router])

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'As senhas não coincidem' })
            setLoading(false)
            return
        }

        if (password.length < 6) {
            setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres' })
            setLoading(false)
            return
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            })

            if (error) throw error

            setMessage({
                type: 'success',
                text: 'Senha atualizada com sucesso! Redirecionando...',
            })

            setTimeout(() => {
                router.push('/profile')
            }, 2000)
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Erro ao atualizar senha',
            })
        } finally {
            setLoading(false)
        }
    }

    if (checking) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Redefinir Senha</CardTitle>
                    <CardDescription>Digite sua nova senha</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Nova Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Atualizando...' : 'Atualizar Senha'}
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
                </CardContent>
            </Card>
        </div>
    )
}
