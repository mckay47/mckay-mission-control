import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Activity, Bot, Puzzle, Settings, FileText, Moon } from 'lucide-react'
import { StampButton } from '../../shared/StampButton.tsx'
import { Clock } from '../../shared/Clock.tsx'
import { SplitLayout } from '../../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText, TcStatRow, TcStat } from '../../shared/PreviewPanel.tsx'
import { BottomTicker } from '../../shared/BottomTicker.tsx'
import { Terminal } from '../../shared/Terminal.tsx'
import { Pipeline } from '../../shared/Pipeline.tsx'
import { useMissionControl } from '../../../lib/MissionControlProvider.tsx'

interface Props { toggleTheme: () => void }

const deptAgents: Record<string, string[]> = {
  buchhaltung: ['KANI Master', 'Ops Agent'],
  email: ['KANI Master', 'Sales Agent'],
  marketing: ['Sales Agent', 'Research Agent'],
  hr: ['KANI Master'],
  partners: ['Strategy Agent', 'Sales Agent'],
}

const deptSkills: Record<string, string[]> = {
  buchhaltung: ['Belegerfassung', 'USt-Voranmeldung', 'Mahnwesen', 'Reporting'],
  email: ['Kategorisierung', 'Auto-Reply Drafts', 'Follow-up Tracking', 'Spam-Filter'],
  marketing: ['Content Creation', 'Social Media', 'SEO', 'Analytics'],
  hr: ['Vertragsmanagement', 'Recruiting', 'Onboarding', 'Freelancer-Pool'],
  partners: ['Partner-Scouting', 'Verhandlung', 'Integration', 'Co-Marketing'],
}

const deptConfig: Record<string, { key: string; value: string }[]> = {
  buchhaltung: [
    { key: 'Automation', value: 'Zero-Touch Ziel Q3' },
    { key: 'Steuerberater', value: 'Sync aktiv' },
    { key: 'Belege', value: 'Auto-Erfassung' },
  ],
  email: [
    { key: 'Methode', value: 'Inbox Zero' },
    { key: 'Antwortzeit', value: '< 4h (wichtig)' },
    { key: 'Taeglich', value: 'Inbox Zero bis 18:00' },
  ],
  marketing: [
    { key: 'Hauptkanal', value: 'LinkedIn' },
    { key: 'Content', value: '2 Artikel/Woche' },
    { key: 'Newsletter', value: '1x/Woche' },
  ],
  hr: [
    { key: 'Team', value: 'Lean + Freelancer' },
    { key: 'Onboarding', value: '< 24h' },
    { key: 'Vertraege', value: 'Digital signiert' },
  ],
  partners: [
    { key: 'Ziel', value: '3 Partner bis Q2' },
    { key: 'Modell', value: 'Revenue-Share' },
    { key: 'Fokus', value: 'SaaS + Agenturen' },
  ],
}


const quickActions = [
  { label: 'Status', icon: Activity, color: 'var(--g)', border: 'var(--g)' },
  { label: 'Agents', icon: Bot, color: 'var(--bl)', border: 'var(--bl)' },
  { label: 'Skills', icon: Puzzle, color: 'var(--a)', border: 'var(--a)' },
  { label: 'Config', icon: Settings, color: 'var(--p)', border: 'var(--p)' },
  { label: 'Report', icon: FileText, color: 'var(--t)', border: 'var(--t)' },
]

export function DepartmentDetail({ toggleTheme }: Props) {
  const { departments, tickerData, departmentPipelines } = useMissionControl()
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const [tab, setTab] = useState(0)

  const dept = departments.find(d => d.id === id)
  if (!dept) {
    return (
      <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--tx3)' }}>Department nicht gefunden</div>
        <button className="open-btn" style={{ marginTop: 20 }} onClick={() => nav('/system/departments')}>Zurueck zu Departments</button>
      </div>
    )
  }

  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null)

  const deptMilestones = departmentPipelines[dept.id] || []
  const pipeline = deptMilestones.length > 0 ? (
    <Pipeline label="Status" milestones={deptMilestones} summary={`${deptMilestones.filter(m => m.status === 'done').length}/${deptMilestones.length}`} />
  ) : undefined

  const tabs = [
    {
      label: 'Next Actions',
      content: (
        <>
          <TcLabel>Suggested Actions</TcLabel>
          {[
            { title: 'Status pruefen', prompt: `kani dept ${dept.id} --status` },
            { title: 'Tasks anzeigen', prompt: `kani dept ${dept.id} --tasks` },
            { title: 'Report erstellen', prompt: `kani dept ${dept.id} --report` },
          ].map((s, i) => (
            <div key={i} className="ghost-card" style={{ padding: '8px 12px', gap: 0, cursor: 'pointer', '--hc': dept.glow, flexDirection: 'row', alignItems: 'center' } as React.CSSProperties}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: dept.colorBg, color: dept.color, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', marginLeft: 10, flex: 1 }}>{s.title}</span>
            </div>
          ))}
          <TcLabel>Assigned Agents</TcLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(deptAgents[dept.id] || []).map((a, i) => (
              <div key={i} className="ghost-card" style={{ padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, color: 'var(--tx2)', display: 'flex', alignItems: 'center', gap: 10, '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: dept.color, flexShrink: 0 }} />
                {a}
              </div>
            ))}
            {(deptAgents[dept.id] || []).length === 0 && <TcText>Keine Agents zugewiesen</TcText>}
          </div>
        </>
      ),
    },
    {
      label: 'Skills',
      content: (
        <>
          <TcLabel>Department Skills</TcLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(deptSkills[dept.id] || []).map((s, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: '6px 14px', borderRadius: 10, background: dept.colorBg, color: dept.color }}>
                {s}
              </span>
            ))}
          </div>
          <TcLabel>Configuration</TcLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(deptConfig[dept.id] || []).map((c, i) => (
              <div key={i} className="ghost-card" style={{ padding: '12px 16px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)' }}>{c.key}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: dept.color }}>{c.value}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      label: 'KPI',
      content: (
        <>
          <TcLabel>Department Metrics</TcLabel>
          <TcStatRow>
            {(dept.kpis || []).map((k, i) => (
              <TcStat key={i} value={k.value} label={k.label} color={k.color} />
            ))}
          </TcStatRow>
          <TcLabel>Tasks</TcLabel>
          <TcStatRow>
            <TcStat value={dept.tasks ?? 0} label="Offen" color={dept.color} />
          </TcStatRow>
        </>
      ),
    },
    {
      label: 'Briefing',
      content: (
        <>
          <div style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 12 }}>
              <strong style={{ color: 'var(--tx)' }}>{dept.name}</strong> — {dept.description}
            </p>
            <p style={{ marginBottom: 12 }}>
              Agents: {(deptAgents[dept.id] || []).join(', ') || 'Keine'}
            </p>
            <p style={{ marginBottom: 12 }}>
              Skills: {(deptSkills[dept.id] || []).join(', ') || 'Keine'}
            </p>
            <p>
              Config: {(deptConfig[dept.id] || []).map(c => `${c.key}: ${c.value}`).join(' | ')}
            </p>
          </div>
        </>
      ),
    },
  ]

  return (
    <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '24px 0', flexShrink: 0, gap: 20 }}>
        <StampButton />
        <Clock />
        <div className="ghost-btn" style={{ '--bc': 'rgba(255,255,255,0.06)' } as React.CSSProperties} onClick={toggleTheme}>
          <Moon size={20} stroke="var(--tx3)" />
        </div>
      </div>

      <SplitLayout
        ratio="50% 50%"
        left={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
            <div className="st" style={{ padding: '0 2px' }}>Terminal</div>
            <Terminal
              title={`${dept.id} — department`}
              statusLabel={dept.badge?.label ?? ''}
              statusColor={dept.color}
              statusGlow={dept.glow}
              placeholder={`kani dept ${dept.id} → ...`}
              mode="live"
              cwd="~/mckay-os/"
              terminalId={`dept:${dept.id}`}
              inputValue={pendingPrompt || undefined}
              onInputChange={(v) => setPendingPrompt(v || null)}
              onClearInput={() => setPendingPrompt(null)}
              onSend={() => setPendingPrompt(null)}
            />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '4px 0' }}>
              {quickActions.map((qa, i) => {
                const Icon = qa.icon
                return (
                  <button
                    key={i}
                    className="qa-btn"
                    style={{ borderColor: qa.border, color: qa.color, '--qc': qa.color } as React.CSSProperties}
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
            title={dept.name}
            ledColor={dept.color}
            ledGlow={dept.glow}
            badge={dept.badge}
            pipeline={pipeline}
            tabs={tabs}
            activeTab={tab}
            onTabChange={setTab}
            accentColor={dept.color}
          />
        }
      />

      <BottomTicker
        label={dept.name.toUpperCase()}
        ledColor={dept.color}
        ledGlow={dept.glow}
        items={tickerData.backoffice ?? []}
      />
    </div>
  )
}
