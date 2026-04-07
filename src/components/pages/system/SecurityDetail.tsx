import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FlaskConical, Settings, FileText, ToggleRight, Moon } from 'lucide-react'
import { StampButton } from '../../shared/StampButton.tsx'
import { Clock } from '../../shared/Clock.tsx'
import { SplitLayout } from '../../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText, TcStatRow, TcStat } from '../../shared/PreviewPanel.tsx'
import { BottomTicker } from '../../shared/BottomTicker.tsx'
import { Terminal } from '../../shared/Terminal.tsx'
import { useMissionControl } from '../../../lib/MissionControlProvider.tsx'

interface Props { toggleTheme: () => void }

const securityRules: Record<string, string[]> = {
  'safety-guard': [
    'Block any file matching .env* pattern',
    'Block credentials.json, *.pem, *.key files',
    'Scan for hardcoded API keys in source code',
    'Alert on Supabase service_role key exposure',
    'No override mechanism — always block',
  ],
  'smart-yolo': [
    'Auto-approve all read-only operations',
    'Auto-approve git add, commit, status, diff',
    'Require manual approval for destructive git ops',
    'Block rm -rf with root path always',
    'Log all auto-approved and blocked actions',
  ],
  killswitch: [
    'Halt all running agent processes immediately',
    'Prevent any new task assignments',
    'Save current state to recovery log',
    'Require manual reboot to resume operations',
    'Send notification to all active terminals',
  ],
  rls: [
    'Default policy: DENY ALL on every table',
    'Allow SELECT where auth.uid() = user_id',
    'Allow INSERT where auth.uid() = user_id',
    'Admin role bypasses RLS via service_role key',
    'Multi-tenant isolation via tenant_id column',
  ],
}


const statusLabel = (s: string) => s === 'active' ? 'Aktiv' : s === 'standby' ? 'Standby' : 'Critical'
const statusBadgeColor = (s: string) => s === 'active' ? 'var(--g)' : s === 'standby' ? 'var(--a)' : 'var(--r)'
const logLevelColor = (l: string) => l === 'info' ? 'var(--bl)' : l === 'warn' ? 'var(--a)' : 'var(--r)'
const severityColor = (s: string) => s === 'low' ? 'var(--g)' : s === 'medium' ? 'var(--a)' : 'var(--r)'

const quickActions = [
  { label: 'Testen', icon: FlaskConical, color: 'var(--g)', border: 'var(--g)' },
  { label: 'Config', icon: Settings, color: 'var(--bl)', border: 'var(--bl)' },
  { label: 'Logs', icon: FileText, color: 'var(--a)', border: 'var(--a)' },
  { label: 'Toggle', icon: ToggleRight, color: 'var(--p)', border: 'var(--p)' },
]

export function SecurityDetail({ toggleTheme }: Props) {
  const { securityFeatures, tickerData } = useMissionControl()
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const [tab, setTab] = useState(0)

  const feature = securityFeatures.find(f => f.id === id)
  if (!feature) {
    return (
      <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--tx3)' }}>Security Feature nicht gefunden</div>
        <button className="open-btn" style={{ marginTop: 20 }} onClick={() => nav('/system/security')}>Zurueck zu Security</button>
      </div>
    )
  }

  const sLabel = statusLabel(feature.status)
  const sColor = statusBadgeColor(feature.status)
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null)

  const tabs = [
    {
      label: 'Next Actions',
      content: (
        <>
          <TcLabel>Suggested Actions</TcLabel>
          {[
            { title: 'Feature testen', prompt: `kani security ${feature.id} --test` },
            { title: 'Config anzeigen', prompt: `kani security ${feature.id} --config` },
            { title: 'Logs pruefen', prompt: `kani security ${feature.id} --logs` },
          ].map((s, i) => (
            <div key={i} className="ghost-card" style={{ padding: '8px 12px', gap: 0, cursor: 'pointer', '--hc': feature.glow, flexDirection: 'row', alignItems: 'center' } as React.CSSProperties}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${feature.color}18`, color: feature.color, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', marginLeft: 10, flex: 1 }}>{s.title}</span>
            </div>
          ))}
          <TcLabel>Security Rules</TcLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(securityRules[feature.id] || []).map((r, i) => (
              <div key={i} className="ghost-card" style={{ padding: '12px 16px', borderRadius: 12, fontSize: 13, color: 'var(--tx2)', display: 'flex', alignItems: 'center', gap: 10, '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: feature.color, flexShrink: 0 }} />
                {r}
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      label: 'Logs',
      content: (
        <>
          <TcLabel>Recent Logs</TcLabel>
          {feature.logs.map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '8px 0' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)', whiteSpace: 'nowrap' }}>{l.time}</span>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: logLevelColor(l.level), marginTop: 5, flexShrink: 0 }} />
              <TcText>{l.text}</TcText>
            </div>
          ))}
          {feature.alerts.length > 0 && (
            <>
              <TcLabel>Active Alerts</TcLabel>
              {feature.alerts.map((a, i) => (
                <div key={i} className="ghost-card" style={{ padding: '14px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: severityColor(a.severity), flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--tx2)', flex: 1 }}>{a.text}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: `${severityColor(a.severity)}18`, color: severityColor(a.severity) }}>
                    {a.severity}
                  </span>
                </div>
              ))}
            </>
          )}
        </>
      ),
    },
    {
      label: 'KPI',
      content: (
        <>
          <TcLabel>Security Metrics</TcLabel>
          <TcStatRow>
            <TcStat value="0" label="Critical" color="var(--g)" />
            <TcStat value={feature.alerts.length.toString()} label="Active Alerts" color={feature.alerts.length > 0 ? 'var(--a)' : 'var(--g)'} />
            <TcStat value="12" label="Resolved" color="var(--bl)" />
          </TcStatRow>
          <TcLabel>Configuration</TcLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {feature.config.map((c, i) => (
              <div key={i} className="ghost-card" style={{ padding: '12px 16px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)' }}>{c.key}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: feature.color }}>{c.value}</span>
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
              <strong style={{ color: 'var(--tx)' }}>{feature.name}</strong> — {feature.desc}
            </p>
            <p style={{ marginBottom: 12 }}>
              Status: <span style={{ color: sColor, fontWeight: 700 }}>{sLabel}</span> | Alerts: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{feature.alerts.length}</span> | Rules: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{(securityRules[feature.id] || []).length}</span>
            </p>
            <p>
              Config: {feature.config.map(c => `${c.key}: ${c.value}`).join(' | ')}
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
              title={`${feature.id} — security`}
              statusLabel={sLabel}
              statusColor={sColor}
              statusGlow={sColor.replace(')', 'g)')}
              placeholder={`kani security ${feature.id} → ...`}
              mode="live"
              cwd="~/mckay-os/"
              terminalId={`security:${feature.id}`}
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
            title={feature.name}
            ledColor={feature.color}
            ledGlow={feature.glow}
            badge={{ label: sLabel, bg: `${sColor}18`, color: sColor }}
            tabs={tabs}
            activeTab={tab}
            onTabChange={setTab}
            accentColor={feature.color}
          />
        }
      />

      <BottomTicker
        label={feature.name.toUpperCase()}
        ledColor={feature.color}
        ledGlow={feature.glow}
        items={tickerData.system}
      />
    </div>
  )
}
