import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Activity, ListTodo, Settings, FileText, RotateCcw, Moon } from 'lucide-react'
import { StampButton } from '../../shared/StampButton.tsx'
import { Clock } from '../../shared/Clock.tsx'
import { SplitLayout } from '../../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText, TcStatRow, TcStat } from '../../shared/PreviewPanel.tsx'
import { BottomTicker } from '../../shared/BottomTicker.tsx'
import { Terminal } from '../../shared/Terminal.tsx'
import { Pipeline } from '../../shared/Pipeline.tsx'
import type { PipelineMilestone } from '../../shared/Pipeline.tsx'
import { useMissionControl } from '../../../lib/MissionControlProvider.tsx'

interface Props { toggleTheme: () => void }

const agentSkills: Record<string, string[]> = {
  'KANI Master': ['business-model', 'code-quality', 'deploy', 'memory-cleanup'],
  'Build Agent': ['code-quality', 'scaffold-project', 'deploy', 'react-best-practices'],
  'Launch Agent': ['scaffold-project', 'business-model', 'deploy'],
  'Ops Agent': ['deploy', 'deployment-workflow'],
  'Research Agent': ['business-model', 'marketplace', 'voice-ai'],
  'Sales Agent': ['ui-design', 'marketplace'],
  'Strategy Agent': ['business-model'],
  'Devils Advocate': ['code-quality', 'medical-compliance', 'gdpr-health'],
  'Life Agent': [],
  'Mockup Brief Agent': ['ui-design', 'design-system'],
}


function getAgentPipeline(status: string | undefined, color: string): PipelineMilestone[] {
  const glow = color.replace(')', 'g)')
  if (status === 'active') {
    return [
      { title: 'Init', status: 'done', color, glow, items: ['Config loaded'] },
      { title: 'Running', status: 'active', color, glow, items: ['Processing tasks'] },
      { title: 'Idle', status: 'upcoming', color, glow, items: ['Awaiting next'] },
    ]
  }
  if (status === 'idle') {
    return [
      { title: 'Init', status: 'done', color, glow, items: ['Config loaded'] },
      { title: 'Idle', status: 'active', color, glow, items: ['No active tasks'] },
    ]
  }
  return [
    { title: 'Standby', status: 'active', color, glow, items: ['Ready on demand'] },
  ]
}

const quickActions = [
  { label: 'Status', icon: Activity, color: 'var(--g)', border: 'var(--g)' },
  { label: 'Tasks zuweisen', icon: ListTodo, color: 'var(--bl)', border: 'var(--bl)' },
  { label: 'Config', icon: Settings, color: 'var(--a)', border: 'var(--a)' },
  { label: 'Logs', icon: FileText, color: 'var(--p)', border: 'var(--p)' },
  { label: 'Neustart', icon: RotateCcw, color: 'var(--r)', border: 'var(--r)' },
]

const statusColor = (s: string | undefined) => s === 'active' ? 'var(--g)' : s === 'idle' ? 'var(--a)' : 'var(--tx3)'
const statusLabel = (s: string | undefined) => s === 'active' ? 'Aktiv' : s === 'idle' ? 'Idle' : 'Standby'

export function AgentDetail({ toggleTheme }: Props) {
  const { agents, skills, tickerData } = useMissionControl()
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const [tab, setTab] = useState(0)

  const agentLookup = agents.map(a => ({
    ...a,
    id: a.name.toLowerCase().replace(/\s+/g, '-'),
  }))

  const agent = agentLookup.find(a => a.id === id)
  if (!agent) {
    return (
      <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--tx3)' }}>Agent nicht gefunden</div>
        <button className="open-btn" style={{ marginTop: 20 }} onClick={() => nav('/system/agents')}>Zurueck zu Agents</button>
      </div>
    )
  }

  const color = agent.color
  const glow = color.replace(')', 'g)')
  const sLabel = statusLabel(agent.status)
  const sColor = statusColor(agent.status)

  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null)

  const milestones = getAgentPipeline(agent.status, color)
  const pipeline = <Pipeline label="Status" milestones={milestones} summary={sLabel} />

  const agentSkillList = agentSkills[agent.name] || []

  const tabs = [
    {
      label: 'Next Actions',
      content: (
        <>
          <TcLabel>Suggested Actions</TcLabel>
          {[
            { title: 'Status pruefen', prompt: `kani agent ${agent.id} --status` },
            { title: 'Tasks zuweisen', prompt: `kani agent ${agent.id} --assign` },
            { title: 'Config aktualisieren', prompt: `kani agent ${agent.id} --config` },
          ].map((s, i) => (
            <div key={i} className="ghost-card" style={{ padding: '8px 12px', gap: 0, cursor: 'pointer', '--hc': glow, flexDirection: 'row', alignItems: 'center' } as React.CSSProperties}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${color}18`, color, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', marginLeft: 10, flex: 1 }}>{s.title}</span>
              <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--tx3)', marginLeft: 8, flexShrink: 0 }}>~{['5min', '10min', '2min'][i]}</span>
            </div>
          ))}
          <TcLabel>Skills</TcLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {agentSkillList.map((s, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: '6px 14px', borderRadius: 10, background: `${color}18`, color }}>{s}</span>
            ))}
            {agentSkillList.length === 0 && <TcText>No skills assigned</TcText>}
          </div>
        </>
      ),
    },
    {
      label: 'Agent Log',
      content: (
        <>
          <TcLabel>Purpose</TcLabel>
          <TcText>{agent.purpose}</TcText>
          <TcLabel>Type & Model</TcLabel>
          <TcStatRow>
            <TcStat value={agent.model ?? '--'} label="LLM" color={color} />
            <TcStat value={agent.type === 'core' ? 'Core' : 'Specialist'} label="Type" />
          </TcStatRow>
          <TcLabel>Configuration</TcLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { key: 'Agent ID', value: agent.id },
              { key: 'Config Path', value: `~/.claude/agents/${agent.type}/${agent.id}.md` },
              { key: 'Status', value: sLabel },
            ].map((c, i) => (
              <div key={i} className="ghost-card" style={{ padding: '12px 16px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)' }}>{c.key}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color }}>{c.value}</span>
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
          <TcLabel>Performance Metrics</TcLabel>
          <TcStatRow>
            <TcStat value={agent.status === 'active' ? '47' : '0'} label="Tasks" color={color} />
            <TcStat value={agent.status === 'active' ? '98%' : '--'} label="Success" color="var(--g)" />
            <TcStat value={agent.status === 'active' ? '12h' : '--'} label="Runtime" color="var(--bl)" />
          </TcStatRow>
          <TcLabel>Uptime</TcLabel>
          <TcText style={{ fontFamily: "'JetBrains Mono', monospace", color }}>{agent.status === 'active' ? '99.7% (30d)' : 'N/A'}</TcText>
          <TcLabel>Skills</TcLabel>
          <TcStatRow>
            <TcStat value={agentSkillList.length} label="Assigned" color={color} />
            <TcStat value={skills.length} label="Total" color="var(--tx3)" />
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
              <strong style={{ color: 'var(--tx)' }}>{agent.emoji} {agent.name}</strong> — {agent.purpose}
            </p>
            <p style={{ marginBottom: 12 }}>
              Typ: <strong>{agent.type === 'core' ? 'Core Agent' : 'Specialist Agent'}</strong> | Modell: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{agent.model}</span> | Status: <span style={{ color: sColor, fontWeight: 700 }}>{sLabel}</span>
            </p>
            <p style={{ marginBottom: 12 }}>
              Skills: {agentSkillList.join(', ') || 'Keine'}
            </p>
            <p>
              Config: <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>~/.claude/agents/{agent.type}/{agent.id}.md</span>
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
              title={`${agent.id} — agent`}
              statusLabel={sLabel}
              statusColor={sColor}
              statusGlow={sColor.replace(')', 'g)')}
              placeholder={`kani agent ${agent.id} → ...`}
              mode="live"
              cwd="~/mckay-os/"
              terminalId={`agent:${agent.id}`}
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
            title={`${agent.emoji} ${agent.name}`}
            ledColor={color}
            ledGlow={glow}
            badge={{ label: `${sLabel} / ${agent.model}`, bg: `${sColor}18`, color: sColor }}
            pipeline={pipeline}
            tabs={tabs}
            activeTab={tab}
            onTabChange={setTab}
            accentColor={color}
          />
        }
      />

      <BottomTicker
        label={agent.name.toUpperCase()}
        ledColor={color}
        ledGlow={glow}
        items={tickerData.system ?? []}
      />
    </div>
  )
}
