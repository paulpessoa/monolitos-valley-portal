import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Linkedin } from 'lucide-react'

export function Footer() {
    const currentYear = new Date().getFullYear()

    const socialLinks = [
        {
            icon: Instagram,
            href: 'https://instagram.com/monolitosvalley',
            label: 'Instagram',
        },
        {
            icon: Linkedin,
            href: 'https://linkedin.com/company/monolitosvalley',
            label: 'LinkedIn',
        },
    ]

    return (
        <footer className="border-t border-stone-300 bg-stone-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 items-center md:items-start">
                    <div className="space-y-3">
                        <Link href="/" className="flex items-center justify-center md:justify-start">
                            <Image
                                src="/monolitos-valley-logo-title.svg"
                                alt="Monólitos Valley"
                                width={160}
                                height={40}
                                className="h-8 md:h-10"
                            />
                        </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        {socialLinks.map((social) => {
                            const Icon = social.icon
                            return (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-stone-400 hover:text-amber-400 transition-colors"
                                    aria-label={social.label}
                                >
                                    <Icon className="h-5 w-5" />
                                </a>
                            )
                        })}
                    </div>
                </div>

                <div className="mt-8 border-t border-stone-700 pt-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-stone-400 text-center md:text-left">
                        <p>&copy; {currentYear} Monólitos Valley. Todos os direitos reservados.</p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link href="/privacy" className="hover:text-amber-400 transition-colors">
                                Privacidade
                            </Link>
                            <Link href="/terms" className="hover:text-amber-400 transition-colors">
                                Termos de Uso
                            </Link>
                            <Link href="/cookies" className="hover:text-amber-400 transition-colors">
                                Cookies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
