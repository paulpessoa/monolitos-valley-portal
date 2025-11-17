import Link from 'next/link'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Monólitos Valley</h3>
                        <p className="text-sm text-muted-foreground">
                            Ecossistema de inovação do Sertão Central Cearense
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold">Navegação</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/startups" className="text-muted-foreground hover:text-primary">
                                    Startups
                                </Link>
                            </li>
                            <li>
                                <Link href="/events" className="text-muted-foreground hover:text-primary">
                                    Eventos
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-muted-foreground hover:text-primary">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold">Comunidade</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/opportunities" className="text-muted-foreground hover:text-primary">
                                    Oportunidades
                                </Link>
                            </li>
                            <li>
                                <Link href="/store" className="text-muted-foreground hover:text-primary">
                                    Lojinha
                                </Link>
                            </li>
                            <li>
                                <a
                                    href={process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    WhatsApp
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold">Redes Sociais</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="https://instagram.com/monolitosvalley"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Instagram
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://linkedin.com/company/monolitosvalley"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {currentYear} Monólitos Valley. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
