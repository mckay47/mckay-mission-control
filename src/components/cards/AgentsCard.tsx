import { AGENTS as AGENT_DATA } from '../../lib/data'

/* ── Icon assignment by agent name keyword ── */
type IconType = 'search' | 'code' | 'pen' | 'smile'
function pickIcon(name: string): IconType {
  const n = name.toLowerCase()
  if (n.includes('research') || n.includes('strategy')) return 'search'
  if (n.includes('build') || n.includes('ops') || n.includes('launch')) return 'code'
  if (n.includes('sales') || n.includes('content') || n.includes('mockup')) return 'pen'
  return 'smile'
}

/* ── Extract RGB from bg field like "rgba(0,200,232,0.15)" ── */
function extractRgb(bg: string): string {
  const m = bg.match(/rgba?\((\d+),(\d+),(\d+)/)
  return m ? `${m[1]},${m[2]},${m[3]}` : '255,255,255'
}

interface AgentData {
  name: string
  type: string
  color: string
  colorRgb: string
  status: 'active' | 'idle'
  icon: IconType
  kpis: { value: string; label: string }[]
  task: string
  pct: number
}

const AGENTS: AgentData[] = AGENT_DATA.map(a => ({
  name: a.n,
  type: a.typ,
  color: a.col,
  colorRgb: extractRgb(a.bg),
  status: (a.st === 'active' ? 'active' : 'idle') as 'active' | 'idle',
  icon: pickIcon(a.n),
  kpis: [
    { value: a.tkn, label: 'Tokens' },
    { value: a.suc > 0 ? `${a.suc}%` : a.mdl, label: a.suc > 0 ? 'Success' : 'Model' },
  ],
  task: a.act || (a.st === 'active' ? 'Processing...' : 'Waiting...'),
  pct: a.st === 'active' ? (a.pr > 0 ? a.pr : 50) : 0,
}))

function AgentIcon({ icon, color }: { icon: AgentData['icon']; color: string }) {
  const props = { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (icon) {
    case 'search':
      return <svg {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
    case 'code':
      return <svg {...props}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
    case 'pen':
      return <svg {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
    case 'smile':
      return <svg {...props}><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
  }
}

export default function AgentsCard() {
  return (
    <div className="card agents-card">
      <div className="card-header">
        <div className="card-header-left">
          <span className="card-icon purple" />
          <span className="card-title">AGENTS</span>
        </div>
      </div>

      {/* Stats header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 18,
        padding: '10px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--purple)' }}>{AGENTS.length}</span>
          <span style={{ fontSize: 8, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>{AGENTS.filter(a => a.status === 'active').length}</span>
          <span style={{ fontSize: 8, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--orange)' }}>{AGENTS.filter(a => a.status === 'idle').length}</span>
          <span style={{ fontSize: 8, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Idle</span>
        </div>
      </div>

      {/* 2x2 Agent Cards Grid */}
      <div style={{
        flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
        padding: '14px 18px', overflow: 'auto', position: 'relative', zIndex: 1,
      }}>
        {AGENTS.map(agent => (
          <div key={agent.name} className="agent-card" style={{
            borderRadius: 12, padding: '12px 14px',
            border: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', gap: 8,
            opacity: agent.status === 'idle' ? 0.6 : 1,
            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: `linear-gradient(135deg, rgba(${agent.colorRgb},0.2), rgba(${agent.colorRgb},0.08))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <AgentIcon icon={agent.icon} color={agent.color} />
                <span style={{
                  position: 'absolute', top: -2, right: -2,
                  width: 7, height: 7, borderRadius: '50%',
                  background: agent.status === 'active' ? 'var(--green)' : 'var(--orange)',
                  boxShadow: agent.status === 'active' ? '0 0 8px var(--green-glow)' : '0 0 8px var(--orange-glow)',
                  border: '1.5px solid var(--bg-dark)',
                }} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-primary)' }}>{agent.name}</div>
                <div style={{ fontSize: 7, color: 'var(--text-muted)' }}>{agent.type}</div>
              </div>
            </div>

            {/* KPIs */}
            <div style={{ display: 'flex', gap: 12 }}>
              {agent.kpis.map(kpi => (
                <div key={kpi.label} style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: agent.color }}>{kpi.value}</span>
                  <span style={{ fontSize: 7, color: 'var(--text-muted)' }}>{kpi.label}</span>
                </div>
              ))}
            </div>

            {/* Current Task */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: agent.status === 'active' ? agent.color : 'var(--text-muted)',
                animation: agent.status === 'active' ? 'indicatorPulse 1.5s ease-in-out infinite' : 'none',
              }} />
              <span style={{ fontSize: 8, color: 'var(--text-secondary)' }}>{agent.task}</span>
            </div>

            {/* Progress Bar */}
            <div style={{
              height: 3, borderRadius: 2,
              background: 'rgba(255,255,255,0.04)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: `${agent.pct}%`,
                borderRadius: 2,
                background: agent.color,
                boxShadow: agent.pct > 0 ? `0 0 12px ${agent.color}` : 'none',
                transition: 'width 1s ease-out',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
