'use client'

import { Startup } from '@/types/database'
import Image from 'next/image'
import Link from 'next/link'

interface StartupHighlightListProps {
    startups: Startup[]
}

export function StartupHighlightList({ startups }: StartupHighlightListProps) {
    if (startups.length === 0) return null

    return (
        <div className="flex flex-wrap items-center gap-6 md:gap-8">
            {startups.map((startup) => (
                <Link
                    key={startup.id}
                    href={`/negocios`}
                    className="group flex items-center gap-3 bg-white border border-stone-200 rounded-full pl-2 pr-4 py-1.5 hover:border-amber-400 hover:shadow-md transition-all"
                >
                    {startup.logo_url ? (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-stone-100 flex-shrink-0">
                            <Image
                                src={startup.logo_url}
                                alt={startup.name}
                                fill
                                className="object-contain p-0.5"
                            />
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {startup.name.charAt(0)}
                        </div>
                    )}
                    <span className="text-sm font-semibold text-stone-800 group-hover:text-amber-700 transition-colors whitespace-nowrap">
                        {startup.name}
                    </span>
                </Link>
            ))}
            <Link
                href="/negocios"
                className="text-sm font-semibold text-[#F2CB05] hover:text-[#d4b304] transition-colors whitespace-nowrap"
            >
                Ver todas →
            </Link>
        </div>
    )
}
