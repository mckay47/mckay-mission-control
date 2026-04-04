import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AGENTS } from '../../lib/data'
import AppShell from '../shared/AppShell'
import QuickAccess from '../shared/QuickAccess'

/* -- Component -- */

export default function AgentDetail() {
  const { id } = useParams()
  const [activityOpen, setActivityOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'live' | 'log' | 'errors'>('live')

  // Find agent from real data
  const slug = id ?? ''
  const agent = AGENTS.find(
    (a) => a.n.toLowerCase().replace(/\s+/g, '-') === slug
  )

  const agentName = agent?.n ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const isActive = agent?.st === 'active'
  const colorVar = agent?.col ?? 'var(--tx2)'
  const bgVar = agent?.bg ?? 'rgba(0,0,0,.04)'

  return (
    <AppShell backLink={{ label: 'Agents', href: '/agents' }}>
      {/* Inline header with agent name and status */}
      <div
        style={{
          padding: '0 40px',
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div
          className="sl g"
          style={
            isActive
              ? undefined
              : { background: 'var(--tx3)', animation: 'none' }
          }
        />
        <span style={{ fontSize: 20, fontWeight: 700 }}>{agentName}</span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 6,
            background: bgVar,
            color: colorVar,
          }}
        >
          {isActive ? '\u25CF Aktiv' : '\u23F8 Idle'}
        </span>
      </div>

      {/* KPI Row */}
      <div className="krow" style={{ gap: 14 }}>
        <div className="kpi cf" style={{ '--kc': 'var(--gg)', padding: '14px 16px' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--gg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--g)">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--g)', fontSize: 20 }}>{agent?.pr ?? 0}</div>
            <div className="kl" style={{ fontSize: 9 }}>Tasks erledigt</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--gg)', padding: '14px 16px' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--gg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--g)">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--g)', fontSize: 20 }}>{agent?.suc ?? 0}%</div>
            <div className="kl" style={{ fontSize: 9 }}>Erfolgsrate</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--blg)', padding: '14px 16px' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--blg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--bl)">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--bl)', fontSize: 20 }}>{'\u2014'}</div>
            <div className="kl" style={{ fontSize: 9 }}>Laufzeit gesamt</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--ag)', padding: '14px 16px' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--ag)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--a)">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--a)', fontSize: 20 }}>0</div>
            <div className="kl" style={{ fontSize: 9 }}>Tasks in Queue</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--pg)', padding: '14px 16px' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--pg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--p)">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--p)', fontSize: 20 }}>{agent?.cost ?? '\u2014'}</div>
            <div className="kl" style={{ fontSize: 9 }}>API Kosten</div>
          </div>
        </div>
      </div>

      {/* Activity 24h Timeline */}
      <div style={{ padding: '0 40px', marginBottom: 14, flexShrink: 0 }}>
        <div className="cf" style={{ overflow: 'hidden' }}>
          <div
            style={{
              padding: '14px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              cursor: 'pointer',
              transition: 'all .3s',
            }}
            onClick={() => setActivityOpen((p) => !p)}
          >
            <span className="st" style={{ whiteSpace: 'nowrap' }}>Aktivit{'\u00E4'}t 24h</span>
            <div
              className="in"
              style={{
                flex: 1,
                height: 10,
                borderRadius: 5,
                display: 'flex',
                gap: 2,
                overflow: 'hidden',
              }}
            >
              <div style={{ flex: 1, height: '100%', borderRadius: 4, background: 'var(--tx3)', opacity: 0.3 }} />
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono'",
                fontSize: 14,
                fontWeight: 700,
                color: colorVar,
                whiteSpace: 'nowrap',
              }}
            >
              {agent?.pr ?? 0} Tasks
            </span>
            <span style={{ fontSize: 10, color: 'var(--tx3)', cursor: 'pointer' }}>
              {activityOpen ? '\u25B2' : '\u25BC'}
            </span>
          </div>
          {activityOpen && (
            <div
              style={{
                padding: '14px 22px 18px',
                borderTop: '1px solid rgba(0,0,0,.04)',
                marginTop: 10,
              }}
            >
              <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
                Keine Aktivitätsdaten vorhanden
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Column Headers */}
      <div className="trow" style={{ gridTemplateColumns: '90px 1fr 380px' }}>
        <span className="st">Config</span>
        <span className="st">Live Output</span>
        <span className="st">Queue & History</span>
      </div>

      {/* 3-Column Main Body */}
      <div className="mbody" style={{ gridTemplateColumns: '90px 1fr 380px', flex: 8 }}>
        {/* Left: Config Nav */}
        <div className="lnav">
          <div className="cfg-item cf" style={{ '--nc': 'var(--gg)' } as React.CSSProperties}>
            <div className="btn3d" style={{ '--bc': 'var(--gg)', width: 36, height: 36 } as React.CSSProperties}>
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--g)" strokeWidth="1.8" fill="none">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              </svg>
            </div>
            <span className="cfg-name">Modell</span>
            <span className="cfg-val" style={{ color: 'var(--g)' }}>{agent?.mdl ?? '\u2014'}</span>
          </div>
          <div className="cfg-item cf" style={{ '--nc': 'var(--blg)' } as React.CSSProperties}>
            <div className="btn3d" style={{ '--bc': 'var(--blg)', width: 36, height: 36 } as React.CSSProperties}>
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--bl)" strokeWidth="1.8" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
              </svg>
            </div>
            <span className="cfg-name">Tokens</span>
            <span className="cfg-val" style={{ color: 'var(--bl)' }}>{agent?.tkn ?? '\u2014'}</span>
          </div>
          <div style={{ height: 1, margin: '4px 8px', background: 'linear-gradient(90deg,transparent,rgba(0,0,0,.06),transparent)' }} />
          <div className="cfg-item cf" style={{ '--nc': 'var(--gg)' } as React.CSSProperties}>
            <div className="btn3d" style={{ '--bc': 'var(--gg)', width: 36, height: 36 } as React.CSSProperties}>
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--g)" strokeWidth="1.8" fill="none">
                <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="cfg-name">Projekt</span>
            <span className="cfg-val" style={{ color: 'var(--g)' }}>{agent?.proj ?? '\u2014'}</span>
          </div>
        </div>

        {/* Center: Terminal */}
        <div className="center" style={{ overflow: 'hidden', padding: 0 }}>
          <div className="term-card cf">
            <div className="term-header">
              <div style={{ display: 'flex', gap: 6 }}>
                <span
                  className={`term-tab${activeTab === 'live' ? ' active' : ''}`}
                  onClick={() => setActiveTab('live')}
                >
                  Live Output
                </span>
                <span
                  className={`term-tab${activeTab === 'log' ? ' active' : ''}`}
                  onClick={() => setActiveTab('log')}
                >
                  Build Log
                </span>
                <span
                  className={`term-tab${activeTab === 'errors' ? ' active' : ''}`}
                  onClick={() => setActiveTab('errors')}
                >
                  Errors
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  className="sl g"
                  style={
                    isActive
                      ? { width: 7, height: 7 }
                      : { width: 7, height: 7, background: 'var(--tx3)', animation: 'none' }
                  }
                />
                <span style={{ fontSize: 9, color: isActive ? 'var(--g)' : 'var(--tx3)', fontWeight: 600 }}>
                  {isActive ? 'Running' : 'Idle'}
                </span>
              </div>
            </div>
            <div className="term-body">
              <div className="term-line">
                <span className="term-output" style={{ color: 'var(--tx3)' }}>Kein Live-Output</span>
              </div>
            </div>
            <div className="term-input-row">
              <input className="term-input in" placeholder={`${slug} ~$ `} readOnly />
              <button className="term-send">
                <svg viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Queue + History */}
        <div className="right" style={{ gap: 14 }}>
          <div className="r-card cf">
            <div className="r-hdr">
              <span className="st">Queue</span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono'",
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'var(--tx3)',
                }}
              >
                0 wartend
              </span>
            </div>
            <div className="r-list">
              <div style={{ padding: '12px 14px', fontSize: 10, color: 'var(--tx3)' }}>
                Keine Tasks in Queue
              </div>
            </div>
          </div>

          <div className="r-card cf">
            <div className="r-hdr">
              <span className="st">History</span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono'",
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'var(--tx3)',
                }}
              >
                {agent?.pr ?? 0} Tasks
              </span>
            </div>
            <div className="r-list">
              <div style={{ padding: '12px 14px', fontSize: 10, color: 'var(--tx3)' }}>
                Keine History vorhanden
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Notifications + Quick Access */}
      <div
        className="brow"
        style={{ gridTemplateColumns: '90px 1fr 380px', marginTop: 14, flex: 0 }}
      >
        <div />
        <div className="cf" style={{ padding: '16px 20px' }}>
          <div className="st" style={{ marginBottom: 10 }}>
            Notifications {'\u00B7'} {agentName}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Issues', colorVar: 'var(--r)', glowVar: 'var(--rg)', iconPath: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></> },
              { label: 'Attention', colorVar: 'var(--o)', glowVar: 'var(--og)', iconPath: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></> },
              { label: 'Freigabe', colorVar: 'var(--g)', glowVar: 'var(--gg)', iconPath: <><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></> },
              { label: 'Results', colorVar: 'var(--bl)', glowVar: 'var(--blg)', iconPath: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></> },
            ].map((cat) => (
              <div key={cat.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className="btn3d" style={{ '--bc': cat.glowVar, width: 36, height: 36 } as React.CSSProperties}>
                    <svg viewBox="0 0 24 24" width="15" height="15" stroke={cat.colorVar} strokeWidth="1.8" fill="none">{cat.iconPath}</svg>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: cat.colorVar }}>{cat.label}</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--tx3)', lineHeight: 1.5, marginTop: 4 }}>
                  Keine
                </div>
              </div>
            ))}
          </div>
        </div>
        <QuickAccess />
      </div>

      {/* Live Feed */}
      <div className="ticker-w" style={{ margin: '8px 0 12px' }}>
        <div className="ticker cf" style={{ borderRadius: 22, height: 44 }}>
          <div className="ticker-lbl" style={{ fontSize: 9, padding: '0 16px' }}>
            <span
              className="ticker-ld"
              style={{
                width: 7,
                height: 7,
                background: colorVar,
                boxShadow: `0 0 10px ${bgVar}`,
              }}
            />
            {agentName.toUpperCase()}
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
