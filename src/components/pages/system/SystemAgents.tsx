import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { Header } from '../../shared/Header.tsx'
import { SplitLayout } from '../../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText, TcStatRow, TcStat } from '../../shared/PreviewPanel.tsx'
import { BottomTicker } from '../../shared/BottomTicker.tsx'
import { StatusLed } from '../../ui/StatusLed.tsx'
import { Pipeline } from '../../shared/Pipeline.tsx'
import { useMissionControl } from '../../../lib/MissionControlProvider.tsx'
import type { PipelineMilestone } from '../../shared/Pipeline.tsx'

interface Props { toggleTheme: () => void }

type ListItem = { kind: 'agent'; index: number } | { kind: 'skill'; index: number }

const agentSubAgents: Record<string, string[]> = {
  'KANI Master': ['Build Agent', 'Launch Agent', 'Ops Agent', 'Research Agent'],
  'Build Agent': [],
  'Launch Agent': ['Build Agent'],
  'Ops Agent': [],
  'Research Agent': [],
  'Sales Agent': [],
  'Strategy Agent': [],
  'Devils Advocate': [],
  'Life Agent': [],
  'Mockup Brief Agent': [],
}

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

function getAgentPipeline(status: string, color: string): PipelineMilestone[] {
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

const statusColor = (s: string) => s === 'active' ? 'var(--g)' : s === 'idle' ? 'var(--a)' : 'var(--tx3)'
const statusLabel = (s: string) => s === 'active' ? 'Aktiv' : s === 'idle' ? 'Idle' : 'Standby'
const skillStatusColor = (s: string) => s === 'active' ? 'var(--g)' : s === 'inactive' ? 'var(--a)' : 'var(--tx3)'
const skillStatusLabel = (s: string) => s === 'active' ? 'Aktiv' : s === 'inactive' ? 'Inaktiv' : 'Archiviert'

export function SystemAgents({ toggleTheme }: Props) {
  const { agents, skills, tickerData } = useMissionControl()
  const [sel, setSel] = useState<ListItem>({ kind: 'agent', index: 0 })
  const [tab, setTab] = useState(0)

  const isAgent = sel.kind === 'agent'
  const agent = isAgent ? agents[sel.index] : null
  const skill = !isAgent ? skills[sel.index] : null

  const title = isAgent ? agent!.name : skill!.name
  const color = isAgent ? agent!.color : 'var(--t)'
  const glow = isAgent ? color.replace(')', 'g)') : 'var(--tg)'

  const badge = isAgent
    ? { label: `${statusLabel(agent!.status)} / ${agent!.model}`, bg: `${color}18`, color }
    : { label: `${skillStatusLabel(skill!.status)} / ${skill!.category}`, bg: 'var(--tc)', color: 'var(--t)' }

  const pipeline = isAgent
    ? <Pipeline label="Status" milestones={getAgentPipeline(agent!.status, agent!.color)} summary={statusLabel(agent!.status)} />
    : undefined

  /* Agent tabs: Live, Skills, Sub Agents, Briefing */
  const agentTabs = [
    {
      label: 'Live',
      content: (
        <>
          <TcLabel>Status</TcLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <StatusLed
              color={statusColor(agent?.status || '')}
              glow={statusColor(agent?.status || '').replace(')', 'g)')}
              animate={agent?.status === 'active'}
              size={10}
            />
            <span style={{ fontSize: 14, fontWeight: 700, color: statusColor(agent?.status || '') }}>
              {statusLabel(agent?.status || '')}
            </span>
          </div>
          <TcLabel>Purpose</TcLabel>
          <TcText>{agent?.purpose}</TcText>
          <TcLabel>Model & Type</TcLabel>
          <TcStatRow>
            <TcStat value={agent?.model || ''} label="LLM" color={color} />
            <TcStat value={agent?.type === 'core' ? 'Core' : 'Specialist'} label="Type" />
            <TcStat value={agent?.status === 'active' ? '47' : '0'} label="Tasks" color={color} />
          </TcStatRow>
          <TcLabel>Activity</TcLabel>
          {[
            { time: '14:32', text: `${agent?.name} task completed`, type: 'success' },
            { time: '13:10', text: 'Config reloaded', type: 'info' },
            { time: '12:05', text: 'Session started', type: 'info' },
          ].map((e, i) => {
            const dotColor = e.type === 'success' ? 'var(--g)' : 'var(--bl)'
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '4px 0',
                borderLeft: i < 2 ? `2px solid ${dotColor}` : '2px solid transparent',
                paddingLeft: 10,
              }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--tx3)', minWidth: 32 }}>{e.time}</span>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: i < 2 ? 'var(--tx)' : 'var(--tx3)', fontWeight: i < 2 ? 600 : 400 }}>{e.text}</span>
              </div>
            )
          })}
        </>
      ),
    },
    {
      label: 'Skills',
      content: (
        <>
          <TcLabel>Assigned Skills</TcLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(agentSkills[agent?.name || ''] || []).map((s, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: '6px 14px', borderRadius: 10, background: `${color}18`, color }}>{s}</span>
            ))}
            {(agentSkills[agent?.name || ''] || []).length === 0 && <TcText>No skills assigned</TcText>}
          </div>
          <TcLabel>Performance</TcLabel>
          <TcStatRow>
            <TcStat value={agent?.status === 'active' ? '98%' : '--'} label="Success" color="var(--g)" />
            <TcStat value={agent?.status === 'active' ? '12h' : '--'} label="Runtime" color="var(--bl)" />
          </TcStatRow>
        </>
      ),
    },
    {
      label: 'Sub Agents',
      content: (
        <>
          <TcLabel>Sub Agents</TcLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(agentSubAgents[agent?.name || ''] || []).map((a, i) => (
              <div key={i} className="ghost-card" style={{ padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, color: 'var(--tx2)', '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
                {a}
              </div>
            ))}
            {(agentSubAgents[agent?.name || ''] || []).length === 0 && <TcText>No sub agents</TcText>}
          </div>
        </>
      ),
    },
    {
      label: 'Briefing',
      content: (
        <>
          <div style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 12 }}>
              <strong style={{ color: 'var(--tx)' }}>{agent?.name}</strong> — {agent?.purpose}
            </p>
            <p style={{ marginBottom: 12 }}>
              Typ: <strong>{agent?.type === 'core' ? 'Core Agent' : 'Specialist Agent'}</strong> | Modell: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{agent?.model}</span>
            </p>
            <p style={{ marginBottom: 12 }}>
              Skills: {(agentSkills[agent?.name || ''] || []).join(', ') || 'Keine'}
            </p>
            <p>
              Sub-Agents: {(agentSubAgents[agent?.name || ''] || []).join(', ') || 'Keine'}
            </p>
          </div>
          <TcLabel>Stats</TcLabel>
          <TcStatRow>
            <TcStat value={agent?.status === 'active' ? '47' : '0'} label="Tasks" color={color} />
            <TcStat value={agent?.status === 'active' ? '98%' : '--'} label="Success" color="var(--g)" />
            <TcStat value={agent?.status === 'active' ? '12h' : '--'} label="Runtime" color="var(--bl)" />
          </TcStatRow>
        </>
      ),
    },
  ]

  /* Skill tabs: Live, Used By, Config, Briefing */
  const skillTabs = [
    {
      label: 'Live',
      content: (
        <>
          <TcLabel>Status</TcLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <StatusLed
              color={skillStatusColor(skill?.status || '')}
              glow={skillStatusColor(skill?.status || '').replace(')', 'g)')}
              size={10}
            />
            <span style={{ fontSize: 14, fontWeight: 700, color: skillStatusColor(skill?.status || '') }}>
              {skillStatusLabel(skill?.status || '')}
            </span>
          </div>
          <TcLabel>Purpose</TcLabel>
          <TcText>{skill?.purpose}</TcText>
          <TcLabel>Category & Status</TcLabel>
          <TcStatRow>
            <TcStat value={skillStatusLabel(skill?.status || '')} label="Status" color={skillStatusColor(skill?.status || '')} />
            <TcStat value={skill?.category || ''} label="Category" />
          </TcStatRow>
        </>
      ),
    },
    {
      label: 'Used By',
      content: (
        <>
          <TcLabel>Agents Using This Skill</TcLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {agents
              .filter(a => (agentSkills[a.name] || []).includes(skill?.name || ''))
              .map((a, i) => (
                <div key={i} className="ghost-card" style={{ padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, color: 'var(--tx2)', '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
                  {a.emoji} {a.name}
                </div>
              ))}
          </div>
        </>
      ),
    },
    {
      label: 'Config',
      content: (
        <>
          <TcLabel>Skill Configuration</TcLabel>
          <TcText>Path: ~/.claude/skills/{skill?.category}/{skill?.name}.md</TcText>
          <TcText>Loaded at session start. Auto-applied when skill category matches project type.</TcText>
        </>
      ),
    },
    {
      label: 'Briefing',
      content: (
        <>
          <div style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 12 }}>
              <strong style={{ color: 'var(--tx)' }}>{skill?.name}</strong> — {skill?.purpose}
            </p>
            <p style={{ marginBottom: 12 }}>
              Kategorie: <strong>{skill?.category}</strong> | Status: <span style={{ color: skillStatusColor(skill?.status || '') }}>{skillStatusLabel(skill?.status || '')}</span>
            </p>
            <p>
              Genutzt von: {agents.filter(a => (agentSkills[a.name] || []).includes(skill?.name || '')).map(a => a.name).join(', ') || 'Keine Agents'}
            </p>
          </div>
        </>
      ),
    },
  ]

  const tabs = isAgent ? agentTabs : skillTabs

  return (
    <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        toggleTheme={toggleTheme}
        backLink={{ label: 'System', href: '/system' }}
      />

      <SplitLayout
        left={
          <>
            {/* Agents section header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '0 2px' }}>
              <span className="st">Agents</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>{agents.length} Agents</span>
            </div>

            {/* Agent cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, marginBottom: 28 }}>
              {agents.map((a, i) => (
                <div
                  key={a.name}
                  className="ghost-card"
                  style={{ '--hc': a.color.replace(')', 'g)'), padding: '18px 22px', gap: 8 } as React.CSSProperties}
                  onClick={() => { setSel({ kind: 'agent', index: i }); setTab(0) }}
                >
                  {/* Top-right external link */}
                  <div
                    className="ghost-open-icon"
                    onClick={(e) => { e.stopPropagation(); window.open(`/system/agents/${a.name.toLowerCase().replace(/\s+/g, '-')}`, '_blank', 'width=1440,height=900,menubar=no,toolbar=no') }}
                    style={{
                      position: 'absolute', top: 12, right: 12, zIndex: 2,
                      cursor: 'pointer', opacity: 0,
                      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                  >
                    <ExternalLink size={14} stroke="var(--tx3)" />
                  </div>

                  {/* Name + Status LED + badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StatusLed color={statusColor(a.status)} glow={statusColor(a.status).replace(')', 'g)')} animate={a.status === 'active'} size={7} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>{a.emoji} {a.name}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                      background: `${statusColor(a.status)}12`, color: statusColor(a.status), letterSpacing: 1,
                    }}>
                      {statusLabel(a.status)}
                    </span>
                  </div>

                  {/* Type + Model */}
                  <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
                    {a.type === 'core' ? 'Core' : 'Specialist'} · <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{a.model}</span>
                  </div>

                  {/* Purpose (1 line) */}
                  <div style={{ fontSize: 12, color: 'var(--tx2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.purpose}</div>

                  {/* Color accent bar */}
                  <div style={{ width: 32, height: 3, borderRadius: 2, background: a.color, opacity: 0.5, marginTop: 2 }} />
                </div>
              ))}
            </div>

            {/* Skills section header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '0 2px' }}>
              <span className="st">Skills</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>{skills.length} Skills</span>
            </div>

            {/* Skill cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {skills.map((s, i) => (
                <div
                  key={s.name}
                  className="ghost-card"
                  style={{ '--hc': 'var(--tg)', padding: '18px 22px', gap: 8 } as React.CSSProperties}
                  onClick={() => { setSel({ kind: 'skill', index: i }); setTab(0) }}
                >
                  {/* Name + Status LED + badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StatusLed color={skillStatusColor(s.status)} glow={skillStatusColor(s.status).replace(')', 'g)')} size={7} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>{s.name}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                      background: `${skillStatusColor(s.status)}12`, color: skillStatusColor(s.status), letterSpacing: 1,
                    }}>
                      {skillStatusLabel(s.status)}
                    </span>
                  </div>

                  {/* Category */}
                  <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{s.category}</div>

                  {/* Purpose (1 line) */}
                  <div style={{ fontSize: 12, color: 'var(--tx2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.purpose}</div>

                  {/* Color accent bar */}
                  <div style={{ width: 32, height: 3, borderRadius: 2, background: 'var(--t)', opacity: 0.5, marginTop: 2 }} />
                </div>
              ))}
            </div>
          </>
        }
        right={
          <PreviewPanel
            title={title}
            ledColor={color}
            ledGlow={glow}
            badge={badge}
            pipeline={pipeline}
            tabs={tabs}
            activeTab={tab}
            onTabChange={setTab}
            accentColor={color}
            headerAction={isAgent ? (
              <div
                className="ghost-btn"
                style={{ '--bc': `${color}22`, padding: '5px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', width: 'auto', height: 'auto' } as React.CSSProperties}
                onClick={() => window.open(`/system/agents/${agent!.name.toLowerCase().replace(/\s+/g, '-')}`, '_blank', 'width=1440,height=900,menubar=no,toolbar=no')}
              >
                <ExternalLink size={12} stroke={color} />
                <span style={{ fontSize: 10, fontWeight: 700, color }}>Oeffnen</span>
              </div>
            ) : undefined}
          />
        }
      />

      <BottomTicker
        label="AGENTS"
        ledColor="var(--o)"
        ledGlow="var(--og)"
        items={tickerData.system}
      />
    </div>
  )
}
