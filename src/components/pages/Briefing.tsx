import { Header } from '../shared/Header.tsx'
import { BottomTicker } from '../shared/BottomTicker.tsx'
import { StatusLed } from '../ui/StatusLed.tsx'
import { useMissionControl } from '../../lib/MissionControlProvider.tsx'
import { useZone, getWorkdayHistory } from '../ZoneProvider.tsx'

interface Props { toggleTheme: () => void }

const healthColor = (h: string | undefined) => {
  switch (h) {
    case 'active': return 'var(--g)'
    case 'blocked': return 'var(--r)'
    case 'paused': return 'var(--a)'
    case 'live': return 'var(--bl)'
    default: return 'var(--tx3)'
  }
}

const healthLabel = (h: string | undefined) => {
  switch (h) {
    case 'active': return 'ACTIVE'
    case 'blocked': return 'BLOCKED'
    case 'paused': return 'PAUSED'
    case 'live': return 'LIVE'
    default: return 'IDLE'
  }
}

function formatWorkTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  return `${h}h ${m}min`
}

export function Briefing({ toggleTheme }: Props) {
  const {
    projects, ideas, agents, tickerData,
    projectTodos, projectNextMilestone,
  } = useMissionControl()
  const { elapsed } = useZone()

  // Yesterday's work time from history
  const yesterdayWork = (() => {
    const history = getWorkdayHistory()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yKey = yesterday.toISOString().slice(0, 10)
    const entry = history.find(e => e.date === yKey)
    return entry ? entry.totalSeconds : null
  })()

  // Aggregate stats
  const activeProjects = projects.filter(p => p.health === 'active' || p.health === 'live')
  const totalTodos = Object.values(projectTodos).reduce((sum, arr) => sum + arr.length, 0)
  const openTodos = Object.values(projectTodos).reduce((sum, arr) => sum + arr.filter(t => t.status !== 'done').length, 0)
  const activeAgents = agents.filter(a => a.status === 'active')
  const idleAgents = agents.filter(a => a.status === 'idle' || a.status === 'standby')

  return (
    <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        backLink={{ label: 'Cockpit', href: '/' }}
        title="Briefing"
        toggleTheme={toggleTheme}
      />

      {/* 3-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, flex: 1, minHeight: 0 }}>

        {/* ==================== COLUMN 1: Projekte ==================== */}
        <div className="cf" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '22px 24px', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span className="st" style={{ padding: 0 }}>Projekte</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>
              {projects.length} Projekte
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {projects.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Keine Projekte</div>
            ) : (
              projects.map((p) => {
                const hc = healthColor(p.health)
                const nextStep = projectNextMilestone[p.id] || '—'
                return (
                  <div
                    key={p.id}
                    className="ghost-card"
                    style={{ '--hc': p.glow, padding: '14px 18px', gap: 8 } as React.CSSProperties}
                  >
                    {/* Name row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <StatusLed color={hc} glow={p.glow} animate={p.health === 'active'} size={8} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', flex: 1 }}>{p.name}</span>
                      <span style={{
                        fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 5,
                        background: `${hc}12`, color: hc, letterSpacing: 1,
                      }}>
                        {healthLabel(p.health)}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--tx3)', opacity: 0.12, overflow: 'hidden' }}>
                        <div style={{ width: `${p.progress}%`, height: '100%', borderRadius: 3, background: p.color, transition: 'width 0.4s' }} />
                      </div>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: p.color, minWidth: 28, textAlign: 'right' }}>
                        {p.progress}%
                      </span>
                    </div>

                    {/* Next step */}
                    <div style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.4 }}>
                      Next: {nextStep}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* ==================== COLUMN 2: Heute ==================== */}
        <div className="cf" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '22px 24px', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span className="st" style={{ padding: 0 }}>Heute</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>
              {new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
            </span>
          </div>

          {/* Work time */}
          <div
            className="ghost-card"
            style={{
              '--hc': 'var(--gg)',
              padding: '14px 18px',
              gap: 6,
              borderRadius: 14,
              flexShrink: 0,
            } as React.CSSProperties}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--tx3)' }}>
                Arbeitszeit heute
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--g)',
                textShadow: '0 0 10px rgba(0,255,136,0.3)',
              }}>
                {formatWorkTime(elapsed)}
              </span>
            </div>
            {yesterdayWork !== null && (
              <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
                Gestern: {formatWorkTime(yesterdayWork)}
              </div>
            )}
          </div>

          {/* Summary stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, flexShrink: 0 }}>
            <div className="ghost-card" style={{ '--hc': 'var(--blg)', padding: '14px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, borderRadius: 14 } as React.CSSProperties}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: 'var(--bl)' }}>{openTodos}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>Todos offen</div>
            </div>
            <div className="ghost-card" style={{ '--hc': 'var(--gg)', padding: '14px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, borderRadius: 14 } as React.CSSProperties}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: 'var(--g)' }}>{activeProjects.length}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>Projekte aktiv</div>
            </div>
            <div className="ghost-card" style={{ '--hc': 'var(--pg)', padding: '14px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, borderRadius: 14 } as React.CSSProperties}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: 'var(--p)' }}>{ideas.length}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>Ideas total</div>
            </div>
            <div className="ghost-card" style={{ '--hc': 'var(--ag)', padding: '14px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, borderRadius: 14 } as React.CSSProperties}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: 'var(--a)' }}>{totalTodos}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>Todos gesamt</div>
            </div>
          </div>

          {/* Open Todos list */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--tx3)' }}>Offene Todos</div>
            {(() => {
              const allOpen = Object.entries(projectTodos).flatMap(([projId, todos]) => {
                const proj = projects.find(p => p.id === projId)
                return todos
                  .filter(t => t.status !== 'done')
                  .map(t => ({ ...t, projName: proj?.name || projId }))
              })
              if (allOpen.length === 0) {
                return <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Keine offenen Todos</div>
              }
              return allOpen.slice(0, 8).map((t, i) => {
                const pc = t.priority === 'P1' ? 'var(--r)' : t.priority === 'P2' ? 'var(--a)' : 'var(--tx3)'
                return (
                  <div
                    key={i}
                    className="ghost-card"
                    style={{ '--hc': 'rgba(255,255,255,0.04)', padding: '8px 12px', gap: 0, borderRadius: 12, flexDirection: 'row', alignItems: 'center' } as React.CSSProperties}
                  >
                    <span style={{
                      fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 4, flexShrink: 0,
                      background: `${pc}12`, color: pc, minWidth: 20, textAlign: 'center',
                    }}>
                      {t.priority}
                    </span>
                    <div style={{ flex: 1, minWidth: 0, marginLeft: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                      <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{t.projName}</div>
                    </div>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.status === 'in-progress' ? 'var(--a)' : 'var(--tx3)', flexShrink: 0, marginLeft: 8 }} />
                  </div>
                )
              })
            })()}
          </div>
        </div>

        {/* ==================== COLUMN 3: System ==================== */}
        <div className="cf" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '22px 24px', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span className="st" style={{ padding: 0 }}>System</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>
              {agents.length} Agents
            </span>
          </div>

          {/* Agent status counters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, flexShrink: 0 }}>
            <div className="ghost-card" style={{ '--hc': 'var(--gg)', padding: '14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, borderRadius: 14 } as React.CSSProperties}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color: 'var(--g)' }}>{activeAgents.length}</div>
              <div style={{ fontSize: 8, color: 'var(--tx3)', letterSpacing: 1 }}>ACTIVE</div>
            </div>
            <div className="ghost-card" style={{ '--hc': 'var(--ag)', padding: '14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, borderRadius: 14 } as React.CSSProperties}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color: 'var(--a)' }}>{idleAgents.length}</div>
              <div style={{ fontSize: 8, color: 'var(--tx3)', letterSpacing: 1 }}>STANDBY</div>
            </div>
            <div className="ghost-card" style={{ '--hc': 'var(--blg)', padding: '14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, borderRadius: 14 } as React.CSSProperties}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color: 'var(--bl)' }}>{agents.length}</div>
              <div style={{ fontSize: 8, color: 'var(--tx3)', letterSpacing: 1 }}>TOTAL</div>
            </div>
          </div>

          {/* Agent list */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--tx3)' }}>Agent Status</div>
            {agents.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Keine Agents</div>
            ) : (
              agents.map((a, i) => {
                const agentColor = a.status === 'active' ? 'var(--g)' : a.status === 'idle' ? 'var(--a)' : 'var(--tx3)'
                const agentGlow = a.status === 'active' ? 'var(--gg)' : undefined
                const statusText = a.status === 'active' ? 'Aktiv' : a.status === 'idle' ? 'Idle' : 'Standby'
                return (
                  <div
                    key={i}
                    className="ghost-card"
                    style={{ '--hc': 'rgba(255,255,255,0.04)', padding: '10px 14px', gap: 4, borderRadius: 12 } as React.CSSProperties}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <StatusLed color={agentColor} glow={agentGlow} animate={a.status === 'active'} size={7} />
                      <span style={{ fontSize: 12, fontWeight: 700, flex: 1 }}>{a.emoji} {a.name}</span>
                      <span style={{
                        fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 5,
                        background: `${agentColor}12`, color: agentColor, letterSpacing: 1,
                      }}>
                        {statusText}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--tx3)', marginLeft: 15 }}>{a.purpose}</div>
                  </div>
                )
              })
            )}

            {/* System Health */}
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--tx3)', marginTop: 8 }}>System Health</div>
            <div className="ghost-card" style={{ '--hc': 'var(--gg)', padding: '14px 18px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 } as React.CSSProperties}>
              <StatusLed color="var(--g)" glow="var(--gg)" animate size={10} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--g)' }}>Operational</span>
                <span style={{ fontSize: 10, color: 'var(--tx3)' }}>Alle Systeme laufen</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomTicker
        label="BRIEFING"
        ledColor="var(--t)"
        ledGlow="var(--tg)"
        items={tickerData.briefing || tickerData.system || []}
      />
    </div>
  )
}
