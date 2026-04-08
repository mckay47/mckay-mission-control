import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Power, Moon } from 'lucide-react'
import { StampButton } from './StampButton.tsx'

interface HeaderProps {
  backLink?: { label: string; href: string }
  ledColor?: string
  title?: string
  toggleTheme?: () => void
}

export function Header({ backLink, toggleTheme }: HeaderProps) {
  const navigate = useNavigate()
  const [datetime, setDatetime] = useState(() => formatDatetime())

  useEffect(() => {
    const id = setInterval(() => setDatetime(formatDatetime()), 30_000)
    return () => clearInterval(id)
  }, [])

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
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            ↑ {backLink.label}
          </button>
        )}
      </div>

      <div className="hdr-r">
        <StampButton />

        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--tx3)',
            letterSpacing: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {datetime}
        </div>

        {/* Dark / Light mode toggle */}
        <div
          className="ghost-btn"
          style={{ '--bc': 'rgba(255,255,255,0.04)', width: 38, height: 38, cursor: 'pointer' } as React.CSSProperties}
          onClick={toggleTheme}
          title="Dark / Light Mode"
        >
          <Moon size={17} stroke="var(--tx3)" strokeWidth={1.8} />
        </div>

        {/* Power / Logoff ghost button */}
        <div
          className="ghost-btn"
          style={{ '--bc': 'rgba(255,61,61,0.18)', width: 38, height: 38 } as React.CSSProperties}
          onClick={() => document.dispatchEvent(new CustomEvent('open-shutdown'))}
          title="System herunterfahren"
        >
          <Power size={17} stroke="var(--tx3)" strokeWidth={1.8} />
        </div>
      </div>
    </div>
  )
}

function formatDatetime(): string {
  const now = new Date()
  const days = ['SONNTAG', 'MONTAG', 'DIENSTAG', 'MITTWOCH', 'DONNERSTAG', 'FREITAG', 'SAMSTAG']
  const day = days[now.getDay()]
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const hh = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  return `${day} ${dd}/${mm} ${hh}:${min}`
}
