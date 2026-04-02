import DetailHeader from '../DetailHeader'

/* ── Dummy data ─────────────────────────────────────────── */

const parkedIdeas = [
  { name: 'Steuerberater SaaS', sub: 'B2B · Steuererklärung automatisieren', tag: 'SaaS', tagBg: 'rgba(251,191,36,0.12)', tagColor: 'var(--orange)', borderColor: 'var(--orange)' },
  { name: 'Fitness Tracker Pro', sub: 'B2C · KI-Ernährungsplan', tag: 'Health', tagBg: 'rgba(52,211,153,0.12)', tagColor: 'var(--green)', borderColor: 'var(--green)' },
  { name: 'Newsletter Tool', sub: 'B2B · AI-powered Newsletter', tag: 'Content', tagBg: 'rgba(167,139,250,0.12)', tagColor: 'var(--purple)', borderColor: 'var(--purple)' },
  { name: 'Freelancer CRM', sub: 'B2C · Client Management', tag: 'CRM', tagBg: 'rgba(45,212,191,0.12)', tagColor: 'var(--cyan)', borderColor: 'var(--cyan)' },
  { name: 'Pet Tracker App', sub: 'B2C · Tier Gesundheit', tag: 'Mobile', tagBg: 'rgba(244,114,182,0.12)', tagColor: 'var(--pink)', borderColor: 'var(--pink)' },
]

const researchItems = [
  { name: 'SmartHome X', pct: 60, color: 'var(--blue)', gradient: 'linear-gradient(90deg,var(--blue),var(--cyan))', glow: 'var(--blue-glow)', steps: [{ label: 'Markt', done: true }, { label: 'Wettbewerber', done: true }, { label: 'Pricing...', done: false }], delay: '0.5s' },
  { name: 'EdTech Platform', pct: 25, color: 'var(--purple)', gradient: 'linear-gradient(90deg,var(--purple),var(--pink))', glow: 'var(--purple-glow)', steps: [{ label: 'Markt...', done: false }, { label: 'Wettbewerber', done: false }, { label: 'Pricing', done: false }], delay: '1s' },
]

const ratings = [
  { label: 'Markt', value: 8, pct: 80, color: 'var(--green)', glow: 'var(--green-glow)' },
  { label: 'Aufwand', value: 6, pct: 60, color: 'var(--orange)', glow: 'var(--orange-glow)' },
  { label: 'Fit', value: 10, pct: 100, color: 'var(--cyan)', glow: 'var(--cyan-glow)' },
  { label: 'Revenue', value: 9, pct: 90, color: 'var(--purple)', glow: 'var(--purple-glow)' },
  { label: 'Timing', value: 9, pct: 90, color: 'var(--pink)', glow: 'var(--pink-glow)' },
]

const rejectedItems = [
  { name: 'Crypto Portfolio', reason: 'Regulierung zu unklar' },
  { name: 'Dating Nische', reason: 'Markt gesättigt' },
  { name: 'Print-on-Demand', reason: 'Zu niedrige Margen' },
]

const detailRows = [
  { key: 'Ursprung', value: 'Thinktank', color: 'var(--cyan)' },
  { key: 'Erstellt', value: '28. Mär 2026', color: undefined },
  { key: 'Kategorie', value: 'B2B SaaS', color: 'var(--orange)' },
  { key: 'Stack', value: 'Next.js + Supabase', color: undefined, small: true },
  { key: 'Est. Time', value: '6-8 Wochen', color: 'var(--purple)' },
]

const researchNotes = {
  market: [
    { key: 'Marktgröße', value: '€2.3B', color: 'var(--green)' },
    { key: 'CAGR', value: '12.4%', color: 'var(--cyan)' },
    { key: 'TAM DACH', value: '€340M', color: 'var(--purple)' },
  ],
  competition: [
    { key: 'Wettbewerber', value: '12', color: 'var(--orange)' },
    { key: 'Top 3', value: 'Gastrofix, orderbird, Lightspeed', color: undefined, small: true },
  ],
}

const pipelineStages = [
  { count: '5', label: 'Geparkt', bg: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' },
  { count: '2', label: 'Research', bg: 'rgba(96,165,250,0.08)', color: 'var(--blue)' },
  { count: '1', label: 'Bereit', bg: 'rgba(52,211,153,0.08)', color: 'var(--green)' },
  { count: '5', label: 'Projekt', bg: 'rgba(167,139,250,0.08)', color: 'var(--purple)' },
]

/* ── Shared styles ──────────────────────────────────────── */

const cardStyle = (accent: string, accent2: string, glow: string, delay: number): React.CSSProperties => ({
  '--card-accent': accent,
  '--card-accent2': accent2,
  '--card-glow': glow,
  animationDelay: `${delay}s`,
} as React.CSSProperties)

const ideaItemStyle = (borderColor: string): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 12px',
  background: 'rgba(10,20,25,0.18)',
  backdropFilter: 'blur(8px)',
  borderRadius: 10,
  border: '1px solid var(--border)',
  borderLeft: `3px solid ${borderColor}`,
  marginBottom: 6,
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
})

const detailSectionStyle: React.CSSProperties = {
  padding: '10px 12px',
  background: 'rgba(10,20,25,0.18)',
  borderRadius: 10,
  border: '1px solid var(--border)',
}

const detailRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '6px 0',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
}

const detailRowLastStyle: React.CSSProperties = {
  ...detailRowStyle,
  borderBottom: 'none',
}

const actionBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  padding: 10,
  background: 'rgba(10,20,25,0.18)',
  borderRadius: 10,
  border: '1px solid var(--border)',
  cursor: 'pointer',
  fontSize: 9,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  fontFamily: 'inherit',
  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
  width: '100%',
}

const actionBtnPrimaryStyle: React.CSSProperties = {
  ...actionBtnStyle,
  background: 'linear-gradient(135deg,var(--cyan),var(--green))',
  color: 'var(--bg-dark)',
  borderColor: 'transparent',
  boxShadow: '0 0 15px var(--cyan-glow)',
}

const ratingRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '8px 0',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
}

const ratingRowLastStyle: React.CSSProperties = {
  ...ratingRowStyle,
  borderBottom: 'none',
}

const rejectedItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
  background: 'rgba(248,113,113,0.03)',
  border: '1px solid rgba(248,113,113,0.1)',
  borderRadius: 10,
  marginBottom: 6,
  opacity: 0.6,
  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
}

const researchItemStyle: React.CSSProperties = {
  padding: 12,
  background: 'rgba(10,20,25,0.18)',
  backdropFilter: 'blur(8px)',
  borderRadius: 10,
  border: '1px solid var(--border)',
  marginBottom: 8,
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
}

const captureInputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(0,0,0,0.25)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: '10px 14px',
  color: 'var(--text-primary)',
  fontSize: 10,
  fontFamily: 'inherit',
  resize: 'none',
  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
}

const selectStyle: React.CSSProperties = {
  flex: 1,
  background: 'rgba(0,0,0,0.25)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: '7px 8px',
  color: 'var(--text-primary)',
  fontSize: 9,
  fontFamily: 'inherit',
  appearance: 'none' as const,
}

/* ── Component ──────────────────────────────────────────── */

export default function IdeenDetail() {
  return (
    <div className="dashboard" style={{ gridTemplateRows: '44px 1fr' }}>
      <DetailHeader
        title="IDEEN"
        color="orange"
        pills={[
          { value: '5', label: 'Geparkt' },
          { value: '2', label: 'Research', color: 'blue' },
          { value: '1', label: 'Bereit', color: 'green' },
        ]}
      />

      <div style={{ gridColumn: '1/-1', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: 18, overflow: 'hidden' }}>

        {/* ── R1C1: GEPARKT ──────────────────────────────────── */}
        <div className="card" style={cardStyle('var(--text-muted)', 'var(--purple)', 'rgba(167,139,250,0.03)', 0.05)}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--text-muted)', color: 'var(--text-muted)' }} />
              <span className="card-title">Geparkt</span>
            </div>
            <span className="card-header-right">5 Ideen</span>
          </div>
          <div className="card-body">
            {parkedIdeas.map((idea) => (
              <div key={idea.name} style={ideaItemStyle(idea.borderColor)}>
                <span style={{ fontSize: 12, color: 'var(--orange)', flexShrink: 0, animation: 'sparkle 3s ease-in-out infinite' }}>&#9733;</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 600 }}>{idea.name}</div>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 2 }}>{idea.sub}</div>
                </div>
                <span style={{ fontSize: 6, padding: '2px 5px', borderRadius: 3, textTransform: 'uppercase' as const, fontWeight: 600, background: idea.tagBg, color: idea.tagColor }}>{idea.tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── R1C2: IN RESEARCH ──────────────────────────────── */}
        <div className="card" style={cardStyle('var(--blue)', 'var(--purple)', 'rgba(96,165,250,0.05)', 0.1)}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--blue)', color: 'var(--blue)' }} />
              <span className="card-title">In Research</span>
            </div>
            <span className="card-header-right">2 aktiv</span>
          </div>
          <div className="card-body">
            {researchItems.map((item) => (
              <div key={item.name} style={researchItemStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--orange)', flexShrink: 0, animation: 'sparkle 3s ease-in-out infinite', animationDelay: item.delay }}>&#9733;</span>
                  <span style={{ fontSize: 11, fontWeight: 600 }}>{item.name}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: item.color }}>{item.pct}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.pct}%`, background: item.gradient, borderRadius: 3, boxShadow: `0 0 8px ${item.glow}`, position: 'relative', transition: 'width 1s' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)', animation: 'shimmer 2s ease-in-out infinite' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, fontSize: 8, color: 'var(--text-muted)' }}>
                  {item.steps.map((step) => (
                    <span key={step.label} style={step.done ? undefined : { color: item.color }}>{step.done ? `${step.label} ✓` : step.label}</span>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Research Agent</span>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>running</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Token Budget</span>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--orange)' }}>12K / 20K</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── R1C3: BEREIT ───────────────────────────────────── */}
        <div className="card" style={cardStyle('var(--green)', 'var(--cyan)', 'rgba(52,211,153,0.06)', 0.15)}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--green)', color: 'var(--green)' }} />
              <span className="card-title">Bereit</span>
            </div>
            <span className="card-header-right" style={{ color: 'var(--green)' }}>1 ready</span>
          </div>
          <div className="card-body">
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <span style={{ fontSize: 24, animation: 'sparkle 2s ease-in-out infinite', display: 'inline-block' }}>&#9733;</span>
              <div style={{ marginTop: 8, fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>Gastro Suite</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>Restaurant Management SaaS</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0' }}>
              <div style={{ width: 60, height: 60, position: 'relative', margin: '0 auto' }}>
                <svg viewBox="0 0 60 60" width={60} height={60} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={30} cy={30} r={24} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={5} />
                  <circle cx={30} cy={30} r={24} fill="none" stroke="var(--green)" strokeWidth={5} strokeLinecap="round" strokeDasharray={150.8} strokeDashoffset={22.6} style={{ filter: 'drop-shadow(0 0 8px var(--green-glow))' }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>8.5</span>
                  <span style={{ fontSize: 6, color: 'var(--text-muted)' }}>/10</span>
                </div>
              </div>
            </div>
            <button style={{ ...actionBtnPrimaryStyle, marginTop: 'auto' }}>
              <svg viewBox="0 0 24 24" width={12} height={12} stroke="currentColor" strokeWidth={2} fill="none"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              Projekt starten &rarr;
            </button>
          </div>
        </div>

        {/* ── R2C1: IDEE DETAILS ─────────────────────────────── */}
        <div className="card" style={cardStyle('var(--orange)', 'var(--yellow)', 'rgba(251,191,36,0.05)', 0.2)}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--orange)', color: 'var(--orange)' }} />
              <span className="card-title">Idee Details</span>
            </div>
            <span className="card-header-right">Gastro Suite</span>
          </div>
          <div className="card-body">
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)', marginBottom: 8 }}>Gastro Suite</div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
              All-in-One SaaS für Restaurants: Bestellverwaltung, Tischreservierung, Küchen-Display, Mitarbeiter-Planung, Inventar-Tracking. Mobile-first mit PWA.
            </div>
            <div style={detailSectionStyle}>
              {detailRows.map((row, i) => (
                <div key={row.key} style={i === detailRows.length - 1 ? detailRowLastStyle : detailRowStyle}>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{row.key}</span>
                  <span style={{ fontSize: row.small ? 9 : 10, fontWeight: 600, fontFamily: 'var(--font-mono)', color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── R2C2: RESEARCH NOTES ───────────────────────────── */}
        <div className="card" style={cardStyle('var(--cyan)', 'var(--blue)', 'rgba(45,212,191,0.05)', 0.25)}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--cyan)', color: 'var(--cyan)' }} />
              <span className="card-title">Research Notes</span>
            </div>
            <span className="card-header-right">Gastro Suite</span>
          </div>
          <div className="card-body">
            <div style={{ ...detailSectionStyle, marginBottom: 8 }}>
              {researchNotes.market.map((row, i) => (
                <div key={row.key} style={i === researchNotes.market.length - 1 ? detailRowLastStyle : detailRowStyle}>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{row.key}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)', color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div style={{ ...detailSectionStyle, marginBottom: 8 }}>
              {researchNotes.competition.map((row, i) => (
                <div key={row.key} style={i === researchNotes.competition.length - 1 ? detailRowLastStyle : detailRowStyle}>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{row.key}</span>
                  <span style={{ fontSize: row.small ? 9 : 10, fontWeight: 600, fontFamily: 'var(--font-mono)', color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div style={detailSectionStyle}>
              <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6 }}>Differenzierung</div>
              <div style={{ fontSize: 9, color: 'var(--text-secondary)', lineHeight: 1.5 }}>KI-gesteuerte Personalplanung, Predictive Ordering, integriertes Lieferanten-Management. Fokus auf Einzelrestaurants statt Ketten.</div>
            </div>
          </div>
        </div>

        {/* ── R2C3: BEWERTUNG ────────────────────────────────── */}
        <div className="card" style={cardStyle('var(--green)', 'var(--orange)', 'rgba(52,211,153,0.05)', 0.3)}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--green)', color: 'var(--green)' }} />
              <span className="card-title">Bewertung</span>
            </div>
            <span className="card-header-right" style={{ color: 'var(--green)' }}>8.5/10</span>
          </div>
          <div className="card-body">
            {ratings.map((r, i) => (
              <div key={r.label} style={i === ratings.length - 1 ? ratingRowLastStyle : ratingRowStyle}>
                <span style={{ fontSize: 10, width: 65, color: 'var(--text-secondary)' }}>{r.label}</span>
                <div style={{ flex: 1, height: 10, background: 'rgba(255,255,255,0.04)', borderRadius: 5, overflow: 'hidden', display: 'flex', gap: 2 }}>
                  <div style={{ height: '100%', width: `${r.pct}%`, background: r.color, boxShadow: `0 0 6px ${r.glow}`, borderRadius: 5, transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', width: 35, textAlign: 'right', color: r.color }}>{r.value}</span>
              </div>
            ))}
            {/* Spider / radar mini chart */}
            <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              <svg viewBox="0 0 120 100" width={120} height={100} style={{ margin: '0 auto', display: 'block' }}>
                <polygon points="60,10 108,35 94,85 26,85 12,35" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                <polygon points="60,30 88,45 80,75 40,75 32,45" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                <polygon points="60,15 104,37 90,82 30,82 16,37" fill="rgba(52,211,153,0.1)" stroke="var(--green)" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 0 6px var(--green-glow))' }} />
                <circle cx={60} cy={15} r={2.5} fill="var(--green)" style={{ filter: 'drop-shadow(0 0 4px var(--green-glow))' }} />
                <circle cx={104} cy={37} r={2.5} fill="var(--orange)" style={{ filter: 'drop-shadow(0 0 4px var(--orange-glow))' }} />
                <circle cx={90} cy={82} r={2.5} fill="var(--cyan)" style={{ filter: 'drop-shadow(0 0 4px var(--cyan-glow))' }} />
                <circle cx={30} cy={82} r={2.5} fill="var(--purple)" style={{ filter: 'drop-shadow(0 0 4px var(--purple-glow))' }} />
                <circle cx={16} cy={37} r={2.5} fill="var(--pink)" style={{ filter: 'drop-shadow(0 0 4px var(--pink-glow))' }} />
                <text x={60} y={7} fill="var(--text-muted)" textAnchor="middle" style={{ fontSize: 6, fontFamily: 'var(--font-mono)' }}>Markt</text>
                <text x={115} y={37} fill="var(--text-muted)" style={{ fontSize: 6, fontFamily: 'var(--font-mono)' }}>Aufw.</text>
                <text x={98} y={92} fill="var(--text-muted)" style={{ fontSize: 6, fontFamily: 'var(--font-mono)' }}>Fit</text>
                <text x={15} y={92} fill="var(--text-muted)" textAnchor="end" style={{ fontSize: 6, fontFamily: 'var(--font-mono)' }}>Rev.</text>
                <text x={5} y={37} fill="var(--text-muted)" textAnchor="end" style={{ fontSize: 6, fontFamily: 'var(--font-mono)' }}>Time</text>
              </svg>
            </div>
          </div>
        </div>

        {/* ── R3C1: ABGELEHNT ────────────────────────────────── */}
        <div className="card" style={cardStyle('var(--red)', 'var(--orange)', 'rgba(248,113,113,0.04)', 0.35)}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--red)', color: 'var(--red)' }} />
              <span className="card-title">Abgelehnt</span>
            </div>
            <span className="card-header-right">3 archiviert</span>
          </div>
          <div className="card-body">
            {rejectedItems.map((item) => (
              <div key={item.name} style={rejectedItemStyle}>
                <span style={{ fontSize: 10, color: 'var(--red)', fontWeight: 700, flexShrink: 0 }}>&#10007;</span>
                <span style={{ flex: 1, fontSize: 10, textDecoration: 'line-through', color: 'var(--text-muted)' }}>{item.name}</span>
                <span style={{ fontSize: 7, color: 'var(--red)', fontStyle: 'italic' }}>{item.reason}</span>
              </div>
            ))}
            <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Letzte Ablehnung</span>
                <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>vor 5d</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── R3C2: QUICK CAPTURE ────────────────────────────── */}
        <div className="card" style={cardStyle('var(--purple)', 'var(--pink)', 'rgba(167,139,250,0.05)', 0.4)}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--purple)', color: 'var(--purple)' }} />
              <span className="card-title">Quick Capture</span>
            </div>
          </div>
          <div className="card-body" style={{ gap: 10 }}>
            <textarea style={captureInputStyle} rows={3} placeholder="Neue Idee beschreiben..." readOnly />
            <div style={{ display: 'flex', gap: 6 }}>
              <select style={selectStyle} disabled>
                <option>Kategorie...</option>
                <option>SaaS</option>
                <option>Mobile</option>
                <option>E-Commerce</option>
                <option>Content</option>
              </select>
              <select style={selectStyle} disabled>
                <option>Modell...</option>
                <option>B2B</option>
                <option>B2C</option>
                <option>Marketplace</option>
              </select>
            </div>
            <button style={actionBtnPrimaryStyle}>
              <svg viewBox="0 0 24 24" width={12} height={12} stroke="currentColor" strokeWidth={2} fill="none"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg>
              Idee hinzufügen
            </button>
            <div style={{ marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 12px', background: 'rgba(10,20,25,0.18)', borderRadius: 10, border: '1px solid var(--border)' }}>
                {pipelineStages.map((stage, i) => (
                  <span key={stage.label} style={{ display: 'contents' }}>
                    <div style={{ flex: 1, textAlign: 'center', padding: '6px 4px', borderRadius: 6, fontSize: 7, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 0.5, background: stage.bg, color: stage.color }}>
                      <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', display: 'block', marginTop: 2 }}>{stage.count}</span>
                      {stage.label}
                    </div>
                    {i < pipelineStages.length - 1 && <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>&rarr;</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── R3C3: AKTIONEN ─────────────────────────────────── */}
        <div className="card" style={cardStyle('var(--cyan)', 'var(--green)', 'rgba(45,212,191,0.05)', 0.45)}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--cyan)', color: 'var(--cyan)' }} />
              <span className="card-title">Aktionen</span>
            </div>
          </div>
          <div className="card-body" style={{ gap: 8 }}>
            <button style={actionBtnPrimaryStyle}>
              <svg viewBox="0 0 24 24" width={12} height={12} stroke="currentColor" strokeWidth={2} fill="none"><circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2={16.65} y2={16.65} /></svg>
              Research starten
            </button>
            <button style={actionBtnStyle}>
              <svg viewBox="0 0 24 24" width={12} height={12} stroke="currentColor" strokeWidth={2} fill="none"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
              Bewertung anpassen
            </button>
            <button style={actionBtnStyle}>
              <svg viewBox="0 0 24 24" width={12} height={12} stroke="currentColor" strokeWidth={2} fill="none"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
              Notiz hinzufügen
            </button>
            <button style={actionBtnStyle}>
              <svg viewBox="0 0 24 24" width={12} height={12} stroke="currentColor" strokeWidth={2} fill="none"><rect x={3} y={3} width={18} height={18} rx={2} /><line x1={12} y1={8} x2={12} y2={16} /><line x1={8} y1={12} x2={16} y2={12} /></svg>
              In Projekt umwandeln
            </button>
            <button style={{ ...actionBtnStyle, borderColor: 'rgba(248,113,113,0.2)', color: 'var(--red)' }}>
              <svg viewBox="0 0 24 24" width={12} height={12} stroke="currentColor" strokeWidth={2} fill="none"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              Archivieren
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
