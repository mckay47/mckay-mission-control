import { useState } from 'react'
import DetailHeader from '../DetailHeader'

/* ── Dummy data ─────────────────────────────────────────── */

const todayTodos = [
  { text: 'Mockup Layer 2 erweitern', proj: 'MC', projBg: 'rgba(167,139,250,0.12)', projColor: 'var(--purple)', time: '~2h', tag: 'high' as const, todoColor: 'var(--purple)' },
  { text: 'Validation Flow bauen', proj: 'HB', projBg: 'rgba(52,211,153,0.12)', projColor: 'var(--green)', time: '~1h', tag: null, todoColor: 'var(--green)' },
  { text: 'Phase 1 abschließen', proj: 'MC', projBg: 'rgba(167,139,250,0.12)', projColor: 'var(--purple)', time: '~3h', tag: 'high' as const, todoColor: 'var(--purple)' },
  { text: 'Deploy Preview testen', proj: 'TC', projBg: 'rgba(251,191,36,0.12)', projColor: 'var(--orange)', time: '~30m', tag: 'agent' as const, todoColor: 'var(--orange)' },
  { text: 'Kalender-Integration prüfen', proj: 'HB', projBg: 'rgba(52,211,153,0.12)', projColor: 'var(--green)', time: '~45m', tag: null, todoColor: 'var(--green)' },
  { text: 'Weekly Analytics Report', proj: 'FM', projBg: 'rgba(45,212,191,0.12)', projColor: 'var(--cyan)', time: '~20m', tag: 'agent' as const, todoColor: 'var(--cyan)' },
]

const weekDays = [
  { day: 'Mo', count: 3, color: 'var(--green)', pct: 100, label: '\u2713 done', labelColor: 'var(--green)' },
  { day: 'Di', count: 2, color: 'var(--green)', pct: 100, label: '\u2713 done', labelColor: 'var(--green)' },
  { day: 'Mi', count: 6, color: 'var(--cyan)', pct: 33, label: 'heute', labelColor: 'var(--cyan)', today: true },
  { day: 'Do', count: 4, color: 'var(--text-muted)', pct: 0, label: 'geplant', labelColor: 'var(--text-muted)' },
  { day: 'Fr', count: 3, color: 'var(--text-muted)', pct: 0, label: 'geplant', labelColor: 'var(--text-muted)' },
  { day: 'Sa', count: 0, color: 'var(--text-muted)', pct: 0 },
  { day: 'So', count: 0, color: 'var(--text-muted)', pct: 0 },
]

const overdueItems = [
  { text: 'API Review Stillprobleme', time: '-2d' },
  { text: 'Meeting Notes aufräumen', time: '-1d' },
]

const projectTodos = [
  { name: 'Mission Control', count: 6, color: 'var(--purple)', glow: 'var(--purple-glow)', pct: 80 },
  { name: 'Hebammenbuero', count: 4, color: 'var(--green)', glow: 'var(--green-glow)', pct: 55 },
  { name: 'TennisCoach', count: 3, color: 'var(--orange)', glow: 'var(--orange-glow)', pct: 40 },
  { name: 'FindeMeine', count: 2, color: 'var(--cyan)', glow: 'var(--cyan-glow)', pct: 25 },
  { name: 'Stillprobleme', count: 3, color: 'var(--red)', glow: 'var(--red-glow)', pct: 35 },
]

const priorities = [
  { label: 'Kritisch', count: 2, color: 'var(--red)', glow: 'var(--red-glow)' },
  { label: 'Hoch', count: 5, color: 'var(--orange)', glow: 'var(--orange-glow)' },
  { label: 'Normal', count: 8, color: 'var(--green)', glow: 'var(--green-glow)' },
  { label: 'Niedrig', count: 3, color: 'var(--text-muted)', glow: undefined },
]

const calendarDays = [
  { day: 30, past: true }, { day: 31, past: true }, { day: 1, past: true, hasTodo: true }, { day: 2, today: true }, { day: 3, hasTodo: true }, { day: 4 }, { day: 5 },
  { day: 6, hasTodo: true }, { day: 7 }, { day: 8, hasTodo: true }, { day: 9 }, { day: 10, hasTodo: true }, { day: 11 }, { day: 12 },
  { day: 13, hasTodo: true }, { day: 14 }, { day: 15, hasTodo: true }, { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 },
  { day: 20, hasTodo: true }, { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 }, { day: 26 },
  { day: 27 }, { day: 28 }, { day: 29 }, { day: 30 }, { day: 0 }, { day: 0 }, { day: 0 },
]

const doneToday = [
  { text: 'Login UI fertiggestellt', time: '09:30' },
  { text: 'DB Schema Migration', time: '10:15' },
  { text: 'API Setup & Testing', time: '11:45' },
]

const stats = [
  { value: '67%', label: 'Completion Rate', sub: 'Diese Woche', color: 'var(--green)' },
  { value: '5', label: 'Streak Tage', sub: 'Alle Todos erledigt', color: 'var(--cyan)' },
  { value: '156', label: 'Total Erledigt', sub: 'All Time', color: 'var(--purple)' },
]

const weeklyTrend = [
  { pct: 60, color: 'var(--green)', opacity: 0.5 },
  { pct: 75, color: 'var(--green)', opacity: 0.6 },
  { pct: 85, color: 'var(--green)', opacity: 0.7 },
  { pct: 55, color: 'var(--green)', opacity: 0.5 },
  { pct: 90, color: 'var(--cyan)', opacity: 1, glow: '0 0 8px var(--cyan-glow)' },
]

/* ── Styles ─────────────────────────────────────────────── */

const t = 'all 0.3s cubic-bezier(0.4,0,0.2,1)'

const tagStyle = (type: 'high' | 'agent'): React.CSSProperties => ({
  fontSize: 6,
  padding: '2px 5px',
  borderRadius: 3,
  textTransform: 'uppercase',
  fontWeight: 600,
  background: type === 'high' ? 'rgba(239,68,68,0.12)' : 'rgba(139,92,246,0.12)',
  color: type === 'high' ? 'var(--red)' : 'var(--purple)',
})

/* ── Component ──────────────────────────────────────────── */

export default function TodosDetail() {
  const [checked, setChecked] = useState<Record<number, boolean>>({})
  const toggle = (i: number) => setChecked(p => ({ ...p, [i]: !p[i] }))

  return (
    <div className="dashboard" style={{ gridTemplateRows: '44px 1fr' }}>
      <DetailHeader
        title="TODOS"
        color="green"
        pills={[
          { value: '2', label: 'Overdue', color: 'red' },
          { value: '6', label: 'Today', color: 'cyan' },
          { value: '3', label: 'Done', color: 'green' },
        ]}
      />

      {/* 3x3 grid */}
      <div style={{
        gridColumn: '1/-1',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: 18,
        overflow: 'hidden',
      }}>

        {/* ═══════════════ R1C1: HEUTE ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--cyan)',
            '--card-accent2': 'var(--green)',
            '--card-glow': 'rgba(45,212,191,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--cyan)', color: 'var(--cyan)' }} />
              <span className="card-title">Heute</span>
            </div>
            <span className="card-header-right">6 offen</span>
          </div>
          <div className="card-body">
            {todayTodos.map((t2, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 12px',
                  background: 'rgba(10,20,25,0.18)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  borderLeft: `3px solid ${t2.todoColor}`,
                  marginBottom: 6,
                  cursor: 'pointer',
                  transition: t,
                  opacity: checked[i] ? 0.4 : 1,
                }}
              >
                <div
                  onClick={() => toggle(i)}
                  style={{
                    width: 14, height: 14, borderRadius: 4, flexShrink: 0,
                    border: checked[i] ? '2px solid var(--green)' : '2px solid var(--text-muted)',
                    background: checked[i] ? 'var(--green)' : 'transparent',
                    boxShadow: checked[i] ? '0 0 12px var(--green-glow)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: t,
                    fontSize: 8, color: '#fff', fontWeight: 700,
                  }}
                >
                  {checked[i] && '\u2713'}
                </div>
                <span style={{ flex: 1, fontSize: 10 }}>{t2.text}</span>
                <span style={{ fontSize: 7, padding: '2px 6px', borderRadius: 4, fontWeight: 600, background: t2.projBg, color: t2.projColor }}>{t2.proj}</span>
                <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{t2.time}</span>
                {t2.tag && <span style={tagStyle(t2.tag)}>{t2.tag === 'high' ? 'High' : 'Agent'}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ R1C2: DIESE WOCHE ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--blue)',
            '--card-accent2': 'var(--purple)',
            '--card-glow': 'rgba(96,165,250,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--blue)', color: 'var(--blue)' }} />
              <span className="card-title">Diese Woche</span>
            </div>
            <span className="card-header-right">12 total</span>
          </div>
          <div className="card-body">
            {weekDays.map((d, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 10px',
                  background: 'rgba(10,20,25,0.18)',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  borderColor: d.today ? 'var(--cyan)' : undefined,
                  marginBottom: 5,
                  fontSize: 9,
                  transition: t,
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 8, fontWeight: d.today ? 700 : 600, width: 30, color: d.today ? 'var(--cyan)' : 'var(--text-muted)' }}>{d.day}</span>
                <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)', width: 20, color: d.color }}>{d.count}</span>
                <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
                  {d.pct > 0 && (
                    <div style={{
                      height: '100%', borderRadius: 2,
                      width: `${d.pct}%`,
                      background: d.color,
                      boxShadow: d.pct > 0 ? `0 0 6px ${d.color === 'var(--cyan)' ? 'var(--cyan-glow)' : 'var(--green-glow)'}` : 'none',
                      position: 'relative', overflow: 'hidden',
                    }}>
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)',
                        animation: 'shimmer 2s ease-in-out infinite',
                      }} />
                    </div>
                  )}
                </div>
                {d.label && <span style={{ fontSize: 7, color: d.labelColor }}>{d.label}</span>}
              </div>
            ))}
            <div style={{
              marginTop: 'auto', paddingTop: 8,
              borderTop: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', fontSize: 8,
            }}>
              <span style={{ color: 'var(--text-muted)' }}>Abgeschlossen: 5/18</span>
              <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>28%</span>
            </div>
          </div>
        </div>

        {/* ═══════════════ R1C3: UEBERFAELLIG ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--red)',
            '--card-accent2': 'var(--orange)',
            '--card-glow': 'rgba(248,113,113,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--red)', color: 'var(--red)' }} />
              <span className="card-title">Uberfaellig</span>
            </div>
            <span className="card-header-right" style={{ color: 'var(--red)' }}>2 items</span>
          </div>
          <div className="card-body">
            {overdueItems.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 12px',
                  background: 'rgba(239,68,68,0.04)',
                  border: '1px solid rgba(239,68,68,0.12)',
                  borderRadius: 10,
                  marginBottom: 6,
                  transition: t,
                  cursor: 'pointer',
                }}
              >
                <span style={{ width: 14, height: 14, border: '2px solid var(--red)', borderRadius: 4, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 10, color: 'var(--red)', fontWeight: 600 }}>{item.text}</span>
                <span style={{ fontSize: 8, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>{item.time}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button style={{
                flex: 1, padding: 8, border: 'none', borderRadius: 10,
                fontSize: 9, fontWeight: 700, cursor: 'pointer',
                background: 'linear-gradient(135deg,var(--green),var(--cyan))',
                color: 'var(--bg-dark)',
                boxShadow: '0 0 15px var(--green-glow)',
                fontFamily: 'inherit', transition: t,
              }}>Erledigen</button>
              <button style={{
                flex: 1, padding: 8,
                border: '1px solid var(--border)', borderRadius: 10,
                fontSize: 9, fontWeight: 600, cursor: 'pointer',
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--text-secondary)',
                fontFamily: 'inherit', transition: t,
              }}>Verschieben</button>
            </div>
          </div>
        </div>

        {/* ═══════════════ R2C1: NACH PROJEKT ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--purple)',
            '--card-accent2': 'var(--green)',
            '--card-glow': 'rgba(167,139,250,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--purple)', color: 'var(--purple)' }} />
              <span className="card-title">Nach Projekt</span>
            </div>
          </div>
          <div className="card-body">
            {projectTodos.map((p, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 0',
                borderBottom: i < projectTodos.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: p.color, color: p.color, boxShadow: `0 0 8px currentColor` }} />
                <span style={{ flex: 1, fontSize: 10 }}>{p.name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: p.color }}>{p.count}</span>
                <div style={{ width: 50, height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 2, width: `${p.pct}%`, background: p.color, boxShadow: `0 0 6px ${p.glow}` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ R2C2: NACH PRIORITAET ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--red)',
            '--card-accent2': 'var(--green)',
            '--card-glow': 'rgba(248,113,113,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--orange)', color: 'var(--orange)' }} />
              <span className="card-title">Nach Prioritat</span>
            </div>
          </div>
          <div className="card-body">
            {priorities.map((p, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 0',
                borderBottom: i < priorities.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, boxShadow: p.glow ? `0 0 8px ${p.glow}` : 'none' }} />
                <span style={{ flex: 1, fontSize: 10, color: p.glow ? p.color : undefined }}>{p.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: p.glow ? p.color : undefined }}>{p.count}</span>
              </div>
            ))}
            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Verteilung</div>
              <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: 2 }}>
                <div style={{ width: '11%', background: 'var(--red)', boxShadow: '0 0 6px var(--red-glow)' }} />
                <div style={{ width: '28%', background: 'var(--orange)', boxShadow: '0 0 6px var(--orange-glow)' }} />
                <div style={{ width: '44%', background: 'var(--green)', boxShadow: '0 0 6px var(--green-glow)' }} />
                <div style={{ width: '17%', background: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ R2C3: KALENDER ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--blue)',
            '--card-accent2': 'var(--cyan)',
            '--card-glow': 'rgba(96,165,250,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--blue)', color: 'var(--blue)' }} />
              <span className="card-title">Kalender</span>
            </div>
            <span className="card-header-right">April 2026</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, textAlign: 'center' }}>
              {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(h => (
                <div key={h} style={{ fontSize: 7, color: 'var(--text-muted)', padding: '4px 0' }}>{h}</div>
              ))}
              {calendarDays.map((d, i) => {
                if (d.day === 0) return <div key={`empty-${i}`} />
                const isToday = !!d.today
                const hasTodo = !!d.hasTodo
                const isPast = !!d.past
                return (
                  <div
                    key={i}
                    style={{
                      fontSize: 8, padding: '4px 0', borderRadius: 4, cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: isToday ? 'rgba(45,212,191,0.2)' : hasTodo ? 'rgba(45,212,191,0.1)' : 'transparent',
                      color: isToday ? 'var(--cyan)' : hasTodo ? 'var(--cyan)' : isPast ? 'var(--text-muted)' : undefined,
                      fontWeight: isToday ? 700 : hasTodo ? 600 : undefined,
                      boxShadow: isToday ? '0 0 8px var(--cyan-glow)' : 'none',
                      opacity: isPast && !hasTodo && !isToday ? 0.5 : 1,
                    }}
                  >
                    {d.day}
                  </div>
                )
              })}
            </div>
            <div style={{
              marginTop: 'auto', paddingTop: 8,
              borderTop: '1px solid var(--border)',
              display: 'flex', gap: 10, fontSize: 7, color: 'var(--text-muted)',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 4, background: 'rgba(45,212,191,0.2)' }} />
                Todo-Tage
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 4, background: 'rgba(45,212,191,0.3)', boxShadow: '0 0 6px var(--cyan-glow)' }} />
                Heute
              </span>
            </div>
          </div>
        </div>

        {/* ═══════════════ R3C1: ERLEDIGT HEUTE ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--green)',
            '--card-accent2': 'var(--cyan)',
            '--card-glow': 'rgba(52,211,153,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--green)', color: 'var(--green)' }} />
              <span className="card-title">Erledigt Heute</span>
            </div>
            <span className="card-header-right" style={{ color: 'var(--green)' }}>3 {'\u2713'}</span>
          </div>
          <div className="card-body">
            {doneToday.map((d, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 0',
                borderBottom: i < doneToday.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                opacity: 0.5,
              }}>
                <span style={{
                  width: 14, height: 14, borderRadius: 4,
                  background: 'var(--green)', border: '2px solid var(--green)',
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 7, color: '#fff',
                }}>{'\u2713'}</span>
                <span style={{ flex: 1, fontSize: 10, textDecoration: 'line-through' }}>{d.text}</span>
                <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{d.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ R3C2: STATISTIK ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--cyan)',
            '--card-accent2': 'var(--purple)',
            '--card-glow': 'rgba(45,212,191,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--cyan)', color: 'var(--cyan)' }} />
              <span className="card-title">Statistik</span>
            </div>
          </div>
          <div className="card-body">
            {stats.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '8px 0',
                borderBottom: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: s.color }}>{s.value}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-secondary)', display: 'block' }}>{s.label}</span>
                  <span style={{ fontSize: 7, color: 'var(--text-muted)', display: 'block' }}>{s.sub}</span>
                </div>
              </div>
            ))}
            {/* Weekly bar chart */}
            <div style={{ marginTop: 'auto', paddingTop: 10 }}>
              <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Wochentrend</div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 40 }}>
                {weeklyTrend.map((b, i) => (
                  <div key={i} style={{
                    flex: 1, height: `${b.pct}%`,
                    background: b.color,
                    borderRadius: '3px 3px 1px 1px',
                    opacity: b.opacity,
                    boxShadow: b.glow || 'none',
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 7, color: 'var(--text-muted)', marginTop: 4 }}>
                {['Mo', 'Di', 'Mi', 'Do', 'Fr'].map((d, i) => (
                  <span key={d} style={{ color: i === 4 ? 'var(--cyan)' : undefined }}>{d}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ R3C3: NEUES TODO ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--pink)',
            '--card-accent2': 'var(--green)',
            '--card-glow': 'rgba(244,114,182,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--pink)', color: 'var(--pink)' }} />
              <span className="card-title">Neues Todo</span>
            </div>
          </div>
          <div className="card-body" style={{ gap: 12 }}>
            <button style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: 12, borderRadius: 12,
              border: '1px dashed rgba(45,212,191,0.3)',
              cursor: 'pointer', fontSize: 10, fontWeight: 600,
              color: 'var(--cyan)', transition: t,
              fontFamily: 'inherit', background: 'rgba(45,212,191,0.04)', width: '100%',
            }}>
              <svg viewBox="0 0 24 24" width={14} height={14} stroke="currentColor" strokeWidth={2} fill="none">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Schnell-Todo hinzufugen
            </button>
            <button style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: 12, borderRadius: 12,
              border: '1px dashed var(--border)',
              cursor: 'pointer', fontSize: 10, fontWeight: 600,
              color: 'var(--text-muted)', transition: t,
              fontFamily: 'inherit', background: 'none', width: '100%',
            }}>
              <svg viewBox="0 0 24 24" width={14} height={14} stroke="currentColor" strokeWidth={2} fill="none">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Todo mit Details anlegen
            </button>
            <div style={{
              marginTop: 'auto', padding: 12,
              background: 'rgba(10,20,25,0.18)',
              borderRadius: 12,
              border: '1px solid var(--border)',
            }}>
              <input
                type="text"
                placeholder="Was muss erledigt werden?"
                style={{
                  width: '100%', background: 'none', border: 'none',
                  color: 'var(--text-primary)', fontSize: 10,
                  fontFamily: 'inherit', outline: 'none',
                }}
              />
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <select style={{
                  flex: 1, background: 'rgba(0,0,0,0.25)',
                  border: '1px solid var(--border)', borderRadius: 8,
                  padding: '6px 8px', color: 'var(--text-primary)',
                  fontSize: 8, fontFamily: 'inherit',
                  appearance: 'none' as const,
                }}>
                  <option>Projekt...</option>
                  <option>MC</option>
                  <option>HB</option>
                  <option>TC</option>
                </select>
                <select style={{
                  flex: 1, background: 'rgba(0,0,0,0.25)',
                  border: '1px solid var(--border)', borderRadius: 8,
                  padding: '6px 8px', color: 'var(--text-primary)',
                  fontSize: 8, fontFamily: 'inherit',
                  appearance: 'none' as const,
                }}>
                  <option>Prioritat...</option>
                  <option>Hoch</option>
                  <option>Normal</option>
                  <option>Niedrig</option>
                </select>
                <button style={{
                  padding: '6px 14px', border: 'none', borderRadius: 8,
                  background: 'linear-gradient(135deg,var(--cyan),var(--green))',
                  color: 'var(--bg-dark)', fontSize: 8, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>Add</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
