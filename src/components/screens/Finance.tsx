import { useEffect, useRef } from 'react'
import Card from '../ui/Card'
import Gauge from '../ui/Gauge'
import { PROJ } from '../../lib/data'

function DeferredBar({ percent, color }: { percent: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const timer = setTimeout(() => { el.style.width = percent + '%' }, 120)
    return () => clearTimeout(timer)
  }, [percent])
  return (
    <div className="prg-bar" style={{ height: 5 }}>
      <div ref={ref} className="prg-fill" style={{ width: 0, background: color, borderRadius: 100 }} />
    </div>
  )
}

function DeferredBar8({ percent, color }: { percent: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const timer = setTimeout(() => { el.style.width = percent + '%' }, 120)
    return () => clearTimeout(timer)
  }, [percent])
  return (
    <div className="prg-bar" style={{ height: 8 }}>
      <div ref={ref} className="prg-fill" style={{ width: 0, background: color }} />
    </div>
  )
}

function DeferredBar6({ percent, color }: { percent: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const timer = setTimeout(() => { el.style.width = percent + '%' }, 120)
    return () => clearTimeout(timer)
  }, [percent])
  return (
    <div style={{ height: 6, background: 'var(--b)', borderRadius: 100, overflow: 'hidden' }}>
      <div ref={ref} className="prg-fill" style={{ width: 0, height: '100%', borderRadius: 100, background: color }} />
    </div>
  )
}

function AnimatedDailyBars({ id }: { id: string }) {
  useEffect(() => {
    const w = document.getElementById(id)
    if (!w) return
    w.innerHTML = ''
    const vals = [1.2, 2.8, 1.9, 3.4, 2.1, 4.2, 2.73]
    const labs = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'H']
    const maxV = 4.2
    const maxH = 44
    vals.forEach((v, i) => {
      const isLast = i === 6
      const b = document.createElement('div')
      b.style.cssText = `flex:1;height:0;border-radius:3px 3px 0 0;position:relative;transition:height 1.5s ${i * 0.09}s ease;background:rgba(255,184,0,${isLast ? '0.32' : '0.18'});border:1px solid rgba(255,184,0,${isLast ? '0.6' : '0.28'});border-bottom:none`
      const l = document.createElement('div')
      l.style.cssText = `position:absolute;bottom:-14px;left:0;right:0;text-align:center;font-size:8px;color:${isLast ? 'var(--a)' : 'var(--t4)'}`
      l.textContent = labs[i]
      b.appendChild(l)
      const vl = document.createElement('div')
      vl.style.cssText = `position:absolute;top:-14px;left:0;right:0;text-align:center;font-size:8px;font-weight:700;color:var(--a);opacity:${isLast ? '1' : '0'}`
      vl.textContent = '\u20ac' + v.toFixed(2)
      b.appendChild(vl)
      w.appendChild(b)
      setTimeout(() => { b.style.height = `${(v / maxV) * maxH}px` }, 400)
    })
  }, [id])
  return <div id={id} style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 54, paddingBottom: 18, flexShrink: 0 }} />
}

const breakdown: [string, string, string, number][] = [
  ['Claude API', '\u20ac31.20', 'bl', 66],
  ['Supabase', '\u20ac9.00', 'g', 19],
  ['Vercel', '\u20ac0.00', 't3', 0],
  ['Resend', '\u20ac4.50', 'p', 10],
  ['Google WS', '\u20ac3.60', 'a', 8],
  ['Domains', '\u20ac1.80', 'o', 4],
  ['Figma', '\u20ac0.00', 't3', 0],
  ['Stripe', '\u20ac2.68', 'c', 6],
]

export default function Finance() {
  return (
    <>
      {/* Token & Kosten Hero — col 1/5, row 1/2 */}
      <Card title="Token & Kosten" badge="35% Budget" badgeClass="bb" style={{ gridColumn: '1/5', gridRow: '1/2' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 10, flexShrink: 0 }}>
          <Gauge pct={35} color="var(--c)" size={88} stroke={7} label="35%" sub="Token" />
          <div>
            <div style={{ fontFamily: 'var(--fh)', fontSize: 46, fontWeight: 800, color: 'var(--c)', lineHeight: 1 }}>175K</div>
            <div style={{ fontSize: 14, color: 'var(--t3)' }}>/ 500K · Reset in 18 Tagen</div>
            <div className="dv" />
            <div style={{ display: 'flex', gap: 10 }}>
              {([['24K', 'Heute', 'c'], ['87K', 'Woche', 'g'], ['428K', 'Total', 'a']] as const).map(s => (
                <div key={s[1]}>
                  <div style={{ fontFamily: 'var(--fh)', fontSize: 16, fontWeight: 700, color: `var(--${s[2]})` }}>{s[0]}</div>
                  <div style={{ fontSize: 9, color: 'var(--t3)' }}>{s[1]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ fontFamily: 'var(--fh)', fontSize: 40, fontWeight: 800, color: 'var(--a)', lineHeight: 1, marginBottom: 4 }}>{'\u20ac'}52.78</div>
        <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 10 }}>Monatskosten · Prognose: {'\u20ac'}78.50</div>
        <AnimatedDailyBars id="fi-daily" />
      </Card>

      {/* Cost Breakdown — col 5/9, row 1/2 */}
      <Card title="Cost Breakdown" badge="8 Services" badgeClass="ba" style={{ gridColumn: '5/9', gridRow: '1/2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
          {breakdown.map(b => (
            <div key={b[0]}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--t2)' }}>{b[0]}</span>
                <span style={{ fontSize: 12, fontFamily: 'var(--fm)', fontWeight: 600, color: `var(--${b[2]})` }}>{b[1]}</span>
              </div>
              <DeferredBar percent={b[3]} color={`linear-gradient(90deg,rgba(0,200,232,0.4),var(--${b[2]}))`} />
            </div>
          ))}
        </div>
      </Card>

      {/* 7-Tage Trend — col 9/13, row 1/2 */}
      <Card title="7-Tage Trend" badge={'\u2191'} badgeClass="ba" style={{ gridColumn: '9/13', gridRow: '1/2' }}>
        <div style={{ fontFamily: 'var(--fh)', fontSize: 28, fontWeight: 700, color: 'var(--a)', marginBottom: 4 }}>{'\u20ac'}4.20</div>
        <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 8 }}>Gestern · {'\u00d8'} {'\u20ac'}2.89/Tag</div>
        <svg viewBox="0 0 120 48" style={{ width: '100%', height: 52, flexShrink: 0 }}>
          <defs>
            <linearGradient id="fg2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,184,0,0.18)" />
              <stop offset="100%" stopColor="rgba(255,184,0,0)" />
            </linearGradient>
          </defs>
          <polygon points="0,42 17,34 34,38 51,22 68,29 85,14 102,19 120,9 120,48 0,48" fill="url(#fg2)" />
          <polyline points="0,42 17,34 34,38 51,22 68,29 85,14 102,19 120,9" fill="none" stroke="var(--a)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={120} cy={9} r={4} fill="var(--a)" />
        </svg>
        <div className="dv" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, flexShrink: 0 }}>
          <div className="sbox"><div className="sbv ta" style={{ fontSize: 20 }}>{'\u20ac'}78</div><div className="sbl">Prognose Mo.</div></div>
          <div className="sbox"><div className="sbv tg" style={{ fontSize: 20 }}>OK</div><div className="sbl">Plan $100</div></div>
        </div>
      </Card>

      {/* Revenue — col 1/5, row 2/4 */}
      <Card title="Revenue" badge={'\u20ac1M Prognose'} badgeClass="bg" style={{ gridColumn: '1/5', gridRow: '2/4' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--fh)', fontSize: 48, fontWeight: 800, color: 'var(--g)', lineHeight: 1 }}>{'\u20ac'}3K</div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--t3)' }}>Live Revenue / Mo</div>
              <div style={{ fontSize: 11, color: 'var(--g)' }}>FindeMeine</div>
            </div>
          </div>
          <div className="dv" />
          <div className="lbl" style={{ flexShrink: 0 }}>Prognose nach Launch</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, justifyContent: 'center' }}>
            {PROJ.map(p => (
              <div key={p.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{p.e} {p.n}</span>
                  <span style={{ fontFamily: 'var(--fh)', fontSize: 18, fontWeight: 700, color: p.col }}>{'\u20ac'}{p.rev}K</span>
                </div>
                <DeferredBar6 percent={Math.round(p.rev / 600 * 100)} color={`linear-gradient(90deg,rgba(${p.cr},0.4),${p.col})`} />
              </div>
            ))}
          </div>
          <div className="dv" />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--fh)', fontSize: 28, fontWeight: 800, color: 'var(--g)' }}>{'\u20ac'}1.056M</div>
            <div style={{ fontSize: 12, color: 'var(--t3)' }}>/Jahr · Break-Even Juni</div>
          </div>
        </div>
      </Card>

      {/* Kosten / Projekt — col 5/9, row 2/4 */}
      <Card title="Kosten / Projekt" badge="Breakdown" badgeClass="bp" style={{ gridColumn: '5/9', gridRow: '2/4' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 0 }}>
          <div className="lbl" style={{ marginBottom: 8, flexShrink: 0 }}>Kosten pro Projekt</div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
            {PROJ.map(p => {
              const pct = Math.round(p.cost / 52.78 * 100)
              return (
                <div key={p.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{p.e} {p.n}</span>
                    <span style={{ fontFamily: 'var(--fh)', fontSize: 22, fontWeight: 700, color: p.col }}>{'\u20ac'}{p.cost.toFixed(2)}</span>
                  </div>
                  <DeferredBar8 percent={pct} color={`linear-gradient(90deg,rgba(${p.cr},0.4),${p.col})`} />
                </div>
              )
            })}
          </div>
          <div className="dv" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 13, color: 'var(--t2)' }}>Gesamt</span>
            <span style={{ fontFamily: 'var(--fh)', fontSize: 26, fontWeight: 800, color: 'var(--a)' }}>{'\u20ac'}52.78</span>
          </div>
        </div>
      </Card>

      {/* Spar-Optionen — col 9/13, row 2/3 */}
      <Card title="Spar-Optionen" badge="bis -60%" badgeClass="ba" style={{ gridColumn: '9/13', gridRow: '2/3' }}>
        <div className="lbl" style={{ marginBottom: 6, flexShrink: 0 }}>Spar-Optionen</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
          {([
            ['\u26A1 Haiku für Simple Tasks', '-60%', 'g'],
            ['\u{1F4E6} Batch-Prompts', '-25%', 'g'],
            ['\u{1F504} Sonnet statt Opus', '-40%', 'c'],
            ['\u{1F4BE} Cache-Hit', '-15%', 'a'],
          ] as const).map(s => (
            <div key={s[0]} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--inp)', border: '1px solid var(--b)', borderRadius: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--t2)' }}>{s[0]}</span>
              <span className={`bdg b${s[2]}`} style={{ fontSize: 11 }}>{s[1]}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions — col 9/13, row 3/4 */}
      <Card title="Actions" badge="Finanzen" badgeClass="bo" style={{ gridColumn: '9/13', gridRow: '3/4' }}>
        <button className="abtn p" onClick={() => alert('Plan Upgrade $200')}>{'\u2191'} Upgrade Max $200</button>
        <button className="abtn w" onClick={() => alert('Budget-Alarm gesetzt')}>{'\u2691'} Budget-Alarm</button>
        <button className="abtn" onClick={() => alert('CSV exportiert...')}>{'\u2193'} Kosten-Report</button>
        <button className="abtn" onClick={() => alert('Stripe öffnet...')}>{'\u{1F4B3}'} Stripe Dashboard</button>
      </Card>
    </>
  )
}
