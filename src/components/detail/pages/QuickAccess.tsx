import React, { useRef, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DetailHeader from '../DetailHeader'

interface NavCard {
  id: string
  title: string
  desc: string
  color: string
  accent2: string
  glowRgba: string
  hoverRgba: string
  iconBgRgba: string
  route: string
  shortcut?: string
  svgPath: React.ReactNode
  badge?: string
  toggle?: { label: string }
  sparkline?: boolean
  tag?: string
  isLogout?: boolean
  arrowLabel?: string
}

const cards: NavCard[] = [
  {
    id: 'cockpit',
    title: 'Cockpit',
    desc: 'Zuruck zur Hauptansicht — Mission Control Dashboard',
    color: 'cyan',
    accent2: 'green',
    glowRgba: 'rgba(45,212,191,0.06)',
    hoverRgba: 'rgba(45,212,191,0.15)',
    iconBgRgba: 'rgba(45,212,191,',
    route: '/',
    shortcut: 'ESC',
    svgPath: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  },
  {
    id: 'system',
    title: 'System',
    desc: 'System-Settings, MCP-Server, API Keys verwalten',
    color: 'green',
    accent2: 'cyan',
    glowRgba: 'rgba(52,211,153,0.06)',
    hoverRgba: 'rgba(52,211,153,0.15)',
    iconBgRgba: 'rgba(52,211,153,',
    route: '/detail/system',
    shortcut: '\u2318 + S',
    svgPath: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
  },
  {
    id: 'office',
    title: 'Office',
    desc: 'E-Mail, Kalender, Dokumente — Office-Bereich',
    color: 'blue',
    accent2: 'purple',
    glowRgba: 'rgba(96,165,250,0.06)',
    hoverRgba: 'rgba(96,165,250,0.15)',
    iconBgRgba: 'rgba(96,165,250,',
    route: '/detail/office',
    shortcut: '\u2318 + O',
    svgPath: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </>
    ),
  },
  {
    id: 'appearance',
    title: 'Appearance',
    desc: 'Dark/Light Mode, Theme, Accent Color',
    color: 'purple',
    accent2: 'pink',
    glowRgba: 'rgba(167,139,250,0.06)',
    hoverRgba: 'rgba(167,139,250,0.15)',
    iconBgRgba: 'rgba(167,139,250,',
    route: '/detail/appearance',
    svgPath: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
    toggle: { label: 'Dark Mode' },
  },
  {
    id: 'notifications',
    title: 'Notifications',
    desc: 'Benachrichtigungen an/aus, Sound-Einstellungen',
    color: 'orange',
    accent2: 'yellow',
    glowRgba: 'rgba(251,191,36,0.06)',
    hoverRgba: 'rgba(251,191,36,0.15)',
    iconBgRgba: 'rgba(251,191,36,',
    route: '/detail/notifications',
    svgPath: (
      <>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
    badge: '3',
  },
  {
    id: 'shortcuts',
    title: 'Shortcuts',
    desc: 'Keyboard Shortcuts — \u2318K, ESC, \u2318S, etc.',
    color: 'cyan',
    accent2: 'blue',
    glowRgba: 'rgba(45,212,191,0.06)',
    hoverRgba: 'rgba(45,212,191,0.15)',
    iconBgRgba: 'rgba(45,212,191,',
    route: '/detail/shortcuts',
    shortcut: '\u2318 + /',
    svgPath: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M7 16h10" />
      </>
    ),
  },
  {
    id: 'profil',
    title: 'Profil',
    desc: 'Mehti Kaymaz — Einstellungen & API Keys',
    color: 'pink',
    accent2: 'purple',
    glowRgba: 'rgba(244,114,182,0.06)',
    hoverRgba: 'rgba(244,114,182,0.15)',
    iconBgRgba: 'rgba(244,114,182,',
    route: '/detail/profil',
    svgPath: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    tag: '@mehti',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    desc: 'Usage Stats, Trends & Reports',
    color: 'green',
    accent2: 'orange',
    glowRgba: 'rgba(52,211,153,0.06)',
    hoverRgba: 'rgba(52,211,153,0.15)',
    iconBgRgba: 'rgba(52,211,153,',
    route: '/detail/analytics',
    svgPath: (
      <>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </>
    ),
    sparkline: true,
  },
  {
    id: 'logout',
    title: 'Logout',
    desc: 'Session beenden — Bis bald!',
    color: 'red',
    accent2: 'orange',
    glowRgba: 'rgba(248,113,113,0.04)',
    hoverRgba: 'rgba(248,113,113,0.15)',
    iconBgRgba: 'rgba(248,113,113,',
    route: '/logout',
    shortcut: '\u2318 + Q',
    svgPath: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </>
    ),
    isLogout: true,
    arrowLabel: 'Abmelden',
  },
]

const DELAYS = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45]

export default function QuickAccess() {
  const navigate = useNavigate()
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    appearance: true,
    notifications: true,
  })
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const el = cardRefs.current[idx]
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    el.style.setProperty('--glow-pos', `${x}% ${y}%`)
  }, [])

  const handleToggle = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setToggles(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  return (
    <div className="dashboard" style={{ gridTemplateRows: '44px 1fr' }}>
      <DetailHeader
        title="QUICK ACCESS"
        color="cyan"
        pills={[{ value: '9', label: 'Bereiche', color: 'cyan' }]}
      />

      <div
        style={{
          gridColumn: '1/-1',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 18,
          overflow: 'hidden',
        }}
      >
        {cards.map((c, i) => (
          <div
            key={c.id}
            ref={el => { cardRefs.current[i] = el }}
            className="card"
            onClick={() => navigate(c.route)}
            onMouseMove={e => handleMouseMove(e, i)}
            style={{
              '--card-accent': `var(--${c.color})`,
              '--card-accent2': `var(--${c.accent2})`,
              '--card-glow': c.glowRgba,
              '--hover-glow': c.hoverRgba,
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
              animation: `fadeInUp 0.5s ease-out ${DELAYS[i]}s both`,
              opacity: c.isLogout ? 0.7 : undefined,
            } as React.CSSProperties}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.transform = 'translateY(-4px) scale(1.02)'
              el.style.borderColor = c.isLogout
                ? 'rgba(248,113,113,0.3)'
                : 'rgba(255,255,255,0.22)'
              el.style.boxShadow = `0 12px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 30px ${c.hoverRgba}`
              if (c.isLogout) el.style.opacity = '1'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.transform = ''
              el.style.borderColor = ''
              el.style.boxShadow = ''
              if (c.isLogout) el.style.opacity = '0.7'
            }}
          >
            {/* Notification badge */}
            {c.badge && (
              <span
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 18,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: 'var(--red)',
                  color: '#fff',
                  fontSize: 8,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 12px var(--red-glow)',
                  zIndex: 2,
                }}
              >
                {c.badge}
              </span>
            )}

            {/* Card content */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                textAlign: 'center',
                padding: 30,
                gap: 16,
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* Icon box */}
              <div
                className="qa-nav-icon"
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${c.iconBgRgba}0.15), ${c.iconBgRgba}0.05))`,
                  color: `var(--${c.color})`,
                  transition: 'all 0.4s',
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width={28}
                  height={28}
                  stroke="currentColor"
                  strokeWidth={1.5}
                  fill="none"
                  style={{ transition: 'all 0.3s' }}
                >
                  {c.svgPath}
                </svg>
              </div>

              {/* Title */}
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: `var(--${c.color})`,
                }}
              >
                {c.title}
              </div>

              {/* Description */}
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  maxWidth: 180,
                }}
              >
                {c.desc}
              </div>

              {/* Shortcut badge */}
              {c.shortcut && (
                <span
                  style={{
                    fontSize: 8,
                    padding: '4px 10px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: 6,
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: 1,
                  }}
                >
                  {c.shortcut}
                </span>
              )}

              {/* Toggle switch (Appearance / Notifications) */}
              {c.toggle && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                  <div
                    onClick={e => handleToggle(c.id, e)}
                    style={{
                      width: 36,
                      height: 20,
                      borderRadius: 10,
                      background: toggles[c.id]
                        ? 'rgba(45,212,191,0.3)'
                        : 'rgba(255,255,255,0.08)',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: 2,
                        left: toggles[c.id] ? 18 : 2,
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: toggles[c.id] ? 'var(--cyan)' : '#fff',
                        transition: 'all 0.3s',
                        boxShadow: toggles[c.id] ? '0 0 8px var(--cyan-glow)' : 'none',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 8, color: 'var(--text-muted)' }}>{c.toggle.label}</span>
                </div>
              )}

              {/* Profile tag */}
              {c.tag && (
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {c.tag}
                </span>
              )}

              {/* Sparkline (Analytics) */}
              {c.sparkline && (
                <svg
                  viewBox="0 0 100 20"
                  style={{
                    width: 80,
                    height: 16,
                    filter: 'drop-shadow(0 0 3px var(--green-glow))',
                  }}
                >
                  <path
                    d="M0,15 L14,13 L28,10 L42,8 L56,5 L70,7 L84,3 L100,2"
                    fill="none"
                    stroke="var(--green)"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                  />
                </svg>
              )}

              {/* Arrow */}
              <span
                className="qa-nav-arrow"
                style={{
                  fontSize: 10,
                  color: c.isLogout ? 'var(--red)' : 'var(--text-muted)',
                  transition: 'all 0.3s',
                }}
              >
                {'\u2192'} {c.arrowLabel ?? 'Offnen'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
