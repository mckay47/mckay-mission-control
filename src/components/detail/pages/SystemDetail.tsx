import { useState, useEffect } from 'react'
import DetailHeader from '../DetailHeader'

/* ── Transition shorthand ──────────────────────────────── */
const t = 'all 0.3s cubic-bezier(0.4,0,0.2,1)'

/* ── Dummy data ────────────────────────────────────────── */

const hardwareMetrics = [
  { label: 'CPU', baseVal: 42, color: 'var(--green)', glow: 'var(--green-glow)', iconBg: 'rgba(52,211,153,0.12)', icon: <svg viewBox="0 0 24 24" width={11} height={11} stroke="currentColor" strokeWidth={2} fill="none"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /></svg> },
  { label: 'RAM', baseVal: 68, color: 'var(--blue)', glow: 'var(--blue-glow)', iconBg: 'rgba(96,165,250,0.12)', icon: <svg viewBox="0 0 24 24" width={11} height={11} stroke="currentColor" strokeWidth={2} fill="none"><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 12h4M14 12h4" /></svg> },
  { label: 'Disk', baseVal: 31, color: 'var(--purple)', glow: 'var(--purple-glow)', iconBg: 'rgba(167,139,250,0.12)', icon: <svg viewBox="0 0 24 24" width={11} height={11} stroke="currentColor" strokeWidth={2} fill="none"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg> },
  { label: 'GPU', baseVal: 18, color: 'var(--orange)', glow: 'var(--orange-glow)', iconBg: 'rgba(251,191,36,0.12)', icon: <svg viewBox="0 0 24 24" width={11} height={11} stroke="currentColor" strokeWidth={2} fill="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> },
  { label: 'Batterie', baseVal: 87, color: 'var(--green)', glow: 'var(--green-glow)', iconBg: 'rgba(52,211,153,0.12)', icon: <svg viewBox="0 0 24 24" width={11} height={11} stroke="currentColor" strokeWidth={2} fill="none"><rect x="1" y="6" width="18" height="12" rx="2" /><line x1="23" y1="13" x2="23" y2="11" /></svg>, static: true },
]

const sessionRows = [
  { label: 'Startzeit', value: '09:15', color: 'var(--cyan)' },
  { label: 'Klicks', value: '342', color: undefined },
  { label: 'Prompts', value: '28', color: 'var(--purple)' },
  { label: 'Tastenschlage', value: '4.8k', color: undefined },
  { label: 'Aktive Fenster', value: '3', color: 'var(--green)' },
  { label: 'Pausen', value: '2 \u00D7 15m', color: undefined },
]

const connections = [
  { name: 'Internet', value: '120 Mbps', color: 'var(--green)', online: true },
  { name: 'Supabase', value: '24ms', color: 'var(--cyan)', online: true, fluctuate: 'supa' as const },
  { name: 'Vercel', value: 'online', color: 'var(--green)', online: true },
  { name: 'Claude API', value: '4.2s', color: 'var(--purple)', online: true, fluctuate: 'claude' as const },
  { name: 'GitHub', value: 'connected', color: 'var(--cyan)', online: true },
]

const terminals = [
  { name: 'Hebammenbuero', active: true },
  { name: 'System', active: true },
  { name: 'Stillprobleme', active: false },
  { name: 'Mission Control', active: true },
  { name: 'TennisCoach', active: false },
]

const activityLog = [
  { time: '12:30', color: 'var(--purple)', text: <>Projekt <strong>Mission Control</strong> — Grid Layout angepasst</> },
  { time: '12:15', color: 'var(--pink)', text: <>Thinktank — neue Idee <strong>{'"API Design Pattern"'}</strong> gespeichert</> },
  { time: '11:45', color: 'var(--cyan)', text: <>Briefing generiert — 8 Todos, 2 Meetings identifiziert</> },
  { time: '11:20', color: 'var(--green)', text: <>Todo <strong>{'"Login UI"'}</strong> abgeschlossen</> },
  { time: '10:55', color: 'var(--orange)', text: <>Agent <strong>research-agent</strong> gestartet — Marktanalyse</> },
  { time: '10:30', color: 'var(--blue)', text: <>E-Mail von <strong>Laura</strong> — Termin Hebamme bestatigt</> },
  { time: '10:15', color: 'var(--green)', text: <>Deploy <strong>FindeMeine</strong> — Production update live</> },
  { time: '09:45', color: 'var(--purple)', text: <>Claude Code Session gestartet — <strong>Hebammenbuero</strong></> },
  { time: '09:15', color: 'var(--cyan)', text: <>Session gestartet — System Boot</> },
]

const tokenBudgets = [
  { label: 'Heute', value: '12K', color: 'var(--cyan)', pct: 24, gradient: 'linear-gradient(90deg,var(--cyan),var(--green))', glow: '0 0 10px var(--cyan-glow)' },
  { label: 'Diese Woche', value: '89K', color: 'var(--purple)', pct: 45, gradient: 'linear-gradient(90deg,var(--purple),var(--pink))', glow: '0 0 10px var(--purple-glow)' },
  { label: 'Monat', value: '175K', suffix: ' / 500K', color: 'var(--orange)', pct: 35, gradient: 'linear-gradient(90deg,var(--orange),var(--yellow))', glow: '0 0 10px var(--orange-glow)' },
]

const uptimeBars = [
  { label: 'Mo', hours: '5.2h', pct: 55, color: 'var(--green)', glow: '0 0 8px var(--green-glow)' },
  { label: 'Di', hours: '6.8h', pct: 72, color: 'var(--green)', glow: '0 0 8px var(--green-glow)' },
  { label: 'Mi', hours: '7.5h', pct: 80, color: 'var(--green)', glow: '0 0 8px var(--green-glow)' },
  { label: 'Do', hours: '6.1h', pct: 65, color: 'var(--green)', glow: '0 0 8px var(--green-glow)' },
  { label: 'Heute', hours: '5.1h', pct: 52, color: 'var(--cyan)', glow: '0 0 12px var(--cyan-glow)', today: true },
]

const perfRows = [
  { name: 'Claude API', color: 'var(--purple)', value: '4.2s', spark: 'M0,12 L7,8 L14,10 L21,6 L28,9 L35,5 L42,7 L50,4', fluctuate: 'claude' as const },
  { name: 'Supabase', color: 'var(--green)', value: '89ms', spark: 'M0,8 L7,7 L14,9 L21,6 L28,8 L35,7 L42,5 L50,6', fluctuate: 'supa' as const },
  { name: 'Vercel Edge', color: 'var(--cyan)', value: '42ms', spark: 'M0,6 L7,5 L14,7 L21,4 L28,6 L35,3 L42,5 L50,4' },
  { name: 'GitHub API', color: 'var(--blue)', value: '156ms', spark: 'M0,10 L7,8 L14,11 L21,7 L28,9 L35,8 L42,6 L50,7' },
  { name: 'DNS', color: 'var(--orange)', value: '12ms', spark: 'M0,5 L7,4 L14,6 L21,3 L28,5 L35,4 L42,3 L50,4' },
]

const deployDetails = [
  { label: 'Branch', value: 'dev', color: 'var(--purple)' },
  { label: 'Last Deploy', value: 'heute 10:15', color: 'var(--cyan)' },
  { label: 'Commit', value: 'a3f8c21', color: 'var(--text-muted)' },
  { label: 'Build Time', value: '34s', color: 'var(--green)' },
]

/* ── Component ─────────────────────────────────────────── */

export default function SystemDetail() {
  /* Fluctuating hardware values */
  const [hwValues, setHwValues] = useState<Record<string, number>>({
    CPU: 42, RAM: 68, GPU: 18,
  })
  const [temp, setTemp] = useState(62)
  const [supaMs, setSupaMs] = useState(24)
  const [claudeS, setClaudeS] = useState(4.2)

  useEffect(() => {
    const iv = setInterval(() => {
      setHwValues({
        CPU: 42 + Math.floor((Math.random() - 0.5) * 16),
        RAM: 68 + Math.floor((Math.random() - 0.5) * 10),
        GPU: 18 + Math.floor((Math.random() - 0.5) * 12),
      })
      setTemp(62 + Math.floor((Math.random() - 0.5) * 8))
      setSupaMs(24 + Math.floor((Math.random() - 0.5) * 20))
      setClaudeS(+(4.2 + (Math.random() - 0.5) * 1.5).toFixed(1))
    }, 2500)
    return () => clearInterval(iv)
  }, [])

  /* Resolve live metric values */
  const getHwVal = (m: typeof hardwareMetrics[number]) => {
    if (m.static) return m.baseVal
    return hwValues[m.label] ?? m.baseVal
  }
  const getConnValue = (c: typeof connections[number]) => {
    if (c.fluctuate === 'supa') return `${supaMs}ms`
    if (c.fluctuate === 'claude') return `${claudeS}s`
    return c.value
  }
  const getPerfValue = (p: typeof perfRows[number]) => {
    if (p.fluctuate === 'supa') return `${supaMs}ms`
    if (p.fluctuate === 'claude') return `${claudeS}s`
    return p.value
  }

  return (
    <div className="dashboard" style={{ gridTemplateRows: '44px 1fr' }}>
      <DetailHeader
        title="SYSTEM"
        color="cyan"
        pills={[
          { value: '98.7%', label: 'Uptime', color: 'green' },
          { value: '5', label: 'Services', color: 'cyan' },
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

        {/* ═══════════════ R1C1: HARDWARE ═══════════════ */}
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
              <span className="card-title">Hardware</span>
            </div>
            <span className="card-header-right">{temp}&deg;C</span>
          </div>
          <div className="card-body">
            {hardwareMetrics.map((m) => {
              const val = getHwVal(m)
              return (
                <div key={m.label} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px',
                  background: 'rgba(10,20,25,0.18)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  marginBottom: 8,
                  transition: t,
                  cursor: 'default',
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    background: m.iconBg, color: m.color,
                  }}>
                    {m.icon}
                  </div>
                  <span style={{ flex: 1, fontSize: 10, color: 'var(--text-secondary)' }}>{m.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: m.color }}>{val}%</span>
                  <div style={{ width: 60, height: 5, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 3, position: 'relative',
                      width: `${val}%`,
                      background: m.color,
                      boxShadow: `0 0 10px ${m.glow}`,
                      transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                    }}>
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)',
                        animation: 'shimmer 2s ease-in-out infinite',
                      }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ═══════════════ R1C2: SESSION HEUTE ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--cyan)',
            '--card-accent2': 'var(--blue)',
            '--card-glow': 'rgba(45,212,191,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--cyan)', color: 'var(--cyan)' }} />
              <span className="card-title">Session Heute</span>
            </div>
            <span className="card-header-right">seit 09:15</span>
          </div>
          <div className="card-body">
            <div style={{ textAlign: 'center', padding: '8px 0', marginBottom: 16 }}>
              <div style={{
                fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-mono)', lineHeight: 1,
                color: 'var(--cyan)', textShadow: '0 0 20px var(--cyan-glow)',
              }}>3h 24m</div>
              <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>Aktive Zeit</div>
            </div>
            {sessionRows.map((r) => (
              <div key={r.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{r.label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ R1C3: VERBINDUNGEN ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--blue)',
            '--card-accent2': 'var(--green)',
            '--card-glow': 'rgba(96,165,250,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--blue)', color: 'var(--blue)' }} />
              <span className="card-title">Verbindungen</span>
            </div>
            <span className="card-header-right">5 aktiv</span>
          </div>
          <div className="card-body">
            {connections.map((c) => (
              <div key={c.name} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px',
                background: 'rgba(10,20,25,0.18)',
                backdropFilter: 'blur(8px)',
                borderRadius: 10,
                border: '1px solid var(--border)',
                marginBottom: 8,
                transition: t,
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: c.online ? 'var(--green)' : 'var(--red)',
                  boxShadow: c.online ? '0 0 10px var(--green-glow)' : '0 0 10px var(--red-glow)',
                }} />
                <span style={{ flex: 1, fontSize: 10, color: 'var(--text-secondary)' }}>{c.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: c.color }}>{getConnValue(c)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ R2C1: AKTIVE TERMINALS ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--purple)',
            '--card-accent2': 'var(--cyan)',
            '--card-glow': 'rgba(167,139,250,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--purple)', color: 'var(--purple)' }} />
              <span className="card-title">Aktive Terminals</span>
            </div>
            <span className="card-header-right">3 offen</span>
          </div>
          <div className="card-body">
            {terminals.map((term) => (
              <div key={term.name} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px',
                background: 'rgba(10,20,25,0.18)',
                backdropFilter: 'blur(8px)',
                borderRadius: 10,
                border: '1px solid var(--border)',
                marginBottom: 6,
                transition: t,
                cursor: 'pointer',
                opacity: !term.active ? 0.5 : 1,
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: term.active ? 'var(--green)' : 'var(--text-muted)',
                  boxShadow: term.active ? '0 0 10px var(--green-glow)' : 'none',
                }} />
                <span style={{ flex: 1, fontSize: 10, fontWeight: 500 }}>{term.name}</span>
                <span style={{
                  fontSize: 8, padding: '2px 8px', borderRadius: 8,
                  fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5,
                  background: term.active ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.04)',
                  color: term.active ? 'var(--green)' : 'var(--text-muted)',
                }}>{term.active ? 'Active' : 'Idle'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ R2C2: AKTIVITAETS-LOG ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--orange)',
            '--card-accent2': 'var(--pink)',
            '--card-glow': 'rgba(251,191,36,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--orange)', color: 'var(--orange)' }} />
              <span className="card-title">Aktivitats-Log</span>
            </div>
            <span className="card-header-right">heute</span>
          </div>
          <div className="card-body" style={{ overflowY: 'auto' }}>
            {activityLog.map((entry, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '8px 0',
                borderBottom: i < activityLog.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', width: 42, flexShrink: 0, paddingTop: 1 }}>{entry.time}</span>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: entry.color, marginTop: 5, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{entry.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ R2C3: TOKEN BUDGET ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--pink)',
            '--card-accent2': 'var(--orange)',
            '--card-glow': 'rgba(244,114,182,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--pink)', color: 'var(--pink)' }} />
              <span className="card-title">Token Budget</span>
            </div>
            <span className="card-header-right">35% used</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tokenBudgets.map((tb, i) => (
                <div key={tb.label} style={{ marginTop: i > 0 ? 10 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{tb.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: tb.color }}>
                      {tb.value}
                      {tb.suffix && <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>{tb.suffix}</span>}
                    </span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden', marginTop: 4 }}>
                    <div style={{
                      height: '100%', borderRadius: 3, position: 'relative',
                      width: `${tb.pct}%`,
                      background: tb.gradient,
                      boxShadow: tb.glow,
                    }}>
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)',
                        animation: 'shimmer 2s ease-in-out infinite',
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Kosten Monat</span>
                <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>{'\u20AC'}52.70</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{'\u00D8'} pro Tag</span>
                <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{'\u20AC'}3.80</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ R3C1: UPTIME WOCHE ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--green)',
            '--card-accent2': 'var(--blue)',
            '--card-glow': 'rgba(52,211,153,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--green)', color: 'var(--green)' }} />
              <span className="card-title">Uptime Woche</span>
            </div>
            <span className="card-header-right">30h 44m</span>
          </div>
          <div className="card-body" style={{ justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80, marginTop: 8 }}>
              {uptimeBars.map((bar) => (
                <div key={bar.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: '100%', borderRadius: '4px 4px 2px 2px',
                    height: `${bar.pct}%`,
                    background: bar.color,
                    boxShadow: bar.glow,
                    position: 'relative',
                    transition: t,
                    border: bar.today ? '1px solid rgba(45,212,191,0.3)' : 'none',
                  }}>
                    <span style={{
                      fontSize: 7, fontFamily: 'var(--font-mono)', color: bar.today ? 'var(--cyan)' : 'var(--text-secondary)',
                      position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap',
                    }}>{bar.hours}</span>
                  </div>
                  <span style={{
                    fontSize: 7, color: bar.today ? 'var(--cyan)' : 'var(--text-muted)',
                    fontWeight: bar.today ? 600 : 400,
                  }}>{bar.label}</span>
                </div>
              ))}
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginTop: 14, paddingTop: 10,
              borderTop: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 8, color: 'var(--text-muted)' }}>{'\u00D8'} 6.1h / Tag</span>
              <span style={{ fontSize: 8, color: 'var(--green)', fontWeight: 600 }}>{'\u2191'} 12% vs letzte Woche</span>
            </div>
          </div>
        </div>

        {/* ═══════════════ R3C2: PERFORMANCE ═══════════════ */}
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
              <span className="card-title">Performance</span>
            </div>
            <span className="card-header-right">{'\u00D8'} Response</span>
          </div>
          <div className="card-body">
            {perfRows.map((p, i) => (
              <div key={p.name} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0',
                borderBottom: i < perfRows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--green)', boxShadow: '0 0 10px var(--green-glow)',
                }} />
                <span style={{ flex: 1, fontSize: 10, color: 'var(--text-secondary)' }}>{p.name}</span>
                <svg width={50} height={16} viewBox="0 0 50 16" style={{ flexShrink: 0 }}>
                  <path d={p.spark} stroke={p.color} strokeWidth={1.5} fill="none" />
                </svg>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: p.color }}>{getPerfValue(p)}</span>
              </div>
            ))}
            <div style={{
              marginTop: 'auto', paddingTop: 10,
              borderTop: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 8, color: 'var(--text-muted)' }}>Letzte 15min</span>
              <span style={{ fontSize: 8, color: 'var(--green)', fontWeight: 600 }}>Alle Systeme normal</span>
            </div>
          </div>
        </div>

        {/* ═══════════════ R3C3: DEPLOYMENT ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--orange)',
            '--card-accent2': 'var(--green)',
            '--card-glow': 'rgba(251,191,36,0.05)',
          } as React.CSSProperties}
        >
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--orange)', color: 'var(--orange)' }} />
              <span className="card-title">Deployment</span>
            </div>
            <span className="card-header-right">2 aktiv</span>
          </div>
          <div className="card-body">
            {/* Environments */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: 'var(--green)', boxShadow: '0 0 10px var(--green-glow)' }} />
              <span style={{ flex: 1, fontSize: 10, color: 'var(--text-muted)' }}>Production</span>
              <span style={{
                fontSize: 7, padding: '3px 8px', borderRadius: 6, fontWeight: 700, textTransform: 'uppercase',
                background: 'rgba(52,211,153,0.12)', color: 'var(--green)',
              }}>Live</span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: 'var(--orange)', boxShadow: '0 0 10px var(--orange-glow)' }} />
              <span style={{ flex: 1, fontSize: 10, color: 'var(--text-muted)' }}>Staging</span>
              <span style={{
                fontSize: 7, padding: '3px 8px', borderRadius: 6, fontWeight: 700, textTransform: 'uppercase',
                background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)',
              }}>Pending</span>
            </div>

            {/* Details */}
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              {deployDetails.map((d) => (
                <div key={d.label} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <span style={{ flex: 1, fontSize: 10, color: 'var(--text-muted)' }}>{d.label}</span>
                  <span style={{ fontSize: 10, fontWeight: 500, fontFamily: 'var(--font-mono)', color: d.color }}>{d.value}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div style={{ marginTop: 'auto', paddingTop: 10, display: 'flex', gap: 8 }}>
              <button style={{
                flex: 1, padding: 8, border: 'none', borderRadius: 10,
                fontSize: 9, fontWeight: 700, cursor: 'pointer',
                background: 'linear-gradient(135deg,var(--cyan),var(--green))',
                color: 'var(--bg-dark)',
                boxShadow: '0 0 20px var(--cyan-glow)',
                transition: t, fontFamily: 'inherit',
              }}>Deploy Now</button>
              <button style={{
                flex: 1, padding: 8,
                border: '1px solid var(--border)', borderRadius: 10,
                fontSize: 9, fontWeight: 600, cursor: 'pointer',
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--text-secondary)',
                transition: t, fontFamily: 'inherit',
              }}>Rollback</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
