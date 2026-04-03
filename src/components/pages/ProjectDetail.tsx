import { useState } from 'react'
import { useParams } from 'react-router-dom'
import AppShell from '../shared/AppShell'

/* ── Types ────────────────────────────────────────────── */

interface ProjectData {
  name: string
  status: string
  statusBg: string
  statusColor: string
  ledColor: string
  progress: number
  openTodos: number
  runtime: string
  cost: string
  activeAgents: number
  prompt: string
}

interface TimelinePhase {
  label: string
  flex: number
  state: 'done' | 'current' | 'future'
}

interface Milestone {
  title: string
  date: string
  details: string[]
  done: boolean
  current?: boolean
  color: string
  glow?: string
}

interface AgentItem {
  id: string
  name: string
  status: 'active' | 'idle'
  colorVar: string
  glowVar: string
  icon: React.ReactNode
  statusLabel: string
  isDividerBefore?: boolean
}

interface TerminalLine {
  type: 'prompt' | 'output' | 'highlight' | 'warn' | 'err' | 'blank'
  prompt?: string
  text: string
  richText?: React.ReactNode
}

interface TodoItem {
  title: string
  desc: string
  tags: { label: string; bg: string; color: string }[]
  date: string
  dateColor?: string
}

interface IdeaItem {
  text: string
}

interface NotifItem {
  label: string
  labelColor: string
  colorVar: string
  glowVar: string
  detail: string
  detailColor: string
  icon: React.ReactNode
}

interface TickerItem {
  agent: string
  color: string
  text: string
}

/* ── Dummy Data ───────────────────────────────────────── */

const projectsMap: Record<string, ProjectData> = {
  heb: {
    name: 'Hebammenbuero',
    status: 'Aktiv',
    statusBg: 'var(--gc)',
    statusColor: 'var(--g)',
    ledColor: 'g',
    progress: 40,
    openTodos: 12,
    runtime: '14d',
    cost: '\u20AC8.40',
    activeAgents: 2,
    prompt: 'kani@hebammenbuero ~$',
  },
  mc: {
    name: 'Mission Control',
    status: 'Aktiv',
    statusBg: 'var(--gc)',
    statusColor: 'var(--g)',
    ledColor: 'g',
    progress: 67,
    openTodos: 8,
    runtime: '21d',
    cost: '\u20AC12.60',
    activeAgents: 1,
    prompt: 'kani@mission-control ~$',
  },
  tc: {
    name: 'TennisCoach Pro',
    status: 'Aktiv',
    statusBg: 'var(--tc)',
    statusColor: 'var(--t)',
    ledColor: 't',
    progress: 80,
    openTodos: 3,
    runtime: '42d',
    cost: '\u20AC24.10',
    activeAgents: 0,
    prompt: 'kani@tenniscoach ~$',
  },
}

const timelinePhases: TimelinePhase[] = [
  { label: 'Konzept', flex: 2, state: 'done' },
  { label: 'Mockup', flex: 3, state: 'current' },
  { label: 'MVP', flex: 3, state: 'future' },
  { label: 'Beta', flex: 2, state: 'future' },
  { label: 'Launch', flex: 2, state: 'future' },
]

const milestones: Milestone[] = [
  {
    title: 'Konzept \u2713',
    date: '20.03 \u2014 abgeschlossen',
    details: ['Zielgruppe definiert', 'Wettbewerbs-Analyse', 'Feature-Liste priorisiert', 'Tech-Stack entschieden'],
    done: true,
    color: 'var(--g)',
  },
  {
    title: 'Mockup \u2192 aktiv',
    date: '21.03 \u2014 jetzt',
    details: ['Wireframes erstellt \u2713', 'Extended Mockup (6 Pages) \u23F3', 'Validation mit Hebammen', 'Design System finalisieren'],
    done: false,
    current: true,
    color: 'var(--g)',
    glow: 'var(--gg)',
  },
  {
    title: 'MVP',
    date: 'geplant 15.04',
    details: ['API Routes bauen', 'Auth + Onboarding', 'Kalender-Modul', 'Basis-Kursmanagement'],
    done: false,
    color: 'var(--tx3)',
  },
  {
    title: 'Beta',
    date: 'geplant 01.05',
    details: ['5-10 Hebammen testen', 'Bug-Fixing', 'Performance-Optimierung', 'Stripe Payment Integration'],
    done: false,
    color: 'var(--tx3)',
  },
  {
    title: 'Launch',
    date: 'geplant 15.05',
    details: ['Public Release', 'Marketing Landingpage', 'App Store Submission', 'Support-Kanal einrichten'],
    done: false,
    color: 'var(--tx3)',
  },
]

const agentItems: AgentItem[] = [
  {
    id: 'build',
    name: 'Build',
    status: 'active',
    colorVar: 'var(--g)',
    glowVar: 'var(--gg)',
    statusLabel: 'Aktiv',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--g)" strokeWidth="1.8" fill="none">
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: 'research',
    name: 'Research',
    status: 'active',
    colorVar: 'var(--p)',
    glowVar: 'var(--pg)',
    statusLabel: 'Aktiv',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--p)" strokeWidth="1.8" fill="none">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    id: 'test',
    name: 'Test',
    status: 'idle',
    colorVar: 'var(--t)',
    glowVar: 'var(--tg)',
    statusLabel: 'Idle',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--t)" strokeWidth="1.8" fill="none">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    id: 'divider',
    name: '',
    status: 'idle',
    colorVar: '',
    glowVar: '',
    statusLabel: '',
    isDividerBefore: true,
    icon: null,
  },
  {
    id: 'docs',
    name: 'Docs',
    status: 'idle',
    colorVar: 'var(--bl)',
    glowVar: 'var(--blg)',
    statusLabel: '4 Files',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--bl)" strokeWidth="1.8" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    id: 'app',
    name: 'App',
    status: 'idle',
    colorVar: 'var(--o)',
    glowVar: 'var(--og)',
    statusLabel: 'Preview',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--o)" strokeWidth="1.8" fill="none">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
]

const terminalLines: TerminalLine[] = [
  { type: 'prompt', prompt: 'kani@hebammenbuero ~$', text: 'analyze mockup structure' },
  { type: 'output', text: '\u2192 Scanning 6 workflow pages...' },
  { type: 'output', text: '\u2192 Found: Onboarding, Konfigurator, Behandlungsplan, Kalender, Kurse, Settings' },
  { type: 'highlight', text: '\u2713 All pages validated \u2014 structure complete' },
  { type: 'blank', text: '\u00A0' },
  { type: 'prompt', prompt: 'kani@hebammenbuero ~$', text: 'build api routes --from mockup' },
  { type: 'output', text: '\u2192 Generating /api/appointments ... ', richText: <><span className="term-output">{'\u2192 Generating /api/appointments ... '}</span><span className="term-highlight">done</span></> },
  { type: 'output', text: '\u2192 Generating /api/patients ... ', richText: <><span className="term-output">{'\u2192 Generating /api/patients ... '}</span><span className="term-highlight">done</span></> },
  { type: 'output', text: '\u2192 Generating /api/courses ... ', richText: <><span className="term-output">{'\u2192 Generating /api/courses ... '}</span><span className="term-warn">in progress</span></> },
  { type: 'blank', text: '\u00A0' },
  { type: 'prompt', prompt: 'kani@hebammenbuero ~$', text: 'status' },
  { type: 'output', text: 'Phase: Mockup (2/5) | Progress: 40%', richText: <><span className="term-output">{'Phase: '}</span><span className="term-highlight">Mockup</span><span className="term-output">{' (2/5) | Progress: '}</span><span className="term-highlight">40%</span></> },
  { type: 'output', text: 'Agents: build-agent (running), research-agent (running)', richText: <><span className="term-output">{'Agents: '}</span><span className="term-highlight">build-agent</span><span className="term-output">{' (running), '}</span><span style={{ color: 'var(--p)' }}>research-agent</span><span className="term-output">{' (running)'}</span></> },
  { type: 'output', text: 'Todos: 12 open, 1 overdue', richText: <><span className="term-output">{'Todos: 12 open, '}</span><span className="term-err">1 overdue</span></> },
  { type: 'output', text: 'Cost: \u20AC8.40 | Runtime: 14 days', richText: <><span className="term-output">{'Cost: '}</span><span style={{ color: 'var(--p)' }}>{'\u20AC8.40'}</span><span className="term-output">{' | Runtime: 14 days'}</span></> },
]

const todoItems: TodoItem[] = [
  {
    title: 'Extended Mockup fertigstellen',
    desc: '6 Deep-Workflow Pages',
    tags: [
      { label: 'Overdue', bg: 'var(--rc)', color: 'var(--r)' },
      { label: 'P0', bg: 'var(--rc)', color: 'var(--r)' },
    ],
    date: '-3d',
    dateColor: 'var(--r)',
  },
  {
    title: 'Validate mit 2-3 Hebammen',
    desc: 'Feedback sammeln, Features priorisieren',
    tags: [
      { label: '05.04', bg: 'var(--ac)', color: 'var(--a)' },
      { label: 'P0', bg: 'var(--ac)', color: 'var(--a)' },
    ],
    date: '05.04',
  },
  {
    title: 'Pricing Tiers definieren',
    desc: 'Starter/Pro/Premium \u2014 Marktvergleich',
    tags: [{ label: 'P1', bg: 'rgba(124,77,255,.06)', color: 'var(--p)' }],
    date: 'P1',
  },
  {
    title: 'Onboarding Flow testen',
    desc: '3-Step Wizard f\u00FCr Erstregistrierung',
    tags: [{ label: 'P1', bg: 'rgba(124,77,255,.06)', color: 'var(--p)' }],
    date: 'P1',
  },
  {
    title: 'Kalender-Sync pr\u00FCfen',
    desc: 'Google/Apple Calendar Integration',
    tags: [{ label: 'P2', bg: 'rgba(124,77,255,.06)', color: 'var(--p)' }],
    date: 'P2',
  },
]

const ideaItems: IdeaItem[] = [
  { text: 'Automatische Terminerinnerung per WhatsApp' },
  { text: 'Rezept-Generator aus Behandlungsplan' },
  { text: 'Video-Call Integration f\u00FCr Fernberatung' },
  { text: 'Multi-Sprach-Support (EN/TR/AR)' },
  { text: 'Krankenkassen-Abrechnung direkt einreichen' },
]

const notifItems: NotifItem[] = [
  {
    label: 'Issues',
    labelColor: 'var(--r)',
    colorVar: 'var(--r)',
    glowVar: 'var(--rg)',
    detail: 'Mockup Overdue 3d',
    detailColor: 'var(--r)',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--r)" strokeWidth="1.8" fill="none">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    label: 'Attention',
    labelColor: 'var(--o)',
    colorVar: 'var(--o)',
    glowVar: 'var(--og)',
    detail: 'Validation Feedback sammeln',
    detailColor: 'var(--o)',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--o)" strokeWidth="1.8" fill="none">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    label: 'Freigabe',
    labelColor: 'var(--g)',
    colorVar: 'var(--g)',
    glowVar: 'var(--gg)',
    detail: 'Mockup Review steht aus',
    detailColor: 'var(--g)',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--g)" strokeWidth="1.8" fill="none">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    label: 'Results',
    labelColor: 'var(--bl)',
    colorVar: 'var(--bl)',
    glowVar: 'var(--blg)',
    detail: 'SEO Audit fertig',
    detailColor: 'var(--bl)',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--bl)" strokeWidth="1.8" fill="none">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
]

const projectTickerItems: TickerItem[] = [
  { agent: 'build-agent', color: 'var(--g)', text: 'kompiliert /api/appointments' },
  { agent: 'build-agent', color: 'var(--g)', text: 'generiert /api/patients Route' },
  { agent: 'research', color: 'var(--p)', text: 'SEO Audit abgeschlossen \u2014 23 Empfehlungen' },
  { agent: 'build', color: 'var(--g)', text: 'TypeScript Check \u2014 0 errors, 2 warnings' },
  { agent: 'kani', color: 'var(--a)', text: 'Mockup Validation Report wird erstellt' },
  { agent: 'test', color: 'var(--t)', text: 'Onboarding Flow: 12/12 Tests bestanden' },
]

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
    sublabel: '4 Files',
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

/* ── Component ────────────────────────────────────────── */

export default function ProjectDetail() {
  const { id } = useParams()
  const [tlOpen, setTlOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('terminal')

  const project = projectsMap[id ?? 'heb'] ?? projectsMap.heb

  return (
    <AppShell
      backLink={{ label: 'Cockpit', href: '/' }}
      title={project.name}
      ledColor={project.ledColor}
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
            <div className="kv" style={{ color: 'var(--g)' }}>{project.progress}%</div>
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
            <div className="kv">{project.openTodos}</div>
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
            <div className="kv" style={{ color: 'var(--bl)' }}>{project.runtime}</div>
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
            <div className="kv" style={{ color: 'var(--p)' }}>{project.cost}</div>
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
            <div className="kv" style={{ color: 'var(--g)' }}>{project.activeAgents}</div>
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
            <span className="tl-pct">Phase 2/5</span>
            <span className="tl-expand">{tlOpen ? '\u25B2 Zuklappen' : '\u25BC Details'}</span>
          </div>

          <div className={`tl-milestone${tlOpen ? ' open' : ''}`}>
            {milestones.map((ms) => (
              <div key={ms.title} className="tl-ms">
                <div
                  className="tl-ms-dot"
                  style={{
                    background: ms.color,
                    ...(ms.glow ? { boxShadow: `0 0 8px ${ms.glow}` } : {}),
                  }}
                />
                <div className="tl-ms-info">
                  <div className="tl-ms-title" style={ms.done || ms.current ? { color: ms.color } : undefined}>
                    {ms.title}
                  </div>
                  <div className="tl-ms-date">{ms.date}</div>
                  <div className="tl-ms-sub">
                    {ms.details.map((d, i) => (
                      <span key={i}>
                        {'\u25CF'} {d}
                        {i < ms.details.length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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
          {agentItems.map((ag) => {
            if (ag.isDividerBefore) {
              return (
                <div
                  key={ag.id}
                  style={{
                    height: 1,
                    margin: '4px 8px',
                    background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)',
                  }}
                />
              )
            }
            return (
              <div
                key={ag.id}
                className="ag-item cf"
                style={{ '--nc': ag.glowVar } as React.CSSProperties}
              >
                <div
                  className="ag-icon btn3d"
                  style={{ '--bc': ag.glowVar, width: 36, height: 36 } as React.CSSProperties}
                >
                  {ag.status === 'active' && (
                    <span
                      className="ag-dot sl"
                      style={{
                        width: 7,
                        height: 7,
                        background: ag.colorVar,
                        '--lc': ag.glowVar,
                        ...(ag.status === 'active' && ag.colorVar === 'var(--g)'
                          ? {}
                          : { animation: 'none' }),
                      } as React.CSSProperties}
                    />
                  )}
                  {ag.icon}
                </div>
                <span className="ag-name">{ag.name}</span>
                <span className="ag-status" style={{ color: ag.status === 'active' ? ag.colorVar : 'var(--tx3)' }}>
                  {ag.statusLabel}
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
                placeholder={`${project.prompt} `}
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
                {project.openTodos} offen
              </span>
            </div>
            <div className="pd-r-list">
              {todoItems.map((todo, i) => (
                <div key={i} className="pd-r-item">
                  <div className="pd-r-chk in" />
                  <div>
                    <div className="r-title">{todo.title}</div>
                    <div className="r-desc">{todo.desc}</div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 3 }}>
                      {todo.tags.map((tag, j) => (
                        <span key={j} className="r-tag" style={{ background: tag.bg, color: tag.color }}>
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="pd-r-date" style={todo.dateColor ? { color: todo.dateColor } : undefined}>
                    {todo.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ideas */}
          <div className="r-card pd-r-card-half cf">
            <div className="r-hdr">
              <span className="st">Ideas</span>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, fontWeight: 600, color: 'var(--tx3)' }}>
                {ideaItems.length} Ideen
              </span>
            </div>
            <div className="pd-r-list">
              {ideaItems.map((idea, i) => (
                <div key={i} className="pd-idea-item">
                  <span style={{ color: 'var(--p)' }}>&#x1F4A1;</span>
                  <span className="pd-idea-text">{idea.text}</span>
                  <span className="pd-idea-del">&#x2715;</span>
                </div>
              ))}
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
          <div className="st" style={{ marginBottom: 10 }}>Notifications &middot; {project.name}</div>
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
                  <b>{project.name}:</b> {n.detail}
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
      <ProjectLiveFeed projectName={project.name} items={projectTickerItems} />
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
