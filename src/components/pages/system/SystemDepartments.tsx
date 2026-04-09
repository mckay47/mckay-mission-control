import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { Header } from '../../shared/Header.tsx'
import { SplitLayout } from '../../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText, TcStatRow, TcStat } from '../../shared/PreviewPanel.tsx'
import { BottomTicker } from '../../shared/BottomTicker.tsx'
import { StatusLed } from '../../ui/StatusLed.tsx'
import { Pipeline } from '../../shared/Pipeline.tsx'
import { useMissionControl } from '../../../lib/MissionControlProvider.tsx'
import { openOrFocus } from '../../../lib/windowManager'

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

export function SystemDepartments({ toggleTheme }: Props) {
  const { departments, tickerData, departmentPipelines } = useMissionControl()
  const [sel, setSel] = useState(0)
  const [tab, setTab] = useState(0)

  const dept = departments[sel] || undefined
  const deptMilestones = dept ? (departmentPipelines[dept.id] || []) : []
  const pipeline = deptMilestones.length > 0 ? (
    <Pipeline label="Status" milestones={deptMilestones} summary={`${deptMilestones.filter(m => m.status === 'done').length}/${deptMilestones.length}`} />
  ) : undefined

  const tabs = dept ? [
    {
      label: 'Live',
      content: (
        <>
          <TcLabel>Status</TcLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <StatusLed color={dept.color} glow={dept.glow} animate size={10} />
            <span style={{ fontSize: 14, fontWeight: 700, color: dept.color }}>{dept.badge?.label ?? ''}</span>
          </div>
          <TcText>{dept.description}</TcText>
          <TcLabel>Assigned Agents</TcLabel>
          {(deptAgents[dept.id] || []).map((a, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0',
              borderLeft: `2px solid ${dept.color}`, paddingLeft: 10,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: dept.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 600 }}>{a}</span>
            </div>
          ))}
          <TcLabel>KPIs</TcLabel>
          <TcStatRow>
            {(dept.kpis || []).map((k, ki) => (
              <TcStat key={ki} value={k.value} label={k.label} color={k.color} />
            ))}
          </TcStatRow>
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
        </>
      ),
    },
    {
      label: 'Config',
      content: (
        <>
          <TcLabel>Configuration</TcLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(deptConfig[dept.id] || []).map((c, i) => (
              <div key={i} className="ghost-card" style={{ padding: '12px 16px', borderRadius: 12, '--hc': 'rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } as React.CSSProperties}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)' }}>{c.key}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: dept.color }}>{c.value}</span>
              </div>
            ))}
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
  ] : []

  return (
    <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        toggleTheme={toggleTheme}
        backLink={{ label: 'System', href: '/system' }}
      />

      <SplitLayout
        left={
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '0 2px' }}>
              <span className="st">Departments</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>{departments.length} Departments</span>
            </div>

            {/* Department cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {departments.map((d, i) => (
                <div
                  key={d.id}
                  className="ghost-card"
                  style={{ '--hc': d.glow, padding: '18px 22px', gap: 8 } as React.CSSProperties}
                  onClick={() => { setSel(i); setTab(0) }}
                >
                  {/* Top-right external link */}
                  <div
                    className="ghost-open-icon"
                    onClick={(e) => { e.stopPropagation(); openOrFocus(`/system/departments/${d.id}`, 'width=1440,height=900,menubar=no,toolbar=no') }}
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

                  {/* Task count */}
                  <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: d.color }}>
                      {(d.kpis || []).reduce((sum, k) => sum + (parseInt(k.value) || 0), 0)}
                    </span> Tasks
                  </div>

                  {/* KPIs inline */}
                  <div className="ghost-foot" style={{ display: 'flex', gap: 14, marginTop: 2 }}>
                    {(d.kpis || []).slice(0, 2).map((k, ki) => (
                      <div key={ki} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: k.color ?? 'var(--tx3)' }}>{k.value}</span>
                        <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{k.label}</span>
                      </div>
                    ))}
                  </div>

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
              <span style={{ fontSize: 13, color: 'var(--tx3)' }}>Keine Abteilungen konfiguriert</span>
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
                style={{ '--bc': `${dept.color}22`, padding: '5px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', width: 'auto', height: 'auto' } as React.CSSProperties}
                onClick={() => openOrFocus(`/system/departments/${dept.id}`, 'width=1440,height=900,menubar=no,toolbar=no')}
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
        label="DEPARTMENTS"
        ledColor="var(--a)"
        ledGlow="var(--ag)"
        items={tickerData.system ?? []}
      />
    </div>
  )
}
