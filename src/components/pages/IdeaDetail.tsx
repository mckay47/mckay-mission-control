import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Search, Rocket, Save, Coffee, BarChart2, Zap, RefreshCw } from 'lucide-react'
import { Header } from '../shared/Header.tsx'
import { SplitLayout } from '../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText, TcStatRow, TcStat } from '../shared/PreviewPanel.tsx'
import { BottomTicker } from '../shared/BottomTicker.tsx'
import { Terminal } from '../shared/Terminal.tsx'
import { Pipeline } from '../shared/Pipeline.tsx'
import LaunchWizard from '../shared/LaunchWizard.tsx'
import { useMissionControl } from '../../lib/MissionControlProvider.tsx'
import { useTerminalSession } from '../../hooks/useTerminalSession.ts'

interface Props { toggleTheme: () => void }

/* ── Helpers ──────────────────────────────────────────── */

function phaseStyle(st: string): { label: string; bg: string; color: string } {
  switch (st) {
    case 'Bereit':
      return { label: 'Bereit', bg: 'rgba(0,255,136,0.12)', color: 'var(--g)' }
    case 'Research':
      return { label: 'Research', bg: 'rgba(139,92,246,0.12)', color: 'var(--p)' }
    case 'Geparkt':
      return { label: 'Geparkt', bg: 'rgba(255,255,255,0.04)', color: 'var(--tx3)' }
    case 'Projekt':
      return { label: 'Projekt', bg: 'rgba(0,240,255,0.12)', color: 'var(--t)' }
    default:
      return { label: st || 'Neu', bg: 'rgba(0,150,255,0.12)', color: 'var(--bl)' }
  }
}

function scoreColor(score: number | null): string {
  if (score === null) return 'var(--tx3)'
  if (score >= 80) return 'var(--r)'
  if (score >= 60) return 'var(--bl)'
  return 'var(--tx3)'
}

function glowFromCol(col: string): string {
  const map: Record<string, string> = {
    'var(--r)': 'var(--rg)',
    'var(--g)': 'var(--gg)',
    'var(--bl)': 'var(--blg)',
    'var(--p)': 'var(--pg)',
    'var(--a)': 'var(--ag)',
    'var(--t)': 'var(--tg)',
    'var(--o)': 'var(--og)',
  }
  return map[col] || 'var(--blg)'
}

/* ── Quick Actions ──────────────────────────────────────── */

const quickActions = [
  { label: 'Research starten', icon: Search,    color: 'var(--bl)', border: 'var(--blg)', prompt: 'Analysiere diese Idee: Markt, Wettbewerb, Zielgruppe, Machbarkeit. Gib eine klare Empfehlung (GO/PIVOT/STOP).' },
  { label: 'Score berechnen',  icon: BarChart2, color: 'var(--a)',  border: 'var(--ag)',  prompt: 'Bewerte diese Idee auf einer Skala 1-5 in den Kategorien: Fit, Potenzial, Komplexität, Speed, Risiko. Begründe jede Bewertung.' },
  { label: '→ Projekt',        icon: Rocket,    color: 'var(--g)',  border: 'var(--gg)',  prompt: '' },
  { label: 'Speichern',        icon: Save,      color: 'var(--p)',  border: 'var(--pg)',  prompt: 'Speichere den aktuellen Stand dieser Idee in die MEMORY.md und aktualisiere die _INDEX.md.' },
  { label: 'Feierabend',       icon: Coffee,    color: 'var(--r)',  border: 'var(--rg)',  prompt: 'Session beenden: MEMORY.md aktualisieren, Änderungen committen und pushen.' },
]

/* ── Component ─────────────────────────────────────────── */

export function IdeaDetail({ toggleTheme }: Props) {
  const { ideas, tickerData, getIdeaPipeline, ideaFeedback, ideaResearch } = useMissionControl()
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const [tab, setTab] = useState(0)
  const [launchOpen, setLaunchOpen] = useState(false)

  const idea = ideas.find(i => i.id === id)

  const session = useTerminalSession({
    terminalId: `idea:${idea?.id || id || ''}`,
    cwd: '~/mckay-os',
  })

  if (!idea) {
    return (
      <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--tx3)' }}>Idee nicht gefunden</div>
        <button className="open-btn" style={{ marginTop: 20 }} onClick={() => nav('/thinktank')}>Zurueck zum Thinktank</button>
      </div>
    )
  }

  const color = idea.col || 'var(--bl)'
  const glow = glowFromCol(color)
  const ps = phaseStyle(idea.st ?? '')
  const totalScore = (idea.f ?? 0) + (idea.pot ?? 0) + (idea.c ?? 0) + (idea.spd ?? 0) - (idea.r ?? 0)

  // Detail data from context
  const feedback = ideaFeedback[idea.id]
  const research = ideaResearch[idea.id]

  const innovationScore = feedback?.innovation ? feedback.innovation * 20 : null

  // Pipeline
  const milestones = getIdeaPipeline((idea.st ?? '').toLowerCase(), color, glow)
  const pipeline = <Pipeline label="Idee Pipeline" milestones={milestones} summary={ps.label} />

  const scores = [
    { label: 'Fit', value: idea.f ?? 0, max: 5, color: 'var(--g)' },
    { label: 'Potenzial', value: idea.pot ?? 0, max: 5, color: 'var(--bl)' },
    { label: 'Komplexitaet', value: idea.c ?? 0, max: 5, color: 'var(--p)' },
    { label: 'Speed', value: idea.spd ?? 0, max: 5, color: 'var(--a)' },
    { label: 'Risiko', value: idea.r ?? 0, max: 5, color: 'var(--r)' },
  ]

  const tabs = [
    {
      label: 'Next Actions',
      content: (
        <>
          <TcLabel>AI Score</TcLabel>
          <TcStatRow>
            <TcStat value={totalScore} label="Gesamt" color={color} />
            <TcStat value={innovationScore !== null ? innovationScore : '\u2014'} label="Innovation" color={scoreColor(innovationScore)} />
            <TcStat value={`${idea.pot}/5`} label="Potenzial" color="var(--bl)" />
          </TcStatRow>
          <TcLabel>Detailbewertung</TcLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {scores.map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx3)', width: 80, flexShrink: 0 }}>{s.label}</span>
                <div style={{
                  flex: 1, height: 6, borderRadius: 3,
                  background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${(s.value / s.max) * 100}%`, height: '100%',
                    borderRadius: 3, background: s.color,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: s.color, width: 30, textAlign: 'right' }}>
                  {s.value}/{s.max}
                </span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      label: 'Research Log',
      content: (
        <>
          <TcLabel>Research Status</TcLabel>
          <TcStatRow>
            <TcStat
              value={research?.status === 'done' ? 'Fertig' : research?.status === 'running' ? 'Laeuft' : 'Offen'}
              label="Status"
              color={research?.status === 'done' ? 'var(--g)' : research?.status === 'running' ? 'var(--bl)' : 'var(--tx3)'}
            />
          </TcStatRow>
          <TcLabel>Research Ergebnis</TcLabel>
          <TcText>{idea.res || 'Noch nicht gestartet'}</TcText>
          {research?.summary && (
            <>
              <TcLabel>Zusammenfassung</TcLabel>
              <TcText>{research.summary}</TcText>
            </>
          )}
          {research?.feasibility && (
            <>
              <TcLabel>Machbarkeit</TcLabel>
              <TcText>{research.feasibility}</TcText>
            </>
          )}
        </>
      ),
    },
    {
      label: 'KPI',
      content: (
        <>
          <TcLabel>KANI Feedback</TcLabel>
          {feedback ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { key: 'Problem', value: feedback.problem },
                { key: 'Zielgruppe', value: feedback.audience },
                { key: 'Markt', value: feedback.market },
                { key: 'Empfehlung', value: feedback.recommendation },
              ].map(item => (
                <div key={item.key} className="ghost-card" style={{ padding: '12px 16px', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 4, '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: 1 }}>{item.key}</span>
                  <span style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.5 }}>{item.value || '\u2014'}</span>
                </div>
              ))}
            </div>
          ) : idea.feedback ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { key: 'Branche', value: idea.feedback.branche },
                { key: 'Markt', value: idea.feedback.markt },
                { key: 'Problem', value: idea.feedback.problem },
                { key: 'Nutzen', value: idea.feedback.nutzen },
                { key: 'Highlights', value: idea.feedback.highlights },
              ].map(item => (
                <div key={item.key} className="ghost-card" style={{ padding: '12px 16px', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 4, '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: 1 }}>{item.key}</span>
                  <span style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.5 }}>{item.value || '\u2014'}</span>
                </div>
              ))}
            </div>
          ) : (
            <TcText>Kein Feedback vorhanden</TcText>
          )}
          <TcLabel>Empfehlung</TcLabel>
          <TcText>{idea.rec || '\u2014'}</TcText>
        </>
      ),
    },
    {
      label: 'Idea Briefing',
      content: (
        <>
          <div style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 12 }}>
              <strong style={{ color: 'var(--tx)' }}>{idea.n ?? idea.title ?? 'Unbekannt'}</strong> — {idea.txt || 'Keine Beschreibung'}
            </p>
            <p style={{ marginBottom: 12 }}>
              Kategorie: <strong>{idea.cat}</strong> | Status: <span style={{ color: ps.color, fontWeight: 700 }}>{ps.label}</span>
            </p>
            <p style={{ marginBottom: 12 }}>
              Score: <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color }}>{totalScore}</span> | Fit: {idea.f}/5 | Potenzial: {idea.pot}/5 | Risiko: {idea.r}/5
            </p>
            <p>
              Research: {idea.res || 'Nicht gestartet'} | Empfehlung: {idea.rec || '\u2014'}
            </p>
          </div>
        </>
      ),
    },
  ]

  return (
    <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header backLink={{ label: 'Thinktank', href: '/thinktank' }} toggleTheme={toggleTheme} />

      <SplitLayout
        ratio="50% 50%"
        left={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
            <div className="st" style={{ padding: '0 2px', display: 'flex', alignItems: 'center', gap: 10 }}>
              KANI Terminal
              <span style={{
                fontSize: 9, fontWeight: 700, padding: '3px 10px', borderRadius: 6, letterSpacing: 1,
                background: session.sessionActive ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.04)',
                color: session.sessionActive ? 'var(--g)' : 'var(--tx3)',
              }}>
                {session.shuttingDown ? 'SHUTDOWN...' : session.sessionActive ? 'ACTIVE' : 'DORMANT'}
              </span>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
              <Terminal
                key={session.sessionKey}
                title={`${idea.id} — research`}
                statusLabel={session.sessionActive ? (session.terminalBusy ? 'Thinking...' : 'Active') : 'Dormant'}
                statusColor={session.sessionActive ? (session.terminalBusy ? 'var(--a)' : ps.color) : 'var(--tx3)'}
                statusGlow={session.sessionActive ? (session.terminalBusy ? 'var(--ag)' : glow) : 'rgba(255,255,255,0.04)'}
                placeholder={session.sessionActive ? `kani@${idea.id} ~$ ` : ''}
                mode="live"
                cwd="~/mckay-os"
                terminalId={`idea:${idea.id}`}
                inputValue={session.pendingPrompt || undefined}
                onInputChange={(v) => session.setPendingPrompt(v || null)}
                onClearInput={() => session.setPendingPrompt(null)}
                onSend={() => session.onSend()}
                onThinkingChange={(thinking) => session.onThinkingChange(thinking)}
              />

              {/* Dormant overlay */}
              {!session.sessionActive && !session.shuttingDown && (
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 20,
                  background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(8px)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
                  zIndex: 10,
                }}>
                  <div style={{ fontSize: 13, color: 'var(--tx3)', fontWeight: 600 }}>Terminal inaktiv</div>
                  <button
                    className="qa-btn"
                    style={{
                      borderColor: 'var(--g)', color: 'var(--g)', '--qc': 'var(--g)',
                      padding: '14px 28px', fontSize: 13, fontWeight: 700,
                    } as React.CSSProperties}
                    onClick={() => session.activate(
                      `Analysiere die Idee "${idea.n ?? idea.title ?? idea.id}": Lies relevante Dateien und gib einen kurzen Status-Überblick.`
                    )}
                  >
                    <Zap size={16} stroke="var(--g)" />
                    Aktivieren
                  </button>
                </div>
              )}
            </div>

            {/* Quick actions — only when active */}
            {session.sessionActive && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '4px 0' }}>
                {quickActions.map((qa, i) => {
                  const Icon = qa.icon
                  const isFeierabend = qa.label === 'Feierabend'
                  const disabled = session.terminalBusy || session.shuttingDown || session.refreshing
                  return (
                    <button
                      key={i}
                      className="qa-btn"
                      style={{
                        borderColor: qa.border, color: qa.color, '--qc': qa.color,
                        ...(disabled ? { opacity: 0.4, pointerEvents: 'none' as const } : {}),
                      } as React.CSSProperties}
                      onClick={
                        qa.label === '→ Projekt' ? () => setLaunchOpen(true) :
                        isFeierabend ? () => session.shutdown() :
                        qa.prompt ? () => session.setPendingPrompt(qa.prompt) :
                        undefined
                      }
                      disabled={disabled}
                    >
                      <Icon size={14} stroke={qa.color} />
                      {qa.label}
                    </button>
                  )
                })}
                {/* Neue Session — soft reset */}
                <button
                  className="qa-btn"
                  style={{
                    borderColor: 'var(--bl)', color: 'var(--bl)', '--qc': 'var(--bl)',
                    ...((session.terminalBusy || session.shuttingDown || session.refreshing) ? { opacity: 0.4, pointerEvents: 'none' as const } : {}),
                  } as React.CSSProperties}
                  onClick={() => session.newSession()}
                  disabled={session.terminalBusy || session.shuttingDown || session.refreshing}
                >
                  <RefreshCw size={14} stroke="var(--bl)" />
                  Neue Session
                </button>
              </div>
            )}
          </div>
        }
        right={
          <PreviewPanel
            title={idea.n ?? idea.title ?? 'Unbekannt'}
            ledColor={color}
            ledGlow={glow}
            badge={{ label: `${ps.label} / ${idea.cat}`, bg: `${ps.color}18`, color: ps.color }}
            pipeline={pipeline}
            tabs={tabs}
            activeTab={tab}
            onTabChange={setTab}
            accentColor={color}
          />
        }
      />

      <BottomTicker
        label={(idea.n ?? idea.title ?? 'IDEA').toUpperCase().split(' ')[0]}
        ledColor={color}
        ledGlow={glow}
        items={tickerData.thinktank || tickerData.ideas || []}
      />

      <LaunchWizard
        open={launchOpen}
        onClose={() => setLaunchOpen(false)}
        ideaId={idea.id}
        ideaName={idea.n ?? idea.title}
        ideaDescription={idea.txt ?? idea.description}
      />
    </div>
  )
}
