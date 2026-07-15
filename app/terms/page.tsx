import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, AlertCircle, CheckCircle, XCircle, Scale } from 'lucide-react'
import { AnimateOnScroll } from '@/components/features/home/AnimateOnScroll'

export const metadata: Metadata = {
    title: 'Termos de Uso | Monólitos Valley',
    description: 'Termos de Uso da Monólitos Valley - Regras e condições para uso da plataforma',
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-stone-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-stone-900">Termos de Uso</h1>
                            <p className="text-sm text-stone-600">Última atualização: Novembro de 2024</p>
                        </div>
                    </div>
                    <p className="text-stone-700">
                        Ao acessar e usar a plataforma Monólitos Valley, você concorda com estes termos.
                        Leia atentamente antes de utilizar nossos serviços.
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 space-y-8">
                    <AnimateOnScroll>
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-stone-900">1. Aceitação dos Termos</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <p>
                                Ao criar uma conta, cadastrar uma startup ou utilizar qualquer funcionalidade da Monólitos Valley,
                                você declara ter lido, compreendido e concordado com estes Termos de Uso e nossa Política de Privacidade.
                            </p>
                            <p>
                                Se você não concorda com algum termo, não utilize a plataforma.
                            </p>
                        </div>
                    </section>
                    </AnimateOnScroll>

                    <AnimateOnScroll>
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Scale className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-stone-900">2. Sobre a Plataforma</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <p>
                                A Monólitos Valley é uma plataforma que conecta startups, empreendedores, investidores e
                                profissionais do ecossistema de inovação do Sertão Central Cearense.
                            </p>
                            <p><strong>Nossos serviços incluem:</strong></p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Cadastro e perfil de startups</li>
                                <li>Divulgação de eventos e oportunidades</li>
                                <li>Networking e conexões</li>
                                <li>Acesso a recursos e conteúdos</li>
                                <li>Visibilidade para investidores e parceiros</li>
                            </ul>
                        </div>
                    </section>
                    </AnimateOnScroll>

                    <AnimateOnScroll>
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-stone-900">3. Cadastro e Conta</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <div>
                                <h3 className="font-semibold mb-2">3.1 Elegibilidade</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Você deve ter pelo menos 18 anos</li>
                                    <li>Fornecer informações verdadeiras e atualizadas</li>
                                    <li>Manter a confidencialidade da sua conta</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">3.2 Responsabilidades</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Você é responsável por todas as atividades em sua conta</li>
                                    <li>Notifique-nos imediatamente sobre uso não autorizado</li>
                                    <li>Não compartilhe suas credenciais de acesso</li>
                                    <li>Mantenha seu e-mail atualizado para receber comunicações importantes</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                    </AnimateOnScroll>

                    <AnimateOnScroll>
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-stone-900">4. Uso Aceitável</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <p><strong>Você concorda em NÃO:</strong></p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Fornecer informações falsas ou enganosas sobre sua startup</li>
                                <li>Violar direitos de propriedade intelectual de terceiros</li>
                                <li>Publicar conteúdo ofensivo, discriminatório ou ilegal</li>
                                <li>Usar a plataforma para spam ou marketing não autorizado</li>
                                <li>Tentar acessar áreas restritas ou contas de outros usuários</li>
                                <li>Fazer scraping ou coletar dados de forma automatizada</li>
                                <li>Interferir no funcionamento da plataforma</li>
                                <li>Usar a plataforma para atividades fraudulentas</li>
                            </ul>
                        </div>
                    </section>
                    </AnimateOnScroll>

                    <AnimateOnScroll>
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-stone-900">5. Conteúdo e Propriedade Intelectual</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <div>
                                <h3 className="font-semibold mb-2">5.1 Seu Conteúdo</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Você mantém todos os direitos sobre o conteúdo que publica</li>
                                    <li>Ao publicar, você nos concede licença para exibir e compartilhar esse conteúdo</li>
                                    <li>Você garante ter direitos sobre logos, imagens e documentos enviados</li>
                                    <li>Você é responsável pela veracidade das informações fornecidas</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">5.2 Nossa Propriedade</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>A plataforma, design, código e marca são de nossa propriedade</li>
                                    <li>Você não pode copiar, modificar ou distribuir nosso conteúdo sem autorização</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                    </AnimateOnScroll>

                    <AnimateOnScroll>
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-stone-900">6. Dados Públicos</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <p>
                                Ao cadastrar sua startup, você entende e concorda que as seguintes informações serão públicas:
                            </p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Nome, logo e descrição da startup</li>
                                <li>Localização, segmento e estágio de maturidade</li>
                                <li>Informações de contato (website, redes sociais)</li>
                                <li>Dados dos membros do time (quando fornecidos)</li>
                                <li>Tecnologias utilizadas e práticas ESG</li>
                            </ul>
                            <p className="mt-4">
                                Estes dados podem ser visualizados por outros usuários, parceiros e investidores,
                                e podem aparecer em resultados de busca.
                            </p>
                        </div>
                    </section>
                    </AnimateOnScroll>

                    <AnimateOnScroll>
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <XCircle className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-stone-900">7. Suspensão e Encerramento</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <p>Podemos suspender ou encerrar sua conta se:</p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Você violar estes Termos de Uso</li>
                                <li>Fornecer informações falsas ou enganosas</li>
                                <li>Usar a plataforma de forma abusiva ou ilegal</li>
                                <li>Não responder a solicitações de verificação</li>
                            </ul>
                            <p className="mt-4">
                                Você pode encerrar sua conta a qualquer momento através das configurações do perfil.
                                Seus dados serão removidos conforme nossa Política de Privacidade.
                            </p>
                        </div>
                    </section>
                    </AnimateOnScroll>

                    <AnimateOnScroll>
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-stone-900">8. Isenção de Garantias</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <p>
                                A plataforma é fornecida "como está" e "conforme disponível". Não garantimos:
                            </p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Disponibilidade ininterrupta ou livre de erros</li>
                                <li>Resultados específicos (investimentos, parcerias, etc.)</li>
                                <li>Veracidade de informações fornecidas por outros usuários</li>
                                <li>Segurança absoluta contra ataques ou vazamentos</li>
                            </ul>
                        </div>
                    </section>
                    </AnimateOnScroll>

                    <AnimateOnScroll>
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Scale className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-stone-900">9. Limitação de Responsabilidade</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <p>
                                Não somos responsáveis por:
                            </p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Danos diretos ou indiretos decorrentes do uso da plataforma</li>
                                <li>Perda de dados, lucros ou oportunidades</li>
                                <li>Ações ou omissões de outros usuários</li>
                                <li>Conteúdo de terceiros ou links externos</li>
                                <li>Decisões de investimento ou negócios baseadas em informações da plataforma</li>
                            </ul>
                        </div>
                    </section>
                    </AnimateOnScroll>

                    <AnimateOnScroll>
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-stone-900">10. Modificações</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <p>
                                Podemos modificar estes termos a qualquer momento. Mudanças significativas serão
                                notificadas por e-mail ou através da plataforma. O uso continuado após as mudanças
                                constitui aceitação dos novos termos.
                            </p>
                        </div>
                    </section>
                    </AnimateOnScroll>

                    <AnimateOnScroll>
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Scale className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-stone-900">11. Lei Aplicável</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <p>
                                Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida
                                no foro da comarca de Quixadá, CE.
                            </p>
                        </div>
                    </section>
                    </AnimateOnScroll>

                    <AnimateOnScroll>
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-stone-900">12. Contato</h2>
                        </div>
                        <div className="space-y-4 text-stone-700">
                            <p>Para questões sobre estes termos:</p>
                            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 mt-4">
                                <p><strong>E-mail:</strong> contato@monolitosvalley.com</p>
                                <p><strong>Endereço:</strong> Quixadá, CE - Brasil</p>
                            </div>
                        </div>
                    </section>
                    </AnimateOnScroll>
                </div>

                {/* Footer Links */}
                <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                        Política de Privacidade
                    </Link>
                    <Link href="/cookies" className="text-blue-600 hover:text-blue-700 underline">
                        Política de Cookies
                    </Link>
                    <Link href="/" className="text-stone-600 hover:text-stone-700">
                        Voltar ao Início
                    </Link>
                </div>
            </div>
        </div>
    )
}
