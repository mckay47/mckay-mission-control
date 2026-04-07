import { useState, useEffect } from 'react'
import { Zap, CheckCircle } from 'lucide-react'

interface ShutdownDialogProps {
  open: boolean
  onClose: () => void
  onShutdown: () => void
}

const SYNC_ITEMS = [
  { key: 'kani', label: 'KANI Cockpit synchronisiert' },
  { key: 'memory', label: 'Memory gesichert' },
  { key: 'data', label: 'Daten gespeichert' },
]

export default function ShutdownDialog({ open, onClose, onShutdown }: ShutdownDialogProps) {
  // phase: 0 = confirm, 1 = syncing, 2 = done
  const [phase, setPhase] = useState(0)
  const [syncedCount, setSyncedCount] = useState(0)

  useEffect(() => {
    if (!open) {
      // reset on close
      const t = setTimeout(() => { setPhase(0); setSyncedCount(0) }, 300)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (phase !== 1) return
    // simulate sync: each item takes 800ms
    let count = 0
    const tick = () => {
      count++
      setSyncedCount(count)
      if (count >= SYNC_ITEMS.length) {
        setTimeout(() => setPhase(2), 400)
      } else {
        setTimeout(tick, 800)
      }
    }
    setTimeout(tick, 600)
  }, [phase])

  if (!open) return null

  const handleConfirm = () => {
    if (phase === 0) {
      setPhase(1)
      setSyncedCount(0)
    } else if (phase === 2) {
      onShutdown()
    }
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
          maxWidth: 400,
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

        {/* Terminals section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--tx3)' }}>
            Offene Terminals: 1
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--g)', boxShadow: '0 0 6px var(--gg)' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--tx2)' }}>
                KANI Cockpit
              </span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: 'var(--g)' }}>
              Bereit
            </span>
          </div>
        </div>

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
              Sitzung wird gesichert...
            </div>
            {SYNC_ITEMS.map((item, i) => {
              const done = i < syncedCount
              const active = i === syncedCount && phase === 1
              return (
                <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: done ? 'var(--g)' : active ? 'var(--a)' : 'rgba(255,255,255,0.12)',
                        boxShadow: done ? '0 0 6px var(--gg)' : active ? '0 0 6px var(--ag)' : 'none',
                        transition: 'all 0.4s ease',
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11,
                        color: done ? 'var(--tx2)' : 'var(--tx3)',
                        transition: 'color 0.4s ease',
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                  {done && (
                    <CheckCircle
                      size={14}
                      stroke="var(--g)"
                      style={{ filter: 'drop-shadow(0 0 4px var(--gg))' }}
                    />
                  )}
                </div>
              )
            })}
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
