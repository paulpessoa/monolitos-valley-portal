'use client'

import { Opportunity, OpportunityType } from '@/types/database'
import { OpportunityCard } from './OpportunityCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Lock } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

interface OpportunityTabsProps {
    opportunities: Opportunity[]
    isAuthenticated: boolean
}

const TABS: { value: OpportunityType; label: string; requiresAuth: boolean }[] = [
    { value: 'Investidor', label: 'Investidores', requiresAuth: false },
    { value: 'Edital', label: 'Editais', requiresAuth: false },
    { value: 'InovacaoAberta', label: 'Inovação Aberta', requiresAuth: false },
    { value: 'Beneficio', label: 'Clube de Benefícios', requiresAuth: false },
    { value: 'Talento', label: 'Talentos', requiresAuth: true },
    { value: 'Vaga', label: 'Vagas', requiresAuth: true },
]

export function OpportunityTabs({ opportunities, isAuthenticated }: OpportunityTabsProps) {
    const getOpportunitiesByType = (type: OpportunityType) => {
        return opportunities.filter((opp) => opp.type === type)
    }

    return (
        <Tabs defaultValue="Investidor" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                {TABS.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
                        {tab.requiresAuth && !isAuthenticated && <Lock className="w-3 h-3" />}
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {TABS.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="mt-6">
                    {tab.requiresAuth && !isAuthenticated ? (
                        <Alert>
                            <Lock className="w-4 h-4" />
                            <AlertDescription>
                                Você precisa estar autenticado para visualizar {tab.label.toLowerCase()}.{' '}
                                <Link href="/login" className="underline font-medium">
                                    Faça login
                                </Link>{' '}
                                para acessar.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {getOpportunitiesByType(tab.value).map((opportunity) => (
                                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                            ))}
                            {getOpportunitiesByType(tab.value).length === 0 && (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-muted-foreground">
                                        Nenhuma oportunidade disponível no momento
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>
            ))}
        </Tabs>
    )
}
