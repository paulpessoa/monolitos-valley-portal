'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { User } from '@supabase/supabase-js'
import { AuthButton } from './AuthButton'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavbarProps {
    user: User | null
}

export function Navbar({ user }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false)

    const navLinks = [
        { href: '/', label: 'Início' },
        { href: '/startups', label: 'Startups' },
        { href: '/events', label: 'Eventos' },
        { href: '/blog', label: 'Blog' },
        { href: '/opportunities', label: 'Oportunidades' },
        { href: '/leaders', label: 'Lideranças' },
    ]

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-stone-300 bg-white shadow-sm">
            <div className="container mx-auto px-4 flex h-16 items-center justify-between">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/monolitos-valley-logo-title.svg"
                            alt="Monólitos Valley"
                            width={160}
                            height={40}
                            className="h-8 md:h-10"
                        />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex flex-1 items-center justify-center gap-6">
                    <nav className="flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                prefetch={false}
                                className="text-sm font-medium text-stone-700 transition-colors hover:text-[#F2CB05]"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Desktop Auth Button */}
                <div className="hidden md:flex">
                    <AuthButton user={user} />
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-2">
                    {user && <AuthButton user={user} />}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(!isOpen)}
                        className="h-10 w-10"
                    >
                        {isOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-stone-300 bg-white">
                    <div className="container mx-auto px-4 py-4 space-y-4">
                        {/* Navigation Links */}
                        <div className="space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    prefetch={false}
                                    className="block px-4 py-2 text-sm font-medium text-stone-700 rounded-md hover:bg-[#F2CB05]/10 hover:text-[#F2CB05] transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Member Access Section */}
                        {!user && (
                            <div className="border-t border-stone-200 pt-4">
                                <div className="px-4">
                                    <AuthButton user={user} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
