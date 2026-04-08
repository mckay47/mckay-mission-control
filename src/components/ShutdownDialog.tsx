import { useState, useEffect, useRef } from 'react'
import { Zap, CheckCircle, Loader2 } from 'lucide-react'

interface TerminalStatus {
  id: string
  label: string
  done: boolean
}

interface ShutdownDialogProps {
  open: boolean
  onClose: () => void
  onShutdown: () => void
}

function terminalLabel(id: string): string {
  if (id.startsWith('project:')) return `Projekt: ${id.replace('project:', '')}`
  if (id === 'kani') return 'KANI Cockpit'
  return id
}

export default function ShutdownDialog({ open, onClose, onShutdown }: ShutdownDialogProps) {
  // phase: 0 = confirm, 1 = syncing, 2 = done
  const [phase, setPhase] = useState(0)
  const [terminals, setTerminals] = useState<TerminalStatus[]>([])
  const [activeCount, setActiveCount] = useState(0)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fetch active terminal count on open
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => { setPhase(0); setTerminals([]) }, 300)
      return () => clearTimeout(t)
    }
    fetch('/api/kani/status')
      .then(r => r.json())
      .then((data: { activeTerminals: Array<{ terminalId: string }> }) => {
        setActiveCount(data.activeTerminals.length)
      })
      .catch(() => {})
  }, [open])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const startSessionEnd = async () => {
    setPhase(1)
    try {
      const response = await fetch('/api/kani/session-end', { method: 'POST' })
      const data = await response.json() as { dispatched: string[] }
      const dispatched = data.dispatched

      if (dispatched.length === 0) {
        setTimeout(() => setPhase(2), 600)
        return
      }

      setTerminals(dispatched.map(id => ({ id, label: terminalLabel(id), done: false })))

      // Poll until all dispatched terminals are gone from activeProcesses
      pollRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch('/api/kani/status')
          const statusData = await statusRes.json() as { activeTerminals: Array<{ terminalId: string }> }
          const activeIds = new Set(statusData.activeTerminals.map((t: { terminalId: string }) => t.terminalId))

          setTerminals(prev => {
            const updated = prev.map(t => ({ ...t, done: !activeIds.has(t.id) }))
            if (updated.every(t => t.done)) {
              if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
              if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }
              setTimeout(() => setPhase(2), 500)
            }
            return updated
          })
        } catch {
          // poll failure is non-critical
        }
      }, 1500)

      // Hard timeout: 3 minutes
      timeoutRef.current = setTimeout(() => {
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
        setTerminals(prev => prev.map(t => ({ ...t, done: true })))
        setTimeout(() => setPhase(2), 400)
      }, 180000)

    } catch {
      setTimeout(() => setPhase(2), 600)
    }
  }

  if (!open) return null

  const handleConfirm = () => {
    if (phase === 0) startSessionEnd()
    else if (phase === 2) onShutdown()
  }

  const btnLabel =
    phase === 0 ? 'Herunterfahren' :
    phase === 1 ? 'Wird gesichert...' :
    'Herunterfahren'

  const btnColor =
    phase === 0 ? 'var(--o)' :
    phase === 1 ? 'rgba(255,109,0,0.4)' :
    'var(--g)'

  const btnGlow =
    phase === 0 ? 'var(--og)' :
    phase === 1 ? 'transparent' :
    'var(--gg)'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.72)',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          background: 'linear-gradient(145deg, #18181c, #121214)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: '28px 32px',
          minWidth: 360,
          maxWidth: 420,
          boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 8px 20px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Zap size={16} stroke="var(--a)" strokeWidth={2} style={{ filter: 'drop-shadow(0 0 6px var(--ag))' }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>
            System herunterfahren?
          </span>
        </div>

        {/* Active terminals section (phase 0 only) */}
        {phase === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--tx3)' }}>
              {activeCount > 0 ? `Aktive Terminals: ${activeCount}` : 'Keine aktiven Sitzungen'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--g)', boxShadow: '0 0 6px var(--gg)' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--tx2)' }}>
                  KANI Cockpit
                </span>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: 'var(--g)' }}>
                {activeCount > 0 ? 'In Betrieb' : 'Bereit'}
              </span>
            </div>
          </div>
        )}

        {/* Sync section — visible in phase 1+2 */}
        {phase >= 1 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: 16,
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--tx3)' }}>
              {phase === 1 ? 'Sitzung wird gesichert...' : 'Sitzung gesichert ✓'}
            </div>

            {terminals.length === 0 && phase === 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Loader2 size={12} stroke="var(--a)" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--tx3)' }}>
                  Wird vorbereitet...
                </span>
              </div>
            )}

            {terminals.map(terminal => (
              <div key={terminal.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: terminal.done ? 'var(--g)' : 'var(--a)',
                      boxShadow: terminal.done ? '0 0 6px var(--gg)' : '0 0 6px var(--ag)',
                      transition: 'all 0.4s ease',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: terminal.done ? 'var(--tx2)' : 'var(--tx3)',
                      transition: 'color 0.4s ease',
                    }}
                  >
                    {terminal.label}
                  </span>
                </div>
                {terminal.done ? (
                  <CheckCircle size={14} stroke="var(--g)" style={{ filter: 'drop-shadow(0 0 4px var(--gg))' }} />
                ) : (
                  <Loader2 size={14} stroke="var(--a)" style={{ animation: 'spin 1s linear infinite' }} />
                )}
              </div>
            ))}

            {terminals.length === 0 && phase === 2 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={14} stroke="var(--g)" style={{ filter: 'drop-shadow(0 0 4px var(--gg))' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--tx2)' }}>
                  Keine aktiven Sitzungen
                </span>
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'transparent',
              color: 'var(--tx3)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--tx)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--tx3)')}
          >
            Abbrechen
          </button>
          <button
            onClick={phase === 1 ? undefined : handleConfirm}
            disabled={phase === 1}
            style={{
              padding: '10px 22px',
              borderRadius: 12,
              border: 'none',
              background: btnColor,
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              cursor: phase === 1 ? 'default' : 'pointer',
              fontFamily: 'inherit',
              boxShadow: `0 4px 14px ${btnGlow}`,
              transition: 'all 0.4s ease',
              opacity: phase === 1 ? 0.7 : 1,
            }}
          >
            {btnLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
