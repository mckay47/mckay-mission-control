import DetailHeader from '../DetailHeader'

/* ── Dummy data ─────────────────────────────────────────── */

const yesterdayStats = [
  { value: '8', label: 'Todos erledigt', color: 'var(--green)' },
  { value: '3', label: 'Projekte bearbeitet', color: 'var(--purple)' },
  { value: '2', label: 'Ideen captured', color: 'var(--orange)' },
  { value: '1', label: 'Research fertig', color: 'var(--cyan)' },
]

const highlights = [
  'API Routes komplett fertiggestellt',
  'Login Flow funktioniert end-to-end',
  'Layer 1 Mockup finalisiert (9/10)',
]

const problems: { text: string; color: string }[] = [
  { text: 'Auth Bug — Token Refresh schlägt fehl', color: 'var(--red)' },
  { text: 'Slow API Response auf /search (>2s)', color: 'var(--orange)' },
]

const kaniCards = [
  {
    id: 1,
    text: '"Fokus auf Hebammenbuero MVP — nur noch 3 Tage bis Deadline. Auth Bug zuerst fixen, dann Kalender-Integration abschließen."',
    tags: [
      { label: 'URGENT', bg: 'rgba(248,113,113,0.12)', color: 'var(--red)' },
      { label: 'HB', bg: 'rgba(52,211,153,0.12)', color: 'var(--green)' },
    ],
  },
  {
    id: 2,
    text: '"Stillprobleme hat 2 Blocker — Credentials fehlen seit 3 Tagen. Entweder heute lösen oder Projekt temporär pausieren."',
    tags: [
      { label: 'BLOCKED', bg: 'rgba(251,191,36,0.12)', color: 'var(--orange)' },
      { label: 'SP', bg: 'rgba(248,113,113,0.12)', color: 'var(--red)' },
    ],
  },
  {
    id: 3,
    text: '"Meeting um 14:00 nicht vergessen — Client Call für TennisCoach Review. Deck ist vorbereitet."',
    tags: [
      { label: 'REMINDER', bg: 'rgba(96,165,250,0.12)', color: 'var(--blue)' },
      { label: 'TC', bg: 'rgba(251,191,36,0.12)', color: 'var(--orange)' },
    ],
  },
]

const todayChecklist = [
  { icon: '\u2610', text: '6 Todos geplant', color: undefined },
  { icon: '\u2610', text: '2 Meetings scheduled', color: undefined },
  { icon: '\u26A0', text: '1 Deadline (HB MVP)', color: 'var(--red)' },
]

const priorities = [
  { num: '1.', text: 'Auth Bug fixen + MVP finishen', tag: 'Critical', numColor: 'var(--red)', tagBg: 'rgba(248,113,113,0.12)', tagColor: 'var(--red)' },
  { num: '2.', text: 'Validation Call vorbereiten', tag: 'High', numColor: 'var(--orange)', tagBg: 'rgba(251,191,36,0.12)', tagColor: 'var(--orange)' },
  { num: '3.', text: 'Research Idee SmartHome X', tag: 'Normal', numColor: 'var(--green)', tagBg: 'rgba(52,211,153,0.12)', tagColor: 'var(--green)' },
]

const calendarEvents = [
  { time: '10:00', name: 'Daily Standup', sub: '15 min \u00B7 Alle Projekte', color: 'var(--cyan)' },
  { time: '14:00', name: 'Client Call — TennisCoach', sub: '45 min \u00B7 Review + Feedback', color: 'var(--orange)' },
  { time: '16:00', name: 'Code Review', sub: '30 min \u00B7 MC Layer 2', color: 'var(--purple)' },
]

/* ── Shared inline-style helpers ────────────────────────── */

const sectionStyle: React.CSSProperties = {
  padding: '14px 16px',
  background: 'rgba(10,20,25,0.18)',
  backdropFilter: 'blur(8px)',
  borderRadius: 12,
  border: '1px solid var(--border)',
}

const sectionTitleStyle = (color: string): React.CSSProperties => ({
  fontSize: 8,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 1.5,
  marginBottom: 10,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  color,
})

const dotIndicator = (color: string): React.CSSProperties => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  background: color,
  boxShadow: `0 0 8px ${color}`,
  flexShrink: 0,
})

/* ── Component ──────────────────────────────────────────── */

export default function BriefingDetail() {
  return (
    <div className="dashboard" style={{ gridTemplateRows: '44px 1fr' }}>
      <DetailHeader
        title="BRIEFING"
        color="purple"
        pills={[
          { value: 'Mi, 02. Apr', label: '', color: 'cyan' },
          { value: '3', label: 'Tipps', color: 'purple' },
        ]}
      />

      {/* 3-column briefing grid */}
      <div
        style={{
          gridColumn: '1/-1',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 18,
          overflow: 'hidden',
        }}
      >
        {/* ═══════════════ COLUMN 1 — GESTERN ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--green)',
            '--card-accent2': 'var(--cyan)',
            '--card-glow': 'rgba(52,211,153,0.05)',
          } as React.CSSProperties}
        >
          {/* Header */}
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon green" />
              <span className="card-title">Gestern</span>
            </div>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Di, 01. Apr
            </span>
          </div>

          <div style={{ flex: 1, padding: '20px 22px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflowY: 'auto', gap: 14 }}>
            {/* Stats 2x2 */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle('var(--green)')}>
                <span style={dotIndicator('var(--green)')} />
                Was wurde erledigt
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {yesterdayStats.map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                    <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', minWidth: 32, color: s.color }}>{s.value}</span>
                    <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle('var(--cyan)')}>
                <span style={dotIndicator('var(--cyan)')} />
                Highlights
              </div>
              {highlights.map(h => (
                <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 10 }}>
                  <span style={{ ...dotIndicator('var(--green)'), boxShadow: '0 0 6px var(--green-glow)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{h}</span>
                </div>
              ))}
            </div>

            {/* Problems */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle('var(--red)')}>
                <span style={dotIndicator('var(--red)')} />
                Probleme
              </div>
              {problems.map(p => (
                <div key={p.text} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 10 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                  <span style={{ color: p.color }}>{p.text}</span>
                </div>
              ))}
            </div>

            {/* Activity sparkline */}
            <div style={{ marginTop: 'auto', paddingTop: 10 }}>
              <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                Aktivit&auml;t gestern
              </div>
              <svg
                viewBox="0 0 200 35"
                style={{ width: '100%', height: 35, filter: 'drop-shadow(0 0 4px var(--green-glow))' }}
              >
                <path
                  d="M0,30 L20,28 L40,25 L60,20 L80,18 L100,12 L120,15 L140,10 L160,8 L180,12 L200,6"
                  fill="none"
                  stroke="var(--green)"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <path
                  d="M0,30 L20,28 L40,25 L60,20 L80,18 L100,12 L120,15 L140,10 L160,8 L180,12 L200,6 L200,35 L0,35 Z"
                  fill="var(--green)"
                  opacity={0.06}
                />
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 7, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                <span>09:00</span><span>12:00</span><span>15:00</span><span>18:00</span><span>21:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ COLUMN 2 — EMPFEHLUNG (KANI) ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--purple)',
            '--card-accent2': 'var(--pink)',
            '--card-glow': 'rgba(167,139,250,0.06)',
          } as React.CSSProperties}
        >
          {/* Header */}
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon purple" />
              <span className="card-title">Empfehlung</span>
            </div>
            <span style={{ color: 'var(--purple)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontFamily: 'var(--font-mono)' }}>
              <span style={{ width: 6, height: 6, background: 'var(--purple)', borderRadius: '50%', animation: 'dotPulse 2s ease-in-out infinite', boxShadow: '0 0 8px var(--purple-glow)' }} />
              KANI
            </span>
          </div>

          <div style={{ flex: 1, padding: '20px 22px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflowY: 'auto', gap: 14 }}>
            {/* KANI recommendation cards */}
            {kaniCards.map(card => (
              <div
                key={card.id}
                style={{
                  padding: '14px 16px',
                  background: 'rgba(167,139,250,0.04)',
                  border: '1px solid rgba(167,139,250,0.15)',
                  borderRadius: 12,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Gradient top border */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--purple), var(--pink), var(--cyan))', opacity: 0.6 }} />

                {/* KANI label */}
                <div style={{ fontSize: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--purple)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg viewBox="0 0 24 24" width={10} height={10} stroke="var(--purple)" strokeWidth={2} fill="none">
                    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                  </svg>
                  KANI Empfehlung #{card.id}
                </div>

                {/* Recommendation text */}
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                  {card.text}
                </div>

                {/* Tags */}
                <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
                  {card.tags.map(tag => (
                    <span
                      key={tag.label}
                      style={{
                        fontSize: 6,
                        padding: '2px 5px',
                        borderRadius: 3,
                        background: tag.bg,
                        color: tag.color,
                        fontWeight: 600,
                      }}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* Confidence gauge */}
            <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                KANI Confidence
              </div>
              <div style={{ display: 'flex', gap: 3, height: 6, borderRadius: 3, overflow: 'hidden' }}>
                <div
                  style={{
                    width: '92%',
                    background: 'linear-gradient(90deg, var(--purple), var(--cyan))',
                    boxShadow: '0 0 8px var(--purple-glow)',
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      animation: 'shimmer 2s ease-in-out infinite',
                    }}
                  />
                </div>
                <div style={{ width: '8%', background: 'rgba(255,255,255,0.04)', borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--purple)', marginTop: 4 }}>
                92%
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ COLUMN 3 — HEUTE ═══════════════ */}
        <div
          className="card"
          style={{
            '--card-accent': 'var(--cyan)',
            '--card-accent2': 'var(--blue)',
            '--card-glow': 'rgba(45,212,191,0.05)',
          } as React.CSSProperties}
        >
          {/* Header */}
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon cyan" />
              <span className="card-title">Heute</span>
            </div>
            <span style={{ fontSize: 9, color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>
              Mi, 02. Apr
            </span>
          </div>

          <div style={{ flex: 1, padding: '20px 22px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflowY: 'auto', gap: 14 }}>
            {/* Was ansteht */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle('var(--cyan)')}>
                <span style={dotIndicator('var(--cyan)')} />
                Was ansteht
              </div>
              {todayChecklist.map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 0', fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <span style={{ fontSize: 10, flexShrink: 0, marginTop: 2, color: item.color ?? 'inherit' }}>{item.icon}</span>
                  <span style={{ color: item.color ?? 'var(--text-secondary)' }}>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Priorities */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle('var(--orange)')}>
                <span style={dotIndicator('var(--orange)')} />
                Priorit&auml;ten
              </div>
              {priorities.map(p => (
                <div
                  key={p.num}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', width: 20, flexShrink: 0, color: p.numColor }}>{p.num}</span>
                  <span style={{ fontSize: 10, flex: 1, color: 'var(--text-secondary)' }}>{p.text}</span>
                  <span style={{ fontSize: 6, padding: '2px 5px', borderRadius: 3, fontWeight: 600, textTransform: 'uppercase', background: p.tagBg, color: p.tagColor }}>{p.tag}</span>
                </div>
              ))}
            </div>

            {/* Calendar */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle('var(--blue)')}>
                <span style={dotIndicator('var(--blue)')} />
                Kalender
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {calendarEvents.map(ev => (
                  <div
                    key={ev.time}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      background: 'rgba(10,20,25,0.18)',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      borderLeft: `3px solid ${ev.color}`,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: ev.color, width: 45, flexShrink: 0 }}>{ev.time}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, fontWeight: 600 }}>{ev.name}</div>
                      <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 2 }}>{ev.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Day progress */}
            <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: 'var(--text-muted)', marginBottom: 4 }}>
                <span>Tag-Fortschritt</span>
                <span style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>38%</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
                <div
                  style={{
                    width: '38%',
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--green), var(--cyan))',
                    borderRadius: 2,
                    boxShadow: '0 0 8px var(--cyan-glow)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      animation: 'shimmer 2s ease-in-out infinite',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
