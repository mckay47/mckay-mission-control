import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { Header } from '../../shared/Header.tsx'
import { SplitLayout } from '../../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText, TcStatRow, TcStat } from '../../shared/PreviewPanel.tsx'
import { BottomTicker } from '../../shared/BottomTicker.tsx'
import { StatusLed } from '../../ui/StatusLed.tsx'
import { useMissionControl } from '../../../lib/MissionControlProvider.tsx'
import { openOrFocus } from '../../../lib/windowManager'

interface Props { toggleTheme: () => void }

const statusLabel = (s: string) => s === 'active' ? 'Aktiv' : s === 'standby' ? 'Standby' : 'Critical'
const statusBadgeColor = (s: string) => s === 'active' ? 'var(--g)' : s === 'standby' ? 'var(--a)' : 'var(--r)'
const logLevelColor = (l: string) => l === 'info' ? 'var(--bl)' : l === 'warn' ? 'var(--a)' : 'var(--r)'
const severityColor = (s: string) => s === 'low' ? 'var(--g)' : s === 'medium' ? 'var(--a)' : 'var(--r)'

export function SystemSecurity({ toggleTheme }: Props) {
  const { securityFeatures, tickerData } = useMissionControl()
  const [sel, setSel] = useState(0)
  const [tab, setTab] = useState(0)

  const feat = securityFeatures[sel]

  const tabs = [
    {
      label: 'Live',
      content: (
        <>
          <TcLabel>Status</TcLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <StatusLed color={statusBadgeColor(feat.status)} glow={statusBadgeColor(feat.status).replace(')', 'g)')} animate={feat.status === 'active'} size={10} />
            <span style={{ fontSize: 14, fontWeight: 700, color: statusBadgeColor(feat.status) }}>{statusLabel(feat.status)}</span>
          </div>
          <TcText>{feat.desc}</TcText>
          <TcLabel>Recent Logs</TcLabel>
          {feat.logs.slice(0, 3).map((l, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0',
              borderLeft: i < 2 ? `2px solid ${logLevelColor(l.level)}` : '2px solid transparent', paddingLeft: 10,
            }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--tx3)', minWidth: 32 }}>{l.time}</span>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: logLevelColor(l.level), flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: i < 2 ? 'var(--tx)' : 'var(--tx3)', fontWeight: i < 2 ? 600 : 400 }}>{l.text}</span>
            </div>
          ))}
          {feat.alerts.length > 0 && (
            <>
              <TcLabel>Active Alerts</TcLabel>
              {feat.alerts.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: severityColor(a.severity), flexShrink: 0, animation: 'lp 2s ease-in-out infinite', '--lc': severityColor(a.severity).replace(')', 'g)') } as React.CSSProperties} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: severityColor(a.severity) }}>{a.text}</span>
                </div>
              ))}
            </>
          )}
        </>
      ),
    },
    {
      label: 'Config',
      content: (
        <>
          <TcLabel>Configuration</TcLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {feat.config.map((c, i) => (
              <div key={i} className="ghost-card" style={{ padding: '12px 16px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)' }}>{c.key}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: feat.color }}>{c.value}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      label: 'Alerts',
      content: (
        <>
          <TcLabel>Active Alerts</TcLabel>
          {feat.alerts.length === 0 ? (
            <TcText style={{ color: 'var(--g)' }}>No active alerts. System clean.</TcText>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {feat.alerts.map((a, i) => (
                <div key={i} className="ghost-card" style={{ padding: '14px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: severityColor(a.severity), flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--tx2)', flex: 1 }}>{a.text}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: `${severityColor(a.severity)}18`, color: severityColor(a.severity) }}>
                    {a.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
          <TcLabel>Stats</TcLabel>
          <TcStatRow>
            <TcStat value="0" label="Critical" color="var(--g)" />
            <TcStat value={feat.alerts.length.toString()} label="Active" color={feat.alerts.length > 0 ? 'var(--a)' : 'var(--g)'} />
            <TcStat value="12" label="Resolved" color="var(--bl)" />
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
              <strong style={{ color: 'var(--tx)' }}>{feat.name}</strong> — {feat.desc}
            </p>
            <p style={{ marginBottom: 12 }}>
              Status: <span style={{ color: statusBadgeColor(feat.status), fontWeight: 700 }}>{statusLabel(feat.status)}</span> | Alerts: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{feat.alerts.length}</span>
            </p>
            <p>
              Config: {feat.config.map(c => `${c.key}: ${c.value}`).join(' | ')}
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
        backLink={{ label: 'System', href: '/system' }}
      />

      <SplitLayout
        left={
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '0 2px' }}>
              <span className="st">Security Features</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>{securityFeatures.length} Features</span>
            </div>

            {/* Security cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {securityFeatures.map((f, i) => (
                <div
                  key={f.id}
                  className="ghost-card"
                  style={{ '--hc': f.glow, padding: '18px 22px', gap: 8 } as React.CSSProperties}
                  onClick={() => { setSel(i); setTab(0) }}
                >
                  {/* Top-right external link */}
                  <div
                    className="ghost-open-icon"
                    onClick={(e) => { e.stopPropagation(); openOrFocus(`/system/security/${f.id}`, 'width=1440,height=900,menubar=no,toolbar=no') }}
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
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>{f.name}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                      background: `${statusBadgeColor(f.status)}12`, color: statusBadgeColor(f.status), letterSpacing: 1,
                    }}>
                      {statusLabel(f.status)}
                    </span>
                  </div>

                  {/* Type description (1 line) */}
                  <div style={{ fontSize: 12, color: 'var(--tx2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {f.desc.slice(0, 80)}
                  </div>

                  {/* Alert indicator */}
                  {f.alerts.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--a)', animation: 'lp 2s ease-in-out infinite', '--lc': 'var(--ag)' } as React.CSSProperties} />
                      <span style={{ fontSize: 10, color: 'var(--a)', fontWeight: 600 }}>{f.alerts.length} Alert{f.alerts.length > 1 ? 's' : ''}</span>
                    </div>
                  )}

                  {/* Color accent bar */}
                  <div style={{ width: 32, height: 3, borderRadius: 2, background: f.color, opacity: 0.5, marginTop: 2 }} />
                </div>
              ))}
            </div>
          </>
        }
        right={
          <PreviewPanel
            title={feat.name}
            ledColor={feat.color}
            ledGlow={feat.glow}
            badge={{ label: statusLabel(feat.status), bg: `${statusBadgeColor(feat.status)}18`, color: statusBadgeColor(feat.status) }}
            tabs={tabs}
            activeTab={tab}
            onTabChange={setTab}
            accentColor={feat.color}
            headerAction={
              <div
                className="ghost-btn"
                style={{ '--bc': `${feat.color}22`, padding: '5px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', width: 'auto', height: 'auto' } as React.CSSProperties}
                onClick={() => openOrFocus(`/system/security/${feat.id}`, 'width=1440,height=900,menubar=no,toolbar=no')}
              >
                <ExternalLink size={12} stroke={feat.color} />
                <span style={{ fontSize: 10, fontWeight: 700, color: feat.color }}>Oeffnen</span>
              </div>
            }
          />
        }
      />

      <BottomTicker
        label="SECURITY"
        ledColor="var(--t)"
        ledGlow="var(--tg)"
        items={tickerData.system}
      />
    </div>
  )
}
