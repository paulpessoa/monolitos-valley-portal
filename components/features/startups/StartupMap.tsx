'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Icon, LatLngExpression } from 'leaflet'
import { Startup } from '@/types/database'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, Globe, FileText, Leaf, TrendingUp, Camera, ExternalLink } from 'lucide-react'
import { formatCNPJ } from '@/lib/utils'
import Link from 'next/link'
import 'leaflet/dist/leaflet.css'

interface StartupMapProps {
    startups: Startup[]
}

const ESTAGIO_LABELS: Record<string, string> = {
    ideia: 'Ideação',
    validacao: 'Validação',
    mvp: 'MVP',
    tracao: 'Tração',
    escala: 'Escala',
    crescimento: 'Crescimento',
}

// Custom marker icon usando o logo da startup (ou padrão da Monólitos Valley)
const createCustomIcon = (logoUrl?: string | null) => {
    return new Icon({
        iconUrl: logoUrl || '/monolitos-valley-logo.svg',
        iconSize: [40, 40], // Ajustado para dar destaque ao logo
        iconAnchor: [20, 20], // Centralizado
        popupAnchor: [0, -20],
        className: 'custom-marker-icon object-contain'
    })
}

function MapBounds({ startups }: { startups: Startup[] }) {
    const map = useMap()

    useEffect(() => {
        if (startups.length > 0) {
            const bounds = startups
                .filter((s) => s.latitude && s.longitude)
                .map((s) => [s.latitude!, s.longitude!] as [number, number])

            if (bounds.length > 0) {
                map.fitBounds(bounds as any, { padding: [50, 50] })
            }
        }
    }, [startups, map])

    return null
}

export function StartupMap({ startups }: StartupMapProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="h-[600px] bg-muted animate-pulse rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Carregando mapa...</p>
            </div>
        )
    }

    const startupsWithLocation = startups.filter((s) => s.latitude && s.longitude)

    if (startupsWithLocation.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                        Nenhuma startup com localização cadastrada ainda
                    </p>
                </CardContent>
            </Card>
        )
    }

    // Centro padrão: Quixadá, CE
    const defaultCenter: LatLngExpression = [-4.9717, -39.0147]

    return (
        <div className="h-[600px] rounded-lg overflow-hidden border">
            <MapContainer
                center={defaultCenter}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapBounds startups={startupsWithLocation} />
                {startupsWithLocation.map((startup) => (
                    <Marker
                        key={startup.id}
                        position={[startup.latitude!, startup.longitude!]}
                        icon={createCustomIcon(startup.logo_url)}
                    >
                        <Popup maxWidth={400} className="startup-popup">
                            <div className="p-3 min-w-[350px] max-w-[400px]">
                                {/* Header */}
                                <div className="mb-3">
                                    <h3 className="font-bold text-lg mb-1">{startup.name}</h3>
                                    {startup.cnpj && startup.cnpj.replace(/\D/g, '') !== '00000000000000' && startup.cnpj.trim() !== '' && (
                                        <p className="text-xs text-stone-600 mb-2">CNPJ: {formatCNPJ(startup.cnpj)}</p>
                                    )}
                                    <div className="flex flex-wrap gap-1">
                                        <Badge className="bg-amber-100 text-amber-800 border border-amber-300 text-xs">
                                            {startup.segmento}
                                        </Badge>
                                        <Badge className="bg-blue-100 text-blue-800 border border-blue-300 text-xs">
                                            <TrendingUp className="w-2.5 h-2.5 mr-1" />
                                            {ESTAGIO_LABELS[startup.estagio_maturidade] || startup.estagio_maturidade}
                                        </Badge>
                                        {startup.tem_esg && (
                                            <Badge className="bg-green-100 text-green-800 border border-green-300 text-xs">
                                                <Leaf className="w-2.5 h-2.5 mr-1" />
                                                ESG
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Descrição */}
                                {startup.description && (
                                    <div className="border-l-3 border-amber-500 pl-3 mb-3">
                                        <p className="text-xs text-stone-700 line-clamp-3">{startup.description}</p>
                                    </div>
                                )}



                                {/* Tecnologias */}
                                {startup.tecnologias && startup.tecnologias.length > 0 && (
                                    <div className="mb-3">
                                        <p className="text-xs font-semibold mb-1">Tecnologias</p>
                                        <div className="flex flex-wrap gap-1">
                                            {startup.tecnologias.slice(0, 5).map((tech) => (
                                                <Badge key={tech} variant="outline" className="text-xs py-0">
                                                    {tech}
                                                </Badge>
                                            ))}
                                            {startup.tecnologias.length > 5 && (
                                                <Badge variant="outline" className="text-xs py-0">
                                                    +{startup.tecnologias.length - 5}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Links */}
                                {(startup.website || startup.linkedin || startup.instagram || startup.pitch_deck_url) && (
                                    <div className="mb-3">
                                        <p className="text-xs font-semibold text-stone-700 mb-2">Redes e Links</p>
                                        <div className="flex items-center gap-2">
                                            {startup.website && (
                                                <Link
                                                    href={startup.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F2CB05]/10 hover:bg-[#F2CB05]/20 border border-[#F2CB05]/30 transition-colors"
                                                    title="Website"
                                                >
                                                    <Globe className="h-4 w-4 text-[#F2CB05]" />
                                                </Link>
                                            )}
                                            {startup.linkedin && (
                                                <Link
                                                    href={startup.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F2CB05]/10 hover:bg-[#F2CB05]/20 border border-[#F2CB05]/30 transition-colors"
                                                    title="LinkedIn"
                                                >
                                                    <TrendingUp className="h-4 w-4 text-[#F2CB05]" />
                                                </Link>
                                            )}
                                            {startup.instagram && (
                                                <Link
                                                    href={startup.instagram}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F2CB05]/10 hover:bg-[#F2CB05]/20 border border-[#F2CB05]/30 transition-colors"
                                                    title="Instagram"
                                                >
                                                    <Camera className="h-4 w-4 text-[#F2CB05]" />
                                                </Link>
                                            )}
                                            {startup.pitch_deck_url && (
                                                <Link
                                                    href={`/api/pitch-deck/${startup.owner_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F2CB05]/10 hover:bg-[#F2CB05]/20 border border-[#F2CB05]/30 transition-colors"
                                                    title="Pitch Deck"
                                                >
                                                    <FileText className="h-4 w-4 text-[#F2CB05]" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* CTA Button */}
                                {startup.slug && (
                                    <Link
                                        href={`/negocios/${startup.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full bg-[#F2CB05] hover:bg-[#d4b304] text-stone-900 font-semibold rounded-lg px-4 py-2.5 transition-all hover:shadow-md"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        <span>Abrir mais detalhes</span>
                                    </Link>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}
