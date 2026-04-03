import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../shared/AppShell'
import QuickAccess from '../shared/QuickAccess'

/* ── Types ────────────────────────────────────────────── */

interface AgentData {
  id: string
  name: string
  status: 'active' | 'idle'
  task: string
  project: string
  department: string
  description: string
  colorVar: string
  glowVar: string
  bgVar: string
  tasks: number
  success: string
  runtime: string
  cost: string
  uptime: string
  icon: React.ReactNode
}

interface TickerItem {
  agent: string
  color: string
  text: string
}

/* ── Dummy Data ───────────────────────────────────────── */

const agents: AgentData[] = [
  {
    id: 'build-agent',
    name: 'Build Agent',
    status: 'active',
    task: 'Kompiliert /api/courses für Hebammenbuero',
    project: 'Hebammenbuero',
    department: 'Engineering · Frontend & Backend',
    description:
      'Generiert Code, API Routes, Prisma Schemas und React Components. Kompiliert und testet automatisch. Hauptverantwortlich für den technischen Build-Prozess.',
    colorVar: 'var(--g)',
    glowVar: 'var(--gg)',
    bgVar: 'var(--gc)',
    tasks: 67,
    success: '98%',
    runtime: '18h',
    cost: '€1.80',
    uptime: 'Seit 14:23',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--g)">
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: 'research-agent',
    name: 'Research Agent',
    status: 'active',
    task: 'Analysiert Steuerberater SaaS — Marktdaten',
    project: 'Thinktank · Steuerberater',
    department: 'Strategy · Market Research',
    description:
      'Analysiert Märkte, Wettbewerber, und Zielgruppen. Erstellt Research Reports mit Daten aus mehreren Quellen. Basis für Strategie-Entscheidungen.',
    colorVar: 'var(--p)',
    glowVar: 'var(--pg)',
    bgVar: 'rgba(124,77,255,.06)',
    tasks: 38,
    success: '95%',
    runtime: '12h',
    cost: '€2.40',
    uptime: 'Seit 09:15',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--p)">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    id: 'test-agent',
    name: 'Test Agent',
    status: 'active',
    task: 'Führt 47 Tests für TennisCoach Pro aus',
    project: 'TennisCoach Pro',
    department: 'Quality · Testing',
    description:
      'Führt automatisierte Tests durch. Unit Tests, Integration Tests, E2E Tests. Validiert Builds und meldet Fehler sofort.',
    colorVar: 'var(--t)',
    glowVar: 'var(--tg)',
    bgVar: 'var(--tc)',
    tasks: 23,
    success: '100%',
    runtime: '8h',
    cost: '€0.90',
    uptime: 'Seit 11:40',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--t)">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    id: 'deploy-agent',
    name: 'Deploy Agent',
    status: 'idle',
    task: 'Wartet auf nächsten Deploy-Auftrag',
    project: 'Letzter: Mission Control v0.8',
    department: 'DevOps · Deployment',
    description:
      'Deployed Projekte auf Vercel. Verwaltet Environments, Preview Deploys und Production Releases. Automatische Rollbacks bei Fehlern.',
    colorVar: 'var(--bl)',
    glowVar: 'var(--blg)',
    bgVar: 'var(--blc)',
    tasks: 14,
    success: '100%',
    runtime: '10h',
    cost: '€0.60',
    uptime: 'Idle seit 08:20',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--bl)">
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    ),
  },
  {
    id: 'seo-agent',
    name: 'SEO Agent',
    status: 'idle',
    task: 'Letzter Auftrag: SEO Audit Hebammenbuero',
    project: 'Letzter: Hebammenbuero',
    department: 'Marketing · SEO',
    description:
      'Führt SEO Audits durch, analysiert Rankings, generiert Meta Tags und Sitemaps. Überwacht Core Web Vitals und Lighthouse Scores.',
    colorVar: 'var(--a)',
    glowVar: 'var(--ag)',
    bgVar: 'var(--ac)',
    tasks: 8,
    success: '88%',
    runtime: '5h',
    cost: '€0.40',
    uptime: 'Idle seit gestern',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--a)">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
]

const tickerItems: TickerItem[] = [
  { agent: 'build-agent', color: 'var(--g)', text: 'kompiliert /api/courses für Hebammenbuero' },
  { agent: 'research', color: 'var(--p)', text: 'analysiert Steuerberater Markt — 23 Quellen' },
  { agent: 'test', color: 'var(--t)', text: 'TennisCoach: 47/47 Tests bestanden' },
  { agent: 'deploy', color: 'var(--bl)', text: 'Mission Control v0.8 deployed' },
  { agent: 'seo', color: 'var(--a)', text: 'Hebammenbuero Audit abgeschlossen' },
]

/* ── Notification data for agents context ─────────────── */

interface AgentNotifCategory {
  label: string
  count: number
  colorVar: string
  glowVar: string
  icon: React.ReactNode
  items: { project: string; text: string }[]
}

const agentNotifCategories: AgentNotifCategory[] = [
  {
    label: 'Issues',
    count: 1,
    colorVar: 'var(--r)',
    glowVar: 'var(--rg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--r)">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    items: [{ project: 'SEO Agent', text: 'Rate Limit bei API' }],
  },
  {
    label: 'Attention',
    count: 2,
    colorVar: 'var(--o)',
    glowVar: 'var(--og)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--o)">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      </svg>
    ),
    items: [
      { project: 'Build', text: 'Queue voll (3 Tasks)' },
      { project: 'Research', text: 'API Credits niedrig' },
    ],
  },
  {
    label: 'Freigabe',
    count: 1,
    colorVar: 'var(--g)',
    glowVar: 'var(--gg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--g)">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    items: [{ project: 'Deploy', text: 'MC v0.9 bereit' }],
  },
  {
    label: 'Results',
    count: 3,
    colorVar: 'var(--bl)',
    glowVar: 'var(--blg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--bl)">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    items: [
      { project: 'Test', text: '47/47 Tests passed' },
      { project: 'Build', text: '3 Routes fertig' },
      { project: 'Research', text: 'Marktanalyse done' },
    ],
  },
]

/* ── Component ────────────────────────────────────────── */

export default function Agents() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'active' | 'idle'>('all')
  const [selectedId, setSelectedId] = useState<string>('build-agent')
  const [pipelineOpen, setPipelineOpen] = useState(false)

  const activeCount = agents.filter((a) => a.status === 'active').length
  const idleCount = agents.filter((a) => a.status === 'idle').length
  const totalTasks = agents.reduce((sum, a) => sum + a.tasks, 0)
  const errorCount = 1
  const totalRuntime = '48h'

  const filtered =
    filter === 'all'
      ? agents
      : agents.filter((a) => a.status === filter)

  const selected = agents.find((a) => a.id === selectedId) ?? agents[0]

  return (
    <AppShell title="Agents" ledColor="g">
      {/* KPI Row */}
      <div className="krow">
        <div className="kpi cf" style={{ '--kc': 'var(--gg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--gg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--g)">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--g)' }}>{activeCount}</div>
            <div className="kl">Aktiv</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--ag)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--ag)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--a)">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--a)' }}>{idleCount}</div>
            <div className="kl">Idle</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--blg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--blg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--bl)">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--bl)' }}>{totalTasks}</div>
            <div className="kl">Tasks erledigt</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--rg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--rg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--r)">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--r)' }}>{errorCount}</div>
            <div className="kl">Fehler</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--pg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--pg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--p)">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--p)' }}>{totalRuntime}</div>
            <div className="kl">Laufzeit ges.</div>
          </div>
        </div>
      </div>

      {/* Pipeline / Agent Status */}
      <div style={{ padding: '0 40px', marginBottom: 14, flexShrink: 0 }}>
        <div className="cf" style={{ overflow: 'hidden' }}>
          <div
            style={{
              padding: '14px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              cursor: 'pointer',
              transition: 'all .3s',
            }}
            onClick={() => setPipelineOpen((p) => !p)}
          >
            <span className="st" style={{ whiteSpace: 'nowrap' }}>Agent Status</span>
            <div
              className="in"
              style={{
                flex: 1,
                height: 10,
                borderRadius: 5,
                display: 'flex',
                gap: 3,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  flex: activeCount,
                  height: '100%',
                  borderRadius: 4,
                  background: 'var(--g)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 7,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,.8)',
                }}
              >
                {activeCount}
              </div>
              <div
                style={{
                  flex: idleCount,
                  height: '100%',
                  borderRadius: 4,
                  background: 'var(--a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 7,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,.8)',
                }}
              >
                {idleCount}
              </div>
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono'",
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--g)',
                whiteSpace: 'nowrap',
              }}
            >
              {agents.length} Agents
            </span>
            <span style={{ fontSize: 10, color: 'var(--tx3)', cursor: 'pointer' }}>
              {pipelineOpen ? '\u25B2' : '\u25BC'}
            </span>
          </div>
          {pipelineOpen && (
            <div
              style={{
                padding: '14px 22px 18px',
                borderTop: '1px solid rgba(0,0,0,.04)',
                marginTop: 10,
                display: 'flex',
                gap: 24,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, minWidth: 180 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: 'var(--g)',
                    boxShadow: '0 0 8px var(--gg)',
                    marginTop: 3,
                    flexShrink: 0,
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--g)' }}>
                    Aktiv ({activeCount})
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--tx3)', lineHeight: 1.5 }}>
                    {agents
                      .filter((a) => a.status === 'active')
                      .map((a, i) => (
                        <span key={a.id}>
                          {'\u25CF'} {a.name} → {a.project}
                          {i < activeCount - 1 && <br />}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, minWidth: 180 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: 'var(--a)',
                    marginTop: 3,
                    flexShrink: 0,
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--a)' }}>
                    Idle ({idleCount})
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--tx3)', lineHeight: 1.5 }}>
                    {agents
                      .filter((a) => a.status === 'idle')
                      .map((a, i) => (
                        <span key={a.id}>
                          {'\u25CF'} {a.name} — {a.project.replace('Letzter: ', '')}
                          {i < idleCount - 1 && <br />}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Row */}
      <div className="filter-row">
        <span className="st" style={{ marginRight: 12 }}>Agents</span>
        <button
          className={`fb${filter === 'all' ? ' active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Alle <span className="fc">{agents.length}</span>
        </button>
        <button
          className={`fb${filter === 'active' ? ' active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Aktiv <span className="fc">{activeCount}</span>
        </button>
        <button
          className={`fb${filter === 'idle' ? ' active' : ''}`}
          onClick={() => setFilter('idle')}
        >
          Idle <span className="fc">{idleCount}</span>
        </button>
      </div>

      {/* Main Body: Grid left | Detail+Chat right */}
      <div className="abody">
        <div className="aleft">
          <div className="agrid">
            {filtered.map((agent) => (
              <div
                key={agent.id}
                className="cgw"
                style={{ '--gc2': agent.glowVar } as React.CSSProperties}
                onClick={() => setSelectedId(agent.id)}
              >
                <div
                  className="ac cf"
                  style={{ '--hc': agent.glowVar } as React.CSSProperties}
                >
                  <div className="ac-top">
                    <div
                      className="ac-icon btn3d"
                      style={{ '--bc': agent.glowVar } as React.CSSProperties}
                    >
                      {agent.status === 'active' && (
                        <div
                          className="sl"
                          style={{
                            position: 'absolute',
                            top: -2,
                            right: -2,
                            width: 8,
                            height: 8,
                            background: agent.colorVar,
                            '--lc': agent.glowVar,
                            animation: 'lp 3s ease-in-out infinite',
                          } as React.CSSProperties}
                        />
                      )}
                      {agent.icon}
                    </div>
                    <span
                      className="ac-badge"
                      style={{
                        background: agent.bgVar,
                        color: agent.colorVar,
                      }}
                    >
                      {agent.status === 'active' ? '\u25CF Aktiv' : '\u23F8 Idle'}
                    </span>
                  </div>
                  <div className="ac-name">{agent.name}</div>
                  <div
                    className="ac-task"
                    style={agent.status === 'idle' ? { color: 'var(--tx3)' } : undefined}
                  >
                    {agent.task}
                  </div>
                  <div className="ac-project">
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background:
                          agent.status === 'active' ? agent.colorVar : 'var(--tx3)',
                        boxShadow:
                          agent.status === 'active'
                            ? `0 0 4px ${agent.glowVar}`
                            : 'none',
                      }}
                    />
                    <span style={{ color: 'var(--tx3)' }}>{agent.project}</span>
                  </div>
                  <div className="ac-stats">
                    <div className="ac-stat">
                      <span className="ac-stat-val" style={{ color: agent.colorVar }}>
                        {agent.tasks}
                      </span>
                      <span className="ac-stat-label">Tasks</span>
                    </div>
                    <div className="ac-stat">
                      <span className="ac-stat-val" style={{ color: agent.colorVar }}>
                        {agent.success}
                      </span>
                      <span className="ac-stat-label">Erfolg</span>
                    </div>
                    <div className="ac-stat">
                      <span className="ac-stat-val">{agent.runtime}</span>
                      <span className="ac-stat-label">Runtime</span>
                    </div>
                  </div>
                  <div className="ac-foot">
                    <span className="ac-uptime">{agent.uptime}</span>
                    <span
                      className="ac-arrow"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/agents/${agent.id}`)
                      }}
                    >
                      &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {/* Add agent placeholder */}
            <div
              className="ac cf"
              style={{
                opacity: 0.15,
                border: '2px dashed rgba(0,0,0,.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 140,
              }}
            >
              <span style={{ fontSize: 28, color: 'var(--tx3)' }}>+</span>
            </div>
          </div>
        </div>

        {/* Right: Agent Detail + Chat */}
        <div className="aright">
          <div className="adet cf">
            <div className="adet-hdr">
              <div className="adet-title">{selected.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 5,
                    background: selected.bgVar,
                    color: selected.colorVar,
                  }}
                >
                  {selected.status === 'active' ? '\u25CF Aktiv' : '\u23F8 Idle'}
                </span>
              </div>
            </div>
            <div className="adet-body">
              <div>
                <div className="adet-label">Beschreibung</div>
                <div className="adet-text">{selected.description}</div>
              </div>
              <div>
                <div className="adet-label">Department</div>
                <div
                  className="adet-text"
                  style={{ color: selected.colorVar, fontWeight: 600 }}
                >
                  {selected.department}
                </div>
              </div>
              <div>
                <div className="adet-label">Stats</div>
                <div className="adet-stat">
                  <div className="adet-si in">
                    <div className="adet-si-val" style={{ color: selected.colorVar }}>
                      {selected.tasks}
                    </div>
                    <div className="adet-si-label">Tasks</div>
                  </div>
                  <div className="adet-si in">
                    <div className="adet-si-val" style={{ color: selected.colorVar }}>
                      {selected.success}
                    </div>
                    <div className="adet-si-label">Erfolg</div>
                  </div>
                  <div className="adet-si in">
                    <div className="adet-si-val" style={{ color: 'var(--bl)' }}>
                      {selected.runtime}
                    </div>
                    <div className="adet-si-label">Runtime</div>
                  </div>
                  <div className="adet-si in">
                    <div className="adet-si-val" style={{ color: 'var(--p)' }}>
                      {selected.cost}
                    </div>
                    <div className="adet-si-label">Kosten</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="adet-label">Aktueller Auftrag</div>
                <div className="adet-text">
                  <b>{selected.project.replace('Letzter: ', '').replace('Thinktank · ', '')}</b>{' '}
                  — {selected.task}
                </div>
              </div>
            </div>
          </div>

          {/* Agent Chat */}
          <div className="akani cf">
            <div className="akani-hdr">
              <div className="akani-av">
                <svg viewBox="0 0 24 24">
                  <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <span className="akani-nm">{selected.name} · Chat</span>
              <span style={{ fontSize: 7, color: 'var(--g)', marginLeft: 'auto' }}>
                {selected.status === 'active' ? 'Running' : 'Idle'}
              </span>
            </div>
            <div className="akani-body">
              <div className="akm k in">
                {selected.name} hier. Arbeite gerade an {selected.task}. 2 von 3 Sub-Tasks
                erledigt.
              </div>
              <div className="akm u">Wie lange noch?</div>
              <div className="akm k in">
                Geschätzt noch ~2 Min für aktuellen Task. Danach Queue abarbeiten. Gesamt: ~8
                Min.
              </div>
            </div>
            <div className="akani-in">
              <input
                className="akani-inp in"
                placeholder={`Nachricht an ${selected.name}...`}
                readOnly
              />
              <button className="akani-send">
                <svg viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Notifications + Quick Access */}
      <div
        className="brow"
        style={{ gridTemplateColumns: '1fr 420px', marginTop: 16, flex: 0 }}
      >
        <div className="notif cf">
          <div className="notif-t">Notifications</div>
          <div className="notif-g">
            {agentNotifCategories.map((cat) => (
              <div key={cat.label} className="notif-cat">
                <div
                  className="btn3d btn3d-lg"
                  style={{ '--bc': cat.glowVar } as React.CSSProperties}
                >
                  <span
                    className="notif-badge"
                    style={{
                      background: cat.colorVar,
                      boxShadow: `0 2px 8px ${cat.glowVar}`,
                    }}
                  >
                    {cat.count}
                  </span>
                  {cat.icon}
                </div>
                <div className="notif-label" style={{ color: cat.colorVar }}>
                  {cat.label}
                </div>
                <div className="notif-detail">
                  {cat.items.map((item, i) => (
                    <span key={i}>
                      <span style={{ color: cat.colorVar }}>{'\u25CF'}</span>{' '}
                      <b>{item.project}:</b> {item.text}
                      {i < cat.items.length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <QuickAccess />
      </div>

      {/* Live Feed */}
      <div className="ticker-w">
        <div className="ticker cf" style={{ borderRadius: 24 }}>
          <div className="ticker-lbl">
            <span className="ticker-ld" />
            AGENTS
          </div>
          <div className="ticker-c">
            <div className="ticker-s">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <div key={i} className="ticker-i">
                  <span className="ticker-id" style={{ background: item.color }} />
                  <span className="ticker-ia" style={{ color: item.color }}>
                    {item.agent}
                  </span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
