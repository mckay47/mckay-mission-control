import { useState, useEffect } from 'react'
import { Power } from 'lucide-react'

interface BootProps {
  onComplete: () => void
}

export default function Boot({ onComplete }: BootProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      onClick={onComplete}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0a0a0c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 300,
        transition: 'opacity 0.8s ease',
      }}
    >
      <div
        style={{
          transition: 'all 1s ease',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.7)',
        }}
      >
        <Power
          size={28}
          stroke="var(--g)"
          strokeWidth={1.6}
          style={{
            filter: visible
              ? 'drop-shadow(0 0 10px var(--g)) drop-shadow(0 0 22px rgba(0,200,83,0.4))'
              : 'none',
            transition: 'filter 1s ease',
          }}
        />
      </div>
    </div>
  )
}
