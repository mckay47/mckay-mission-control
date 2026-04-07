import { useNavigate } from 'react-router-dom'
import { Users, Activity, Clock as ClockIcon, Lock, Settings, Briefcase, Monitor } from 'lucide-react'
import { Header } from '../shared/Header.tsx'
import { BottomTicker } from '../shared/BottomTicker.tsx'
import { StatusLed } from '../ui/StatusLed.tsx'
import { useMissionControl } from '../../lib/MissionControlProvider.tsx'

interface Props { toggleTheme: () => void }

const tiles = [
  { label: 'Agents & Skills', desc: '5 Agents, 3 aktiv. Build, Research, Test, Deploy, SEO.', color: 'var(--o)', glow: 'var(--og)', icon: Users, hasLed: true, route: '/system/agents' },
  { label: 'Performance', desc: '142 Tasks erledigt. 98% Erfolgsrate. 48h Runtime.', color: 'var(--bl)', glow: 'var(--blg)', icon: Activity, hasLed: false, route: '/system/performance' },
  { label: 'Workflows', desc: 'Idee→Projekt Pipeline, Build→Deploy, Research→Score.', color: 'var(--p)', glow: 'var(--pg)', icon: ClockIcon, hasLed: false, route: '/system/workflows' },
  { label: 'Security', desc: 'Lokal only. Keine Cloud. API Keys verschlüsselt.', color: 'var(--t)', glow: 'var(--tg)', icon: Lock, hasLed: false, route: '/system/security' },
  { label: 'MCPs / CLIs', desc: 'Claude Code, MCP Servers, Tools, Extensions.', color: 'var(--g)', glow: 'var(--gg)', icon: Settings, hasLed: false, route: '/system/mcps' },
  { label: 'Departments', desc: 'Buchhaltung, Marketing, HR, Network, Partners.', color: 'var(--a)', glow: 'var(--ag)', icon: Briefcase, hasLed: false, route: '/system/departments' },
]

export function System({ toggleTheme }: Props) {
  const { tickerData } = useMissionControl()
  const nav = useNavigate()

  return (
    <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        toggleTheme={toggleTheme}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, maxWidth: 900, width: '100%' }}>
          {tiles.map(t => {
            const Icon = t.icon
            return (
              <div
                key={t.label}
                className="ghost-card"
                onClick={() => nav(t.route)}
                style={{ '--hc': t.glow, alignItems: 'center', textAlign: 'center', padding: '32px', cursor: 'pointer' } as React.CSSProperties}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative'
                }}>
                  {t.hasLed && (
                    <div style={{ position: 'absolute', top: 4, right: 4 }}>
                      <StatusLed color="var(--g)" glow="var(--gg)" animate size={7} />
                    </div>
                  )}
                  <Icon size={28} stroke={t.color} strokeWidth={1.4} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>{t.label}</div>
                <div className="ghost-desc" style={{ fontSize: 12, color: 'var(--tx3)', lineHeight: 1.5 }}>{t.desc}</div>
              </div>
            )
          })}
        </div>

        <button
          onClick={() => window.open('/terminals', '_blank', 'width=3440,height=1440,menubar=no,toolbar=no')}
          style={{
            padding: '16px 32px', borderRadius: 16, fontSize: 14, fontWeight: 700,
            cursor: 'pointer', border: '2px solid var(--o)', color: 'var(--o)',
            background: 'linear-gradient(145deg, var(--sft), var(--sf))',
            boxShadow: '4px 4px 10px var(--shd), -3px -3px 8px var(--shl)',
            display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit'
          }}
        >
          <Monitor size={20} strokeWidth={1.8} />
          Alle Terminals anzeigen
        </button>
      </div>

      <BottomTicker
        label="SYSTEM"
        ledColor="var(--o)"
        ledGlow="var(--og)"
        items={tickerData.system}
      />
    </div>
  )
}
