import { useState, useRef, useEffect } from 'react'
import { Header } from '../shared/Header.tsx'
import { SplitLayout } from '../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText, TcStatRow, TcStat } from '../shared/PreviewPanel.tsx'
import { BottomTicker } from '../shared/BottomTicker.tsx'
import { hubCategories, emailGroups } from '../../lib/categories.ts'
import { useMissionControl } from '../../lib/MissionControlProvider.tsx'
import { useTodoActions } from '../../lib/useTodoActions.ts'
import { useCalendarEvents } from '../../hooks/useCalendarEvents.ts'
import { useEmailUnread } from '../../hooks/useEmailUnread.ts'
import { useEmailTriage } from '../../hooks/useEmailTriage.ts'
import type { CalendarEvent, CalendarInfo, TriagedEmail, EmailCategory, TriageStats } from '../../lib/types.ts'
import { Plus, Check, Trash2, ExternalLink, Mail, Calendar, Clock, ChevronLeft, ChevronRight, Pencil, X, Save, RefreshCw, Send, Bot, FileText, Archive, Eye } from 'lucide-react'

interface Props { toggleTheme: () => void }

// ============================================================
// Calendar Helpers
// ============================================================

function formatTime(iso: string) {
  if (!iso || !iso.includes('T')) return 'Ganztägig'
  const d = new Date(iso)
  return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

function formatDuration(start: string, end: string) {
  if (!start.includes('T') || !end.includes('T')) return 'Ganztägig'
  const ms = new Date(end).getTime() - new Date(start).getTime()
  const mins = Math.round(ms / 60000)
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function getDayLabel(date: Date) {
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
  return days[date.getDay()]
}

function isSameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

const MONTH_NAMES = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']

// ============================================================
// Calendar Components — Hybrid Multi-Calendar
// ============================================================

function CalendarToggles({ calendars, enabledIds, onToggle }: {
  calendars: CalendarInfo[]; enabledIds: Set<string>; onToggle: (id: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
      {calendars.map(c => (
        <button
          key={c.id}
          onClick={() => onToggle(c.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 6,
            border: `1px solid ${enabledIds.has(c.id) ? c.backgroundColor + '60' : 'rgba(255,255,255,0.06)'}`,
            background: enabledIds.has(c.id) ? c.backgroundColor + '12' : 'transparent',
            cursor: 'pointer', fontSize: 10, fontWeight: 600,
            color: enabledIds.has(c.id) ? c.backgroundColor : 'var(--tx3)',
            opacity: enabledIds.has(c.id) ? 1 : 0.5,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: 2, background: c.backgroundColor, flexShrink: 0 }} />
          {c.name}
        </button>
      ))}
    </div>
  )
}

function CalendarViewSwitcher({ view, onViewChange }: {
  view: string; onViewChange: (v: string) => void
}) {
  const views = [
    { key: 'tag', label: 'Tag' },
    { key: 'woche', label: 'Woche' },
    { key: 'monat', label: 'Monat' },
    { key: 'jahr', label: 'Jahr' },
  ]
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
      {views.map(v => (
        <button
          key={v.key}
          className="ghost-btn"
          onClick={() => onViewChange(v.key)}
          style={{
            padding: '5px 12px', borderRadius: 6, fontSize: 10, fontWeight: 700,
            letterSpacing: 1, textTransform: 'uppercase',
            background: view === v.key ? 'rgba(0,255,136,0.08)' : 'transparent',
            color: view === v.key ? 'var(--g)' : 'var(--tx3)',
            border: view === v.key ? '1px solid rgba(0,255,136,0.15)' : '1px solid transparent',
          }}
        >
          {v.label}
        </button>
      ))}
    </div>
  )
}

function CalendarToday({ events }: { events: CalendarEvent[] }) {
  if (events.length === 0) return <TcText>Keine Termine heute.</TcText>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {events.map(e => (
        <div key={e.id} className="ghost-card" style={{ '--hc': (e.calendarColor || 'var(--g)') + '40', padding: '12px 16px', gap: 4 } as React.CSSProperties}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: 2, background: e.calendarColor || 'var(--g)', flexShrink: 0 }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: e.calendarColor || 'var(--g)', minWidth: 48 }}>
              {formatTime(e.start)}
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{e.title}</span>
            <span style={{ fontSize: 10, color: 'var(--tx3)', marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace" }}>
              {formatDuration(e.start, e.end)}
            </span>
          </div>
          {e.location && <div style={{ fontSize: 11, color: 'var(--tx3)', paddingLeft: 64 }}>{e.location}</div>}
        </div>
      ))}
    </div>
  )
}

function CalendarWeek({ events, getEventsForDate, selectedDay, onDayClick }: {
  events: CalendarEvent[]; getEventsForDate: (d: Date) => CalendarEvent[];
  selectedDay: Date | null; onDayClick: (d: Date) => void
}) {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
      {days.map(d => {
        const dayEvents = getEventsForDate(d)
        const isToday = isSameDay(d, now)
        const isSelected = selectedDay && isSameDay(d, selectedDay)
        return (
          <div key={d.toISOString()} onClick={() => onDayClick(d)} style={{
            padding: '8px 6px', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 4, cursor: 'pointer',
            background: isToday ? 'rgba(0,240,255,0.06)' : 'transparent',
            border: isSelected ? '1px solid rgba(0,240,255,0.4)' : isToday ? '1px solid rgba(0,240,255,0.15)' : '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: isToday ? 'var(--c)' : 'var(--tx3)', letterSpacing: 1, textTransform: 'uppercase' }}>{getDayLabel(d)}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: isToday ? 'var(--c)' : 'var(--tx)' }}>{d.getDate()}</div>
            </div>
            {dayEvents.slice(0, 3).map(e => (
              <div key={e.id} style={{
                fontSize: 9, padding: '3px 5px', borderRadius: 4,
                background: (e.calendarColor || '#00ff88') + '14', color: e.calendarColor || 'var(--g)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {formatTime(e.start).replace('Ganztägig', '\u221e')} {e.title}
              </div>
            ))}
            {dayEvents.length > 3 && <div style={{ fontSize: 9, color: 'var(--tx3)', textAlign: 'center' }}>+{dayEvents.length - 3}</div>}
            {dayEvents.length === 0 && <div style={{ fontSize: 9, color: 'var(--tx3)', textAlign: 'center', opacity: 0.4 }}>\u2014</div>}
          </div>
        )
      })}
    </div>
  )
}

function CalendarMonth({ events, selectedDay, onDayClick, monthOffset = 0 }: {
  events: CalendarEvent[]; selectedDay: Date | null; onDayClick: (d: Date) => void; monthOffset?: number
}) {
  const now = new Date()
  const year = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1).getFullYear()
  const month = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1).getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = (firstDay.getDay() + 6) % 7

  const days: (Date | null)[] = Array(startOffset).fill(null)
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d))

  // Group events by day with colors
  const eventsByDay: Record<string, CalendarEvent[]> = {}
  for (const e of events) {
    const dateStr = e.start.split('T')[0]
    if (!eventsByDay[dateStr]) eventsByDay[dateStr] = []
    eventsByDay[dateStr].push(e)
  }

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', marginBottom: 10 }}>{MONTH_NAMES[month]} {year}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => (
          <div key={d} style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textAlign: 'center', padding: 4, letterSpacing: 1 }}>{d}</div>
        ))}
        {days.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} />
          const dateStr = d.toISOString().split('T')[0]
          const dayEvents = eventsByDay[dateStr] || []
          const isToday = isSameDay(d, now)
          const isSelected = selectedDay && isSameDay(d, selectedDay)
          // Get unique calendar colors for this day
          const colors = [...new Set(dayEvents.map(e => e.calendarColor || '#00ff88'))]
          return (
            <div key={dateStr} onClick={() => onDayClick(d)} style={{
              textAlign: 'center', padding: '6px 2px', borderRadius: 6, cursor: 'pointer',
              background: isSelected ? 'rgba(0,240,255,0.12)' : isToday ? 'rgba(0,240,255,0.06)' : 'transparent',
              border: isSelected ? '1px solid rgba(0,240,255,0.3)' : '1px solid transparent',
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: isToday || isSelected ? 700 : 400, color: isToday ? 'var(--c)' : isSelected ? '#00f0ff' : 'var(--tx2)' }}>
                {d.getDate()}
              </div>
              {colors.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
                  {colors.slice(0, 3).map((c, j) => (
                    <div key={j} style={{ width: 4, height: 4, borderRadius: '50%', background: c }} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CalendarYear({ events }: { events: CalendarEvent[] }) {
  const now = new Date()
  const year = now.getFullYear()
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', marginBottom: 12 }}>{year}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {Array.from({ length: 12 }, (_, m) => {
          const firstDay = new Date(year, m, 1)
          const lastDay = new Date(year, m + 1, 0)
          const startOffset = (firstDay.getDay() + 6) % 7
          const monthEvents = events.filter(e => { const d = new Date(e.start); return d.getMonth() === m && d.getFullYear() === year })
          const eventDays = new Set(monthEvents.map(e => new Date(e.start).getDate()))
          return (
            <div key={m} style={{ padding: 6 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: m === now.getMonth() ? 'var(--c)' : 'var(--tx3)', letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase' }}>
                {MONTH_NAMES[m].substring(0, 3)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
                {Array(startOffset).fill(null).map((_, j) => <div key={`e-${j}`} />)}
                {Array.from({ length: lastDay.getDate() }, (_, d) => {
                  const day = d + 1
                  const isToday = m === now.getMonth() && day === now.getDate()
                  const hasEvent = eventDays.has(day)
                  return (
                    <div key={day} style={{
                      width: 10, height: 10, borderRadius: 2, fontSize: 6, lineHeight: '10px', textAlign: 'center',
                      background: isToday ? 'rgba(0,240,255,0.2)' : hasEvent ? 'rgba(0,255,136,0.15)' : 'transparent',
                      color: isToday ? '#00f0ff' : hasEvent ? 'var(--g)' : 'var(--tx3)',
                      fontWeight: isToday ? 700 : 400,
                    }}>
                      {day}
                    </div>
                  )
                })}
              </div>
              <div style={{ fontSize: 8, color: 'var(--tx3)', marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>
                {monthEvents.length > 0 ? `${monthEvents.length} Termine` : ''}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CalendarDayDetail({ date, events, onEdit, onDelete, editingEvent, onEditSave, onEditCancel }: {
  date: Date; events: CalendarEvent[];
  onEdit: (e: CalendarEvent) => void; onDelete: (e: CalendarEvent) => void;
  editingEvent: CalendarEvent | null;
  onEditSave: (params: { eventId: string; calendarId?: string; title: string; start: string; end: string; location?: string; description?: string }) => void;
  onEditCancel: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  return (
    <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
      <TcLabel>{date.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })} \u2014 {events.length} Termine</TcLabel>
      {events.length === 0 && <TcText>Keine Termine an diesem Tag.</TcText>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {events.map(e => {
          const isEditing = editingEvent?.id === e.id
          if (isEditing) return <InlineEditEvent key={e.id} event={e} onSave={onEditSave} onCancel={onEditCancel} />
          return (
            <div key={e.id} className="ghost-card" style={{ '--hc': (e.calendarColor || 'var(--g)') + '40', padding: '12px 16px', gap: 6 } as React.CSSProperties}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: 2, background: e.calendarColor || 'var(--g)', flexShrink: 0 }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: e.calendarColor || 'var(--g)', minWidth: 48 }}>
                  {formatTime(e.start)}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', flex: 1 }}>{e.title}</span>
                <span style={{ fontSize: 10, color: 'var(--tx3)', fontFamily: "'JetBrains Mono', monospace" }}>{formatDuration(e.start, e.end)}</span>
              </div>
              {e.location && <div style={{ fontSize: 11, color: 'var(--tx3)', paddingLeft: 64 }}>{e.location}</div>}
              {e.description && <div style={{ fontSize: 11, color: 'var(--tx3)', paddingLeft: 64, maxHeight: 40, overflow: 'hidden' }}>{e.description}</div>}
              <div style={{ display: 'flex', gap: 6, paddingLeft: 64, marginTop: 4 }}>
                <button className="ghost-btn" onClick={() => onEdit(e)} style={{ padding: '3px 8px', fontSize: 10, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Pencil size={10} /> Bearbeiten
                </button>
                {confirmDelete === e.id ? (
                  <>
                    <button className="ghost-btn" onClick={() => { onDelete(e); setConfirmDelete(null) }} style={{ padding: '3px 8px', fontSize: 10, color: 'var(--r)' }}>Ja, löschen</button>
                    <button className="ghost-btn" onClick={() => setConfirmDelete(null)} style={{ padding: '3px 8px', fontSize: 10 }}>Abbrechen</button>
                  </>
                ) : (
                  <button className="ghost-btn" onClick={() => setConfirmDelete(e.id)} style={{ padding: '3px 8px', fontSize: 10, color: 'var(--tx3)' }}>
                    <Trash2 size={10} /> Löschen
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function InlineEditEvent({ event, onSave, onCancel }: {
  event: CalendarEvent;
  onSave: (params: { eventId: string; calendarId?: string; title: string; start: string; end: string; location?: string; description?: string }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(event.title)
  const startDate = event.start.split('T')[0]
  const startTime = event.start.includes('T') ? event.start.split('T')[1]?.substring(0, 5) || '09:00' : '09:00'
  const endTime = event.end.includes('T') ? event.end.split('T')[1]?.substring(0, 5) || '10:00' : '10:00'
  const [sTime, setSTime] = useState(startTime)
  const [eTime, setETime] = useState(endTime)
  const [location, setLocation] = useState(event.location || '')

  const inputStyle = { padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'var(--tx)', fontSize: 12, fontFamily: "'Space Grotesk', sans-serif", outline: 'none', width: '100%' }

  return (
    <div className="ghost-card" style={{ '--hc': (event.calendarColor || 'var(--g)') + '40', padding: '14px 16px', gap: 8 } as React.CSSProperties}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titel" style={inputStyle} />
      <div style={{ display: 'flex', gap: 8 }}>
        <input type="time" value={sTime} onChange={e => setSTime(e.target.value)} style={{ ...inputStyle, width: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} />
        <span style={{ color: 'var(--tx3)', fontSize: 12, alignSelf: 'center' }}>\u2192</span>
        <input type="time" value={eTime} onChange={e => setETime(e.target.value)} style={{ ...inputStyle, width: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} />
      </div>
      <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Ort (optional)" style={inputStyle} />
      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        <button className="ghost-btn" onClick={() => onSave({
          eventId: event.id, calendarId: event.calendarId, title,
          start: event.allDay ? startDate : `${startDate}T${sTime}:00`,
          end: event.allDay ? startDate : `${startDate}T${eTime}:00`,
          location: location || undefined,
        })} style={{ padding: '5px 12px', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--g)' }}>
          <Save size={11} /> Speichern
        </button>
        <button className="ghost-btn" onClick={onCancel} style={{ padding: '5px 12px', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
          <X size={11} /> Abbrechen
        </button>
      </div>
    </div>
  )
}

function CalendarCreateForm({ date, calendars, onSubmit, onCancel, loading }: {
  date: Date; calendars: CalendarInfo[];
  onSubmit: (params: { calendarId: string; title: string; start: string; end: string; description?: string; location?: string; allDay?: boolean }) => Promise<void>;
  onCancel: () => void; loading: boolean;
}) {
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [allDay, setAllDay] = useState(false)
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const writable = calendars.filter(c => c.accessRole === 'owner' || c.accessRole === 'writer')
  const [calId, setCalId] = useState(writable.find(c => c.primary)?.id || writable[0]?.id || '')

  const dateStr = date.toISOString().split('T')[0]
  const inputStyle = { padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'var(--tx)', fontSize: 12, fontFamily: "'Space Grotesk', sans-serif", outline: 'none', width: '100%' }

  const handleSubmit = async () => {
    if (!title.trim()) return
    await onSubmit({
      calendarId: calId, title: title.trim(),
      start: allDay ? dateStr : `${dateStr}T${startTime}:00`,
      end: allDay ? dateStr : `${dateStr}T${endTime}:00`,
      description: description || undefined,
      location: location || undefined,
      allDay,
    })
  }

  return (
    <div style={{ marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
      <TcLabel>Neuer Termin \u2014 {date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })}</TcLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titel *" style={inputStyle} autoFocus />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {!allDay && (
            <>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} style={{ ...inputStyle, width: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} />
              <span style={{ color: 'var(--tx3)', fontSize: 12 }}>\u2192</span>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} style={{ ...inputStyle, width: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} />
            </>
          )}
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--tx3)', cursor: 'pointer', marginLeft: 'auto' }}>
            <input type="checkbox" checked={allDay} onChange={e => setAllDay(e.target.checked)} style={{ accentColor: 'var(--g)' }} /> Ganztägig
          </label>
        </div>
        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Ort (optional)" style={inputStyle} />
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Beschreibung (optional)" style={inputStyle} />
        {writable.length > 1 && (
          <select value={calId} onChange={e => setCalId(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            {writable.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          <button className="ghost-btn" onClick={handleSubmit} disabled={loading || !title.trim()} style={{
            padding: '6px 14px', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4,
            color: 'var(--g)', opacity: loading ? 0.5 : 1,
          }}>
            <Plus size={12} /> {loading ? 'Erstelle...' : 'Erstellen'}
          </button>
          <button className="ghost-btn" onClick={onCancel} style={{ padding: '6px 14px', fontSize: 10 }}>Abbrechen</button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Todo Tab Content
// ============================================================

function TodoList() {
  const { hubTodos } = useMissionControl()
  const { addTodo, setStatus, deleteTodo } = useTodoActions()
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState<'P1' | 'P2' | 'P3'>('P2')
  const inputRef = useRef<HTMLInputElement>(null)

  const openTodos = hubTodos.filter(t => t.status !== 'done')
  const doneTodos = hubTodos.filter(t => t.status === 'done')

  const prioColor: Record<string, string> = { P1: 'var(--r)', P2: 'var(--a)', P3: 'var(--tx3)' }

  const handleAdd = async () => {
    if (!newTitle.trim()) return
    await addTodo(null, newTitle.trim(), newPriority)
    setNewTitle('')
    setNewPriority('P2')
    inputRef.current?.focus()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Add form */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          ref={inputRef}
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Neues Todo..."
          style={{
            flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)', color: 'var(--tx)', fontSize: 13,
            fontFamily: "'Space Grotesk', sans-serif", outline: 'none',
          }}
        />
        <select
          value={newPriority}
          onChange={e => setNewPriority(e.target.value as 'P1' | 'P2' | 'P3')}
          style={{
            padding: '8px 8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)', color: prioColor[newPriority], fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="P1">P1</option>
          <option value="P2">P2</option>
          <option value="P3">P3</option>
        </select>
        <button onClick={handleAdd} className="ghost-btn" style={{ padding: '8px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Plus size={14} /> Add
        </button>
      </div>

      {/* Open todos */}
      <TcLabel>Offen ({openTodos.length})</TcLabel>
      {openTodos.length === 0 && <TcText>Keine offenen Todos.</TcText>}
      {openTodos.map(t => (
        <div key={t.id} className="ghost-card" style={{ '--hc': prioColor[t.priority] + '40', padding: '10px 14px', gap: 4, display: 'flex', alignItems: 'center' } as React.CSSProperties}>
          <button
            onClick={() => setStatus(String(t.id), 'done')}
            style={{ width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${prioColor[t.priority]}`, background: 'transparent', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)' }}>{t.title}</div>
            {t.due && <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>Fällig: {t.due}</div>}
          </div>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
            background: `${prioColor[t.priority]}15`, color: prioColor[t.priority],
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {t.priority}
          </span>
          <button
            onClick={() => deleteTodo(String(t.id))}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--tx3)', padding: 4, opacity: 0.5 }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}

      {/* Done todos */}
      {doneTodos.length > 0 && (
        <>
          <TcLabel>Erledigt ({doneTodos.length})</TcLabel>
          {doneTodos.map(t => (
            <div key={t.id} className="ghost-card" style={{ '--hc': 'var(--gg)', padding: '10px 14px', gap: 4, display: 'flex', alignItems: 'center', opacity: 0.4 } as React.CSSProperties}>
              <button
                onClick={() => setStatus(String(t.id), 'open')}
                style={{ width: 20, height: 20, borderRadius: 6, border: '1.5px solid var(--g)', background: 'rgba(0,255,136,0.15)', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Check size={12} stroke="var(--g)" />
              </button>
              <span style={{ fontSize: 13, color: 'var(--tx2)', textDecoration: 'line-through', flex: 1 }}>{t.title}</span>
              <button
                onClick={() => deleteTodo(String(t.id))}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--tx3)', padding: 4, opacity: 0.5 }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// ============================================================
// Email Triage Components
// ============================================================

const CATEGORY_COLORS: Record<EmailCategory, string> = { info: 'var(--bl)', action: 'var(--o)', spam: 'var(--tx3)', invoice: 'var(--p)' }
const CATEGORY_LABELS: Record<EmailCategory, string> = { info: 'INFO', action: 'AKTION', spam: 'SPAM', invoice: 'RECHNUNG' }
const CATEGORY_ICONS: Record<EmailCategory, string> = { info: '\u2139\ufe0f', action: '\u26a1', spam: '\ud83d\uddd1', invoice: '\ud83e\uddfe' }
const URGENCY_COLORS: Record<string, string> = { low: 'var(--g)', medium: 'var(--a)', high: 'var(--r)' }

function TriageKPIBar({ stats, color }: { stats: TriageStats; color: string }) {
  return (
    <TcStatRow>
      <TcStat value={`${stats.total}`} label="Verarbeitet" color={color} />
      <TcStat value={`${stats.action}`} label="Aktionen" color="var(--o)" />
      <TcStat value={`${stats.spam}`} label="Spam" color="var(--tx3)" />
      <TcStat value={`${stats.invoice}`} label="Rechnungen" color="var(--p)" />
    </TcStatRow>
  )
}

function TriagedEmailCard({ email, selected, onClick }: {
  email: TriagedEmail; selected: boolean; onClick: () => void
}) {
  const catColor = CATEGORY_COLORS[email.triage.category]
  const urgColor = URGENCY_COLORS[email.triage.urgency] || 'var(--tx3)'
  const timeStr = new Date(email.envelope.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  const dateStr = new Date(email.envelope.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })

  return (
    <div
      className="ghost-card"
      onClick={onClick}
      style={{
        '--hc': catColor + '40', padding: '10px 14px', gap: 4, cursor: 'pointer',
        border: selected ? `1px solid ${catColor}50` : undefined,
        background: selected ? `${catColor}08` : undefined,
      } as React.CSSProperties}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: 2, background: catColor, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {email.envelope.from.name || email.envelope.from.address}
        </span>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: urgColor, flexShrink: 0 }} />
        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: `${catColor}15`, color: catColor, letterSpacing: 0.5 }}>
          {CATEGORY_LABELS[email.triage.category]}
        </span>
      </div>
      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--tx2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: 14 }}>
        {email.envelope.subject}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 14 }}>
        <Bot size={10} stroke="var(--p)" />
        <span style={{ fontSize: 10, color: 'var(--tx3)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {email.triage.summary}
        </span>
        <span style={{ fontSize: 9, color: 'var(--tx3)', fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>
          {dateStr} {timeStr}
        </span>
      </div>
    </div>
  )
}

function EmailDetailExpanded({ email, fullBody, editDraft, setEditDraft, onApprove, onArchive, onDelete, onMoveInvoice, onTodo, onFetchBody, onClose, sending }: {
  email: TriagedEmail; fullBody: any; editDraft: string; setEditDraft: (s: string) => void;
  onApprove: () => void; onArchive: () => void; onDelete: () => void; onMoveInvoice: () => void; onTodo: () => void;
  onFetchBody: () => void; onClose: () => void; sending: boolean;
}) {
  const ctx = email.triage.sender_context
  const [showBody, setShowBody] = useState(false)

  const btnStyle = { padding: '6px 14px', fontSize: 10, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' as const, flexShrink: 0 }

  return (
    <div style={{ margin: '4px 0 8px', padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Header: Sender + Close */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', minWidth: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>{email.envelope.from.name || email.envelope.from.address}</span>
          {email.envelope.from.name && <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{email.envelope.from.address}</span>}
          {ctx && (
            <>
              <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: 'rgba(139,92,246,0.1)', color: 'var(--p)', fontWeight: 600 }}>
                {ctx.relationship}
              </span>
              {ctx.role && ctx.role !== ctx.relationship && (
                <span style={{ fontSize: 9, color: 'var(--tx3)' }}>({ctx.role})</span>
              )}
            </>
          )}
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--tx3)', padding: 4, flexShrink: 0 }}>
          <X size={14} />
        </button>
      </div>

      {/* Postfach */}
      <div style={{ fontSize: 9, color: 'var(--tx3)', display: 'flex', alignItems: 'center', gap: 4 }}>
        <Mail size={9} /> Postfach: <strong style={{ color: 'var(--tx2)' }}>{email.account}</strong>
      </div>

      {/* KANI: Reply draft */}
      {email.triage.category === 'action' && email.triage.suggested_action === 'reply' && email.triage.draft_reply && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <TcLabel>KANI-Entwurf</TcLabel>
          <textarea
            value={editDraft || email.triage.draft_reply}
            onChange={e => setEditDraft(e.target.value)}
            style={{
              width: '100%', minHeight: 100, padding: '10px 12px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
              color: 'var(--tx)', fontSize: 12, fontFamily: "'Space Grotesk', sans-serif",
              outline: 'none', resize: 'vertical',
            }}
          />
        </div>
      )}

      {/* KANI: Todo suggestion */}
      {email.triage.category === 'action' && email.triage.suggested_action === 'todo' && email.triage.todo_text && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <TcLabel>KANI-Vorschlag</TcLabel>
          <div style={{ fontSize: 12, color: 'var(--tx)', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,136,0,0.06)', border: '1px solid rgba(255,136,0,0.1)' }}>
            {email.triage.todo_text}
          </div>
        </div>
      )}

      {/* Action buttons — compact, single row */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        {/* Reply */}
        {email.triage.category === 'action' && email.triage.suggested_action === 'reply' && (
          <button className="ghost-btn" onClick={onApprove} disabled={sending} style={{ ...btnStyle, color: 'var(--g)' }}>
            <Send size={10} /> {sending ? 'Sende...' : 'Senden'}
          </button>
        )}
        {/* Todo */}
        {email.triage.category === 'action' && email.triage.suggested_action === 'todo' && (
          <button className="ghost-btn" onClick={onTodo} style={{ ...btnStyle, color: 'var(--g)' }}>
            <Plus size={10} /> Todo erstellen
          </button>
        )}
        {/* Invoice */}
        {email.triage.category === 'invoice' && (
          <button className="ghost-btn" onClick={onMoveInvoice} style={{ ...btnStyle, color: 'var(--p)' }}>
            <FileText size={10} /> Rechnungen
          </button>
        )}
        {/* Spam delete */}
        {email.triage.category === 'spam' && (
          <button className="ghost-btn" onClick={onDelete} style={{ ...btnStyle, color: 'var(--r)' }}>
            <Trash2 size={10} /> Löschen
          </button>
        )}
        {/* Archive — always available */}
        <button className="ghost-btn" onClick={onArchive} style={{ ...btnStyle, color: 'var(--tx3)' }}>
          <Archive size={10} /> Erledigt
        </button>
        {/* Delete — always available */}
        {email.triage.category !== 'spam' && (
          <button className="ghost-btn" onClick={onDelete} style={{ ...btnStyle, color: 'var(--tx3)', opacity: 0.6 }}>
            <Trash2 size={10} />
          </button>
        )}
        {/* Original toggle */}
        <button className="ghost-btn" onClick={() => { setShowBody(!showBody); if (!fullBody || fullBody.uid !== email.envelope.uid) onFetchBody() }}
          style={{ ...btnStyle, color: 'var(--tx3)', marginLeft: 'auto' }}>
          <Eye size={10} /> {showBody ? 'Ausblenden' : 'Original'}
        </button>
      </div>

      {/* Original email body */}
      {showBody && fullBody && fullBody.uid === email.envelope.uid && (
        <div style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ fontSize: 10, color: 'var(--tx3)', marginBottom: 8 }}>
            {fullBody.from.name} &lt;{fullBody.from.address}&gt; \u2014 {new Date(fullBody.date).toLocaleString('de-DE')}
          </div>
          <div style={{ fontSize: 11, color: 'var(--tx2)', whiteSpace: 'pre-wrap', maxHeight: 250, overflow: 'auto', lineHeight: 1.6 }}>
            {fullBody.textPlain.substring(0, 3000)}
          </div>
        </div>
      )}
      {showBody && (!fullBody || fullBody.uid !== email.envelope.uid) && (
        <TcText>Lade...</TcText>
      )}
    </div>
  )
}

function EmailTriageView({ groupId, color, glow, filterAccount, triage }: {
  groupId: string; color: string; glow: string; filterAccount?: string;
  triage: ReturnType<typeof useEmailTriage>;
}) {
  const {
    loading, triaging, sending,
    selectedEmail, setSelectedEmail,
    fullBody, editDraft, setEditDraft,
    fetchAndTriage, fetchGroup,
    getEmails, getEmailsByCategory, getStats,
    fetchBody, executeAction, approveDraft,
    deleteAllSpam, moveAllInvoices, isGroupFetched,
  } = triage

  const [activeFilter, setActiveFilter] = useState<EmailCategory | 'all'>('all')
  const stats = getStats(groupId, filterAccount)
  const fetched = isGroupFetched(groupId)

  // Auto-fetch on first view
  useEffect(() => {
    if (!fetched && !loading && !triaging) {
      if (filterAccount) fetchAndTriage(filterAccount, groupId)
      else fetchGroup(groupId)
    }
  }, [fetched, filterAccount, groupId]) // eslint-disable-line react-hooks/exhaustive-deps

  const filteredEmails = activeFilter === 'all'
    ? getEmails(groupId, filterAccount)
    : getEmailsByCategory(groupId, activeFilter, filterAccount)

  const handleTriage = () => {
    if (filterAccount) fetchAndTriage(filterAccount, groupId)
    else fetchGroup(groupId)
  }

  const handleEmailClick = (e: TriagedEmail) => {
    if (selectedEmail?.envelope.uid === e.envelope.uid && selectedEmail?.account === e.account) {
      setSelectedEmail(null)
    } else {
      setSelectedEmail(e)
      setEditDraft('')
    }
  }

  if (loading || triaging) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '40px 0' }}>
        <RefreshCw size={24} stroke={color} style={{ opacity: 0.6, animation: 'spin 1s linear infinite' }} />
        <TcText>{triaging ? 'KANI klassifiziert E-Mails...' : 'Postfach wird gelesen...'}</TcText>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* KPI Bar */}
      <TriageKPIBar stats={stats} color={color} />

      {/* Category filter buttons */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        {([['all', 'Alle', color, stats.total], ['action', 'Aktion', 'var(--o)', stats.action], ['invoice', 'Rechnungen', 'var(--p)', stats.invoice], ['info', 'Info', 'var(--bl)', stats.info], ['spam', 'Spam', 'var(--tx3)', stats.spam]] as const).map(([key, label, c, count]) => (
          <button
            key={key}
            className="ghost-btn"
            onClick={() => setActiveFilter(key as EmailCategory | 'all')}
            style={{
              padding: '5px 12px', borderRadius: 6, fontSize: 10, fontWeight: 700,
              background: activeFilter === key ? `${c}12` : 'transparent',
              color: activeFilter === key ? c : 'var(--tx3)',
              border: activeFilter === key ? `1px solid ${c}30` : '1px solid transparent',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            {label}
            {count > 0 && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9 }}>{count}</span>}
          </button>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          <button className="ghost-btn" onClick={handleTriage} style={{ padding: '4px 10px', fontSize: 9, color: 'var(--tx3)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <RefreshCw size={10} /> Aktualisieren
          </button>
        </div>
      </div>

      {/* Bulk actions for current filter */}
      {activeFilter === 'spam' && stats.spam > 0 && (
        <button className="ghost-btn" onClick={() => deleteAllSpam(groupId, filterAccount)} style={{ padding: '4px 10px', fontSize: 9, color: 'var(--r)', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Trash2 size={10} /> Alle {stats.spam} Spam löschen
        </button>
      )}
      {activeFilter === 'invoice' && stats.invoice > 0 && (
        <button className="ghost-btn" onClick={() => moveAllInvoices(groupId, filterAccount)} style={{ padding: '4px 10px', fontSize: 9, color: 'var(--p)', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 4 }}>
          <FileText size={10} /> Alle {stats.invoice} in Ordner "KANI/Rechnungen" verschieben
        </button>
      )}

      {/* Email list */}
      {filteredEmails.length === 0 && <TcText>Keine E-Mails in dieser Kategorie.</TcText>}
      {filteredEmails.map(e => {
        const isSelected = selectedEmail?.envelope.uid === e.envelope.uid && selectedEmail?.account === e.account
        return (
          <div key={`${e.account}:${e.envelope.uid}`}>
            <TriagedEmailCard email={e} selected={isSelected} onClick={() => handleEmailClick(e)} />
            {isSelected && (
              <EmailDetailExpanded
                email={e} fullBody={fullBody} editDraft={editDraft} setEditDraft={setEditDraft} sending={sending}
                onApprove={() => approveDraft(e, editDraft || e.triage.draft_reply || '')}
                onArchive={() => executeAction(e.account, e.envelope.uid, 'move', 'KANI/Bearbeitet')}
                onDelete={() => executeAction(e.account, e.envelope.uid, 'delete')}
                onMoveInvoice={() => executeAction(e.account, e.envelope.uid, 'move', 'KANI/Rechnungen')}
                onTodo={() => executeAction(e.account, e.envelope.uid, 'read')}
                onFetchBody={() => fetchBody(e.account, e.envelope.uid)}
                onClose={() => setSelectedEmail(null)}
              />
            )}
          </div>
        )
      })}

      {stats.total === 0 && activeFilter === 'all' && <TcText>Keine neuen E-Mails in diesem Postfach.</TcText>}
    </div>
  )
}

function EmailTriageOverview({ triage, getGroupUnread }: {
  triage: ReturnType<typeof useEmailTriage>; getGroupUnread: (emails: string[]) => number | null
}) {
  const { fetchGroup, getStats, isGroupFetched, loading } = triage
  const totalUnread = getGroupUnread(emailGroups.flatMap(g => g.accounts.map(a => a.email)))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {emailGroups.map(g => {
        const groupUnread = getGroupUnread(g.accounts.map(a => a.email))
        const fetched = isGroupFetched(g.id)
        const stats = fetched ? getStats(g.id) : null
        return (
          <div key={g.id} className="ghost-card" style={{ '--hc': g.glow, padding: '14px 18px', gap: 6 } as React.CSSProperties}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>{g.emoji}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>{g.name}</span>
              {groupUnread !== null && groupUnread > 0 && (
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: `${g.color}20`, color: g.color, fontFamily: "'JetBrains Mono', monospace" }}>
                  {groupUnread}
                </span>
              )}
              {stats && stats.action > 0 && (
                <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'var(--o)15', color: 'var(--o)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {stats.action} Aktionen
                </span>
              )}
              {!fetched && (
                <button className="ghost-btn" onClick={() => fetchGroup(g.id)} disabled={loading}
                  style={{ marginLeft: 'auto', padding: '3px 8px', fontSize: 9, color: g.color, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <RefreshCw size={9} /> Triagen
                </button>
              )}
              {fetched && (
                <span style={{ fontSize: 9, color: 'var(--g)', marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace" }}>
                  {stats?.total || 0} verarbeitet
                </span>
              )}
            </div>
            <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
              {g.accounts.length} Konten \u2014 {g.desc}
            </div>
          </div>
        )
      })}
      <TcLabel>Gesamt</TcLabel>
      <TcStatRow>
        <TcStat value="20" label="Konten" color="var(--bl)" />
        <TcStat value="5" label="Gruppen" color="var(--bl)" />
        <TcStat value={`${totalUnread !== null ? totalUnread : '\u2014'}`} label="Ungelesen" color="var(--o)" />
      </TcStatRow>
    </div>
  )
}

// ============================================================
// Hub Page
// ============================================================

const emailGroupMap: Record<string, string> = {
  'email-persoenlich': 'persoenlich',
  'email-stillzentrum': 'stillzentrum',
  'email-hebammenbuero': 'hebammenbuero',
  'email-mckay': 'mckay-agency',
  'email-hebammen-agency': 'hebammen-agency',
}

export function Hub({ toggleTheme }: Props) {
  const [sel, setSel] = useState(0)
  const [tab, setTab] = useState(0)
  const { hubTodos } = useMissionControl()
  const {
    todayEvents, getEventsForDate, getWeekEvents, events, loading: calLoading, error: calError,
    calendars, enabledCalendarIds, toggleCalendar, activeTab, setActiveTab,
    createEvent, updateEvent, deleteEvent, mutating: calMutating,
  } = useCalendarEvents()
  const { getGroupUnread, getUnread } = useEmailUnread()
  const emailTriage = useEmailTriage()

  // Calendar-specific state
  const [calView, setCalView] = useState('monat')
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [monthOffset, setMonthOffset] = useState(0)

  const cat = hubCategories[sel]

  // Dynamic stats for Kalender + Todos
  const dynamicCategories = hubCategories.map(c => {
    if (c.id === 'kalender') {
      return { ...c, stats: [{ label: 'Heute', value: calLoading ? '...' : `${todayEvents.length}` }, { label: 'Diese Woche', value: calLoading ? '...' : `${getWeekEvents().length}` }, { label: 'Kalender', value: `${calendars.length}` }] }
    }
    if (c.id === 'todos') {
      const open = hubTodos.filter(t => t.status !== 'done').length
      return { ...c, badge: `${open} offen`, stats: [{ label: 'Offen', value: `${open}` }, { label: 'Erledigt', value: `${hubTodos.filter(t => t.status === 'done').length}` }] }
    }
    const groupId = emailGroupMap[c.id]
    if (groupId) {
      const group = emailGroups.find(g => g.id === groupId)
      if (group) {
        const unread = getGroupUnread(group.accounts.map(a => a.email))
        return { ...c, stats: [{ label: 'Konten', value: `${group.accounts.length}` }, { label: 'Ungelesen', value: unread !== null ? `${unread}` : '\u2014' }] }
      }
    }
    if (c.id === 'email-hub') {
      const totalUnread = getGroupUnread(emailGroups.flatMap(g => g.accounts.map(a => a.email)))
      return { ...c, stats: [{ label: 'Gruppen', value: '5' }, { label: 'Ungelesen', value: totalUnread !== null ? `${totalUnread}` : '\u2014' }] }
    }
    return c
  })

  // Calendar tab change handler
  const handleTabChange = (i: number) => {
    setTab(i)
    if (cat.id === 'kalender') {
      if (i === 0) {
        setActiveTab('all')
      } else if (calendars[i - 1]) {
        setActiveTab(calendars[i - 1].id)
      }
    }
  }

  // Calendar content builder
  const buildCalendarContent = (showToggles: boolean, calColor?: string) => (
    <>
      {calError && <TcText>{calError}</TcText>}
      {showToggles && calendars.length > 0 && (
        <CalendarToggles calendars={calendars} enabledIds={enabledCalendarIds} onToggle={toggleCalendar} />
      )}
      <CalendarViewSwitcher view={calView} onViewChange={setCalView} />

      {calView === 'tag' && (
        <>
          <TcLabel>Termine heute \u2014 {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</TcLabel>
          <CalendarToday events={todayEvents} />
        </>
      )}
      {calView === 'woche' && (
        <CalendarWeek events={events} getEventsForDate={getEventsForDate} selectedDay={selectedDay} onDayClick={setSelectedDay} />
      )}
      {calView === 'monat' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <button className="ghost-btn" onClick={() => setMonthOffset(p => p - 1)} style={{ padding: '4px 8px' }}><ChevronLeft size={14} /></button>
            <button className="ghost-btn" onClick={() => setMonthOffset(0)} style={{ padding: '4px 8px', fontSize: 10, color: monthOffset === 0 ? 'var(--g)' : 'var(--tx3)' }}>Heute</button>
            <button className="ghost-btn" onClick={() => setMonthOffset(p => p + 1)} style={{ padding: '4px 8px' }}><ChevronRight size={14} /></button>
          </div>
          <CalendarMonth events={events} selectedDay={selectedDay} onDayClick={setSelectedDay} monthOffset={monthOffset} />
        </>
      )}
      {calView === 'jahr' && <CalendarYear events={events} />}

      {/* Day detail below grid */}
      {selectedDay && (calView === 'monat' || calView === 'woche') && (
        <CalendarDayDetail
          date={selectedDay}
          events={getEventsForDate(selectedDay)}
          onEdit={setEditingEvent}
          onDelete={async (e) => { await deleteEvent(e.id, e.calendarId) }}
          editingEvent={editingEvent}
          onEditSave={async (params) => { await updateEvent(params); setEditingEvent(null) }}
          onEditCancel={() => setEditingEvent(null)}
        />
      )}

      {/* Create form */}
      {showCreateForm && selectedDay && (
        <CalendarCreateForm
          date={selectedDay}
          calendars={calendars}
          onSubmit={async (params) => { await createEvent(params); setShowCreateForm(false) }}
          onCancel={() => setShowCreateForm(false)}
          loading={calMutating}
        />
      )}
    </>
  )

  // Build tabs based on selected category
  const buildTabs = () => {
    if (cat.id === 'kalender') {
      const tabs = [
        { label: 'Alle', content: buildCalendarContent(true) },
        ...calendars.map(cal => ({
          label: cal.name,
          content: buildCalendarContent(false, cal.backgroundColor),
        })),
      ]
      return tabs
    }

    if (cat.id === 'todos') {
      return [
        { label: 'Alle', content: <TodoList /> },
        { label: 'Statistiken', content: (
          <>
            <TcLabel>Todo-Statistiken</TcLabel>
            <TcStatRow>
              <TcStat value={`${hubTodos.filter(t => t.status !== 'done').length}`} label="Offen" color="var(--o)" />
              <TcStat value={`${hubTodos.filter(t => t.status === 'done').length}`} label="Erledigt" color="var(--g)" />
              <TcStat value={`${hubTodos.length}`} label="Gesamt" color="var(--bl)" />
            </TcStatRow>
          </>
        )},
      ]
    }

    if (cat.id === 'email-hub') {
      return [{ label: 'Übersicht', content: <EmailTriageOverview triage={emailTriage} getGroupUnread={getGroupUnread} /> }]
    }

    const groupId = emailGroupMap[cat.id]
    if (groupId) {
      const group = emailGroups.find(g => g.id === groupId)
      if (!group) return [{ label: 'Info', content: <TcText>Nicht gefunden.</TcText> }]
      return [
        { label: 'Alle', content: <EmailTriageView groupId={groupId} color={cat.color} glow={cat.glow} triage={emailTriage} /> },
        ...group.accounts.map(acc => ({
          label: acc.email.split('@')[0],
          content: <EmailTriageView groupId={groupId} color={cat.color} glow={cat.glow} filterAccount={acc.email} triage={emailTriage} />,
        })),
      ]
    }

    return [{ label: 'Info', content: <TcText>Kein Inhalt verfügbar.</TcText> }]
  }

  const tabs = buildTabs()

  return (
    <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        backLink={{ label: 'Cockpit', href: '/' }}
        title="Hub"
        toggleTheme={toggleTheme}
      />

      <SplitLayout
        ratio="55% 45%"
        left={
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className="st" style={{ padding: '0 2px' }}>Bereiche</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>
                {hubCategories.length} Bereiche
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {dynamicCategories.map((c, i) => (
                <div
                  key={c.id}
                  className="ghost-card"
                  style={{
                    '--hc': c.glow, padding: '18px 22px', gap: 8, cursor: 'pointer',
                    border: sel === i ? `1px solid ${c.color}30` : undefined,
                    background: sel === i ? `${c.color}06` : undefined,
                  } as React.CSSProperties}
                  onClick={() => { setSel(i); setTab(0); if (c.id === 'kalender') { setActiveTab('all'); setMonthOffset(0) } }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{c.emoji}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>{c.name}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                      background: `${c.color}15`, color: c.color, letterSpacing: 1, marginLeft: 'auto',
                    }}>
                      {c.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.5 }}>{c.desc}</div>
                  <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
                    {c.stats.map((s, si) => (
                      <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: c.color }}>{s.value}</span>
                        <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ width: 32, height: 3, borderRadius: 2, background: c.color, opacity: 0.5, marginTop: 2 }} />
                </div>
              ))}
            </div>
          </>
        }
        right={
          <PreviewPanel
            title={cat.name}
            ledColor={cat.color}
            ledGlow={cat.glow}
            badge={{ label: cat.badge, bg: `${cat.color}15`, color: cat.color }}
            tabs={tabs}
            activeTab={tab}
            onTabChange={handleTabChange}
            accentColor={cat.color}
            headerAction={cat.id === 'kalender' && selectedDay && !showCreateForm ? (
              <button
                className="ghost-btn"
                onClick={() => setShowCreateForm(true)}
                style={{ padding: '5px 10px', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--g)' }}
              >
                <Plus size={12} /> Termin
              </button>
            ) : undefined}
          />
        }
      />

      <BottomTicker
        label="HUB"
        ledColor="var(--t)"
        ledGlow="var(--tg)"
        items={[
          { color: 'var(--g)', label: 'KALENDER', labelColor: 'var(--g)', text: calLoading ? 'Laden...' : `${todayEvents.length} Termine heute \u2014 ${getWeekEvents().length} diese Woche \u2014 ${calendars.length} Kalender` },
          { color: 'var(--o)', label: 'TODOS', labelColor: 'var(--o)', text: `${hubTodos.filter(t => t.status !== 'done').length} offene Todos` },
          { color: 'var(--bl)', label: 'EMAIL', labelColor: 'var(--bl)', text: (() => { const t = getGroupUnread(emailGroups.flatMap(g => g.accounts.map(a => a.email))); return t !== null ? `${t} ungelesene Mails \u2014 20 Konten` : '20 Konten in 5 Gruppen' })() },
          { color: 'var(--p)', label: 'STRATO', labelColor: 'var(--p)', text: '17 Konten via Strato.de IMAP' },
        ]}
      />
    </div>
  )
}
