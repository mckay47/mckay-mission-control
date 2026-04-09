import { useState, useEffect, useRef, useCallback } from 'react'
import { Terminal } from '../shared/Terminal.tsx'
import { useMissionControl } from '../../lib/MissionControlProvider.tsx'
import { openOrFocus } from '../../lib/windowManager'

// ============================================================
// Attention System — severity-based overlays
// ============================================================

type Severity = 'green' | 'orange' | 'red'

const SEVERITY_CONFIG = {
  green:  { bg: 'rgba(0, 255, 136, 0.12)', border: 'rgba(0, 255, 136, 0.5)', color: '#00FF88', icon: '✓', label: 'Fertig' },
  orange: { bg: 'rgba(255, 107, 44, 0.12)', border: 'rgba(255, 107, 44, 0.5)', color: '#FF6B2C', icon: '⏸', label: 'Wartet' },
  red:    { bg: 'rgba(255, 45, 85, 0.15)',  border: 'rgba(255, 45, 85, 0.6)',  color: '#FF2D55', icon: '⚠', label: 'Eingriff' },
} as const

function detectSeverity(message: string): Severity {
  const lower = message.toLowerCase()
  // Red: errors, failures, issues
  if (/error|failed|fehler|broken|crash|fatal|exception|abgebrochen|conflict/.test(lower)) return 'red'
  // Green: task complete
  if (/fertig|erledigt|done|committed|pushed|deployed|abgeschlossen|✓|✅|session.end/.test(lower)) return 'green'
  // Orange: default — waiting for input
  return 'orange'
}

const ATTENTION_STYLE_ID = 'terminal-grid-attention-style'

function ensureAttentionStyles() {
  if (document.getElementById(ATTENTION_STYLE_ID)) return
  const style = document.createElement('style')
  style.id = ATTENTION_STYLE_ID
  style.textContent = `
    @keyframes overlay-pulse-green {
      0%   { background: rgba(0, 255, 136, 0.03); }
      40%  { background: rgba(0, 255, 136, 0.20); }
      60%  { background: rgba(0, 255, 136, 0.20); }
      100% { background: rgba(0, 255, 136, 0.03); }
    }
    @keyframes overlay-pulse-orange {
      0%   { background: rgba(255, 107, 44, 0.03); }
      40%  { background: rgba(255, 107, 44, 0.23); }
      60%  { background: rgba(255, 107, 44, 0.23); }
      100% { background: rgba(255, 107, 44, 0.03); }
    }
    @keyframes overlay-pulse-red {
      0%   { background: rgba(255, 45, 85, 0.04); }
      40%  { background: rgba(255, 45, 85, 0.26); }
      60%  { background: rgba(255, 45, 85, 0.26); }
      100% { background: rgba(255, 45, 85, 0.04); }
    }
    @keyframes icon-pulse {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.15); opacity: 1; }
    }
    @keyframes border-glow-green {
      0%   { box-shadow: inset 0 0 30px rgba(0,255,136,0.05), 0 0 15px rgba(0,255,136,0.15); }
      40%  { box-shadow: inset 0 0 60px rgba(0,255,136,0.1), 0 0 40px rgba(0,255,136,0.3); }
      60%  { box-shadow: inset 0 0 60px rgba(0,255,136,0.1), 0 0 40px rgba(0,255,136,0.3); }
      100% { box-shadow: inset 0 0 30px rgba(0,255,136,0.05), 0 0 15px rgba(0,255,136,0.15); }
    }
    @keyframes border-glow-orange {
      0%   { box-shadow: inset 0 0 30px rgba(255,107,44,0.05), 0 0 15px rgba(255,107,44,0.15); }
      40%  { box-shadow: inset 0 0 60px rgba(255,107,44,0.1), 0 0 40px rgba(255,107,44,0.3); }
      60%  { box-shadow: inset 0 0 60px rgba(255,107,44,0.1), 0 0 40px rgba(255,107,44,0.3); }
      100% { box-shadow: inset 0 0 30px rgba(255,107,44,0.05), 0 0 15px rgba(255,107,44,0.15); }
    }
    @keyframes border-glow-red {
      0%   { box-shadow: inset 0 0 40px rgba(255,45,85,0.08), 0 0 20px rgba(255,45,85,0.2); }
      40%  { box-shadow: inset 0 0 80px rgba(255,45,85,0.15), 0 0 50px rgba(255,45,85,0.4); }
      60%  { box-shadow: inset 0 0 80px rgba(255,45,85,0.15), 0 0 50px rgba(255,45,85,0.4); }
      100% { box-shadow: inset 0 0 40px rgba(255,45,85,0.08), 0 0 20px rgba(255,45,85,0.2); }
    }
  `
  document.head.appendChild(style)
}

// ============================================================
// Types
// ============================================================

interface TerminalStatus {
  terminalId: string
  cwd: string
  runningFor: number
  isThinking: boolean
  lastOutputLine: string
}

interface AttentionState {
  active: boolean
  message: string
  severity: Severity
}

// ============================================================
// Component
// ============================================================

export function TerminalGrid() {
  const { projects, ideas } = useMissionControl()
  const activeProjects = projects.filter(p => p.health === 'active' || p.health === 'live')
  const [inputs, setInputs] = useState<Record<string, string>>({})

  // Attention state: keyed by terminalId
  const [attention, setAttention] = useState<Record<string, AttentionState>>({})

  // Track previous isThinking per terminal to detect transitions
  const prevThinking = useRef<Record<string, boolean>>({})

  // Inject keyframe styles on mount
  useEffect(() => { ensureAttentionStyles() }, [])

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') window.close()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Poll /api/kani/status every 3 seconds for attention detection
  useEffect(() => {
    let mounted = true

    const poll = async () => {
      try {
        const res = await fetch('/api/kani/status')
        if (!res.ok || !mounted) return
        const data: { activeTerminals: TerminalStatus[] } = await res.json()

        // Build current thinking map
        const currentThinking: Record<string, boolean> = {}
        const lastOutputMap: Record<string, string> = {}
        for (const t of data.activeTerminals) {
          currentThinking[t.terminalId] = t.isThinking
          lastOutputMap[t.terminalId] = t.lastOutputLine
        }

        // Detect attention: transition thinking→idle OR first poll with idle terminal that has output
        const isFirstPoll = Object.keys(prevThinking.current).length === 0
        setAttention(prev => {
          const next = { ...prev }
          for (const t of data.activeTerminals) {
            const wasThinking = prevThinking.current[t.terminalId]
            const nowThinking = t.isThinking

            // Transition: was thinking, now idle → attention
            if (wasThinking === true && nowThinking === false) {
              next[t.terminalId] = { active: true, message: t.lastOutputLine, severity: detectSeverity(t.lastOutputLine) }
            }
            // First poll: terminal is idle with output → attention
            if (isFirstPoll && !nowThinking && t.lastOutputLine) {
              next[t.terminalId] = { active: true, message: t.lastOutputLine, severity: detectSeverity(t.lastOutputLine) }
            }
          }
          return next
        })

        // Update previous state
        prevThinking.current = currentThinking
      } catch {
        // Network error — ignore, will retry
      }
    }

    poll()
    const interval = setInterval(poll, 3000)
    return () => { mounted = false; clearInterval(interval) }
  }, [])

  // Clear attention for a terminal
  const clearAttention = useCallback((terminalId: string) => {
    setAttention(prev => {
      if (!prev[terminalId]?.active) return prev
      const next = { ...prev }
      next[terminalId] = { active: false, message: '', severity: 'orange' }
      return next
    })
  }, [])

  // Build unified list of terminal entries: projects + ideas
  const terminalEntries: {
    key: string
    terminalId: string
    name: string
    path: string
    statusLabel: string
    color: string
    glow: string
    cwd: string
    windowPath: string
    placeholder: string
  }[] = []

  for (const p of activeProjects) {
    terminalEntries.push({
      key: p.id,
      terminalId: `project:${p.id}`,
      name: p.name,
      path: `~/projects/${p.id}`,
      statusLabel: p.health === 'active' ? 'Running' : p.health === 'live' ? 'Live' : 'Idle',
      color: p.color,
      glow: p.glow,
      cwd: `~/mckay-os/projects/${p.id}`,
      windowPath: `/project/${p.id}`,
      placeholder: `${p.id} → ...`,
    })
  }

  for (const idea of ideas) {
    // Only include ideas that have an active terminal session (status research or higher)
    const ideaStatus = idea.status || idea.st || ''
    if (['research', 'scored', 'promoted'].includes(ideaStatus)) {
      const ideaName = idea.title || idea.n || idea.id
      const ideaColor = idea.color || '#FF6B2C'
      const ideaGlow = idea.glow || 'rgba(255, 107, 44, 0.3)'
      terminalEntries.push({
        key: `idea-${idea.id}`,
        terminalId: `idea:${idea.id}`,
        name: ideaName,
        path: `~/ideas/${idea.id}`,
        statusLabel: 'Idea',
        color: ideaColor,
        glow: ideaGlow,
        cwd: `~/mckay-os`,
        windowPath: `/idea/${idea.id}`,
        placeholder: `${idea.id} → ...`,
      })
    }
  }

  const totalTerminals = terminalEntries.length

  if (totalTerminals === 0) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070708', color: '#6a6a74', fontFamily: "'JetBrains Mono', monospace" }}>
        Keine aktiven Terminals
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#070708', padding: 8, display: 'flex', flexDirection: 'column' }}>
      {/* Minimal header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', flexShrink: 0 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: '#6a6a74', letterSpacing: 2 }}>
          ALLE TERMINALS — {totalTerminals} aktiv
        </div>
        <div
          onClick={() => window.close()}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#6a6a74', cursor: 'pointer', padding: '4px 12px', borderRadius: 6 }}
        >
          ESC zum Schliessen
        </div>
      </div>

      {/* Terminal grid */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${totalTerminals <= 2 ? '600px' : totalTerminals <= 4 ? '500px' : '400px'}, 1fr))`,
        gap: 8,
        minHeight: 0,
        overflow: 'hidden',
      }}>
        {terminalEntries.map(entry => {
          const attn = attention[entry.terminalId]
          const hasAttention = attn?.active === true
          const severity = attn?.severity || 'orange'
          const cfg = SEVERITY_CONFIG[severity]

          return (
            <div
              key={entry.key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
                cursor: 'pointer',
                position: 'relative',
                borderRadius: 12,
                background: '#0c0c12',
                border: hasAttention ? `1px solid ${cfg.border}` : '1px solid rgba(255, 255, 255, 0.06)',
                overflow: 'hidden',
                transition: 'border-color 0.3s ease',
                ...(hasAttention ? {
                  animation: `border-glow-${severity} 4s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                } : {}),
              }}
              onClick={() => {
                clearAttention(entry.terminalId)
                openOrFocus(entry.windowPath, 'width=1440,height=900,menubar=no,toolbar=no')
              }}
            >
              {/* Full overlay when attention is active */}
              {hasAttention && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                  animation: `overlay-pulse-${severity} 4s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                  backdropFilter: 'blur(1px)',
                  borderRadius: 12,
                  cursor: 'pointer',
                }}>
                  {/* Big icon */}
                  <div style={{
                    fontSize: 48,
                    animation: 'icon-pulse 2s ease-in-out infinite',
                    filter: `drop-shadow(0 0 20px ${cfg.color})`,
                    userSelect: 'none',
                  }}>
                    {cfg.icon}
                  </div>

                  {/* Severity label */}
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: 4,
                    textTransform: 'uppercase',
                    color: cfg.color,
                    textShadow: `0 0 20px ${cfg.color}`,
                  }}>
                    {cfg.label}
                  </div>

                  {/* Message */}
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: cfg.color,
                    opacity: 0.8,
                    maxWidth: '80%',
                    textAlign: 'center',
                    lineHeight: 1.6,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {attn?.message || 'Wartet auf Eingabe'}
                  </div>

                  {/* Click hint */}
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.3)',
                    marginTop: 8,
                    letterSpacing: 2,
                  }}>
                    KLICK ZUM ÖFFNEN
                  </div>
                </div>
              )}

              <Terminal
                title={`${entry.name} · ${entry.path}`}
                statusLabel={entry.statusLabel}
                statusColor={entry.color}
                statusGlow={entry.glow}
                placeholder={entry.placeholder}
                mode="live"
                cwd={entry.cwd}
                terminalId={entry.terminalId}
                inputValue={inputs[entry.key] || ''}
                onInputChange={(v) => setInputs(prev => ({ ...prev, [entry.key]: v }))}
                onClearInput={() => setInputs(prev => ({ ...prev, [entry.key]: '' }))}
                onSend={() => setInputs(prev => ({ ...prev, [entry.key]: '' }))}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
