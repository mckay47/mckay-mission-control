import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../shared/AppShell'
import Notifications from '../shared/Notifications'
import QuickAccess from '../shared/QuickAccess'
import LiveFeed from '../shared/LiveFeed'

/* ── Dummy Data ─────────────────────────────────────────── */

interface NavItem {
  abbr: string
  name: string
  colorVar: string
  glowVar: string
  ledBg?: string
  ledLc?: string
}

const navItems: NavItem[] = [
  { abbr: 'TA', name: 'Tax Arch.', colorVar: 'var(--ag)', glowVar: 'var(--ag)', ledBg: undefined, ledLc: undefined },
  { abbr: 'GS', name: 'Gastro', colorVar: 'var(--pg)', glowVar: 'var(--pg)', ledBg: 'var(--p)', ledLc: 'var(--pg)' },
  { abbr: 'SH', name: 'SmartH.', colorVar: 'var(--blg)', glowVar: 'var(--blg)', ledBg: 'var(--bl)', ledLc: 'var(--blg)' },
  { abbr: 'MI', name: 'Inbox', colorVar: 'var(--ag)', glowVar: 'var(--ag)', ledBg: undefined, ledLc: undefined },
  { abbr: 'PG', name: 'Playgr.', colorVar: 'var(--ag)', glowVar: 'var(--ag)', ledBg: undefined, ledLc: undefined },
]

interface ProjectCard {
  id: string
  name: string
  status: string
  statusLabel: string
  statusBg: string
  statusColor: string
  ledClass: string
  ledStyle?: React.CSSProperties
  hoverColor: string
  glowColor: string
  agentIcon: React.ReactNode
  agentLabel: string
  agentColor?: string
  phaseDone: number
  phaseTotal: number
  phaseColor: string
  phaseGlow: string
  pct: number
  barColor: string
  barGlow: string
  footLabel: string
  footValue: string
  idle?: boolean
}

const projects: ProjectCard[] = [
  {
    id: 'heb',
    name: 'Hebammenbuero',
    status: 'active',
    statusLabel: '\u25CF Aktiv',
    statusBg: 'var(--gc)',
    statusColor: 'var(--g)',
    ledClass: 'sl g',
    hoverColor: 'var(--gg)',
    glowColor: 'var(--gu)',
    agentIcon: (
      <svg viewBox="0 0 24 24" width="10" height="10" stroke="var(--g)" strokeWidth="2" fill="none" style={{ filter: 'drop-shadow(0 0 3px var(--gg))' }}>
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    agentLabel: 'build-agent',
    phaseDone: 1,
    phaseTotal: 5,
    phaseColor: 'var(--g)',
    phaseGlow: 'var(--gg)',
    pct: 40,
    barColor: 'var(--g)',
    barGlow: 'var(--gg)',
    footLabel: 'Todos',
    footValue: '12',
  },
  {
    id: 'mc',
    name: 'Mission Control',
    status: 'active',
    statusLabel: '\u25CF Aktiv',
    statusBg: 'var(--gc)',
    statusColor: 'var(--g)',
    ledClass: 'sl g',
    hoverColor: 'var(--gg)',
    glowColor: 'var(--gu)',
    agentIcon: (
      <svg viewBox="0 0 24 24" width="10" height="10" stroke="var(--g)" strokeWidth="2" fill="none" style={{ filter: 'drop-shadow(0 0 3px var(--gg))' }}>
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    agentLabel: 'build-agent',
    phaseDone: 2,
    phaseTotal: 3,
    phaseColor: 'var(--g)',
    phaseGlow: 'var(--gg)',
    pct: 67,
    barColor: 'var(--g)',
    barGlow: 'var(--gg)',
    footLabel: 'Todos',
    footValue: '8',
  },
  {
    id: 'tc',
    name: 'TennisCoach Pro',
    status: 'active',
    statusLabel: '\u25CF Aktiv',
    statusBg: 'var(--tc)',
    statusColor: 'var(--t)',
    ledClass: 'sl g',
    ledStyle: { background: 'var(--t)', ['--lc' as string]: 'var(--tg)', animation: 'none' },
    hoverColor: 'var(--tg)',
    glowColor: 'var(--tu)',
    agentIcon: (
      <svg viewBox="0 0 24 24" width="10" height="10" stroke="var(--tx3)" strokeWidth="2" fill="none" opacity={0.4}>
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    agentLabel: 'kein Agent',
    phaseDone: 4,
    phaseTotal: 5,
    phaseColor: 'var(--t)',
    phaseGlow: 'var(--tg)',
    pct: 80,
    barColor: 'var(--t)',
    barGlow: 'var(--tg)',
    footLabel: 'Todos',
    footValue: '3',
  },
  {
    id: 'stl',
    name: 'Stillprobleme',
    status: 'blocked',
    statusLabel: '\u26A0 Blocked',
    statusBg: 'var(--rc)',
    statusColor: 'var(--r)',
    ledClass: 'sl r',
    hoverColor: 'var(--rg)',
    glowColor: 'var(--ru)',
    agentIcon: (
      <svg viewBox="0 0 24 24" width="10" height="10" stroke="var(--r)" strokeWidth="2" fill="none">
        <circle cx="12" cy="12" r="10" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      </svg>
    ),
    agentLabel: 'Credentials',
    agentColor: 'var(--r)',
    phaseDone: 1,
    phaseTotal: 5,
    phaseColor: 'var(--r)',
    phaseGlow: 'var(--rg)',
    pct: 23,
    barColor: 'var(--r)',
    barGlow: 'var(--rg)',
    footLabel: 'Todos',
    footValue: '4',
  },
  {
    id: 'fmh',
    name: 'FindeMeineHebamme',
    status: 'live',
    statusLabel: '\u2605 Live',
    statusBg: 'var(--blc)',
    statusColor: 'var(--bl)',
    ledClass: 'sl b',
    hoverColor: 'var(--blg)',
    glowColor: 'var(--blu)',
    agentIcon: (
      <svg viewBox="0 0 24 24" width="10" height="10" stroke="var(--bl)" strokeWidth="2" fill="none" style={{ filter: 'drop-shadow(0 0 3px var(--blg))' }}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    agentLabel: '\u20AC340/mo',
    phaseDone: 5,
    phaseTotal: 5,
    phaseColor: 'var(--bl)',
    phaseGlow: 'var(--blg)',
    pct: 100,
    barColor: 'var(--bl)',
    barGlow: 'var(--blg)',
    footLabel: 'Verm.',
    footValue: '~100',
  },
  {
    id: 'fmh2',
    name: 'FMH v2',
    status: 'pause',
    statusLabel: '\u23F8 Pause',
    statusBg: 'var(--ac)',
    statusColor: 'var(--a)',
    ledClass: 'sl a',
    ledStyle: { animation: 'none' },
    hoverColor: 'var(--ag)',
    glowColor: 'var(--au)',
    agentIcon: (
      <svg viewBox="0 0 24 24" width="10" height="10" stroke="var(--a)" strokeWidth="2" fill="none">
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
      </svg>
    ),
    agentLabel: 'Feedback',
    phaseDone: 1,
    phaseTotal: 4,
    phaseColor: 'var(--a)',
    phaseGlow: 'var(--ag)',
    pct: 15,
    barColor: 'var(--a)',
    barGlow: 'var(--ag)',
    footLabel: 'Todos',
    footValue: '2',
  },
  {
    id: 'stb',
    name: 'Steuerberater SaaS',
    status: 'idle',
    statusLabel: 'Idle',
    statusBg: 'rgba(0,0,0,0.04)',
    statusColor: 'var(--tx3)',
    ledClass: 'sl off',
    ledStyle: { width: 8, height: 8 },
    hoverColor: 'transparent',
    glowColor: 'transparent',
    agentIcon: null,
    agentLabel: 'Nicht gestartet',
    phaseDone: 0,
    phaseTotal: 3,
    phaseColor: 'var(--bg)',
    phaseGlow: 'transparent',
    pct: 0,
    barColor: 'transparent',
    barGlow: 'transparent',
    footLabel: 'Todos',
    footValue: '0',
    idle: true,
  },
  {
    id: 'immo',
    name: 'Immobilien App',
    status: 'idle',
    statusLabel: 'Idle',
    statusBg: 'rgba(0,0,0,0.04)',
    statusColor: 'var(--tx3)',
    ledClass: 'sl off',
    ledStyle: { width: 8, height: 8 },
    hoverColor: 'transparent',
    glowColor: 'transparent',
    agentIcon: null,
    agentLabel: 'Nicht gestartet',
    phaseDone: 0,
    phaseTotal: 4,
    phaseColor: 'var(--bg)',
    phaseGlow: 'transparent',
    pct: 0,
    barColor: 'transparent',
    barGlow: 'transparent',
    footLabel: 'Todos',
    footValue: '0',
    idle: true,
  },
  {
    id: 'fit',
    name: 'Fitness Tracker',
    status: 'idle',
    statusLabel: 'Idle',
    statusBg: 'rgba(0,0,0,0.04)',
    statusColor: 'var(--tx3)',
    ledClass: 'sl off',
    ledStyle: { width: 8, height: 8 },
    hoverColor: 'transparent',
    glowColor: 'transparent',
    agentIcon: null,
    agentLabel: 'Nicht gestartet',
    phaseDone: 0,
    phaseTotal: 5,
    phaseColor: 'var(--bg)',
    phaseGlow: 'transparent',
    pct: 0,
    barColor: 'transparent',
    barGlow: 'transparent',
    footLabel: 'Todos',
    footValue: '0',
    idle: true,
  },
]

interface PipelineGroup {
  color: string
  glow: string
  label: string
  count: number
  items: string[]
}

const pipelineGroups: PipelineGroup[] = [
  { color: 'var(--g)', glow: 'var(--gg)', label: 'Aktiv', count: 3, items: ['Hebammenbuero \u2014 40%', 'Mission Control \u2014 67%', 'TennisCoach Pro \u2014 80%'] },
  { color: 'var(--r)', glow: 'var(--rg)', label: 'Blocked', count: 1, items: ['Stillprobleme \u2014 API Credentials'] },
  { color: 'var(--bl)', glow: 'var(--blg)', label: 'Live', count: 1, items: ['FindeMeineHebamme \u2014 100%'] },
  { color: 'var(--a)', glow: 'var(--ag)', label: 'Pause', count: 1, items: ['FMH v2 \u2014 Feedback'] },
  { color: 'var(--tx3)', glow: 'transparent', label: 'Idle', count: 3, items: ['Steuerberater SaaS', 'Immobilien App', 'Fitness Tracker'] },
]

interface TodoFilter {
  label: string
  count: number
  bgColor?: string
  textColor?: string
}

const todoFilters: TodoFilter[] = [
  { label: 'Alle', count: 42 },
  { label: 'Hebammen', count: 12, bgColor: 'rgba(0,200,83,.1)', textColor: 'var(--g)' },
  { label: 'MC', count: 8, bgColor: 'rgba(0,200,83,.1)', textColor: 'var(--g)' },
  { label: 'Tennis', count: 3, bgColor: 'rgba(0,191,165,.1)', textColor: 'var(--t)' },
  { label: 'Still', count: 4, bgColor: 'rgba(255,61,61,.1)', textColor: 'var(--r)' },
]

interface TodoItem {
  title: string
  titleColor?: string
  desc: string
  impactDots: { color: string }[]
  impactLabel: string
  impactLabelColor?: string
  projectDotColor: string
  projectDotGlow: string
  projectLabel: string
  projectLabelColor?: string
  tag: string
  tagBg: string
  tagColor: string
  date: string
  dateColor?: string
  prio: string
  prioBg: string
  prioColor: string
}

const todoItems: TodoItem[] = [
  {
    title: 'Extended Mockup fertigstellen',
    desc: '6 Deep-Workflow Pages f\u00FCr Hebammenbuero',
    impactDots: [
      { color: 'var(--r)' }, { color: 'var(--r)' }, { color: 'var(--r)' }, { color: 'var(--r)' }, { color: 'var(--r)' },
    ],
    impactLabel: 'Blockiert Validation',
    projectDotColor: 'var(--g)',
    projectDotGlow: 'var(--gg)',
    projectLabel: 'Hebammen',
    tag: 'Overdue',
    tagBg: 'var(--rc)',
    tagColor: 'var(--r)',
    date: '-3d',
    dateColor: 'var(--r)',
    prio: 'P0',
    prioBg: 'var(--rc)',
    prioColor: 'var(--r)',
  },
  {
    title: 'Cockpit Layout redesignen',
    desc: 'Neumorphic Design, Projekt-Kacheln, Todo-Sidebar',
    impactDots: [
      { color: 'var(--a)' }, { color: 'var(--a)' }, { color: 'var(--a)' }, { color: 'var(--a)' }, { color: 'var(--bg)' },
    ],
    impactLabel: 'T\u00E4glicher Workflow',
    projectDotColor: 'var(--g)',
    projectDotGlow: 'var(--gg)',
    projectLabel: 'MC',
    tag: 'Heute',
    tagBg: 'var(--gc)',
    tagColor: 'var(--g)',
    date: 'Heute',
    prio: 'P0',
    prioBg: 'var(--gc)',
    prioColor: 'var(--g)',
  },
  {
    title: 'API-Daten statt Dummy',
    desc: 'API Key einrichten, alle Fake-Inhalte entfernen',
    impactDots: [
      { color: 'var(--a)' }, { color: 'var(--a)' }, { color: 'var(--a)' }, { color: 'var(--a)' }, { color: 'var(--bg)' },
    ],
    impactLabel: 'System wird ehrlich',
    projectDotColor: 'var(--g)',
    projectDotGlow: 'var(--gg)',
    projectLabel: 'MC',
    tag: 'Heute',
    tagBg: 'var(--gc)',
    tagColor: 'var(--g)',
    date: 'Heute',
    prio: 'P0',
    prioBg: 'var(--gc)',
    prioColor: 'var(--g)',
  },
  {
    title: 'Mockup mit Hebammen validieren',
    desc: '2-3 Hebammen kontaktieren, Feedback sammeln',
    impactDots: [
      { color: 'var(--g)' }, { color: 'var(--g)' }, { color: 'var(--g)' }, { color: 'var(--bg)' }, { color: 'var(--bg)' },
    ],
    impactLabel: 'Produktrichtung',
    projectDotColor: 'var(--g)',
    projectDotGlow: 'var(--gg)',
    projectLabel: 'Hebammen',
    tag: '05.04',
    tagBg: 'var(--ac)',
    tagColor: 'var(--a)',
    date: '05.04',
    prio: 'P0',
    prioBg: 'var(--ac)',
    prioColor: 'var(--a)',
  },
  {
    title: 'API Credentials beschaffen',
    titleColor: 'var(--r)',
    desc: 'Provider-Zugangsdaten fehlen \u2014 Projekt blockiert',
    impactDots: [
      { color: 'var(--r)' }, { color: 'var(--r)' }, { color: 'var(--r)' }, { color: 'var(--r)' }, { color: 'var(--r)' },
    ],
    impactLabel: 'Projekt blockiert',
    impactLabelColor: 'var(--r)',
    projectDotColor: 'var(--r)',
    projectDotGlow: 'var(--rg)',
    projectLabel: 'Stillprobleme',
    projectLabelColor: 'var(--r)',
    tag: 'Blocker',
    tagBg: 'var(--rc)',
    tagColor: 'var(--r)',
    date: '-3d',
    dateColor: 'var(--r)',
    prio: 'P0',
    prioBg: 'var(--rc)',
    prioColor: 'var(--r)',
  },
  {
    title: 'Stripe Payment aufsetzen',
    desc: 'Subscription: Starter/Pro/Enterprise',
    impactDots: [
      { color: 'var(--p)' }, { color: 'var(--p)' }, { color: 'var(--p)' }, { color: 'var(--p)' }, { color: 'var(--bg)' },
    ],
    impactLabel: 'Monetarisierung',
    projectDotColor: 'var(--t)',
    projectDotGlow: 'var(--tg)',
    projectLabel: 'TennisCoach',
    tag: 'P1',
    tagBg: 'rgba(124,77,255,.06)',
    tagColor: 'var(--p)',
    date: '10.04',
    prio: 'P1',
    prioBg: 'rgba(124,77,255,.06)',
    prioColor: 'var(--p)',
  },
]

/* ── Component ──────────────────────────────────────────── */

export default function Cockpit() {
  const navigate = useNavigate()
  const [pipelineOpen, setPipelineOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState(0)

  return (
    <AppShell>
      {/* ── KPI ROW ── */}
      <div className="krow">
        {/* Aktiv */}
        <div className="kpi cf" style={{ '--kc': 'var(--gg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--gg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--g)">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--g)' }}>3</div>
            <div className="kl">Aktiv</div>
          </div>
        </div>

        {/* Blocked */}
        <div className="kpi cf" style={{ '--kc': 'var(--rg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--rg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--r)">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--r)' }}>1</div>
            <div className="kl">Blocked</div>
          </div>
        </div>

        {/* Todos */}
        <div className="kpi cf" style={{ '--kc': 'var(--ag)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--ag)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--a)">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
            </svg>
          </div>
          <div>
            <div className="kv">42</div>
            <div className="kl">Todos</div>
          </div>
          <span className="kx" style={{ background: 'var(--rc)', color: 'var(--r)' }}>3 overdue</span>
        </div>

        {/* Terminals */}
        <div className="kpi cf" style={{ '--kc': 'var(--blg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--blg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--bl)">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--bl)' }}>2</div>
            <div className="kl">Terminals</div>
          </div>
        </div>

        {/* Capture */}
        <div className="capc cf" style={{ '--kc': 'var(--pg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--pg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--p)">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <input className="in" placeholder="Schnelle Idee festhalten..." />
          <button>Capture</button>
        </div>
      </div>

      {/* ── PIPELINE BAR ── */}
      <div style={{ padding: '0 40px', marginBottom: 12, flexShrink: 0 }}>
        <div className="cf" style={{ overflow: 'hidden' }}>
          {/* Collapsed bar */}
          <div
            style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', transition: 'all .3s' }}
            onClick={() => setPipelineOpen((p) => !p)}
          >
            <span className="st" style={{ whiteSpace: 'nowrap' }}>Projekt Status</span>
            <div className="in" style={{ flex: 1, height: 10, borderRadius: 5, display: 'flex', gap: 3, overflow: 'hidden' }}>
              <div style={{ flex: 3, height: '100%', borderRadius: 4, background: 'var(--g)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,.8)' }}>3</div>
              <div style={{ flex: 1, height: '100%', borderRadius: 4, background: 'var(--r)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,.8)' }}>1</div>
              <div style={{ flex: 1, height: '100%', borderRadius: 4, background: 'var(--bl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,.8)' }}>1</div>
              <div style={{ flex: 1, height: '100%', borderRadius: 4, background: 'var(--a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,.8)' }}>1</div>
              <div style={{ flex: 3, height: '100%', borderRadius: 4, background: 'var(--tx3)', opacity: 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,.6)' }}>3</div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: 'var(--g)', whiteSpace: 'nowrap' }}>9 Projekte</span>
            <span className="plx" style={{ fontSize: 10, color: 'var(--tx3)', cursor: 'pointer' }}>{pipelineOpen ? '\u25B2' : '\u25BC'}</span>
          </div>

          {/* Expanded detail */}
          {pipelineOpen && (
            <div style={{ display: 'flex', padding: '14px 22px 18px', borderTop: '1px solid rgba(0,0,0,.04)', marginTop: 10, gap: 24, flexWrap: 'wrap' }}>
              {pipelineGroups.map((group) => (
                <div key={group.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, minWidth: 160 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: group.color,
                    boxShadow: group.glow !== 'transparent' ? `0 0 8px ${group.glow}` : undefined,
                    opacity: group.label === 'Idle' ? 0.5 : 1,
                    marginTop: 3, flexShrink: 0,
                  }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: group.color }}>
                      {group.label} ({group.count})
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--tx3)', lineHeight: 1.5 }}>
                      {group.items.map((item, i) => (
                        <span key={i}>
                          {'\u25CF'} {item}
                          {i < group.items.length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION TITLES ── */}
      <div className="trow">
        <span className="st">Weitere</span>
        <span className="st">Projekte</span>
        <span className="st">Todos</span>
      </div>

      {/* ── MAIN BODY (3-col) ── */}
      <div className="mbody">
        {/* Left Nav */}
        <div className="lnav">
          {navItems.map((item) => (
            <div key={item.abbr} className="ni cf" style={{ '--nc': item.colorVar } as React.CSSProperties}>
              <span
                className={`ni-dot sl ${item.ledBg ? '' : 'a'}`}
                style={{
                  width: 8, height: 8, animation: 'none',
                  ...(item.ledBg ? { background: item.ledBg, ['--lc' as string]: item.ledLc } : {}),
                }}
              />
              <span className="ni-l">{item.abbr}</span>
              <span className="ni-n">{item.name}</span>
            </div>
          ))}
          {/* Divider */}
          <div style={{ height: 1, margin: '4px 12px', background: 'linear-gradient(90deg,transparent,rgba(0,0,0,.06),transparent)' }} />
          {/* More */}
          <div className="ni cf" style={{ opacity: 0.4 }}>
            <span className="ni-l" style={{ fontSize: 12, color: 'var(--tx3)' }}>{'\u2022\u2022\u2022'}</span>
            <span className="ni-n">Mehr</span>
          </div>
          {/* Neu */}
          <div className="ni cf" style={{ opacity: 0.6 }}>
            <span className="ni-l" style={{ fontSize: 20, color: 'var(--tx3)' }}>+</span>
            <span className="ni-n">Neu</span>
          </div>
        </div>

        {/* Project Grid 3x3 */}
        <div className="center">
          <div className="pgrid">
            {projects.map((p) => {
              if (p.idle) {
                return (
                  <div
                    key={p.id}
                    className="pt cf"
                    style={{ opacity: 0.3, cursor: 'pointer' }}
                    onClick={() => navigate(`/projekte/${p.id}`)}
                  >
                    <div className="pt-top">
                      <div className={p.ledClass} style={p.ledStyle} />
                      <span className="pt-bdg" style={{ background: p.statusBg, color: p.statusColor }}>{p.statusLabel}</span>
                    </div>
                    <div className="pt-nm" style={{ color: 'var(--tx3)' }}>{p.name}</div>
                    <div className="pt-ag" style={{ opacity: 0.5 }}>{p.agentLabel}</div>
                    <div className="phr">
                      <span className="phl">Phase</span>
                      <div className="phd">
                        {Array.from({ length: p.phaseTotal }).map((_, i) => (
                          <div key={i} className="pd in" style={{ background: 'var(--bg)' }} />
                        ))}
                      </div>
                      <span className="phl">{p.phaseDone}/{p.phaseTotal}</span>
                    </div>
                    <div className="pt-pr">
                      <div className="pt-b in">
                        <div className="pt-f" style={{ width: '0%' }} />
                      </div>
                      <span className="pt-pc" style={{ color: 'var(--tx3)' }}>0%</span>
                    </div>
                    <div className="pt-ft">
                      <span className="pt-td"><strong>{p.footValue}</strong> {p.footLabel}</span>
                      <span className="pt-ar">{'\u2192'}</span>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={p.id}
                  className="cgw"
                  style={{ '--gc2': p.glowColor } as React.CSSProperties}
                  onClick={() => navigate(`/projekte/${p.id}`)}
                >
                  <div className="pt cf" style={{ '--hc': p.hoverColor } as React.CSSProperties}>
                    <div className="pt-top">
                      <div className={p.ledClass} style={p.ledStyle} />
                      <span className="pt-bdg" style={{ background: p.statusBg, color: p.statusColor }}>{p.statusLabel}</span>
                    </div>
                    <div className="pt-nm">{p.name}</div>
                    <div className="pt-ag" style={p.agentColor ? { color: p.agentColor } : undefined}>
                      {p.agentIcon}
                      {p.agentLabel}
                    </div>
                    <div className="phr">
                      <span className="phl">Phase</span>
                      <div className="phd">
                        {Array.from({ length: p.phaseTotal }).map((_, i) => (
                          <div
                            key={i}
                            className={`pd in${i < p.phaseDone ? ' done' : ''}`}
                            style={{
                              background: i < p.phaseDone ? p.phaseColor : 'var(--bg)',
                              ['--pc' as string]: i < p.phaseDone ? p.phaseGlow : undefined,
                            }}
                          />
                        ))}
                      </div>
                      <span className="phl" style={{ color: 'var(--tx2)' }}>{p.phaseDone}/{p.phaseTotal}</span>
                    </div>
                    <div className="pt-pr">
                      <div className="pt-b in">
                        <div
                          className="pt-f"
                          style={{
                            width: `${p.pct}%`,
                            background: p.barColor,
                            ['--b2' as string]: p.barGlow,
                          }}
                        />
                      </div>
                      <span className="pt-pc" style={{ color: p.statusColor }}>{p.pct}%</span>
                    </div>
                    <div className="pt-ft">
                      <span className="pt-td"><strong>{p.footValue}</strong> {p.footLabel}</span>
                      <span className="pt-ar">{'\u2192'}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Todos Sidebar */}
        <div className="right">
          <div className="todos cf">
            <div className="t-hdr">
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>42 offen</span>
            </div>
            <div className="t-flt">
              {todoFilters.map((f, i) => (
                <button
                  key={f.label}
                  className={`fb${i === activeFilter ? ' active' : ''}`}
                  onClick={() => setActiveFilter(i)}
                >
                  {f.label}{' '}
                  <span
                    className="fc"
                    style={f.bgColor ? { background: f.bgColor, color: f.textColor } : undefined}
                  >
                    {f.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="t-list">
              {todoItems.map((todo, i) => (
                <div key={i} className="tc">
                  <div className="tck in" />
                  <div className="tb">
                    <div className="tt" style={todo.titleColor ? { color: todo.titleColor } : undefined}>{todo.title}</div>
                    <div className="td2">{todo.desc}</div>
                    <div className="ti">
                      Impact:
                      <div className="ti-b">
                        {todo.impactDots.map((dot, di) => (
                          <div key={di} className="ti-d" style={{ background: dot.color }} />
                        ))}
                      </div>
                      <span style={todo.impactLabelColor ? { color: todo.impactLabelColor } : undefined}>{todo.impactLabel}</span>
                    </div>
                    <div className="ttg">
                      <span className="tpd" style={{ background: todo.projectDotColor, boxShadow: `0 0 4px ${todo.projectDotGlow}` }} />
                      <span style={{ fontSize: 8, color: todo.projectLabelColor || 'var(--tx3)' }}>{todo.projectLabel}</span>
                      <span className="tg" style={{ background: todo.tagBg, color: todo.tagColor }}>{todo.tag}</span>
                    </div>
                  </div>
                  <div className="tr">
                    <span className="tdt" style={todo.dateColor ? { color: todo.dateColor } : undefined}>{todo.date}</span>
                    <span className="tpb" style={{ background: todo.prioBg, color: todo.prioColor }}>{todo.prio}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Bottom fade + "more" link */}
            <div style={{ padding: '8px 16px 14px', textAlign: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -30, left: 0, right: 0, height: 30, background: 'linear-gradient(transparent,var(--sf))', pointerEvents: 'none' }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--p)', cursor: 'pointer' }}>+ 36 weitere Todos anzeigen</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW (3-col) ── */}
      <div className="brow">
        <div />
        <Notifications />
        <QuickAccess />
      </div>

      {/* ── LIVE FEED ── */}
      <LiveFeed />
    </AppShell>
  )
}
