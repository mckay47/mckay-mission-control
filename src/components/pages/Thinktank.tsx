import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, Rocket } from 'lucide-react'
import { Header } from '../shared/Header.tsx'
import { BottomTicker } from '../shared/BottomTicker.tsx'
import { SplitLayout } from '../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText } from '../shared/PreviewPanel.tsx'
import { Pipeline } from '../shared/Pipeline.tsx'
import { useMissionControl } from '../../lib/MissionControlProvider.tsx'

interface Props { toggleTheme: () => void }

type Filter = 'all' | 'intake' | 'parked' | 'research' | 'ready'

/* ── Helpers ──────────────────────────────────────────── */

function phaseStyle(st: string): { label: string; bg: string; color: string } {
  switch (st) {
    case 'Bereit':   return { label: 'READY',    bg: 'rgba(0,200,83,0.12)',    color: 'var(--g)' }
    case 'Research': return { label: 'RESEARCH',  bg: 'rgba(124,77,255,0.12)',  color: 'var(--p)' }
    case 'Geparkt':  return { label: 'PARKED',    bg: 'rgba(255,255,255,0.06)', color: 'var(--tx3)' }
    case 'Projekt':  return { label: 'PROJEKT',   bg: 'rgba(0,191,165,0.12)',   color: 'var(--t)' }
    default:         return { label: 'INTAKE',    bg: 'rgba(41,121,255,0.12)',  color: 'var(--bl)' }
  }
}

function ideaScore(idea: { feedback?: { innovation?: number }; f?: number; pot?: number }): number | null {
  if (idea.feedback?.innovation) return idea.feedback.innovation * 20
  if (idea.f && idea.pot) return Math.round((idea.f + idea.pot) * 10)
  return null
}

function scoreColor(score: number | null): string {
  if (score === null) return 'var(--tx3)'
  if (score >= 80) return 'var(--r)'
  if (score >= 60) return 'var(--bl)'
  return 'var(--tx3)'
}

function glowFromColor(col: string): string {
  const map: Record<string, string> = {
    'var(--r)': 'var(--rg)', 'var(--g)': 'var(--gg)', 'var(--bl)': 'var(--blg)',
    'var(--p)': 'var(--pg)', 'var(--a)': 'var(--ag)', 'var(--t)': 'var(--tg)', 'var(--o)': 'var(--og)',
  }
  return map[col] || 'var(--blg)'
}

/* ── Component ─────────────────────────────────────────── */

export function Thinktank({ toggleTheme }: Props) {
  const { ideas, tickerData, getIdeaPipeline, ideaFeedback, ideaResearch } = useMissionControl()
  const nav = useNavigate()
  const [sel, setSel] = useState(0)
  const [tab, setTab] = useState(0)
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => {
    switch (filter) {
      case 'intake':   return ideas.filter(i => !['Bereit','Research','Geparkt','Projekt'].includes(i.st))
      case 'parked':   return ideas.filter(i => i.st === 'Geparkt')
      case 'research': return ideas.filter(i => i.st === 'Research')
      case 'ready':    return ideas.filter(i => i.st === 'Bereit')
      default:         return ideas.filter(i => i.st !== 'Projekt')
    }
  }, [ideas, filter])

  const idea = filtered[sel] ?? filtered[0] ?? null

  const filterTabs: { key: Filter; label: string }[] = [
    { key: 'all',      label: 'All' },
    { key: 'intake',   label: 'Intake' },
    { key: 'parked',   label: 'Parked' },
    { key: 'research', label: 'Research' },
    { key: 'ready',    label: 'Ready' },
  ]

  /* ── Right panel tabs ─────────────────────────────────── */

  const buildTabs = (i: typeof idea) => {
    if (!i) return []
    const ps = phaseStyle(i.st)
    const sc = ideaScore(i)
    const fb = ideaFeedback[i.id]
    const rs = ideaResearch[i.id]

    return [
      {
        label: 'Live',
        content: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Score + Stage */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 52, fontWeight: 700, color: scoreColor(sc), lineHeight: 1 }}>
                  {sc ?? '—'}
                </div>
                <div style={{ fontSize: 9, color: 'var(--tx3)', letterSpacing: 2, marginTop: 4 }}>SCORE</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: ps.color }}>{ps.label}</div>
                <div style={{ fontSize: 9, color: 'var(--tx3)', letterSpacing: 2, marginTop: 2 }}>STAGE</div>
              </div>
            </div>

            {/* Description */}
            {i.txt && <TcText>{i.txt}</TcText>}

            {/* Agent Activity */}
            <div>
              <TcLabel>Agent Activity</TcLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                {[
                  { name: 'Research Agent', status: rs?.status === 'done' ? 'FERTIG' : rs?.status === 'running' ? 'AKTIV' : 'BEREIT', color: rs?.status === 'done' ? 'var(--g)' : rs?.status === 'running' ? 'var(--a)' : 'var(--tx3)' },
                  { name: 'Feedback Agent', status: fb ? 'FERTIG' : 'BEREIT', color: fb ? 'var(--g)' : 'var(--tx3)' },
                ].map(a => (
                  <div key={a.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, boxShadow: a.color !== 'var(--tx3)' ? `0 0 6px ${a.color}` : 'none' }} />
                      <span style={{ fontSize: 12, color: 'var(--tx2)' }}>{a.name}</span>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: a.color, letterSpacing: 1 }}>{a.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            {i.rec && (
              <div>
                <TcLabel>Empfehlung</TcLabel>
                <div style={{ marginTop: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--bl)', textDecoration: 'underline', cursor: 'pointer' }}>{i.rec}</span>
                </div>
              </div>
            )}
          </div>
        ),
      },
      {
        label: 'Feedback',
        content: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {fb ? (
              <>
                <div>
                  <TcLabel>Problem / Mehrwert</TcLabel>
                  <TcText style={{ marginTop: 6 }}>{fb.problem || '—'}</TcText>
                </div>
                <div>
                  <TcLabel>Zielgruppe</TcLabel>
                  <TcText style={{ marginTop: 6 }}>{fb.audience || '—'}</TcText>
                </div>
                <div>
                  <TcLabel>Markt-Einschätzung</TcLabel>
                  <TcText style={{ marginTop: 6 }}>{fb.market || '—'}</TcText>
                </div>
                <div>
                  <TcLabel>Gesamtbewertung</TcLabel>
                  <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700, color: scoreColor(sc) }}>{sc ?? '—'}</span>
                    <span style={{ fontSize: 10, color: 'var(--tx3)' }}>Score</span>
                  </div>
                </div>
                <div>
                  <TcLabel>Empfehlung</TcLabel>
                  <div style={{ marginTop: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--bl)', cursor: 'pointer', textDecoration: 'underline' }}>{fb.recommendation || i.rec || '—'}</span>
                  </div>
                </div>
              </>
            ) : i.feedback ? (
              <>
                {[
                  { key: 'Problem', val: i.feedback.problem },
                  { key: 'Markt', val: i.feedback.markt },
                  { key: 'Nutzen', val: i.feedback.nutzen },
                ].map(item => (
                  <div key={item.key}>
                    <TcLabel>{item.key}</TcLabel>
                    <TcText style={{ marginTop: 6 }}>{item.val || '—'}</TcText>
                  </div>
                ))}
              </>
            ) : (
              <TcText>Kein Feedback vorhanden</TcText>
            )}
          </div>
        ),
      },
      {
        label: 'Research',
        content: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <TcLabel>Research Status</TcLabel>
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: rs?.status === 'done' ? 'var(--g)' : rs?.status === 'running' ? 'var(--a)' : 'var(--tx3)' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: rs?.status === 'done' ? 'var(--g)' : rs?.status === 'running' ? 'var(--a)' : 'var(--tx3)' }}>
                  {rs?.status === 'done' ? 'Fertig' : rs?.status === 'running' ? 'Läuft' : 'Nicht gestartet'}
                </span>
              </div>
            </div>
            {i.res && (
              <div>
                <TcLabel>Research Ergebnis</TcLabel>
                <TcText style={{ marginTop: 6 }}>{i.res}</TcText>
              </div>
            )}
            {rs?.summary && (
              <div>
                <TcLabel>Zusammenfassung</TcLabel>
                <TcText style={{ marginTop: 6 }}>{rs.summary}</TcText>
              </div>
            )}
            {rs?.feasibility && (
              <div>
                <TcLabel>Machbarkeit</TcLabel>
                <TcText style={{ marginTop: 6 }}>{rs.feasibility}</TcText>
              </div>
            )}
            {!i.res && !rs?.summary && <TcText>Research noch nicht gestartet</TcText>}
          </div>
        ),
      },
      {
        label: 'Reports',
        content: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <TcText style={{ opacity: 0.5 }}>Reports werden nach Abschluss des Research generiert.</TcText>
          </div>
        ),
      },
      {
        label: 'Briefing',
        content: (
          <div style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 10 }}>
              <strong style={{ color: 'var(--tx)' }}>{i.n}</strong>{i.txt ? ` — ${i.txt}` : ''}
            </p>
            <p style={{ marginBottom: 10 }}>
              Kategorie: <strong>{i.cat}</strong> | Status: <span style={{ color: ps.color, fontWeight: 700 }}>{ps.label}</span>
            </p>
            {sc !== null && (
              <p>Score: <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: scoreColor(sc) }}>{sc}</span></p>
            )}
          </div>
        ),
      },
    ]
  }

  const psTabs = idea ? buildTabs(idea) : []
  const ideaColor = idea?.col || 'var(--bl)'
  const ideaGlow = glowFromColor(ideaColor)
  const ideaPs = idea ? phaseStyle(idea.st) : { label: '', color: 'var(--bl)' }
  const milestones = idea ? getIdeaPipeline(idea.st.toLowerCase(), ideaColor, ideaGlow) : []
  const pipeline = idea ? <Pipeline label="Idee Pipeline" milestones={milestones} summary={ideaPs.label} /> : null

  return (
    <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header backLink={{ label: 'Cockpit', href: '/' }} toggleTheme={toggleTheme} />

      <SplitLayout
        ratio="55% 45%"
        left={
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>
            {/* Filter tabs + count */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {filterTabs.map(ft => (
                  <button
                    key={ft.key}
                    onClick={() => { setFilter(ft.key); setSel(0) }}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 10,
                      border: 'none',
                      background: filter === ft.key ? 'rgba(255,255,255,0.08)' : 'transparent',
                      color: filter === ft.key ? 'var(--tx)' : 'var(--tx3)',
                      fontSize: 12,
                      fontWeight: filter === ft.key ? 700 : 500,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                    }}
                  >
                    {ft.label}
                  </button>
                ))}
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: 'var(--tx3)' }}>
                ↑ {filtered.length} Ideen
              </span>
            </div>

            {/* Idea cards grid */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filtered.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60%', color: 'var(--tx3)', fontSize: 13 }}>
                  Keine Ideen in dieser Kategorie
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {filtered.map((idea, i) => {
                    const sc2 = ideaScore(idea)
                    const ps2 = phaseStyle(idea.st)
                    const isSelected = i === sel
                    return (
                      <div
                        key={idea.id}
                        onClick={() => { setSel(i); setTab(0) }}
                        onDoubleClick={() => nav(`/idea/${idea.id}`)}
                        style={{
                          padding: '14px 16px',
                          borderRadius: 16,
                          border: `1px solid ${isSelected ? 'rgba(255,255,255,0.12)' : 'transparent'}`,
                          background: isSelected ? 'rgba(255,255,255,0.04)' : 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                          transition: 'all 0.25s',
                          position: 'relative',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        {/* Score + Status */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: scoreColor(sc2) }}>
                            {sc2 ?? '—'}
                          </span>
                          <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: ps2.bg, color: ps2.color, letterSpacing: 0.5 }}>
                            {ps2.label}
                          </span>
                        </div>

                        {/* Name */}
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', lineHeight: 1.3 }}>
                          {idea.n}
                        </div>

                        {/* Tags row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          {idea.cat && (
                            <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 5, background: `${idea.col || 'var(--bl)'}18`, color: idea.col || 'var(--bl)' }}>
                              {idea.cat}
                            </span>
                          )}
                          {idea.date && (
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--tx3)' }}>
                              {idea.date}
                            </span>
                          )}
                          <div style={{ flex: 1 }} />
                          <span style={{ fontSize: 11, color: 'var(--tx3)' }}>→</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        }
        right={
          idea ? (
            <PreviewPanel
              title={idea.n}
              ledColor={ideaColor}
              ledGlow={ideaGlow}
              badge={{ label: ideaPs.label, bg: `${ideaPs.color}18`, color: ideaPs.color }}
              pipeline={pipeline}
              tabs={psTabs}
              activeTab={tab}
              onTabChange={setTab}
              accentColor={ideaColor}
              headerAction={
                <button
                  onClick={() => nav(`/idea/${idea.id}`)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 10,
                    fontWeight: 700,
                    color: 'var(--tx3)',
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    fontFamily: 'inherit',
                  }}
                >
                  <ExternalLink size={12} stroke="var(--tx3)" />
                  ÖFFNEN
                </button>
              }
              footer={
                <div style={{ padding: '16px 26px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <button
                    onClick={() => nav(`/idea/${idea.id}`)}
                    style={{
                      width: '100%',
                      padding: '11px 0',
                      borderRadius: 12,
                      border: '1px solid rgba(0,200,83,0.3)',
                      background: 'rgba(0,200,83,0.08)',
                      color: 'var(--g)',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      transition: 'all 0.2s',
                    }}
                  >
                    <Rocket size={14} stroke="var(--g)" />
                    Als Projekt konvertieren
                  </button>
                </div>
              }
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--tx3)', fontSize: 13 }}>
              Idee auswählen
            </div>
          )
        }
      />

      <BottomTicker
        label="THINKTANK"
        ledColor="var(--p)"
        ledGlow="var(--pg)"
        items={tickerData.thinktank || tickerData.ideas || []}
      />
    </div>
  )
}
