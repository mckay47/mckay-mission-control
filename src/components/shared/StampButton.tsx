import { useRef } from 'react'
import { Unplug } from 'lucide-react'
import { useZone } from '../ZoneProvider'
import { StatusLed } from '../ui/StatusLed'

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function StampButton() {
  const { mode, elapsed, goMatrix } = useZone()
  const inZone = mode === 'zone'
  // Capture mode at mousedown — BEFORE the document activity listener fires goZone()
  // Without this: mousedown triggers goZone(), React re-renders, then onClick sees
  // inZone=true and immediately calls goMatrix(), cancelling the switch.
  const modeAtMouseDown = useRef(mode)

  return (
    <button
      className={`stamp-ghost ${inZone ? 'in' : 'out'}`}
      onMouseDown={() => { modeAtMouseDown.current = mode }}
      onClick={() => { if (modeAtMouseDown.current === 'zone') goMatrix() }}
    >
      {inZone ? (
        <>
          <StatusLed color="var(--g)" glow="var(--gg)" animate size={9} />
          <span className="zone-text">ZONE</span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 500,
              color: 'rgba(0,255,136,0.55)',
              letterSpacing: 1,
            }}
          >
            {formatElapsed(elapsed)}
          </span>
        </>
      ) : (
        <>
          <Unplug size={15} stroke="var(--tx3)" strokeWidth={1.8} />
          <span>MATRIX</span>
        </>
      )}
    </button>
  )
}
