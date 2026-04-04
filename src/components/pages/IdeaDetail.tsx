import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { IDEAS } from '../../lib/data'
import AppShell from '../shared/AppShell'
import QuickAccess from '../shared/QuickAccess'

/* -- Component -- */

export default function IdeaDetail() {
  const { id } = useParams()
  const [pipelineOpen, setPipelineOpen] = useState(false)
  const [activeTermTab, setActiveTermTab] = useState(0)

  const idea = IDEAS.find((i) => i.id === id)

  if (!idea) {
    return (
      <AppShell backLink={{ label: 'Thinktank', href: '/thinktank' }} title="Idee nicht gefunden" ledColor="r" kaniContext={`idee:${id}`}>
        <div style={{ padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--r)', marginBottom: 8 }}>Idee nicht gefunden</div>
          <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Die Idee mit ID &quot;{id}&quot; existiert nicht.</div>
        </div>
      </AppShell>
    )
  }

  const totalScore = idea.f + idea.pot + idea.c + idea.spd - idea.r
  const termTabs = ['KANI Chat', 'Research Log', 'Scoring']

  const scores = [
    { label: 'Fit', value: idea.f, max: 5, color: 'var(--g)' },
    { label: 'Potenzial', value: idea.pot, max: 5, color: 'var(--bl)' },
    { label: 'Complexity', value: idea.c, max: 5, color: 'var(--p)' },
    { label: 'Speed', value: idea.spd, max: 5, color: 'var(--a)' },
    { label: 'Risiko', value: idea.r, max: 5, color: 'var(--r)' },
  ]

  return (
    <AppShell
      backLink={{ label: 'Thinktank', href: '/thinktank' }}
      title={idea.n}
      ledColor="bl"
      kaniContext={`idee:${id}`}
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
            <div className="kv" style={{ color: 'var(--r)' }}>{totalScore}</div>
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
            <div className="kv" style={{ color: 'var(--g)' }}>{idea.pot}/5</div>
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
            <div className="kv" style={{ color: 'var(--bl)' }}>{idea.res === 'nicht gestartet' ? '0' : '\u2014'}</div>
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
            <div className="kv" style={{ color: 'var(--p)' }}>{'\u2014'}</div>
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
            <div className="kv" style={{ color: 'var(--a)' }}>{'\u2014'}</div>
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
              <div className="pl-seg" style={{ flex: 1, background: idea.st === 'Neu' ? 'var(--a)' : 'var(--g)', borderRadius: 3, opacity: 1 }} />
              <div className="pl-seg" style={{ flex: 1, background: 'var(--tx3)', borderRadius: 3, opacity: 0.25 }} />
              <div className="pl-seg" style={{ flex: 1, background: 'var(--tx3)', borderRadius: 3, opacity: 0.25 }} />
              <div className="pl-seg" style={{ flex: 1, background: 'var(--tx3)', borderRadius: 3, opacity: 0.25 }} />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: idea.col, whiteSpace: 'nowrap' }}>
              {idea.st} {'\u2014'} {idea.cat}
            </span>
            <span style={{ fontSize: 10, color: 'var(--tx3)', cursor: 'pointer' }}>
              {pipelineOpen ? '\u25B2' : '\u25BC'}
            </span>
          </div>
          {pipelineOpen && (
            <div className="pl-detail open">
              <div className="pl-ms">
                <div className="pl-ms-dot" style={{ background: idea.st === 'Geparkt' ? 'var(--tx3)' : 'var(--a)' }} />
                <div className="pl-ms-info">
                  <div className="pl-ms-title" style={{ color: 'var(--a)' }}>Erfasst</div>
                  <div className="pl-ms-date">{idea.date}</div>
                  <div className="pl-ms-sub">
                    {'\u25CF'} Idee angelegt<br />
                    {'\u25CF'} Kategorie: {idea.cat}
                  </div>
                </div>
              </div>
              <div className="pl-ms">
                <div className="pl-ms-dot" style={{ background: 'var(--tx3)' }} />
                <div className="pl-ms-info">
                  <div className="pl-ms-title">Research</div>
                  <div className="pl-ms-sub">{idea.res}</div>
                </div>
              </div>
              <div className="pl-ms">
                <div className="pl-ms-dot" style={{ background: 'var(--tx3)' }} />
                <div className="pl-ms-info">
                  <div className="pl-ms-title">Bereit</div>
                </div>
              </div>
              <div className="pl-ms">
                <div className="pl-ms-dot" style={{ background: 'var(--tx3)' }} />
                <div className="pl-ms-info">
                  <div className="pl-ms-title">{'\u2192'} Projekt</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section titles */}
      <div className="trow" style={{ gridTemplateColumns: '90px 1fr 380px' }}>
        <span className="st">Status</span>
        <span className="st">KANI {'\u00B7'} Analyse</span>
        <span className="st">Bewertung & Notizen</span>
      </div>

      {/* BODY: status + terminal + research */}
      <div className="mbody" style={{ gridTemplateColumns: '90px 1fr 380px', flex: 8 }}>
        {/* Left: Status sidebar */}
        <div className="lnav">
          <div className="ag-item cf" style={{ '--nc': 'var(--blg)' } as React.CSSProperties}>
            <div className="btn3d" style={{ '--bc': 'var(--blg)', width: 36, height: 36 } as React.CSSProperties}>
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--bl)" strokeWidth="1.8" fill="none">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <span className="ag-name">Research</span>
            <span className="ag-status" style={{ color: 'var(--tx3)' }}>{idea.res === 'nicht gestartet' ? 'Offen' : idea.res}</span>
          </div>
          <div className="ag-item cf" style={{ '--nc': 'var(--pg)' } as React.CSSProperties}>
            <div className="btn3d" style={{ '--bc': 'var(--pg)', width: 36, height: 36 } as React.CSSProperties}>
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="var(--p)" strokeWidth="1.8" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="ag-name">Scoring</span>
            <span className="ag-status" style={{ color: 'var(--tx3)' }}>{totalScore}p</span>
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
                    background: 'var(--tx3)',
                    animation: 'none',
                  }}
                />
                <span style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 600 }}>Idle</span>
              </div>
            </div>
            <div className="term-body">
              <div className="term-line">
                <span className="term-output" style={{ color: 'var(--tx3)' }}>Kein Output {'\u2014'} Research nicht gestartet</span>
              </div>
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

        {/* Right: Scores + Notes */}
        <div className="right" style={{ gap: 14 }}>
          {/* AI Scores */}
          <div className="r-card cf">
            <div className="r-hdr">
              <span className="st">AI Bewertung</span>
            </div>
            <div className="det-score-row" style={{ padding: '0 14px 12px' }}>
              {scores.map((s) => (
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

          {/* Description */}
          <div className="r-card cf" style={{ flex: 'none', padding: '14px 18px' }}>
            <div className="st" style={{ marginBottom: 8 }}>Beschreibung</div>
            <div style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5 }}>
              {idea.txt || '\u2014'}
            </div>
          </div>

          {/* Notes */}
          <div className="r-card cf" style={{ flex: 'none', padding: '14px 18px' }}>
            <div className="st" style={{ marginBottom: 8 }}>Notizen</div>
            <div style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5 }}>
              {'\u25CF'} Kategorie: {idea.cat}<br />
              {'\u25CF'} Status: {idea.st}<br />
              {'\u25CF'} Empfehlung: {idea.rec}<br />
              {'\u25CF'} Research: {idea.res}
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
                Phase {'\u00E4'}ndern
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: Notifications + Quick Access */}
      <div className="brow" style={{ gridTemplateColumns: '90px 1fr 380px', flex: 'none', marginTop: 14 }}>
        <div />
        <div className="cf" style={{ padding: '16px 20px' }}>
          <div className="st" style={{ marginBottom: 10 }}>Notifications {'\u00B7'} {idea.n}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Issues', color: 'var(--r)', glowVar: 'var(--rg)', iconPath: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></> },
              { label: 'Attention', color: 'var(--o)', glowVar: 'var(--og)', iconPath: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></> },
              { label: 'Freigabe', color: 'var(--g)', glowVar: 'var(--gg)', iconPath: <><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></> },
              { label: 'Results', color: 'var(--bl)', glowVar: 'var(--blg)', iconPath: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></> },
            ].map((cat) => (
              <div key={cat.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className="btn3d" style={{ '--bc': cat.glowVar, width: 36, height: 36 } as React.CSSProperties}>
                    <svg viewBox="0 0 24 24" width="15" height="15" stroke={cat.color} strokeWidth="1.8" fill="none">{cat.iconPath}</svg>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: cat.color }}>{cat.label}</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--tx3)', lineHeight: 1.5, marginTop: 4 }}>
                  Keine
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
            <span className="ticker-ld" style={{ background: idea.col, boxShadow: `0 0 10px ${idea.col}` }} />
            {idea.n.toUpperCase().split(' ')[0]}
          </div>
          <div className="ticker-c">
            <div style={{ padding: '0 20px', fontSize: 11, color: 'var(--tx3)' }}>
              Keine Aktivitäten
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
