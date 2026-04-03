import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../shared/AppShell'
import Notifications from '../shared/Notifications'
import QuickAccess from '../shared/QuickAccess'
import { IDEAS } from '../../lib/data'
import type { Idea } from '../../lib/types'

/* ── Helpers ──────────────────────────────────────────── */

/** Map idea status to display phase + colors */
function phaseStyle(st: string): { label: string; bg: string; color: string } {
  switch (st) {
    case 'Bereit':
      return { label: 'Bereit', bg: 'var(--gc)', color: 'var(--g)' }
    case 'Research':
      return { label: 'Research', bg: 'var(--blc)', color: 'var(--bl)' }
    case 'Geparkt':
      return { label: 'Geparkt', bg: 'rgba(0,0,0,.04)', color: 'var(--tx3)' }
    case 'Projekt':
      return { label: 'Projekt', bg: 'var(--tc)', color: 'var(--t)' }
    default: // "Neu" and anything else
      return { label: st || 'Neu', bg: 'var(--blc)', color: 'var(--bl)' }
  }
}

/** Compute a score from idea feedback, or return null */
function ideaScore(idea: Idea): number | null {
  if (idea.feedback && idea.feedback.innovation) {
    return idea.feedback.innovation * 20
  }
  return null
}

/** Score color based on value */
function scoreColor(score: number | null): string {
  if (score === null) return 'var(--tx3)'
  if (score >= 80) return 'var(--r)'
  if (score >= 60) return 'var(--bl)'
  return 'var(--tx3)'
}

/** Glow color from idea.col or fallback */
function glowFromCol(col: string): string {
  const map: Record<string, string> = {
    'var(--r)': 'var(--rg)',
    'var(--g)': 'var(--gg)',
    'var(--bl)': 'var(--blg)',
    'var(--p)': 'var(--pg)',
    'var(--a)': 'var(--ag)',
    'var(--t)': 'var(--tg)',
    'var(--o)': 'var(--og)',
    'var(--c)': 'var(--blg)',
    'var(--t3)': 'rgba(0,0,0,.03)',
  }
  return map[col] || 'var(--blg)'
}

/** Category to tag color */
function catStyle(cat: string): { bg: string; color: string } {
  const lower = cat.toLowerCase()
  if (lower.includes('projekt')) return { bg: 'rgba(124,77,255,.06)', color: 'var(--p)' }
  if (lower.includes('feature')) return { bg: 'var(--gc)', color: 'var(--g)' }
  if (lower.includes('tool')) return { bg: 'var(--ac)', color: 'var(--a)' }
  if (lower.includes('investment')) return { bg: 'var(--tc)', color: 'var(--t)' }
  return { bg: 'var(--blc)', color: 'var(--bl)' }
}

/* ── Filters ─────────────────────────────────────────── */

const PHASE_FILTERS = ['Alle', 'Neu', 'Research', 'Bereit', 'Geparkt'] as const

/* ── Component ─────────────────────────────────────────── */

export default function Thinktank() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<string>('Alle')
  const [activeTag, setActiveTag] = useState(0)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [pipelineOpen, setPipelineOpen] = useState(false)

  /* ── Derived data ─────────────────────────────────── */

  const totalCount = IDEAS.length
  const neuCount = IDEAS.filter((i) => i.st === 'Neu').length
  const researchCount = IDEAS.filter((i) => i.st === 'Research').length
  const bereitCount = IDEAS.filter((i) => i.st === 'Bereit').length
  const geparktCount = IDEAS.filter((i) => i.st === 'Geparkt').length
  // const projektCount = IDEAS.filter((i) => i.st === 'Projekt').length

  const hotCount = IDEAS.filter((i) => {
    const s = ideaScore(i)
    return s !== null && s >= 80
  }).length

  const filterCounts: Record<string, number> = {
    Alle: totalCount,
    Neu: neuCount,
    Research: researchCount,
    Bereit: bereitCount,
    Geparkt: geparktCount,
  }

  // Build unique category tags from IDEAS
  const tagNavItems = useMemo(() => {
    const catMap = new Map<string, number>()
    IDEAS.forEach((idea) => {
      const cat = idea.cat || 'Sonstige'
      catMap.set(cat, (catMap.get(cat) || 0) + 1)
    })
    const items: { icon: string; name: string; count: number; colorVar: string; glowVar: string }[] = [
      { icon: '\u25CF', name: 'Alle', count: totalCount, colorVar: 'var(--p)', glowVar: 'var(--pg)' },
    ]
    const catColors: Record<string, { color: string; glow: string; icon: string }> = {
      'Projekt-Idee': { color: 'var(--bl)', glow: 'var(--blg)', icon: '\uD83D\uDCBB' },
      'Feature': { color: 'var(--g)', glow: 'var(--gg)', icon: '\u2764' },
      'Tool': { color: 'var(--a)', glow: 'var(--ag)', icon: '\uD83D\uDEE0' },
      'investment-thesis': { color: 'var(--t)', glow: 'var(--tg)', icon: '\uD83D\uDCB0' },
    }
    catMap.forEach((count, cat) => {
      const cc = catColors[cat] || { color: 'var(--tx2)', glow: 'rgba(0,0,0,.04)', icon: '\u25CF' }
      items.push({ icon: cc.icon, name: cat, count, colorVar: cc.color, glowVar: cc.glow })
    })
    return items
  }, [totalCount])

  // Filter ideas by phase
  const phaseFiltered = activeFilter === 'Alle'
    ? IDEAS
    : IDEAS.filter((i) => i.st === activeFilter)

  // Further filter by category tag
  const filteredIdeas = activeTag === 0
    ? phaseFiltered
    : phaseFiltered.filter((i) => i.cat === tagNavItems[activeTag]?.name)

  // Selected idea (clamp index)
  const clampedIdx = filteredIdeas.length > 0 ? Math.min(selectedIdx, filteredIdeas.length - 1) : -1
  const selected = clampedIdx >= 0 ? filteredIdeas[clampedIdx] : null

  // Pipeline phase groups
  const pipelinePhases = useMemo(() => {
    const phases: { name: string; color: string; glow: string; titleColor: string; ideas: Idea[] }[] = [
      { name: 'Geparkt', color: 'var(--tx3)', glow: '', titleColor: 'var(--tx3)', ideas: [] },
      { name: 'Neu', color: 'var(--bl)', glow: 'var(--blg)', titleColor: 'var(--bl)', ideas: [] },
      { name: 'Research', color: 'var(--p)', glow: 'var(--pg)', titleColor: 'var(--p)', ideas: [] },
      { name: 'Bereit', color: 'var(--g)', glow: 'var(--gg)', titleColor: 'var(--g)', ideas: [] },
      { name: 'Projekt', color: 'var(--t)', glow: 'var(--tg)', titleColor: 'var(--t)', ideas: [] },
    ]
    IDEAS.forEach((idea) => {
      const ph = phases.find((p) => p.name === idea.st) || phases[1] // default to Neu
      ph.ideas.push(idea)
    })
    return phases.filter((p) => p.ideas.length > 0)
  }, [])

  // Detail scores from idea fields
  const detailScores = selected
    ? [
        { label: 'Fit', value: selected.f, max: 5, color: 'var(--g)' },
        { label: 'Potenzial', value: selected.pot, max: 5, color: 'var(--bl)' },
        { label: 'Komplexitaet', value: selected.c, max: 5, color: 'var(--p)' },
        { label: 'Speed', value: selected.spd, max: 5, color: 'var(--a)' },
        { label: 'Risiko', value: selected.r, max: 5, color: 'var(--r)' },
      ]
    : []

  // Ticker items from IDEAS
  const tickerItems = IDEAS.slice(0, 6).map((idea) => ({
    agent: 'kani',
    color: idea.col || 'var(--p)',
    text: `${idea.n} — ${idea.st}`,
  }))

  /* ── Empty state ──────────────────────────────────── */

  if (IDEAS.length === 0) {
    return (
      <AppShell title="Thinktank" ledColor="p">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--tx3)', fontSize: 14 }}>
          Keine Ideen — erste Idee im Capture Input erfassen
        </div>
      </AppShell>
    )
  }

  const selectedScore = selected ? ideaScore(selected) : null
  const selectedPhase = selected ? phaseStyle(selected.st) : null

  return (
    <AppShell title="Thinktank" ledColor="p">
      {/* KPIs + Capture */}
      <div className="krow">
        <div className="kpi cf" style={{ '--kc': 'var(--pg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--pg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--p)">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--p)' }}>{totalCount}</div>
            <div className="kl">Ideen gesamt</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--rg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--rg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--r)">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--r)' }}>{hotCount}</div>
            <div className="kl">Hot</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--blg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--blg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--bl)">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--bl)' }}>{researchCount + neuCount}</div>
            <div className="kl">Research</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--gg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--gg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--g)">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--g)' }}>{bereitCount}</div>
            <div className="kl">Bereit</div>
          </div>
        </div>
        <div className="capc cf">
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--pg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--p)">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <input className="in" placeholder="Neue Idee erfassen..." />
          <button>+ Idee</button>
        </div>
      </div>

      {/* Pipeline */}
      <div className="pipeline">
        <div className="cf" style={{ overflow: 'hidden' }}>
          <div className="pl-bar" onClick={() => setPipelineOpen((p) => !p)}>
            <span className="st" style={{ whiteSpace: 'nowrap' }}>Pipeline</span>
            <div className="pl-track in">
              {pipelinePhases.map((ph) => (
                <div key={ph.name} className="pl-seg" style={{ flex: ph.ideas.length, background: ph.color }}>
                  {ph.ideas.length}
                </div>
              ))}
            </div>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: 'var(--p)', whiteSpace: 'nowrap' }}>
              {totalCount} Ideen
            </span>
            <span style={{ fontSize: 10, color: 'var(--tx3)', cursor: 'pointer' }}>
              {pipelineOpen ? '\u25B2' : '\u25BC'}
            </span>
          </div>
          {pipelineOpen && (
            <div className="pl-detail open">
              {pipelinePhases.map((ph) => (
                <div key={ph.name} className="pl-phase">
                  <div
                    className="pl-phase-dot"
                    style={{
                      background: ph.color,
                      boxShadow: ph.glow ? `0 0 8px ${ph.glow}` : undefined,
                    }}
                  />
                  <div className="pl-phase-info">
                    <div className="pl-phase-title" style={{ color: ph.titleColor }}>
                      {ph.name === 'Projekt' ? '\u2192 Projekt' : ph.name}
                    </div>
                    <div className="pl-phase-count" style={{ color: ph.titleColor }}>
                      {ph.ideas.length} {ph.ideas.length === 1 ? 'Idee' : 'Ideen'}
                    </div>
                    <div className="pl-phase-items">
                      {ph.ideas.map((idea, i) => (
                        <span key={idea.id}>
                          {'\u25CF'} {idea.n}
                          {i < ph.ideas.length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section titles + filters */}
      <div className="trow" style={{ gridTemplateColumns: '90px 1fr 380px' }}>
        <span className="st">Filter</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="st" style={{ marginRight: 12 }}>Ideen</span>
          {PHASE_FILTERS.map((f) => (
            <button
              key={f}
              className={`fb${activeFilter === f ? ' active' : ''}`}
              onClick={() => { setActiveFilter(f); setSelectedIdx(0) }}
            >
              {f} <span className="fc">{filterCounts[f] ?? 0}</span>
            </button>
          ))}
        </div>
        <span className="st">Detail & KANI</span>
      </div>

      {/* BODY: tags sidebar + idea grid + detail/kani */}
      <div className="mbody" style={{ gridTemplateColumns: '90px 1fr 380px', flex: 6 }}>
        {/* Left: Tag nav */}
        <div className="lnav">
          {tagNavItems.map((tag, i) => (
            <div
              key={tag.name}
              className={`ni cf${activeTag === i ? ' active' : ''}`}
              style={{ '--nc': tag.glowVar, boxShadow: activeTag === i ? 'inset 2px 2px 5px rgba(0,0,0,.07), inset -2px -2px 5px rgba(255,255,255,.5)' : undefined } as React.CSSProperties}
              onClick={() => { setActiveTag(i); setSelectedIdx(0) }}
            >
              <span className="ni-l" style={{ color: tag.colorVar, fontSize: i === 0 ? 14 : 12 }}>{tag.icon}</span>
              <span className="ni-n">{tag.name}</span>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 7, fontWeight: 700, color: 'var(--tx3)' }}>{tag.count}</span>
            </div>
          ))}
        </div>

        {/* Center: Idea Grid */}
        <div className="center" style={{ overflowY: 'auto' }}>
          <div className="igrid">
            {filteredIdeas.map((idea, idx) => {
              const sc = ideaScore(idea)
              const ps = phaseStyle(idea.st)
              const glow = glowFromCol(idea.col)
              const cs = catStyle(idea.cat)
              const isDone = idea.st === 'Projekt'
              return (
                <div
                  key={idea.id}
                  className="cgw"
                  style={{ '--gc2': glow } as React.CSSProperties}
                  onClick={() => setSelectedIdx(idx)}
                >
                  <div
                    className={`ic cf${isDone ? ' done' : ''}`}
                    style={{ '--hc': glow, opacity: isDone ? 0.3 : undefined } as React.CSSProperties}
                    onDoubleClick={() => navigate(`/thinktank/${idea.id}`)}
                  >
                    <div className="ic-top">
                      <div className="ic-score in" style={{ color: scoreColor(sc) }}>
                        {isDone ? '\u2713' : sc !== null ? sc : '\u2014'}
                      </div>
                      <span className="ic-phase" style={{ background: ps.bg, color: ps.color }}>
                        {idea.st === 'Projekt' ? '\u2192 Projekt' : `\u25CF ${ps.label}`}
                      </span>
                    </div>
                    <div className="ic-title">{idea.n}</div>
                    <div className="ic-desc">{idea.txt}</div>
                    <div className="ic-tags">
                      <span className="ic-tag" style={{ background: cs.bg, color: cs.color }}>{idea.cat}</span>
                    </div>
                    <div className="ic-foot">
                      <span className="ic-date">{idea.date || '\u2014'}</span>
                      <span className="ic-arrow" onClick={(e) => { e.stopPropagation(); navigate(`/thinktank/${idea.id}`) }}>{'\u2192'}</span>
                    </div>
                  </div>
                </div>
              )
            })}
            {/* Add new idea placeholder */}
            <div
              className="ic cf"
              style={{ opacity: 0.15, border: '2px dashed rgba(0,0,0,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}
            >
              <span style={{ fontSize: 28, color: 'var(--tx3)' }}>+</span>
            </div>
          </div>
        </div>

        {/* Right: Detail + KANI */}
        <div className="right" style={{ gap: 14 }}>
          {selected && selectedPhase ? (
            <div className="det cf">
              <div className="det-hdr">
                <div className="det-title">{selected.n}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 8, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: selectedPhase.bg, color: selectedPhase.color }}>
                    {'\u25CF'} {selectedPhase.label}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: scoreColor(selectedScore) }}>
                    {selected.st === 'Projekt' ? '\u2713' : selectedScore !== null ? selectedScore : '\u2014'}
                  </span>
                </div>
              </div>
              <div className="det-body">
                <div>
                  <div className="det-label">Beschreibung</div>
                  <div className="det-text">{selected.txt || '\u2014'}</div>
                </div>
                <div>
                  <div className="det-label">AI Bewertung</div>
                  <div className="det-score-row">
                    {detailScores.map((s) => (
                      <div key={s.label} className="det-score-item">
                        <div className="det-score-bar in">
                          <div className="det-score-fill" style={{ width: `${(s.value / s.max) * 100}%`, background: s.color }} />
                        </div>
                        <div className="det-score-label">{s.label}</div>
                        <div className="det-score-val" style={{ color: s.color }}>{s.value}/{s.max}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {selected.feedback && (
                  <div>
                    <div className="det-label">KANI Feedback</div>
                    <div className="det-text">
                      {selected.feedback.branche && <>{'\u25CF'} Branche: {selected.feedback.branche}<br /></>}
                      {selected.feedback.markt && <>{'\u25CF'} Markt: {selected.feedback.markt}<br /></>}
                      {selected.feedback.problem && <>{'\u25CF'} Problem: {selected.feedback.problem}<br /></>}
                      {selected.feedback.nutzen && <>{'\u25CF'} Nutzen: {selected.feedback.nutzen}<br /></>}
                      {selected.feedback.highlights && <>{'\u25CF'} Highlights: {selected.feedback.highlights}</>}
                    </div>
                  </div>
                )}
                <div>
                  <div className="det-label">Status</div>
                  <div className="det-text">
                    {'\u25CF'} Research: {selected.res || '\u2014'}<br />
                    {'\u25CF'} Empfehlung: {selected.rec || '\u2014'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="det-btn" style={{ background: 'var(--g)', color: '#fff', boxShadow: '0 3px 8px var(--gg)' }}>
                    {'\u2192'} Projekt starten
                  </button>
                  <button className="det-btn" style={{ background: 'var(--bg)', color: 'var(--tx)', boxShadow: '2px 2px 6px var(--shdr), -2px -2px 6px var(--shl)' }}>
                    Phase aendern
                  </button>
                  <button className="det-btn" style={{ background: 'var(--bg)', color: 'var(--tx3)', boxShadow: '2px 2px 6px var(--shdr), -2px -2px 6px var(--shl)' }}>
                    Archivieren
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="det cf" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tx3)', fontSize: 12 }}>
              Keine Idee ausgewaehlt
            </div>
          )}

          {/* KANI inline chat */}
          <div className="kani cf">
            <div className="kani-hdr">
              <div className="kani-av">
                <svg viewBox="0 0 24 24">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                </svg>
              </div>
              <span className="kani-nm">KANI {'\u00B7'} {selected ? selected.n : 'Thinktank'}</span>
              <span style={{ fontSize: 7, color: 'var(--g)', marginLeft: 'auto' }}>Online</span>
            </div>
            <div className="kani-body">
              {selected ? (
                <>
                  <div className="km k in">
                    {selected.n}: Fit {selected.f}/5, Potenzial {selected.pot}/5, Risiko {selected.r}/5.{' '}
                    {selected.rec ? `Empfehlung: ${selected.rec}` : ''}
                  </div>
                  <div className="km u">Details?</div>
                  <div className="km k in">
                    Status: {selected.st}. Research: {selected.res || 'nicht gestartet'}.
                    {selected.feedback?.highlights ? ` Highlights: ${selected.feedback.highlights}` : ''}
                  </div>
                </>
              ) : (
                <div className="km k in">Waehle eine Idee aus um Details zu sehen.</div>
              )}
            </div>
            <div className="kani-in">
              <input className="kani-inp in" placeholder="Frag KANI zu dieser Idee..." />
              <button className="kani-send">
                <svg viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: Notifications + Quick Access */}
      <div className="brow" style={{ gridTemplateColumns: '90px 1fr 420px' }}>
        <div />
        <Notifications />
        <QuickAccess />
      </div>

      {/* Live Feed Ticker */}
      <div className="ticker-w">
        <div className="ticker cf" style={{ borderRadius: 24 }}>
          <div className="ticker-lbl">
            <span
              className="ticker-ld"
              style={{ background: 'var(--p)', boxShadow: '0 0 10px var(--pg)' }}
            />
            THINKTANK
          </div>
          <div className="ticker-c">
            <div className="ticker-s">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <div key={i} className="ticker-i">
                  <span className="ticker-id" style={{ background: item.color }} />
                  <span className="ticker-ia" style={{ color: item.color }}>{item.agent}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
