import leadersData from '@/data/leaders.json'
import { Users } from 'lucide-react'
import { LeadersGrid } from '@/components/features/leaders/LeadersGrid'
import { AnimateOnScroll } from '@/components/features/home/AnimateOnScroll'

interface Leader {
    id: string
    full_name: string
    role_title: string
    startup_name: string | null
    linkedin_url: string | null
    instagram_url: string | null
    photo_url: string | null
}

export default function PublicLeadersPage() {
    const leaders = leadersData as Leader[]

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <div className="container mx-auto px-4 py-16 max-w-7xl">
                <AnimateOnScroll className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                    <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900">
                        Lideranças que Movem
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 mt-2">
                            a Comunidade
                        </span>
                    </h1>
                </AnimateOnScroll>

                {leaders.length === 0 ? (
                    <div className="border border-slate-200/60 bg-slate-50 rounded-xl overflow-hidden">
                        <div className="py-16 text-center">
                            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-600 font-medium text-lg">Nenhuma liderança encontrada</p>
                        </div>
                    </div>
                ) : (
                    <LeadersGrid leaders={leaders} />
                )}
            </div>
        </div>
    )
}
