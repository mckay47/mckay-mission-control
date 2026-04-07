import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { Header } from '../../shared/Header.tsx'
import { SplitLayout } from '../../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText } from '../../shared/PreviewPanel.tsx'
import { BottomTicker } from '../../shared/BottomTicker.tsx'
import { StatusLed } from '../../ui/StatusLed.tsx'
import { Pipeline } from '../../shared/Pipeline.tsx'
import { useMissionControl } from '../../../lib/MissionControlProvider.tsx'

interface Props { toggleTheme: () => void }

const statusLabel = (s: string) => s === 'active' ? 'Aktiv' : s === 'idle' ? 'Idle' : 'Config'
const statusColor = (s: string) => s === 'active' ? 'var(--g)' : s === 'idle' ? 'var(--a)' : 'var(--t)'

export function SystemWorkflows({ toggleTheme }: Props) {
  const { workflows, tickerData } = useMissionControl()
  const [sel, setSel] = useState(0)
  const [tab, setTab] = useState(0)

  const wf = workflows[sel]

  const tabs = [
    {
      label: 'Live',
      content: (
        <>
          <TcLabel>Status</TcLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <StatusLed color={statusColor(wf.status)} glow={statusColor(wf.status).replace(')', 'g)')} animate={wf.status === 'active'} size={10} />
            <span style={{ fontSize: 14, fontWeight: 700, color: statusColor(wf.status) }}>{statusLabel(wf.status)}</span>
          </div>
          <TcText>{wf.desc}</TcText>
          <TcLabel>Configuration</TcLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {wf.config.map((c, i) => (
              <div key={i} className="ghost-card" style={{ padding: '12px 16px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)' }}>{c.key}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: wf.color }}>{c.value}</span>
              </div>
            ))}
          </div>
          <TcLabel>Recent Activity</TcLabel>
          {wf.history.map((h, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0',
              borderLeft: i < 2 ? `2px solid ${wf.color}` : '2px solid transparent', paddingLeft: 10,
            }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--tx3)', minWidth: 32 }}>{h.time}</span>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: wf.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: i < 2 ? 'var(--tx)' : 'var(--tx3)', fontWeight: i < 2 ? 600 : 400 }}>{h.text}</span>
            </div>
          ))}
        </>
      ),
    },
    {
      label: 'Steps',
      content: (
        <>
          <TcLabel>Workflow Steps</TcLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {wf.steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 8, flexShrink: 0, marginTop: 2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${wf.color}18`, color: wf.color,
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
      label: 'History',
      content: (
        <>
          <TcLabel>Recent Runs</TcLabel>
          {wf.history.map((h, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '8px 0' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)', whiteSpace: 'nowrap' }}>{h.time}</span>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: wf.color, marginTop: 5, flexShrink: 0 }} />
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
              <strong style={{ color: 'var(--tx)' }}>{wf.name}</strong> — {wf.desc}
            </p>
            <p style={{ marginBottom: 12 }}>
              Status: <span style={{ color: statusColor(wf.status), fontWeight: 700 }}>{statusLabel(wf.status)}</span> | Steps: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{wf.steps.length}</span> | Runs: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{wf.history.length}</span>
            </p>
            <p>
              Config: {wf.config.map(c => `${c.key}: ${c.value}`).join(' | ')}
            </p>
          </div>
        </>
      ),
    },
  ]

  return (
    <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        toggleTheme={toggleTheme}
        backTo={{ label: 'System', path: '/system' }}
      />

      <SplitLayout
        left={
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '0 2px' }}>
              <span className="st">Workflows</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>{workflows.length} Workflows</span>
            </div>

            {/* Workflow cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {workflows.map((w, i) => (
                <div
                  key={w.id}
                  className="ghost-card"
                  style={{ '--hc': w.glow, padding: '18px 22px', gap: 8 } as React.CSSProperties}
                  onClick={() => { setSel(i); setTab(0) }}
                >
                  {/* Top-right external link */}
                  <div
                    className="ghost-open-icon"
                    onClick={(e) => { e.stopPropagation(); window.open(`/system/workflows/${w.id}`, '_blank', 'width=1440,height=900,menubar=no,toolbar=no') }}
                    style={{
                      position: 'absolute', top: 12, right: 12, zIndex: 2,
                      cursor: 'pointer', opacity: 0,
                      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                  >
                    <ExternalLink size={14} stroke="var(--tx3)" />
                  </div>

                  {/* Name + Status badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>{w.name}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                      background: `${statusColor(w.status)}12`, color: statusColor(w.status), letterSpacing: 1,
                    }}>
                      {statusLabel(w.status)}
                    </span>
                  </div>

                  {/* Step count + Last run */}
                  <div className="ghost-foot" style={{ display: 'flex', gap: 14, marginTop: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: w.color }}>{w.steps.length}</span>
                      <span style={{ fontSize: 10, color: 'var(--tx3)' }}>Steps</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: 'var(--bl)' }}>{w.history.length}</span>
                      <span style={{ fontSize: 10, color: 'var(--tx3)' }}>Runs</span>
                    </div>
                  </div>

                  {/* Last run time */}
                  <div style={{ fontSize: 10, color: 'var(--tx3)', fontFamily: "'JetBrains Mono', monospace" }}>
                    {w.history[0]?.time || '—'}
                  </div>

                  {/* Color accent bar */}
                  <div style={{ width: 32, height: 3, borderRadius: 2, background: w.color, opacity: 0.5, marginTop: 2 }} />
                </div>
              ))}
            </div>
          </>
        }
        right={
          <PreviewPanel
            title={wf.name}
            ledColor={wf.color}
            ledGlow={wf.glow}
            badge={{ label: statusLabel(wf.status), bg: `${statusColor(wf.status)}18`, color: statusColor(wf.status) }}
            pipeline={<Pipeline label="Progress" milestones={wf.pipeline} summary={`${wf.pipeline.filter(m => m.status === 'done').length}/${wf.pipeline.length}`} />}
            tabs={tabs}
            activeTab={tab}
            onTabChange={setTab}
            accentColor={wf.color}
            headerAction={
              <div
                className="ghost-btn"
                style={{ '--bc': `${wf.color}22`, padding: '5px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', width: 'auto', height: 'auto' } as React.CSSProperties}
                onClick={() => window.open(`/system/workflows/${wf.id}`, '_blank', 'width=1440,height=900,menubar=no,toolbar=no')}
              >
                <ExternalLink size={12} stroke={wf.color} />
                <span style={{ fontSize: 10, fontWeight: 700, color: wf.color }}>Oeffnen</span>
              </div>
            }
          />
        }
      />

      <BottomTicker
        label="WORKFLOWS"
        ledColor="var(--p)"
        ledGlow="var(--pg)"
        items={tickerData.system}
      />
    </div>
  )
}
