import { useState } from 'react'
import { Header } from '../../shared/Header.tsx'
import { SplitLayout } from '../../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText, TcStatRow, TcStat } from '../../shared/PreviewPanel.tsx'
import { BottomTicker } from '../../shared/BottomTicker.tsx'
import { StatusLed } from '../../ui/StatusLed.tsx'
import { Pipeline } from '../../shared/Pipeline.tsx'
import { useMissionControl } from '../../../lib/MissionControlProvider.tsx'
import type { PipelineMilestone } from '../../shared/Pipeline.tsx'

interface Props { toggleTheme: () => void }

const perfPipeline: PipelineMilestone[] = [
  { title: 'Boot', status: 'done', color: 'var(--g)', glow: 'var(--gg)', items: ['System initialized'] },
  { title: 'Running', status: 'active', color: 'var(--g)', glow: 'var(--gg)', items: ['3 agents active'] },
  { title: 'Optimizing', status: 'upcoming', color: 'var(--g)', glow: 'var(--gg)', items: ['Auto-scaling'] },
]

export function SystemPerformance({ toggleTheme }: Props) {
  const { perfKpis, agents, tickerData } = useMissionControl()
  const [sel, setSel] = useState(0)
  const [tab, setTab] = useState(0)

  const kpi = perfKpis[sel]

  const tabs = [
    {
      label: 'Live',
      content: (
        <>
          <TcLabel>Status</TcLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <StatusLed color={kpi.color} glow={kpi.glow} animate size={10} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: kpi.color }}>{kpi.value}</span>
          </div>
          <TcLabel>Description</TcLabel>
          <TcText>{kpi.desc}</TcText>
          <TcLabel>Trend</TcLabel>
          <TcText style={{ color: 'var(--g)', fontWeight: 600 }}>{kpi.trend}</TcText>
          <TcLabel>Active Agents</TcLabel>
          {agents.filter(a => a.status === 'active').slice(0, 3).map((a, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '4px 0',
              borderLeft: `2px solid ${a.color}`,
              paddingLeft: 10,
            }}>
              <StatusLed color={a.color} glow={a.color.replace(')', 'g)')} animate size={6} />
              <span style={{ fontSize: 11, fontWeight: 600 }}>{a.emoji} {a.name}</span>
            </div>
          ))}
        </>
      ),
    },
    {
      label: 'Breakdown',
      content: (
        <>
          <TcLabel>Breakdown</TcLabel>
          <TcStatRow>
            {kpi.details.map((d, i) => (
              <TcStat key={i} value={d.value} label={d.label} color={d.color} />
            ))}
          </TcStatRow>
          <TcLabel>Agent Performance</TcLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(() => {
              const taskCounts: Record<string, number> = {
                'KANI Master': 47, 'Build Agent': 68, 'Launch Agent': 0, 'Ops Agent': 8,
                'Research Agent': 27, 'Sales Agent': 3, 'Strategy Agent': 2,
                'Devils Advocate': 5, 'Life Agent': 4, 'Mockup Brief Agent': 3,
              }
              return agents.map((a, i) => {
                const ledColor = a.status === 'active' ? 'var(--g)' : a.status === 'idle' ? 'var(--a)' : 'var(--tx3)'
                const ledGlow = a.status === 'active' ? 'var(--gg)' : a.status === 'idle' ? 'var(--ag)' : 'rgba(255,255,255,0.04)'
                const tasks = taskCounts[a.name] || 0
                return (
                  <div key={i} className="ghost-card" style={{ padding: '14px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <StatusLed color={ledColor} glow={ledGlow} animate={a.status === 'active'} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{a.emoji} {a.name}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: `${ledColor}15`, color: ledColor }}>
                        {a.status}
                      </span>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: tasks > 0 ? 'var(--g)' : 'var(--tx3)' }}>
                      {tasks} tasks
                    </span>
                  </div>
                )
              })
            })()}
          </div>
        </>
      ),
    },
    {
      label: 'History',
      content: (
        <>
          <TcLabel>Recent Activity</TcLabel>
          {[
            { time: '14:32', text: 'Build Agent completed Mission Control V3 page build', color: 'var(--g)' },
            { time: '13:15', text: 'Research Agent scored AI Steuerberater idea (92)', color: 'var(--t)' },
            { time: '11:48', text: 'KANI Master orchestrated 3 parallel builds', color: 'var(--p)' },
            { time: '10:22', text: 'Build Agent fixed Backoffice pipeline rendering', color: 'var(--g)' },
            { time: '09:05', text: 'System boot — all agents initialized', color: 'var(--bl)' },
            { time: '08:30', text: 'Ops Agent deployed hebammenbuero preview', color: 'var(--bl)' },
            { time: '07:45', text: 'KANI Master loaded DNA.md + REGISTRY.md', color: 'var(--p)' },
            { time: '07:00', text: 'System daily health check — all green', color: 'var(--g)' },
          ].map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '8px 0' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)', whiteSpace: 'nowrap' }}>{e.time}</span>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: e.color, marginTop: 5, flexShrink: 0 }} />
              <TcText>{e.text}</TcText>
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
              <strong style={{ color: 'var(--tx)' }}>{kpi.label}</strong>: <span style={{ fontFamily: "'JetBrains Mono', monospace", color: kpi.color }}>{kpi.value}</span>
            </p>
            <p style={{ marginBottom: 12 }}>{kpi.desc}</p>
            <p style={{ marginBottom: 12 }}>
              Trend: <span style={{ color: 'var(--g)', fontWeight: 600 }}>{kpi.trend}</span>
            </p>
            <p>
              Breakdown: {kpi.details.map(d => `${d.label}: ${d.value}`).join(' | ')}
            </p>
          </div>
          <TcLabel>Summary</TcLabel>
          <TcStatRow>
            {kpi.details.slice(0, 3).map((d, i) => (
              <TcStat key={i} value={d.value} label={d.label} color={d.color} />
            ))}
          </TcStatRow>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'var(--gc)' }}>
            <StatusLed color="var(--g)" glow="var(--gg)" animate size={8} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--g)' }}>All systems operational</span>
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
              <span className="st">Performance KPIs</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>{perfKpis.length} Metrics</span>
            </div>

            {/* KPI cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {perfKpis.map((k, i) => (
                <div
                  key={k.id}
                  className="ghost-card"
                  style={{ '--hc': k.glow, padding: '18px 22px', gap: 8 } as React.CSSProperties}
                  onClick={() => { setSel(i); setTab(0) }}
                >
                  {/* Name */}
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>{k.label}</div>

                  {/* Large value */}
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700, color: k.color }}>
                    {k.value}
                  </div>

                  {/* Trend indicator */}
                  <div style={{ fontSize: 11, color: 'var(--g)', fontWeight: 600 }}>{k.trend}</div>

                  {/* Sparkline SVG */}
                  <svg width={80} height={24} viewBox="0 0 80 24" style={{ flexShrink: 0, opacity: 0.5 }}>
                    <polyline
                      points={(() => {
                        const sparklineData: Record<string, number[]> = {
                          tasks: [14, 10, 16, 8, 18, 12, 20, 6, 22, 10, 24],
                          success: [90, 92, 94, 93, 96, 95, 97, 96, 98, 97, 98],
                          runtime: [4, 5, 6, 5, 7, 6, 8, 5, 7, 6, 8],
                          response: [2.0, 1.8, 1.6, 1.7, 1.4, 1.5, 1.3, 1.4, 1.2, 1.3, 1.2],
                        }
                        const raw = sparklineData[k.id] || sparklineData.tasks
                        const min = Math.min(...raw)
                        const max = Math.max(...raw)
                        const range = max - min || 1
                        return raw.map((v, j) => `${j * 8},${24 - ((v - min) / range) * 24}`).join(' ')
                      })()}
                      fill="none" stroke={k.color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>

                  {/* Color accent bar */}
                  <div style={{ width: 32, height: 3, borderRadius: 2, background: k.color, opacity: 0.5, marginTop: 2 }} />
                </div>
              ))}
            </div>
          </>
        }
        right={
          <PreviewPanel
            title={kpi.label}
            ledColor={kpi.color}
            ledGlow={kpi.glow}
            badge={{ label: kpi.value, bg: `${kpi.color}18`, color: kpi.color }}
            pipeline={<Pipeline label="System" milestones={perfPipeline} summary="Running" />}
            tabs={tabs}
            activeTab={tab}
            onTabChange={setTab}
            accentColor={kpi.color}
          />
        }
      />

      <BottomTicker
        label="PERFORMANCE"
        ledColor="var(--bl)"
        ledGlow="var(--blg)"
        items={tickerData.system}
      />
    </div>
  )
}
