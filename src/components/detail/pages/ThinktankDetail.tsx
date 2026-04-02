import { useState } from 'react'
import DetailHeader from '../DetailHeader'

/* ── data ─────────────────────────────────────────────── */
interface Thought {
  id: number
  icon: string
  name: string
  sub: string
  time: string
  color: string
  type: string
  body: string
  tags: { label: string; color: string }[]
}

const thoughts: Thought[] = [
  { id: 1, icon: '\u{1F4A1}', name: 'API Design Patterns', sub: 'REST vs GraphQL f\u00FCr Micro-SaaS', time: '12:30', color: 'var(--cyan)', type: 'Idee',
    body: '\u00DCberlegung: F\u00FCr unsere Micro-SaaS Produkte w\u00E4re ein einheitliches API-Design sinnvoll. GraphQL f\u00FCr komplexe Queries (Gastro Suite), REST f\u00FCr simple CRUD (FindeMeine). Shared Auth Layer \u00FCber alle Produkte. K\u00F6nnte ein eigenes SDK werden \u2192 "MCKAY API Kit". Monetarisierung: Open Source Core + Enterprise Features.',
    tags: [{ label: 'api', color: 'cyan' }, { label: 'architecture', color: 'purple' }, { label: 'sdk', color: 'green' }, { label: 'monetization', color: 'orange' }] },
  { id: 2, icon: '\u{1F4A1}', name: 'Pricing Strategy', sub: 'Freemium vs Trial-based', time: '11:45', color: 'var(--cyan)', type: 'Idee',
    body: 'Freemium lockt mehr Nutzer an, Trial konvertiert besser. Hybrid-Modell testen: 14-Tage Trial mit vollem Zugang, danach Free-Tier mit Limits. Upgrade-Trigger: Team-Size, API-Calls, Premium-Features.',
    tags: [{ label: 'monetization', color: 'orange' }, { label: 'strategy', color: 'pink' }, { label: 'growth', color: 'pink' }] },
  { id: 3, icon: '\u{1F3AF}', name: 'Q2 Roadmap', sub: '3 Projekte parallel vs sequenziell', time: '10:20', color: 'var(--orange)', type: 'Strategie',
    body: 'Kapazit\u00E4t realistisch einsch\u00E4tzen: 2 Projekte parallel max. Gastro Suite hat Priorit\u00E4t, FindeMeine im Maintenance-Mode, Mission Control als internes Tool nebenbei.',
    tags: [{ label: 'strategy', color: 'pink' }, { label: 'planning', color: 'purple' }] },
  { id: 4, icon: '\u{1F3AF}', name: 'Marketing Channels', sub: 'SEO vs Paid vs Community', time: '09:15', color: 'var(--orange)', type: 'Strategie',
    body: 'SEO langfristig aufbauen, kurzfristig Google Ads f\u00FCr hebammenbuero.de. Community-Building \u00FCber LinkedIn f\u00FCr B2B SaaS. Content-Marketing mit AI-generierten Fachartikeln.',
    tags: [{ label: 'marketing', color: 'blue' }, { label: 'growth', color: 'pink' }, { label: 'strategy', color: 'pink' }] },
  { id: 5, icon: '\u{1F4DD}', name: 'Tech Stack Notes', sub: 'Vercel Edge Functions testen', time: 'gest.', color: 'var(--purple)', type: 'Notiz',
    body: 'Edge Functions f\u00FCr API-Proxying und Caching evaluieren. Latenz-Vorteile bei geo-verteilten Nutzern. Kosten vs Supabase Edge Functions vergleichen.',
    tags: [{ label: 'tech', color: 'red' }, { label: 'architecture', color: 'purple' }] },
  { id: 6, icon: '\u{1F4A1}', name: 'Automation Ideas', sub: 'Agent-Pipelines f\u00FCr Content', time: 'gest.', color: 'var(--cyan)', type: 'Idee',
    body: 'KANI Agents k\u00F6nnten automatisch Blog-Posts, Social Media Content und Newsletter generieren. Trigger: neues Feature shipped \u2192 Content-Pipeline startet.',
    tags: [{ label: 'automation', color: 'orange' }, { label: 'api', color: 'cyan' }] },
]

const tagCloud = [
  { label: 'api', size: 'lg' as const, color: 'cyan', dur: '4s', delay: '0s' },
  { label: 'architecture', size: 'lg' as const, color: 'purple', dur: '5s', delay: '0.5s' },
  { label: 'monetization', size: 'md' as const, color: 'orange', dur: '4.5s', delay: '1s' },
  { label: 'saas', size: 'lg' as const, color: 'green', dur: '3.5s', delay: '0.3s' },
  { label: 'strategy', size: 'md' as const, color: 'pink', dur: '5s', delay: '0.7s' },
  { label: 'marketing', size: 'sm' as const, color: 'blue', dur: '4s', delay: '1.2s' },
  { label: 'tech', size: 'md' as const, color: 'red', dur: '4.2s', delay: '0.8s' },
  { label: 'sdk', size: 'sm' as const, color: 'cyan', dur: '3.8s', delay: '1.5s' },
  { label: 'planning', size: 'sm' as const, color: 'purple', dur: '0s', delay: '0s' },
  { label: 'automation', size: 'sm' as const, color: 'orange', dur: '0s', delay: '0s' },
  { label: 'ux', size: 'sm' as const, color: 'green', dur: '0s', delay: '0s' },
  { label: 'growth', size: 'sm' as const, color: 'pink', dur: '0s', delay: '0s' },
]

const relatedItems = [
  { icon: '\u{1F4A1}', name: 'Automation Ideas', tags: 'api, architecture', pct: '87%', pctColor: 'var(--blue)' },
  { icon: '\u{1F3AF}', name: 'Q2 Roadmap', tags: 'strategy, planning', pct: '72%', pctColor: 'var(--cyan)' },
  { icon: '\u{1F4DD}', name: 'Tech Stack Notes', tags: 'architecture, tech', pct: '65%', pctColor: 'var(--green)' },
  { icon: '\u{1F4A1}', name: 'Pricing Strategy', tags: 'monetization', pct: '58%', pctColor: 'var(--orange)' },
]

const logItems = [
  { time: '12:30', icon: '\u{1F4A1}', name: 'API Design Patterns', desc: 'Neue Idee erfasst', dotColor: 'var(--cyan)' },
  { time: '11:45', icon: '\u{1F4A1}', name: 'Pricing Strategy', desc: 'Idee hinzugef\u00FCgt', dotColor: 'var(--cyan)' },
  { time: '10:20', icon: '\u{1F3AF}', name: 'Q2 Roadmap', desc: 'Strategie aktualisiert', dotColor: 'var(--orange)' },
  { time: '09:15', icon: '\u{1F3AF}', name: 'Marketing Channels', desc: 'Neue Strategie', dotColor: 'var(--orange)' },
  { time: 'gest.', icon: '\u{1F4DD}', name: 'Tech Stack Notes', desc: 'Notiz bearbeitet', dotColor: 'var(--purple)' },
]

const waveformBars = [
  { x: 5, y: 10, h: 10, fill: 'var(--red)' }, { x: 12, y: 6, h: 18, fill: 'var(--red)' },
  { x: 19, y: 8, h: 14, fill: 'var(--red)' }, { x: 26, y: 4, h: 22, fill: 'var(--pink)' },
  { x: 33, y: 9, h: 12, fill: 'var(--pink)' }, { x: 40, y: 6, h: 18, fill: 'var(--red)' },
  { x: 47, y: 11, h: 8, fill: 'var(--red)' }, { x: 54, y: 7, h: 16, fill: 'var(--pink)' },
  { x: 61, y: 3, h: 24, fill: 'var(--red)' }, { x: 68, y: 8, h: 14, fill: 'var(--pink)' },
  { x: 75, y: 5, h: 20, fill: 'var(--red)' }, { x: 82, y: 10, h: 10, fill: 'var(--red)' },
  { x: 89, y: 7, h: 16, fill: 'var(--pink)' }, { x: 96, y: 4, h: 22, fill: 'var(--red)' },
  { x: 103, y: 9, h: 12, fill: 'var(--pink)' }, { x: 110, y: 6, h: 18, fill: 'var(--red)' },
  { x: 117, y: 11, h: 8, fill: 'var(--red)' }, { x: 124, y: 5, h: 20, fill: 'var(--pink)' },
  { x: 131, y: 8, h: 14, fill: 'var(--red)' }, { x: 138, y: 3, h: 24, fill: 'var(--pink)' },
  { x: 145, y: 10, h: 10, fill: 'var(--red)' }, { x: 152, y: 6, h: 18, fill: 'var(--red)' },
  { x: 159, y: 9, h: 12, fill: 'var(--pink)' }, { x: 166, y: 4, h: 22, fill: 'var(--red)' },
  { x: 173, y: 7, h: 16, fill: 'var(--pink)' }, { x: 180, y: 11, h: 8, fill: 'var(--red)' },
  { x: 187, y: 5, h: 20, fill: 'var(--red)' }, { x: 194, y: 8, h: 14, fill: 'var(--pink)' },
]

/* ── color helpers ────────────────────────────────────── */
const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  cyan:   { bg: 'rgba(45,212,191,0.08)',  border: 'rgba(45,212,191,0.15)',  text: 'var(--cyan)' },
  green:  { bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.15)',  text: 'var(--green)' },
  orange: { bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.15)',  text: 'var(--orange)' },
  purple: { bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.15)', text: 'var(--purple)' },
  pink:   { bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.15)', text: 'var(--pink)' },
  blue:   { bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.15)',  text: 'var(--blue)' },
  red:    { bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.15)', text: 'var(--red)' },
}

const tagColorMap: Record<string, { bg: string; border: string; text: string }> = {
  cyan:   { bg: 'rgba(45,212,191,0.1)',   border: 'rgba(45,212,191,0.2)',   text: 'var(--cyan)' },
  green:  { bg: 'rgba(52,211,153,0.1)',   border: 'rgba(52,211,153,0.2)',   text: 'var(--green)' },
  orange: { bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.2)',   text: 'var(--orange)' },
  purple: { bg: 'rgba(167,139,250,0.1)',  border: 'rgba(167,139,250,0.2)',  text: 'var(--purple)' },
  pink:   { bg: 'rgba(244,114,182,0.1)',  border: 'rgba(244,114,182,0.2)',  text: 'var(--pink)' },
  blue:   { bg: 'rgba(96,165,250,0.1)',   border: 'rgba(96,165,250,0.2)',   text: 'var(--blue)' },
  red:    { bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.2)',  text: 'var(--red)' },
}

const tagSizeMap = { lg: { fontSize: 12, padding: '6px 14px' }, md: { fontSize: 10, padding: '5px 12px' }, sm: { fontSize: 8, padding: '5px 10px' } }

/* ── component ────────────────────────────────────────── */
export default function ThinktankDetail() {
  const [selectedId, setSelectedId] = useState(1)
  const [recording, setRecording] = useState(false)

  const selected = thoughts.find(t => t.id === selectedId) ?? thoughts[0]

  const typeLabel = selected.type === 'Idee' ? '\u{1F4A1} Idee' : selected.type === 'Strategie' ? '\u{1F3AF} Strategie' : '\u{1F4DD} Notiz'
  const typeLabelColor = selected.type === 'Idee' ? 'cyan' : selected.type === 'Strategie' ? 'orange' : 'purple'

  return (
    <div className="dashboard" style={{ gridTemplateRows: '44px 1fr' }}>
      <DetailHeader
        title="THINKTANK"
        color="violet"
        pills={[
          { value: '12', label: 'Gedanken', color: 'violet' },
          { value: '5', label: 'Ideen', color: 'cyan' },
          { value: '3', label: 'Strategien', color: 'orange' },
        ]}
      />

      {/* 3x3 grid */}
      <div style={{ gridColumn: '1/-1', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'repeat(3,1fr)', gap: 18, overflow: 'hidden' }}>

        {/* ── R1C1: GEDANKEN ───────────────────────────── */}
        <div className="card" style={{ '--card-accent': 'var(--violet)', '--card-accent2': 'var(--purple)', '--card-glow': 'rgba(196,181,253,0.05)', animation: 'fadeInUp .5s ease-out both', animationDelay: '.05s' } as React.CSSProperties}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--violet)', color: 'var(--violet)' }} />
              <span className="card-title">Gedanken</span>
            </div>
            <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>12 total</span>
          </div>
          <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflowY: 'auto' }}>
            {thoughts.map(t => (
              <div
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
                  background: 'rgba(10,20,25,0.18)', backdropFilter: 'blur(8px)',
                  borderRadius: 10, border: `1px solid ${t.id === selectedId ? t.color : 'var(--border)'}`,
                  borderLeft: `3px solid ${t.color}`, marginBottom: 6, cursor: 'pointer',
                  transition: 'all .3s cubic-bezier(.4,0,.2,1)',
                  boxShadow: t.id === selectedId ? `0 0 12px color-mix(in srgb, ${t.color} 20%, transparent)` : 'none',
                }}
              >
                <span style={{ fontSize: 11, flexShrink: 0 }}>{t.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 2 }}>{t.sub}</div>
                </div>
                <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{t.time}</span>
              </div>
            ))}
            <div style={{ textAlign: 'center', padding: 6, fontSize: 8, color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: 8, cursor: 'pointer', marginTop: 4 }}>
              +6 weitere Gedanken
            </div>
          </div>
        </div>

        {/* ── R1C2: AUSGEWAHLT ─────────────────────────── */}
        <div className="card" style={{ '--card-accent': 'var(--cyan)', '--card-accent2': 'var(--green)', '--card-glow': 'rgba(45,212,191,0.05)', animation: 'fadeInUp .5s ease-out both', animationDelay: '.1s' } as React.CSSProperties}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--cyan)', color: 'var(--cyan)' }} />
              <span className="card-title">Ausgew&auml;hlt</span>
            </div>
            <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{selected.icon} {selected.type}</span>
          </div>
          <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflowY: 'auto' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--cyan)', marginBottom: 4 }}>{selected.name}</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              <span style={{ fontSize: 7, padding: '2px 6px', borderRadius: 4, background: colorMap[typeLabelColor]?.bg, color: colorMap[typeLabelColor]?.text, fontWeight: 600 }}>{typeLabel.toUpperCase()}</span>
              <span style={{ fontSize: 7, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>heute {selected.time}</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.7, flex: 1 }}>
              {selected.body}
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
              {selected.tags.map(tag => {
                const c = colorMap[tag.color]
                return (
                  <span key={tag.label} style={{ fontSize: 7, padding: '3px 8px', borderRadius: 12, background: c?.bg, border: `1px solid ${c?.border}`, color: c?.text }}>{tag.label}</span>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── R1C3: VERWANDTE ──────────────────────────── */}
        <div className="card" style={{ '--card-accent': 'var(--blue)', '--card-accent2': 'var(--purple)', '--card-glow': 'rgba(96,165,250,0.05)', animation: 'fadeInUp .5s ease-out both', animationDelay: '.15s' } as React.CSSProperties}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--blue)', color: 'var(--blue)' }} />
              <span className="card-title">Verwandte</span>
            </div>
            <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>by Tags</span>
          </div>
          <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflowY: 'auto' }}>
            {relatedItems.map(r => (
              <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'rgba(10,20,25,0.18)', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 5, cursor: 'pointer', transition: 'all .3s' }}>
                <span style={{ fontSize: 10 }}>{r.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>Tags: {r.tags}</div>
                </div>
                <span style={{ fontSize: 8, color: r.pctColor, fontFamily: 'var(--font-mono)' }}>{r.pct}</span>
              </div>
            ))}
            <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{'\u00C4'}hnlichkeit basierend auf Tags + Content</div>
            </div>
          </div>
        </div>

        {/* ── R2C1: TAGS CLOUD ─────────────────────────── */}
        <div className="card" style={{ '--card-accent': 'var(--pink)', '--card-accent2': 'var(--orange)', '--card-glow': 'rgba(244,114,182,0.05)', animation: 'fadeInUp .5s ease-out both', animationDelay: '.2s' } as React.CSSProperties}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--pink)', color: 'var(--pink)' }} />
              <span className="card-title">Tags</span>
            </div>
            <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>15 Tags</span>
          </div>
          <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
              {tagCloud.map(tag => {
                const c = tagColorMap[tag.color]
                const sz = tagSizeMap[tag.size]
                const hasFloat = tag.dur !== '0s'
                return (
                  <span
                    key={tag.label}
                    style={{
                      padding: sz.padding, borderRadius: 20, fontSize: sz.fontSize,
                      fontWeight: 600, cursor: 'pointer', transition: 'all .3s',
                      border: `1px solid ${c?.border}`, background: c?.bg, color: c?.text,
                      animation: hasFloat ? `floatTag ${tag.dur} ease-in-out infinite ${tag.delay}` : undefined,
                    }}
                  >
                    {tag.label}
                  </span>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── R2C2: AI ANALYSE ─────────────────────────── */}
        <div className="card" style={{ '--card-accent': 'var(--purple)', '--card-accent2': 'var(--pink)', '--card-glow': 'rgba(167,139,250,0.06)', animation: 'fadeInUp .5s ease-out both', animationDelay: '.25s' } as React.CSSProperties}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--purple)', color: 'var(--purple)' }} />
              <span className="card-title">AI Analyse</span>
            </div>
            <span style={{ fontSize: 8, color: 'var(--purple)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, background: 'var(--purple)', borderRadius: '50%', animation: 'dotPulse 2s ease-in-out infinite', boxShadow: '0 0 8px var(--purple-glow)' }} />
              KANI
            </span>
          </div>
          <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflowY: 'auto' }}>
            {/* KANI box */}
            <div style={{ padding: '14px 16px', background: 'rgba(167,139,250,0.04)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: 12, position: 'relative', overflow: 'hidden' }}>
              {/* gradient top border */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--purple), var(--pink), var(--cyan))', opacity: 0.6 }} />
              <div style={{ fontSize: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--purple)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg viewBox="0 0 24 24" width={10} height={10} stroke="var(--purple)" strokeWidth={2} fill="none"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" /></svg>
                KANI&apos;s Take
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                &ldquo;Diese Idee passt perfekt zu deinem {'\u00D6'}kosystem. Ein shared API Kit k{'\u00F6'}nnte die Entwicklungszeit f{'\u00FC'}r neue Projekte um ~40% reduzieren. Empfehlung: Als eigenes Projekt in die Pipeline aufnehmen, Priorit{'\u00E4'}t nach Gastro Suite MVP.&rdquo;
              </div>
            </div>

            {/* Verkn\u00FCpfungen */}
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Verkn{'\u00FC'}pfungen</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 8, padding: '4px 8px', borderRadius: 6, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)', color: 'var(--green)' }}>{'\u2192'} Gastro Suite</span>
                <span style={{ fontSize: 8, padding: '4px 8px', borderRadius: 6, background: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.15)', color: 'var(--cyan)' }}>{'\u2192'} FindeMeine</span>
                <span style={{ fontSize: 8, padding: '4px 8px', borderRadius: 6, background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)', color: 'var(--purple)' }}>{'\u2192'} Idee: SDK</span>
              </div>
            </div>

            {/* Impact score */}
            <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: 'var(--text-muted)' }}>
                <span>Impact Score</span>
                <span style={{ color: 'var(--green)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>8.2/10</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── R2C3: EXPORT ─────────────────────────────── */}
        <div className="card" style={{ '--card-accent': 'var(--green)', '--card-accent2': 'var(--cyan)', '--card-glow': 'rgba(52,211,153,0.05)', animation: 'fadeInUp .5s ease-out both', animationDelay: '.3s' } as React.CSSProperties}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--green)', color: 'var(--green)' }} />
              <span className="card-title">Export</span>
            </div>
          </div>
          <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8, position: 'relative', zIndex: 1 }}>
            {[
              { label: 'Als Markdown exportieren', icon: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />, extra: <polyline points="14 2 14 8 20 8" /> },
              { label: 'In Projekt umwandeln', icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></> },
              { label: 'Teilen', icon: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></> },
              { label: 'Download (PDF)', icon: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></> },
            ].map(btn => (
              <button
                key={btn.label}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: 10, background: 'rgba(10,20,25,0.18)', borderRadius: 10,
                  border: '1px solid var(--border)', cursor: 'pointer', fontSize: 9, fontWeight: 600,
                  color: 'var(--text-secondary)', fontFamily: 'inherit', transition: 'all .3s cubic-bezier(.4,0,.2,1)', width: '100%',
                }}
              >
                <svg viewBox="0 0 24 24" width={12} height={12} stroke="currentColor" strokeWidth={2} fill="none">{btn.icon}{btn.extra}</svg>
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── R3C1: QUICK CAPTURE ──────────────────────── */}
        <div className="card" style={{ '--card-accent': 'var(--cyan)', '--card-accent2': 'var(--green)', '--card-glow': 'rgba(45,212,191,0.05)', animation: 'fadeInUp .5s ease-out both', animationDelay: '.35s' } as React.CSSProperties}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--cyan)', color: 'var(--cyan)' }} />
              <span className="card-title">Quick Capture</span>
            </div>
          </div>
          <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
            <textarea
              rows={4}
              placeholder="Gedanke tippen..."
              style={{
                width: '100%', background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 10,
                fontFamily: 'inherit', resize: 'none', transition: 'all .3s',
              }}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              <select
                style={{
                  flex: 1, background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '7px 8px', color: 'var(--text-primary)', fontSize: 9,
                  fontFamily: 'inherit', appearance: 'none' as const,
                }}
              >
                <option>{'\u{1F4A1}'} Idee</option>
                <option>{'\u{1F3AF}'} Strategie</option>
                <option>{'\u{1F4DD}'} Notiz</option>
              </select>
              <button
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '8px 20px', background: 'linear-gradient(135deg, var(--cyan), var(--green))',
                  borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 9, fontWeight: 600,
                  color: 'var(--bg-dark)', fontFamily: 'inherit', transition: 'all .3s cubic-bezier(.4,0,.2,1)',
                  boxShadow: '0 0 15px var(--cyan-glow)',
                }}
              >
                <svg viewBox="0 0 24 24" width={12} height={12} stroke="currentColor" strokeWidth={2} fill="none">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Hinzuf{'\u00FC'}gen
              </button>
            </div>
          </div>
        </div>

        {/* ── R3C2: VOICE INPUT ────────────────────────── */}
        <div className="card" style={{ '--card-accent': 'var(--red)', '--card-accent2': 'var(--pink)', '--card-glow': 'rgba(248,113,113,0.05)', animation: 'fadeInUp .5s ease-out both', animationDelay: '.4s' } as React.CSSProperties}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--red)', color: 'var(--red)' }} />
              <span className="card-title">Voice Input</span>
            </div>
          </div>
          <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, position: 'relative', zIndex: 1 }}>
            <button
              onClick={() => setRecording(r => !r)}
              style={{
                width: 50, height: 50, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--red), var(--pink))',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .3s', boxShadow: '0 0 20px var(--red-glow)',
                animation: recording ? 'micPulse 1.5s ease-in-out infinite' : 'none',
              }}
            >
              <svg viewBox="0 0 24 24" width={20} height={20} stroke="#fff" strokeWidth={2} fill="none">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center' }}>
              {recording ? 'Aufnahme l\u00E4uft...' : 'Klicke zum Aufnehmen'}
            </div>
            <div style={{ width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 10, border: '1px solid var(--border)', minHeight: 40, fontSize: 9, color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Transkription erscheint hier live...
            </div>
            <svg viewBox="0 0 200 30" style={{ width: '100%', height: 30, opacity: recording ? 0.7 : 0.3, transition: 'opacity .3s' }}>
              {waveformBars.map((bar, i) => (
                <rect key={i} x={bar.x} y={bar.y} width={3} height={bar.h} rx={1} fill={bar.fill} />
              ))}
            </svg>
          </div>
        </div>

        {/* ── R3C3: VERLAUF ────────────────────────────── */}
        <div className="card" style={{ '--card-accent': 'var(--orange)', '--card-accent2': 'var(--yellow)', '--card-glow': 'rgba(251,191,36,0.05)', animation: 'fadeInUp .5s ease-out both', animationDelay: '.45s' } as React.CSSProperties}>
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon" style={{ background: 'var(--orange)', color: 'var(--orange)' }} />
              <span className="card-title">Verlauf</span>
            </div>
            <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Letzte 5</span>
          </div>
          <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflowY: 'auto' }}>
            {logItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 0', borderBottom: i < logItems.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', fontSize: 9 }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', width: 42, flexShrink: 0 }}>{item.time}</span>
                <span style={{ width: 6, height: 6, borderRadius: '50%', marginTop: 4, flexShrink: 0, background: item.dotColor }} />
                <span style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {item.icon} <strong>{item.name}</strong> {'\u2014'} {item.desc}
                </span>
              </div>
            ))}
            <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: 'var(--text-muted)' }}>
                <span>{'\u00D8'} 2.4 Gedanken/Tag</span>
                <span style={{ color: 'var(--green)', fontWeight: 600 }}>{'\u2191'} 15%</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
