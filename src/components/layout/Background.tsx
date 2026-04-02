export default function Background() {
  return (
    <>
      <div className="bg-image" />
      <div className="bg-overlay" />
      <div className="ambient-glow g1" />
      <div className="ambient-glow g2" />
      <div className="ambient-glow g3" />
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'var(--cyan)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--green)' }} />
          </linearGradient>
          <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'var(--cyan)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--green)' }} />
          </linearGradient>
        </defs>
      </svg>
    </>
  )
}
