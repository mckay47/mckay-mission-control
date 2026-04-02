import { useState } from 'react'

const TODOS = [
  { text: 'Geschenk f\u00fcr Mama', done: false },
  { text: 'Steuererkl\u00e4rung', done: true },
  { text: 'Zahnarzt anrufen', done: false },
]

const HEALTH = [
  { label: 'Schritte', value: '7.2k', color: 'var(--green)', icon: 'activity' },
  { label: 'Schlaf', value: '7h 20m', color: 'var(--blue)', icon: 'clock' },
]

const FAMILY = [
  { name: 'Laura', status: 'Zuhause', grad: 'linear-gradient(135deg, var(--pink), var(--purple))', letter: 'L' },
  { name: 'Max', status: 'Kita', grad: 'linear-gradient(135deg, var(--cyan), var(--blue))', letter: 'M' },
]

export default function PersoenlichCard() {
  const [checked, setChecked] = useState<Record<number, boolean>>(
    Object.fromEntries(TODOS.map((t, i) => [i, t.done]))
  )

  return (
    <div className="card persoenlich">
      <div className="card-header">
        <div className="card-header-left"><span className="card-icon pink" /><span className="card-title">PERS{'\u00d6'}NLICH</span></div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px', gap: 12, overflow: 'hidden' }}>
        {/* 2x2 Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1 }}>
          {/* Private Todos */}
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 12,
            padding: 12,
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <div style={{
                width: 16,
                height: 16,
                borderRadius: 5,
                background: 'rgba(255,45,170,0.12)',
                color: 'var(--pink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg viewBox="0 0 24 24" width={9} height={9} stroke="currentColor" strokeWidth={2} fill="none">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--pink)', textTransform: 'uppercase', letterSpacing: 1 }}>Private Todos</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {TODOS.map((todo, i) => {
                const isDone = checked[i]
                return (
                  <div
                    key={i}
                    onClick={() => setChecked(c => ({ ...c, [i]: !c[i] }))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '7px 8px',
                      borderRadius: 8,
                      background: isDone ? 'rgba(255,45,170,0.04)' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      opacity: isDone ? 0.5 : 1,
                      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  >
                    <div style={{
                      width: 14,
                      height: 14,
                      borderRadius: 4,
                      border: isDone ? 'none' : '2px solid var(--text-muted)',
                      background: isDone ? 'var(--pink)' : 'transparent',
                      boxShadow: isDone ? '0 0 12px rgba(255,45,170,0.4)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: 8,
                      color: '#fff',
                      fontWeight: 700,
                      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    }}>{isDone ? '\u2713' : ''}</div>
                    <span style={{
                      fontSize: 9,
                      color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: isDone ? 'line-through' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    }}>{todo.text}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Health */}
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 12,
            padding: 12,
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <div style={{
                width: 16,
                height: 16,
                borderRadius: 5,
                background: 'rgba(239,68,68,0.12)',
                color: 'var(--red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg viewBox="0 0 24 24" width={9} height={9} stroke="currentColor" strokeWidth={2} fill="none">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: 1 }}>Health</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {HEALTH.map(h => (
                <div key={h.label} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: `${h.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: h.color,
                    flexShrink: 0,
                  }}>
                    {h.icon === 'activity' ? (
                      <svg viewBox="0 0 24 24" width={11} height={11} stroke="currentColor" strokeWidth={2} fill="none">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width={11} height={11} stroke="currentColor" strokeWidth={2} fill="none">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h.label}</div>
                    <div style={{
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      color: h.color,
                      textShadow: `0 0 10px ${h.color}40`,
                    }}>{h.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Familie — spans 2 columns */}
          <div style={{
            gridColumn: '1 / -1',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 12,
            padding: 12,
            border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <div style={{
                width: 16,
                height: 16,
                borderRadius: 5,
                background: 'rgba(139,92,246,0.12)',
                color: 'var(--purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg viewBox="0 0 24 24" width={9} height={9} stroke="currentColor" strokeWidth={2} fill="none">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: 1 }}>Familie</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {FAMILY.map(member => (
                <div key={member.name} style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: member.grad,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#fff',
                    flexShrink: 0,
                    boxShadow: `0 0 15px ${member.name === 'Laura' ? 'rgba(255,45,170,0.3)' : 'rgba(0,240,255,0.3)'}`,
                  }}>{member.letter}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-primary)' }}>{member.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--green)',
                        boxShadow: '0 0 8px var(--green)',
                        animation: 'dotPulse 2s ease-in-out infinite',
                      }} />
                      <span style={{ fontSize: 8, color: 'var(--text-muted)' }}>{member.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
