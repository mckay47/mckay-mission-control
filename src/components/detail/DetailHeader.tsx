import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

interface DetailHeaderProps {
  title: string
  color: string
  pills?: { value: string; label: string; color?: string }[]
}

export default function DetailHeader({ title, color, pills }: DetailHeaderProps) {
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') navigate('/') }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  return (
    <div className="header" style={{ gridColumn: '1/-1' }}>
      <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 20, cursor: 'pointer', transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)', color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-ui)' }}>
        <svg viewBox="0 0 24 24" width={14} height={14} stroke="currentColor" strokeWidth={2} fill="none"><polyline points="15 18 9 12 15 6" /></svg>
        Cockpit
        <kbd style={{ fontSize: 8, padding: '2px 5px', background: 'rgba(0,0,0,0.4)', borderRadius: 4, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ESC</kbd>
      </button>

      <div className="logo-group">
        <div className="logo">
          <div className="logo-ring outer" />
          <div className="logo-ring inner" />
          <div className="logo-core">
            <svg viewBox="0 0 24 24"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" /></svg>
          </div>
        </div>
        <span className="brand">MCKAY</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: `var(--${color})`, animation: 'dotPulse 3s ease-in-out infinite', color: `var(--${color})` }} />
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase' as const }}>{title}</span>
      </div>

      <div className="header-spacer" />

      {pills && (
        <div className="nav-pills">
          {pills.map(p => (
            <div key={p.label} className="nav-pill">
              <span className="nav-pill-value" style={{ color: p.color ? `var(--${p.color})` : undefined }}>{p.value}</span>
              <span className="nav-pill-label">{p.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
