'use client'

import { AnimateOnScroll } from '@/components/features/home/AnimateOnScroll'
import { Button } from '@/components/ui/button'

const calendarIframe = (
    <iframe
        src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FFortaleza&showPrint=0&title=Eventos%20-%20Mon%C3%B3litos%20Valley&src=YzRkMDQ2YTY3ODkyMWQxMWFjYzEzMjM1Yjk0NzIzNzE3NTEyYWIxMDVlNmI3YTY5MWVmNzAwNDIyNmI0Y2NmOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=cHQtYnIuYnJhemlsaWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23e67c73&color=%230b8043"
        style={{ border: 'solid 1px #777' }}
        width="100%"
        height="600"
        frameBorder="0"
        scrolling="no"
    />
)

const googleCalendarUrl = 'https://calendar.google.com/calendar/u/0/r?cid=c4d046a678921d11acc13235b94723717512ab105e6b7a691ef7004226b4ccf8@group.calendar.google.com&cid=pt-br.brazilian%23holiday@group.v.calendar.google.com'

export default function EventsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <AnimateOnScroll className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Agenda</h1>
                        <p className="text-muted-foreground">
                            Eventos, meetups e oportunidades da comunidade Monólitos Valley
                        </p>
                    </div>
                    <Button
                        asChild
                        className="bg-[#F2CB05] hover:bg-[#d4b304] text-stone-900 font-semibold w-fit"
                    >
                        <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer">
                            Adicionar ao Google Agenda
                        </a>
                    </Button>
                </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
                <div className="relative w-full overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
                    {calendarIframe}
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
