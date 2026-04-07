import { useNavigate } from 'react-router-dom'
import { FolderKanban, Lightbulb, Settings, Briefcase, User, Globe, FileText } from 'lucide-react'
import { Header } from '../shared/Header.tsx'
import { BottomTicker } from '../shared/BottomTicker.tsx'
import { useMissionControl } from '../../lib/MissionControlProvider.tsx'

interface Props { toggleTheme: () => void }

const tiles = [
  { label: 'Projekte', desc: 'Alle Projekte, Status, Pipeline, Agents.', color: 'var(--g)', glow: 'var(--gg)', icon: FolderKanban, route: '/projects', countKey: 'projects' as const },
  { label: 'Thinktank', desc: 'Ideen sammeln, bewerten, promoten.', color: 'var(--p)', glow: 'var(--pg)', icon: Lightbulb, route: '/thinktank', countKey: 'ideas' as const },
  { label: 'System', desc: 'Agents, Skills, MCPs, Workflows, Security.', color: 'var(--o)', glow: 'var(--og)', icon: Settings, route: '/system', countKey: null },
  { label: 'Backoffice', desc: 'Buchhaltung, Finanzen, Verträge, Rechnungen.', color: 'var(--bl)', glow: 'var(--blg)', icon: Briefcase, route: '/backoffice', countKey: null },
  { label: 'Personal', desc: 'Todos, Notizen, Kalender, Compose.', color: 'var(--pk)', glow: 'var(--pkg)', icon: User, route: '/personal', countKey: null },
  { label: 'Network', desc: 'Kontakte, Partner, Leads, Events.', color: 'var(--t)', glow: 'var(--tg)', icon: Globe, route: '/network', countKey: null },
  { label: 'Briefing', desc: 'Tägliches Briefing, Reports, Highlights.', color: 'var(--a)', glow: 'var(--ag)', icon: FileText, route: '/briefing', countKey: null },
]

export function Cockpit({ toggleTheme }: Props) {
  const { projects, ideas, tickerData } = useMissionControl()
  const nav = useNavigate()

  const counts: Record<string, number> = {
    projects: projects.length,
    ideas: ideas.length,
  }

  return (
    <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header toggleTheme={toggleTheme} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, maxWidth: 1100, width: '100%' }}>
          {tiles.map(t => {
            const Icon = t.icon
            const count = t.countKey ? counts[t.countKey] : null
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
                  position: 'relative',
                }}>
                  <Icon size={28} stroke={t.color} strokeWidth={1.4} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>{t.label}</div>
                <div className="ghost-desc" style={{ fontSize: 12, color: 'var(--tx3)', lineHeight: 1.5 }}>{t.desc}</div>
                {count !== null && (
                  <div style={{ fontSize: 11, fontWeight: 600, color: t.color, marginTop: 4, fontFamily: "'JetBrains Mono'" }}>
                    {count} {t.countKey === 'projects' ? 'Projekte' : 'Ideen'}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <input
          className="in"
          placeholder="mckay.os/kani → ..."
          style={{ maxWidth: 600, width: '100%' }}
          onKeyDown={e => { if (e.key === 'Enter') e.preventDefault() }}
        />
      </div>

      <BottomTicker
        label="COCKPIT"
        ledColor="var(--g)"
        ledGlow="var(--gg)"
        items={tickerData.cockpit || []}
      />
    </div>
  )
}
