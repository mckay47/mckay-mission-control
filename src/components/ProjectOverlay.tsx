import { useState, useRef, useEffect, useCallback } from 'react'
import type { Project } from '../lib/types'
import { TODOS, IDEAS } from '../lib/data'
import { useToast } from './Toast'

interface ProjectOverlayProps {
  project: Project
  onClose: () => void
  onOpenTodoModal: () => void
  onOpenThoughtModal: () => void
}

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
]

function now(): string {
  return new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

function buildInitialLog(p: Project): TermLine[] {
  return [
    { ts: '09:41', msg: `KANI Terminal f\u00fcr ${p.n} gestartet`, type: 'info' },
    { ts: '09:41', msg: 'Projekt-Context geladen \u00b7 CLAUDE.md \u2713', type: 'ok' },
    { ts: '09:40', msg: `Memory: ${p.n} \u00b7 Phase ${p.phN}`, type: 'info' },
    { ts: '09:38', msg: `\u276f Was ist der aktuelle Status von ${p.n}?`, type: 'cmd' },
    { ts: '09:38', msg: `${p.pct}% abgeschlossen. Letzter Schritt: ${p.last}`, type: 'ok' },
    { ts: '09:38', msg: `N\u00e4chster Schritt: ${p.next}`, type: 'ok' },
    { ts: '09:38', msg: `Stack: ${p.stack}`, type: 'info' },
    { ts: '09:38', msg: `URL: https://${p.dom} \u2197`, type: 'info' },
  ]
}

export default function ProjectOverlay({ project, onClose, onOpenTodoModal, onOpenThoughtModal }: ProjectOverlayProps) {
  const { toast } = useToast()
  const [termLog, setTermLog] = useState<TermLine[]>(() => buildInitialLog(project))
  const [input, setInput] = useState('')
  const logRef = useRef<HTMLDivElement>(null)

  // Reset terminal when project changes
  useEffect(() => {
    setTermLog(buildInitialLog(project))
    setInput('')
  }, [project])

  // Auto-scroll terminal
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [termLog])

  const handleTermSend = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    const txt = input.trim()
    if (!txt) return

    const t = now()
    setTermLog(prev => [
      ...prev,
      { ts: t, msg: `\u276f ${txt}`, type: 'cmd' },
      { ts: '', msg: 'KANI analysiert...', type: 'info' },
    ])
    setInput('')

    setTimeout(() => {
      const resp = RESPONSES[Math.floor(Math.random() * RESPONSES.length)]
      setTermLog(prev => [
        ...prev.filter(l => l.msg !== 'KANI analysiert...'),
        { ts: t, msg: resp, type: 'ok' },
      ])
      toast(`Terminal: ${resp}`)
    }, 1200)
  }, [input, toast])

  // Project-specific todos
  const projTodos = TODOS.filter(t => t.proj === project.id)
  // First 3 ideas
  const projIdeas = IDEAS.slice(0, 3)

  // KPI data
  const kpis: [string, string, string][] = [
    [`${project.pct}%`, 'Fortschritt', project.col],
    [`${project.tkn}K`, 'Tokens', 'var(--a)'],
    [`${project.todos}`, 'Todos offen', 'var(--r)'],
    [`\u20ac${project.cost.toFixed(2)}`, 'Kosten/Mo', 'var(--a)'],
    [`${project.rev}K`, 'Rev/Jahr', 'var(--g)'],
  ]

  const phaseBadgeClass = (project.health === 'Live' || project.health === 'Healthy') ? 'bg' : project.health === 'Attention' ? 'ba' : 'br'

  return (
    <div
      id="proj-overlay"
      className="show"
      style={{ display: 'grid', gridTemplateRows: '50px 1fr', gridTemplateColumns: '1fr' }}
    >
      {/* HEADER */}
      <div className="po-header">
        <button className="po-back" onClick={onClose}>{'\u2190'} Zur{'\u00fc'}ck</button>
        <div style={{ fontSize: 20 }}>{project.e}</div>
        <div>
          <div className="po-title">{project.n}</div>
          <div className="po-domain">{project.dom}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className={`bdg ${phaseBadgeClass}`}>{project.phase}</span>
          <button
            className="abtn s"
            style={{ margin: 0, padding: '5px 14px', fontSize: 10, width: 'auto' }}
            onClick={() => toast('Deploy gestartet...')}
          >
            {'\u2197'} Deploy
          </button>
          <button
            className="abtn p"
            style={{ margin: 0, padding: '5px 14px', fontSize: 10, width: 'auto' }}
            onClick={() => toast('Terminal startet...')}
          >
            {'\u25b6'} Terminal
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="po-body">
        {/* MAIN (left) */}
        <div className="po-main">
          {/* KPI Row */}
          <div className="po-kpis">
            {kpis.map((k, i) => (
              <div key={i} className="sbox">
                <div className="sbv" style={{ fontSize: 22, color: k[2] }}>{k[0]}</div>
                <div className="sbl">{k[1]}</div>
              </div>
            ))}
          </div>

          {/* Terminal */}
          <div className="po-terminal">
            <div className="po-term-head">
              <span className="led lg" />
              <span style={{ fontFamily: 'var(--fm)', fontSize: 11, color: 'var(--t2)' }}>KANI Terminal</span>
              <span style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--t3)', marginLeft: 'auto' }}>claude-opus-4-6</span>
            </div>
            <div className="po-term-log" ref={logRef}>
              {termLog.map((line, i) => (
                <div key={i} className={`term-line${line.type ? ` ${line.type}` : ''}`}>
                  <span className="term-ts">{line.ts}</span>
                  <span className="term-msg">{line.msg}</span>
                </div>
              ))}
              <div className="term-line">
                <span className="term-ts" />
                <span className="term-msg"><span className="term-cursor" /></span>
              </div>
            </div>
            <div className="po-term-inp">
              <span className="po-term-prompt">{'\u276f'}</span>
              <input
                className="po-term-field"
                placeholder="Prompt an KANI..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleTermSend}
                autoFocus
              />
            </div>
          </div>
        </div>

        {/* SIDEBAR (right) */}
        <div className="po-side">
          {/* Todos Card */}
          <div className="po-side-card">
            <div className="ch">
              <span className="ct">Todos</span>
              <button
                className="abtn p"
                style={{ margin: 0, padding: '2px 9px', fontSize: 9, width: 'auto' }}
                onClick={onOpenTodoModal}
              >
                +
              </button>
            </div>
            <div className="cb" style={{ overflowY: 'auto', gap: 4 }}>
              {projTodos.length === 0 && (
                <div style={{ fontSize: 12, color: 'var(--t3)', padding: 10 }}>Keine Todos</div>
              )}
              {projTodos.map(t => (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '7px 9px',
                    background: 'var(--inp)',
                    border: `1px solid ${t.ov ? 'rgba(255,68,102,0.3)' : 'var(--b)'}`,
                    borderRadius: 9,
                    flexShrink: 0,
                  }}
                >
                  <input
                    type="checkbox"
                    defaultChecked={t.done}
                    style={{ accentColor: 'var(--c)', width: 13, height: 13, flexShrink: 0 }}
                  />
                  <span style={{
                    fontSize: 12,
                    color: 'var(--t1)',
                    flex: 1,
                    ...(t.done ? { textDecoration: 'line-through', opacity: 0.4 } : {}),
                  }}>
                    {t.txt}
                  </span>
                  {t.due && (
                    <span className={`bdg ${t.prio === 'h' ? 'br' : 'ba'}`} style={{ fontSize: 9 }}>{t.due}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ideas Card */}
          <div className="po-side-card">
            <div className="ch">
              <span className="ct">Ideen</span>
              <button
                className="abtn"
                style={{ margin: 0, padding: '2px 9px', fontSize: 9, width: 'auto' }}
                onClick={onOpenThoughtModal}
              >
                + Idee
              </button>
            </div>
            <div className="cb" style={{ overflowY: 'auto', gap: 4 }}>
              {projIdeas.map((idea, i) => (
                <div
                  key={i}
                  style={{
                    padding: '8px 10px',
                    background: 'var(--inp)',
                    border: '1px solid var(--b)',
                    borderRadius: 9,
                    cursor: 'pointer',
                    transition: 'all 0.18s',
                    flexShrink: 0,
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>{idea.n}</div>
                  <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>{idea.cat} {'\u00b7'} {idea.st}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
