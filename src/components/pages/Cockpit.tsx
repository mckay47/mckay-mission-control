import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderKanban, Lightbulb, Settings, Briefcase, User, Globe, FileText } from 'lucide-react'
import { Header } from '../shared/Header.tsx'
import { BottomTicker } from '../shared/BottomTicker.tsx'
import { useMissionControl } from '../../lib/MissionControlProvider.tsx'
import { useKaniStream } from '../../hooks/useKaniStream.ts'

interface Props { toggleTheme: () => void }

const tiles = [
  { label: 'Projects',   desc: 'Alle Projekte, Status, Agents.',    color: 'var(--g)',  glow: 'var(--gg)',  icon: FolderKanban, route: '/projects',   countKey: 'projects' as const },
  { label: 'Thinktank',  desc: 'Ideen sammeln, bewerten, pushen.',  color: 'var(--p)',  glow: 'var(--pg)',  icon: Lightbulb,    route: '/thinktank',  countKey: 'ideas' as const },
  { label: 'System',     desc: 'Agents, Skills, MCPs, Workflows.',  color: 'var(--o)',  glow: 'var(--og)',  icon: Settings,     route: '/system',     countKey: null },
  { label: 'Backoffice', desc: 'Finanzen, Verträge, Rechnungen.',   color: 'var(--bl)', glow: 'var(--blg)', icon: Briefcase,    route: '/backoffice', countKey: null },
  { label: 'Personal',   desc: 'Todos, Notizen, Kalender.',         color: 'var(--pk)', glow: 'var(--pkg)', icon: User,         route: '/personal',   countKey: null },
  { label: 'Network',    desc: 'Kontakte, Partner, Leads.',         color: 'var(--t)',  glow: 'var(--tg)',  icon: Globe,        route: '/network',    countKey: null },
  { label: 'Briefing',   desc: 'Tägliches Briefing, Reports.',      color: 'var(--a)',  glow: 'var(--ag)',  icon: FileText,     route: '/briefing',   countKey: null },
]

export function Cockpit({ toggleTheme }: Props) {
  const { projects, ideas, tickerData } = useMissionControl()
  const nav = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [input, setInput] = useState('')
  const { sendPrompt } = useKaniStream({ cwd: '~/mckay-os', terminalId: 'cockpit' })

  const counts: Record<string, number> = {
    projects: projects.length,
    ideas: ideas.length,
  }

  const send = () => {
    if (!input.trim()) return
    sendPrompt(input.trim())
    setInput('')
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); send() }
  }

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header toggleTheme={toggleTheme} />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 52,
          padding: '0 40px',
        }}
      >
        {/* MCKAY.OS Title */}
        <div style={{ textAlign: 'center', userSelect: 'none' }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: 14,
              color: 'var(--tx)',
              lineHeight: 1,
            }}
          >
            MCKAY.OS
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 6,
              color: 'var(--tx3)',
              marginTop: 10,
              textTransform: 'uppercase',
            }}
          >
            MISSION CONTROL
          </div>
        </div>

        {/* KANI Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            width: 560,
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16,
            padding: '13px 18px',
            cursor: 'text',
          }}
          onClick={() => inputRef.current?.focus()}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--p)',
                boxShadow: '0 0 8px var(--pg)',
                animation: 'lp 3s ease-in-out infinite',
                '--lc': 'var(--pg)',
              } as React.CSSProperties}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--tx3)',
                letterSpacing: 1.5,
              }}
            >
              KANI
            </span>
          </div>

          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ready when you are"
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--tx)',
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
            }}
          />

          <button
            onClick={send}
            style={{
              background: 'none',
              border: 'none',
              cursor: input.trim() ? 'pointer' : 'default',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              opacity: input.trim() ? 0.8 : 0.25,
              transition: 'opacity 0.2s',
              flexShrink: 0,
            }}
          >
            <svg viewBox="0 0 24 24" stroke="var(--tx3)" fill="none" strokeWidth={1.8} style={{ width: 17, height: 17 }}>
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" fill="var(--tx3)" stroke="none" />
            </svg>
          </button>
        </div>

        {/* 7 Ghost Tiles — single row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 4 }}>
          {tiles.map((t) => {
            const Icon = t.icon
            const count = t.countKey ? counts[t.countKey] : null
            return (
              <div
                key={t.label}
                className="ghost-tile"
                style={{ '--tc': t.color } as React.CSSProperties}
                onClick={() => nav(t.route)}
              >
                <div className="tile-icon">
                  <Icon />
                  {count !== null && count > 0 && (
                    <div
                      className="tile-led"
                      style={{ background: t.color, '--lc': t.glow } as React.CSSProperties}
                    />
                  )}
                </div>
                <div className="tile-name">{t.label}</div>
                <div className="tile-desc">{t.desc}</div>
              </div>
            )
          })}
        </div>
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
