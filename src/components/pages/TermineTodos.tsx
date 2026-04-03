import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../shared/AppShell'

/* ── Dummy Data ─────────────────────────────────────────── */

interface Termin {
  time: string
  title: string
  desc: string
  dotColor: string
  tagLabel: string
  tagBg: string
  tagColor: string
}

const termine: Termin[] = [
  { time: '09:00', title: 'Standup Team', desc: 'Kurzes Status-Update alle Projekte', dotColor: 'var(--bl)', tagLabel: 'Business', tagBg: 'var(--blc)', tagColor: 'var(--bl)' },
  { time: '10:30', title: 'Hebammen-Interview', desc: 'Validierung Mockup mit Hebamme Sarah', dotColor: 'var(--g)', tagLabel: 'Hebammenbuero', tagBg: 'var(--gc)', tagColor: 'var(--g)' },
  { time: '13:00', title: 'Investor Pitch Prep', desc: 'Deck finalisieren, Zahlen prüfen', dotColor: 'var(--p)', tagLabel: 'Business', tagBg: 'rgba(124,77,255,.06)', tagColor: 'var(--p)' },
  { time: '16:00', title: 'Startup Meetup', desc: 'AI & SaaS Founders, Stuttgart', dotColor: 'var(--t)', tagLabel: 'Network', tagBg: 'var(--tc)', tagColor: 'var(--t)' },
  { time: '19:30', title: 'Abendessen mit Familie', desc: 'Restaurant reserviert', dotColor: 'var(--pk)', tagLabel: 'Privat', tagBg: 'var(--rc)', tagColor: 'var(--pk)' },
]

interface Todo {
  title: string
  desc: string
  tags: { label: string; bg: string; color: string }[]
  overdue?: boolean
}

const todos: Todo[] = [
  { title: 'Steuererklarung Q1 einreichen', desc: 'Backoffice \u00B7 Buchhaltung -- uberfällig', tags: [{ label: 'Overdue', bg: 'var(--rc)', color: 'var(--r)' }, { label: 'P0', bg: 'var(--rc)', color: 'var(--r)' }], overdue: true },
  { title: 'Extended Mockup fertigstellen', desc: 'Hebammenbuero -- 6 Deep-Workflow Pages', tags: [{ label: 'Hebammenbuero', bg: 'var(--gc)', color: 'var(--g)' }, { label: 'P0', bg: 'var(--ac)', color: 'var(--a)' }] },
  { title: 'Pitch Deck Zahlen aktualisieren', desc: 'Business \u00B7 Investor Meeting vorbereiten', tags: [{ label: 'P0', bg: 'rgba(124,77,255,.06)', color: 'var(--p)' }] },
  { title: 'Freelancer-Vertrag prüfen', desc: 'Backoffice \u00B7 HR -- neuer Designer', tags: [{ label: 'P1', bg: 'var(--ac)', color: 'var(--a)' }] },
  { title: 'LinkedIn Post schreiben', desc: 'Marketing \u00B7 AI-Trends Artikel', tags: [{ label: 'P1', bg: 'rgba(124,77,255,.06)', color: 'var(--p)' }] },
]

interface WeekDay {
  label: string
  info: string
  color: string
  done?: boolean
  today?: boolean
}

const weekDays: WeekDay[] = [
  { label: 'Mo', info: '3 Termine \u00B7 5 Todos', color: 'var(--g)', done: true },
  { label: 'Di', info: '2 Termine \u00B7 3 Todos', color: 'var(--g)', done: true },
  { label: 'Mi', info: '4 Termine \u00B7 6 Todos', color: 'var(--g)', done: true },
  { label: 'Do', info: '5 Termine \u00B7 8 Todos', color: 'var(--bl)', today: true },
  { label: 'Fr', info: '2 Termine', color: 'var(--tx3)' },
  { label: 'Sa', info: '1 privat', color: 'var(--pk)' },
  { label: 'So', info: 'Familien-Brunch', color: 'var(--pk)' },
]

interface TickerItem {
  agent: string
  color: string
  text: string
}

const feedItems: TickerItem[] = [
  { agent: '09:00', color: 'var(--bl)', text: 'Standup Team -- Status-Update' },
  { agent: '10:30', color: 'var(--g)', text: 'Hebammen-Interview mit Sarah' },
  { agent: '13:00', color: 'var(--p)', text: 'Investor Pitch Prep' },
  { agent: '16:00', color: 'var(--t)', text: 'Startup Meetup Stuttgart' },
  { agent: '19:30', color: 'var(--pk)', text: 'Abendessen Familie' },
  { agent: 'overdue', color: 'var(--r)', text: 'Steuererklarung Q1 -- 5 Tage' },
]

/* ── Component ──────────────────────────────────────────── */

export default function TermineTodos() {
  const [pipelineOpen, setPipelineOpen] = useState(false)
  const navigate = useNavigate()

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
            <div className="kv" style={{ color: 'var(--bl)' }}>5</div>
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
            <div className="kv" style={{ color: 'var(--a)' }}>42</div>
            <div className="kl">Offene Todos</div>
          </div>
          <span className="kx" style={{ background: 'var(--rc)', color: 'var(--r)' }}>3 overdue</span>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--gg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--gg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--g)">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--g)' }}>8</div>
            <div className="kl">Erledigt diese Woche</div>
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
            <div className="kv" style={{ color: 'var(--pk)' }}>2</div>
            <div className="kl">Private Termine</div>
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
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: 'var(--bl)', whiteSpace: 'nowrap' }}>Do 3. April</span>
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
              <span className="tcard-count">5 Termine</span>
            </div>
            {termine.map((t, i) => (
              <div key={i} className="tentry">
                <span className="tentry-dot" style={{ background: t.dotColor }} />
                <div className="tentry-time">{t.time}</div>
                <div className="tentry-body">
                  <div className="tentry-title">{t.title}</div>
                  <div className="tentry-desc">{t.desc}</div>
                  <div className="tentry-tags">
                    <span className="tentry-tag" style={{ background: t.tagBg, color: t.tagColor }}>{t.tagLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Offene Todos */}
          <div className="tcard cf">
            <div className="tcard-hdr">
              <div className="tcard-title">
                <div className="sl" style={{ width: 8, height: 8, background: 'var(--a)', '--lc': 'var(--ag)' } as React.CSSProperties} />
                Offene Todos
              </div>
              <span className="tcard-count">8 heute &middot; 42 gesamt</span>
            </div>
            {todos.map((todo, i) => (
              <div key={i} className="tentry">
                <div className="todo-chk in" />
                <div style={{ width: 0 }} />
                <div className="tentry-body">
                  <div className="tentry-title" style={todo.overdue ? { color: 'var(--r)' } : undefined}>{todo.title}</div>
                  <div className="tentry-desc">{todo.desc}</div>
                  <div className="tentry-tags">
                    {todo.tags.map((tag, j) => (
                      <span key={j} className="tentry-tag" style={{ background: tag.bg, color: tag.color }}>{tag.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detail + KANI */}
        <div className="tright">
          <div className="tdet cf">
            <div className="tdet-hdr">
              <div className="tdet-title">Heute -- Ubersicht</div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, fontWeight: 700, color: 'var(--bl)' }}>Do 3. April</div>
            </div>
            <div className="tdet-body">
              <div>
                <div className="tdet-label">Tagesplan</div>
                <div className="tdet-text">
                  <b style={{ color: 'var(--bl)' }}>09:00</b> Standup Team (30min)<br />
                  <b style={{ color: 'var(--g)' }}>10:30</b> Hebammen-Interview (60min)<br />
                  <b style={{ color: 'var(--p)' }}>13:00</b> Investor Pitch Prep (120min)<br />
                  <b style={{ color: 'var(--t)' }}>16:00</b> Startup Meetup (90min)<br />
                  <b style={{ color: 'var(--pk)' }}>19:30</b> Abendessen Familie
                </div>
              </div>
              <div>
                <div className="tdet-label">Prioritäten</div>
                <div className="tdet-text" style={{ color: 'var(--r)' }}>
                  Steuererklarung Q1 -- <b>uberfällig!</b>
                </div>
                <div className="tdet-text">
                  Mockup Hebammenbuero fertigstellen<br />
                  Pitch Deck Zahlen aktualisieren
                </div>
              </div>
              <div>
                <div className="tdet-label">Morgen</div>
                <div className="tdet-text">
                  2 Business-Termine<br />
                  Freitag ruhiger Tag
                </div>
              </div>
              <div>
                <div className="tdet-label">Wochenende</div>
                <div className="tdet-text" style={{ color: 'var(--pk)' }}>
                  Sa: Kindergeburtstag 14:00<br />
                  So: Familien-Brunch 11:00
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
                Guten Morgen! Heute hast du 5 Termine und 8 Todos. Die Steuererklarung Q1 ist 5 Tage uberfällig -- soll ich das priorisieren?
              </div>
              <div className="tkm u">Ja, und block mir morgen 2h dafür</div>
              <div className="tkm k in">
                Erledigt. Morgen 09:00-11:00 geblockt für &quot;Steuererklarung Q1&quot;. Erinnerung gesetzt. Soll ich auch die Belege vorbereiten lassen?
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
                <span className="notif-badge" style={{ background: 'var(--r)', boxShadow: '0 2px 8px var(--rg)' }}>3</span>
                <svg viewBox="0 0 24 24" stroke="var(--r)"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              </div>
              <div className="notif-label" style={{ color: 'var(--r)' }}>Issues</div>
              <div className="notif-detail">
                <span style={{ color: 'var(--r)' }}>{'\u25CF'}</span> <b>Steuer Q1:</b> 5d uberfällig<br />
                <span style={{ color: 'var(--r)' }}>{'\u25CF'}</span> <b>Mockup:</b> Deadline morgen<br />
                <span style={{ color: 'var(--r)' }}>{'\u25CF'}</span> <b>E-Mail:</b> 48h ohne Antwort
              </div>
            </div>
            <div className="notif-cat">
              <div className="btn3d btn3d-lg" style={{ '--bc': 'var(--og)' } as React.CSSProperties}>
                <span className="notif-badge" style={{ background: 'var(--o)', boxShadow: '0 2px 8px var(--og)' }}>2</span>
                <svg viewBox="0 0 24 24" stroke="var(--o)"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>
              </div>
              <div className="notif-label" style={{ color: 'var(--o)' }}>Attention</div>
              <div className="notif-detail">
                <span style={{ color: 'var(--o)' }}>{'\u25CF'}</span> <b>Pitch:</b> Zahlen aktualisieren<br />
                <span style={{ color: 'var(--o)' }}>{'\u25CF'}</span> <b>HR:</b> Vertrag prüfen
              </div>
            </div>
            <div className="notif-cat">
              <div className="btn3d btn3d-lg" style={{ '--bc': 'var(--gg)' } as React.CSSProperties}>
                <span className="notif-badge" style={{ background: 'var(--g)', boxShadow: '0 2px 8px var(--gg)' }}>1</span>
                <svg viewBox="0 0 24 24" stroke="var(--g)"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
              </div>
              <div className="notif-label" style={{ color: 'var(--g)' }}>Freigabe</div>
              <div className="notif-detail">
                <span style={{ color: 'var(--g)' }}>{'\u25CF'}</span> <b>Hebamme Sarah:</b> Interview bestätigt
              </div>
            </div>
            <div className="notif-cat">
              <div className="btn3d btn3d-lg" style={{ '--bc': 'var(--blg)' } as React.CSSProperties}>
                <span className="notif-badge" style={{ background: 'var(--bl)', boxShadow: '0 2px 8px var(--blg)' }}>2</span>
                <svg viewBox="0 0 24 24" stroke="var(--bl)"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              </div>
              <div className="notif-label" style={{ color: 'var(--bl)' }}>Results</div>
              <div className="notif-detail">
                <span style={{ color: 'var(--bl)' }}>{'\u25CF'}</span> <b>Meetup:</b> Location bestätigt<br />
                <span style={{ color: 'var(--bl)' }}>{'\u25CF'}</span> <b>8 Todos:</b> diese Woche erledigt
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
              <span className="qa-sb">7 Ideen</span>
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
              <span className="qa-sb">3 aktiv</span>
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
              <span className="qa-sb">Persönlich</span>
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
