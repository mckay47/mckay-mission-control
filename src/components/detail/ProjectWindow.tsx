import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Background from '../layout/Background'
import { PROJ, TODOS, IDEAS } from '../../lib/data'
import { ToastProvider, useToast } from '../Toast'

interface TermLine {
  ts: string
  msg: string
  type: 'info' | 'ok' | 'cmd' | 'warn' | ''
}

const RESPONSES = [
  'Verstanden. Ich arbeite daran.',
  'Done. N\u00e4chster Schritt vorbereitet.',
  'Analyse l\u00e4uft \u2014 Ergebnis in ~30s.',
  'Gute Frage. Ich pr\u00fcfe das.',
  'Build gestartet. ETA: 2 Minuten.',
]

function now(): string {
  return new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

function ProjectWindowInner() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const project = PROJ.find(p => p.id === id) || PROJ[0]
  const [termLog, setTermLog] = useState<TermLine[]>([])
  const [input, setInput] = useState('')
  const [sideTab, setSideTab] = useState<'todos' | 'ideas'>('todos')
  const logRef = useRef<HTMLDivElement>(null)

  // Build initial log
  useEffect(() => {
    if (!project) return
    setTermLog([
      { ts: now(), msg: `KANI Terminal f\u00fcr ${project.n} gestartet`, type: 'info' },
      { ts: now(), msg: 'Projekt-Context geladen \u00b7 CLAUDE.md \u2713', type: 'ok' },
      { ts: now(), msg: `Memory: ${project.n} \u00b7 ${project.phase}`, type: 'info' },
      { ts: now(), msg: `\u276f Was ist der aktuelle Status von ${project.n}?`, type: 'cmd' },
      { ts: now(), msg: `${project.pct}% abgeschlossen. Letzter Schritt: ${project.last}`, type: 'ok' },
      { ts: now(), msg: `N\u00e4chster Schritt: ${project.next}`, type: 'ok' },
      { ts: now(), msg: `Stack: ${project.stack}`, type: 'info' },
    ])
  }, [project])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [termLog])

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') navigate(-1) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  const handleSend = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    const txt = input.trim()
    if (!txt) return
    const t = now()
    setTermLog(prev => [...prev, { ts: t, msg: `\u276f ${txt}`, type: 'cmd' }, { ts: '', msg: 'KANI analysiert...', type: 'info' }])
    setInput('')
    setTimeout(() => {
      const resp = RESPONSES[Math.floor(Math.random() * RESPONSES.length)]
      setTermLog(prev => [...prev.filter(l => l.msg !== 'KANI analysiert...'), { ts: now(), msg: resp, type: 'ok' }])
    }, 1200)
  }, [input])

  if (!project) return null

  const projTodos = TODOS.filter(t => t.proj === project.id)
  const projIdeas = IDEAS.slice(0, 5)

  const COLOR_MAP: Record<string, string> = {
    'var(--bl)': 'cyan', 'var(--a)': 'orange', 'var(--c)': 'cyan', 'var(--g)': 'green', 'var(--p)': 'purple', 'var(--o)': 'orange', 'var(--r)': 'red'
  }
  const accentColor = COLOR_MAP[project.col] || 'cyan'

  return (
    <>
      <Background />
      <div style={{ width: '100vw', height: '100vh', padding: '3vh 4vw', display: 'grid', gridTemplateColumns: '1fr 320px', gridTemplateRows: '56px 1fr', gap: 18, fontFamily: 'var(--font-ui)', color: 'var(--text-primary)' }}>

        {/* Header */}
        <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 16, padding: '0 8px' }}>
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 20, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-ui)', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
            <svg viewBox="0 0 24 24" width={14} height={14} stroke="currentColor" strokeWidth={2} fill="none"><polyline points="15 18 9 12 15 6" /></svg>
            Zur{'\u00fc'}ck
            <kbd style={{ fontSize: 8, padding: '2px 5px', background: 'rgba(0,0,0,0.4)', borderRadius: 4, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ESC</kbd>
          </button>

          <span style={{ width: 10, height: 10, borderRadius: '50%', background: `var(--${accentColor})`, animation: 'dotPulse 3s ease-in-out infinite', color: `var(--${accentColor})` }} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{project.n}</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{project.dom} {'\u00b7'} {project.stack}</div>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 8, padding: '4px 10px', borderRadius: 14, background: `rgba(${accentColor === 'green' ? '52,211,153' : accentColor === 'cyan' ? '45,212,191' : accentColor === 'purple' ? '167,139,250' : accentColor === 'orange' ? '251,191,36' : '248,113,113'},0.15)`, color: `var(--${accentColor})`, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1 }}>{project.phase}</span>
            <button onClick={() => toast('Deploy gestartet...')} style={{ padding: '7px 16px', borderRadius: 10, fontSize: 9, fontWeight: 600, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg viewBox="0 0 24 24" width={10} height={10} stroke="currentColor" strokeWidth={2} fill="none"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /></svg>
              Deploy
            </button>
            <button onClick={() => toast('Terminal fokussiert')} style={{ padding: '7px 16px', borderRadius: 10, fontSize: 9, fontWeight: 600, border: 'none', background: `linear-gradient(135deg, var(--${accentColor}), var(--purple))`, color: 'var(--bg-dark)', cursor: 'pointer', boxShadow: `0 0 20px var(--${accentColor}-glow)`, display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg viewBox="0 0 24 24" width={10} height={10} stroke="currentColor" strokeWidth={2} fill="none"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>
              Terminal
            </button>
          </div>
        </div>

        {/* Main: KPIs + Terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, overflow: 'hidden' }}>
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, flexShrink: 0 }}>
            {([
              [project.pct + '%', 'Fortschritt', accentColor],
              [project.tkn + 'K', 'Tokens', 'orange'],
              [String(project.todos), 'Todos', 'red'],
              ['\u20ac' + project.cost.toFixed(2), 'Kosten/Mo', 'orange'],
              [project.rev + 'K', 'Rev/Jahr', 'green'],
            ] as const).map(([val, label, col]) => (
              <div key={label} style={{ background: 'var(--bg-card)', backdropFilter: 'blur(8px)', borderRadius: 14, border: '1px solid var(--border)', padding: '14px 16px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)', color: `var(--${col})`, textShadow: `0 0 12px var(--${col}-glow)` }}>{val}</div>
                <div style={{ fontSize: 8, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: 1, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Terminal */}
          <div style={{ flex: 1, background: 'rgba(5,10,15,0.6)', backdropFilter: 'blur(8px)', borderRadius: 16, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', flexShrink: 0 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 12px var(--green-glow)', animation: 'dotPulse 2s ease-in-out infinite' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>KANI Terminal</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginLeft: 'auto' }}>claude-opus-4-6 {'\u00b7'} {project.n}</span>
            </div>
            <div ref={logRef} style={{ flex: 1, overflowY: 'auto', padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {termLog.map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, fontSize: 11, fontFamily: 'var(--font-mono)', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--text-muted)', width: 42, flexShrink: 0, textAlign: 'right' }}>{line.ts}</span>
                  <span style={{ color: line.type === 'cmd' ? 'var(--cyan)' : line.type === 'ok' ? 'var(--green)' : line.type === 'warn' ? 'var(--orange)' : 'var(--text-secondary)' }}>{line.msg}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                <span style={{ width: 42, flexShrink: 0 }} />
                <span style={{ width: 8, height: 16, background: 'var(--cyan)', animation: 'timerPulse 1s ease-in-out infinite', borderRadius: 1 }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--cyan)' }}>{'\u276f'}</span>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleSend}
                placeholder="Prompt an KANI..."
                autoFocus
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 12, fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar: Todos + Ideas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, overflow: 'hidden' }}>
          {/* Tab Switcher */}
          <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.02)', padding: 3, borderRadius: 12, flexShrink: 0 }}>
            <button onClick={() => setSideTab('todos')} style={{ flex: 1, padding: '8px 0', fontSize: 9, fontWeight: 600, borderRadius: 10, border: 'none', cursor: 'pointer', background: sideTab === 'todos' ? 'rgba(45,212,191,0.12)' : 'transparent', color: sideTab === 'todos' ? 'var(--cyan)' : 'var(--text-muted)', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', textTransform: 'uppercase' as const, letterSpacing: 1 }}>Todos ({projTodos.length})</button>
            <button onClick={() => setSideTab('ideas')} style={{ flex: 1, padding: '8px 0', fontSize: 9, fontWeight: 600, borderRadius: 10, border: 'none', cursor: 'pointer', background: sideTab === 'ideas' ? 'rgba(167,139,250,0.12)' : 'transparent', color: sideTab === 'ideas' ? 'var(--purple)' : 'var(--text-muted)', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', textTransform: 'uppercase' as const, letterSpacing: 1 }}>Ideas ({projIdeas.length})</button>
          </div>

          {/* Content */}
          <div style={{ flex: 1, background: 'var(--bg-card)', backdropFilter: 'blur(8px)', borderRadius: 16, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: sideTab === 'todos' ? 'var(--cyan)' : 'var(--purple)', animation: 'dotPulse 3s ease-in-out infinite' }} />
              <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 2 }}>{sideTab === 'todos' ? 'Projekt Todos' : 'Projekt Ideen'}</span>
              <button style={{ marginLeft: 'auto', padding: '4px 12px', borderRadius: 8, fontSize: 8, fontWeight: 600, border: 'none', background: 'linear-gradient(135deg, var(--cyan), var(--green))', color: 'var(--bg-dark)', cursor: 'pointer' }}>+ Neu</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {sideTab === 'todos' ? (
                projTodos.length === 0 ? (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: 20, textAlign: 'center' }}>Keine Todos f{'\u00fc'}r dieses Projekt</div>
                ) : projTodos.map(t => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(10,20,25,0.18)', borderRadius: 10, border: `1px solid ${t.ov ? 'rgba(248,113,113,0.2)' : 'var(--border)'}`, borderLeft: `3px solid ${t.prio === 'h' ? 'var(--red)' : t.prio === 'm' ? 'var(--orange)' : 'var(--green)'}`, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
                    <div style={{ width: 14, height: 14, borderRadius: 4, border: t.done ? 'none' : '2px solid var(--text-muted)', background: t.done ? 'var(--green)' : 'transparent', boxShadow: t.done ? '0 0 8px var(--green-glow)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#fff', fontWeight: 700, flexShrink: 0 }}>{t.done ? '\u2713' : ''}</div>
                    <span style={{ flex: 1, fontSize: 10, color: 'var(--text-primary)', textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? 0.5 : 1 }}>{t.txt}</span>
                    {t.due && <span style={{ fontSize: 7, padding: '2px 6px', borderRadius: 4, background: t.ov ? 'rgba(248,113,113,0.12)' : 'rgba(255,255,255,0.04)', color: t.ov ? 'var(--red)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{t.due}</span>}
                  </div>
                ))
              ) : (
                projIdeas.map((idea, i) => (
                  <div key={i} style={{ padding: '10px 12px', background: 'rgba(10,20,25,0.18)', borderRadius: 10, border: '1px solid var(--border)', borderLeft: `3px solid ${idea.col}`, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>{idea.n}</div>
                    <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 3 }}>{idea.cat} {'\u00b7'} {idea.st}</div>
                    {idea.txt && <div style={{ fontSize: 9, color: 'var(--text-secondary)', marginTop: 5, lineHeight: 1.5, maxHeight: 36, overflow: 'hidden' }}>{idea.txt}</div>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function ProjectWindow() {
  return (
    <ToastProvider>
      <ProjectWindowInner />
    </ToastProvider>
  )
}
