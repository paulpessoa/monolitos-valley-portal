'use client'

import { useState, useEffect } from 'react'
import { Event } from '@/types/database'
import { EventCard } from '@/components/features/events/EventCard'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Calendar as CalendarIcon } from 'lucide-react'
import { format, parseISO, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [viewMode, setViewMode] = useState<'upcoming' | 'month'>('upcoming')

    useEffect(() => {
        async function fetchEvents() {
            setLoading(true)
            try {
                let url = '/api/events?limit=50'

                if (viewMode === 'month') {
                    const from = format(startOfMonth(currentMonth), 'yyyy-MM-dd')
                    const to = format(endOfMonth(currentMonth), 'yyyy-MM-dd')
                    url = `/api/events?from_date=${from}&to_date=${to}`
                }

                const res = await fetch(url)
                if (res.ok) {
                    const data = await res.json()
                    setEvents(data.data || [])
                }
            } catch (error) {
                console.error('Error fetching events:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
    }, [viewMode, currentMonth])

    const groupEventsByMonth = () => {
        const grouped: { [key: string]: Event[] } = {}

        events.forEach((event) => {
            const date = parseISO(event.event_date)
            const monthKey = format(date, 'MMMM yyyy', { locale: ptBR })

            if (!grouped[monthKey]) {
                grouped[monthKey] = []
            }
            grouped[monthKey].push(event)
        })

        return grouped
    }

    const groupedEvents = groupEventsByMonth()

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Eventos</h1>
                <p className="text-muted-foreground">
                    Participe dos eventos da comunidade Monólitos Valley
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="upcoming">Próximos Eventos</SelectItem>
                        <SelectItem value="month">Por Mês</SelectItem>
                    </SelectContent>
                </Select>

                {viewMode === 'month' && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        >
                            ← Anterior
                        </Button>
                        <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-md">
                            <CalendarIcon className="w-4 h-4" />
                            <span className="font-medium">
                                {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        >
                            Próximo →
                        </Button>
                    </div>
                )}
            </div>

            {/* Events List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-12">
                    <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                        {viewMode === 'month'
                            ? 'Nenhum evento neste mês'
                            : 'Nenhum evento disponível no momento'}
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedEvents).map(([month, monthEvents]) => (
                        <div key={month}>
                            <h2 className="text-2xl font-bold mb-4 capitalize">{month}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {monthEvents.map((event) => (
                                    <EventCard key={event.id} event={event} variant="list" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
