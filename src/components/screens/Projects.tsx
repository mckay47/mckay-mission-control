import { useEffect, useRef } from 'react'
import Card from '../ui/Card'
import Gauge from '../ui/Gauge'
import { PROJ } from '../../lib/data'
import { useToast } from '../Toast'
import type { Project } from '../../lib/types'

function AnimatedProjectBars({ id, projects }: { id: string; projects: Project[] }) {
  useEffect(() => {
    const w = document.getElementById(id)
    if (!w) return
    w.innerHTML = ''
    const maxH = 80
    projects.forEach((p, i) => {
      const b = document.createElement('div')
      b.style.cssText = `flex:1;height:0;border-radius:4px 4px 0 0;position:relative;overflow:hidden;transition:height 1.5s ${i * 0.12}s ease;background:rgba(${p.cr},0.16);border:1px solid rgba(${p.cr},0.38);border-bottom:none`
      const l = document.createElement('div')
      l.style.cssText = `position:absolute;bottom:-16px;left:0;right:0;text-align:center;font-size:9px;font-weight:700;color:${p.col}`
      l.textContent = p.pct + '%'
      b.appendChild(l)
      const sh = document.createElement('div')
      sh.style.cssText = `position:absolute;inset:0;background:linear-gradient(180deg,${p.col} 0%,transparent 80%);opacity:0.3`
      b.appendChild(sh)
      w.appendChild(b)
      setTimeout(() => { b.style.height = `${(p.pct / 100) * maxH}px` }, 400)
    })
  }, [id, projects])
  return <div id={id} style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 90, paddingBottom: 20, flexShrink: 0 }} />
}

function AnimatedRevBars({ id, projects }: { id: string; projects: Project[] }) {
  useEffect(() => {
    const w = document.getElementById(id)
    if (!w) return
    w.innerHTML = ''
    const maxH = 90
    const maxV = Math.max(...projects.map(p => p.rev), 1)
    projects.forEach((p, i) => {
      const b = document.createElement('div')
      b.style.cssText = `flex:1;height:0;border-radius:4px 4px 0 0;position:relative;overflow:hidden;transition:height 1.5s ${i * 0.12}s ease;background:rgba(${p.cr},0.16);border:1px solid rgba(${p.cr},0.38);border-bottom:none`
      const l = document.createElement('div')
      l.style.cssText = `position:absolute;bottom:-16px;left:0;right:0;text-align:center;font-size:9px;font-weight:700;color:${p.col}`
      l.textContent = p.e
      b.appendChild(l)
      const sh = document.createElement('div')
      sh.style.cssText = `position:absolute;inset:0;background:linear-gradient(180deg,${p.col} 0%,transparent 80%);opacity:0.3`
      b.appendChild(sh)
      w.appendChild(b)
      setTimeout(() => { b.style.height = `${(p.rev / maxV) * maxH}px` }, 400)
    })
  }, [id, projects])
  return <div id={id} style={{ display: 'flex', alignItems: 'flex-end', gap: 7, height: 100, paddingBottom: 20, flexShrink: 0 }} />
}

function DeferredBar({ percent, color }: { percent: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const timer = setTimeout(() => { el.style.width = percent + '%' }, 120)
    return () => clearTimeout(timer)
  }, [percent])
  return (
    <div style={{ flex: 1, height: 4, background: 'var(--b)', borderRadius: 100, overflow: 'hidden', margin: '0 8px' }}>
      <div ref={ref} className="prg-fill" style={{ width: 0, background: color, borderRadius: 100 }} />
    </div>
  )
}

interface ProjectsProps {
  onOpenProject: (p: Project) => void
  onOpenTodoModal: () => void
}

// Active projects = Phase 0+ (not IDEE, PIPELINE, PLANNING, PAUSED)
const ACTIVE = PROJ.filter(p => ['Phase 0','Phase 1','Phase 2','Phase 2+','Phase 3','LIVE'].includes(p.phase))
const DISPLAY = ACTIVE.length > 0 ? ACTIVE : PROJ.slice(0, 4)
const positions: [string, string][] = DISPLAY.length <= 4
  ? [['1/4', '1/2'], ['4/7', '1/2'], ['7/10', '1/2'], ['10/13', '1/2']]
  : DISPLAY.map((_, i) => {
      const cols = Math.min(DISPLAY.length, 6)
      const span = Math.floor(12 / cols)
      const start = 1 + i * span
      const row = i < cols ? '1/2' : '2/3'
      return [`${start}/${start + span}`, row] as [string, string]
    })

export default function Projects({ onOpenProject, onOpenTodoModal }: ProjectsProps) {
  const { toast } = useToast()
  return (
    <>
      {/* Project Cards — row 1 */}
      {DISPLAY.map((p, i) => (
        <Card
          key={p.id}
          title={p.n}
          badge={p.phase}
          badgeClass="bg"
          style={{ gridColumn: positions[i]?.[0] || '1/4', gridRow: positions[i]?.[1] || '1/2' }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexShrink: 0 }}>
            <div style={{ fontSize: 28 }}>{p.e}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--fh)', fontSize: 16, fontWeight: 700, color: p.col }}>{p.n}</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--fm)' }}>{p.dom}</div>
            </div>
            <span className={`bdg ${p.health === 'Live' || p.health === 'Healthy' ? 'bg' : p.health === 'Attention' ? 'ba' : 'br'}`} style={{ fontSize: 10 }}>{p.health}</span>
          </div>

          {/* Big Gauge */}
          <div style={{ textAlign: 'center', marginBottom: 8, flexShrink: 0 }}>
            <Gauge pct={p.pct} color={p.col} size={90} stroke={7} label={p.pct + '%'} sub={p.phase} />
          </div>

          {/* Milestones */}
          <div className="lbl" style={{ marginBottom: 6, flexShrink: 0 }}>Milestones</div>
          <div className="tline-h" style={{ marginBottom: 10, flexShrink: 0 }}>
            {['Konzept', 'Research', 'MVP', 'Testing', 'Launch'].map((ms, mi) => (
              <div key={ms} className={`tl-step${mi < p.phN ? ' done' : mi === p.phN ? ' active' : ''}`}>
                <div className="tl-dot">{mi < p.phN ? '\u2713' : ''}</div>
                <div className="tl-lbl">{ms}</div>
              </div>
            ))}
          </div>

          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 8, flexShrink: 0 }}>
            <div className="sbox"><div className="sbv ta" style={{ fontSize: 18 }}>{p.tkn}K</div><div className="sbl">Tokens</div></div>
            <div className="sbox"><div className="sbv" style={{ fontSize: 18, color: p.col }}>{'\u20ac'}{p.cost.toFixed(2)}</div><div className="sbl">Kosten/Mo</div></div>
            <div className="sbox"><div className="sbv" style={{ fontSize: 18, color: p.term === 'Running' ? 'var(--g)' : p.term === 'Waiting' ? 'var(--a)' : 'var(--t3)' }}>{p.term}</div><div className="sbl">Terminal</div></div>
            <div className="sbox"><div className="sbv tg" style={{ fontSize: 18 }}>{p.rev}K</div><div className="sbl">Rev/Jahr</div></div>
          </div>

          {/* Next Step */}
          <div className="lbl" style={{ marginBottom: 3, flexShrink: 0 }}>Next Step</div>
          <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 8, flexShrink: 0, padding: '6px 8px', background: 'var(--inp)', borderRadius: 8, border: '1px solid var(--b)' }}>{'\u2192'} {p.next}</div>

          {/* Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, flexShrink: 0 }}>
            <button className="abtn p" style={{ margin: 0, fontSize: 11 }} onClick={(e) => { e.stopPropagation(); onOpenProject(p) }}>{'\u25B6'} {'\u00d6'}ffnen</button>
            <button className="abtn s" style={{ margin: 0, fontSize: 11 }} onClick={(e) => { e.stopPropagation(); toast('Deploy ' + p.n + '...') }}>{'\u2197'} Deploy</button>
            <button className="abtn" style={{ margin: 0, fontSize: 10 }} onClick={(e) => { e.stopPropagation(); window.open(`https://${p.dom}`, '_blank') }}>{'\u2197'} Fenster</button>
          </div>
        </Card>
      ))}

      {/* Comparison — col 1/5, row 2/3 */}
      <Card title="Vergleich" badge={`${DISPLAY.length} Projekte`} badgeClass="bb" style={{ gridColumn: '1/5', gridRow: '2/3' }}>
        <div className="lbl" style={{ marginBottom: 5, flexShrink: 0 }}>Fortschritt</div>
        <AnimatedProjectBars id="pr-cmp" projects={DISPLAY} />
      </Card>

      {/* Cost Donut — col 5/8, row 2/3 */}
      <Card title="Kosten" badge="Donut" badgeClass="bp" style={{ gridColumn: '5/8', gridRow: '2/3' }}>
        <div className="lbl" style={{ marginBottom: 5, flexShrink: 0 }}>Kosten Verteilung</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minHeight: 0, justifyContent: 'center' }}>
          <svg width={80} height={80} viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
            <circle fill="none" stroke="rgba(68,153,255,0.55)" strokeWidth={10} strokeDasharray="27 88" strokeDashoffset={0} cx={40} cy={40} r={28} strokeLinecap="round" />
            <circle fill="none" stroke="rgba(0,232,136,0.55)" strokeWidth={10} strokeDasharray="50 88" strokeDashoffset={-27} cx={40} cy={40} r={28} strokeLinecap="round" />
            <circle fill="none" stroke="rgba(0,200,232,0.55)" strokeWidth={10} strokeDasharray="30 88" strokeDashoffset={-77} cx={40} cy={40} r={28} strokeLinecap="round" />
            <circle fill="none" stroke="rgba(255,184,0,0.55)" strokeWidth={10} strokeDasharray="8 88" strokeDashoffset={-107} cx={40} cy={40} r={28} strokeLinecap="round" />
          </svg>
          <div>
            {([
              ['\u{1F3E5} HEB', 'bl', '\u20ac12.50'],
              ['\u{1F3BE} TEN', 'g', '\u20ac22.40'],
              ['\u{1F50D} FND', 'c', '\u20ac14.00'],
              ['\u{1F931} STL', 'a', '\u20ac3.80'],
            ] as const).map(d => (
              <div key={d[0]} className="dr">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: `var(--${d[1]})`, flexShrink: 0 }} />
                <span className="dl" style={{ fontSize: 12 }}>{d[0]}</span>
                <span className={`dval t${d[1]}`} style={{ fontSize: 12 }}>{d[2]}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Revenue Bars — col 8/11, row 2/3 */}
      <Card title="Revenue" badge={'\u20ac1M Prognose'} badgeClass="bg" style={{ gridColumn: '8/11', gridRow: '2/3' }}>
        <div className="lbl" style={{ marginBottom: 5, flexShrink: 0 }}>Umsatz Potenzial</div>
        <AnimatedRevBars id="pr-rev" projects={DISPLAY} />
      </Card>

      {/* Timeline — col 11/13, row 2/3 */}
      <Card title="Timeline" badge="2025" badgeClass="bb" style={{ gridColumn: '11/13', gridRow: '2/3' }}>
        <div className="lbl" style={{ marginBottom: 10, flexShrink: 0 }}>Launch Timeline 2025</div>
        <div style={{ position: 'relative', paddingTop: 20, flex: 1, minHeight: 0 }}>
          <div style={{ position: 'absolute', top: 20, left: 0, right: 0, height: 2, background: 'var(--b)' }} />
          <div style={{ position: 'absolute', top: 20, left: 0, width: '72%', height: 2, background: 'linear-gradient(90deg,var(--bl),var(--c),var(--g))' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 28 }}>
            {([
              ['\u{1F50D} FindeMeine', 'c', 'LIVE'],
              ['\u{1F3BE} TennisCoach', 'g', 'April'],
              ['\u{1F3E5} Hebamme', 'bl', 'Juni'],
              ['\u{1F931} Stillpr.', 'a', 'August'],
            ] as const).map(t => (
              <div key={t[0]} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: `var(--${t[1]})` }}>{t[0]}</div>
                <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 3 }}>{t[2]}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Actions — col 1/5, row 3/4 */}
      <Card title="Actions" badge="Projekte" badgeClass="bo" style={{ gridColumn: '1/5', gridRow: '3/4' }}>
        <button className="abtn s" onClick={() => toast('TennisCoach Deploy gestartet...')}>{'\u2197'} TennisCoach {'\u2192'} Deploy</button>
        <button className="abtn p" onClick={() => onOpenTodoModal()}>+ Neues Todo</button>
        <button className="abtn" onClick={() => toast('Projekt-Briefing wird generiert...')}>{'\u2600'} Projekt-Briefing</button>
      </Card>

      {/* Todos per Project — col 5/13, row 3/4 */}
      <Card title="Todos pro Projekt" badge={`${DISPLAY.reduce((s, p) => s + p.todos, 0)} total`} badgeClass="ba" style={{ gridColumn: '5/13', gridRow: '3/4' }}>
        <div className="lbl" style={{ marginBottom: 6, flexShrink: 0 }}>Todos / Projekt</div>
        {DISPLAY.map(p => (
          <div key={p.id} className="dr">
            <span className="dl" style={{ fontSize: 12 }}>{p.e} {p.n}</span>
            <DeferredBar percent={p.todos * 25} color={p.col} />
            <span className="dval" style={{ fontSize: 12, color: p.col }}>{p.todos}</span>
          </div>
        ))}
      </Card>
    </>
  )
}
