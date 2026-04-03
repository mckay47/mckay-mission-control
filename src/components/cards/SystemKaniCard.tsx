import { AGENTS as AGENT_DATA } from '../../lib/data'

/* ── Derive KANI metrics from agent data ── */
const kaniAgent = AGENT_DATA.find(a => a.n.includes('KANI')) || AGENT_DATA[0]
const totalCost = AGENT_DATA.reduce((s, a) => s + parseFloat(a.cost.replace(/[^\d.]/g, '') || '0'), 0)

const METRICS = [
  { value: kaniAgent?.tkn || '0K', label: 'Tokens (est.)', color: 'var(--cyan)' },
  { value: `${AGENT_DATA.length}`, label: 'Agents (est.)', color: 'var(--purple)' },
  { value: `${AGENT_DATA.filter(a => a.st === 'active').length}`, label: 'Active (est.)', color: 'var(--green)' },
  { value: `\u20ac${totalCost.toFixed(2)}`, label: 'Cost (est.)', color: 'var(--orange)' },
]

export default function SystemKaniCard() {
  return (
    <div className="card system-card">
      <div className="card-header">
        <div className="card-header-left">
          <span className="card-icon cyan" />
          <span className="card-title">SYSTEM / KANI</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto', position: 'relative', zIndex: 1 }}>
        {/* KANI Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Avatar with animated rings */}
          <div style={{ width: 48, height: 48, position: 'relative', flexShrink: 0 }}>
            {/* Outer cyan ring */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '2px solid var(--cyan)', opacity: 0.6,
              animation: 'logoSpin 5s linear infinite',
            }} />
            {/* Inner purple ring */}
            <div style={{
              position: 'absolute', inset: 6, borderRadius: '50%',
              border: '2px solid var(--purple)', opacity: 0.4,
              animation: 'logoSpin 4s linear infinite reverse',
            }} />
            {/* Core gradient */}
            <div style={{
              position: 'absolute', inset: 12, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
              animation: 'coreBreath 4s ease-in-out infinite',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* Hexagon SVG */}
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>KANI</span>
            <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{kaniAgent?.mdl || 'claude'}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: 'var(--green)',
                boxShadow: '0 0 10px var(--green-glow)',
                animation: 'dotPulse 2s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 9, color: 'var(--green)' }}>Online</span>
            </div>
          </div>
        </div>

        {/* System Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {METRICS.map(m => (
            <div key={m.label} className="sys-metric" style={{
              borderRadius: 10, padding: '10px 8px', textAlign: 'center',
              border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: m.color, textShadow: `0 0 8px ${m.color}` }}>{m.value}</div>
              <div style={{ fontSize: 6, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Performance section — not connected */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          borderRadius: 12,
          border: '1px solid var(--border)',
          padding: '20px 16px',
        }}>
          <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="var(--text-muted)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <line x1="9" y1="1" x2="9" y2="4" />
            <line x1="15" y1="1" x2="15" y2="4" />
            <line x1="9" y1="20" x2="9" y2="23" />
            <line x1="15" y1="20" x2="15" y2="23" />
            <line x1="20" y1="9" x2="23" y2="9" />
            <line x1="20" y1="14" x2="23" y2="14" />
            <line x1="1" y1="9" x2="4" y2="9" />
            <line x1="1" y1="14" x2="4" y2="14" />
          </svg>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>System-Metriken nicht verfügbar</span>
          <span style={{ fontSize: 8, color: 'var(--text-muted)' }}>Wird in Phase F implementiert</span>
        </div>
      </div>
    </div>
  )
}
