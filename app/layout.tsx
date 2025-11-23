import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import './globals-map.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AuthRedirect, AuthHashHandler } from '@/components/auth/AuthHandlers'
import { CookieConsent } from '@/components/CookieConsent'
import { Clarity } from '@/components/analytics/Clarity'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { createClient } from '@/lib/supabase/server'
import { Toaster } from 'sonner'
import { Suspense } from 'react'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#000000',
}

export const metadata: Metadata = {
  title: 'Monólitos Valley - Comunidade de Startups do Sertão Central Cearense',
  description: 'Comunidade de startups, inovação e oportunidades no Sertão Central Cearense. Conecte-se com empreendedores, participe de eventos e acesse recursos para crescer seu negócio.',
  keywords: ['startups', 'inovação', 'Ceará', 'Sertão Central', 'empreendedorismo', 'tecnologia', 'comunidade'],
  authors: [{ name: 'Monólitos Valley' }],
  creator: 'Monólitos Valley',
  publisher: 'Monólitos Valley',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://monolitosvalley.com.br',
    siteName: 'Monólitos Valley',
    title: 'Monólitos Valley - Comunidade de Startups do Sertão Central Cearense',
    description: 'Comunidade de startups, inovação e oportunidades no Sertão Central Cearense',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://monolitosvalley.com.br'}/monolitos-valley-logo-title.svg`,
        width: 1200,
        height: 630,
        alt: 'Monólitos Valley',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monólitos Valley - Ecossistema de Inovação',
    description: 'Comunidade de startups e inovação do Sertão Central Cearense',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://monolitosvalley.com.br'}/monolitos-valley-logo-title.svg`],
    creator: '@monolitosvalley',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://monolitosvalley.com.br',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <AuthRedirect />
        </Suspense>
        <AuthHashHandler />
        <GoogleAnalytics />
        <Clarity />
        <Toaster position="top-right" />
        <div className="flex min-h-screen flex-col">
          <Navbar user={user} />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
        </div>
      </body>
    </html>
  )
}
