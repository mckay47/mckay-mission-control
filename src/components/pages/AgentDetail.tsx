import { useState } from 'react'
import { useParams } from 'react-router-dom'
import AppShell from '../shared/AppShell'
import QuickAccess from '../shared/QuickAccess'

/* ── Types ────────────────────────────────────────────── */

interface AgentInfo {
  id: string
  name: string
  status: 'active' | 'idle'
  colorVar: string
  glowVar: string
  bgVar: string
  tasks: number
  success: string
  runtime: string
  queue: number
  cost: string
  project: string
  prompt: string
}

interface QueueItem {
  pos: number
  title: string
  project: string
  status: 'active' | 'queue'
}

interface HistoryItem {
  title: string
  desc: string
  success: boolean
}

interface TerminalLine {
  type: 'prompt' | 'output' | 'highlight' | 'warn' | 'err' | 'blank'
  prompt?: string
  text: string
}

interface ConfigItem {
  label: string
  value?: string
  valueColor?: string
  colorVar: string
  glowVar: string
  icon: React.ReactNode
}

interface TickerItem {
  agent: string
  color: string
  text: string
}

/* ── Dummy Data ───────────────────────────────────────── */

const agentsMap: Record<string, AgentInfo> = {
  'build-agent': {
    id: 'build-agent',
    name: 'Build Agent',
    status: 'active',
    colorVar: 'var(--g)',
    glowVar: 'var(--gg)',
    bgVar: 'var(--gc)',
    tasks: 67,
    success: '98%',
    runtime: '18h',
    queue: 3,
    cost: '\u20AC3.20',
    project: 'Hebammenbuero',
    prompt: 'build@hebammenbuero ~$',
  },
  'research-agent': {
    id: 'research-agent',
    name: 'Research Agent',
    status: 'active',
    colorVar: 'var(--p)',
    glowVar: 'var(--pg)',
    bgVar: 'rgba(124,77,255,.06)',
    tasks: 38,
    success: '95%',
    runtime: '12h',
    queue: 1,
    cost: '\u20AC2.40',
    project: 'Steuerberater',
    prompt: 'research@steuerberater ~$',
  },
  'test-agent': {
    id: 'test-agent',
    name: 'Test Agent',
    status: 'active',
    colorVar: 'var(--t)',
    glowVar: 'var(--tg)',
    bgVar: 'var(--tc)',
    tasks: 23,
    success: '100%',
    runtime: '8h',
    queue: 0,
    cost: '\u20AC0.90',
    project: 'TennisCoach',
    prompt: 'test@tenniscoach ~$',
  },
  'deploy-agent': {
    id: 'deploy-agent',
    name: 'Deploy Agent',
    status: 'idle',
    colorVar: 'var(--bl)',
    glowVar: 'var(--blg)',
    bgVar: 'var(--blc)',
    tasks: 14,
    success: '100%',
    runtime: '10h',
    queue: 0,
    cost: '\u20AC0.60',
    project: 'Mission Control',
    prompt: 'deploy@mc ~$',
  },
  'seo-agent': {
    id: 'seo-agent',
    name: 'SEO Agent',
    status: 'idle',
    colorVar: 'var(--a)',
    glowVar: 'var(--ag)',
    bgVar: 'var(--ac)',
    tasks: 8,
    success: '88%',
    runtime: '5h',
    queue: 0,
    cost: '\u20AC0.40',
    project: 'Hebammenbuero',
    prompt: 'seo@hebammenbuero ~$',
  },
}

const terminalLines: TerminalLine[] = [
  { type: 'prompt', prompt: 'build@hebammenbuero ~$', text: 'generate api routes' },
  { type: 'output', text: '\u2192 Reading mockup structure...' },
  { type: 'output', text: '\u2192 Found 6 pages: Onboarding, Konfigurator, Behandlung, Kalender, Kurse, Settings' },
  { type: 'highlight', text: '\u2713 Generating /api/appointments ... done (2.3s)' },
  { type: 'highlight', text: '\u2713 Generating /api/patients ... done (1.8s)' },
  { type: 'warn', text: '\u23F3 Generating /api/courses ... in progress' },
  { type: 'blank', text: '\u00A0' },
  { type: 'output', text: '\u2192 TypeScript Check...' },
  { type: 'highlight', text: '\u2713 0 errors, 2 warnings' },
  { type: 'warn', text: '  \u26A0 Unused import: CalendarView (line 42)' },
  { type: 'warn', text: '  \u26A0 Missing return type: getPatients (line 88)' },
  { type: 'blank', text: '\u00A0' },
  { type: 'output', text: '\u2192 Prisma Schema update...' },
  { type: 'highlight', text: '\u2713 3 new models: Appointment, Patient, Course' },
  { type: 'highlight', text: '\u2713 Migration generated: 20260403_add_core_models' },
]

const queueItems: QueueItem[] = [
  { pos: 1, title: '/api/courses fertigstellen', project: 'Hebammenbuero', status: 'active' },
  { pos: 2, title: '/api/settings Route', project: 'Hebammenbuero', status: 'queue' },
  { pos: 3, title: 'Auth Middleware', project: 'Hebammenbuero', status: 'queue' },
]

const historyItems: HistoryItem[] = [
  { title: '/api/patients', desc: '1.8s \u00B7 Hebammenbuero', success: true },
  { title: '/api/appointments', desc: '2.3s \u00B7 Hebammenbuero', success: true },
  { title: 'Prisma Schema', desc: '3.1s \u00B7 Hebammenbuero', success: true },
  { title: 'Auth Flow', desc: 'Fehler \u00B7 retry 2x', success: false },
  { title: 'DB Migration', desc: '1.2s \u00B7 Hebammenbuero', success: true },
]

const configItems: ConfigItem[] = [
  {
    label: 'Modell',
    value: 'Sonnet',
    valueColor: 'var(--g)',
    colorVar: 'var(--g)',
    glowVar: 'var(--gg)',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--g)" strokeWidth="1.8" fill="none">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
      </svg>
    ),
  },
  {
    label: 'Temp',
    value: '0.3',
    valueColor: 'var(--p)',
    colorVar: 'var(--p)',
    glowVar: 'var(--pg)',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--p)" strokeWidth="1.8" fill="none">
        <path d="M12 20V10" />
        <path d="M18 20V4" />
        <path d="M6 20v-4" />
      </svg>
    ),
  },
  {
    label: 'Tokens',
    value: '8K',
    valueColor: 'var(--bl)',
    colorVar: 'var(--bl)',
    glowVar: 'var(--blg)',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--bl)" strokeWidth="1.8" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
      </svg>
    ),
  },
]

const configItems2: ConfigItem[] = [
  {
    label: 'Projekt',
    value: 'HEB',
    valueColor: 'var(--g)',
    colorVar: 'var(--g)',
    glowVar: 'var(--gg)',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--g)" strokeWidth="1.8" fill="none">
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    colorVar: 'var(--o)',
    glowVar: 'var(--og)',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--o)" strokeWidth="1.8" fill="none">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83" />
      </svg>
    ),
  },
]

/* ── Notification data for agent detail ────────────────── */

interface AgentNotifCategory {
  label: string
  colorVar: string
  glowVar: string
  icon: React.ReactNode
  items: { project: string; text: string }[]
}

const detailNotifCategories: AgentNotifCategory[] = [
  {
    label: 'Issues',
    colorVar: 'var(--r)',
    glowVar: 'var(--rg)',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--r)" strokeWidth="1.8" fill="none">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    items: [{ project: 'Auth Flow', text: '2x fehlgeschlagen' }],
  },
  {
    label: 'Attention',
    colorVar: 'var(--o)',
    glowVar: 'var(--og)',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--o)" strokeWidth="1.8" fill="none">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      </svg>
    ),
    items: [
      { project: 'Queue', text: '3 Tasks wartend' },
      { project: 'Warnings', text: '2 TypeScript' },
    ],
  },
  {
    label: 'Freigabe',
    colorVar: 'var(--g)',
    glowVar: 'var(--gg)',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--g)" strokeWidth="1.8" fill="none">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    items: [{ project: 'Migration', text: 'Deploy bereit' }],
  },
  {
    label: 'Results',
    colorVar: 'var(--bl)',
    glowVar: 'var(--blg)',
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--bl)" strokeWidth="1.8" fill="none">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    items: [
      { project: 'API', text: '2 Routes fertig' },
      { project: 'Schema', text: '3 Models erstellt' },
    ],
  },
]

const tickerItems: TickerItem[] = [
  { agent: 'build', color: 'var(--g)', text: '/api/appointments fertig \u2014 2.3s' },
  { agent: 'build', color: 'var(--g)', text: '/api/patients fertig \u2014 1.8s' },
  { agent: 'build', color: 'var(--a)', text: '/api/courses \u2014 in progress' },
  { agent: 'build', color: 'var(--g)', text: 'TypeScript Check \u2014 0 errors' },
  { agent: 'build', color: 'var(--g)', text: 'Prisma Migration generiert' },
  { agent: 'build', color: 'var(--r)', text: 'Auth Flow \u2014 Fehler, retry' },
]

/* ── Component ────────────────────────────────────────── */

export default function AgentDetail() {
  const { id } = useParams()
  const [activityOpen, setActivityOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'live' | 'log' | 'errors'>('live')

  const agent = agentsMap[id ?? 'build-agent'] ?? agentsMap['build-agent']

  return (
    <AppShell backLink={{ label: 'Agents', href: '/agents' }}>
      {/* Inline header with agent name and status */}
      <div
        style={{
          padding: '0 40px',
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div
          className="sl g"
          style={
            agent.status === 'active'
              ? undefined
              : { background: 'var(--tx3)', animation: 'none' }
          }
        />
        <span style={{ fontSize: 20, fontWeight: 700 }}>{agent.name}</span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 6,
            background: agent.bgVar,
            color: agent.colorVar,
          }}
        >
          {agent.status === 'active' ? '\u25CF Aktiv' : '\u23F8 Idle'}
        </span>
      </div>

      {/* KPI Row */}
      <div className="krow" style={{ gap: 14 }}>
        <div className="kpi cf" style={{ '--kc': 'var(--gg)', padding: '14px 16px' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--gg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--g)">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--g)', fontSize: 20 }}>{agent.tasks}</div>
            <div className="kl" style={{ fontSize: 9 }}>Tasks erledigt</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--gg)', padding: '14px 16px' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--gg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--g)">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--g)', fontSize: 20 }}>{agent.success}</div>
            <div className="kl" style={{ fontSize: 9 }}>Erfolgsrate</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--blg)', padding: '14px 16px' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--blg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--bl)">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--bl)', fontSize: 20 }}>{agent.runtime}</div>
            <div className="kl" style={{ fontSize: 9 }}>Laufzeit gesamt</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--ag)', padding: '14px 16px' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--ag)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--a)">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--a)', fontSize: 20 }}>{agent.queue}</div>
            <div className="kl" style={{ fontSize: 9 }}>Tasks in Queue</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--pg)', padding: '14px 16px' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--pg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--p)">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--p)', fontSize: 20 }}>{agent.cost}</div>
            <div className="kl" style={{ fontSize: 9 }}>API Kosten</div>
          </div>
        </div>
      </div>

      {/* Activity 24h Timeline */}
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
            onClick={() => setActivityOpen((p) => !p)}
          >
            <span className="st" style={{ whiteSpace: 'nowrap' }}>Aktivit\u00E4t 24h</span>
            <div
              className="in"
              style={{
                flex: 1,
                height: 10,
                borderRadius: 5,
                display: 'flex',
                gap: 2,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  flex: 8,
                  height: '100%',
                  borderRadius: 4,
                  background: 'var(--g)',
                }}
              />
              <div
                style={{
                  flex: 1,
                  height: '100%',
                  borderRadius: 4,
                  background: 'var(--r)',
                }}
              />
              <div
                className="sl g"
                style={{
                  flex: 3,
                  height: '100%',
                  borderRadius: 4,
                  background: 'var(--g)',
                  width: 'auto',
                }}
              />
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
              {agent.tasks} Tasks \u00B7 {agent.success}
            </span>
            <span style={{ fontSize: 10, color: 'var(--tx3)', cursor: 'pointer' }}>
              {activityOpen ? '\u25B2' : '\u25BC'}
            </span>
          </div>
          {activityOpen && (
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
                    Erfolgreich (65)
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--tx3)', lineHeight: 1.5 }}>
                    {'\u25CF'} 12 API Routes generiert
                    <br />
                    {'\u25CF'} 8 Prisma Migrations
                    <br />
                    {'\u25CF'} 23 Component Builds
                    <br />
                    {'\u25CF'} 22 TypeScript Checks
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, minWidth: 180 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: 'var(--r)',
                    marginTop: 3,
                    flexShrink: 0,
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--r)' }}>
                    Fehler (2)
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--tx3)', lineHeight: 1.5 }}>
                    {'\u25CF'} Auth Flow — Retry 2x
                    <br />
                    {'\u25CF'} WebSocket Setup — Timeout
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
                    In Progress (3)
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--tx3)', lineHeight: 1.5 }}>
                    {'\u25CF'} /api/courses
                    <br />
                    {'\u25CF'} /api/settings
                    <br />
                    {'\u25CF'} Auth Middleware
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Column Headers */}
      <div className="trow" style={{ gridTemplateColumns: '90px 1fr 380px' }}>
        <span className="st">Config</span>
        <span className="st">Live Output</span>
        <span className="st">Queue & History</span>
      </div>

      {/* 3-Column Main Body */}
      <div className="mbody" style={{ gridTemplateColumns: '90px 1fr 380px', flex: 8 }}>
        {/* Left: Config Nav */}
        <div className="lnav">
          {configItems.map((cfg) => (
            <div
              key={cfg.label}
              className="cfg-item cf"
              style={{ '--nc': cfg.glowVar } as React.CSSProperties}
            >
              <div
                className="btn3d"
                style={{
                  '--bc': cfg.glowVar,
                  width: 36,
                  height: 36,
                } as React.CSSProperties}
              >
                {cfg.icon}
              </div>
              <span className="cfg-name">{cfg.label}</span>
              {cfg.value && (
                <span className="cfg-val" style={{ color: cfg.valueColor }}>
                  {cfg.value}
                </span>
              )}
            </div>
          ))}
          {/* Divider */}
          <div
            style={{
              height: 1,
              margin: '4px 8px',
              background: 'linear-gradient(90deg,transparent,rgba(0,0,0,.06),transparent)',
            }}
          />
          {configItems2.map((cfg) => (
            <div
              key={cfg.label}
              className="cfg-item cf"
              style={{ '--nc': cfg.glowVar } as React.CSSProperties}
            >
              <div
                className="btn3d"
                style={{
                  '--bc': cfg.glowVar,
                  width: 36,
                  height: 36,
                } as React.CSSProperties}
              >
                {cfg.icon}
              </div>
              <span className="cfg-name">{cfg.label}</span>
              {cfg.value && (
                <span className="cfg-val" style={{ color: cfg.valueColor }}>
                  {cfg.value}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Center: Terminal */}
        <div className="center" style={{ overflow: 'hidden', padding: 0 }}>
          <div className="term-card cf">
            <div className="term-header">
              <div style={{ display: 'flex', gap: 6 }}>
                <span
                  className={`term-tab${activeTab === 'live' ? ' active' : ''}`}
                  onClick={() => setActiveTab('live')}
                >
                  Live Output
                </span>
                <span
                  className={`term-tab${activeTab === 'log' ? ' active' : ''}`}
                  onClick={() => setActiveTab('log')}
                >
                  Build Log
                </span>
                <span
                  className={`term-tab${activeTab === 'errors' ? ' active' : ''}`}
                  onClick={() => setActiveTab('errors')}
                >
                  Errors
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div className="sl g" style={{ width: 7, height: 7 }} />
                <span style={{ fontSize: 9, color: 'var(--g)', fontWeight: 600 }}>
                  {agent.status === 'active' ? 'Running' : 'Idle'}
                </span>
              </div>
            </div>
            <div className="term-body">
              {terminalLines.map((line, i) => (
                <div key={i} className="term-line">
                  {line.type === 'prompt' && (
                    <>
                      <span className="term-prompt">{line.prompt ?? agent.prompt}</span>
                      <span>{line.text}</span>
                    </>
                  )}
                  {line.type === 'output' && <span className="term-output">{line.text}</span>}
                  {line.type === 'highlight' && (
                    <span className="term-highlight">{line.text}</span>
                  )}
                  {line.type === 'warn' && <span className="term-warn">{line.text}</span>}
                  {line.type === 'err' && <span className="term-err">{line.text}</span>}
                  {line.type === 'blank' && <span className="term-output">{line.text}</span>}
                </div>
              ))}
            </div>
            <div className="term-input-row">
              <input className="term-input in" placeholder={agent.prompt + ' '} readOnly />
              <button className="term-send">
                <svg viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Queue + History */}
        <div className="right" style={{ gap: 14 }}>
          <div className="r-card cf">
            <div className="r-hdr">
              <span className="st">Queue</span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono'",
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'var(--a)',
                }}
              >
                {agent.queue} wartend
              </span>
            </div>
            <div className="r-list">
              {queueItems.map((item) => (
                <div key={item.pos} className="r-item">
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono'",
                      fontSize: 10,
                      fontWeight: 700,
                      color: item.status === 'active' ? 'var(--a)' : 'var(--tx3)',
                      minWidth: 20,
                    }}
                  >
                    {item.pos}
                  </span>
                  <div>
                    <div className="r-title">{item.title}</div>
                    <div className="r-desc">{item.project}</div>
                  </div>
                  <span
                    className="r-tag"
                    style={{
                      background:
                        item.status === 'active' ? 'var(--ac)' : 'rgba(0,0,0,.04)',
                      color: item.status === 'active' ? 'var(--a)' : 'var(--tx3)',
                    }}
                  >
                    {item.status === 'active' ? 'Aktiv' : 'Queue'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="r-card cf">
            <div className="r-hdr">
              <span className="st">History</span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono'",
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'var(--g)',
                }}
              >
                {agent.tasks} Tasks
              </span>
            </div>
            <div className="r-list">
              {historyItems.map((item, i) => (
                <div key={i} className="r-item">
                  <div
                    className="btn3d"
                    style={{
                      '--bc': item.success ? 'var(--gg)' : 'var(--rg)',
                      width: 28,
                      height: 28,
                    } as React.CSSProperties}
                  >
                    {item.success ? (
                      <svg
                        viewBox="0 0 24 24"
                        width="12"
                        height="12"
                        stroke="var(--g)"
                        strokeWidth="2"
                        fill="none"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        width="12"
                        height="12"
                        stroke="var(--r)"
                        strokeWidth="2"
                        fill="none"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div
                      className="r-title"
                      style={!item.success ? { color: 'var(--r)' } : undefined}
                    >
                      {item.title}
                    </div>
                    <div
                      className="r-desc"
                      style={!item.success ? { color: 'var(--r)' } : undefined}
                    >
                      {item.desc}
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono'",
                      fontSize: 8,
                      color: item.success ? 'var(--g)' : 'var(--r)',
                    }}
                  >
                    {item.success ? '\u2713' : '\u2715'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Notifications + Quick Access */}
      <div
        className="brow"
        style={{ gridTemplateColumns: '90px 1fr 380px', marginTop: 14, flex: 0 }}
      >
        <div />
        <div className="cf" style={{ padding: '16px 20px' }}>
          <div className="st" style={{ marginBottom: 10 }}>
            Notifications \u00B7 {agent.name}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {detailNotifCategories.map((cat) => (
              <div
                key={cat.label}
                style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    className="btn3d"
                    style={{
                      '--bc': cat.glowVar,
                      width: 36,
                      height: 36,
                    } as React.CSSProperties}
                  >
                    {cat.icon}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: cat.colorVar }}>
                    {cat.label}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: 'var(--tx2)',
                    lineHeight: 1.5,
                    marginTop: 4,
                  }}
                >
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
      <div className="ticker-w" style={{ margin: '8px 0 12px' }}>
        <div className="ticker cf" style={{ borderRadius: 22, height: 44 }}>
          <div className="ticker-lbl" style={{ fontSize: 9, padding: '0 16px' }}>
            <span
              className="ticker-ld"
              style={{
                width: 7,
                height: 7,
                background: 'var(--g)',
                boxShadow: '0 0 10px var(--gg)',
              }}
            />
            {agent.name.toUpperCase()}
          </div>
          <div className="ticker-c">
            <div className="ticker-s" style={{ gap: 40, animationDuration: '40s' }}>
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <div key={i} className="ticker-i" style={{ fontSize: 12 }}>
                  <span className="ticker-id" style={{ background: item.color, width: 5, height: 5 }} />
                  <span className="ticker-ia" style={{ color: item.color, fontSize: 11 }}>
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
