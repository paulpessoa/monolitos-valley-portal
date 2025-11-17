'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Global error:', error)
    }, [error])

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <AlertTriangle className="w-20 h-20 text-destructive mb-6" />
                <h1 className="text-4xl font-bold mb-4">Ops! Algo deu errado</h1>
                <p className="text-lg text-muted-foreground mb-8 text-center max-w-md">
                    Encontramos um problema inesperado. Nossa equipe foi notificada e estamos trabalhando para
                    resolver.
                </p>
                <div className="flex gap-4">
                    <Button onClick={reset}>Tentar Novamente</Button>
                    <Button variant="outline" onClick={() => (window.location.href = '/')}>
                        Voltar para Home
                    </Button>
                </div>
            </div>
        </div>
    )
}
