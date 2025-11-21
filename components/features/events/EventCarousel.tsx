'use client'

import { useState } from 'react'
import { Event } from '@/types/database'
import { EventCard } from './EventCard'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface EventCarouselProps {
    events: Event[]
}

export function EventCarousel({ events }: EventCarouselProps) {
    const [api, setApi] = useState<CarouselApi>()

    if (events.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum evento disponível</p>
            </div>
        )
    }

    return (
        <div className="relative">
            <Carousel
                opts={{
                    align: 'start',
                    loop: true,
                }}
                setApi={setApi}
                className="w-full"
            >
                <CarouselContent>
                    {events.map((event) => (
                        <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
                            <EventCard event={event} variant="carousel" />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            {/* Botões de navegação centralizados embaixo */}
            <div className="flex justify-center gap-2 mt-6">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => api?.scrollPrev()}
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Anterior</span>
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => api?.scrollNext()}
                >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Próximo</span>
                </Button>
            </div>
        </div>
    )
}
