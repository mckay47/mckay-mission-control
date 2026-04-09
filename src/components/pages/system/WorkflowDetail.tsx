import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Play, FlaskConical, Pencil, History, Moon } from 'lucide-react'
import { StampButton } from '../../shared/StampButton.tsx'
import { Clock } from '../../shared/Clock.tsx'
import { SplitLayout } from '../../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText, TcStatRow, TcStat } from '../../shared/PreviewPanel.tsx'
import { BottomTicker } from '../../shared/BottomTicker.tsx'
import { Terminal } from '../../shared/Terminal.tsx'
import { Pipeline } from '../../shared/Pipeline.tsx'

import { useMissionControl } from '../../../lib/MissionControlProvider.tsx'

interface Props { toggleTheme: () => void }

const workflowTriggers: Record<string, string[]> = {
  launch: ['Manual trigger by Mehti', 'KANI approval after research score > 70', 'Thinktank promotion event'],
  build: ['Post-scaffold handoff from Launch Agent', 'Manual build command by Mehti'],
  deploy: ['git push to feature branch', 'PR merge to main', 'Manual deploy command'],
  'skill-add': ['Gap identified during build', 'New project type requires new patterns', 'Manual skill creation'],
}


const statusLabel = (s: string) => s === 'active' ? 'Aktiv' : s === 'idle' ? 'Idle' : 'Config'
const statusColor = (s: string) => s === 'active' ? 'var(--g)' : s === 'idle' ? 'var(--a)' : 'var(--t)'

const quickActions = [
  { label: 'Ausfuehren', icon: Play, color: 'var(--g)', border: 'var(--g)', prompt: 'Führe diesen Workflow jetzt aus. Zeige jeden Schritt und das Ergebnis.' },
  { label: 'Testen', icon: FlaskConical, color: 'var(--bl)', border: 'var(--bl)', prompt: 'Teste diesen Workflow mit Testdaten. Zeige ob alle Steps korrekt durchlaufen.' },
  { label: 'Bearbeiten', icon: Pencil, color: 'var(--a)', border: 'var(--a)', prompt: 'Zeige die aktuelle Workflow-Definition und schlage Verbesserungen vor.' },
  { label: 'History', icon: History, color: 'var(--p)', border: 'var(--p)', prompt: 'Zeige die letzten Ausführungen dieses Workflows: Datum, Dauer, Ergebnis, Fehler.' },
]

export function WorkflowDetail({ toggleTheme }: Props) {
  const { workflows, tickerData } = useMissionControl()
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const [tab, setTab] = useState(0)

  const workflow = workflows.find(w => w.id === id)
  if (!workflow) {
    return (
      <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--tx3)' }}>Workflow nicht gefunden</div>
        <button className="open-btn" style={{ marginTop: 20 }} onClick={() => nav('/system/workflows')}>Zurueck zu Workflows</button>
      </div>
    )
  }

  const sLabel = statusLabel(workflow.status)
  const sColor = statusColor(workflow.status)
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null)

  const pipeline = <Pipeline label="Progress" milestones={workflow.pipeline} summary={`${workflow.pipeline.filter(m => m.status === 'done').length}/${workflow.pipeline.length}`} />

  const tabs = [
    {
      label: 'Next Actions',
      content: (
        <>
          <TcLabel>Suggested Actions</TcLabel>
          {[
            { title: 'Workflow ausfuehren', prompt: `kani workflow ${workflow.id} --run` },
            { title: 'Testen', prompt: `kani workflow ${workflow.id} --test` },
            { title: 'History anzeigen', prompt: `kani workflow ${workflow.id} --history` },
          ].map((s, i) => (
            <div key={i} className="ghost-card" style={{ padding: '8px 12px', gap: 0, cursor: 'pointer', '--hc': workflow.glow, flexDirection: 'row', alignItems: 'center' } as React.CSSProperties}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${workflow.color}18`, color: workflow.color, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', marginLeft: 10, flex: 1 }}>{s.title}</span>
            </div>
          ))}
          <TcLabel>Trigger Events</TcLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(workflowTriggers[workflow.id] || []).map((t, i) => (
              <div key={i} className="ghost-card" style={{ padding: '12px 16px', borderRadius: 12, fontSize: 13, color: 'var(--tx2)', display: 'flex', alignItems: 'center', gap: 10, '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: workflow.color, flexShrink: 0 }} />
                {t}
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      label: 'Steps',
      content: (
        <>
          <TcLabel>Workflow Steps</TcLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {workflow.steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 8, flexShrink: 0, marginTop: 2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${workflow.color}18`, color: workflow.color,
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700,
                }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--tx3)', lineHeight: 1.5, marginTop: 2 }}>{s.desc}</div>
                </div>
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
          <TcLabel>Workflow Metrics</TcLabel>
          <TcStatRow>
            <TcStat value={workflow.steps.length.toString()} label="Steps" color={workflow.color} />
            <TcStat value={workflow.history.length.toString()} label="Runs" color="var(--bl)" />
            <TcStat value={sLabel} label="Status" color={sColor} />
          </TcStatRow>
          <TcLabel>Configuration</TcLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {workflow.config.map((c, i) => (
              <div key={i} className="ghost-card" style={{ padding: '12px 16px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)' }}>{c.key}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: workflow.color }}>{c.value}</span>
              </div>
            ))}
          </div>
          <TcLabel>Recent Runs</TcLabel>
          {workflow.history.map((h, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '8px 0' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)', whiteSpace: 'nowrap' }}>{h.time}</span>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: workflow.color, marginTop: 5, flexShrink: 0 }} />
              <TcText>{h.text}</TcText>
            </div>
          ))}
        </>
      ),
    },
    {
      label: 'Briefing',
      content: (
        <>
          <div style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 12 }}>
              <strong style={{ color: 'var(--tx)' }}>{workflow.name}</strong> — {workflow.desc}
            </p>
            <p style={{ marginBottom: 12 }}>
              Status: <span style={{ color: sColor, fontWeight: 700 }}>{sLabel}</span> | Steps: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{workflow.steps.length}</span> | Runs: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{workflow.history.length}</span>
            </p>
            <p style={{ marginBottom: 12 }}>
              Triggers: {(workflowTriggers[workflow.id] || []).join('; ')}
            </p>
            <p>
              Config: {workflow.config.map(c => `${c.key}: ${c.value}`).join(' | ')}
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
              title={`${workflow.id} — workflow`}
              statusLabel={sLabel}
              statusColor={sColor}
              statusGlow={sColor.replace(')', 'g)')}
              placeholder={`kani workflow ${workflow.id} → ...`}
              mode="live"
              cwd="~/mckay-os/"
              terminalId={`workflow:${workflow.id}`}
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
                    onClick={() => setPendingPrompt(qa.prompt)}
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
            title={workflow.name}
            ledColor={workflow.color}
            ledGlow={workflow.glow}
            badge={{ label: sLabel, bg: `${sColor}18`, color: sColor }}
            pipeline={pipeline}
            tabs={tabs}
            activeTab={tab}
            onTabChange={setTab}
            accentColor={workflow.color}
          />
        }
      />

      <BottomTicker
        label={workflow.name.toUpperCase()}
        ledColor={workflow.color}
        ledGlow={workflow.glow}
        items={tickerData.system}
      />
    </div>
  )
}
