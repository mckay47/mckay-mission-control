import { useState, useEffect, useCallback } from 'react'
import type { CalendarEvent } from '../lib/types.ts'

const POLL_INTERVAL = 5 * 60 * 1000 // 5 minutes

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    try {
      // Fetch 30-day window: 7 days back + 23 days forward
      const now = new Date()
      const timeMin = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString()
      const timeMax = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 23).toISOString()

      const res = await fetch(`/api/calendar/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`)
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `HTTP ${res.status}`)
      }
      const data = await res.json()
      setEvents(data.events || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calendar fetch failed')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
    const interval = setInterval(fetchEvents, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchEvents])

  // Helper: get events for a specific date
  const getEventsForDate = useCallback((date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(e => {
      const eventDate = e.start.split('T')[0]
      return eventDate === dateStr
    })
  }, [events])

  // Helper: get today's events
  const todayEvents = getEventsForDate(new Date())

  // Helper: get events for current week (Mon-Sun)
  const getWeekEvents = useCallback(() => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const monday = new Date(now)
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
    monday.setHours(0, 0, 0, 0)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    sunday.setHours(23, 59, 59, 999)

    return events.filter(e => {
      const d = new Date(e.start)
      return d >= monday && d <= sunday
    })
  }, [events])

  return { events, loading, error, todayEvents, getEventsForDate, getWeekEvents, refetch: fetchEvents }
}
