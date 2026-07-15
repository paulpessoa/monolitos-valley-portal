'use client'

import { Startup } from '@/types/database'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Leaf, Eye } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface StartupCardProps {
    startup: Startup
    variant?: 'compact' | 'detailed'
    onViewDetails?: (startup: Startup) => void
}

const STAGE_COLORS: Record<string, string> = {
    ideia: 'h-1 bg-blue-500',
    validacao: 'h-1 bg-purple-500',
    mvp: 'h-1 bg-green-500',
    tracao: 'h-1 bg-orange-500',
    escala: 'h-1 bg-red-500',
    crescimento: 'h-1 bg-amber-500',
}

export function StartupCard({ startup, variant = 'compact', onViewDetails }: StartupCardProps) {
    const router = useRouter()
    const stageBar = STAGE_COLORS[startup.estagio_maturidade] || 'h-1 bg-stone-400'

    const handleViewDetails = () => {
        if (startup.slug) {
            router.push(`/negocios/${startup.slug}`)
        } else if (onViewDetails) {
            onViewDetails(startup)
        }
    }

    return (
        <Card className="h-full hover:shadow-md transition-shadow overflow-hidden flex flex-col">
            {/* Top colored bar representing stage */}
            <div className={stageBar} />

            <CardHeader className="pb-2">
                <div className="flex items-start gap-3 mb-2">
                    {startup.logo_url ? (
                        <Image
                            src={startup.logo_url}
                            alt={`${startup.name} logo`}
                            width={48}
                            height={48}
                            className="object-contain flex-shrink-0"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-stone-100 rounded flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-6 h-6 text-stone-400" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-base line-clamp-2">{startup.name}</CardTitle>
                        {startup.segmento && (
                            <CardDescription className="text-xs">{startup.segmento}</CardDescription>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
                {startup.description && (
                    <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                        {startup.description}
                    </p>
                )}

                {/* Tags section - Stage and ESG */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {startup.estagio_maturidade && (
                        <Badge variant="outline" className="text-xs">
                            {startup.estagio_maturidade.charAt(0).toUpperCase() + startup.estagio_maturidade.slice(1)}
                        </Badge>
                    )}
                    {startup.tem_esg && (
                        <Badge variant="outline" className="text-xs">
                            <Leaf className="w-3 h-3 mr-1" />
                            ESG
                        </Badge>
                    )}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-amber-500 text-amber-600 hover:bg-amber-50 font-semibold text-xs"
                    onClick={handleViewDetails}
                >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver Mais
                </Button>
            </CardContent>
        </Card>
    )
}
