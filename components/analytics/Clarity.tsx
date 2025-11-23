'use client'

import { useEffect } from 'react'

export function Clarity() {
    useEffect(() => {
        if (typeof window === 'undefined') return

        const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID

        if (!clarityId) {
            console.warn('⚠️ Clarity ID não configurado')
            return
        }

        // Verifica se já foi inicializado
        if ((window as any).clarity) {
            console.log('✅ Clarity já inicializado')
            return
        }

        // Script do Clarity
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.async = true
        script.innerHTML = `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
        `
        document.head.appendChild(script)

        console.log('✅ Clarity inicializado')
    }, [])

    return null
}
