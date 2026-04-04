import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../shared/AppShell'

/* -- Area Data (names + icons kept, content emptied) -- */

interface PrivateArea {
  id: string
  name: string
  desc: string
  badgeLabel: string
  badgeBg: string
  badgeColor: string
  colorVar: string
  glowVar: string
  icon: React.ReactNode
}

const areas: PrivateArea[] = [
  {
    id: 'familie',
    name: 'Familie',
    desc: 'Familienaktivitäten, Kindergeburtstage, gemeinsame Zeit.',
    badgeLabel: '\u2014',
    badgeBg: 'rgba(0,0,0,.04)',
    badgeColor: 'var(--tx3)',
    colorVar: 'var(--pk)',
    glowVar: 'var(--pkg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--pk)">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: 'urlaub',
    name: 'Urlaub',
    desc: 'Urlaubsplanung, Reisen, Auszeiten vom Alltag.',
    badgeLabel: '\u2014',
    badgeBg: 'rgba(0,0,0,.04)',
    badgeColor: 'var(--tx3)',
    colorVar: 'var(--bl)',
    glowVar: 'var(--blg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--bl)">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: 'wellness',
    name: 'Wellness & Fitness',
    desc: 'Gesundheit, Sport, Ernährung, Routinen.',
    badgeLabel: '\u2014',
    badgeBg: 'rgba(0,0,0,.04)',
    badgeColor: 'var(--tx3)',
    colorVar: 'var(--g)',
    glowVar: 'var(--gg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--g)">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: 'sandkasten',
    name: 'Sandkasten',
    desc: 'Persönliche Experimente, Hobbys, Lernprojekte.',
    badgeLabel: '\u2014',
    badgeBg: 'rgba(0,0,0,.04)',
    badgeColor: 'var(--tx3)',
    colorVar: 'var(--p)',
    glowVar: 'var(--pg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--p)">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
]

/* -- Component -- */

export default function Private() {
  const [selected, setSelected] = useState('familie')
  const navigate = useNavigate()

  const area = areas.find((a) => a.id === selected) ?? areas[0]

  return (
    <AppShell title="Private" ledColor="pk">
      {/* KPI Row */}
      <div className="krow">
        <div className="kpi cf" style={{ '--kc': 'var(--pkg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--pkg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--pk)">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--pk)' }}>{areas.length}</div>
            <div className="kl">Bereiche</div>
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
            <div className="kv" style={{ color: 'var(--g)' }}>{'\u2014'}</div>
            <div className="kl">Termine privat</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--blg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--blg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--bl)">
              <path d="M4.93 4.93l14.14 14.14" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--bl)' }}>{'\u2014'}</div>
            <div className="kl">Nächster Urlaub</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--pg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--pg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--p)">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--p)' }}>{'\u2014'}</div>
            <div className="kl">Sandbox Ideen</div>
          </div>
        </div>
      </div>

      {/* Section labels */}
      <div style={{ padding: '0 40px', marginBottom: 10, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <span className="st">Bereiche</span>
        <span className="st" style={{ marginLeft: 'auto', paddingRight: 400 }}>Detail & KANI</span>
      </div>

      {/* Main body: Grid + Detail */}
      <div className="pvbody">
        <div className="pvleft">
          <div className="pvgrid">
            {areas.map((a) => (
              <div key={a.id} className="cgw" style={{ '--gc2': a.glowVar } as React.CSSProperties}>
                <div
                  className="pvc cf"
                  style={{ '--hc': a.glowVar } as React.CSSProperties}
                  onClick={() => setSelected(a.id)}
                >
                  <div className="pvc-top">
                    <div className="btn3d" style={{ '--bc': a.glowVar } as React.CSSProperties}>
                      {a.icon}
                    </div>
                    <span className="pvc-badge" style={{ background: a.badgeBg, color: a.badgeColor }}>
                      {a.badgeLabel}
                    </span>
                  </div>
                  <div className="pvc-name">{a.name}</div>
                  <div className="pvc-desc">{a.desc}</div>
                  <div className="pvc-items" style={{ color: 'var(--tx3)', fontSize: 10 }}>
                    Nicht eingerichtet
                  </div>
                  <div className="pvc-foot">
                    <span className="pvc-info">{'\u2014'}</span>
                    <span className="pvc-arrow">{'\u2192'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detail + KANI */}
        <div className="pvright">
          <div className="pvdet cf">
            <div className="pvdet-hdr">
              <div className="pvdet-title">{area.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 8, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: area.badgeBg, color: area.badgeColor }}>
                  {area.badgeLabel}
                </span>
              </div>
            </div>
            <div className="pvdet-body">
              <div>
                <div className="pvdet-label">Status</div>
                <div className="pvdet-text" style={{ color: 'var(--tx3)' }}>
                  Nicht eingerichtet
                </div>
              </div>
            </div>
          </div>

          <div className="pvkani cf">
            <div className="pvkani-hdr">
              <div className="pvkani-av">
                <svg viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="pvkani-nm">KANI &middot; Private</span>
              <span style={{ fontSize: 7, color: 'var(--g)', marginLeft: 'auto' }}>Online</span>
            </div>
            <div className="pvkani-body">
              <div className="pvkm k in" style={{ color: 'var(--tx3)' }}>
                Keine Daten vorhanden. Bereich wird eingerichtet.
              </div>
            </div>
            <div className="pvkani-in">
              <input className="pvkani-inp in" placeholder="Frag KANI zu Private..." readOnly />
              <button className="pvkani-send">
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
              { label: 'Familie', colorVar: 'var(--pk)', glowVar: 'var(--pkg)', iconPath: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></> },
              { label: 'Urlaub', colorVar: 'var(--bl)', glowVar: 'var(--blg)', iconPath: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /></> },
              { label: 'Wellness', colorVar: 'var(--g)', glowVar: 'var(--gg)', iconPath: <><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></> },
              { label: 'Sandkasten', colorVar: 'var(--p)', glowVar: 'var(--pg)', iconPath: <><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1" /></> },
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
            <span className="ticker-ld" style={{ background: 'var(--pk)', boxShadow: '0 0 10px var(--pkg)' }} />
            PRIVATE
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
