import { useEffect, useRef } from 'react'

interface ProgressBarProps {
  name: string
  value: string
  percent: number
  fillClass?: string
  fillStyle?: string
  subtitle?: string
  nameStyle?: React.CSSProperties
  valueStyle?: React.CSSProperties
}

export default function ProgressBar({ name, value, percent, fillClass, fillStyle, subtitle, nameStyle, valueStyle }: ProgressBarProps) {
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = fillRef.current
    if (!el) return
    const timer = setTimeout(() => {
      el.style.width = percent + '%'
    }, 120)
    return () => clearTimeout(timer)
  }, [percent])

  return (
    <div className="prg">
      <div className="prg-top">
        <span className="prg-n" style={nameStyle}>{name}</span>
        <span className="prg-p" style={valueStyle}>{value}</span>
      </div>
      <div className="prg-bar">
        <div
          ref={fillRef}
          className={`prg-fill${fillClass ? ' ' + fillClass : ''}`}
          style={{ width: 0, ...(fillStyle ? { background: fillStyle } : {}) }}
        />
      </div>
      {subtitle && <div className="prg-sub">{subtitle}</div>}
    </div>
  )
}
