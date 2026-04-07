import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lightbulb, Zap, Search, CheckCircle, ExternalLink } from 'lucide-react'
import { Header } from '../shared/Header.tsx'
import { BottomTicker } from '../shared/BottomTicker.tsx'
import { StatusLed } from '../ui/StatusLed.tsx'
import { useMissionControl } from '../../lib/MissionControlProvider.tsx'

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

function ideaScore(idea: { feedback?: { innovation?: number } }): number | null {
  if (idea.feedback && idea.feedback.innovation) {
    return idea.feedback.innovation * 20
  }
  return null
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

/* ── Component ─────────────────────────────────────────── */

export function Thinktank({ toggleTheme }: Props) {
  const { ideas, tickerData } = useMissionControl()
  const nav = useNavigate()
  const [sel, setSel] = useState(-1)

  const totalCount = ideas.length
  const hotCount = ideas.filter(i => { const s = ideaScore(i); return s !== null && s >= 80 }).length
  const researchCount = ideas.filter(i => i.st === 'Research' || i.st === 'Neu').length
  const bereitCount = ideas.filter(i => i.st === 'Bereit').length

  const selected = sel >= 0 && sel < ideas.length ? ideas[sel] : null

  return (
    <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        title="Thinktank"
        ledColor="p"
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, overflow: 'hidden', paddingBottom: 16 }}>
        {/* KPI Row */}
        <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
          {[
            { label: 'Ideen gesamt', value: totalCount, color: 'var(--p)', glow: 'var(--pg)', icon: Lightbulb },
            { label: 'Hot', value: hotCount, color: 'var(--r)', glow: 'var(--rg)', icon: Zap },
            { label: 'Research', value: researchCount, color: 'var(--bl)', glow: 'var(--blg)', icon: Search },
            { label: 'Bereit', value: bereitCount, color: 'var(--g)', glow: 'var(--gg)', icon: CheckCircle },
          ].map(kpi => {
            const Icon = kpi.icon
            return (
              <div
                key={kpi.label}
                className="ghost-card"
                style={{ '--hc': kpi.glow, padding: '16px 22px', flex: 1, flexDirection: 'row', alignItems: 'center', gap: 14 } as React.CSSProperties}
              >
                <Icon size={20} stroke={kpi.color} strokeWidth={1.6} />
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
                  <div style={{ fontSize: 10, color: 'var(--tx3)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{kpi.label}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span className="st" style={{ padding: '0 2px' }}>Alle Ideen</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>
            {totalCount} Ideen
          </span>
        </div>

        {/* 3-Column Ghost Card Grid */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {ideas.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 700, color: 'var(--tx3)', opacity: 0.3 }}>--</span>
              <span style={{ fontSize: 13, color: 'var(--tx3)' }}>Keine Ideen vorhanden</span>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {ideas.map((idea, i) => {
                const sc = ideaScore(idea)
                const ps = phaseStyle(idea.st)
                const glow = glowFromCol(idea.col)
                const isDone = idea.st === 'Projekt'

                return (
                  <div
                    key={idea.id}
                    className="ghost-card"
                    style={{
                      '--hc': glow,
                      padding: '18px 22px',
                      gap: 10,
                      cursor: 'pointer',
                      opacity: isDone ? 0.4 : 1,
                    } as React.CSSProperties}
                    onClick={() => setSel(i)}
                    onDoubleClick={() => nav(`/idea/${idea.id}`)}
                  >
                    {/* Top-right open icon */}
                    <div
                      className="ghost-open-icon"
                      style={{
                        position: 'absolute', top: 12, right: 12, zIndex: 2,
                        cursor: 'pointer', opacity: 0,
                        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      }}
                      onClick={(e) => { e.stopPropagation(); nav(`/idea/${idea.id}`) }}
                    >
                      <ExternalLink size={14} stroke="var(--tx3)" />
                    </div>

                    {/* Score + Status Badge Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 18, fontWeight: 700,
                        color: isDone ? 'var(--g)' : scoreColor(sc),
                      }}>
                        {isDone ? '\u2713' : sc !== null ? sc : '\u2014'}
                      </span>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                        background: ps.bg, color: ps.color, letterSpacing: 1,
                      }}>
                        {ps.label}
                      </span>
                    </div>

                    {/* Title */}
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)', lineHeight: 1.3 }}>
                      {idea.n}
                    </div>

                    {/* Description */}
                    <div style={{
                      fontSize: 12, color: 'var(--tx2)', lineHeight: 1.5,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {idea.txt || '\u2014'}
                    </div>

                    {/* Category Tag */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 9, fontWeight: 600, padding: '3px 10px', borderRadius: 6,
                        background: `${idea.col}18`, color: idea.col || 'var(--bl)',
                      }}>
                        {idea.cat}
                      </span>
                      {idea.date && (
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--tx3)' }}>
                          {idea.date}
                        </span>
                      )}
                    </div>

                    {/* Color accent bar */}
                    <div style={{ width: 32, height: 3, borderRadius: 2, background: idea.col || 'var(--p)', opacity: 0.5, marginTop: 2 }} />
                  </div>
                )
              })}

              {/* Add placeholder */}
              <div
                className="ghost-card"
                style={{
                  '--hc': 'rgba(255,255,255,0.04)',
                  padding: '18px 22px',
                  alignItems: 'center', justifyContent: 'center',
                  minHeight: 140,
                  opacity: 0.3,
                  cursor: 'default',
                } as React.CSSProperties}
              >
                <Lightbulb size={28} stroke="var(--tx3)" strokeWidth={1.2} />
                <span style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 8 }}>Neue Idee</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomTicker
        label="THINKTANK"
        ledColor="var(--p)"
        ledGlow="var(--pg)"
        items={tickerData.thinktank || tickerData.ideas || []}
      />
    </div>
  )
}
