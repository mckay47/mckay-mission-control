import { useState } from 'react'
import { useParams } from 'react-router-dom'
import AppShell from '../shared/AppShell'
import QuickAccess from '../shared/QuickAccess'

/* ── Dummy Data ─────────────────────────────────────────── */

interface IdeaData {
  id: string
  title: string
  phase: string
  phaseBg: string
  phaseColor: string
  score: number
  scoreColor: string
  ledBg: string
  ledLc: string
  kpiMarket: string
  kpiDocs: number
  kpiTarget: string
  kpiMvp: string
  pipelinePhase: number
  pipelineLabel: string
  description: string
  competitors: string[]
  usp: string
  risk: string
  nextStep: string
  scores: { label: string; value: number; max: number; color: string }[]
  docs: { title: string; desc: string; color: string; glowVar: string; icon: React.ReactNode; tag?: string }[]
  terminalLines: { type: 'prompt' | 'output' | 'highlight'; prompt?: string; text: string }[]
  workflows: { name: string; status: string; statusColor: string; color: string; glowVar: string; icon: React.ReactNode; dotColor?: string }[]
  notifications: { label: string; color: string; glowVar: string; icon: React.ReactNode; items: string[] }[]
  tickerItems: { agent: string; color: string; text: string }[]
}

const ideaDatabase: Record<string, IdeaData> = {
  'ai-steuerberater': {
    id: 'ai-steuerberater',
    title: 'AI Steuerberater SaaS',
    phase: 'Research',
    phaseBg: 'var(--blc)',
    phaseColor: 'var(--bl)',
    score: 92,
    scoreColor: 'var(--r)',
    ledBg: 'var(--bl)',
    ledLc: 'var(--blg)',
    kpiMarket: '9/10',
    kpiDocs: 3,
    kpiTarget: '4.2M',
    kpiMvp: '6-8w',
    pipelinePhase: 2,
    pipelineLabel: 'Phase 2/4 \u2014 Research',
    description: 'KI-basierte Steueroptimierung fuer Freelancer & Kleinunternehmer. Automatische Belegerkennung, Vorausfuellung, direkte ELSTER-Abgabe.',
    competitors: [
      'Taxfix \u2014 Score 78, \u20AC200M Funding, Consumer-fokussiert',
      'Wiso \u2014 Score 72, Desktop-Legacy, aeltere Zielgruppe',
      'SteuerBot \u2014 Score 65, Chat-basiert, limitierte Features',
      'Sorted \u2014 Score 58, UK-Markt, nicht DE-optimiert',
    ],
    usp: 'Laufende Optimierung statt Jahresabschluss',
    risk: 'Regulatorik bei Steuerberatung',
    nextStep: 'Tech-Stack finalisieren',
    scores: [
      { label: 'Markt', value: 9, max: 10, color: 'var(--g)' },
      { label: 'Machbar', value: 7, max: 10, color: 'var(--bl)' },
      { label: 'Unique', value: 8, max: 10, color: 'var(--p)' },
      { label: 'Revenue', value: 6, max: 10, color: 'var(--a)' },
      { label: 'Risiko', value: 5, max: 10, color: 'var(--r)' },
    ],
    docs: [
      {
        title: 'Marktanalyse.pdf',
        desc: '4.2M Freelancer, \u20AC2.1B Markt',
        color: 'var(--bl)',
        glowVar: 'var(--blg)',
        tag: 'Neu',
        icon: (
          <svg viewBox="0 0 24 24" width="13" height="13" stroke="var(--bl)" strokeWidth="2" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        ),
      },
      {
        title: 'Wettbewerber.xlsx',
        desc: '4 Competitors, Scoring Matrix',
        color: 'var(--g)',
        glowVar: 'var(--gg)',
        icon: (
          <svg viewBox="0 0 24 24" width="13" height="13" stroke="var(--g)" strokeWidth="2" fill="none">
            <path d="M12 20V10" />
            <path d="M18 20V4" />
            <path d="M6 20v-4" />
          </svg>
        ),
      },
      {
        title: 'Tech-Stack Report',
        desc: 'Next.js, Supabase, GPT-4',
        color: 'var(--p)',
        glowVar: 'var(--pg)',
        icon: (
          <svg viewBox="0 0 24 24" width="13" height="13" stroke="var(--p)" strokeWidth="2" fill="none">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
          </svg>
        ),
      },
    ],
    terminalLines: [
      { type: 'prompt', prompt: 'kani@steuerberater ~$', text: 'analyze market potential' },
      { type: 'output', text: '\u2192 Scanning Freelancer-Markt Deutschland...' },
      { type: 'output', text: '\u2192 Gefunden: 4.2M Freelancer + 3.1M Kleinunternehmer' },
      { type: 'highlight', text: '\u2713 Marktgroesse: \u20AC2.1B Steuerberatung p.a.' },
      { type: 'output', text: '\u00A0' },
      { type: 'prompt', prompt: 'kani@steuerberater ~$', text: 'competitor analysis' },
      { type: 'output', text: '\u2192 4 direkte Wettbewerber identifiziert:' },
      { type: 'output', text: '  1. Taxfix \u2014 Score 78, \u20AC200M Funding, Consumer-fokussiert' },
      { type: 'output', text: '  2. Wiso \u2014 Score 72, Desktop-Legacy, aeltere Zielgruppe' },
      { type: 'output', text: '  3. SteuerBot \u2014 Score 65, Chat-basiert, limitierte Features' },
      { type: 'output', text: '  4. Sorted \u2014 Score 58, UK-Markt, nicht DE-optimiert' },
      { type: 'highlight', text: '\u2713 USP-Luecke: Keiner bietet laufende Steueroptimierung' },
      { type: 'output', text: '\u00A0' },
      { type: 'prompt', prompt: 'kani@steuerberater ~$', text: 'recommend mvp features' },
      { type: 'output', text: '\u2192 Top 3 MVP Features basierend auf Marktanalyse:' },
      { type: 'highlight', text: '  1. Beleg-Scanner (OCR + GPT Kategorisierung)' },
      { type: 'highlight', text: '  2. Steuer-Spar-Rechner (Echtzeit-Prognose)' },
      { type: 'highlight', text: '  3. ELSTER-Export (vereinfachte Abgabe)' },
      { type: 'output', text: '\u2192 Geschaetzte Entwicklung: 6-8 Wochen, 1 Build-Agent' },
    ],
    workflows: [
      {
        name: 'Research',
        status: 'Aktiv',
        statusColor: 'var(--bl)',
        color: 'var(--bl)',
        glowVar: 'var(--blg)',
        dotColor: 'var(--bl)',
        icon: (
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--bl)" strokeWidth="1.8" fill="none">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        ),
      },
      {
        name: 'Scoring',
        status: 'Fertig',
        statusColor: 'var(--p)',
        color: 'var(--p)',
        glowVar: 'var(--pg)',
        icon: (
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--p)" strokeWidth="1.8" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        ),
      },
      {
        name: 'Wettbew.',
        status: 'Fertig',
        statusColor: 'var(--t)',
        color: 'var(--t)',
        glowVar: 'var(--tg)',
        icon: (
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--t)" strokeWidth="1.8" fill="none">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        ),
      },
    ],
    notifications: [
      {
        label: 'Issues',
        color: 'var(--r)',
        glowVar: 'var(--rg)',
        icon: (
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--r)" strokeWidth="1.8" fill="none">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        ),
        items: ['Regulatorik: Pruefung noetig'],
      },
      {
        label: 'Attention',
        color: 'var(--o)',
        glowVar: 'var(--og)',
        icon: (
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--o)" strokeWidth="1.8" fill="none">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
        ),
        items: ['Tech-Stack: Entscheidung offen'],
      },
      {
        label: 'Freigabe',
        color: 'var(--g)',
        glowVar: 'var(--gg)',
        icon: (
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--g)" strokeWidth="1.8" fill="none">
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        ),
        items: ['Score 92: Projekt starten?'],
      },
      {
        label: 'Results',
        color: 'var(--bl)',
        glowVar: 'var(--blg)',
        icon: (
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--bl)" strokeWidth="1.8" fill="none">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ),
        items: ['Marktanalyse: Report bereit', 'Wettbewerber: 4 analysiert'],
      },
    ],
    tickerItems: [
      { agent: 'research', color: 'var(--bl)', text: 'Marktanalyse abgeschlossen \u2014 4.2M Freelancer' },
      { agent: 'scoring', color: 'var(--p)', text: 'Score berechnet: 92/100 \u2014 Hot Idea' },
      { agent: 'wettbewerb', color: 'var(--t)', text: '4 Konkurrenten analysiert \u2014 USP-Luecke gefunden' },
      { agent: 'research', color: 'var(--bl)', text: 'Tech-Stack Bewertung laeuft \u2014 Next.js, Supabase' },
    ],
  },
}

// Fallback data for unknown idea IDs
function getFallbackIdea(id: string): IdeaData {
  return {
    ...ideaDatabase['ai-steuerberater'],
    id,
    title: id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  }
}

/* ── Component ─────────────────────────────────────────── */

export default function IdeaDetail() {
  const { id } = useParams()
  const [pipelineOpen, setPipelineOpen] = useState(false)
  const [activeTermTab, setActiveTermTab] = useState(0)

  const idea = id && ideaDatabase[id] ? ideaDatabase[id] : getFallbackIdea(id ?? 'unknown')
  const termTabs = ['KANI Chat', 'Research Log', 'Scoring']

  return (
    <AppShell
      backLink={{ label: 'Thinktank', href: '/thinktank' }}
      title={idea.title}
      ledColor="bl"
    >
      {/* KPIs */}
      <div className="krow">
        <div className="kpi cf" style={{ '--kc': 'var(--rg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--rg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--r)">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--r)' }}>{idea.score}</div>
            <div className="kl">Score</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--gg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--gg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--g)">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--g)' }}>{idea.kpiMarket}</div>
            <div className="kl">Marktpotenzial</div>
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
            <div className="kv" style={{ color: 'var(--bl)' }}>{idea.kpiDocs}</div>
            <div className="kl">Research Docs</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--pg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--pg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--p)">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--p)' }}>{idea.kpiTarget}</div>
            <div className="kl">Zielgruppe</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--ag)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--ag)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--a)">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--a)' }}>{idea.kpiMvp}</div>
            <div className="kl">MVP Dauer</div>
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <div className="pipeline">
        <div className="cf" style={{ overflow: 'hidden' }}>
          <div className="pl-bar" onClick={() => setPipelineOpen((p) => !p)} style={{ borderRadius: 0 }}>
            <span className="st" style={{ whiteSpace: 'nowrap' }}>Idee Pipeline</span>
            <div className="pl-track in">
              <div className="pl-seg" style={{ flex: 1, background: 'var(--g)', borderRadius: 3, opacity: 1 }} />
              <div
                className="pl-seg"
                style={{
                  flex: 2,
                  background: 'var(--bl)',
                  borderRadius: 3,
                  opacity: 1,
                  animation: 'lp 3s ease-in-out infinite',
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  '--lc': 'var(--blg)',
                } as React.CSSProperties}
              />
              <div className="pl-seg" style={{ flex: 1, background: 'var(--g)', borderRadius: 3, opacity: 0.25 }} />
              <div className="pl-seg" style={{ flex: 1, background: 'var(--t)', borderRadius: 3, opacity: 0.25 }} />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: 'var(--bl)', whiteSpace: 'nowrap' }}>
              {idea.pipelineLabel}
            </span>
            <span style={{ fontSize: 10, color: 'var(--tx3)', cursor: 'pointer' }}>
              {pipelineOpen ? '\u25B2' : '\u25BC'}
            </span>
          </div>
          {pipelineOpen && (
            <div className="pl-detail open">
              <div className="pl-ms">
                <div className="pl-ms-dot" style={{ background: 'var(--g)' }} />
                <div className="pl-ms-info">
                  <div className="pl-ms-title" style={{ color: 'var(--g)' }}>Erfasst {'\u2713'}</div>
                  <div className="pl-ms-date">01.04</div>
                  <div className="pl-ms-sub">
                    {'\u25CF'} Idee angelegt<br />
                    {'\u25CF'} Tags & Kategorie gesetzt<br />
                    {'\u25CF'} Research-Agent gestartet
                  </div>
                </div>
              </div>
              <div className="pl-ms">
                <div className="pl-ms-dot" style={{ background: 'var(--bl)', boxShadow: '0 0 8px var(--blg)' }} />
                <div className="pl-ms-info">
                  <div className="pl-ms-title" style={{ color: 'var(--bl)' }}>Research {'\u2192'} aktiv</div>
                  <div className="pl-ms-date">01.04 {'\u2014'} jetzt</div>
                  <div className="pl-ms-sub">
                    {'\u25CF'} Marktanalyse {'\u2713'}<br />
                    {'\u25CF'} Wettbewerber-Check {'\u2713'}<br />
                    {'\u25CF'} Tech-Stack Bewertung {'\u23F3'}<br />
                    {'\u25CF'} Kosten-Kalkulation
                  </div>
                </div>
              </div>
              <div className="pl-ms">
                <div className="pl-ms-dot" style={{ background: 'var(--tx3)' }} />
                <div className="pl-ms-info">
                  <div className="pl-ms-title">Bereit</div>
                  <div className="pl-ms-sub">
                    {'\u25CF'} Score finalisieren<br />
                    {'\u25CF'} Go/No-Go Entscheidung
                  </div>
                </div>
              </div>
              <div className="pl-ms">
                <div className="pl-ms-dot" style={{ background: 'var(--tx3)' }} />
                <div className="pl-ms-info">
                  <div className="pl-ms-title">{'\u2192'} Projekt</div>
                  <div className="pl-ms-sub">
                    {'\u25CF'} Projekt anlegen<br />
                    {'\u25CF'} Agents zuweisen<br />
                    {'\u25CF'} Milestones definieren
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section titles */}
      <div className="trow" style={{ gridTemplateColumns: '90px 1fr 380px' }}>
        <span className="st">Workflows</span>
        <span className="st">KANI {'\u00B7'} Analyse</span>
        <span className="st">Research & Notizen</span>
      </div>

      {/* BODY: workflows + terminal + research */}
      <div className="mbody" style={{ gridTemplateColumns: '90px 1fr 380px', flex: 8 }}>
        {/* Left: Workflow sidebar */}
        <div className="lnav">
          {idea.workflows.map((wf) => (
            <div
              key={wf.name}
              className="ag-item cf"
              style={{ '--nc': wf.glowVar } as React.CSSProperties}
            >
              <div className="btn3d" style={{ '--bc': wf.glowVar, width: 36, height: 36, position: 'relative' } as React.CSSProperties}>
                {wf.dotColor && (
                  <span style={{
                    position: 'absolute', top: 0, right: 0,
                    width: 7, height: 7, borderRadius: '50%',
                    background: wf.dotColor,
                    boxShadow: `0 0 6px ${wf.glowVar}`,
                  }} />
                )}
                {wf.icon}
              </div>
              <span className="ag-name">{wf.name}</span>
              <span className="ag-status" style={{ color: wf.statusColor }}>{wf.status}</span>
            </div>
          ))}
          <div style={{ height: 1, margin: '4px 8px', background: 'linear-gradient(90deg,transparent,rgba(0,0,0,.06),transparent)' }} />
          {/* Additional workflow items */}
          <div className="ag-item cf" style={{ '--nc': 'var(--blg)' } as React.CSSProperties}>
            <div className="btn3d" style={{ '--bc': 'var(--blg)', width: 36, height: 36 } as React.CSSProperties}>
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--bl)" strokeWidth="1.8" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <span className="ag-name">Docs</span>
            <span className="ag-status" style={{ color: 'var(--bl)' }}>3 Files</span>
          </div>
          <div className="ag-item cf" style={{ '--nc': 'var(--gg)' } as React.CSSProperties}>
            <div className="btn3d" style={{ '--bc': 'var(--gg)', width: 36, height: 36 } as React.CSSProperties}>
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--g)" strokeWidth="1.8" fill="none">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <span className="ag-name">{'\u2192'} Projekt</span>
            <span className="ag-status" style={{ color: 'var(--g)' }}>Start</span>
          </div>
        </div>

        {/* Center: KANI Terminal */}
        <div className="center" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="term-card cf">
            <div className="term-header">
              <div style={{ display: 'flex', gap: 6 }}>
                {termTabs.map((tab, i) => (
                  <span
                    key={tab}
                    className={`term-tab${activeTermTab === i ? ' active' : ''}`}
                    onClick={() => setActiveTermTab(i)}
                  >
                    {tab}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  className="sl"
                  style={{
                    width: 7, height: 7,
                    background: 'var(--bl)',
                    '--lc': 'var(--blg)',
                    animation: 'lp 3s ease-in-out infinite',
                  } as React.CSSProperties}
                />
                <span style={{ fontSize: 9, color: 'var(--bl)', fontWeight: 600 }}>Research aktiv</span>
              </div>
            </div>
            <div className="term-body">
              {idea.terminalLines.map((line, i) => (
                <div key={i} className="term-line">
                  {line.prompt && <span className="term-prompt">{line.prompt}</span>}
                  <span className={line.type === 'highlight' ? 'term-highlight' : line.type === 'output' ? 'term-output' : ''}>
                    {line.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="term-input-row">
              <input className="term-input in" placeholder={`kani@${idea.id} ~$ `} />
              <button className="term-send">
                <svg viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Research + Scores + Notes */}
        <div className="right" style={{ gap: 14 }}>
          {/* Research Docs */}
          <div className="r-card cf">
            <div className="r-hdr">
              <span className="st">Research Docs</span>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, fontWeight: 600, color: 'var(--tx3)' }}>
                {idea.docs.length} Files
              </span>
            </div>
            <div className="r-list">
              {idea.docs.map((doc) => (
                <div key={doc.title} className="r-item">
                  <div className="btn3d" style={{ '--bc': doc.glowVar, width: 32, height: 32 } as React.CSSProperties}>
                    {doc.icon}
                  </div>
                  <div>
                    <div className="r-title">{doc.title}</div>
                    <div className="r-desc">{doc.desc}</div>
                  </div>
                  {doc.tag && (
                    <span className="r-tag" style={{ background: 'var(--gc)', color: 'var(--g)' }}>{doc.tag}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Scores */}
          <div className="r-card cf">
            <div className="r-hdr">
              <span className="st">AI Bewertung</span>
            </div>
            <div className="det-score-row" style={{ padding: '0 14px 12px' }}>
              {idea.scores.map((s) => (
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

          {/* Notes */}
          <div className="r-card cf" style={{ flex: 'none', padding: '14px 18px' }}>
            <div className="st" style={{ marginBottom: 8 }}>Notizen</div>
            <div style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5 }}>
              {'\u25CF'} USP: {idea.usp}<br />
              {'\u25CF'} Tech: OCR + GPT fuer Belegerkennung<br />
              {'\u25CF'} Risiko: {idea.risk}<br />
              {'\u25CF'} Naechster Schritt: {idea.nextStep}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button style={{
                padding: '8px 16px', border: 'none', borderRadius: 10,
                fontSize: 10, fontWeight: 600, fontFamily: 'inherit',
                cursor: 'pointer', background: 'var(--g)', color: '#fff',
                boxShadow: '0 3px 8px var(--gg)',
              }}>
                {'\u2192'} Projekt starten
              </button>
              <button style={{
                padding: '8px 16px', border: 'none', borderRadius: 10,
                fontSize: 10, fontWeight: 600, fontFamily: 'inherit',
                cursor: 'pointer', background: 'var(--bg)', color: 'var(--tx)',
                boxShadow: '2px 2px 6px var(--shdr), -2px -2px 6px var(--shl)',
              }}>
                Phase aendern
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: Notifications + Quick Access */}
      <div className="brow" style={{ gridTemplateColumns: '90px 1fr 380px', flex: 'none', marginTop: 14 }}>
        <div />
        <div className="cf" style={{ padding: '16px 20px' }}>
          <div className="st" style={{ marginBottom: 10 }}>Notifications {'\u00B7'} {idea.title}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {idea.notifications.map((notif) => (
              <div key={notif.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className="btn3d" style={{ '--bc': notif.glowVar, width: 36, height: 36 } as React.CSSProperties}>
                    {notif.icon}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: notif.color }}>{notif.label}</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--tx2)', lineHeight: 1.5, marginTop: 4 }}>
                  {notif.items.map((item, i) => (
                    <span key={i}>
                      <span style={{ color: notif.color }}>{'\u25CF'}</span>{' '}
                      <b>{item.split(':')[0]}:</b>{item.split(':').slice(1).join(':')}
                      {i < notif.items.length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <QuickAccess />
      </div>

      {/* Live Feed Ticker */}
      <div className="ticker-w">
        <div className="ticker cf" style={{ borderRadius: 22 }}>
          <div className="ticker-lbl">
            <span
              className="ticker-ld"
              style={{ background: 'var(--bl)', boxShadow: '0 0 10px var(--blg)' }}
            />
            {idea.title.toUpperCase().split(' ')[0]}
          </div>
          <div className="ticker-c">
            <div className="ticker-s">
              {[...idea.tickerItems, ...idea.tickerItems].map((item, i) => (
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
