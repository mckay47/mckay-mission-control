import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import AppShell from '../shared/AppShell'
import { PROJ, TODOS, IDEAS, AGENTS } from '../../lib/data'
import type { Project } from '../../lib/types'

/* ── Helpers ────────────────────────────────────────────── */

function statusOf(p: Project): { label: string; bg: string; color: string; ledColor: string } {
  if (p.phase === 'LIVE') return { label: 'Live', bg: 'var(--blc)', color: 'var(--bl)', ledColor: 'b' }
  if (p.term === 'Waiting' && p.health === 'Attention') return { label: 'Blocked', bg: 'var(--rc)', color: 'var(--r)', ledColor: 'r' }
  if (p.term === 'Waiting') return { label: 'Pause', bg: 'var(--ac)', color: 'var(--a)', ledColor: 'a' }
  if (p.term === 'Idle') return { label: 'Idle', bg: 'rgba(0,0,0,0.04)', color: 'var(--tx3)', ledColor: 'off' }
  return { label: 'Aktiv', bg: 'var(--gc)', color: 'var(--g)', ledColor: 'g' }
}

/* ── Timeline types ────────────────────────────────────── */

interface TimelinePhase {
  label: string
  flex: number
  state: 'done' | 'current' | 'future'
}

interface TerminalLine {
  type: 'prompt' | 'output' | 'highlight' | 'warn' | 'blank'
  prompt?: string
  text: string
  richText?: React.ReactNode
}

interface TickerItem {
  agent: string
  color: string
  text: string
}

/* ── Component ────────────────────────────────────────── */

export default function ProjectDetail() {
  const { id } = useParams()
  const [tlOpen, setTlOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('terminal')

  const project = PROJ.find(p => p.id === id)

  if (!project) {
    return (
      <AppShell backLink={{ label: 'Cockpit', href: '/' }} title="Nicht gefunden" ledColor="off" kaniContext={`projekt:${id}`}>
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--tx3)' }}>
          <h2 style={{ fontSize: 24, marginBottom: 12 }}>Projekt nicht gefunden</h2>
          <p>ID: {id}</p>
        </div>
      </AppShell>
    )
  }

  const st = statusOf(project)

  /* Todos for this project */
  const projectTodos = useMemo(() =>
    TODOS.filter(t => !t.done && (t.proj === project.n || t.proj === project.id || project.n.startsWith(t.proj) && t.proj.length > 0))
      .sort((a, b) => {
        const pMap: Record<string, number> = { h: 0, m: 1, l: 2 }
        return (pMap[a.prio] ?? 1) - (pMap[b.prio] ?? 1)
      })
      .slice(0, 5),
    [project]
  )

  /* Ideas: project-specific from IDEAS array */
  const projectIdeas = useMemo(() =>
    IDEAS.filter(idea => {
      const idLower = idea.id.toLowerCase()
      const nLower = project.n.toLowerCase()
      return idLower.includes(nLower.slice(0, 4)) || nLower.includes(idLower.slice(0, 4))
    }).slice(0, 5),
    [project]
  )

  /* Agents relevant to this project */
  const projectAgents = useMemo(() => {
    const activeAgents = AGENTS.filter(a => a.st === 'active')
    const idleAgents = AGENTS.filter(a => a.st !== 'active').slice(0, 3)
    return [...activeAgents, ...idleAgents]
  }, [])

  /* Timeline phases */
  const phaseTotal = 5
  const phaseDone = Math.max(0, project.phN + 1)
  const phaseLabels = ['Konzept', 'Mockup', 'MVP', 'Beta', 'Launch']
  const timelinePhases: TimelinePhase[] = phaseLabels.map((label, i) => ({
    label,
    flex: label === 'Mockup' || label === 'MVP' ? 3 : 2,
    state: i < phaseDone ? 'done' : i === phaseDone ? 'current' : 'future',
  }))

  /* Terminal lines (dummy but project-aware) */
  const prompt = `kani@${project.n} ~$`
  const terminalLines: TerminalLine[] = [
    { type: 'prompt', prompt, text: 'status' },
    { type: 'output', text: `Phase: ${project.phase} (${phaseDone}/${phaseTotal}) | Progress: ${project.pct}%`,
      richText: <><span className="term-output">{'Phase: '}</span><span className="term-highlight">{project.phase}</span><span className="term-output">{` (${phaseDone}/${phaseTotal}) | Progress: `}</span><span className="term-highlight">{project.pct}%</span></> },
    { type: 'output', text: `Todos: ${project.todos} open`,
      richText: <><span className="term-output">{'Todos: '}</span><span className="term-highlight">{project.todos} open</span></> },
    { type: 'output', text: `Stack: ${project.stack}`,
      richText: <><span className="term-output">{'Stack: '}</span><span style={{ color: 'var(--p)' }}>{project.stack}</span></> },
    { type: 'output', text: `Runtime: ${project.days}d | Cost: \u20AC${project.cost.toFixed(2)}`,
      richText: <><span className="term-output">{'Runtime: '}</span><span style={{ color: 'var(--bl)' }}>{project.days}d</span><span className="term-output">{' | Cost: '}</span><span style={{ color: 'var(--p)' }}>{'\u20AC'}{project.cost.toFixed(2)}</span></> },
    { type: 'blank', text: '\u00A0' },
    ...(project.last ? [{ type: 'prompt' as const, prompt, text: 'last-update' },
      { type: 'highlight' as const, text: project.last }] : []),
    ...(project.next ? [{ type: 'prompt' as const, prompt, text: 'next' },
      { type: 'output' as const, text: project.next }] : []),
  ]

  /* Project ticker items */
  const projectTickerItems: TickerItem[] = [
    { agent: 'kani', color: 'var(--a)', text: `${project.n} Status: ${st.label}` },
    { agent: 'build-agent', color: 'var(--g)', text: `Phase ${project.phase} \u2014 ${project.pct}%` },
    { agent: 'ops', color: 'var(--bl)', text: `${project.todos} offene Todos` },
  ]

  /* Quick Access items */
  const qaItems = [
    {
      label: 'App \u00F6ffnen',
      sublabel: 'Preview',
      colorVar: 'var(--o)',
      glowVar: 'var(--og)',
      icon: (
        <svg viewBox="0 0 24 24" stroke="var(--o)">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
    },
    {
      label: 'Dokumente',
      sublabel: `${projectTodos.length} Files`,
      colorVar: 'var(--bl)',
      glowVar: 'var(--blg)',
      icon: (
        <svg viewBox="0 0 24 24" stroke="var(--bl)">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
    {
      label: 'Repository',
      sublabel: 'GitHub',
      colorVar: 'var(--p)',
      glowVar: 'var(--pg)',
      icon: (
        <svg viewBox="0 0 24 24" stroke="var(--p)">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
    {
      label: 'Analytics',
      sublabel: 'Dashboard',
      colorVar: 'var(--g)',
      glowVar: 'var(--gg)',
      icon: (
        <svg viewBox="0 0 24 24" stroke="var(--g)">
          <path d="M12 20V10" />
          <path d="M18 20V4" />
          <path d="M6 20v-4" />
        </svg>
      ),
    },
    {
      label: 'Briefing',
      sublabel: 'Heute',
      colorVar: 'var(--t)',
      glowVar: 'var(--tg)',
      icon: (
        <svg viewBox="0 0 24 24" stroke="var(--t)">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
        </svg>
      ),
    },
    {
      label: 'Private',
      sublabel: 'Pers\u00F6nlich',
      colorVar: 'var(--pk)',
      glowVar: 'var(--pkg)',
      icon: (
        <svg viewBox="0 0 24 24" stroke="var(--pk)">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ]

  /* Notification items (project-scoped) */
  const notifItems = [
    {
      label: 'Status',
      labelColor: st.color,
      colorVar: st.color,
      glowVar: st.color,
      detail: `${st.label} \u2014 ${project.phase}`,
      detailColor: st.color,
      icon: (
        <svg viewBox="0 0 24 24" width="15" height="15" stroke={st.color} strokeWidth="1.8" fill="none">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    {
      label: 'Todos',
      labelColor: 'var(--a)',
      colorVar: 'var(--a)',
      glowVar: 'var(--ag)',
      detail: `${project.todos} offen`,
      detailColor: 'var(--a)',
      icon: (
        <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--a)" strokeWidth="1.8" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
        </svg>
      ),
    },
    {
      label: 'Stack',
      labelColor: 'var(--bl)',
      colorVar: 'var(--bl)',
      glowVar: 'var(--blg)',
      detail: project.stack.length > 30 ? project.stack.slice(0, 30) + '...' : project.stack,
      detailColor: 'var(--bl)',
      icon: (
        <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--bl)" strokeWidth="1.8" fill="none">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
    {
      label: 'Domain',
      labelColor: 'var(--g)',
      colorVar: 'var(--g)',
      glowVar: 'var(--gg)',
      detail: project.dom || 'Nicht konfiguriert',
      detailColor: project.dom ? 'var(--g)' : 'var(--tx3)',
      icon: (
        <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--g)" strokeWidth="1.8" fill="none">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
  ]

  return (
    <AppShell
      backLink={{ label: 'Cockpit', href: '/' }}
      title={project.n}
      ledColor={st.ledColor}
      kaniContext={`projekt:${id}`}
    >
      {/* ── KPI ROW ─────────────────────────────────────── */}
      <div className="krow">
        <div className="kpi cf" style={{ '--kc': 'var(--gg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--gg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--g)">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--g)' }}>{project.pct}%</div>
            <div className="kl">Fortschritt</div>
          </div>
        </div>

        <div className="kpi cf" style={{ '--kc': 'var(--ag)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--ag)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--a)">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
            </svg>
          </div>
          <div>
            <div className="kv">{project.todos}</div>
            <div className="kl">Offene Todos</div>
          </div>
        </div>

        <div className="kpi cf" style={{ '--kc': 'var(--blg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--blg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--bl)">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--bl)' }}>{project.days}d</div>
            <div className="kl">Laufzeit</div>
          </div>
        </div>

        <div className="kpi cf" style={{ '--kc': 'var(--pg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--pg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--p)">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--p)' }}>{'\u20AC'}{project.cost.toFixed(2)}</div>
            <div className="kl">Kosten bisher</div>
          </div>
        </div>

        <div className="kpi cf" style={{ '--kc': 'var(--gg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--gg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--g)">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--g)' }}>{AGENTS.filter(a => a.st === 'active').length}</div>
            <div className="kl">Agents aktiv</div>
          </div>
        </div>
      </div>

      {/* ── TIMELINE BAR ────────────────────────────────── */}
      <div className="pd-timeline">
        <div className="cf" style={{ overflow: 'hidden' }}>
          <div
            className="tl-bar"
            onClick={() => setTlOpen((p) => !p)}
          >
            <span className="tl-label">Projektplan</span>
            <div className="tl-track in">
              {timelinePhases.map((ph) => (
                <div
                  key={ph.label}
                  className={`tl-seg ${ph.state}`}
                  style={{
                    flex: ph.flex,
                    background: 'var(--g)',
                    borderRadius: 3,
                    ...(ph.state === 'current' ? { '--lc': 'var(--gg)' } as React.CSSProperties : {}),
                  }}
                >
                  <span className="tl-seg-label">{ph.label}</span>
                </div>
              ))}
            </div>
            <span className="tl-pct">Phase {phaseDone}/{phaseTotal}</span>
            <span className="tl-expand">{tlOpen ? '\u25B2 Zuklappen' : '\u25BC Details'}</span>
          </div>

          <div className={`tl-milestone${tlOpen ? ' open' : ''}`}>
            {phaseLabels.map((label, i) => {
              const isDone = i < phaseDone
              const isCurrent = i === phaseDone
              const color = isDone || isCurrent ? 'var(--g)' : 'var(--tx3)'
              const glow = isCurrent ? 'var(--gg)' : undefined
              return (
                <div key={label} className="tl-ms">
                  <div
                    className="tl-ms-dot"
                    style={{
                      background: color,
                      ...(glow ? { boxShadow: `0 0 8px ${glow}` } : {}),
                    }}
                  />
                  <div className="tl-ms-info">
                    <div className="tl-ms-title" style={isDone || isCurrent ? { color } : undefined}>
                      {label}{isDone ? ' \u2713' : isCurrent ? ' \u2192 aktiv' : ''}
                    </div>
                    <div className="tl-ms-date">{isDone ? 'abgeschlossen' : isCurrent ? 'jetzt' : 'geplant'}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── SECTION TITLES ──────────────────────────────── */}
      <div className="pd-trow">
        <span className="st">Agents</span>
        <span className="st">Terminal</span>
        <span className="st">Todos & Ideen</span>
      </div>

      {/* ── BODY — 3 columns ────────────────────────────── */}
      <div className="pd-body">
        {/* LEFT: AGENTS */}
        <div className="lnav">
          {projectAgents.map((ag, idx) => {
            const isActive = ag.st === 'active'
            const agColor = ag.col || 'var(--tx3)'
            // const agGlow = ag.bg || 'transparent'
            return (
              <div
                key={ag.n + idx}
                className="ag-item cf"
                style={{ '--nc': agColor } as React.CSSProperties}
              >
                <div
                  className="ag-icon btn3d"
                  style={{ '--bc': agColor, width: 36, height: 36 } as React.CSSProperties}
                >
                  {isActive && (
                    <span
                      className="ag-dot sl"
                      style={{
                        width: 7,
                        height: 7,
                        background: agColor,
                        '--lc': agColor,
                        ...(agColor !== 'var(--g)' ? { animation: 'none' } : {}),
                      } as React.CSSProperties}
                    />
                  )}
                  <span style={{ fontSize: 14 }}>{ag.e}</span>
                </div>
                <span className="ag-name">{ag.n.replace(' Agent', '').replace(' Master', '')}</span>
                <span className="ag-status" style={{ color: isActive ? agColor : 'var(--tx3)' }}>
                  {isActive ? 'Aktiv' : 'Idle'}
                </span>
              </div>
            )
          })}
        </div>

        {/* CENTER: TERMINAL */}
        <div className="pd-center">
          <div className="term-card cf">
            <div className="term-header">
              <div style={{ display: 'flex', gap: 6 }}>
                {['terminal', 'buildlog', 'preview'].map((tab) => (
                  <span
                    key={tab}
                    className={`term-tab${activeTab === tab ? ' active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'terminal' ? 'KANI Terminal' : tab === 'buildlog' ? 'Build Log' : 'Preview'}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div className="sl g" style={{ width: 7, height: 7 }} />
                <span style={{ fontSize: 9, color: 'var(--g)', fontWeight: 600 }}>Connected</span>
              </div>
            </div>
            <div className="term-body">
              {terminalLines.map((line, i) => {
                if (line.type === 'prompt') {
                  return (
                    <div key={i} className="term-line">
                      <span className="term-prompt">{line.prompt}</span>
                      <span>{line.text}</span>
                    </div>
                  )
                }
                if (line.richText) {
                  return (
                    <div key={i} className="term-line">
                      {line.richText}
                    </div>
                  )
                }
                return (
                  <div key={i} className="term-line">
                    <span className={`term-${line.type}`}>{line.text}</span>
                  </div>
                )
              })}
            </div>
            <div className="term-input-row">
              <input
                className="term-input in"
                placeholder={`${prompt} `}
                readOnly
              />
              <button className="term-send">
                <svg viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: TODOS + IDEAS */}
        <div className="pd-right">
          {/* Todos */}
          <div className="r-card pd-r-card-half cf">
            <div className="r-hdr">
              <span className="st">Todos</span>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, fontWeight: 600, color: 'var(--tx3)' }}>
                {project.todos} offen
              </span>
            </div>
            <div className="pd-r-list">
              {projectTodos.map((todo) => {
                const prioMap: Record<string, { label: string; bg: string; color: string }> = {
                  h: { label: 'P0', bg: 'var(--rc)', color: 'var(--r)' },
                  m: { label: 'P1', bg: 'rgba(124,77,255,.06)', color: 'var(--p)' },
                  l: { label: 'P2', bg: 'rgba(124,77,255,.06)', color: 'var(--tx3)' },
                }
                const prio = prioMap[todo.prio] || prioMap.m
                return (
                  <div key={todo.id} className="pd-r-item">
                    <div className="pd-r-chk in" />
                    <div>
                      <div className="r-title">{todo.txt.length > 50 ? todo.txt.slice(0, 50) + '...' : todo.txt}</div>
                      <div className="r-desc">{project.n}</div>
                      <div style={{ display: 'flex', gap: 4, marginTop: 3 }}>
                        <span className="r-tag" style={{ background: prio.bg, color: prio.color }}>
                          {prio.label}
                        </span>
                        {todo.ov && (
                          <span className="r-tag" style={{ background: 'var(--rc)', color: 'var(--r)' }}>
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="pd-r-date" style={todo.ov ? { color: 'var(--r)' } : undefined}>
                      {todo.due || ''}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Ideas */}
          <div className="r-card pd-r-card-half cf">
            <div className="r-hdr">
              <span className="st">Ideas</span>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, fontWeight: 600, color: 'var(--tx3)' }}>
                {project.ideas} Ideen
              </span>
            </div>
            <div className="pd-r-list">
              {projectIdeas.length > 0 ? projectIdeas.map((idea) => (
                <div key={idea.id} className="pd-idea-item">
                  <span style={{ color: 'var(--p)' }}>&#x1F4A1;</span>
                  <span className="pd-idea-text">{idea.n}</span>
                  <span className="pd-idea-del">&#x2715;</span>
                </div>
              )) : (
                <div className="pd-idea-item" style={{ opacity: 0.4 }}>
                  <span style={{ color: 'var(--p)' }}>&#x1F4A1;</span>
                  <span className="pd-idea-text">Noch keine Ideen erfasst</span>
                </div>
              )}
            </div>
            <div className="pd-idea-input-row">
              <input className="pd-idea-input in" placeholder="Neue Idee hinzuf\u00FCgen..." readOnly />
              <button className="pd-idea-add">+ Idee</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW — Notifications + Quick Access ──── */}
      <div className="pd-brow">
        <div />
        <div className="cf" style={{ padding: '16px 20px' }}>
          <div className="st" style={{ marginBottom: 10 }}>Notifications &middot; {project.n}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {notifItems.map((n, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    className="btn3d"
                    style={{ '--bc': n.glowVar, width: 36, height: 36 } as React.CSSProperties}
                  >
                    {n.icon}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: n.labelColor }}>{n.label}</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--tx2)', lineHeight: 1.5, marginTop: 4 }}>
                  <span style={{ color: n.detailColor }}>{'\u25CF'}</span>{' '}
                  <b>{project.n}:</b> {n.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="qa cf">
          <div className="qa-t">Quick Access</div>
          <div className="qa-g">
            {qaItems.map((item, i) => (
              <div key={i} className="qa-item">
                <div
                  className="btn3d"
                  style={{ '--bc': item.glowVar, width: 40, height: 40 } as React.CSSProperties}
                >
                  {item.icon}
                </div>
                <span className="qa-lb">{item.label}</span>
                <span className="qa-sb">{item.sublabel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── LIVE FEED (project-scoped) ──────────────────── */}
      <ProjectLiveFeed projectName={project.n} items={projectTickerItems} />
    </AppShell>
  )
}

/* ── Project-scoped Live Feed ─────────────────────────── */

function ProjectLiveFeed({ projectName, items }: { projectName: string; items: TickerItem[] }) {
  return (
    <div className="ticker-w">
      <div className="ticker cf" style={{ borderRadius: 24 }}>
        <div className="ticker-lbl">
          <span className="ticker-ld" />
          {projectName.toUpperCase()}
        </div>
        <div className="ticker-c">
          <div className="ticker-s">
            {/* Duplicate for infinite scroll */}
            <TickerItems items={items} />
            <TickerItems items={items} />
          </div>
        </div>
      </div>
    </div>
  )
}

function TickerItems({ items }: { items: TickerItem[] }) {
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className="ticker-i">
          <span className="ticker-id" style={{ background: item.color }} />
          <span className="ticker-ia" style={{ color: item.color }}>{item.agent}</span>
          {item.text}
        </div>
      ))}
    </>
  )
}
