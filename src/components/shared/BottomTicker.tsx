import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import type { TickerItemData } from '../../lib/types.ts'

interface BottomTickerProps {
  label: string
  ledColor: string
  ledGlow: string
  items: TickerItemData[]
  backLabel?: string
  backPath?: string
}

export function BottomTicker({ label, ledColor, ledGlow, items, backLabel, backPath }: BottomTickerProps) {
  const nav = useNavigate()
  // Duplicate items for seamless scroll
  const doubled = [...items, ...items]

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '14px 0', flexShrink: 0, gap: 16 }}>
      <div className="ticker cf">
        <div className="ticker-lbl">
          <span
            style={{
              width: 8, height: 8, borderRadius: '50%',
              background: ledColor, boxShadow: `0 0 10px ${ledGlow}`,
              animation: 'lp 2s ease-in-out infinite', '--lc': ledGlow
            } as React.CSSProperties}
          />
          {label}
        </div>
        <div className="ticker-c">
          <div className="ticker-s">
            {doubled.map((item, i) => (
              <div className="ticker-i" key={i}>
                <span className="ticker-id" style={{ background: item.color }} />
                <span className="ticker-ia" style={{ color: item.labelColor }}>{item.label}</span>
                {' '}{item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
      {backLabel && backPath && (
        <div
          onClick={() => nav(backPath)}
          style={{
            padding: '12px 20px', borderRadius: 12, fontSize: 12, fontWeight: 600,
            color: 'var(--tx3)', cursor: 'pointer', whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0
          }}
        >
          <ChevronLeft size={14} />
          Zurück {backLabel}
        </div>
      )}
    </div>
  )
}
