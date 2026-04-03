import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../shared/AppShell'
import { TODOS, CAL } from '../../lib/data'

/* ── Helpers ─────────────────────────────────────────── */

/** Priority to display badge */
function prioBadge(prio: string): { label: string; bg: string; color: string } {
  switch (prio) {
    case 'h':
      return { label: 'P0', bg: 'var(--rc)', color: 'var(--r)' }
    case 'm':
      return { label: 'P1', bg: 'var(--ac)', color: 'var(--a)' }
    case 'l':
      return { label: 'P2', bg: 'var(--blc)', color: 'var(--bl)' }
    default:
      return { label: prio || '\u2014', bg: 'rgba(0,0,0,.04)', color: 'var(--tx3)' }
  }
}

/** Project name to a display color */
function projColor(proj: string): { bg: string; color: string } {
  if (!proj) return { bg: 'rgba(0,0,0,.04)', color: 'var(--tx3)' }
  const lower = proj.toLowerCase()
  if (lower.includes('heb')) return { bg: 'var(--gc)', color: 'var(--g)' }
  if (lower.includes('still')) return { bg: 'var(--ac)', color: 'var(--a)' }
  if (lower.includes('mission') || lower.includes('mis')) return { bg: 'rgba(124,77,255,.06)', color: 'var(--p)' }
  if (lower.includes('fin')) return { bg: 'var(--blc)', color: 'var(--bl)' }
  if (lower.includes('tennis')) return { bg: 'var(--tc)', color: 'var(--t)' }
  if (lower.includes('ai-') || lower.includes('ai ')) return { bg: 'rgba(124,77,255,.06)', color: 'var(--p)' }
  if (lower.includes('mck')) return { bg: 'var(--blc)', color: 'var(--bl)' }
  return { bg: 'rgba(0,0,0,.04)', color: 'var(--tx3)' }
}

/** Calendar entry dot color */
function calDotColor(s: string): string {
  const lower = (s || '').toLowerCase()
  if (lower.includes('hebamm')) return 'var(--g)'
  if (lower.includes('tennis')) return 'var(--t)'
  if (lower.includes('mission') || lower.includes('sprint')) return 'var(--p)'
  if (lower.includes('steuer') || lower.includes('tax')) return 'var(--a)'
  if (lower.includes('zoom')) return 'var(--bl)'
  return 'var(--bl)'
}

/* ── Types for static display data ────────────────────── */

interface WeekDay {
  label: string
  info: string
  color: string
  done?: boolean
  today?: boolean
}

interface TickerItem {
  agent: string
  color: string
  text: string
}

/* ── Component ──────────────────────────────────────────── */

export default function TermineTodos() {
  const [pipelineOpen, setPipelineOpen] = useState(false)
  const navigate = useNavigate()

  /* ── Derived data ────────────────────────────────── */

  const openTodos = TODOS.filter((t) => !t.done)
  const overdueTodos = TODOS.filter((t) => t.ov && !t.done)
  const doneTodos = TODOS.filter((t) => t.done)
  const todayEntries = CAL.filter((c) => c.today)
  const allCalEntries = CAL

  // Week days - static for now (no real week data in parser)
  const todayCount = todayEntries.length
  const weekDays: WeekDay[] = [
    { label: 'Mo', info: `${todayCount} Termine`, color: 'var(--g)', done: true },
    { label: 'Di', info: `${openTodos.length} Todos`, color: 'var(--g)', done: true },
    { label: 'Mi', info: `${allCalEntries.length} Termine`, color: 'var(--g)', done: true },
    { label: 'Do', info: `${todayCount} Termine \u00B7 ${openTodos.length} Todos`, color: 'var(--bl)', today: true },
    { label: 'Fr', info: `${allCalEntries.length - todayCount} Termine`, color: 'var(--tx3)' },
    { label: 'Sa', info: '\u2014', color: 'var(--pk)' },
    { label: 'So', info: '\u2014', color: 'var(--pk)' },
  ]

  // Ticker items from real data
  const feedItems: TickerItem[] = [
    ...todayEntries.map((c) => ({
      agent: c.t,
      color: calDotColor(c.s),
      text: `${c.n} -- ${c.s}`,
    })),
    ...overdueTodos.slice(0, 3).map((t) => ({
      agent: 'overdue',
      color: 'var(--r)',
      text: t.txt.substring(0, 50),
    })),
  ]

  // High-priority open todos to show (limit to first 8)
  const displayTodos = openTodos.slice(0, 8)

  return (
    <AppShell title="Termine & Todos" ledColor="bl">
      {/* KPI Row */}
      <div className="krow">
        <div className="kpi cf" style={{ '--kc': 'var(--blg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--blg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--bl)">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--bl)' }}>{todayCount}</div>
            <div className="kl">Termine heute</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--ag)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--ag)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--a)">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--a)' }}>{openTodos.length}</div>
            <div className="kl">Offene Todos</div>
          </div>
          {overdueTodos.length > 0 && (
            <span className="kx" style={{ background: 'var(--rc)', color: 'var(--r)' }}>{overdueTodos.length} overdue</span>
          )}
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--gg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--gg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--g)">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--g)' }}>{doneTodos.length}</div>
            <div className="kl">Erledigt</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--pkg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--pkg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--pk)">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--pk)' }}>{allCalEntries.length}</div>
            <div className="kl">Termine gesamt</div>
          </div>
        </div>
      </div>

      {/* Week Pipeline */}
      <div style={{ padding: '0 40px', marginBottom: 14, flexShrink: 0 }}>
        <div className="cf" style={{ overflow: 'hidden' }}>
          <div
            style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
            onClick={() => setPipelineOpen((p) => !p)}
          >
            <span className="st" style={{ whiteSpace: 'nowrap' }}>Woche</span>
            <div className="in" style={{ flex: 1, height: 10, borderRadius: 5, display: 'flex', gap: 3, overflow: 'hidden' }}>
              <div style={{ flex: 1, height: '100%', borderRadius: 4, background: 'var(--g)', opacity: 0.4 }} />
              <div style={{ flex: 1, height: '100%', borderRadius: 4, background: 'var(--g)', opacity: 0.4 }} />
              <div style={{ flex: 1, height: '100%', borderRadius: 4, background: 'var(--g)', opacity: 0.4 }} />
              <div className="sl" style={{ flex: 1, height: '100%', borderRadius: 4, background: 'var(--bl)', animation: 'lp 3s ease-in-out infinite', '--lc': 'var(--blg)' } as React.CSSProperties} />
              <div style={{ flex: 1, height: '100%', borderRadius: 4, background: 'var(--tx3)', opacity: 0.2 }} />
              <div style={{ flex: 1, height: '100%', borderRadius: 4, background: 'var(--pk)', opacity: 0.3 }} />
              <div style={{ flex: 1, height: '100%', borderRadius: 4, background: 'var(--pk)', opacity: 0.15 }} />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: 'var(--bl)', whiteSpace: 'nowrap' }}>Heute</span>
            <span style={{ fontSize: 10, color: 'var(--tx3)', cursor: 'pointer' }}>{pipelineOpen ? '\u25B2' : '\u25BC'}</span>
          </div>
          {pipelineOpen && (
            <div style={{ padding: '14px 22px 18px', borderTop: '1px solid rgba(0,0,0,.04)', marginTop: 10, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {weekDays.map((d) => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, minWidth: 100 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: d.color }}>
                    {d.label} {d.done ? '\u2713' : d.today ? '\u2192 heute' : ''}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{d.info}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section labels */}
      <div style={{ padding: '0 40px', marginBottom: 10, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <span className="st">Heute & Todos</span>
        <span className="st" style={{ marginLeft: 'auto', paddingRight: 400 }}>Detail & KANI</span>
      </div>

      {/* Main body */}
      <div className="tbody">
        <div className="tleft">
          {/* Heute Termine */}
          <div className="tcard cf">
            <div className="tcard-hdr">
              <div className="tcard-title">
                <div
                  className="sl"
                  style={{
                    width: 8,
                    height: 8,
                    background: 'var(--bl)',
                    '--lc': 'var(--blg)',
                    animation: 'lp 3s ease-in-out infinite',
                  } as React.CSSProperties}
                />
                Heute -- Termine
              </div>
              <span className="tcard-count">{todayCount} Termine</span>
            </div>
            {todayEntries.length > 0 ? (
              todayEntries.map((cal, i) => (
                <div key={i} className="tentry">
                  <span className="tentry-dot" style={{ background: calDotColor(cal.s) }} />
                  <div className="tentry-time">{cal.t}</div>
                  <div className="tentry-body">
                    <div className="tentry-title">{cal.n}</div>
                    <div className="tentry-desc">{cal.s || '\u2014'}</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '12px 16px', color: 'var(--tx3)', fontSize: 11 }}>
                Keine Termine
              </div>
            )}
            {/* Upcoming (non-today) */}
            {allCalEntries.filter((c) => !c.today).length > 0 && (
              <>
                <div style={{ padding: '8px 16px 4px', fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Kommende
                </div>
                {allCalEntries.filter((c) => !c.today).map((cal, i) => (
                  <div key={`upcoming-${i}`} className="tentry" style={{ opacity: 0.6 }}>
                    <span className="tentry-dot" style={{ background: calDotColor(cal.s) }} />
                    <div className="tentry-time">{cal.t}</div>
                    <div className="tentry-body">
                      <div className="tentry-title">{cal.n}</div>
                      <div className="tentry-desc">{cal.s || '\u2014'}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Offene Todos */}
          <div className="tcard cf">
            <div className="tcard-hdr">
              <div className="tcard-title">
                <div className="sl" style={{ width: 8, height: 8, background: 'var(--a)', '--lc': 'var(--ag)' } as React.CSSProperties} />
                Offene Todos
              </div>
              <span className="tcard-count">{displayTodos.length} angezeigt &middot; {openTodos.length} gesamt</span>
            </div>
            {displayTodos.length > 0 ? (
              displayTodos.map((todo) => {
                const pb = prioBadge(todo.prio)
                const pc = projColor(todo.proj)
                return (
                  <div key={todo.id} className="tentry">
                    <div
                      className="todo-chk in"
                      style={todo.done ? { background: 'var(--g)', borderColor: 'var(--g)' } : undefined}
                    />
                    <div style={{ width: 0 }} />
                    <div className="tentry-body">
                      <div className="tentry-title" style={todo.ov ? { color: 'var(--r)' } : undefined}>
                        {todo.txt}
                      </div>
                      <div className="tentry-desc">
                        {todo.due || '\u2014'}{todo.proj ? ` \u00B7 ${todo.proj}` : ''}
                      </div>
                      <div className="tentry-tags">
                        <span className="tentry-tag" style={{ background: pb.bg, color: pb.color }}>{pb.label}</span>
                        {todo.proj && (
                          <span
                            className="tentry-tag"
                            style={{ background: pc.bg, color: pc.color, cursor: 'pointer' }}
                            onClick={() => {
                              // Find matching project ID - use proj prefix
                              navigate(`/projekte/${todo.proj}`)
                            }}
                          >
                            {todo.proj}
                          </span>
                        )}
                        {todo.ov && (
                          <span className="tentry-tag" style={{ background: 'var(--rc)', color: 'var(--r)' }}>Overdue</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div style={{ padding: '12px 16px', color: 'var(--tx3)', fontSize: 11 }}>
                Keine Todos
              </div>
            )}
          </div>
        </div>

        {/* Right: Detail + KANI */}
        <div className="tright">
          <div className="tdet cf">
            <div className="tdet-hdr">
              <div className="tdet-title">Heute -- Ubersicht</div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, fontWeight: 700, color: 'var(--bl)' }}>Heute</div>
            </div>
            <div className="tdet-body">
              <div>
                <div className="tdet-label">Tagesplan</div>
                <div className="tdet-text">
                  {todayEntries.length > 0 ? (
                    todayEntries.map((cal, i) => (
                      <span key={i}>
                        <b style={{ color: calDotColor(cal.s) }}>{cal.t}</b> {cal.n}
                        {i < todayEntries.length - 1 && <br />}
                      </span>
                    ))
                  ) : (
                    'Keine Termine heute'
                  )}
                </div>
              </div>
              <div>
                <div className="tdet-label">Prioritaeten</div>
                {overdueTodos.length > 0 && (
                  <div className="tdet-text" style={{ color: 'var(--r)' }}>
                    {overdueTodos.map((t, i) => (
                      <span key={t.id}>
                        {t.txt.substring(0, 60)} -- <b>ueberfaellig!</b>
                        {i < overdueTodos.length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                )}
                <div className="tdet-text">
                  {openTodos.filter((t) => t.prio === 'h').slice(0, 3).map((t, i) => (
                    <span key={t.id}>
                      {t.txt.substring(0, 60)}
                      {i < 2 && <br />}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="tdet-label">Statistik</div>
                <div className="tdet-text">
                  {openTodos.length} offene Todos<br />
                  {doneTodos.length} erledigt<br />
                  {allCalEntries.length} Termine gesamt
                </div>
              </div>
            </div>
          </div>

          <div className="tkani cf">
            <div className="tkani-hdr">
              <div className="tkani-av">
                <svg viewBox="0 0 24 24">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                </svg>
              </div>
              <span className="tkani-nm">KANI &middot; Tagesplanung</span>
              <span style={{ fontSize: 7, color: 'var(--g)', marginLeft: 'auto' }}>Online</span>
            </div>
            <div className="tkani-body">
              <div className="tkm k in">
                Heute hast du {todayCount} Termine und {openTodos.length} offene Todos.{' '}
                {overdueTodos.length > 0
                  ? `${overdueTodos.length} davon sind ueberfaellig.`
                  : 'Alles im Zeitplan.'}
              </div>
              <div className="tkm u">Was hat Prioritaet?</div>
              <div className="tkm k in">
                {openTodos.filter((t) => t.prio === 'h').length > 0
                  ? `${openTodos.filter((t) => t.prio === 'h').length} High-Priority Todos. Empfehlung: Zuerst "${openTodos.filter((t) => t.prio === 'h')[0]?.txt.substring(0, 40)}" abschliessen.`
                  : 'Keine High-Priority Todos offen. Freie Bahn fuer neue Aufgaben.'}
              </div>
            </div>
            <div className="tkani-in">
              <input className="tkani-inp in" placeholder="Frag KANI zum Tagesplan..." readOnly />
              <button className="tkani-send">
                <svg viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: Notifications + Quick Access */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 20, padding: '0 40px', marginTop: 16, flexShrink: 0 }}>
        {/* Notifications */}
        <div className="notif cf">
          <div className="notif-t">Notifications</div>
          <div className="notif-g">
            <div className="notif-cat">
              <div className="btn3d btn3d-lg" style={{ '--bc': 'var(--rg)' } as React.CSSProperties}>
                <span className="notif-badge" style={{ background: 'var(--r)', boxShadow: '0 2px 8px var(--rg)' }}>{overdueTodos.length}</span>
                <svg viewBox="0 0 24 24" stroke="var(--r)"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              </div>
              <div className="notif-label" style={{ color: 'var(--r)' }}>Overdue</div>
              <div className="notif-detail">
                {overdueTodos.slice(0, 3).map((t, i) => (
                  <span key={t.id}>
                    <span style={{ color: 'var(--r)' }}>{'\u25CF'}</span> {t.txt.substring(0, 40)}
                    {i < Math.min(overdueTodos.length, 3) - 1 && <br />}
                  </span>
                ))}
                {overdueTodos.length === 0 && <span style={{ color: 'var(--tx3)' }}>Keine</span>}
              </div>
            </div>
            <div className="notif-cat">
              <div className="btn3d btn3d-lg" style={{ '--bc': 'var(--ag)' } as React.CSSProperties}>
                <span className="notif-badge" style={{ background: 'var(--a)', boxShadow: '0 2px 8px var(--ag)' }}>
                  {openTodos.filter((t) => t.prio === 'h').length}
                </span>
                <svg viewBox="0 0 24 24" stroke="var(--a)"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>
              </div>
              <div className="notif-label" style={{ color: 'var(--a)' }}>High Prio</div>
              <div className="notif-detail">
                {openTodos.filter((t) => t.prio === 'h').slice(0, 3).map((t, i) => (
                  <span key={t.id}>
                    <span style={{ color: 'var(--a)' }}>{'\u25CF'}</span> {t.txt.substring(0, 40)}
                    {i < 2 && <br />}
                  </span>
                ))}
              </div>
            </div>
            <div className="notif-cat">
              <div className="btn3d btn3d-lg" style={{ '--bc': 'var(--gg)' } as React.CSSProperties}>
                <span className="notif-badge" style={{ background: 'var(--g)', boxShadow: '0 2px 8px var(--gg)' }}>{doneTodos.length}</span>
                <svg viewBox="0 0 24 24" stroke="var(--g)"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
              </div>
              <div className="notif-label" style={{ color: 'var(--g)' }}>Erledigt</div>
              <div className="notif-detail">
                {doneTodos.slice(0, 3).map((t, i) => (
                  <span key={t.id}>
                    <span style={{ color: 'var(--g)' }}>{'\u25CF'}</span> {t.txt.substring(0, 40)}
                    {i < Math.min(doneTodos.length, 3) - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
            <div className="notif-cat">
              <div className="btn3d btn3d-lg" style={{ '--bc': 'var(--blg)' } as React.CSSProperties}>
                <span className="notif-badge" style={{ background: 'var(--bl)', boxShadow: '0 2px 8px var(--blg)' }}>{todayCount}</span>
                <svg viewBox="0 0 24 24" stroke="var(--bl)"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              </div>
              <div className="notif-label" style={{ color: 'var(--bl)' }}>Heute</div>
              <div className="notif-detail">
                {todayEntries.slice(0, 3).map((c, i) => (
                  <span key={i}>
                    <span style={{ color: 'var(--bl)' }}>{'\u25CF'}</span> <b>{c.t}</b> {c.n}
                    {i < Math.min(todayEntries.length, 3) - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="qa cf">
          <div className="qa-t">Quick Access</div>
          <div className="qa-g">
            <div className="qa-item" onClick={() => navigate('/thinktank')}>
              <div className="btn3d" style={{ '--bc': 'var(--pg)' } as React.CSSProperties}>
                <svg viewBox="0 0 24 24" stroke="var(--p)"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <span className="qa-lb">Thinktank</span>
              <span className="qa-sb">{TODOS.length > 0 ? 'Ideen' : '\u2014'}</span>
            </div>
            <div className="qa-item" onClick={() => navigate('/briefing')}>
              <div className="btn3d" style={{ '--bc': 'var(--tg)' } as React.CSSProperties}>
                <svg viewBox="0 0 24 24" stroke="var(--t)"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /></svg>
              </div>
              <span className="qa-lb">Briefing</span>
              <span className="qa-sb">Heute</span>
            </div>
            <div className="qa-item" onClick={() => navigate('/agents')}>
              <div className="btn3d" style={{ '--bc': 'var(--og)' } as React.CSSProperties}>
                <svg viewBox="0 0 24 24" stroke="var(--o)"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
              </div>
              <span className="qa-lb">Agents</span>
              <span className="qa-sb">{'\u2014'}</span>
            </div>
            <div className="qa-item" onClick={() => navigate('/backoffice')}>
              <div className="btn3d" style={{ '--bc': 'rgba(30,30,30,.06)' } as React.CSSProperties}>
                <svg viewBox="0 0 24 24" stroke="var(--tx2)"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              </div>
              <span className="qa-lb">Backoffice</span>
              <span className="qa-sb">Admin</span>
            </div>
            <div className="qa-item" onClick={() => navigate('/termine-todos')}>
              <div className="btn3d" style={{ '--bc': 'var(--blg)' } as React.CSSProperties}>
                <svg viewBox="0 0 24 24" stroke="var(--bl)"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /></svg>
              </div>
              <span className="qa-lb">Termine & Todos</span>
              <span className="qa-sb">Aufgaben</span>
            </div>
            <div className="qa-item" onClick={() => navigate('/private')}>
              <div className="btn3d" style={{ '--bc': 'var(--pkg)' } as React.CSSProperties}>
                <svg viewBox="0 0 24 24" stroke="var(--pk)"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <span className="qa-lb">Private</span>
              <span className="qa-sb">Persoenlich</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Feed */}
      <div className="ticker-w">
        <div className="ticker cf" style={{ borderRadius: 24 }}>
          <div className="ticker-lbl">
            <span className="ticker-ld" style={{ background: 'var(--bl)', boxShadow: '0 0 10px var(--blg)' }} />
            TERMINE
          </div>
          <div className="ticker-c">
            <div className="ticker-s">
              {[...feedItems, ...feedItems].map((item, i) => (
                <div key={i} className="ticker-i">
                  <span className="ticker-id" style={{ background: item.color }} />
                  <span className="ticker-ia" style={{ color: item.color }}>{item.agent}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
