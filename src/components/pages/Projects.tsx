import { useState, useMemo } from 'react'
import { ExternalLink } from 'lucide-react'
import { Header } from '../shared/Header.tsx'
import { BottomTicker } from '../shared/BottomTicker.tsx'
import { StatusLed } from '../ui/StatusLed.tsx'
import { Pipeline } from '../shared/Pipeline.tsx'
import { useMissionControl } from '../../lib/MissionControlProvider.tsx'
import { openOrFocus as openOrFocusWindow } from '../../lib/windowManager.ts'

interface Props { toggleTheme: () => void }

type Filter = 'all' | 'attention' | 'active' | 'done'

const statusLabel = (h: string | undefined) => {
  switch (h) {
    case 'active': return 'ACTIVE'
    case 'blocked': return 'BLOCKED'
    case 'paused': return 'PAUSED'
    case 'live': return 'LIVE'
    default: return 'IDLE'
  }
}

const statusColor = (h: string | undefined) => {
  switch (h) {
    case 'active': return 'var(--g)'
    case 'blocked': return 'var(--r)'
    case 'paused': return 'var(--a)'
    case 'live': return 'var(--bl)'
    default: return 'var(--tx3)'
  }
}

const feedDotColor = (type: string) => {
  switch (type) {
    case 'success': return 'var(--g)'
    case 'warning': return 'var(--a)'
    case 'error': return 'var(--r)'
    default: return 'var(--bl)'
  }
}

const priorityColor = (p: string) => {
  switch (p) {
    case 'P1': return 'var(--r)'
    case 'P2': return 'var(--a)'
    default: return 'var(--tx3)'
  }
}

const todoDotColor = (s: string) => {
  switch (s) {
    case 'done': return 'var(--g)'
    case 'in-progress': return 'var(--a)'
    default: return 'var(--tx3)'
  }
}

const docStatusColor = (s: string) => {
  switch (s) {
    case 'done': return 'var(--g)'
    case 'in-progress': return 'var(--a)'
    default: return 'var(--tx3)'
  }
}

const docStatusLabel = (s: string) => {
  switch (s) {
    case 'done': return 'Fertig'
    case 'in-progress': return 'In Arbeit'
    default: return 'Geplant'
  }
}

const scoreColor = (score: number) => {
  if (score >= 80) return 'var(--g)'
  if (score >= 60) return 'var(--bl)'
  return 'var(--tx3)'
}

/* --- SVG Components --- */

function RadialGauge({ score, size = 40 }: { score: number; size?: number }) {
  const r = (size - 4) / 2
  const circ = Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <svg width={size} height={size / 2 + 4} viewBox={`0 0 ${size} ${size / 2 + 4}`} style={{ flexShrink: 0 }}>
      <path
        d={`M 2 ${size / 2 + 2} A ${r} ${r} 0 0 1 ${size - 2} ${size / 2 + 2}`}
        fill="none" stroke="var(--tx3)" strokeWidth={3} opacity={0.15}
      />
      <path
        d={`M 2 ${size / 2 + 2} A ${r} ${r} 0 0 1 ${size - 2} ${size / 2 + 2}`}
        fill="none" stroke="var(--bl)" strokeWidth={3}
        strokeDasharray={`${circ}`} strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <text x={size / 2} y={size / 2} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="'JetBrains Mono', monospace" fill="var(--tx)">
        {score}
      </text>
    </svg>
  )
}

function Sparkline({ width = 60, height = 30 }: { width?: number; height?: number }) {
  const pts = [22, 18, 24, 16, 26, 20, 28, 14, 30]
  const maxY = 32
  const step = width / (pts.length - 1)
  const points = pts.map((v, i) => `${i * step},${maxY - v}`).join(' ')
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${maxY}`} style={{ flexShrink: 0 }}>
      <polyline points={points} fill="none" stroke="var(--bl)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
    </svg>
  )
}

function DonutChart({ progress, size = 80, color = 'var(--g)' }: { progress: number; size?: number; color?: string }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (progress / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--tx3)" strokeWidth={6} opacity={0.1} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="middle" fontSize={16} fontWeight={700} fontFamily="'JetBrains Mono', monospace" fill="var(--tx)">
        {progress}%
      </text>
    </svg>
  )
}

function ProgressRing({ value, size = 30, color = 'var(--g)' }: { value: number; size?: number; color?: string }) {
  const r = (size - 4) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--tx3)" strokeWidth={2.5} opacity={0.12} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={2.5}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  )
}

/* --- Main Component --- */

export function Projects({ toggleTheme }: Props) {
  const { projects, tickerData, projectPipelines, projectTodos, projectIdeas, projectFeed, projectAgentStatus, projectLastUpdate, projectNextMilestone, projectDocuments } = useMissionControl()
  const [selected, setSelected] = useState(0)
  const [activeTab, setActiveTab] = useState(0)
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => {
    switch (filter) {
      case 'attention': return projects.filter(p => p.health === 'blocked' || p.health === 'paused')
      case 'active': return projects.filter(p => p.health === 'active')
      case 'done': return projects.filter(p => p.health === 'live' || p.progress === 100)
      default: return projects
    }
  }, [filter])

  const p = filtered[selected] || projects[0] || undefined
  const todos = p ? (projectTodos[p.id] || []) : []
  const pIdeas = p ? (projectIdeas[p.id] || []) : []
  const feed = p ? (projectFeed[p.id] || []) : []
  const agents = p ? (projectAgentStatus[p.id] || []) : []
  const docs = p ? (projectDocuments[p.id] || []) : []
  const lastUpdate = p ? (projectLastUpdate[p.id] || '—') : '—'
  const nextMilestone = p ? (projectNextMilestone[p.id] || '—') : '—'

  const openProject = (id: string) => {
    openOrFocusWindow(`/project/${id}`)
  }

  const tabs = ['Live', 'Todos', 'Ideas', 'Reports', 'Briefing']

  const todosDone = todos.filter(t => t.status === 'done').length
  const todosTotal = todos.length
  const agentSuccessRate = 94

  return (
    <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header backLink={{ label: 'Cockpit', href: '/' }} toggleTheme={toggleTheme} />

      <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: 28, flex: 1, minHeight: 0, background: 'var(--bg)' }}>
        {/* ==================== LEFT: PROJECT CARDS ==================== */}
        <div style={{ overflowY: 'auto', padding: '4px 4px 4px 2px', background: 'var(--bg)' }}>
          {/* Filter bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            {([
              { key: 'all' as Filter, label: 'All' },
              { key: 'attention' as Filter, label: 'Needs Attention' },
              { key: 'active' as Filter, label: 'Active' },
              { key: 'done' as Filter, label: 'Done' },
            ]).map(f => (
              <button
                key={f.key}
                onClick={() => { setFilter(f.key); setSelected(0); setActiveTab(0) }}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  background: filter === f.key ? 'rgba(255,255,255,0.05)' : 'transparent',
                  border: '1px solid transparent',
                  boxShadow: 'none',
                  color: filter === f.key ? 'var(--tx)' : 'var(--tx3)',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  letterSpacing: 1,
                }}
              >
                {f.label}
              </button>
            ))}
            <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>
              {filtered.length} Projekte
            </span>
          </div>

          {/* Project cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {filtered.map((proj, i) => (
              <div
                key={proj.id}
                className="ghost-card"
                style={{ '--hc': proj.glow, padding: '18px 22px', gap: 8 } as React.CSSProperties}
                onClick={() => { setSelected(i); setActiveTab(0) }}
              >
                {/* Top-right external link icon */}
                <div
                  className="ghost-open-icon"
                  onClick={(e) => { e.stopPropagation(); openProject(proj.id) }}
                  style={{
                    position: 'absolute', top: 12, right: 12, zIndex: 2,
                    cursor: 'pointer', opacity: 0,
                    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                >
                  <ExternalLink size={14} stroke="var(--tx3)" />
                </div>

                {/* Name + Status badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>{proj.name}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                    background: `${statusColor(proj.health)}12`, color: statusColor(proj.health),
                    letterSpacing: 1,
                  }}>
                    {statusLabel(proj.health)}
                  </span>
                  {proj.health === 'blocked' && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--r)', flexShrink: 0, animation: 'lp 2s ease-in-out infinite', '--lc': 'var(--rg)' } as React.CSSProperties} />
                  )}
                </div>

                {/* Agent name */}
                {proj.agent && (
                  <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{proj.agent} Agent</div>
                )}

                {/* Progress bar + percentage */}
                <div className="ghost-foot" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--tx3)', opacity: 0.12, overflow: 'hidden' }}>
                    <div style={{ width: `${proj.progress}%`, height: '100%', borderRadius: 3, background: proj.color, transition: 'width 0.4s' }} />
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: proj.color, minWidth: 32, textAlign: 'right' }}>
                    {proj.progress}%
                  </span>
                </div>

                {/* Next milestone + last update */}
                <div className="ghost-foot" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                  <span style={{ fontSize: 11, color: 'var(--tx2)' }}>{projectNextMilestone[proj.id] || '—'}</span>
                  <span style={{ fontSize: 10, color: 'var(--tx3)', fontFamily: "'JetBrains Mono', monospace" }}>{projectLastUpdate[proj.id] || '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==================== RIGHT: PREVIEW PANEL ==================== */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', background: 'var(--bg)' }}>
          {!p ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 700, color: 'var(--tx3)', opacity: 0.3 }}>—</span>
              <span style={{ fontSize: 13, color: 'var(--tx3)' }}>Keine Projekte in dieser Ansicht</span>
            </div>
          ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
            {/* Top fixed area: name + badge + open button */}
            <div style={{ padding: '8px 4px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <StatusLed color={p.color} glow={p.glow} animate />
                <span style={{ fontSize: 22, fontWeight: 700 }}>{p.name}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 8,
                  background: `${statusColor(p.health)}12`, color: statusColor(p.health),
                }}>
                  {statusLabel(p.health)}
                </span>
              </div>
              <button
                className="cockpit-nav-btn"
                onClick={() => openProject(p.id)}
                style={{ fontSize: 11, padding: '8px 14px', gap: 6 }}
              >
                <span>Projekt öffnen</span>
                <ExternalLink size={12} />
              </button>
            </div>

            {/* Pipeline */}
            <div style={{ flexShrink: 0 }}>
              {(projectPipelines[p.id] || []).length > 0 ? (
                <Pipeline label="Roadmap" milestones={projectPipelines[p.id]} summary={p.phase} />
              ) : (
                <div style={{ margin: '12px 4px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '8px 0' }}>
                    <span className="st" style={{ fontSize: 9 }}>Pipeline</span>
                    <div className="pl-track in">
                      <div className="pl-seg" style={{ flex: Math.max(p.progress ?? 0, 5), background: p.color }} />
                      {(p.progress ?? 0) < 100 && <div className="pl-seg" style={{ flex: 100 - (p.progress ?? 0), background: 'var(--tx3)', opacity: 0.2 }} />}
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>{p.progress ?? 0}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 2, padding: '12px 4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
              {tabs.map((t, i) => (
                <button
                  key={t}
                  className={`tab ${i === activeTab ? 'active' : ''}`}
                  onClick={() => setActiveTab(i)}
                  style={i === activeTab ? { color: p.color, background: `${p.color}08` } as React.CSSProperties : undefined}
                >
                  {t}
                  {i === activeTab && <span style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: p.color, borderRadius: 2 }} />}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, padding: '18px 4px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* ===== TAB: Live ===== */}
              {activeTab === 0 && (
                <>
                  {/* Agent Overview — responsive grid */}
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: 10 }}>Agents</div>
                    {agents.length === 0 ? (
                      <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Keine Agents zugewiesen</div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                        {agents.map((a, i) => {
                          const agentColor = a.status === 'active' ? 'var(--g)' : a.status === 'waiting' ? 'var(--a)' : 'var(--tx3)'
                          const fakeSuccessRate = a.status === 'active' ? 94 : a.status === 'waiting' ? 78 : 100
                          return (
                            <div
                              key={i}
                              className="ghost-card"
                              style={{ '--hc': 'rgba(255,255,255,0.04)', padding: '14px 16px', gap: 8, borderRadius: 14 } as React.CSSProperties}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <StatusLed
                                    color={agentColor}
                                    glow={a.status === 'active' ? 'var(--gg)' : undefined}
                                    animate={a.status === 'active'}
                                    size={8}
                                  />
                                  <span style={{ fontSize: 13, fontWeight: 700 }}>{a.name}</span>
                                </div>
                                <ProgressRing value={fakeSuccessRate} size={30} color={agentColor} />
                              </div>
                              <span style={{
                                fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 5,
                                background: `${agentColor}12`, color: agentColor,
                                letterSpacing: 1, alignSelf: 'flex-start', textTransform: 'uppercase',
                              }}>
                                {a.status}
                              </span>
                              <span style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.4 }}>{a.task}</span>
                              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--tx3)' }}>seit {a.since}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Live Feed — compact ticker style */}
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: 8 }}>Live Feed</div>
                    {feed.length === 0 ? (
                      <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Keine Events</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {feed.slice(0, 10).map((f, i) => (
                          <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '5px 8px 5px 0',
                            borderLeft: `2px solid ${feedDotColor(f.type)}`,
                            paddingLeft: 10,
                            marginBottom: 2,
                          }}>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--tx3)', minWidth: 32 }}>{f.time}</span>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: feedDotColor(f.type), flexShrink: 0 }} />
                            <span style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.3 }}>{f.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ===== TAB: Todos ===== */}
              {activeTab === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {todos.length === 0 ? (
                    <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Keine Todos</div>
                  ) : (
                    todos.map((t, i) => (
                      <div
                        key={i}
                        className="ghost-card"
                        style={{ '--hc': 'rgba(255,255,255,0.04)', padding: '10px 14px', gap: 2, borderRadius: 14, flexDirection: 'row', alignItems: 'center' } as React.CSSProperties}
                      >
                        {/* Priority pill */}
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6, flexShrink: 0,
                          background: `${priorityColor(t.priority)}12`, color: priorityColor(t.priority),
                          minWidth: 28, textAlign: 'center',
                        }}>
                          {t.priority}
                        </span>

                        {/* Title + description */}
                        <div style={{ flex: 1, minWidth: 0, marginLeft: 10 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, textDecoration: t.status === 'done' ? 'line-through' : 'none', opacity: t.status === 'done' ? 0.5 : 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                          <div style={{ fontSize: 10, color: 'var(--tx3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.4 }}>{t.description}</div>
                        </div>

                        {/* Agent */}
                        <span style={{ fontSize: 9, color: 'var(--tx3)', flexShrink: 0, marginLeft: 8, whiteSpace: 'nowrap' }}>{t.agent}</span>

                        {/* Duration */}
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--tx3)', flexShrink: 0, marginLeft: 8, minWidth: 28, textAlign: 'right' }}>{t.duration}</span>

                        {/* Status dot */}
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: todoDotColor(t.status), flexShrink: 0, marginLeft: 8 }} />
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ===== TAB: Ideas ===== */}
              {activeTab === 2 && (
                <div>
                  {pIdeas.length === 0 ? (
                    <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Keine Ideas</div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                      {pIdeas.map((idea, i) => (
                        <div
                          key={i}
                          className="ghost-card"
                          style={{ '--hc': 'var(--blg)', padding: '16px 18px', gap: 10, borderRadius: 14 } as React.CSSProperties}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{idea.title}</span>
                            <RadialGauge score={idea.score} size={50} />
                          </div>
                          <span style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 22, fontWeight: 700,
                            color: scoreColor(idea.score),
                          }}>
                            {idea.score}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {idea.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ===== TAB: Reports ===== */}
              {activeTab === 3 && (
                <>
                  {/* KPI Tiles — bigger */}
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: 10 }}>KPIs</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                      {[
                        { label: 'Progress', value: `${p.progress}%`, color: p.color, context: `Phase: ${p.phase}` },
                        { label: 'Todos', value: `${todosDone}/${todosTotal}`, color: 'var(--bl)', context: `${todosTotal - todosDone} offen` },
                        { label: 'Agent Success', value: `${agentSuccessRate}%`, color: 'var(--g)', context: `${agents.length} Agents aktiv` },
                        { label: 'Last Update', value: lastUpdate, color: 'var(--p)', context: `Next: ${nextMilestone}` },
                      ].map((kpi, i) => (
                        <div
                          key={i}
                          className="ghost-card"
                          style={{ '--hc': `${kpi.color}33`, padding: '16px 18px', gap: 4, borderRadius: 14 } as React.CSSProperties}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: kpi.color }}>{kpi.value}</span>
                              <span style={{ fontSize: 9, color: 'var(--tx3)', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>{kpi.label}</span>
                              <span style={{ fontSize: 10, color: 'var(--tx2)', marginTop: 2 }}>{kpi.context}</span>
                            </div>
                            <Sparkline width={80} height={40} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents — ghost-card grid */}
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: 10 }}>Dokumente</div>
                    {docs.length === 0 ? (
                      <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Keine Dokumente</div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                        {docs.map((doc, i) => (
                          <div
                            key={i}
                            className="ghost-card"
                            style={{ '--hc': 'rgba(255,255,255,0.04)', padding: '14px 16px', gap: 8, borderRadius: 14 } as React.CSSProperties}
                          >
                            <span style={{ fontSize: 12, fontWeight: 700 }}>{doc.title}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: docStatusColor(doc.status), flexShrink: 0 }} />
                              <span style={{ fontSize: 10, color: docStatusColor(doc.status), fontWeight: 600 }}>{docStatusLabel(doc.status)}</span>
                            </div>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--tx3)' }}>{doc.scope}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ===== TAB: Briefing ===== */}
              {activeTab === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Fixed KPI bar on top */}
                  <div
                    className="ghost-card"
                    style={{ '--hc': `${p.color}22`, padding: '12px 18px', flexDirection: 'row', alignItems: 'center', gap: 16, borderRadius: 14 } as React.CSSProperties}
                  >
                    <DonutChart progress={p.progress ?? 0} size={44} color={p.color} />
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
                      {agents.map((a, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <StatusLed
                            color={a.status === 'active' ? 'var(--g)' : a.status === 'waiting' ? 'var(--a)' : 'var(--tx3)'}
                            glow={a.status === 'active' ? 'var(--gg)' : undefined}
                            animate={a.status === 'active'}
                            size={6}
                          />
                          <span style={{ fontSize: 10, fontWeight: 600 }}>{a.name}</span>
                        </div>
                      ))}
                      {agents.length === 0 && <span style={{ fontSize: 10, color: 'var(--tx3)' }}>Keine Agents</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: p.color }}>{p.progress}%</div>
                        <div style={{ fontSize: 8, color: 'var(--tx3)', letterSpacing: 1 }}>PROGRESS</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: 'var(--bl)' }}>{todosDone}/{todosTotal}</div>
                        <div style={{ fontSize: 8, color: 'var(--tx3)', letterSpacing: 1 }}>TODOS</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: 'var(--g)' }}>{agentSuccessRate}%</div>
                        <div style={{ fontSize: 8, color: 'var(--tx3)', letterSpacing: 1 }}>SUCCESS</div>
                      </div>
                    </div>
                  </div>

                  {/* 3-column layout: Past / Present / Future */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, flex: 1 }}>
                    {/* PAST */}
                    <div
                      className="ghost-card"
                      style={{ '--hc': 'rgba(255,255,255,0.04)', padding: '14px 16px', gap: 10, borderRadius: 14 } as React.CSSProperties}
                    >
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--tx3)' }}>Past</div>
                      {/* Last completed todos */}
                      {todos.filter(t => t.status === 'done').length > 0 ? (
                        todos.filter(t => t.status === 'done').slice(0, 3).map((t, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, padding: '3px 0' }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--g)', flexShrink: 0, marginTop: 4 }} />
                            <span style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.3, textDecoration: 'line-through', opacity: 0.7 }}>{t.title}</span>
                          </div>
                        ))
                      ) : (
                        <span style={{ fontSize: 10, color: 'var(--tx3)' }}>Noch nichts abgeschlossen</span>
                      )}
                      {/* Last 2 feed entries */}
                      {feed.slice(0, 2).map((f, i) => (
                        <div key={`f-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0' }}>
                          <span style={{ width: 4, height: 4, borderRadius: '50%', background: feedDotColor(f.type), flexShrink: 0 }} />
                          <span style={{ fontSize: 10, color: 'var(--tx3)', lineHeight: 1.3 }}>{f.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* PRESENT */}
                    <div
                      className="ghost-card"
                      style={{ '--hc': `${p.color}22`, padding: '14px 16px', gap: 10, borderRadius: 14 } as React.CSSProperties}
                    >
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--tx3)' }}>Present</div>
                      {/* Active agents */}
                      {agents.filter(a => a.status === 'active' || a.status === 'waiting').length > 0 ? (
                        agents.filter(a => a.status === 'active' || a.status === 'waiting').map((a, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, padding: '3px 0' }}>
                            <StatusLed
                              color={a.status === 'active' ? 'var(--g)' : 'var(--a)'}
                              glow={a.status === 'active' ? 'var(--gg)' : undefined}
                              animate={a.status === 'active'}
                              size={6}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <span style={{ fontSize: 11, fontWeight: 600 }}>{a.name}</span>
                              <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{a.task}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span style={{ fontSize: 10, color: 'var(--tx3)' }}>Keine aktiven Agents</span>
                      )}
                      {/* In-progress todos */}
                      {todos.filter(t => t.status === 'in-progress').map((t, i) => (
                        <div key={`t-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0' }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--a)', flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: 'var(--tx2)' }}>{t.title}</span>
                        </div>
                      ))}
                    </div>

                    {/* FUTURE */}
                    <div
                      className="ghost-card"
                      style={{ '--hc': 'rgba(255,255,255,0.04)', padding: '14px 16px', gap: 10, borderRadius: 14 } as React.CSSProperties}
                    >
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--tx3)' }}>Future</div>
                      {/* Next milestone */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontSize: 8, color: 'var(--tx3)', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>Milestone</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{nextMilestone}</span>
                      </div>
                      {/* Upcoming todos */}
                      {todos.filter(t => t.status === 'open').slice(0, 3).map((t, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0' }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--tx3)', flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: 'var(--tx2)' }}>{t.title}</span>
                          <span style={{ fontSize: 8, fontWeight: 700, color: priorityColor(t.priority), marginLeft: 'auto' }}>{t.priority}</span>
                        </div>
                      ))}
                      {/* Top idea if exists */}
                      {pIdeas.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0', marginTop: 2 }}>
                          <RadialGauge score={pIdeas[0].score} size={28} />
                          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx2)' }}>{pIdeas[0].title}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Bottom ticker — no back button */}
      <BottomTicker
        label="PROJECTS"
        ledColor="var(--g)"
        ledGlow="var(--gg)"
        items={tickerData.projects}
      />
    </div>
  )
}
