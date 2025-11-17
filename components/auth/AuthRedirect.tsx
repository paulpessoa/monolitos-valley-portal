'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function AuthRedirect() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const code = searchParams.get('code')
        const type = searchParams.get('type')

        // Se houver um código de autenticação na URL, redirecionar para callback
        if (code) {
            const callbackUrl = `/auth/callback?code=${code}${type ? `&type=${type}` : ''}`
            router.replace(callbackUrl)
        }
    }, [searchParams, router])

    return null
}
