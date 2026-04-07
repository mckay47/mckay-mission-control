import { useState } from 'react'
import { Header } from '../../shared/Header.tsx'
import { SplitLayout } from '../../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText, TcStatRow, TcStat } from '../../shared/PreviewPanel.tsx'
import { BottomTicker } from '../../shared/BottomTicker.tsx'
import { StatusLed } from '../../ui/StatusLed.tsx'
import { useMissionControl } from '../../../lib/MissionControlProvider.tsx'

interface Props { toggleTheme: () => void }

const statusLabel = (s: string) => s === 'connected' ? 'Connected' : s === 'idle' ? 'Idle' : 'Error'
const statusColor = (s: string) => s === 'connected' ? 'var(--g)' : s === 'idle' ? 'var(--a)' : 'var(--r)'

export function SystemMcps({ toggleTheme }: Props) {
  const { mcpServers, tickerData } = useMissionControl()
  const [sel, setSel] = useState(0)
  const [tab, setTab] = useState(0)

  const mcp = mcpServers[sel]

  const tabs = [
    {
      label: 'Live',
      content: (
        <>
          <TcLabel>Connection</TcLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <StatusLed color={statusColor(mcp.status)} glow={statusColor(mcp.status).replace(')', 'g)')} animate={mcp.status === 'connected'} size={10} />
            <span style={{ fontSize: 14, fontWeight: 700, color: statusColor(mcp.status) }}>{statusLabel(mcp.status)}</span>
          </div>
          <TcText>{mcp.desc}</TcText>
          <TcLabel>Usage Stats</TcLabel>
          <TcStatRow>
            {mcp.stats.map((s, i) => (
              <TcStat key={i} value={s.value} label={s.label} color={s.color} />
            ))}
          </TcStatRow>
          <TcLabel>Configuration</TcLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mcp.config.map((c, i) => (
              <div key={i} className="ghost-card" style={{ padding: '12px 16px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)' }}>{c.key}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: mcp.color }}>{c.value}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      label: 'Tools',
      content: (
        <>
          <TcLabel>Available Tools ({mcp.tools.length})</TcLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {mcp.tools.map((t, i) => (
              <span key={i} style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
                padding: '6px 14px', borderRadius: 10, background: `${mcp.color}18`, color: mcp.color,
              }}>
                {t}
              </span>
            ))}
          </div>
        </>
      ),
    },
    {
      label: 'Stats',
      content: (
        <>
          <TcLabel>Connection Status</TcLabel>
          <TcStatRow>
            <TcStat value={statusLabel(mcp.status)} label="Status" color={statusColor(mcp.status)} />
          </TcStatRow>
          <TcLabel>Usage Stats</TcLabel>
          <TcStatRow>
            {mcp.stats.map((s, i) => (
              <TcStat key={i} value={s.value} label={s.label} color={s.color} />
            ))}
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
              <strong style={{ color: 'var(--tx)' }}>{mcp.name}</strong> — {mcp.desc}
            </p>
            <p style={{ marginBottom: 12 }}>
              Status: <span style={{ color: statusColor(mcp.status), fontWeight: 700 }}>{statusLabel(mcp.status)}</span> | Tools: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{mcp.tools.length}</span>
            </p>
            <p>
              Stats: {mcp.stats.map(s => `${s.label}: ${s.value}`).join(' | ')}
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
              <span className="st">MCP Servers</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>{mcpServers.length} Servers</span>
            </div>

            {/* MCP cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {mcpServers.map((m, i) => (
                <div
                  key={m.id}
                  className="ghost-card"
                  style={{ '--hc': m.glow, padding: '18px 22px', gap: 8 } as React.CSSProperties}
                  onClick={() => { setSel(i); setTab(0) }}
                >
                  {/* Name + Status LED */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StatusLed color={statusColor(m.status)} glow={statusColor(m.status).replace(')', 'g)')} animate={m.status === 'connected'} size={7} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>{m.name}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                      background: `${statusColor(m.status)}12`, color: statusColor(m.status), letterSpacing: 1,
                    }}>
                      {statusLabel(m.status)}
                    </span>
                  </div>

                  {/* Tool count */}
                  <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: m.color }}>{m.tools.length}</span> Tools
                  </div>

                  {/* Scope badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                      background: `${m.color}11`, color: m.color,
                    }}>
                      {m.config.find(c => c.key === 'Protocol')?.value || 'Global'}
                    </span>
                  </div>

                  {/* Color accent bar */}
                  <div style={{ width: 32, height: 3, borderRadius: 2, background: m.color, opacity: 0.5, marginTop: 2 }} />
                </div>
              ))}
            </div>
          </>
        }
        right={
          <PreviewPanel
            title={mcp.name}
            ledColor={mcp.color}
            ledGlow={mcp.glow}
            badge={{ label: statusLabel(mcp.status), bg: `${statusColor(mcp.status)}18`, color: statusColor(mcp.status) }}
            tabs={tabs}
            activeTab={tab}
            onTabChange={setTab}
            accentColor={mcp.color}
          />
        }
      />

      <BottomTicker
        label="MCPs"
        ledColor="var(--g)"
        ledGlow="var(--gg)"
        items={tickerData.system}
      />
    </div>
  )
}
