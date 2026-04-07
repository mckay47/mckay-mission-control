import { useState } from 'react'
import { Zap, Unplug } from 'lucide-react'

export function StampButton() {
  const [inZone, setInZone] = useState(false)

  return (
    <button className={`stamp-ghost ${inZone ? 'in' : 'out'}`} onClick={() => setInZone(z => !z)}>
      {inZone ? (
        <>
          <Zap size={15} stroke="var(--g)" strokeWidth={2} className="zone-icon" />
          <span className="zone-text">ZONE</span>
          <span className="zone-cursor">|</span>
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
