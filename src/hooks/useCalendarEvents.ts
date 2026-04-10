import { useState, useEffect, useCallback, useRef } from 'react'
import type { CalendarEvent, CalendarInfo } from '../lib/types.ts'

const POLL_INTERVAL = 5 * 60 * 1000 // 5 minutes

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [calendars, setCalendars] = useState<CalendarInfo[]>([])
  const [enabledCalendarIds, setEnabledCalendarIds] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'all' | string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mutating, setMutating] = useState(false)
  const calendarMapRef = useRef<Map<string, CalendarInfo>>(new Map())
  const initDone = useRef(false)

  // Fetch all subscribed calendars
  const fetchCalendars = useCallback(async () => {
    try {
      const res = await fetch('/api/calendar/calendars')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const cals: CalendarInfo[] = data.calendars || []
      setCalendars(cals)
      const map = new Map<string, CalendarInfo>()
      for (const c of cals) map.set(c.id, c)
      calendarMapRef.current = map
      // Enable all selected calendars on first load
      if (!initDone.current) {
        setEnabledCalendarIds(new Set(cals.filter(c => c.selected).map(c => c.id)))
        initDone.current = true
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calendar list fetch failed')
    }
  }, [])

  // Fetch events for a single calendar
  const fetchCalendarEvents = useCallback(async (calendarId: string, timeMin: string, timeMax: string): Promise<CalendarEvent[]> => {
    const params = new URLSearchParams({ timeMin, timeMax, calendarId })
    const res = await fetch(`/api/calendar/events?${params}`)
    if (!res.ok) return []
    const data = await res.json()
    const calInfo = calendarMapRef.current.get(calendarId)
    return (data.events || []).map((e: CalendarEvent) => ({
      ...e,
      calendarId,
      calendarColor: calInfo?.backgroundColor || '#4285f4',
    }))
  }, [])

  // Fetch events based on active tab
  const fetchEvents = useCallback(async () => {
    try {
      const now = new Date()
      const timeMin = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString()
      const timeMax = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 53).toISOString()

      let allEvents: CalendarEvent[] = []

      if (activeTab === 'all') {
        const ids = Array.from(enabledCalendarIds)
        if (ids.length === 0) { setEvents([]); setLoading(false); return }
        const results = await Promise.all(ids.map(id => fetchCalendarEvents(id, timeMin, timeMax)))
        allEvents = results.flat()
      } else {
        allEvents = await fetchCalendarEvents(activeTab, timeMin, timeMax)
      }

      allEvents.sort((a, b) => a.start.localeCompare(b.start))
      setEvents(allEvents)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calendar fetch failed')
    } finally {
      setLoading(false)
    }
  }, [activeTab, enabledCalendarIds, fetchCalendarEvents])

  // Toggle a calendar on/off in "Alle" view
  const toggleCalendar = useCallback((id: string) => {
    setEnabledCalendarIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // Init: fetch calendars on mount
  useEffect(() => { fetchCalendars() }, [fetchCalendars])

  // Fetch events when dependencies change
  useEffect(() => {
    if (calendars.length === 0) return
    setLoading(true)
    fetchEvents()
    const interval = setInterval(fetchEvents, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchEvents, calendars.length])

  // Helper: get events for a specific date
  const getEventsForDate = useCallback((date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(e => {
      const eventStart = e.start.split('T')[0]
      const eventEnd = e.end ? e.end.split('T')[0] : eventStart
      return dateStr >= eventStart && dateStr <= eventEnd
    })
  }, [events])

  const todayEvents = getEventsForDate(new Date())

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

  // CRUD: Create event
  const createEvent = useCallback(async (params: {
    calendarId?: string; title: string; start: string; end: string;
    description?: string; location?: string; allDay?: boolean;
  }) => {
    setMutating(true)
    try {
      const res = await fetch('/api/calendar/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calendarId: params.calendarId || 'primary', ...params }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Create failed')
      await fetchEvents()
      return data.event
    } finally { setMutating(false) }
  }, [fetchEvents])

  // CRUD: Update event
  const updateEvent = useCallback(async (params: {
    calendarId?: string; eventId: string; title?: string; start?: string; end?: string;
    description?: string; location?: string; allDay?: boolean;
  }) => {
    setMutating(true)
    try {
      const res = await fetch('/api/calendar/events/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calendarId: params.calendarId || 'primary', ...params }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Update failed')
      await fetchEvents()
    } finally { setMutating(false) }
  }, [fetchEvents])

  // CRUD: Delete event
  const deleteEvent = useCallback(async (eventId: string, calendarId?: string) => {
    setMutating(true)
    try {
      const res = await fetch('/api/calendar/events/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calendarId: calendarId || 'primary', eventId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Delete failed')
      await fetchEvents()
    } finally { setMutating(false) }
  }, [fetchEvents])

  return {
    events, loading, error, todayEvents, getEventsForDate, getWeekEvents, refetch: fetchEvents,
    calendars, enabledCalendarIds, toggleCalendar,
    activeTab, setActiveTab,
    createEvent, updateEvent, deleteEvent, mutating,
    fetchCalendars,
  }
}
