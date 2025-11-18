'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, CheckCircle, Loader2 } from 'lucide-react'

interface MagicLinkCTAProps {
    title: string
    description: string
    subtitle?: string
}

export function MagicLinkCTA({ title, description, subtitle }: MagicLinkCTAProps) {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Log para debug
            const redirectUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback?next=/profile`
            console.log('🔗 Magic Link - Redirect URL:', redirectUrl)

            const { data, error: err } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: redirectUrl,
                    shouldCreateUser: true, // Garante que cria o usuário
                },
            })

            console.log('✅ Magic Link Response:', data)

            if (err) {
                console.error('❌ Magic Link Error:', err)
                throw err
            }

            setSuccess(true)
            setEmail('')
            setTimeout(() => setSuccess(false), 5000)
        } catch (err) {
            console.error('❌ Catch Error:', err)
            setError(err instanceof Error ? err.message : 'Erro ao enviar email')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="text-center py-12 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-6 animate-bounce">
                    <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    ✨ Verifique seu email!
                </h3>
                <p className="text-stone-300 max-w-md mx-auto mb-6">
                    Enviamos um link mágico para você. Clique nele para entrar na comunidade Monólitos Valley e começar sua jornada.
                </p>
                <p className="text-sm text-stone-400">
                    Não recebeu? Verifique sua pasta de spam ou tente novamente.
                </p>
            </div>
        )
    }

    return (
        <div className="text-center">

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {title}
            </h2>
            <p className="text-lg text-stone-300 mb-8 max-w-2xl mx-auto">
                {description}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
                <Input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="flex-1 bg-white/10 border-stone-600 text-white placeholder:text-stone-400"
                />
                <Button
                    type="submit"
                    disabled={loading || !email}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold whitespace-nowrap"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        <>
                            <Mail className="w-4 h-4 mr-2" />
                            Cadastrar Startup
                        </>
                    )}
                </Button>
            </form>

            {error && (
                <p className="text-orange-300 text-sm">{error}</p>
            )}

            <p className="text-sm text-stone-400">
                🚀 Mais de 50 startups já fazem parte da comunidade
            </p>
        </div>
    )
}
