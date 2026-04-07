import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  backLink?: { label: string; href: string }
  title?: string
  ledColor?: string
}

export function Header({ backLink, title, ledColor }: HeaderProps) {
  const navigate = useNavigate()
  const [time, setTime] = useState(() => formatTime())

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 60_000)
    return () => clearInterval(id)
  }, [])

  function toggleDarkMode() {
    document.body.classList.toggle('dark')
    const isDark = document.body.classList.contains('dark')
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }

  return (
    <div className="hdr">
      <div className="hdr-l">
        {backLink && (
          <button
            onClick={() => navigate(backLink.href)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--tx3)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            &larr; {backLink.label}
          </button>
        )}
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          M
        </div>
        <span className="logo-t">MCKAY</span>
        <span className="logo-s">
          {title ?? 'Mission Control'}
        </span>
        {ledColor && (
          <span
            className="sl"
            style={{
              background: `var(--${ledColor})`,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              '--lc': `var(--${ledColor}g)`,
              animation: 'lp 3s ease-in-out infinite',
            } as React.CSSProperties}
          />
        )}
      </div>

      <div className="hdr-r">
        <div className="hdr-time cf" style={{ padding: '10px 20px', borderRadius: 14 }}>
          {time}
        </div>

        {/* Dark mode toggle */}
        <div
          className="btn3d btn3d-sm"
          style={{ '--bc': 'rgba(0,0,0,0.06)' } as React.CSSProperties}
          onClick={toggleDarkMode}
          title="Dark/Light Mode"
        >
          <svg viewBox="0 0 24 24" stroke="var(--tx3)" style={{ filter: 'none' }}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </div>

        {/* KANI button — handled by AppShell state, so we emit a custom event */}
        <div
          className="btn3d btn3d-sm"
          style={{ '--bc': 'var(--pg)', position: 'relative' } as React.CSSProperties}
          onClick={() => document.dispatchEvent(new CustomEvent('toggle-kani-chat'))}
        >
          <svg viewBox="0 0 24 24" stroke="var(--p)">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              fontSize: 7,
              fontWeight: 700,
              color: '#fff',
              background: 'var(--g)',
              padding: '2px 5px',
              borderRadius: 6,
              boxShadow: '0 2px 6px var(--gg)',
            }}
          >
            KANI
          </span>
        </div>

        {/* Avatar */}
        <div className="hdr-av">MK</div>
      </div>
    </div>
  )
}

function formatTime(): string {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}
