import { useState, useRef } from 'react'
import { Header } from '../shared/Header.tsx'
import { SplitLayout } from '../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText, TcStatRow, TcStat } from '../shared/PreviewPanel.tsx'
import { BottomTicker } from '../shared/BottomTicker.tsx'
import { hubCategories, emailGroups } from '../../lib/categories.ts'
import { useMissionControl } from '../../lib/MissionControlProvider.tsx'
import { useTodoActions } from '../../lib/useTodoActions.ts'
import { useCalendarEvents } from '../../hooks/useCalendarEvents.ts'
import type { CalendarEvent } from '../../lib/types.ts'
import { Plus, Check, Trash2, ExternalLink, Mail, Calendar, Clock } from 'lucide-react'

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

// ============================================================
// Calendar Tab Content
// ============================================================

function CalendarToday({ events }: { events: CalendarEvent[] }) {
  if (events.length === 0) {
    return <TcText>Keine Termine heute.</TcText>
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {events.map(e => (
        <div key={e.id} className="ghost-card" style={{ '--hc': 'var(--gg)', padding: '12px 16px', gap: 4 } as React.CSSProperties}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--g)', minWidth: 48 }}>
              {formatTime(e.start)}
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{e.title}</span>
            <span style={{ fontSize: 10, color: 'var(--tx3)', marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace" }}>
              {formatDuration(e.start, e.end)}
            </span>
          </div>
          {e.location && (
            <div style={{ fontSize: 11, color: 'var(--tx3)', paddingLeft: 58 }}>{e.location}</div>
          )}
        </div>
      ))}
    </div>
  )
}

function CalendarWeek({ events, getEventsForDate }: { events: CalendarEvent[]; getEventsForDate: (d: Date) => CalendarEvent[] }) {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
      {days.map(d => {
        const dayEvents = getEventsForDate(d)
        const isToday = isSameDay(d, now)
        return (
          <div key={d.toISOString()} style={{
            padding: '8px 6px', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 4,
            background: isToday ? 'rgba(0,240,255,0.06)' : 'transparent',
            border: isToday ? '1px solid rgba(0,240,255,0.15)' : '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: isToday ? 'var(--c)' : 'var(--tx3)', letterSpacing: 1, textTransform: 'uppercase' }}>
                {getDayLabel(d)}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: isToday ? 'var(--c)' : 'var(--tx)' }}>
                {d.getDate()}
              </div>
            </div>
            {dayEvents.slice(0, 3).map(e => (
              <div key={e.id} style={{
                fontSize: 9, padding: '3px 5px', borderRadius: 4,
                background: 'rgba(0,255,136,0.08)', color: 'var(--g)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {formatTime(e.start).replace('Ganztägig', '∞')} {e.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div style={{ fontSize: 9, color: 'var(--tx3)', textAlign: 'center' }}>+{dayEvents.length - 3}</div>
            )}
            {dayEvents.length === 0 && (
              <div style={{ fontSize: 9, color: 'var(--tx3)', textAlign: 'center', opacity: 0.4 }}>—</div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function CalendarMonth({ events }: { events: CalendarEvent[] }) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = (firstDay.getDay() + 6) % 7 // Monday = 0

  const days: (Date | null)[] = Array(startOffset).fill(null)
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d))
  }

  // Count events per day
  const eventCounts: Record<string, number> = {}
  for (const e of events) {
    const dateStr = e.start.split('T')[0]
    eventCounts[dateStr] = (eventCounts[dateStr] || 0) + 1
  }

  const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', marginBottom: 10 }}>
        {monthNames[month]} {year}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => (
          <div key={d} style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textAlign: 'center', padding: 4, letterSpacing: 1 }}>{d}</div>
        ))}
        {days.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} />
          const dateStr = d.toISOString().split('T')[0]
          const count = eventCounts[dateStr] || 0
          const isToday = isSameDay(d, now)
          return (
            <div key={dateStr} style={{
              textAlign: 'center', padding: '6px 2px', borderRadius: 6,
              background: isToday ? 'rgba(0,240,255,0.08)' : 'transparent',
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: isToday ? 700 : 400, color: isToday ? 'var(--c)' : 'var(--tx2)' }}>
                {d.getDate()}
              </div>
              {count > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
                  {Array.from({ length: Math.min(count, 3) }, (_, j) => (
                    <div key={j} style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--g)' }} />
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
// Email Tab Content
// ============================================================

function EmailGroupDetail({ groupId }: { groupId: string }) {
  const group = emailGroups.find(g => g.id === groupId)
  if (!group) return <TcText>Gruppe nicht gefunden.</TcText>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {group.accounts.map(acc => (
        <div key={acc.email} className="ghost-card" style={{ '--hc': group.glow, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 } as React.CSSProperties}>
          <Mail size={14} stroke={group.color} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {acc.email}
            </div>
            <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 1 }}>
              {acc.provider === 'gmail' ? 'Google Gmail' : acc.provider === 'strato' ? 'Strato' : 'Custom'}
            </div>
          </div>
          {acc.unread !== undefined && (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
              background: acc.unread > 0 ? `${group.color}20` : 'transparent',
              color: acc.unread > 0 ? group.color : 'var(--tx3)',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {acc.unread}
            </span>
          )}
          <a
            href={acc.provider === 'gmail' ? 'https://mail.google.com' : 'https://outlook.live.com/mail'}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--tx3)', opacity: 0.5, display: 'flex' }}
          >
            <ExternalLink size={13} />
          </a>
        </div>
      ))}
    </div>
  )
}

function EmailOverview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {emailGroups.map(g => (
        <div key={g.id} className="ghost-card" style={{ '--hc': g.glow, padding: '14px 18px', gap: 6 } as React.CSSProperties}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>{g.emoji}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>{g.name}</span>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
              background: `${g.color}15`, color: g.color, letterSpacing: 1, marginLeft: 'auto',
            }}>
              {g.badge}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
            {g.accounts.map(a => a.email.split('@')[0]).join(', ')}@{g.accounts[0].email.split('@')[1]}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 2 }}>
            {g.stats.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: g.color }}>{s.value}</span>
                <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <TcLabel>Gesamt</TcLabel>
      <TcStatRow>
        <TcStat value="20" label="Konten" color="var(--bl)" />
        <TcStat value="5" label="Gruppen" color="var(--bl)" />
        <TcStat value="—" label="Ungelesen" color="var(--o)" />
      </TcStatRow>
      <TcText>Unread-Counts werden verfügbar sobald der Strato MCP-Server eingerichtet ist.</TcText>
    </div>
  )
}

// ============================================================
// Hub Page
// ============================================================

// Map category ID to email group ID
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
  const { todayEvents, getEventsForDate, getWeekEvents, events, loading: calLoading, error: calError } = useCalendarEvents()

  const cat = hubCategories[sel]

  // Dynamic stats for Kalender + Todos
  const dynamicCategories = hubCategories.map(c => {
    if (c.id === 'kalender') {
      return { ...c, stats: [{ label: 'Heute', value: calLoading ? '...' : `${todayEvents.length}` }, { label: 'Diese Woche', value: calLoading ? '...' : `${getWeekEvents().length}` }] }
    }
    if (c.id === 'todos') {
      const open = hubTodos.filter(t => t.status !== 'done').length
      return { ...c, badge: `${open} offen`, stats: [{ label: 'Offen', value: `${open}` }, { label: 'Erledigt', value: `${hubTodos.filter(t => t.status === 'done').length}` }] }
    }
    return c
  })

  // Build tabs based on selected category
  const buildTabs = () => {
    if (cat.id === 'kalender') {
      return [
        { label: 'Heute', content: (
          <>
            <TcLabel>Termine heute — {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</TcLabel>
            {calError && <TcText>⚠ {calError}</TcText>}
            <CalendarToday events={todayEvents} />
          </>
        )},
        { label: 'Woche', content: (
          <>
            <TcLabel>Wochenübersicht</TcLabel>
            <CalendarWeek events={events} getEventsForDate={getEventsForDate} />
          </>
        )},
        { label: 'Monat', content: (
          <>
            <TcLabel>Monatsansicht</TcLabel>
            <CalendarMonth events={events} />
          </>
        )},
      ]
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
      return [
        { label: 'Übersicht', content: <EmailOverview /> },
      ]
    }

    // Email group categories
    const groupId = emailGroupMap[cat.id]
    if (groupId) {
      const group = emailGroups.find(g => g.id === groupId)
      return [
        { label: 'Konten', content: <EmailGroupDetail groupId={groupId} /> },
        { label: 'Info', content: (
          <>
            <TcLabel>Gruppe: {group?.name}</TcLabel>
            <TcText>{group?.desc}</TcText>
            <TcLabel>Provider</TcLabel>
            <TcText>{group?.accounts[0]?.provider === 'gmail' ? 'Google Gmail' : 'Strato.de (IMAP)'}</TcText>
            <TcLabel>Statistiken</TcLabel>
            <TcStatRow>
              {group?.stats.map((s, i) => (
                <TcStat key={i} value={s.value} label={s.label} color={cat.color} />
              ))}
            </TcStatRow>
          </>
        )},
      ]
    }

    return [{ label: 'Info', content: <TcText>Kein Inhalt verfügbar.</TcText> }]
  }

  const tabs = buildTabs()

  // Determine preview icon
  const previewIcon = cat.id === 'kalender' ? <Calendar size={14} /> :
    cat.id === 'todos' ? <Clock size={14} /> :
    <Mail size={14} />

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
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className="st" style={{ padding: '0 2px' }}>Bereiche</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>
                {hubCategories.length} Bereiche
              </span>
            </div>

            {/* Category cards grid */}
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
                  onClick={() => { setSel(i); setTab(0) }}
                >
                  {/* Emoji + Name + Badge */}
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

                  {/* Description */}
                  <div style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.5 }}>{c.desc}</div>

                  {/* Stats */}
                  <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
                    {c.stats.map((s, si) => (
                      <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: c.color }}>{s.value}</span>
                        <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{s.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Color accent bar */}
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
            onTabChange={setTab}
            accentColor={cat.color}
          />
        }
      />

      <BottomTicker
        label="HUB"
        ledColor="var(--t)"
        ledGlow="var(--tg)"
        items={[
          { color: 'var(--g)', label: 'KALENDER', labelColor: 'var(--g)', text: calLoading ? 'Laden...' : `${todayEvents.length} Termine heute — ${getWeekEvents().length} diese Woche` },
          { color: 'var(--o)', label: 'TODOS', labelColor: 'var(--o)', text: `${hubTodos.filter(t => t.status !== 'done').length} offene Todos` },
          { color: 'var(--bl)', label: 'EMAIL', labelColor: 'var(--bl)', text: `20 Konten in 5 Gruppen — Outlook` },
          { color: 'var(--p)', label: 'STRATO', labelColor: 'var(--p)', text: '17 Konten via Strato.de — MCP-Integration ausstehend' },
        ]}
      />
    </div>
  )
}
