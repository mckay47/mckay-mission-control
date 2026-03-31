import { useEffect, useRef } from 'react'

interface GaugeProps {
  pct: number
  color: string
  size: number
  stroke: number
  label: string
  sub: string
}

export default function Gauge({ pct, color, size, stroke, label, sub }: GaugeProps) {
  const arcRef = useRef<SVGCircleElement>(null)
  const r = size / 2 - stroke / 2
  const circ = 2 * Math.PI * r
  const off = circ * (1 - pct / 100)

  useEffect(() => {
    const el = arcRef.current
    if (!el) return
    const timer = setTimeout(() => {
      el.style.strokeDashoffset = off.toFixed(1)
    }, 120)
    return () => clearTimeout(timer)
  }, [off])

  return (
    <div className="gauge-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
          cx={size / 2}
          cy={size / 2}
          r={r}
        />
        <circle
          ref={arcRef}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeLinecap="round"
          strokeDasharray={circ.toFixed(1)}
          strokeDashoffset={circ.toFixed(1)}
          style={{ transition: 'stroke-dashoffset 2s ease', filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="gauge-val">
        <span style={{ fontFamily: 'var(--fh)', fontSize: Math.round(size / 4.5), fontWeight: 700, color, lineHeight: 1 }}>{label}</span>
        <span style={{ fontSize: Math.round(size / 8), color: 'var(--t3)', fontFamily: 'var(--fm)' }}>{sub}</span>
      </div>
    </div>
  )
}
