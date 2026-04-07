import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { Header } from '../shared/Header.tsx'
import { SplitLayout } from '../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText, TcStatRow, TcStat } from '../shared/PreviewPanel.tsx'
import { BottomTicker } from '../shared/BottomTicker.tsx'
import { StatusLed } from '../ui/StatusLed.tsx'
import { Pipeline } from '../shared/Pipeline.tsx'
import { useMissionControl } from '../../lib/MissionControlProvider.tsx'

interface Props { toggleTheme: () => void }

export function Backoffice({ toggleTheme }: Props) {
  const { departments, tickerData, departmentPipelines } = useMissionControl()
  const navigate = useNavigate()
  const [sel, setSel] = useState(0)
  const [tab, setTab] = useState(0)

  const dept = departments[sel] || undefined
  const deptMilestones = dept ? (departmentPipelines[dept.id] || []) : []
  const pipeline = deptMilestones.length > 0 ? (
    <Pipeline label="Status" milestones={deptMilestones} summary={`${deptMilestones.filter(m => m.status === 'done').length}/${deptMilestones.length}`} />
  ) : undefined

  const tabs = dept ? [
    {
      label: 'Details',
      content: (
        <>
          <TcLabel>Beschreibung</TcLabel>
          <TcText>{dept.description}</TcText>
          <TcLabel>Uebersicht</TcLabel>
          <TcStatRow>
            <TcStat value={dept.tasks ?? 0} label="Tasks" color={dept.color} />
            <TcStat value={departments.length} label="Departments" color="var(--tx3)" />
          </TcStatRow>
          {dept.kpis && dept.kpis.length > 0 && (
            <>
              <TcLabel>KPIs</TcLabel>
              <TcStatRow>
                {dept.kpis.map((kpi: { value: string; label: string; color?: string }, i: number) => (
                  <TcStat key={i} value={kpi.value} label={kpi.label} color={kpi.color} />
                ))}
              </TcStatRow>
            </>
          )}
        </>
      ),
    },
    {
      label: 'Tasks',
      content: (
        <>
          <TcLabel>Offene Tasks</TcLabel>
          {dept.tasks > 0 ? (
            <TcText>{dept.tasks} Tasks offen in diesem Department</TcText>
          ) : (
            <TcText style={{ color: 'var(--tx3)' }}>Keine offenen Tasks</TcText>
          )}
        </>
      ),
    },
  ] : []

  return (
    <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        backLink={{ label: 'Cockpit', href: '/' }}
        title="Backoffice"
        toggleTheme={toggleTheme}
      />

      <SplitLayout
        ratio="55% 45%"
        left={
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className="st" style={{ padding: '0 2px' }}>Departments</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>
                {departments.length} Bereiche
              </span>
            </div>

            {/* Department cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {departments.map((d, i) => (
                <div
                  key={d.id}
                  className="ghost-card"
                  style={{ '--hc': d.glow, padding: '18px 22px', gap: 8 } as React.CSSProperties}
                  onClick={() => { setSel(i); setTab(0) }}
                >
                  {/* Top-right external link icon */}
                  <div
                    className="ghost-open-icon"
                    onClick={(e) => { e.stopPropagation(); navigate(`/system/departments/${d.id}`) }}
                    style={{
                      position: 'absolute', top: 12, right: 12, zIndex: 2,
                      cursor: 'pointer', opacity: 0,
                      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                  >
                    <ExternalLink size={14} stroke="var(--tx3)" />
                  </div>

                  {/* Name + Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>{d.name}</span>
                    {d.badge && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                        background: d.badge.bg, color: d.badge.color, letterSpacing: 1,
                      }}>
                        {d.badge.label}
                      </span>
                    )}
                  </div>

                  {/* Tasks count */}
                  <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: d.color }}>
                      {d.tasks ?? 0}
                    </span> Tasks
                  </div>

                  {/* Description */}
                  <div style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.5 }}>{d.description}</div>

                  {/* Color accent bar */}
                  <div style={{ width: 32, height: 3, borderRadius: 2, background: d.color, opacity: 0.5, marginTop: 2 }} />
                </div>
              ))}
            </div>
          </>
        }
        right={
          !dept ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 700, color: 'var(--tx3)', opacity: 0.3 }}>—</span>
              <span style={{ fontSize: 13, color: 'var(--tx3)' }}>Keine Departments konfiguriert</span>
            </div>
          ) : (
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
            headerAction={
              <div
                className="ghost-btn"
                onClick={() => navigate(`/system/departments/${dept.id}`)}
                style={{ '--bc': `${dept.color}22`, padding: '5px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', width: 'auto', height: 'auto' } as React.CSSProperties}
              >
                <ExternalLink size={12} stroke={dept.color} />
                <span style={{ fontSize: 10, fontWeight: 700, color: dept.color }}>Oeffnen</span>
              </div>
            }
          />
          )
        }
      />

      <BottomTicker
        label="BACKOFFICE"
        ledColor="var(--o)"
        ledGlow="var(--og)"
        items={tickerData.backoffice || []}
      />
    </div>
  )
}
