interface StatusLedProps {
  color: string
  glow?: string
  animate?: boolean
  size?: number
}

export function StatusLed({ color, glow, animate = false, size = 10 }: StatusLedProps) {
  return (
    <div
      className="sl"
      style={{
        width: size,
        height: size,
        background: color,
        ...(animate && glow ? { animation: 'lp 3s ease-in-out infinite', '--lc': glow } as React.CSSProperties : {}),
      }}
    />
  )
}
