import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../shared/AppShell'
import Notifications from '../shared/Notifications'
import QuickAccess from '../shared/QuickAccess'

/* ── Dummy Data ─────────────────────────────────────────── */

interface ThinktankIdea {
  id: string
  title: string
  desc: string
  score: number
  scoreColor: string
  phase: string
  phaseBg: string
  phaseColor: string
  tags: { label: string; bg: string; color: string }[]
  date: string
  glowColor: string
  hoverColor: string
  done?: boolean
}

const ideas: ThinktankIdea[] = [
  {
    id: 'ai-steuerberater',
    title: 'AI Steuerberater SaaS',
    desc: 'KI-basierte Steueroptimierung fuer Freelancer. Belegerkennung, ELSTER-Abgabe.',
    score: 92,
    scoreColor: 'var(--r)',
    phase: 'Research',
    phaseBg: 'var(--blc)',
    phaseColor: 'var(--bl)',
    tags: [
      { label: 'SaaS', bg: 'rgba(124,77,255,.06)', color: 'var(--p)' },
      { label: 'FinTech', bg: 'rgba(124,77,255,.06)', color: 'var(--p)' },
    ],
    date: 'vor 3d',
    glowColor: 'var(--rg)',
    hoverColor: 'var(--rg)',
  },
  {
    id: 'whatsapp-termin-bot',
    title: 'WhatsApp Termin-Bot',
    desc: 'Automatische Terminverwaltung ueber WhatsApp Business API fuer Hebammen.',
    score: 87,
    scoreColor: 'var(--r)',
    phase: 'Bereit',
    phaseBg: 'var(--gc)',
    phaseColor: 'var(--g)',
    tags: [{ label: 'Health', bg: 'var(--gc)', color: 'var(--g)' }],
    date: 'vor 5d',
    glowColor: 'var(--gg)',
    hoverColor: 'var(--gg)',
  },
  {
    id: 'gastro-suite',
    title: 'Gastro Suite Lieferservice',
    desc: 'White-Label Bestellsystem. Eigene App statt Lieferando.',
    score: 74,
    scoreColor: 'var(--bl)',
    phase: 'Research',
    phaseBg: 'var(--blc)',
    phaseColor: 'var(--bl)',
    tags: [{ label: 'Service', bg: 'var(--ac)', color: 'var(--a)' }],
    date: 'vor 7d',
    glowColor: 'var(--blg)',
    hoverColor: 'var(--blg)',
  },
  {
    id: 'smarthome-dashboard',
    title: 'SmartHome Dashboard',
    desc: 'Universelles Dashboard fuer Smart-Home-Geraete. Herstelleruebergreifend.',
    score: 68,
    scoreColor: 'var(--bl)',
    phase: 'Research',
    phaseBg: 'var(--blc)',
    phaseColor: 'var(--bl)',
    tags: [{ label: 'Smart', bg: 'var(--ac)', color: 'var(--a)' }],
    date: 'vor 10d',
    glowColor: 'var(--blg)',
    hoverColor: 'var(--blg)',
  },
  {
    id: 'fitness-tracker',
    title: 'Fitness Tracker App',
    desc: 'Personalisierte Trainingsplaene mit AI-Coach.',
    score: 45,
    scoreColor: 'var(--tx3)',
    phase: 'Geparkt',
    phaseBg: 'rgba(0,0,0,.04)',
    phaseColor: 'var(--tx3)',
    tags: [{ label: 'Health', bg: 'var(--gc)', color: 'var(--g)' }],
    date: 'vor 14d',
    glowColor: 'rgba(0,0,0,.03)',
    hoverColor: 'rgba(0,0,0,.04)',
  },
  {
    id: 'immobilien-preisvergleich',
    title: 'Immobilien Preisvergleich',
    desc: 'AI-Immobilienbewertung. Marktdaten, Preisprognosen.',
    score: 38,
    scoreColor: 'var(--tx3)',
    phase: 'Geparkt',
    phaseBg: 'rgba(0,0,0,.04)',
    phaseColor: 'var(--tx3)',
    tags: [{ label: 'SaaS', bg: 'var(--blc)', color: 'var(--bl)' }],
    date: 'vor 21d',
    glowColor: 'rgba(0,0,0,.03)',
    hoverColor: 'rgba(0,0,0,.04)',
  },
  {
    id: 'tenniscoach-pro',
    title: 'TennisCoach Pro',
    desc: 'AI Tennis-Trainer. Videoanalyse, Trainingsplan.',
    score: -1,
    scoreColor: 'var(--t)',
    phase: 'Projekt',
    phaseBg: 'var(--tc)',
    phaseColor: 'var(--t)',
    tags: [{ label: 'Health', bg: 'var(--gc)', color: 'var(--g)' }],
    date: 'ueberfuehrt 14.03',
    glowColor: 'transparent',
    hoverColor: 'transparent',
    done: true,
  },
]

interface TagNav {
  icon: string
  name: string
  count: number
  colorVar: string
  glowVar: string
}

const tagNavItems: TagNav[] = [
  { icon: '\u25CF', name: 'Alle', count: 7, colorVar: 'var(--p)', glowVar: 'var(--pg)' },
  { icon: '\u2764', name: 'Health', count: 3, colorVar: 'var(--g)', glowVar: 'var(--gg)' },
  { icon: '\uD83D\uDCBB', name: 'SaaS', count: 2, colorVar: 'var(--bl)', glowVar: 'var(--blg)' },
  { icon: '\uD83C\uDFE0', name: 'Smart', count: 1, colorVar: 'var(--o)', glowVar: 'var(--og)' },
  { icon: '\uD83E\uDD1D', name: 'Service', count: 1, colorVar: 'var(--a)', glowVar: 'var(--ag)' },
]

interface ScoreItem {
  label: string
  value: number
  max: number
  color: string
}

const detailScores: ScoreItem[] = [
  { label: 'Markt', value: 9, max: 10, color: 'var(--g)' },
  { label: 'Machbar', value: 7, max: 10, color: 'var(--bl)' },
  { label: 'Unique', value: 8, max: 10, color: 'var(--p)' },
  { label: 'Revenue', value: 6, max: 10, color: 'var(--a)' },
  { label: 'Risiko', value: 5, max: 10, color: 'var(--r)' },
]

const filters = ['Alle', 'Research', 'Bereit', 'Geparkt'] as const
const filterCounts: Record<string, number> = { Alle: 7, Research: 3, Bereit: 1, Geparkt: 2 }

interface TickerItem {
  agent: string
  color: string
  text: string
}

const tickerItems: TickerItem[] = [
  { agent: 'kani', color: 'var(--p)', text: 'Steuerberater Score aktualisiert: 92/100' },
  { agent: 'research', color: 'var(--bl)', text: 'Marktanalyse 4.2M Freelancer abgeschlossen' },
  { agent: 'kani', color: 'var(--g)', text: 'WhatsApp Bot als "Bereit" markiert' },
  { agent: 'system', color: 'var(--t)', text: 'TennisCoach Pro in Projekt ueberfuehrt' },
  { agent: 'kani', color: 'var(--a)', text: 'Gastro Suite: 12 Wettbewerber analysiert' },
  { agent: 'kani', color: 'var(--p)', text: 'SmartHome: Tech-Stack Empfehlung generiert' },
]

/* ── Component ─────────────────────────────────────────── */

export default function Thinktank() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<string>('Alle')
  const [activeTag, setActiveTag] = useState(0)
  const [selectedIdea, setSelectedIdea] = useState(0)
  const [pipelineOpen, setPipelineOpen] = useState(false)

  const selected = ideas[selectedIdea]

  const filteredIdeas = activeFilter === 'Alle'
    ? ideas
    : ideas.filter((i) => {
        if (activeFilter === 'Research') return i.phase === 'Research'
        if (activeFilter === 'Bereit') return i.phase === 'Bereit'
        if (activeFilter === 'Geparkt') return i.phase === 'Geparkt'
        return true
      })

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
            <div className="kv" style={{ color: 'var(--p)' }}>7</div>
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
            <div className="kv" style={{ color: 'var(--r)' }}>2</div>
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
            <div className="kv" style={{ color: 'var(--bl)' }}>3</div>
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
            <div className="kv" style={{ color: 'var(--g)' }}>1</div>
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
              <div className="pl-seg" style={{ flex: 2, background: 'var(--tx3)' }}>2</div>
              <div className="pl-seg" style={{ flex: 3, background: 'var(--bl)' }}>3</div>
              <div className="pl-seg" style={{ flex: 1, background: 'var(--g)' }}>1</div>
              <div className="pl-seg" style={{ flex: 1, background: 'var(--t)' }}>1</div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: 'var(--p)', whiteSpace: 'nowrap' }}>
              7 Ideen
            </span>
            <span style={{ fontSize: 10, color: 'var(--tx3)', cursor: 'pointer' }}>
              {pipelineOpen ? '\u25B2' : '\u25BC'}
            </span>
          </div>
          {pipelineOpen && (
            <div className="pl-detail open">
              <div className="pl-phase">
                <div className="pl-phase-dot" style={{ background: 'var(--tx3)' }} />
                <div className="pl-phase-info">
                  <div className="pl-phase-title">Geparkt</div>
                  <div className="pl-phase-count" style={{ color: 'var(--tx3)' }}>2 Ideen</div>
                  <div className="pl-phase-items">
                    {'\u25CF'} Fitness Tracker App<br />
                    {'\u25CF'} Immobilien Preisvergleich
                  </div>
                </div>
              </div>
              <div className="pl-phase">
                <div className="pl-phase-dot" style={{ background: 'var(--bl)', boxShadow: '0 0 8px var(--blg)' }} />
                <div className="pl-phase-info">
                  <div className="pl-phase-title" style={{ color: 'var(--bl)' }}>In Research</div>
                  <div className="pl-phase-count" style={{ color: 'var(--bl)' }}>3 Ideen</div>
                  <div className="pl-phase-items">
                    {'\u25CF'} AI Steuerberater SaaS<br />
                    {'\u25CF'} Gastro Suite Lieferservice<br />
                    {'\u25CF'} SmartHome Dashboard
                  </div>
                </div>
              </div>
              <div className="pl-phase">
                <div className="pl-phase-dot" style={{ background: 'var(--g)', boxShadow: '0 0 8px var(--gg)' }} />
                <div className="pl-phase-info">
                  <div className="pl-phase-title" style={{ color: 'var(--g)' }}>Bereit</div>
                  <div className="pl-phase-count" style={{ color: 'var(--g)' }}>1 Idee</div>
                  <div className="pl-phase-items">{'\u25CF'} WhatsApp Termin-Bot</div>
                </div>
              </div>
              <div className="pl-phase">
                <div className="pl-phase-dot" style={{ background: 'var(--t)', boxShadow: '0 0 8px var(--tg)' }} />
                <div className="pl-phase-info">
                  <div className="pl-phase-title" style={{ color: 'var(--t)' }}>{'\u2192'} Projekt</div>
                  <div className="pl-phase-count" style={{ color: 'var(--t)' }}>1 ueberfuehrt</div>
                  <div className="pl-phase-items">{'\u25CF'} TennisCoach Pro</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section titles + filters */}
      <div className="trow" style={{ gridTemplateColumns: '90px 1fr 380px' }}>
        <span className="st">Filter</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="st" style={{ marginRight: 12 }}>Ideen</span>
          {filters.map((f) => (
            <button
              key={f}
              className={`fb${activeFilter === f ? ' active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f} <span className="fc">{filterCounts[f]}</span>
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
              onClick={() => setActiveTag(i)}
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
            {filteredIdeas.map((idea, _idx) => (
              <div
                key={idea.id}
                className="cgw"
                style={{ '--gc2': idea.glowColor } as React.CSSProperties}
                onClick={() => setSelectedIdea(ideas.indexOf(idea))}
              >
                <div
                  className={`ic cf${idea.done ? ' done' : ''}`}
                  style={{ '--hc': idea.hoverColor, opacity: idea.done ? 0.3 : undefined } as React.CSSProperties}
                  onDoubleClick={() => navigate(`/thinktank/${idea.id}`)}
                >
                  <div className="ic-top">
                    <div className="ic-score in" style={{ color: idea.scoreColor }}>
                      {idea.score === -1 ? '\u2713' : idea.score}
                    </div>
                    <span className="ic-phase" style={{ background: idea.phaseBg, color: idea.phaseColor }}>
                      {idea.phase === 'Projekt' ? '\u2192 Projekt' : `\u25CF ${idea.phase}`}
                    </span>
                  </div>
                  <div className="ic-title">{idea.title}</div>
                  <div className="ic-desc">{idea.desc}</div>
                  <div className="ic-tags">
                    {idea.tags.map((t) => (
                      <span key={t.label} className="ic-tag" style={{ background: t.bg, color: t.color }}>{t.label}</span>
                    ))}
                  </div>
                  <div className="ic-foot">
                    <span className="ic-date">{idea.date}</span>
                    <span className="ic-arrow" onClick={(e) => { e.stopPropagation(); navigate(`/thinktank/${idea.id}`) }}>{'\u2192'}</span>
                  </div>
                </div>
              </div>
            ))}
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
          <div className="det cf">
            <div className="det-hdr">
              <div className="det-title">{selected.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 8, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: selected.phaseBg, color: selected.phaseColor }}>
                  {'\u25CF'} {selected.phase}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: selected.scoreColor }}>
                  {selected.score === -1 ? '\u2713' : selected.score}
                </span>
              </div>
            </div>
            <div className="det-body">
              <div>
                <div className="det-label">Beschreibung</div>
                <div className="det-text">{selected.desc}</div>
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
              <div>
                <div className="det-label">Dokumente & Research</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <div className="det-link" style={{ background: 'var(--blc)', color: 'var(--bl)' }}>
                    <svg viewBox="0 0 24 24" stroke="var(--bl)">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    Marktanalyse.pdf
                  </div>
                  <div className="det-link" style={{ background: 'var(--gc)', color: 'var(--g)' }}>
                    <svg viewBox="0 0 24 24" stroke="var(--g)">
                      <path d="M12 20V10" />
                      <path d="M18 20V4" />
                      <path d="M6 20v-4" />
                    </svg>
                    Wettbewerber.xlsx
                  </div>
                  <div className="det-link" style={{ background: 'rgba(124,77,255,.06)', color: 'var(--p)' }}>
                    <svg viewBox="0 0 24 24" stroke="var(--p)">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    Tech-Stack Report
                  </div>
                </div>
              </div>
              <div>
                <div className="det-label">Notizen</div>
                <div className="det-text">
                  {'\u25CF'} Wettbewerber: Taxfix, Wiso, SteuerBot<br />
                  {'\u25CF'} USP: Laufende Optimierung, nicht nur Jahresabschluss<br />
                  {'\u25CF'} Zielgruppe: ~4.2M Freelancer in DE<br />
                  {'\u25CF'} Tech: OCR + GPT fuer Belegerkennung
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

          {/* KANI inline chat */}
          <div className="kani cf">
            <div className="kani-hdr">
              <div className="kani-av">
                <svg viewBox="0 0 24 24">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                </svg>
              </div>
              <span className="kani-nm">KANI {'\u00B7'} {selected.title}</span>
              <span style={{ fontSize: 7, color: 'var(--g)', marginLeft: 'auto' }}>Online</span>
            </div>
            <div className="kani-body">
              <div className="km k in">
                Score: 92/100. Staerkste Dimension: Marktpotenzial (4.2M Freelancer). Groesstes Risiko: regulatorische Huerden.
              </div>
              <div className="km u">Top 3 MVP Features?</div>
              <div className="km k in">
                1. Beleg-Scanner (Foto {'\u2192'} Kategorie)<br />
                2. Steuer-Spar-Rechner (Echtzeit)<br />
                3. ELSTER-Export<br /><br />
                Geschaetzt: 6-8 Wochen.
              </div>
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
