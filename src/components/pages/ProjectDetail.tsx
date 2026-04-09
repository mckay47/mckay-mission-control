import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Activity, Rocket, FlaskConical, ListTodo, Lightbulb, Power } from 'lucide-react'
import { Header } from '../shared/Header.tsx'
import { SplitLayout } from '../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText } from '../shared/PreviewPanel.tsx'
import { BottomTicker } from '../shared/BottomTicker.tsx'
import { Terminal } from '../shared/Terminal.tsx'
import { StatusLed } from '../ui/StatusLed.tsx'
import { Pipeline } from '../shared/Pipeline.tsx'
import { useMissionControl } from '../../lib/MissionControlProvider.tsx'

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

const scoreColor = (score: number) => {
  if (score >= 80) return 'var(--g)'
  if (score >= 60) return 'var(--bl)'
  return 'var(--tx3)'
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

const quickActions = [
  { label: 'Status', icon: Activity, color: 'var(--g)', border: 'var(--g)', prompt: 'Lies MEMORY.md und TODOS.md und gib mir einen kurzen Status-Überblick: Was wurde zuletzt gemacht, was steht als nächstes an, gibt es Blocker?' },
  { label: 'Deploy', icon: Rocket, color: 'var(--bl)', border: 'var(--bl)', prompt: 'Deploye dieses Projekt auf Vercel. Prüfe vorher ob der Build sauber durchläuft.' },
  { label: 'Test', icon: FlaskConical, color: 'var(--a)', border: 'var(--a)', prompt: 'Führe einen TypeScript Check (tsc --noEmit) und einen Build (vite build) durch. Zeige mir Fehler falls vorhanden.' },
  { label: 'Todos', icon: ListTodo, color: 'var(--p)', border: 'var(--p)', prompt: 'Lies TODOS.md und zeige alle offenen Todos mit Priorität und Status.' },
  { label: 'Ideas', icon: Lightbulb, color: 'var(--o)', border: 'var(--o)', prompt: 'Was wären sinnvolle nächste Features oder Verbesserungen für dieses Projekt? Basiere deine Vorschläge auf MEMORY.md und dem aktuellen Code.' },
  { label: 'Feierabend', icon: Power, color: 'var(--r)', border: 'var(--r)', prompt: 'Session beenden: 1) Lies MEMORY.md und aktualisiere den "Letzte Session" Block mit was heute gemacht wurde und "Next Steps" mit was als nächstes ansteht. 2) Prüfe TODOS.md und hake erledigte Tasks ab. Antworte kurz mit [SESSION_END] ✓ wenn fertig.' },
]

export function ProjectDetail({ toggleTheme }: Props) {
  const {
    projects, tickerData,
    projectPipelines, projectTodos, projectIdeas,
    projectFeed, projectAgentStatus,
    projectContext, projectDocuments,
  } = useMissionControl()
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const [tab, setTab] = useState(0)
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null)
  const [terminalBusy, setTerminalBusy] = useState(false)

  const project = projects.find(p => p.id === id)

  if (!project) {
    return (
      <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--tx3)' }}>Projekt nicht gefunden</div>
        <button className="open-btn" style={{ marginTop: 20 }} onClick={() => nav('/projects')}>Zurueck zu Projekte</button>
      </div>
    )
  }

  const color = project.color
  const glow = project.glow
  const hColor = healthColor(project.health)
  const hLabel = healthLabel(project.health)

  const todos = projectTodos[project.id] || []
  const pIdeas = projectIdeas[project.id] || []
  const feed = projectFeed[project.id] || []
  const agents = projectAgentStatus[project.id] || []
  const context = projectContext[project.id]
  const docs = projectDocuments[project.id] || []
  const milestones = projectPipelines[project.id] || []

  const pipeline = milestones.length > 0 ? (
    <Pipeline label="Roadmap" milestones={milestones} summary={project.phase ?? ''} />
  ) : undefined

  // Project-specific ticker
  const projectTicker = tickerData.projects || tickerData.system || []

  const tabs = [
    {
      label: 'Live',
      content: (
        <>
          {/* Feed */}
          <TcLabel>Live Feed</TcLabel>
          {feed.length === 0 ? (
            <TcText style={{ color: 'var(--tx3)' }}>Keine Events</TcText>
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

          {/* Agents */}
          <TcLabel>Agent Status</TcLabel>
          {agents.length === 0 ? (
            <TcText style={{ color: 'var(--tx3)' }}>Keine Agents zugewiesen</TcText>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {agents.map((a, i) => {
                const agentColor = a.status === 'active' ? 'var(--g)' : a.status === 'waiting' ? 'var(--a)' : 'var(--tx3)'
                return (
                  <div
                    key={i}
                    className="ghost-card"
                    style={{ '--hc': 'rgba(255,255,255,0.04)', padding: '10px 14px', gap: 4, borderRadius: 12 } as React.CSSProperties}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <StatusLed color={agentColor} glow={a.status === 'active' ? 'var(--gg)' : undefined} animate={a.status === 'active'} size={7} />
                      <span style={{ fontSize: 12, fontWeight: 700, flex: 1 }}>{a.name}</span>
                      <span style={{
                        fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 5,
                        background: `${agentColor}12`, color: agentColor, letterSpacing: 1, textTransform: 'uppercase',
                      }}>
                        {a.status}
                      </span>
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--tx2)', marginLeft: 15 }}>{a.task}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--tx3)', marginLeft: 15 }}>seit {a.since}</span>
                  </div>
                )
              })}
            </div>
          )}
        </>
      ),
    },
    {
      label: 'Todos',
      content: (
        <>
          <TcLabel>Todos ({todos.length})</TcLabel>
          {todos.length === 0 ? (
            <TcText style={{ color: 'var(--tx3)' }}>Keine Todos</TcText>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {todos.map((t, i) => (
                <div
                  key={i}
                  className="ghost-card"
                  style={{ '--hc': 'rgba(255,255,255,0.04)', padding: '10px 14px', gap: 2, borderRadius: 14, flexDirection: 'row', alignItems: 'center', cursor: 'pointer' } as React.CSSProperties}
                  onClick={() => setPendingPrompt(`/build ${t.title}`)}
                >
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6, flexShrink: 0,
                    background: `${priorityColor(t.priority)}12`, color: priorityColor(t.priority),
                    minWidth: 28, textAlign: 'center',
                  }}>
                    {t.priority}
                  </span>
                  <div style={{ flex: 1, minWidth: 0, marginLeft: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, textDecoration: t.status === 'done' ? 'line-through' : 'none', opacity: t.status === 'done' ? 0.5 : 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--tx3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.4 }}>{t.description}</div>
                  </div>
                  <span style={{ fontSize: 9, color: 'var(--tx3)', flexShrink: 0, marginLeft: 8, whiteSpace: 'nowrap' }}>{t.agent}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--tx3)', flexShrink: 0, marginLeft: 8, minWidth: 28, textAlign: 'right' }}>{t.duration}</span>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: todoDotColor(t.status), flexShrink: 0, marginLeft: 8 }} />
                </div>
              ))}
            </div>
          )}
        </>
      ),
    },
    {
      label: 'Ideas',
      content: (
        <>
          <TcLabel>Ideas ({pIdeas.length})</TcLabel>
          {pIdeas.length === 0 ? (
            <TcText style={{ color: 'var(--tx3)' }}>Keine Ideas</TcText>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
              {pIdeas.map((idea, i) => (
                <div
                  key={i}
                  className="ghost-card"
                  style={{ '--hc': 'var(--blg)', padding: '14px 16px', gap: 8, borderRadius: 14 } as React.CSSProperties}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{idea.title}</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 20, fontWeight: 700,
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
        </>
      ),
    },
    {
      label: 'Pipeline',
      content: (
        <>
          <TcLabel>Pipeline Milestones</TcLabel>
          {milestones.length === 0 ? (
            <TcText style={{ color: 'var(--tx3)' }}>Keine Pipeline konfiguriert</TcText>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {milestones.map((m, i) => (
                <div
                  key={i}
                  className="ghost-card"
                  style={{ '--hc': m.glow, padding: '12px 16px', gap: 6, borderRadius: 14 } as React.CSSProperties}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StatusLed
                      color={m.status === 'done' ? 'var(--g)' : m.status === 'active' ? m.color : 'var(--tx3)'}
                      glow={m.status === 'active' ? m.glow : undefined}
                      animate={m.status === 'active'}
                      size={8}
                    />
                    <span style={{ fontSize: 13, fontWeight: 700, flex: 1 }}>{m.title}</span>
                    <span style={{
                      fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 5,
                      background: m.status === 'done' ? 'var(--g)12' : m.status === 'active' ? `${m.color}12` : 'rgba(255,255,255,0.04)',
                      color: m.status === 'done' ? 'var(--g)' : m.status === 'active' ? m.color : 'var(--tx3)',
                      letterSpacing: 1, textTransform: 'uppercase',
                    }}>
                      {m.status}
                    </span>
                  </div>
                  {m.items && m.items.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginLeft: 15 }}>
                      {m.items.map((item, j) => (
                        <span key={j} style={{ fontSize: 10, color: 'var(--tx3)' }}>{item}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ),
    },
    {
      label: 'Context',
      content: (
        <>
          {!context ? (
            <TcText style={{ color: 'var(--tx3)' }}>Kein Kontext verfuegbar</TcText>
          ) : (
            <>
              <TcLabel>Goal</TcLabel>
              <TcText>{context.goal}</TcText>
              <TcLabel>Challenge</TcLabel>
              <TcText>{context.challenge}</TcText>
              <TcLabel>Audience</TcLabel>
              <TcText>{context.audience}</TcText>
              {context.notDoing && (
                <>
                  <TcLabel>Not Doing</TcLabel>
                  <TcText>{context.notDoing}</TcText>
                </>
              )}
              {context.architecture && (
                <>
                  <TcLabel>Architecture</TcLabel>
                  <TcText style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{context.architecture}</TcText>
                </>
              )}
            </>
          )}
        </>
      ),
    },
    {
      label: 'Documents',
      content: (
        <>
          <TcLabel>Dokumente ({docs.length})</TcLabel>
          {docs.length === 0 ? (
            <TcText style={{ color: 'var(--tx3)' }}>Keine Dokumente</TcText>
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
        </>
      ),
    },
  ]

  return (
    <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        backLink={{ label: 'Projekte', href: '/projects' }}
        title={project.name}
        toggleTheme={toggleTheme}
      />

      <SplitLayout
        ratio="50% 50%"
        left={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
            <div className="st" style={{ padding: '0 2px' }}>Terminal</div>
            <Terminal
              title={`${project.id} — project`}
              statusLabel={hLabel}
              statusColor={hColor}
              statusGlow={hColor.replace(')', 'g)')}
              placeholder={`kani project ${project.id} → ...`}
              mode="live"
              cwd={`~/mckay-os/projects/${project.id}`}
              terminalId={`project:${project.id}`}
              inputValue={pendingPrompt || undefined}
              onInputChange={(v) => setPendingPrompt(v || null)}
              onClearInput={() => setPendingPrompt(null)}
              onSend={() => setPendingPrompt(null)}
              onThinkingChange={setTerminalBusy}
            />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '4px 0' }}>
              {quickActions.map((qa, i) => {
                const Icon = qa.icon
                return (
                  <button
                    key={i}
                    className="qa-btn"
                    style={{
                      borderColor: qa.border, color: qa.color, '--qc': qa.color,
                      ...(terminalBusy ? { opacity: 0.4, pointerEvents: 'none' as const } : {}),
                    } as React.CSSProperties}
                    onClick={() => setPendingPrompt(qa.prompt)}
                    disabled={terminalBusy}
                  >
                    <Icon size={14} stroke={qa.color} />
                    {qa.label}
                  </button>
                )
              })}
            </div>
          </div>
        }
        right={
          <PreviewPanel
            title={project.name}
            ledColor={color}
            ledGlow={glow}
            badge={{ label: `${hLabel} / ${project.phase}`, bg: `${hColor}18`, color: hColor }}
            pipeline={pipeline}
            tabs={tabs}
            activeTab={tab}
            onTabChange={setTab}
            accentColor={color}
          />
        }
      />

      <BottomTicker
        label={project.name.toUpperCase()}
        ledColor={color}
        ledGlow={glow}
        items={projectTicker}
      />
    </div>
  )
}
