import { useState } from 'react'
import DetailHeader from '../DetailHeader'

/* ── Dummy data ─────────────────────────────────────────── */

const activeAgents = [
  {
    name: 'research-agent',
    badge: 'Research',
    badgeBg: 'rgba(167,139,250,0.12)',
    badgeColor: 'var(--purple)',
    color: 'var(--purple)',
    avatarBg: 'linear-gradient(135deg,rgba(167,139,250,0.3),rgba(167,139,250,0.1))',
    task: 'Marktanalyse TennisCoach',
    skills: ['web-search', 'summarize', 'analyze'],
    progress: 67,
    dashoffset: 33,
    icon: (
      <svg viewBox="0 0 24 24" width={18} height={18} stroke="#fff" strokeWidth={1.5} fill="none">
        <circle cx={11} cy={11} r={8} />
        <line x1={21} y1={21} x2={16.65} y2={16.65} />
      </svg>
    ),
  },
  {
    name: 'build-agent',
    badge: 'Dev',
    badgeBg: 'rgba(45,212,191,0.12)',
    badgeColor: 'var(--cyan)',
    color: 'var(--cyan)',
    avatarBg: 'linear-gradient(135deg,rgba(45,212,191,0.3),rgba(45,212,191,0.1))',
    task: 'API Routes Hebammenbuero',
    skills: ['code-gen', 'testing', 'deploy'],
    progress: 55,
    dashoffset: 45,
    icon: (
      <svg viewBox="0 0 24 24" width={18} height={18} stroke="#fff" strokeWidth={1.5} fill="none">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    name: 'content-agent',
    badge: 'Content',
    badgeBg: 'rgba(244,114,182,0.12)',
    badgeColor: 'var(--pink)',
    color: 'var(--pink)',
    avatarBg: 'linear-gradient(135deg,rgba(244,114,182,0.3),rgba(244,114,182,0.1))',
    task: 'Blog Post FindeMeine',
    skills: ['writing', 'seo'],
    progress: 22,
    dashoffset: 78,
    icon: (
      <svg viewBox="0 0 24 24" width={18} height={18} stroke="#fff" strokeWidth={1.5} fill="none">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
]

const historyLogs = [
  { time: '12:30', color: 'var(--green)', symbol: '\u2713', agent: 'research-agent', text: 'Wettbewerbsanalyse fertig (3.2min)' },
  { time: '12:15', color: 'var(--green)', symbol: '\u2713', agent: 'build-agent', text: 'Auth Flow deployed (8.4min)' },
  { time: '11:50', color: 'var(--red)', symbol: '\u2717', agent: 'test-agent', text: '2 Tests failed (1.1min)' },
  { time: '11:30', color: 'var(--green)', symbol: '\u2713', agent: 'content-agent', text: 'Newsletter Draft (5.6min)' },
  { time: '11:00', color: 'var(--green)', symbol: '\u2713', agent: 'design-agent', text: 'Mockup Review (2.8min)' },
  { time: '10:45', color: 'var(--green)', symbol: '\u2713', agent: 'build-agent', text: 'DB Schema Migration (4.1min)' },
  { time: '10:20', color: 'var(--red)', symbol: '\u2717', agent: 'research-agent', text: 'API Rate Limit (0.3min)' },
  { time: '10:00', color: 'var(--green)', symbol: '\u2713', agent: 'research-agent', text: 'SEO Analyse (6.2min)' },
  { time: '09:40', color: 'var(--green)', symbol: '\u2713', agent: 'build-agent', text: 'Component Library (12.5min)' },
  { time: '09:15', color: 'var(--cyan)', symbol: '\u21BB', agent: '', text: 'System gestartet \u2014 9 Agents initialisiert' },
]

const skills = [
  { name: 'web-search', color: 'var(--cyan)', cat: 'Core', catClass: 'core' as const },
  { name: 'code-gen', color: 'var(--cyan)', cat: 'Core', catClass: 'core' as const },
  { name: 'summarize', color: 'var(--cyan)', cat: 'Core', catClass: 'core' as const },
  { name: 'analyze', color: 'var(--cyan)', cat: 'Core', catClass: 'core' as const },
  { name: 'testing', color: 'var(--purple)', cat: 'Project', catClass: 'project' as const },
  { name: 'deploy', color: 'var(--purple)', cat: 'Project', catClass: 'project' as const },
  { name: 'db-migrate', color: 'var(--purple)', cat: 'Project', catClass: 'project' as const },
  { name: 'api-design', color: 'var(--purple)', cat: 'Project', catClass: 'project' as const },
  { name: 'seo', color: 'var(--orange)', cat: 'Domain', catClass: 'domain' as const },
  { name: 'writing', color: 'var(--orange)', cat: 'Domain', catClass: 'domain' as const },
  { name: 'ui-review', color: 'var(--orange)', cat: 'Domain', catClass: 'domain' as const },
  { name: 'data-viz', color: 'var(--orange)', cat: 'Domain', catClass: 'domain' as const },
]

const mcpServers = [
  { name: 'Supabase', online: true, ping: '24ms', status: 'Connected' },
  { name: 'GitHub', online: true, ping: '89ms', status: 'Connected' },
  { name: 'Filesystem', online: true, ping: '2ms', status: 'Connected' },
  { name: 'Todoist', online: true, ping: '156ms', status: 'Connected' },
  { name: 'Google Calendar', online: false, ping: '\u2014', status: 'Error' },
]

const skillToggles = [
  { name: 'web-search', color: 'var(--cyan)', defaultOn: true },
  { name: 'code-gen', color: 'var(--cyan)', defaultOn: true },
  { name: 'testing', color: 'var(--purple)', defaultOn: true },
  { name: 'deploy', color: 'var(--purple)', defaultOn: true },
  { name: 'seo', color: 'var(--orange)', defaultOn: true },
  { name: 'writing', color: 'var(--orange)', defaultOn: true },
  { name: 'image-gen', color: 'var(--text-muted)', defaultOn: false },
  { name: 'audio-transcribe', color: 'var(--text-muted)', defaultOn: false },
]

const liveLogs = [
  { time: '12:31:02', agentColor: 'var(--purple)', agent: 'research', text: 'Fetching competitor data...' },
  { time: '12:31:05', agentColor: 'var(--purple)', agent: 'research', text: 'Found 23 results' },
  { time: '12:31:08', agentColor: 'var(--cyan)', agent: 'build', text: 'Generating route /api/appointments' },
  { time: '12:31:12', agentColor: 'var(--cyan)', agent: 'build', text: '\u2713 Route compiled (0.8s)' },
  { time: '12:31:15', agentColor: 'var(--pink)', agent: 'content', text: 'Drafting paragraph 3/8...' },
  { time: '12:31:18', agentColor: 'var(--purple)', agent: 'research', text: 'Analyzing pricing models...' },
  { time: '12:31:20', agentColor: 'var(--cyan)', agent: 'build', text: '\u26A0 TypeScript warning (line 42)', timeColor: 'var(--orange)' },
  { time: '12:31:23', agentColor: 'var(--cyan)', agent: 'build', text: 'Auto-fixed: added type annotation' },
  { time: '12:31:25', agentColor: 'var(--pink)', agent: 'content', text: 'SEO optimization pass...' },
  { time: '12:31:28', agentColor: 'var(--purple)', agent: 'research', text: 'Summarizing findings...' },
]

const agentOptions = ['research-agent', 'build-agent', 'content-agent', 'design-agent', 'test-agent', 'deploy-agent', 'data-agent', 'monitor-agent', 'support-agent']
const projectOptions = ['Mission Control', 'Hebammenbuero', 'TennisCoach', 'FindeMeine', 'Stillprobleme']

/* ── Shared styles ──────────────────────────────────────── */

const cubic = 'cubic-bezier(0.4,0,0.2,1)'

const cardCustom = (accent: string, accent2: string, glow: string): React.CSSProperties => ({
  '--card-accent': accent,
  '--card-accent2': accent2,
  '--card-glow': glow,
} as React.CSSProperties)

/* ── Component ──────────────────────────────────────────── */

export default function AgentsDetail() {
  const [toggleState, setToggleState] = useState<Record<string, boolean>>(
    Object.fromEntries(skillToggles.map(s => [s.name, s.defaultOn]))
  )

  const handleToggle = (name: string) => {
    setToggleState(prev => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div className="dashboard" style={{ gridTemplateRows: '44px 1fr' }}>
      <DetailHeader
        title="AGENTS"
        color="purple"
        pills={[
          { value: '9', label: 'Agents', color: 'purple' },
          { value: '3', label: 'Running', color: 'green' },
          { value: '18', label: 'Skills', color: 'cyan' },
        ]}
      />

      {/* 3x3 Grid */}
      <div style={{
        gridColumn: '1/-1',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: 18,
        overflow: 'hidden',
      }}>

        {/* ═══ R1C1: AGENT UBERSICHT ═══ */}
        <div className="card" style={cardCustom('var(--purple)', 'var(--pink)', 'rgba(167,139,250,0.05)')}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--purple)', color: 'var(--purple)' }} />
              <span className="card-title">Agent Ubersicht</span>
            </div>
          </div>
          <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflowY: 'auto' }}>
            {/* Pie + Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {/* Donut Chart */}
              <div style={{ width: 90, height: 90, position: 'relative' }}>
                <svg viewBox="0 0 90 90" width={90} height={90} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={45} cy={45} r={36} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={7} />
                  {/* Running: 3/9 = 33% */}
                  <circle cx={45} cy={45} r={36} fill="none" stroke="var(--green)" strokeWidth={7} strokeLinecap="round" strokeDasharray="75.4 150.8" style={{ filter: 'drop-shadow(0 0 6px var(--green-glow))' }} />
                  {/* Idle: 5/9 = 55.6% */}
                  <circle cx={45} cy={45} r={36} fill="none" stroke="var(--orange)" strokeWidth={7} strokeDasharray="125.7 100.5" strokeDashoffset={-75.4} opacity={0.7} />
                  {/* Paused: 1/9 = 11.1% */}
                  <circle cx={45} cy={45} r={36} fill="none" stroke="var(--text-muted)" strokeWidth={7} strokeDasharray="25.1 201.1" strokeDashoffset={-201.1} opacity={0.5} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--purple)' }}>9</span>
                  <span style={{ fontSize: 6, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</span>
                </div>
              </div>
              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green-glow)' }} />
                  <span>Running</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, marginLeft: 'auto', color: 'var(--green)' }}>3</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)' }} />
                  <span>Idle</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, marginLeft: 'auto', color: 'var(--orange)' }}>5</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-muted)' }} />
                  <span>Paused</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, marginLeft: 'auto' }}>1</span>
                </div>
              </div>
            </div>
            {/* Bottom stats */}
            <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Erfolgsrate</span>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>89%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{'\u00D8'} Laufzeit</span>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>4.2min</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Fehler heute</span>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--red)' }}>2</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ R1C2: AKTIVE AGENTS ═══ */}
        <div className="card" style={cardCustom('var(--green)', 'var(--cyan)', 'rgba(52,211,153,0.05)')}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--green)', color: 'var(--green)' }} />
              <span className="card-title">Aktive Agents</span>
            </div>
            <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>3 running</span>
          </div>
          <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflowY: 'auto' }}>
            {activeAgents.map(agent => (
              <div
                key={agent.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr auto',
                  gap: 12,
                  alignItems: 'center',
                  padding: 12,
                  background: 'rgba(10,20,25,0.18)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  marginBottom: 8,
                  transition: `all 0.3s ${cubic}`,
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.background = 'rgba(10,20,25,0.28)'
                  el.style.transform = 'translateX(4px)'
                  el.style.borderColor = agent.color
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.background = 'rgba(10,20,25,0.18)'
                  el.style.transform = 'translateX(0)'
                  el.style.borderColor = 'var(--border)'
                }}
              >
                {/* Avatar */}
                <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: agent.avatarBg }}>
                  {agent.icon}
                  <span style={{
                    position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, borderRadius: '50%',
                    border: '2px solid var(--bg-dark)', background: 'var(--green)',
                    boxShadow: '0 0 8px var(--green-glow)', animation: 'statusPulse 2s ease-in-out infinite',
                  }} />
                </div>
                {/* Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {agent.name}
                    <span style={{
                      fontSize: 7, padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase', fontWeight: 600,
                      background: agent.badgeBg, color: agent.badgeColor,
                    }}>{agent.badge}</span>
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text-secondary)' }}>{agent.task}</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {agent.skills.map(s => (
                      <span key={s} style={{ fontSize: 7, padding: '2px 5px', background: 'rgba(255,255,255,0.05)', borderRadius: 4, color: 'var(--text-muted)' }}>{s}</span>
                    ))}
                  </div>
                </div>
                {/* Progress Ring */}
                <div style={{ width: 40, height: 40, position: 'relative' }}>
                  <svg viewBox="0 0 40 40" width={40} height={40} style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={20} cy={20} r={16} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={3} />
                    <circle cx={20} cy={20} r={16} fill="none" stroke={agent.color} strokeWidth={3} strokeLinecap="round" strokeDasharray={100.5} strokeDashoffset={agent.dashoffset} style={{ filter: `drop-shadow(0 0 4px ${agent.color})` }} />
                  </svg>
                  <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-mono)', color: agent.color }}>{agent.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ R1C3: AGENT HISTORY ═══ */}
        <div className="card" style={cardCustom('var(--orange)', 'var(--yellow)', 'rgba(251,191,36,0.05)')}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--orange)', color: 'var(--orange)' }} />
              <span className="card-title">Agent History</span>
            </div>
            <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Letzte 10</span>
          </div>
          <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflowY: 'auto' }}>
            {historyLogs.map((log, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 0',
                  borderBottom: i < historyLogs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  fontSize: 9,
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', width: 42, flexShrink: 0 }}>{log.time}</span>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: log.color, marginTop: 4, flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {log.symbol} {log.agent && <strong>{log.agent}</strong>}{log.agent && ' \u2014 '}{log.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ R2C1: SKILLS ═══ */}
        <div className="card" style={cardCustom('var(--cyan)', 'var(--green)', 'rgba(45,212,191,0.05)')}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--cyan)', color: 'var(--cyan)' }} />
              <span className="card-title">Skills</span>
            </div>
            <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>18 aktiv</span>
          </div>
          <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {skills.map(skill => (
                <div
                  key={skill.name}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                    background: 'rgba(10,20,25,0.18)', backdropFilter: 'blur(8px)',
                    borderRadius: 8, border: '1px solid var(--border)',
                    transition: `all 0.3s ${cubic}`, cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(10,20,25,0.28)'
                    e.currentTarget.style.transform = 'translateX(3px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(10,20,25,0.18)'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: skill.color }} />
                  <span style={{ fontSize: 9, flex: 1 }}>{skill.name}</span>
                  <span style={{
                    fontSize: 6, padding: '2px 5px', borderRadius: 3, textTransform: 'uppercase', fontWeight: 600,
                    background: skill.catClass === 'core' ? 'rgba(45,212,191,0.12)' : skill.catClass === 'project' ? 'rgba(167,139,250,0.12)' : 'rgba(251,191,36,0.12)',
                    color: skill.catClass === 'core' ? 'var(--cyan)' : skill.catClass === 'project' ? 'var(--purple)' : 'var(--orange)',
                  }}>{skill.cat}</span>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 8, textAlign: 'center', fontSize: 8, color: 'var(--text-muted)',
              padding: 6, border: '1px dashed var(--border)', borderRadius: 8, cursor: 'pointer',
            }}>+6 weitere Skills anzeigen</div>
          </div>
        </div>

        {/* ═══ R2C2: MCP SERVER ═══ */}
        <div className="card" style={cardCustom('var(--blue)', 'var(--purple)', 'rgba(96,165,250,0.05)')}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--blue)', color: 'var(--blue)' }} />
              <span className="card-title">MCP Server</span>
            </div>
            <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>5 konfiguriert</span>
          </div>
          <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflowY: 'auto' }}>
            {mcpServers.map(server => (
              <div
                key={server.name}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  background: 'rgba(10,20,25,0.18)', backdropFilter: 'blur(8px)',
                  borderRadius: 10, border: '1px solid var(--border)', marginBottom: 6,
                  transition: `all 0.3s ${cubic}`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(10,20,25,0.28)'
                  e.currentTarget.style.transform = 'translateX(3px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(10,20,25,0.18)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: server.online ? 'var(--green)' : 'var(--text-muted)',
                  boxShadow: server.online ? '0 0 10px var(--green-glow)' : 'none',
                }} />
                <span style={{ flex: 1, fontSize: 10, fontWeight: 500 }}>{server.name}</span>
                <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{server.ping}</span>
                <span style={{
                  fontSize: 7, padding: '2px 6px', borderRadius: 4, fontWeight: 600, textTransform: 'uppercase',
                  background: server.online ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)',
                  color: server.online ? 'var(--green)' : 'var(--red)',
                }}>{server.status}</span>
              </div>
            ))}
            <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Aktive Tools</span>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>23</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>API Calls heute</span>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>342</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ R2C3: AGENT PERFORMANCE ═══ */}
        <div className="card" style={cardCustom('var(--green)', 'var(--cyan)', 'rgba(52,211,153,0.05)')}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--green)', color: 'var(--green)' }} />
              <span className="card-title">Agent Performance</span>
            </div>
          </div>
          <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflowY: 'auto' }}>
            {/* 3 Gauges */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
              {/* Erfolg */}
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: 55, height: 55, position: 'relative', margin: '0 auto 6px' }}>
                  <svg viewBox="0 0 55 55" width={55} height={55} style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={27.5} cy={27.5} r={22} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={4} />
                    <circle cx={27.5} cy={27.5} r={22} fill="none" stroke="var(--green)" strokeWidth={4} strokeLinecap="round" strokeDasharray={138.2} strokeDashoffset={15.2} style={{ filter: 'drop-shadow(0 0 6px var(--green-glow))' }} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>89%</span>
                  </div>
                </div>
                <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Erfolg</div>
              </div>
              {/* Dauer */}
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: 55, height: 55, position: 'relative', margin: '0 auto 6px' }}>
                  <svg viewBox="0 0 55 55" width={55} height={55} style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={27.5} cy={27.5} r={22} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={4} />
                    <circle cx={27.5} cy={27.5} r={22} fill="none" stroke="var(--cyan)" strokeWidth={4} strokeLinecap="round" strokeDasharray={138.2} strokeDashoffset={58.2} style={{ filter: 'drop-shadow(0 0 6px var(--cyan-glow))' }} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>4.2m</span>
                  </div>
                </div>
                <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{'\u00D8'} Dauer</div>
              </div>
              {/* Fehler */}
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: 55, height: 55, position: 'relative', margin: '0 auto 6px' }}>
                  <svg viewBox="0 0 55 55" width={55} height={55} style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={27.5} cy={27.5} r={22} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={4} />
                    <circle cx={27.5} cy={27.5} r={22} fill="none" stroke="var(--orange)" strokeWidth={4} strokeLinecap="round" strokeDasharray={138.2} strokeDashoffset={124.4} style={{ filter: 'drop-shadow(0 0 6px var(--orange-glow))' }} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--orange)' }}>2</span>
                  </div>
                </div>
                <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fehler</div>
              </div>
            </div>
            {/* Sparkline chart */}
            <div style={{ flex: 1, position: 'relative', marginTop: 8 }}>
              <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Tasks / Stunde (heute)</div>
              <svg viewBox="0 0 200 50" style={{ width: '100%', height: 50 }}>
                <defs>
                  <linearGradient id="perfAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--green)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path d="M0,45 L25,40 L50,35 L75,25 L100,20 L125,15 L150,22 L175,18 L200,12" fill="none" stroke="var(--green)" strokeWidth={2} strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px var(--green-glow))' }} />
                <path d="M0,45 L25,40 L50,35 L75,25 L100,20 L125,15 L150,22 L175,18 L200,12 L200,50 L0,50 Z" fill="url(#perfAreaGrad)" opacity={0.12} />
              </svg>
            </div>
            <div style={{ paddingTop: 8, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 8, color: 'var(--text-muted)' }}>Tasks heute: 34</span>
              <span style={{ fontSize: 8, color: 'var(--green)', fontWeight: 600 }}>{'\u2191'} 23% vs gestern</span>
            </div>
          </div>
        </div>

        {/* ═══ R3C1: SKILL AKTIVIERUNG ═══ */}
        <div className="card" style={cardCustom('var(--pink)', 'var(--purple)', 'rgba(244,114,182,0.05)')}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--pink)', color: 'var(--pink)' }} />
              <span className="card-title">Skill Aktivierung</span>
            </div>
          </div>
          <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflowY: 'auto' }}>
            {skillToggles.map((skill, i) => (
              <div
                key={skill.name}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                  borderBottom: i < skillToggles.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: skill.color }} />
                <span style={{ flex: 1, fontSize: 10 }}>{skill.name}</span>
                <div
                  onClick={() => handleToggle(skill.name)}
                  style={{
                    width: 32, height: 18, borderRadius: 9, position: 'relative', cursor: 'pointer',
                    transition: `all 0.3s ${cubic}`,
                    background: toggleState[skill.name] ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.08)',
                  }}
                >
                  <span style={{
                    position: 'absolute', top: 2, width: 14, height: 14, borderRadius: '50%',
                    transition: `all 0.3s ${cubic}`,
                    left: toggleState[skill.name] ? 16 : 2,
                    background: toggleState[skill.name] ? 'var(--green)' : '#fff',
                    boxShadow: toggleState[skill.name] ? '0 0 8px var(--green-glow)' : 'none',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ R3C2: AGENT STARTEN ═══ */}
        <div className="card" style={cardCustom('var(--cyan)', 'var(--green)', 'rgba(45,212,191,0.05)')}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--cyan)', color: 'var(--cyan)' }} />
              <span className="card-title">Agent Starten</span>
            </div>
          </div>
          <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Agent auswahlen</div>
              <select style={{
                background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border)', borderRadius: 10,
                padding: '10px 12px', color: 'var(--text-primary)', fontSize: 10, fontFamily: 'inherit',
                appearance: 'none' as const, cursor: 'pointer', transition: `all 0.3s ${cubic}`,
              }}>
                {agentOptions.map(a => <option key={a}>{a}</option>)}
              </select>
              <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Projekt</div>
              <select style={{
                background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border)', borderRadius: 10,
                padding: '10px 12px', color: 'var(--text-primary)', fontSize: 10, fontFamily: 'inherit',
                appearance: 'none' as const, cursor: 'pointer', transition: `all 0.3s ${cubic}`,
              }}>
                {projectOptions.map(p => <option key={p}>{p}</option>)}
              </select>
              <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Task / Prompt</div>
              <textarea
                rows={3}
                placeholder="Beschreibe die Aufgabe..."
                style={{
                  background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border)', borderRadius: 10,
                  padding: '10px 12px', color: 'var(--text-primary)', fontSize: 10, fontFamily: 'inherit',
                  resize: 'none', transition: `all 0.3s ${cubic}`,
                }}
              />
              <button
                style={{
                  padding: 10, border: 'none', borderRadius: 10, fontSize: 10, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit', transition: `all 0.3s ${cubic}`,
                  background: 'linear-gradient(135deg,var(--cyan),var(--green))',
                  color: 'var(--bg-dark)', boxShadow: '0 0 20px var(--cyan-glow)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {'\u25B6'} Agent starten
              </button>
            </div>
          </div>
        </div>

        {/* ═══ R3C3: LIVE LOGS ═══ */}
        <div className="card" style={cardCustom('var(--red)', 'var(--orange)', 'rgba(248,113,113,0.05)')}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--red)', color: 'var(--red)' }} />
              <span className="card-title">Live Logs</span>
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              <span style={{
                width: 6, height: 6, background: 'var(--red)', borderRadius: '50%',
                animation: 'dotPulse 1.5s ease-in-out infinite', boxShadow: '0 0 8px var(--red-glow)',
              }} />
              Live
            </span>
          </div>
          <div style={{
            flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column',
            position: 'relative', zIndex: 1, overflowY: 'auto',
            fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', lineHeight: 1.8,
          }}>
            {liveLogs.map((log, i) => (
              <div key={i}>
                <span style={{ color: log.timeColor || 'var(--green)' }}>[{log.time}]</span>{' '}
                <span style={{ color: log.agentColor }}>{log.agent}</span>{' '}{'\u2192'}{' '}
                {log.text}
              </div>
            ))}
            <div style={{ color: 'var(--cyan)', animation: 'timerPulse 1s ease-in-out infinite' }}>{'\u2588'}</div>
          </div>
        </div>

      </div>
    </div>
  )
}
