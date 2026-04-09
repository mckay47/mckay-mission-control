import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Lightbulb, Settings, Briefcase, Heart, LayoutDashboard, Users2, FileText, Flame } from 'lucide-react'
import { Header } from '../shared/Header.tsx'
import { openOrFocus } from '../../lib/windowManager'
import { useMissionControl } from '../../lib/MissionControlProvider.tsx'
import type { useKaniStream } from '../../hooks/useKaniStream.ts'

interface Props {
  toggleTheme: () => void
  kaniStream: ReturnType<typeof useKaniStream>
}

const tiles = [
  { label: 'Projects',   desc: 'Alle Projekte, Status, Agents.',        color: 'var(--g)',  glow: 'var(--gg)',  icon: CheckCircle,      route: '/projects',   countKey: 'projects' as const, openWindow: false },
  { label: 'Thinktank',  desc: 'Ideen sammeln, bewerten, pushen.',      color: 'var(--p)',  glow: 'var(--pg)',  icon: Lightbulb,        route: '/thinktank',  countKey: 'ideas' as const, openWindow: false },
  { label: 'System',     desc: 'Agents, Skills, MCPs, Workflows.',      color: 'var(--o)',  glow: 'var(--og)',  icon: Settings,         route: '/system',     countKey: null, openWindow: false },
  { label: 'Office',     desc: 'Buchhaltung, Subscriptions, Kunden.',   color: 'var(--bl)', glow: 'var(--blg)', icon: Briefcase,        route: '/office',     countKey: null, openWindow: false },
  { label: 'Life',       desc: 'Wohnung, Familie, Gesundheit.',         color: 'var(--pk)', glow: 'var(--pkg)', icon: Heart,            route: '/life',       countKey: null, openWindow: false },
  { label: 'Hub',        desc: 'Kalender, Todos, E-Mails.',             color: 'var(--t)',  glow: 'var(--tg)',  icon: LayoutDashboard,  route: '/hub',        countKey: null, openWindow: false },
  { label: 'Network',    desc: 'Kontakte, Events, Opportunities.',      color: 'var(--g)',  glow: 'var(--gg)',  icon: Users2,           route: '/network',    countKey: null, openWindow: false },
  { label: 'Briefing',   desc: 'T\u00E4gliches Briefing, Reports.',     color: 'var(--a)',  glow: 'var(--ag)',  icon: FileText,         route: '/briefing',   countKey: null, openWindow: false },
  { label: 'Kitchen',    desc: 'Hier wird gekocht. Alle Terminals.',    color: '#FF4500',   glow: 'rgba(255,69,0,0.35)', icon: Flame,  route: '/terminals',  countKey: null, openWindow: true },
]

export function Cockpit({ toggleTheme, kaniStream }: Props) {
  const { projects, ideas } = useMissionControl()
  const nav = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const userScrolledRef = useRef(false)
  const [input, setInput] = useState('')
  const [voiceMode, setVoiceMode] = useState(false)
  const { lines, isThinking, sendPrompt } = kaniStream

  const [isLaunchAnim] = useState(() => sessionStorage.getItem('mckay-launching') === '1')
  const [showHeader, setShowHeader] = useState(() => sessionStorage.getItem('mckay-launching') !== '1')
  const [showLogo, setShowLogo] = useState(() => sessionStorage.getItem('mckay-launching') !== '1')
  const [showSubtitle, setShowSubtitle] = useState(() => sessionStorage.getItem('mckay-launching') !== '1')
  const [triggeredTiles, setTriggeredTiles] = useState<Set<number>>(() =>
    sessionStorage.getItem('mckay-launching') === '1' ? new Set<number>() : new Set<number>([0,1,2,3,4,5,6,7,8])
  )
  const [showInput, setShowInput] = useState(() => sessionStorage.getItem('mckay-launching') !== '1')
  const [typedPlaceholder, setTypedPlaceholder] = useState(() =>
    sessionStorage.getItem('mckay-launching') === '1' ? '' : 'Ready when you are'
  )
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const counts: Record<string, number> = {
    projects: projects.length,
    ideas: ideas.length,
  }

  // Auto-scroll to bottom unless user has manually scrolled up
  useEffect(() => {
    const el = terminalRef.current
    if (!el || userScrolledRef.current) return
    el.scrollTop = el.scrollHeight
  }, [lines])

  useEffect(() => {
    if (!isLaunchAnim) return
    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => setShowHeader(true), 500))
    timers.push(setTimeout(() => setShowLogo(true), 1400))
    timers.push(setTimeout(() => setShowSubtitle(true), 2600))
    tiles.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setTriggeredTiles(prev => new Set([...prev, i]))
      }, 3500 + i * 500))
    })
    timers.push(setTimeout(() => setShowInput(true), 6800))
    const fullText = 'Ready when you are'
    let charIndex = 0
    timers.push(setTimeout(() => {
      typingIntervalRef.current = setInterval(() => {
        charIndex++
        setTypedPlaceholder(fullText.slice(0, charIndex))
        if (charIndex >= fullText.length) {
          clearInterval(typingIntervalRef.current!)
          typingIntervalRef.current = null
          sessionStorage.removeItem('mckay-launching')
        }
      }, 70)
    }, 7300))
    return () => {
      timers.forEach(clearTimeout)
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
    }
  }, [])

  const send = () => {
    if (!input.trim()) return
    userScrolledRef.current = false
    sendPrompt(input.trim())
    setInput('')
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); send() }
  }

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', padding: '0 7.5% 24px', background: 'var(--bg)' }}>
      <div style={{ opacity: showHeader ? 1 : 0, transform: showHeader ? 'translateY(0)' : 'translateY(-10px)', transition: 'opacity 0.8s ease, transform 0.8s ease', pointerEvents: showHeader ? 'auto' : 'none' }}>
        <Header toggleTheme={toggleTheme} />
      </div>

      {/* Outer */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '5vh', gap: 40, background: 'var(--bg)' }}>

        {/* Centered block — Logo + Input + Tiles */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 44, width: '100%' }}>

        {/* MCKAY.OS Title */}
        <div style={{ textAlign: 'center', userSelect: 'none' }}>
          <div
            style={{
              fontFamily: "'Neuropol X', 'JetBrains Mono', monospace",
              fontSize: 'clamp(42px, 4.5vw, 72px)',
              fontWeight: 400,
              letterSpacing: 10,
              color: 'var(--tx)',
              lineHeight: 1,
              opacity: showLogo ? 1 : 0,
              transition: 'opacity 1.2s ease',
            }}
          >
            MCKAY.OS
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 7,
              color: 'var(--tx3)',
              marginTop: 20,
              textTransform: 'uppercase',
              opacity: showSubtitle ? 1 : 0,
              transition: 'opacity 1.2s ease',
            }}
          >
            MISSION CONTROL
          </div>
        </div>

          {/* KANI pill (außerhalb) + Input field */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              width: '100%',
              maxWidth: 640,
              opacity: showInput ? 1 : 0,
              transition: 'opacity 0.8s ease',
              pointerEvents: showInput ? 'auto' : 'none',
            }}
          >
            {/* KANI Voice Toggle */}
            <button
              onClick={() => setVoiceMode(v => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                flexShrink: 0,
                background: voiceMode ? 'rgba(139,92,246,0.18)' : 'rgba(139,92,246,0.06)',
                border: `1px solid ${voiceMode ? 'rgba(139,92,246,0.6)' : 'rgba(139,92,246,0.2)'}`,
                borderRadius: 20,
                padding: '5px 12px',
                cursor: 'pointer',
                transition: 'all 0.25s',
                boxShadow: voiceMode ? '0 0 12px rgba(139,92,246,0.3)' : 'none',
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'var(--p)',
                  boxShadow: voiceMode
                    ? '0 0 8px var(--p), 0 0 16px var(--pg), 0 0 24px rgba(139,92,246,0.4)'
                    : 'none',
                  transition: 'box-shadow 0.25s',
                } as React.CSSProperties}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  fontWeight: 700,
                  color: voiceMode ? 'var(--p)' : 'rgba(139,92,246,0.6)',
                  letterSpacing: 1.5,
                  transition: 'color 0.25s',
                }}
              >
                KANI
              </span>
            </button>

            {/* Input — eingedrückt, kein erhöhter Hintergrund */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--bg)',
                border: 'none',
                borderRadius: 12,
                padding: '10px 14px',
                cursor: 'text',
                boxShadow: 'inset 0 2px 6px var(--shd)',
              }}
              onClick={() => inputRef.current?.focus()}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={voiceMode ? 'Fn gedrückt halten und sprechen' : (isLaunchAnim && typedPlaceholder !== 'Ready when you are' ? typedPlaceholder : 'Ready when you are')}
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: input ? 'var(--g)' : 'var(--tx)',
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
                  opacity: input.trim() ? 0.8 : 0.2,
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
          </div>

          {/* 7 Ghost Tiles — single row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 'clamp(8px, 2.5vw, 60px)', width: '100%', background: 'var(--bg)' }}>
            {tiles.map((t, i) => {
              const Icon = t.icon
              const count = t.countKey ? counts[t.countKey] : null
              return (
                <div
                  key={t.label}
                  className={`ghost-tile${isLaunchAnim && triggeredTiles.has(i) ? ' boot-tile' : ''}`}
                  style={{ '--tc': t.color, ...(isLaunchAnim && !triggeredTiles.has(i) ? { opacity: 0 } : {}) } as React.CSSProperties}
                  onClick={() => t.openWindow ? openOrFocus(t.route, 'width=3440,height=1440,menubar=no,toolbar=no') : nav(t.route)}
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

        {/* Terminal Output */}
        <div
          ref={terminalRef}
          onScroll={() => {
            const el = terminalRef.current
            if (!el) return
            userScrolledRef.current = el.scrollHeight - el.scrollTop - el.clientHeight > 30
          }}
          style={{
            width: 'min(700px, 100%)',
            height: 160,
            overflowY: 'auto',
            background: 'var(--bg)',
            marginBottom: '5vh',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            lineHeight: 1.7,
            flexShrink: 0,
          }}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                color: line.type === 'prompt'
                  ? 'var(--g)'
                  : line.type === 'warning'
                  ? 'var(--o)'
                  : line.type === 'error'
                  ? '#ff5555'
                  : 'var(--tx2)',
                paddingLeft: line.type === 'prompt' ? 0 : 16,
              }}
            >
              {line.type === 'prompt' ? `~$ ${line.text}` : line.text}
            </div>
          ))}
          {isThinking && (
            <div style={{ color: 'var(--g)', opacity: 0.5 }}>▋</div>
          )}
        </div>
      </div>

    </div>
  )
}
