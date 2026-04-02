import { useClock } from '../../hooks/useTimer'

const EVENTS = [
  { time: '09:42', title: 'Team Standup', meta: 'Zoom · Alle', color: 'var(--purple)', duration: '15m', now: false },
  { time: '11:00', title: 'KANI Session: Dashboard', meta: 'Mission Control · build-agent', color: 'var(--green)', duration: '2h', now: true },
  { time: '14:00', title: 'Hebammenbuero Review', meta: 'Google Meet · Sarah', color: 'var(--cyan)', duration: '1h', now: false },
  { time: '16:30', title: 'Arzt Termin', meta: 'Dr. Weber · Ulm', color: 'var(--orange)', duration: '45m', now: false },
]

export default function KalenderCard() {
  const { timeStr, dateStr } = useClock()

  return (
    <div className="card kalender">
      <div className="card-header">
        <div className="card-header-left"><span className="card-icon blue" /><span className="card-title">KALENDER</span></div>
        <div className="btns">
          <button className="btn primary">
            <svg viewBox="0 0 24 24" width={10} height={10} stroke="currentColor" strokeWidth={2} fill="none">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Neu
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px', gap: 14, overflow: 'hidden' }}>
        {/* Calendar Header — Clock + Next Event */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          {/* Left: Big Time + Date */}
          <div>
            <div style={{
              fontSize: 32,
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--blue)',
              textShadow: '0 0 20px rgba(59,130,246,0.4), 0 0 60px rgba(59,130,246,0.15)',
              lineHeight: 1,
              letterSpacing: -1,
            }}>{timeStr}</div>
            <div style={{
              fontSize: 9,
              color: 'var(--text-muted)',
              marginTop: 4,
              textTransform: 'capitalize',
            }}>{dateStr}</div>
          </div>

          {/* Right: Next Event Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 100%)',
            border: '1px solid rgba(59,130,246,0.15)',
            borderRadius: 12,
            padding: '10px 14px',
            minWidth: 130,
          }}>
            <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
              {'\u25b6'} N{'\u00e4'}chster Termin
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>Team Standup</div>
            <div style={{
              fontSize: 9,
              fontFamily: 'var(--font-mono)',
              color: 'var(--blue)',
              marginTop: 2,
            }}>09:42 · 15m</div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative', flex: 1, overflowY: 'auto' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            left: 48,
            top: 6,
            bottom: 6,
            width: 2,
            background: 'linear-gradient(180deg, var(--blue), var(--purple))',
            opacity: 0.15,
            borderRadius: 1,
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {EVENTS.map((ev, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: ev.now
                    ? 'linear-gradient(135deg, rgba(0,255,136,0.08) 0%, rgba(0,255,136,0.02) 100%)'
                    : 'rgba(0,0,0,0.15)',
                  border: ev.now ? '1px solid rgba(0,255,136,0.15)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  position: 'relative',
                }}
              >
                {/* Time */}
                <span style={{
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  color: ev.now ? 'var(--green)' : 'var(--text-muted)',
                  width: 46,
                  flexShrink: 0,
                  textAlign: 'right',
                  textShadow: ev.now ? '0 0 8px rgba(0,255,136,0.4)' : 'none',
                }}>{ev.time}</span>

                {/* Dot */}
                <span style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: ev.color,
                  boxShadow: `0 0 12px ${ev.color}`,
                  flexShrink: 0,
                  animation: ev.now ? 'dotPulse 1.5s ease-in-out infinite' : 'none',
                  position: 'relative',
                  zIndex: 1,
                }} />

                {/* Body */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: ev.now ? 'var(--green)' : 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>{ev.title}</span>
                    {ev.now && (
                      <span style={{
                        fontSize: 6,
                        fontWeight: 700,
                        color: 'var(--green)',
                        background: 'rgba(0,255,136,0.12)',
                        padding: '2px 6px',
                        borderRadius: 4,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        animation: 'glowPulse 1.5s ease-in-out infinite',
                      }}>NOW</span>
                    )}
                  </div>
                  <div style={{
                    fontSize: 8,
                    color: 'var(--text-muted)',
                    marginTop: 2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>{ev.meta}</div>
                </div>

                {/* Duration */}
                <span style={{
                  fontSize: 8,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  color: ev.now ? 'var(--green)' : 'var(--text-muted)',
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: ev.now ? 'rgba(0,255,136,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${ev.now ? 'rgba(0,255,136,0.12)' : 'var(--border)'}`,
                  flexShrink: 0,
                }}>{ev.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
