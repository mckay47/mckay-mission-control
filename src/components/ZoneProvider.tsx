import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

const IDLE_MS = 5 * 60 * 1000 // 5 minutes
const COUNTDOWN_S = 10

type ZoneMode = 'zone' | 'matrix'

interface ZoneCtx {
  mode: ZoneMode
  elapsed: number // seconds since Zone start
  goZone: () => void
  goMatrix: () => void
}

const ZoneContext = createContext<ZoneCtx>({ mode: 'matrix', elapsed: 0, goZone: () => {}, goMatrix: () => {} })
export const useZone = () => useContext(ZoneContext)

export function ZoneProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ZoneMode>(() =>
    (localStorage.getItem('mckay-zone') as ZoneMode) ?? 'matrix'
  )
  const [elapsed, setElapsed] = useState(0)
  const [popup, setPopup] = useState(false)
  const [countdown, setCountdown] = useState(COUNTDOWN_S)

  // All mutable state in refs to avoid stale closures in event handlers
  const modeRef = useRef<ZoneMode>(mode)
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cdRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const elRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const zoneStartRef = useRef<number>(0)

  // Stable fn refs — body is reassigned each render but identity never changes
  const goMatrixFn = useRef<() => void>(() => {})
  const goZoneFn = useRef<() => void>(() => {})
  const resetIdleFn = useRef<() => void>(() => {})

  goMatrixFn.current = () => {
    if (idleRef.current) { clearTimeout(idleRef.current); idleRef.current = null }
    if (cdRef.current) { clearInterval(cdRef.current); cdRef.current = null }
    if (elRef.current) { clearInterval(elRef.current); elRef.current = null }
    setPopup(false)
    setCountdown(COUNTDOWN_S)
    setElapsed(0)
    modeRef.current = 'matrix'
    setMode('matrix')
    localStorage.setItem('mckay-zone', 'matrix')
  }

  resetIdleFn.current = () => {
    if (modeRef.current !== 'zone') return
    // Dismiss any active popup
    if (cdRef.current) { clearInterval(cdRef.current); cdRef.current = null }
    setPopup(false)
    setCountdown(COUNTDOWN_S)
    // Reset idle countdown
    if (idleRef.current) clearTimeout(idleRef.current)
    idleRef.current = setTimeout(() => {
      if (modeRef.current !== 'zone') return
      setPopup(true)
      let remaining = COUNTDOWN_S
      setCountdown(remaining)
      cdRef.current = setInterval(() => {
        remaining -= 1
        setCountdown(remaining)
        if (remaining <= 0) goMatrixFn.current()
      }, 1000)
    }, IDLE_MS)
  }

  goZoneFn.current = () => {
    if (modeRef.current === 'zone') return // already in zone — handled by resetIdle
    if (cdRef.current) { clearInterval(cdRef.current); cdRef.current = null }
    setPopup(false)
    setCountdown(COUNTDOWN_S)
    modeRef.current = 'zone'
    setMode('zone')
    localStorage.setItem('mckay-zone', 'zone')
    // Start elapsed timer from zero
    zoneStartRef.current = Date.now()
    setElapsed(0)
    if (elRef.current) clearInterval(elRef.current)
    elRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - zoneStartRef.current) / 1000))
    }, 1000)
    resetIdleFn.current()
  }

  // Activity listener: auto-switch matrix→zone, reset idle when in zone
  useEffect(() => {
    const onActivity = () => {
      if (modeRef.current === 'matrix') {
        goZoneFn.current()
      } else {
        resetIdleFn.current()
      }
    }
    document.addEventListener('mousedown', onActivity)
    document.addEventListener('keydown', onActivity)
    return () => {
      document.removeEventListener('mousedown', onActivity)
      document.removeEventListener('keydown', onActivity)
    }
  }, [])

  // On mount: if zone was persisted in localStorage, start elapsed + idle
  useEffect(() => {
    if (modeRef.current === 'zone') {
      zoneStartRef.current = Date.now()
      setElapsed(0)
      elRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - zoneStartRef.current) / 1000))
      }, 1000)
      resetIdleFn.current()
    }
    return () => {
      if (idleRef.current) clearTimeout(idleRef.current)
      if (cdRef.current) clearInterval(cdRef.current)
      if (elRef.current) clearInterval(elRef.current)
    }
  }, [])

  const goZone = useCallback(() => goZoneFn.current(), [])
  const goMatrix = useCallback(() => goMatrixFn.current(), [])
  const handleStillHere = useCallback(() => resetIdleFn.current(), [])

  return (
    <ZoneContext.Provider value={{ mode, elapsed, goZone, goMatrix }}>
      {children}
      {popup && (
        <IdlePopup countdown={countdown} onStillHere={handleStillHere} onMatrix={goMatrix} />
      )}
    </ZoneContext.Provider>
  )
}

// ─── Idle Popup ────────────────────────────────────────────────────────────────

interface IdlePopupProps {
  countdown: number
  onStillHere: () => void
  onMatrix: () => void
}

function IdlePopup({ countdown, onStillHere, onMatrix }: IdlePopupProps) {
  const circumference = 2 * Math.PI * 28
  const progress = countdown / COUNTDOWN_S

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        style={{
          background: 'var(--sf)',
          borderRadius: 22,
          padding: '36px 44px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
          boxShadow: '0 8px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.08), 0 0 40px rgba(0,255,136,0.06)',
          minWidth: 300,
        }}
      >
        {/* Label */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 4,
            color: 'var(--tx3)',
            textTransform: 'uppercase',
          }}
        >
          ZONE — KEIN SIGNAL
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: 'var(--tx)',
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          Bist du noch da?
        </div>

        {/* Countdown ring */}
        <div style={{ position: 'relative', width: 68, height: 68, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg
            viewBox="0 0 64 64"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}
          >
            <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
            <circle
              cx="32" cy="32" r="28"
              fill="none"
              stroke="var(--g)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 0.85s linear', filter: 'drop-shadow(0 0 4px var(--gg))' }}
            />
          </svg>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 24,
              fontWeight: 600,
              color: 'var(--g)',
              lineHeight: 1,
              textShadow: '0 0 12px var(--gg)',
            }}
          >
            {countdown}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onStillHere}
            style={{
              background: 'rgba(0,255,136,0.08)',
              border: '1px solid rgba(0,255,136,0.25)',
              borderRadius: 12,
              padding: '10px 20px',
              color: 'var(--g)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
              cursor: 'pointer',
              transition: 'all 0.2s',
              textShadow: '0 0 8px rgba(0,255,136,0.4)',
            }}
          >
            JA, NOCH DA
          </button>
          <button
            onClick={onMatrix}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '10px 20px',
              color: 'var(--tx3)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            MATRIX
          </button>
        </div>
      </div>
    </div>
  )
}
