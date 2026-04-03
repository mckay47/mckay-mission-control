import { AGENTS as AGENT_DATA } from '../../lib/data'

/* ── Derive KANI metrics from agent data ── */
const kaniAgent = AGENT_DATA.find(a => a.n.includes('KANI')) || AGENT_DATA[0]
const totalCost = AGENT_DATA.reduce((s, a) => s + parseFloat(a.cost.replace(/[^\d.]/g, '') || '0'), 0)

const METRICS = [
  { value: kaniAgent?.tkn || '0K', label: 'Tokens', color: 'var(--cyan)' },
  { value: `${AGENT_DATA.length}`, label: 'Agents', color: 'var(--purple)' },
  { value: `${AGENT_DATA.filter(a => a.st === 'active').length}`, label: 'Active', color: 'var(--green)' },
  { value: `\u20ac${totalCost.toFixed(2)}`, label: 'Cost', color: 'var(--orange)' },
]

const CIRCUMFERENCE = 2 * Math.PI * 25 // ~157

interface PerfBox {
  name: string
  color: string
  pct: number
  status: 'active' | 'warning'
  details: { icon: string; label: string; value: string }[]
}

const PERF_BOXES: PerfBox[] = [
  {
    name: 'CPU',
    color: 'var(--green)',
    pct: 23,
    status: 'active',
    details: [
      { icon: '\u26a1', label: 'Frequency', value: '3.2 GHz' },
      { icon: '\ud83c\udf21', label: 'Temp', value: '42\u00b0C' },
      { icon: '\u25c9', label: 'Cores', value: '8/8' },
    ],
  },
  {
    name: 'Memory',
    color: 'var(--cyan)',
    pct: 58,
    status: 'active',
    details: [
      { icon: '\ud83d\udcca', label: 'Used', value: '9.3 GB' },
      { icon: '\ud83d\udcbe', label: 'Total', value: '16 GB' },
      { icon: '\u26a1', label: 'Swap', value: '0.2 GB' },
    ],
  },
  {
    name: 'API Limit',
    color: 'var(--orange)',
    pct: 72,
    status: 'warning',
    details: [
      { icon: '\ud83d\udce4', label: 'Requests', value: '7.2k/10k' },
      { icon: '\u23f1', label: 'Reset', value: '4h 12m' },
      { icon: '\ud83d\udcc8', label: 'Peak', value: '89%' },
    ],
  },
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
              <span style={{ fontSize: 9, color: 'var(--green)' }}>Processing...</span>
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

        {/* Performance Boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {PERF_BOXES.map(box => {
            const offset = CIRCUMFERENCE * (1 - box.pct / 100)
            return (
              <div key={box.name} className="perf-block" style={{
                borderRadius: 12, padding: '12px 10px', border: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6,
                    background: `color-mix(in srgb, ${box.color} 12%, transparent)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={box.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      {box.name === 'CPU' && <><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></>}
                      {box.name === 'Memory' && <><rect x="2" y="2" width="20" height="20" rx="2" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="12" y1="2" x2="12" y2="22" /></>}
                      {box.name === 'API Limit' && <><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></>}
                    </svg>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{box.name}</span>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: box.status === 'active' ? 'var(--green)' : 'var(--orange)',
                    boxShadow: box.status === 'active' ? '0 0 8px var(--green-glow)' : '0 0 8px var(--orange-glow)',
                    animation: 'dotPulse 2s ease-in-out infinite',
                  }} />
                </div>

                {/* Gauge */}
                <div style={{ width: 60, height: 60, position: 'relative' }}>
                  <svg viewBox="0 0 60 60" width={60} height={60} style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={30} cy={30} r={25} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
                    <circle
                      cx={30} cy={30} r={25}
                      fill="none"
                      stroke={box.color}
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={offset}
                      style={{ filter: `drop-shadow(0 0 6px ${box.color})`, transition: 'stroke-dashoffset 1s ease-out' }}
                    />
                  </svg>
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: box.color }}>{box.pct}%</span>
                  </div>
                </div>

                {/* Details */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {box.details.map(d => (
                    <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 8 }}>
                      <span style={{ width: 14, textAlign: 'center' }}>{d.icon}</span>
                      <span style={{ flex: 1, color: 'var(--text-muted)' }}>{d.label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)' }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
