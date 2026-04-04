import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../shared/AppShell'

/* -- Department Data (names + icons kept, stats zeroed) -- */

interface Department {
  id: string
  name: string
  desc: string
  badgeLabel: string
  badgeBg: string
  badgeColor: string
  colorVar: string
  glowVar: string
  icon: React.ReactNode
  stats: { val: string; label: string; color?: string }[]
  lastInfo: string
}

const departments: Department[] = [
  {
    id: 'buchhaltung',
    name: 'Buchhaltung',
    desc: 'Rechnungen, Steuern, Belege, Ausgaben.',
    badgeLabel: '\u2014',
    badgeBg: 'rgba(0,0,0,.04)',
    badgeColor: 'var(--tx3)',
    colorVar: 'var(--g)',
    glowVar: 'var(--gg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--g)">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    stats: [
      { val: '0', label: 'Tasks' },
      { val: '\u2014', label: 'Monat' },
      { val: '0', label: 'Belege' },
    ],
    lastInfo: '\u2014',
  },
  {
    id: 'emails',
    name: 'E-Mails',
    desc: 'Postfach, Kundenkommunikation, Newsletter.',
    badgeLabel: '\u2014',
    badgeBg: 'rgba(0,0,0,.04)',
    badgeColor: 'var(--tx3)',
    colorVar: 'var(--bl)',
    glowVar: 'var(--blg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--bl)">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    stats: [
      { val: '0', label: 'Ungelesen' },
      { val: '0', label: 'Antwort' },
      { val: '\u2014', label: 'Gesamt' },
    ],
    lastInfo: '\u2014',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    desc: 'Kampagnen, Social Media, Content.',
    badgeLabel: '\u2014',
    badgeBg: 'rgba(0,0,0,.04)',
    badgeColor: 'var(--tx3)',
    colorVar: 'var(--p)',
    glowVar: 'var(--pg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--p)">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    stats: [
      { val: '0', label: 'Kampagnen' },
      { val: '\u2014', label: 'Reach' },
      { val: '0', label: 'Posts' },
    ],
    lastInfo: '\u2014',
  },
  {
    id: 'hr',
    name: 'HR',
    desc: 'Verträge, Freelancer, Recruiting.',
    badgeLabel: '\u2014',
    badgeBg: 'rgba(0,0,0,.04)',
    badgeColor: 'var(--tx3)',
    colorVar: 'var(--a)',
    glowVar: 'var(--ag)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--a)">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    stats: [
      { val: '0', label: 'Offen' },
      { val: '\u2014', label: 'Freelancer' },
      { val: '0', label: 'Verträge' },
    ],
    lastInfo: '\u2014',
  },
  {
    id: 'network',
    name: 'Network & Events',
    desc: 'Kontakte, Meetups, Konferenzen.',
    badgeLabel: '\u2014',
    badgeBg: 'rgba(0,0,0,.04)',
    badgeColor: 'var(--tx3)',
    colorVar: 'var(--t)',
    glowVar: 'var(--tg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--t)">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
    stats: [
      { val: '0', label: 'Events' },
      { val: '\u2014', label: 'Kontakte' },
      { val: '0', label: 'Follow-ups' },
    ],
    lastInfo: '\u2014',
  },
  {
    id: 'partners',
    name: 'Partners',
    desc: 'Kooperationen, Angebote, Verhandlungen.',
    badgeLabel: '\u2014',
    badgeBg: 'rgba(0,0,0,.04)',
    badgeColor: 'var(--tx3)',
    colorVar: 'var(--o)',
    glowVar: 'var(--og)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--o)">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    ),
    stats: [
      { val: '0', label: 'Pending' },
      { val: '\u2014', label: 'Partner' },
      { val: '0', label: 'Aktiv' },
    ],
    lastInfo: '\u2014',
  },
]

/* -- Component -- */

export default function Backoffice() {
  const [selected, setSelected] = useState('buchhaltung')
  const [pipelineOpen, setPipelineOpen] = useState(false)
  const navigate = useNavigate()

  const dept = departments.find((d) => d.id === selected) ?? departments[0]

  return (
    <AppShell title="Backoffice" ledColor="o">
      {/* KPI Row */}
      <div className="krow">
        <div className="kpi cf" style={{ '--kc': 'var(--og)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--og)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--o)">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--o)' }}>{departments.length}</div>
            <div className="kl">Departments</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--gg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--gg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--g)">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--g)' }}>0</div>
            <div className="kl">Tasks offen</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--blg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--blg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--bl)">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--bl)' }}>0</div>
            <div className="kl">Ungelesen</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--rg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--rg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--r)">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--r)' }}>0</div>
            <div className="kl">{'\u00DC'}berfällig</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--pg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--pg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--p)">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--p)' }}>{'\u2014'}</div>
            <div className="kl">Monat Ausgaben</div>
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <div style={{ padding: '0 40px', marginBottom: 14, flexShrink: 0 }}>
        <div className="cf" style={{ overflow: 'hidden' }}>
          <div
            style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
            onClick={() => setPipelineOpen((p) => !p)}
          >
            <span className="st" style={{ whiteSpace: 'nowrap' }}>Departments</span>
            <div className="in" style={{ flex: 1, height: 10, borderRadius: 5, display: 'flex', gap: 3, overflow: 'hidden' }}>
              <div style={{ flex: 1, height: '100%', borderRadius: 4, background: 'var(--tx3)', opacity: 0.4 }} />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: 'var(--o)', whiteSpace: 'nowrap' }}>{departments.length} Bereiche</span>
            <span style={{ fontSize: 10, color: 'var(--tx3)', cursor: 'pointer' }}>{pipelineOpen ? '\u25B2' : '\u25BC'}</span>
          </div>
          {pipelineOpen && (
            <div style={{ padding: '14px 22px 18px', borderTop: '1px solid rgba(0,0,0,.04)', marginTop: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
                Keine Daten {'\u2014'} wird eingerichtet
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section labels */}
      <div style={{ padding: '0 40px', marginBottom: 10, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <span className="st">Departments</span>
        <span className="st" style={{ marginLeft: 'auto', paddingRight: 400 }}>Detail & KANI</span>
      </div>

      {/* Main body: Grid + Detail */}
      <div className="dbody">
        <div className="dleft">
          <div className="dgrid">
            {departments.map((d) => (
              <div key={d.id} className="cgw" style={{ '--gc2': d.glowVar } as React.CSSProperties}>
                <div
                  className="dc cf"
                  style={{ '--hc': d.glowVar } as React.CSSProperties}
                  onClick={() => setSelected(d.id)}
                >
                  <div className="dc-top">
                    <div className="dc-icon btn3d" style={{ '--bc': d.glowVar } as React.CSSProperties}>
                      {d.icon}
                    </div>
                    <span className="dc-badge" style={{ background: d.badgeBg, color: d.badgeColor }}>
                      {d.badgeLabel}
                    </span>
                  </div>
                  <div className="dc-name">{d.name}</div>
                  <div className="dc-desc">{d.desc}</div>
                  <div className="dc-stats">
                    {d.stats.map((s, i) => (
                      <div key={i} className="dc-stat">
                        <span className="dc-stat-val" style={s.color ? { color: s.color } : undefined}>{s.val}</span>
                        <span className="dc-stat-label">{s.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="dc-foot">
                    <span className="dc-info">{d.lastInfo}</span>
                    <span className="dc-arrow">{'\u2192'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detail + KANI */}
        <div className="dright">
          <div className="ddet cf">
            <div className="ddet-hdr">
              <div className="ddet-title">{dept.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 8, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: dept.badgeBg, color: dept.badgeColor }}>
                  {dept.badgeLabel}
                </span>
              </div>
            </div>
            <div className="ddet-body">
              <div>
                <div className="ddet-label">Status</div>
                <div className="ddet-text" style={{ color: 'var(--tx3)' }}>
                  Keine Daten {'\u2014'} wird eingerichtet
                </div>
              </div>
            </div>
          </div>

          <div className="dkani cf">
            <div className="dkani-hdr">
              <div className="dkani-av">
                <svg viewBox="0 0 24 24">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                </svg>
              </div>
              <span className="dkani-nm">KANI &middot; {dept.name}</span>
              <span style={{ fontSize: 7, color: 'var(--g)', marginLeft: 'auto' }}>Online</span>
            </div>
            <div className="dkani-body">
              <div className="dkm k in" style={{ color: 'var(--tx3)' }}>
                Keine Daten vorhanden. Bereich wird eingerichtet.
              </div>
            </div>
            <div className="dkani-in">
              <input className="dkani-inp in" placeholder={`Frag KANI zu ${dept.name}...`} readOnly />
              <button className="dkani-send">
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
            {[
              { label: 'Issues', colorVar: 'var(--r)', glowVar: 'var(--rg)', iconPath: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></> },
              { label: 'Attention', colorVar: 'var(--o)', glowVar: 'var(--og)', iconPath: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></> },
              { label: 'Freigabe', colorVar: 'var(--g)', glowVar: 'var(--gg)', iconPath: <><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></> },
              { label: 'Results', colorVar: 'var(--bl)', glowVar: 'var(--blg)', iconPath: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></> },
            ].map((cat) => (
              <div key={cat.label} className="notif-cat">
                <div className="btn3d btn3d-lg" style={{ '--bc': cat.glowVar } as React.CSSProperties}>
                  <span className="notif-badge" style={{ background: cat.colorVar, boxShadow: `0 2px 8px ${cat.glowVar}` }}>0</span>
                  <svg viewBox="0 0 24 24" stroke={cat.colorVar}>{cat.iconPath}</svg>
                </div>
                <div className="notif-label" style={{ color: cat.colorVar }}>{cat.label}</div>
                <div className="notif-detail">
                  <span style={{ color: 'var(--tx3)' }}>Keine</span>
                </div>
              </div>
            ))}
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
              <span className="qa-sb">{'\u2014'}</span>
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
              <span className="qa-sb">{'\u2014'}</span>
            </div>
            <div className="qa-item" onClick={() => navigate('/private')}>
              <div className="btn3d" style={{ '--bc': 'var(--pkg)' } as React.CSSProperties}>
                <svg viewBox="0 0 24 24" stroke="var(--pk)"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <span className="qa-lb">Private</span>
              <span className="qa-sb">{'\u2014'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Feed */}
      <div className="ticker-w">
        <div className="ticker cf" style={{ borderRadius: 24 }}>
          <div className="ticker-lbl">
            <span className="ticker-ld" style={{ background: 'var(--o)', boxShadow: '0 0 10px var(--og)' }} />
            BACKOFFICE
          </div>
          <div className="ticker-c">
            <div style={{ padding: '0 20px', fontSize: 11, color: 'var(--tx3)' }}>
              Keine Aktivitäten
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
