import Link from 'next/link'
import Image from 'next/image'
import { User } from '@supabase/supabase-js'
import { AuthButton } from './AuthButton'

interface NavbarProps {
    user: User | null
}

export function Navbar({ user }: NavbarProps) {
    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/startups', label: 'Startups' },
        { href: '/events', label: 'Eventos' },
        { href: '/blog', label: 'Blog' },
        { href: '/opportunities', label: 'Oportunidades' },
        { href: '/store', label: 'Lojinha' },
    ]

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 flex h-16 items-center">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Image
                            src="/monolitos-valley-logo.svg"
                            alt="Monólitos Valley"
                            width={32}
                            height={32}
                            className="h-8 w-8"
                        />
                        <span className="font-bold text-lg hidden sm:inline">Monólitos Valley</span>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <nav className="flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium transition-colors hover:text-primary hidden md:inline-block"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <AuthButton user={user} />
                </div>
            </div>
        </nav>
    )
}
