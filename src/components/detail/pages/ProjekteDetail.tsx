import { useState } from 'react'
import DetailHeader from '../DetailHeader'

/* ── Dummy data ─────────────────────────────────────────── */

interface Project {
  name: string
  sub: string
  pct: number
  color: string
  glow: string
  live?: boolean
  blocked?: boolean
}

const projects: Project[] = [
  { name: 'Mission Control', sub: 'build-agent · MVP in 2d', pct: 67, color: 'var(--purple)', glow: 'var(--purple-glow)' },
  { name: 'Hebammenbuero', sub: '2 agents · MVP in 5d', pct: 45, color: 'var(--green)', glow: 'var(--green-glow)' },
  { name: 'TennisCoach', sub: 'review · Launch 3d', pct: 80, color: 'var(--orange)', glow: 'var(--orange-glow)' },
  { name: 'FindeMeine', sub: '\u20AC340/mo · Maintenance', pct: 100, color: 'var(--cyan)', glow: 'var(--cyan-glow)', live: true },
  { name: 'Stillprobleme', sub: 'Waiting for credentials', pct: 23, color: 'var(--red)', glow: 'var(--red-glow)', blocked: true },
]

const selectedProject = {
  phase: 'MVP Build',
  deadline: '04. Apr',
  agent: 'build-agent',
  stack: 'React + Vite + Supabase',
  repo: 'mckay-os/mission-control',
  weeklyBurn: '\u20AC2.1k',
}

const statsData = [
  { value: '234', label: 'Commits', color: 'var(--blue)', bg: 'rgba(96,165,250,0.12)', icon: 'clipboard' as const },
  { value: '3', label: 'Branches', color: 'var(--purple)', bg: 'rgba(167,139,250,0.12)', icon: 'branch' as const },
  { value: '12', label: 'PRs Open', color: 'var(--green)', bg: 'rgba(52,211,153,0.12)', icon: 'pr' as const },
  { value: '8', label: 'Issues', color: 'var(--red)', bg: 'rgba(248,113,113,0.12)', icon: 'alert' as const },
  { value: '47', label: 'Tests Passing', color: 'var(--cyan)', bg: 'rgba(45,212,191,0.12)', icon: 'check' as const },
]

const ganttRows = [
  { label: 'MC Dashboard', left: 0, width: 55, color: 'var(--purple)', glow: 'var(--purple-glow)', gradientEnd: 'rgba(167,139,250,0.6)' },
  { label: 'Hebammen', left: 10, width: 60, color: 'var(--green)', glow: 'var(--green-glow)', gradientEnd: 'rgba(52,211,153,0.6)' },
  { label: 'TennisCoach', left: 5, width: 40, color: 'var(--orange)', glow: 'var(--orange-glow)', gradientEnd: 'rgba(251,191,36,0.6)' },
  { label: 'FindeMeine', left: 0, width: 100, color: 'var(--cyan)', glow: 'var(--cyan-glow)', gradientEnd: 'rgba(45,212,191,0.4)', opacity: 0.5 },
  { label: 'Stillprobleme', left: 20, width: 15, color: 'var(--red)', glow: '', gradientEnd: '', blocked: true },
]

const todos = [
  'API Routes f\u00FCr Appointments',
  'Auth Flow implementieren',
  'Dashboard UI Grid finalisieren',
  'Layer 2 Detail Views designen',
  'Responsive Testing',
  'Mock Data durch APIs ersetzen',
]

const commits = [
  { hash: 'a3f8c21', msg: 'feat: Layer 2 detail views grid', time: '2h' },
  { hash: 'b7e2d14', msg: 'fix: card hover glow tracking', time: '3h' },
  { hash: 'c1a9f32', msg: 'feat: mission feed ticker animation', time: '5h' },
  { hash: 'd4b6e78', msg: 'refactor: CSS variables cleanup', time: '6h' },
  { hash: 'e9c3a56', msg: 'feat: analog clock component', time: '1d' },
]

const actions = [
  { label: 'In Terminal \u00F6ffnen', primary: true, icon: 'terminal' as const },
  { label: 'GitHub \u00F6ffnen', primary: false, icon: 'github' as const },
  { label: 'Vercel Dashboard', primary: false, icon: 'vercel' as const },
  { label: 'Neues Todo', primary: false, icon: 'plus' as const },
  { label: 'Archivieren', primary: false, icon: 'archive' as const, danger: true },
]

/* ── SVG icon paths ─────────────────────────────────────── */

function StatIcon({ type, color }: { type: string; color: string }) {
  const s: React.CSSProperties = { width: 10, height: 10, stroke: color, strokeWidth: 2, fill: 'none' }
  switch (type) {
    case 'clipboard':
      return <svg viewBox="0 0 24 24" style={s}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /></svg>
    case 'branch':
      return <svg viewBox="0 0 24 24" style={s}><line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></svg>
    case 'pr':
      return <svg viewBox="0 0 24 24" style={s}><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 0 1 2 2v7" /><path d="M11 18H8a2 2 0 0 1-2-2V9" /></svg>
    case 'alert':
      return <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
    case 'check':
      return <svg viewBox="0 0 24 24" style={s}><polyline points="20 6 9 17 4 12" /></svg>
    default:
      return null
  }
}

function ActionIcon({ type }: { type: string }) {
  const s: React.CSSProperties = { width: 12, height: 12, stroke: 'currentColor', strokeWidth: 2, fill: 'none' }
  switch (type) {
    case 'terminal':
      return <svg viewBox="0 0 24 24" style={s}><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>
    case 'github':
      return <svg viewBox="0 0 24 24" style={s}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61" /></svg>
    case 'vercel':
      return <svg viewBox="0 0 24 24" style={s}><polygon points="12 2 22 22 2 22" /></svg>
    case 'plus':
      return <svg viewBox="0 0 24 24" style={s}><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
    case 'archive':
      return <svg viewBox="0 0 24 24" style={s}><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" /></svg>
    default:
      return null
  }
}

/* ── Component ──────────────────────────────────────────── */

export default function ProjekteDetail() {
  const [selected] = useState(0)
  const [checkedTodos, setCheckedTodos] = useState<Set<number>>(new Set())

  const proj = projects[selected]

  const toggleTodo = (idx: number) => {
    setCheckedTodos(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  /* Gauge math: circumference = 2 * PI * 28 ≈ 175.93 */
  const circumference = 2 * Math.PI * 28
  const dashOffset = circumference - (proj.pct / 100) * circumference

  return (
    <div className="dashboard" style={{ gridTemplateRows: '44px 1fr' }}>
      <DetailHeader
        title="PROJEKTE"
        color="cyan"
        pills={[
          { value: '4', label: 'Active', color: 'green' },
          { value: '1', label: 'Blocked', color: 'red' },
          { value: '52%', label: 'Avg Progress', color: 'cyan' },
        ]}
      />

      {/* 3x3 grid */}
      <div
        style={{
          gridColumn: '1/-1',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: 18,
          overflow: 'hidden',
        }}
      >
        {/* ═══════════════ R1C1: PROJEKT LISTE ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--purple)',
            '--card-accent2': 'var(--cyan)',
            '--card-glow': 'rgba(167,139,250,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--purple)', color: 'var(--purple)' }} />
              <span className="card-title">Projekt Liste</span>
            </div>
            <span className="card-header-right">5 Projekte</span>
          </div>
          <div className="card-body">
            {projects.map((p, i) => (
              <div
                onDoubleClick={() => {
                  const pid = p.name.toLowerCase().replace(/\s+/g, '-').slice(0, 3)
                  window.open(`/project/${pid}`, '_blank', 'width=1440,height=900,menubar=no,toolbar=no')
                }}
                key={p.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  background: 'rgba(10,20,25,0.18)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  borderLeft: `3px solid ${p.color}`,
                  marginBottom: 8,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  opacity: p.blocked ? 0.6 : 1,
                  ...(i === selected ? { borderColor: p.color, boxShadow: `0 0 15px color-mix(in srgb, ${p.color} 20%, transparent)` } : {}),
                }}
              >
                {/* dot */}
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: p.color,
                    color: p.color,
                    boxShadow: `0 0 10px currentColor`,
                    flexShrink: 0,
                    animation: !p.blocked ? 'dotPulse 2s ease-in-out infinite' : undefined,
                  }}
                />
                {/* info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {p.name}
                    {p.live && (
                      <span
                        style={{
                          fontSize: 6,
                          fontWeight: 700,
                          color: 'var(--cyan)',
                          background: 'rgba(0,212,200,0.12)',
                          padding: '2px 5px',
                          borderRadius: 3,
                          animation: 'glowPulse 1.5s ease-in-out infinite',
                        }}
                      >
                        ● LIVE
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 2 }}>{p.sub}</div>
                </div>
                {/* percentage */}
                <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: p.color }}>{p.pct}%</span>
                {/* bar */}
                <div style={{ width: 60, height: 5, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${p.pct}%`,
                      borderRadius: 3,
                      background: p.color,
                      boxShadow: `0 0 8px ${p.glow}`,
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        animation: 'shimmer 2s ease-in-out infinite',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ R1C2: SELECTED PROJECT DETAIL ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--purple)',
            '--card-accent2': 'var(--pink)',
            '--card-glow': 'rgba(167,139,250,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: proj.color, color: proj.color }} />
              <span className="card-title">{proj.name}</span>
            </div>
            <span className="card-header-right" style={{ color: proj.color }}>{proj.pct}%</span>
          </div>
          <div className="card-body">
            {/* Progress gauge + info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
              <div style={{ width: 70, height: 70, position: 'relative' }}>
                <svg viewBox="0 0 70 70" width={70} height={70} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={35} cy={35} r={28} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={6} />
                  <circle
                    cx={35}
                    cy={35}
                    r={28}
                    fill="none"
                    stroke={proj.color}
                    strokeWidth={6}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    style={{ filter: `drop-shadow(0 0 6px ${proj.glow})` }}
                  />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: proj.color }}>
                    {proj.pct}%
                  </span>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Phase</span>
                  <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--purple)' }}>{selectedProject.phase}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Deadline</span>
                  <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--orange)' }}>{selectedProject.deadline}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Agent</span>
                  <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>{selectedProject.agent}</span>
                </div>
              </div>
            </div>
            {/* Additional rows */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Stack</span>
              <span style={{ fontSize: 9, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{selectedProject.stack}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Repo</span>
              <span style={{ fontSize: 9, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>{selectedProject.repo}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Weekly Burn</span>
              <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--orange)' }}>{selectedProject.weeklyBurn}</span>
            </div>
            {/* Velocity sparkline */}
            <div style={{ marginTop: 'auto', paddingTop: 10 }}>
              <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                Velocity (7d)
              </div>
              <svg viewBox="0 0 200 30" style={{ width: '100%', height: 30, filter: `drop-shadow(0 0 4px ${proj.glow})` }}>
                <path d="M0,25 L28,22 L56,20 L84,15 L112,12 L140,8 L168,6 L200,4" fill="none" stroke={proj.color} strokeWidth={2} strokeLinecap="round" />
                <path d="M0,25 L28,22 L56,20 L84,15 L112,12 L140,8 L168,6 L200,4 L200,30 L0,30 Z" fill={proj.color} opacity={0.08} />
              </svg>
            </div>
          </div>
        </div>

        {/* ═══════════════ R1C3: PROJEKT STATS ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--blue)',
            '--card-accent2': 'var(--green)',
            '--card-glow': 'rgba(96,165,250,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--blue)', color: 'var(--blue)' }} />
              <span className="card-title">Projekt Stats</span>
            </div>
          </div>
          <div className="card-body" style={{ gap: 8 }}>
            {statsData.map(s => (
              <div
                key={s.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 12px',
                  background: 'rgba(10,20,25,0.18)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: s.bg,
                    color: s.color,
                  }}
                >
                  <StatIcon type={s.icon} color={s.color} />
                </div>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: s.color }}>{s.value}</span>
                  <div style={{ fontSize: 7, color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ R2C1: PROJEKT TIMELINE (GANTT) ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--orange)',
            '--card-accent2': 'var(--cyan)',
            '--card-glow': 'rgba(251,191,36,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--orange)', color: 'var(--orange)' }} />
              <span className="card-title">Projekt Timeline</span>
            </div>
            <span className="card-header-right">Gantt View</span>
          </div>
          <div className="card-body">
            {/* Date labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 7, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              <span>25. M\u00E4r</span><span>1. Apr</span><span>8. Apr</span><span>15. Apr</span><span>22. Apr</span>
            </div>
            {/* Gantt rows */}
            {ganttRows.map(g => (
              <div key={g.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 9, width: 80, color: 'var(--text-secondary)', textAlign: 'right' }}>{g.label}</span>
                <div style={{ flex: 1, height: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 6, position: 'relative', overflow: 'hidden' }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      height: '100%',
                      left: `${g.left}%`,
                      width: `${g.width}%`,
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 6,
                      fontWeight: 700,
                      color: '#fff',
                      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                      ...(g.blocked
                        ? { background: g.color, opacity: 0.4, border: `1px dashed rgba(248,113,113,0.4)` }
                        : {
                            background: `linear-gradient(90deg, ${g.color}, ${g.gradientEnd})`,
                            boxShadow: `0 0 8px ${g.glow}`,
                            opacity: g.opacity ?? 1,
                          }),
                    }}
                  >
                    {!g.blocked && (
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)', animation: 'shimmer 3s ease-in-out infinite' }} />
                    )}
                  </div>
                  {/* Today line */}
                  <div
                    style={{
                      position: 'absolute',
                      top: -4,
                      bottom: -4,
                      left: '30%',
                      width: 2,
                      background: 'var(--cyan)',
                      boxShadow: '0 0 8px var(--cyan-glow)',
                      zIndex: 2,
                    }}
                  />
                </div>
              </div>
            ))}
            {/* Legend */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: 12, fontSize: 7, color: 'var(--text-muted)', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 3, background: 'var(--cyan)', borderRadius: 2 }} />Heute
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 6, borderRadius: 2, background: 'var(--purple)' }} />Active
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 6, borderRadius: 2, border: '1px dashed var(--red)', background: 'none' }} />Blocked
              </span>
            </div>
          </div>
        </div>

        {/* ═══════════════ R2C2: OFFENE TODOS ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--green)',
            '--card-accent2': 'var(--cyan)',
            '--card-glow': 'rgba(52,211,153,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--green)', color: 'var(--green)' }} />
              <span className="card-title">Offene Todos</span>
            </div>
            <span className="card-header-right">MC · 6 offen</span>
          </div>
          <div className="card-body">
            {todos.map((t, i) => (
              <div
                key={t}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 0',
                  borderBottom: i < todos.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}
              >
                <div
                  onClick={() => toggleTodo(i)}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    border: checkedTodos.has(i) ? '2px solid var(--green)' : '2px solid var(--text-muted)',
                    background: checkedTodos.has(i) ? 'var(--green)' : 'transparent',
                    flexShrink: 0,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 8,
                    color: '#fff',
                  }}
                >
                  {checkedTodos.has(i) ? '\u2713' : ''}
                </div>
                <span style={{ flex: 1, fontSize: 10, textDecoration: checkedTodos.has(i) ? 'line-through' : 'none', opacity: checkedTodos.has(i) ? 0.5 : 1, transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)' }}>{t}</span>
                <span style={{ fontSize: 7, padding: '2px 6px', borderRadius: 4, fontWeight: 600, background: 'rgba(167,139,250,0.12)', color: 'var(--purple)' }}>MC</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ R2C3: KOSTEN & TOKENS ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--orange)',
            '--card-accent2': 'var(--pink)',
            '--card-glow': 'rgba(251,191,36,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--orange)', color: 'var(--orange)' }} />
              <span className="card-title">Kosten & Tokens</span>
            </div>
            <span className="card-header-right">MC</span>
          </div>
          <div className="card-body">
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-mono)', lineHeight: 1, color: 'var(--orange)', textShadow: '0 0 20px var(--orange-glow)' }}>\u20AC18.40</div>
              <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>Projekt-Kosten gesamt</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Tokens</span>
              <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--purple)' }}>45K</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>API Calls</span>
              <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>156</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>\u00D8 Cost/Call</span>
              <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>\u20AC0.12</span>
            </div>
            {/* Cost trend sparkline */}
            <div style={{ marginTop: 'auto', paddingTop: 10 }}>
              <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                Kosten-Trend (7d)
              </div>
              <svg viewBox="0 0 200 30" style={{ width: '100%', height: 30, filter: 'drop-shadow(0 0 4px var(--orange-glow))' }}>
                <path d="M0,22 L28,20 L56,18 L84,15 L112,16 L140,12 L168,14 L200,10" fill="none" stroke="var(--orange)" strokeWidth={2} strokeLinecap="round" />
                <path d="M0,22 L28,20 L56,18 L84,15 L112,16 L140,12 L168,14 L200,10 L200,30 L0,30 Z" fill="var(--orange)" opacity={0.08} />
              </svg>
            </div>
          </div>
        </div>

        {/* ═══════════════ R3C1: RECENT ACTIVITY ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--cyan)',
            '--card-accent2': 'var(--blue)',
            '--card-glow': 'rgba(45,212,191,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--cyan)', color: 'var(--cyan)' }} />
              <span className="card-title">Recent Activity</span>
            </div>
            <span className="card-header-right">Commits</span>
          </div>
          <div className="card-body">
            {commits.map(c => (
              <div
                key={c.hash}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  fontSize: 9,
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--purple)', width: 55, flexShrink: 0 }}>{c.hash}</span>
                <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{c.msg}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: 8 }}>{c.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ R3C2: DEPLOYMENT ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--green)',
            '--card-accent2': 'var(--cyan)',
            '--card-glow': 'rgba(52,211,153,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--green)', color: 'var(--green)' }} />
              <span className="card-title">Deployment</span>
            </div>
          </div>
          <div className="card-body">
            {/* Production section */}
            <div style={{ padding: 12, background: 'rgba(10,20,25,0.18)', backdropFilter: 'blur(8px)', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 10px var(--green-glow)', flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 600 }}>Production</span>
                <span style={{ fontSize: 8, color: 'var(--green)', marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>live</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>URL</span>
                <span style={{ fontSize: 9, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>mckay-os.vercel.app</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Last Deploy</span>
                <span style={{ fontSize: 9, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>heute 10:15</span>
              </div>
            </div>
            {/* Staging section */}
            <div style={{ padding: 12, background: 'rgba(10,20,25,0.18)', backdropFilter: 'blur(8px)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 600 }}>Staging</span>
                <span style={{ fontSize: 8, color: 'var(--orange)', marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>pending</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Branch</span>
                <span style={{ fontSize: 9, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--purple)' }}>dev</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Status</span>
                <span style={{ fontSize: 9, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--orange)' }}>Awaiting review</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ R3C3: AKTIONEN ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--pink)',
            '--card-accent2': 'var(--purple)',
            '--card-glow': 'rgba(244,114,182,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--pink)', color: 'var(--pink)' }} />
              <span className="card-title">Aktionen</span>
            </div>
          </div>
          <div className="card-body" style={{ gap: 8 }}>
            {actions.map(a => (
              <button
                key={a.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: 10,
                  borderRadius: 10,
                  border: a.danger ? '1px solid rgba(248,113,113,0.2)' : a.primary ? '1px solid transparent' : '1px solid var(--border)',
                  cursor: 'pointer',
                  fontSize: 9,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  ...(a.primary
                    ? {
                        background: 'linear-gradient(135deg, var(--cyan), var(--green))',
                        color: 'var(--bg-dark)',
                        boxShadow: '0 0 15px var(--cyan-glow)',
                      }
                    : {
                        background: 'rgba(10,20,25,0.18)',
                        color: a.danger ? 'var(--red)' : 'var(--text-secondary)',
                      }),
                }}
              >
                <ActionIcon type={a.icon} />
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
