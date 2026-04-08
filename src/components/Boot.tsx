import { useState, useEffect } from 'react'
import { Power } from 'lucide-react'

interface BootProps {
  onComplete: () => void
}

export default function Boot({ onComplete }: BootProps) {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  const handleClick = () => {
    if (exiting) return
    setExiting(true)
    setTimeout(onComplete, 700)
  }

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#070708',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: exiting ? 'default' : 'pointer',
        zIndex: 300,
        opacity: exiting ? 0 : 1,
        transition: 'opacity 0.7s ease',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 1s ease',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.7)',
        }}
      >
        {visible && !exiting && (
          <div
            className="boot-pulse-ring"
            style={{
              position: 'absolute',
              width: 90,
              height: 90,
              borderRadius: '50%',
              border: '1px solid var(--g)',
              pointerEvents: 'none',
            }}
          />
        )}
        {visible && !exiting && (
          <div
            className="boot-pulse-ring"
            style={{
              position: 'absolute',
              width: 90,
              height: 90,
              borderRadius: '50%',
              border: '1px solid var(--g)',
              pointerEvents: 'none',
              animationDelay: '1s',
            }}
          />
        )}
        <Power
          size={48}
          stroke="var(--g)"
          strokeWidth={1.4}
          style={{
            filter: visible && !exiting
              ? 'drop-shadow(0 0 14px var(--g)) drop-shadow(0 0 30px rgba(0,200,83,0.4))'
              : 'none',
            transition: 'filter 1s ease',
          }}
        />
      </div>
    </div>
  )
}
