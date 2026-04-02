import { useState, useCallback } from 'react'
import DetailHeader from '../DetailHeader'

/* ── Dummy data ─────────────────────────────────────────── */

const services = [
  { name: 'Claude API', cost: '€42.50', color: 'var(--purple)', bg: 'rgba(167,139,250,0.12)', pct: 80, icon: <><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16"/></> },
  { name: 'Supabase', cost: '€8.20', color: 'var(--green)', bg: 'rgba(52,211,153,0.12)', pct: 15, icon: <><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></> },
  { name: 'Vercel', cost: '€0.00', color: 'var(--cyan)', bg: 'rgba(45,212,191,0.12)', pct: 0, icon: <polygon points="12 2 22 22 2 22"/> },
  { name: 'GitHub', cost: '€1.80', color: 'var(--blue)', bg: 'rgba(96,165,250,0.12)', pct: 3, icon: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61"/> },
  { name: 'Domain/DNS', cost: '€0.20', color: 'var(--pink)', bg: 'rgba(244,114,182,0.12)', pct: 1, icon: <rect x="3" y="3" width="18" height="18" rx="2"/> },
]

const projects = [
  { name: 'Mission Control', cost: '€18.40', pct: '35%', color: 'var(--purple)' },
  { name: 'Hebammenbuero', cost: '€14.20', pct: '27%', color: 'var(--green)' },
  { name: 'TennisCoach', cost: '€8.50', pct: '16%', color: 'var(--orange)' },
  { name: 'FindeMeine', cost: '€6.30', pct: '12%', color: 'var(--cyan)' },
  { name: 'Stillprobleme', cost: '€5.30', pct: '10%', color: 'var(--red)' },
]

const tips = [
  { text: 'Prompt-Caching nutzen für wiederholte Queries', save: '-€3.20', icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/> },
  { text: 'Idle-Sessions automatisch beenden (>15min)', save: '-€2.10', icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
  { text: 'Prompts optimieren — kürzere System-Prompts', save: '-€1.80', icon: <><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></> },
  { text: 'Batch-Requests für Research-Agents bündeln', save: '-€0.90', icon: <><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/></> },
]

const consumers = [
  { rank: 1, name: 'Research', val: '45K', pct: 85, grad: 'linear-gradient(90deg,var(--purple),var(--pink))', glow: 'var(--purple-glow)', color: 'var(--purple)' },
  { rank: 2, name: 'Building', val: '38K', pct: 72, grad: 'linear-gradient(90deg,var(--cyan),var(--green))', glow: 'var(--cyan-glow)', color: 'var(--cyan)' },
  { rank: 3, name: 'Debugging', val: '22K', pct: 42, grad: 'linear-gradient(90deg,var(--orange),var(--yellow))', glow: 'var(--orange-glow)', color: 'var(--orange)' },
  { rank: 4, name: 'Planning', val: '16K', pct: 30, grad: 'linear-gradient(90deg,var(--blue),var(--violet))', glow: 'var(--blue-glow)', color: 'var(--blue)' },
  { rank: 5, name: 'Thinktank', val: '11K', pct: 20, grad: 'linear-gradient(90deg,var(--pink),var(--red))', glow: 'var(--pink-glow)', color: 'var(--pink)' },
]

/* ── Styles ──────────────────────────────────────────────── */

const transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)'

const cardStyle = (vars: Record<string, string>, delay: number): React.CSSProperties => ({
  ...Object.fromEntries(Object.entries(vars)),
  animation: `fadeInUp 0.5s ease-out ${delay * 0.05}s both`,
})

const cardBody: React.CSSProperties = { flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflow: 'hidden' }

const row: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }

const valLg: React.CSSProperties = { fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-mono)', lineHeight: 1 }
const valMd: React.CSSProperties = { fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)' }
const valSm: React.CSSProperties = { fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)' }
const lbl: React.CSSProperties = { fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }
const lblMd: React.CSSProperties = { fontSize: 9, color: 'var(--text-muted)' }

const barTrack: React.CSSProperties = { height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden', marginTop: 6 }
const barFillBase: React.CSSProperties = { height: '100%', borderRadius: 3, position: 'relative', transition: 'width 1s ease' }

const serviceRow: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(10,20,25,0.18)', backdropFilter: 'blur(8px)', borderRadius: 10, border: '1px solid var(--border)', marginBottom: 6, transition }
const serviceIcon: React.CSSProperties = { width: 22, height: 22, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }
const serviceName: React.CSSProperties = { flex: 1, fontSize: 10 }
const serviceVal: React.CSSProperties = { fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)' }
const serviceBar: React.CSSProperties = { width: 50, height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }

const projCostRow: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }
const projDot: React.CSSProperties = { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 }
const projName: React.CSSProperties = { flex: 1, fontSize: 10 }
const projVal: React.CSSProperties = { fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)' }
const projPct: React.CSSProperties = { fontSize: 8, color: 'var(--text-muted)', width: 32, textAlign: 'right' }

const tipRow: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(10,20,25,0.18)', backdropFilter: 'blur(8px)', borderRadius: 10, border: '1px solid var(--border)', marginBottom: 6, cursor: 'pointer', transition }
const tipIcon: React.CSSProperties = { width: 22, height: 22, borderRadius: 8, background: 'rgba(52,211,153,0.12)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }
const tipText: React.CSSProperties = { flex: 1, fontSize: 10, color: 'var(--text-secondary)' }
const tipSave: React.CSSProperties = { fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--green)' }

const consumerRow: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }
const consumerRank: React.CSSProperties = { fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', width: 16 }
const consumerName: React.CSSProperties = { fontSize: 10, width: 70, color: 'var(--text-secondary)' }
const consumerBar: React.CSSProperties = { flex: 1, height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden' }
const consumerVal: React.CSSProperties = { fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)', width: 40, textAlign: 'right' }

const budgetBtn: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 10, background: 'rgba(10,20,25,0.18)', backdropFilter: 'blur(8px)', borderRadius: 12, border: '1px solid var(--border)', cursor: 'pointer', transition, fontFamily: 'inherit', color: 'var(--text-secondary)', fontSize: 10, fontWeight: 600 }

const chartLabel: React.CSSProperties = { fontSize: 8, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }

const footer: React.CSSProperties = { marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border)' }

/* ── SVG icon helper ─────────────────────────────────────── */

function SvgIcon({ children, size = 11, style }: { children: React.ReactNode; size?: number; style?: React.CSSProperties }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth={2} fill="none" style={style}>{children}</svg>
}

/* ── Component ───────────────────────────────────────────── */

export default function FinanzenDetail() {
  const [budget, setBudget] = useState(500)

  const adjustBudget = useCallback((delta: number) => {
    setBudget(prev => Math.max(100, Math.min(2000, prev + delta)))
  }, [])

  const resetBudget = useCallback(() => setBudget(500), [])

  return (
    <div className="dashboard" style={{ gridTemplateRows: '44px 1fr' }}>
      <DetailHeader
        title="FINANZEN"
        color="orange"
        pills={[
          { value: '€52.70', label: 'diesen Monat', color: 'orange' },
          { value: '~18d', label: 'Budget übrig', color: 'green' },
        ]}
      />

      {/* 3×3 Grid */}
      <div style={{ gridColumn: '1/-1', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: 18, overflow: 'hidden' }}>

        {/* ─── R1C1: BUDGET OVERVIEW ─── */}
        <div className="card" style={cardStyle({ '--card-accent': 'var(--orange)', '--card-accent2': 'var(--yellow)', '--card-glow': 'rgba(251,191,36,0.05)' }, 1)}>
          <div className="card-header">
            <div className="card-header-left"><span className="card-icon" style={{ background: 'var(--orange)', color: 'var(--orange)' }} /><span className="card-title" style={{ fontSize: 10, letterSpacing: 2 }}>Budget Overview</span></div>
            <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>April 2026</span>
          </div>
          <div style={cardBody}>
            {/* Donut + Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 80, height: 80, position: 'relative' }}>
                <svg viewBox="0 0 80 80" width={80} height={80} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={40} cy={40} r={32} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={6} />
                  <circle cx={40} cy={40} r={32} fill="none" stroke="var(--orange)" strokeWidth={6} strokeLinecap="round" strokeDasharray={201} strokeDashoffset={131} style={{ filter: 'drop-shadow(0 0 6px var(--orange-glow))' }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--orange)' }}>35%</span>
                  <span style={{ fontSize: 6, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verbraucht</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 4 }}>Token Budget</div>
                <div style={{ ...valMd, color: 'var(--orange)' }}>175K <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>/ 500K</span></div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ ...valMd, color: 'var(--green)' }}>€52.70</div>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 2 }}>diesen Monat</div>
                </div>
              </div>
            </div>
            {/* Bar */}
            <div style={{ ...barTrack, marginTop: 14 }}>
              <div style={{ ...barFillBase, width: '35%', background: 'linear-gradient(90deg,var(--green),var(--orange))', boxShadow: '0 0 10px var(--orange-glow)' }}>
                <div style={{ content: "''", position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)', animation: 'shimmer 2s ease-in-out infinite' }} />
              </div>
            </div>
            <div style={{ ...row, marginTop: 6 }}>
              <span style={lbl}>0</span>
              <span style={{ ...lbl, color: 'var(--orange)' }}>← 35% →</span>
              <span style={lbl}>500K</span>
            </div>
            {/* Footer stats */}
            <div style={footer}>
              <div style={row}><span style={lblMd}>Ø Token/Tag</span><span style={{ ...valSm, color: 'var(--cyan)' }}>8.7K</span></div>
              <div style={{ ...row, marginTop: 6 }}><span style={lblMd}>Ø Kosten/Tag</span><span style={{ ...valSm, color: 'var(--green)' }}>€3.80</span></div>
            </div>
          </div>
        </div>

        {/* ─── R1C2: KOSTEN PRO SERVICE ─── */}
        <div className="card" style={cardStyle({ '--card-accent': 'var(--purple)', '--card-accent2': 'var(--blue)', '--card-glow': 'rgba(167,139,250,0.05)' }, 2)}>
          <div className="card-header">
            <div className="card-header-left"><span className="card-icon" style={{ background: 'var(--purple)', color: 'var(--purple)' }} /><span className="card-title" style={{ fontSize: 10, letterSpacing: 2 }}>Kosten / Service</span></div>
            <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>5 Services</span>
          </div>
          <div style={cardBody}>
            {services.map((s, i) => (
              <div key={i} style={{ ...serviceRow, marginBottom: i === services.length - 1 ? 0 : 6 }}>
                <div style={{ ...serviceIcon, background: s.bg, color: s.color }}>
                  <SvgIcon>{s.icon}</SvgIcon>
                </div>
                <span style={serviceName}>{s.name}</span>
                <span style={{ ...serviceVal, color: s.color }}>{s.cost}</span>
                <div style={serviceBar}>
                  <div style={{ height: '100%', borderRadius: 2, width: `${s.pct}%`, background: s.color, boxShadow: s.pct > 0 ? `0 0 6px ${s.color.replace('var(--', '').replace(')', '')}` : undefined }} />
                </div>
              </div>
            ))}
            <div style={footer}>
              <div style={row}><span style={lblMd}>Gesamt</span><span style={{ ...valSm, color: 'var(--orange)' }}>€52.70</span></div>
            </div>
          </div>
        </div>

        {/* ─── R1C3: PROGNOSE ─── */}
        <div className="card" style={cardStyle({ '--card-accent': 'var(--cyan)', '--card-accent2': 'var(--green)', '--card-glow': 'rgba(45,212,191,0.05)' }, 3)}>
          <div className="card-header">
            <div className="card-header-left"><span className="card-icon" style={{ background: 'var(--cyan)', color: 'var(--cyan)' }} /><span className="card-title" style={{ fontSize: 10, letterSpacing: 2 }}>Prognose</span></div>
            <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Linear Trend</span>
          </div>
          <div style={cardBody}>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <div style={{ ...valLg, color: 'var(--cyan)', textShadow: '0 0 20px var(--cyan-glow)' }}>~18</div>
              <div style={{ ...lbl, marginTop: 4 }}>Tage Budget verbleibend</div>
            </div>
            <div style={{ flex: 1, position: 'relative', marginTop: 8 }}>
              <svg viewBox="0 0 300 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                <line x1={0} y1={30} x2={300} y2={30} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                <line x1={0} y1={60} x2={300} y2={60} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                <line x1={0} y1={90} x2={300} y2={90} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                <line x1={0} y1={10} x2={300} y2={10} stroke="var(--red)" strokeWidth={1} strokeDasharray="6 4" opacity={0.5} />
                <text x={304} y={13} style={{ ...chartLabel, fontSize: 7, fill: 'var(--red)' }}>500K</text>
                <path d="M0,110 L30,106 L60,100 L90,92 L120,82 L150,70 L180,56 L210,40 L240,28 L270,18 L300,10" fill="none" stroke="url(#trendGrad)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px var(--cyan-glow))' }} />
                <path d="M0,110 L30,106 L60,100 L90,92 L120,82 L150,70 L180,56 L210,40 L240,28 L270,18 L300,10 L300,120 L0,120 Z" fill="url(#trendAreaGrad)" opacity={0.15} />
                <circle cx={90} cy={92} r={5} fill="var(--bg-dark)" stroke="var(--cyan)" strokeWidth={2} style={{ filter: 'drop-shadow(0 0 8px var(--cyan-glow))' }} />
                <text x={95} y={88} style={{ ...chartLabel, fontSize: 7, fill: 'var(--cyan)' }}>Heute</text>
                <path d="M90,92 L120,82 L150,70 L180,56 L210,40 L240,28 L270,18 L300,10" fill="none" stroke="var(--orange)" strokeWidth={1.5} strokeDasharray="6 4" opacity={0.5} />
                <text x={0} y={118} style={chartLabel}>1. Apr</text>
                <text x={135} y={118} style={chartLabel}>15. Apr</text>
                <text x={270} y={118} style={chartLabel}>30. Apr</text>
              </svg>
              <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                  <linearGradient id="trendGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: 'var(--green)' }} />
                    <stop offset="50%" style={{ stopColor: 'var(--cyan)' }} />
                    <stop offset="100%" style={{ stopColor: 'var(--orange)' }} />
                  </linearGradient>
                  <linearGradient id="trendAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'var(--cyan)' }} />
                    <stop offset="100%" style={{ stopColor: 'transparent' }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div style={{ paddingTop: 8, borderTop: '1px solid var(--border)', display: 'flex', gap: 12 }}>
              <div style={{ flex: 1, textAlign: 'center' }}><div style={{ ...valSm, color: 'var(--green)' }}>€3.80</div><div style={lbl}>Ø/Tag</div></div>
              <div style={{ flex: 1, textAlign: 'center' }}><div style={{ ...valSm, color: 'var(--orange)' }}>€114</div><div style={lbl}>Prognose Monat</div></div>
              <div style={{ flex: 1, textAlign: 'center' }}><div style={{ ...valSm, color: 'var(--cyan)' }}>20. Apr</div><div style={lbl}>80% Warnung</div></div>
            </div>
          </div>
        </div>

        {/* ─── R2C1: KOSTEN PRO PROJEKT ─── */}
        <div className="card" style={cardStyle({ '--card-accent': 'var(--green)', '--card-accent2': 'var(--purple)', '--card-glow': 'rgba(52,211,153,0.05)' }, 4)}>
          <div className="card-header">
            <div className="card-header-left"><span className="card-icon" style={{ background: 'var(--green)', color: 'var(--green)' }} /><span className="card-title" style={{ fontSize: 10, letterSpacing: 2 }}>Kosten / Projekt</span></div>
            <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>5 Projekte</span>
          </div>
          <div style={cardBody}>
            {projects.map((p, i) => (
              <div key={i} style={{ ...projCostRow, borderBottom: i === projects.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ ...projDot, background: p.color, color: p.color, boxShadow: `0 0 10px currentColor` }} />
                <span style={projName}>{p.name}</span>
                <span style={{ ...projVal, color: p.color }}>{p.cost}</span>
                <span style={projPct}>{p.pct}</span>
              </div>
            ))}
            <div style={footer}>
              <div style={row}><span style={lblMd}>Teuerster Agent</span><span style={{ ...valSm, color: 'var(--purple)' }}>research</span></div>
            </div>
          </div>
        </div>

        {/* ─── R2C2: TÄGLICHER VERLAUF ─── */}
        <div className="card" style={cardStyle({ '--card-accent': 'var(--blue)', '--card-accent2': 'var(--cyan)', '--card-glow': 'rgba(96,165,250,0.05)' }, 5)}>
          <div className="card-header">
            <div className="card-header-left"><span className="card-icon" style={{ background: 'var(--blue)', color: 'var(--blue)' }} /><span className="card-title" style={{ fontSize: 10, letterSpacing: 2 }}>Täglicher Verlauf</span></div>
            <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>7 Tage</span>
          </div>
          <div style={cardBody}>
            <div style={{ flex: 1, position: 'relative', marginTop: 8 }}>
              <svg viewBox="0 0 300 130" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                <line x1={0} y1={25} x2={300} y2={25} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                <line x1={0} y1={50} x2={300} y2={50} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                <line x1={0} y1={75} x2={300} y2={75} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                <line x1={0} y1={100} x2={300} y2={100} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                {/* Y Labels */}
                <text x={-2} y={28} textAnchor="end" style={{ ...chartLabel, fontSize: 7 }}>€12</text>
                <text x={-2} y={53} textAnchor="end" style={{ ...chartLabel, fontSize: 7 }}>€8</text>
                <text x={-2} y={78} textAnchor="end" style={{ ...chartLabel, fontSize: 7 }}>€4</text>
                <text x={-2} y={103} textAnchor="end" style={{ ...chartLabel, fontSize: 7 }}>€0</text>
                {/* Area fill */}
                <path d="M0,72 L50,65 L100,45 L150,58 L200,30 L250,50 L300,42 L300,110 L0,110 Z" fill="url(#dailyAreaGrad)" opacity={0.12} />
                {/* Line */}
                <path d="M0,72 L50,65 L100,45 L150,58 L200,30 L250,50 L300,42" fill="none" stroke="url(#dailyLineGrad)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px var(--blue-glow))' }} />
                {/* Dots */}
                <circle cx={0} cy={72} r={3} fill="var(--bg-dark)" stroke="var(--blue)" strokeWidth={2} />
                <circle cx={50} cy={65} r={3} fill="var(--bg-dark)" stroke="var(--blue)" strokeWidth={2} />
                <circle cx={100} cy={45} r={3.5} fill="var(--bg-dark)" stroke="var(--orange)" strokeWidth={2} style={{ filter: 'drop-shadow(0 0 8px var(--orange-glow))' }} />
                <circle cx={150} cy={58} r={3} fill="var(--bg-dark)" stroke="var(--blue)" strokeWidth={2} />
                <circle cx={200} cy={30} r={4} fill="var(--bg-dark)" stroke="var(--red)" strokeWidth={2} style={{ filter: 'drop-shadow(0 0 8px var(--red-glow))' }} />
                <circle cx={250} cy={50} r={3} fill="var(--bg-dark)" stroke="var(--blue)" strokeWidth={2} />
                <circle cx={300} cy={42} r={3.5} fill="var(--bg-dark)" stroke="var(--cyan)" strokeWidth={2} style={{ filter: 'drop-shadow(0 0 8px var(--cyan-glow))' }} />
                {/* Peak annotations */}
                <text x={100} y={38} textAnchor="middle" style={{ ...chartLabel, fontSize: 7, fill: 'var(--orange)' }}>€7.80</text>
                <text x={200} y={23} textAnchor="middle" style={{ ...chartLabel, fontSize: 7, fill: 'var(--red)' }}>€10.20 Peak</text>
                {/* X Labels */}
                <text x={0} y={125} style={chartLabel}>Mi</text>
                <text x={50} y={125} style={chartLabel}>Do</text>
                <text x={100} y={125} style={chartLabel}>Fr</text>
                <text x={150} y={125} style={chartLabel}>Sa</text>
                <text x={200} y={125} style={chartLabel}>So</text>
                <text x={250} y={125} style={chartLabel}>Mo</text>
                <text x={290} y={125} style={{ ...chartLabel, fill: 'var(--cyan)' }}>Heute</text>
              </svg>
              <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                  <linearGradient id="dailyLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: 'var(--blue)' }} />
                    <stop offset="100%" style={{ stopColor: 'var(--cyan)' }} />
                  </linearGradient>
                  <linearGradient id="dailyAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'var(--blue)' }} />
                    <stop offset="100%" style={{ stopColor: 'transparent' }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div style={{ paddingTop: 8, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 8, color: 'var(--text-muted)' }}>Ø €5.40/Tag</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--red)' }}>↑ 12% vs Vorwoche</span>
            </div>
          </div>
        </div>

        {/* ─── R2C3: SPAROPTIONEN ─── */}
        <div className="card" style={cardStyle({ '--card-accent': 'var(--green)', '--card-accent2': 'var(--cyan)', '--card-glow': 'rgba(52,211,153,0.05)' }, 6)}>
          <div className="card-header">
            <div className="card-header-left"><span className="card-icon" style={{ background: 'var(--green)', color: 'var(--green)' }} /><span className="card-title" style={{ fontSize: 10, letterSpacing: 2 }}>Sparoptionen</span></div>
            <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>~€8/w sparen</span>
          </div>
          <div style={cardBody}>
            {tips.map((t, i) => (
              <div key={i} style={{ ...tipRow, marginBottom: i === tips.length - 1 ? 0 : 6 }}>
                <div style={tipIcon}><SvgIcon>{t.icon}</SvgIcon></div>
                <span style={tipText}>{t.text}</span>
                <span style={tipSave}>{t.save}</span>
              </div>
            ))}
            <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ ...valMd, color: 'var(--green)', textShadow: '0 0 15px var(--green-glow)' }}>€8.00<span style={{ fontSize: 10, color: 'var(--text-muted)' }}>/Woche</span></div>
              <div style={{ ...lbl, marginTop: 4 }}>Potenzielle Einsparung</div>
            </div>
          </div>
        </div>

        {/* ─── R3C1: MONATSVERLAUF ─── */}
        <div className="card" style={cardStyle({ '--card-accent': 'var(--pink)', '--card-accent2': 'var(--orange)', '--card-glow': 'rgba(244,114,182,0.05)' }, 7)}>
          <div className="card-header">
            <div className="card-header-left"><span className="card-icon" style={{ background: 'var(--pink)', color: 'var(--pink)' }} /><span className="card-title" style={{ fontSize: 10, letterSpacing: 2 }}>Monatsverlauf</span></div>
            <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>30 Tage</span>
          </div>
          <div style={cardBody}>
            <div style={{ flex: 1, position: 'relative', marginTop: 8 }}>
              <svg viewBox="0 0 300 110" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                <line x1={0} y1={25} x2={300} y2={25} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                <line x1={0} y1={50} x2={300} y2={50} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                <line x1={0} y1={75} x2={300} y2={75} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                {/* Budget limit line */}
                <line x1={0} y1={15} x2={300} y2={15} stroke="var(--red)" strokeWidth={1} strokeDasharray="6 4" opacity={0.5} />
                <text x={260} y={12} style={{ ...chartLabel, fontSize: 7, fill: 'var(--red)' }}>Budget Limit</text>
                {/* Cumulative area */}
                <path d="M0,100 L10,98 L20,96 L30,94 L40,92 L50,90 L60,87 L70,84 L80,80 L90,76 L100,73 L110,70 L120,68 L130,65 L140,63 L150,60 L160,58 L170,56 L180,54 L190,52 L200,50 L210,48 L220,46 L240,44 L260,42 L280,40 L300,38 L300,110 L0,110 Z" fill="url(#monthAreaGrad)" opacity={0.15} />
                <path d="M0,100 L10,98 L20,96 L30,94 L40,92 L50,90 L60,87 L70,84 L80,80 L90,76 L100,73 L110,70 L120,68 L130,65 L140,63 L150,60 L160,58 L170,56 L180,54 L190,52 L200,50 L210,48 L220,46 L240,44 L260,42 L280,40 L300,38" fill="none" stroke="url(#monthLineGrad)" strokeWidth={2} strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px var(--pink-glow))' }} />
                {/* Current marker */}
                <circle cx={30} cy={94} r={4} fill="var(--bg-dark)" stroke="var(--cyan)" strokeWidth={2} style={{ filter: 'drop-shadow(0 0 8px var(--cyan-glow))' }} />
                {/* Projected dashed */}
                <path d="M30,94 L60,87 L90,76 L120,68 L150,60 L180,54 L210,48 L240,44 L270,40 L300,38" fill="none" stroke="var(--text-muted)" strokeWidth={1} strokeDasharray="4 3" opacity={0.4} />
                <text x={0} y={108} style={chartLabel}>1.</text>
                <text x={145} y={108} style={chartLabel}>15.</text>
                <text x={290} y={108} style={chartLabel}>30.</text>
              </svg>
              <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                  <linearGradient id="monthLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: 'var(--green)' }} />
                    <stop offset="40%" style={{ stopColor: 'var(--cyan)' }} />
                    <stop offset="80%" style={{ stopColor: 'var(--orange)' }} />
                    <stop offset="100%" style={{ stopColor: 'var(--red)' }} />
                  </linearGradient>
                  <linearGradient id="monthAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'var(--pink)' }} />
                    <stop offset="100%" style={{ stopColor: 'transparent' }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* ─── R3C2: TOP VERBRAUCHER ─── */}
        <div className="card" style={cardStyle({ '--card-accent': 'var(--red)', '--card-accent2': 'var(--orange)', '--card-glow': 'rgba(248,113,113,0.05)' }, 8)}>
          <div className="card-header">
            <div className="card-header-left"><span className="card-icon" style={{ background: 'var(--red)', color: 'var(--red)' }} /><span className="card-title" style={{ fontSize: 10, letterSpacing: 2 }}>Top Verbraucher</span></div>
            <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>nach Tokens</span>
          </div>
          <div style={cardBody}>
            {consumers.map(c => (
              <div key={c.rank} style={consumerRow}>
                <span style={consumerRank}>{c.rank}</span>
                <span style={consumerName}>{c.name}</span>
                <div style={consumerBar}>
                  <div style={{ height: '100%', borderRadius: 4, width: `${c.pct}%`, background: c.grad, boxShadow: `0 0 8px ${c.glow}`, position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)', animation: 'shimmer 2s ease-in-out infinite' }} />
                  </div>
                </div>
                <span style={{ ...consumerVal, color: c.color }}>{c.val}</span>
              </div>
            ))}
            <div style={footer}>
              <div style={row}><span style={lblMd}>Andere</span><span style={{ ...valSm, color: 'var(--text-muted)' }}>43K</span></div>
            </div>
          </div>
        </div>

        {/* ─── R3C3: BUDGET ANPASSEN ─── */}
        <div className="card" style={cardStyle({ '--card-accent': 'var(--yellow)', '--card-accent2': 'var(--orange)', '--card-glow': 'rgba(234,179,8,0.05)' }, 9)}>
          <div className="card-header">
            <div className="card-header-left"><span className="card-icon" style={{ background: 'var(--yellow)', color: 'var(--yellow)' }} /><span className="card-title" style={{ fontSize: 10, letterSpacing: 2 }}>Budget Anpassen</span></div>
          </div>
          <div style={{ ...cardBody, gap: 12 }}>
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ ...lbl, marginBottom: 6 }}>Aktuelles Monatslimit</div>
              <div style={{ ...valLg, color: 'var(--orange)', textShadow: '0 0 20px var(--orange-glow)' }}>{budget}K</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>≈ €{(budget * 0.3).toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{ ...budgetBtn, flex: 1, borderColor: 'rgba(52,211,153,0.2)' }} onClick={() => adjustBudget(50)}>
                <SvgIcon size={12} style={{ color: 'var(--green)' }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></SvgIcon>
                <span style={{ color: 'var(--green)' }}>+50K</span>
              </button>
              <button style={{ ...budgetBtn, flex: 1, borderColor: 'rgba(248,113,113,0.2)' }} onClick={() => adjustBudget(-50)}>
                <SvgIcon size={12} style={{ color: 'var(--red)' }}><line x1="5" y1="12" x2="19" y2="12" /></SvgIcon>
                <span style={{ color: 'var(--red)' }}>-50K</span>
              </button>
            </div>
            <button style={{ ...budgetBtn, borderColor: 'rgba(251,191,36,0.2)' }} onClick={resetBudget}>
              <SvgIcon size={12} style={{ color: 'var(--orange)' }}><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></SvgIcon>
              <span style={{ color: 'var(--orange)' }}>Auf Standard zurücksetzen (500K)</span>
            </button>
            <div style={{ marginTop: 'auto', padding: 12, background: 'rgba(10,20,25,0.18)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <div style={row}><span style={lblMd}>Verbrauchswarnung bei</span><span style={{ ...valSm, color: 'var(--orange)' }}>80%</span></div>
              <div style={{ ...barTrack, marginTop: 8 }}>
                <div style={{ ...barFillBase, width: '80%', background: 'linear-gradient(90deg,var(--green),var(--orange),var(--red))', boxShadow: '0 0 8px var(--orange-glow)' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)', animation: 'shimmer 2s ease-in-out infinite' }} />
                </div>
              </div>
              <div style={{ ...row, marginTop: 4 }}>
                <span style={lbl}>Safe</span>
                <span style={{ ...lbl, color: 'var(--orange)' }}>Warnung</span>
                <span style={{ ...lbl, color: 'var(--red)' }}>Limit</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
