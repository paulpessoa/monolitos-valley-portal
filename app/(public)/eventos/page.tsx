'use client'

import { AnimateOnScroll } from '@/components/features/home/AnimateOnScroll'

export default function EventsPage() {
    const calendarUrl = 'https://calendar.google.com/calendar/u/0?cid=YzRkMDQ2YTY3ODkyMWQxMWFjYzEzMjM1Yjk0NzIzNzE3NTEyYWIxMDVlNmI3YTY5MWVmNzAwNDIyNmI0Y2NmOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t'

    return (
        <div className="container mx-auto px-4 py-8">
            <AnimateOnScroll className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Agenda</h1>
                <p className="text-muted-foreground">
                    Eventos, meetups e oportunidades da comunidade Monólitos Valley
                </p>
            </AnimateOnScroll>

            <AnimateOnScroll>
                <div className="relative w-full overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
                    <div className="relative" style={{ paddingBottom: '75%' }}>
                        <iframe
                            src={calendarUrl}
                            className="absolute inset-0 h-full w-full"
                            style={{ border: 0 }}
                            title="Google Calendar - Monólitos Valley"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </AnimateOnScroll>

            <AnimateOnScroll className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                    Clique em um evento para salvar na sua agenda ou adicionar lembretes.
                </p>
            </AnimateOnScroll>
        </div>
    )
}
