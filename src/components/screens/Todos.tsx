import { useEffect, useRef } from 'react'
import Card from '../ui/Card'
import Gauge from '../ui/Gauge'
import { PROJ, TODOS } from '../../lib/data'

function DeferredBar({ percent, color }: { percent: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const timer = setTimeout(() => { el.style.width = percent + '%' }, 120)
    return () => clearTimeout(timer)
  }, [percent])
  return (
    <div className="prg-bar" style={{ height: 7 }}>
      <div ref={ref} className="prg-fill" style={{ width: 0, background: color }} />
    </div>
  )
}

function AnimatedWeekBars({ id }: { id: string }) {
  useEffect(() => {
    const w = document.getElementById(id)
    if (!w) return
    w.innerHTML = ''
    const vals = [5, 3, 7, 4, 6, 2, 3]
    const labs = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
    const maxV = Math.max(...vals)
    const maxH = 72
    const hiIdx = 2
    vals.forEach((v, i) => {
      const isHi = i === hiIdx
      const b = document.createElement('div')
      b.style.cssText = `flex:1;height:0;border-radius:3px 3px 0 0;position:relative;overflow:hidden;transition:height 1.5s ${i * 0.09}s ease;background:rgba(0,200,232,${isHi ? '0.32' : '0.12'});border:1px solid rgba(0,200,232,${isHi ? '0.6' : '0.22'});border-bottom:none${isHi ? ';box-shadow:0 0 14px rgba(0,200,232,0.25)' : ''}`
      const l = document.createElement('div')
      l.style.cssText = `position:absolute;bottom:-15px;left:0;right:0;text-align:center;font-size:8px;font-weight:700;color:${isHi ? 'var(--c)' : 'var(--t4)'}`
      l.textContent = labs[i]
      b.appendChild(l)
      if (isHi) {
        const sh = document.createElement('div')
        sh.style.cssText = 'position:absolute;inset:0;background:linear-gradient(180deg,var(--c) 0%,transparent 100%);opacity:0.35'
        b.appendChild(sh)
      }
      w.appendChild(b)
      setTimeout(() => { b.style.height = `${(v / maxV) * maxH}px` }, 400)
    })
  }, [id])
  return <div id={id} style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 72, paddingBottom: 18, flexShrink: 0 }} />
}

export default function Todos() {
  const openTodos = TODOS.filter(t => !t.done)
  const nextTodo = openTodos.find(t => !t.ov) || TODOS[0]
  const nextProj = PROJ.find(p => p.id === nextTodo.proj) || { n: 'Kein Projekt', e: '', col: 'var(--t1)', cr: '255,255,255' }

  return (
    <>
      {/* Todo Stats — col 1/4, row 1/2 */}
      <Card title="Todo Stats" badge="67% Rate" badgeClass="bg" style={{ gridColumn: '1/4', gridRow: '1/2' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10, flexShrink: 0 }}>
          <Gauge pct={67} color="var(--g)" size={88} stroke={7} label="67%" sub="Done" />
          <div>
            <div style={{ fontFamily: 'var(--fh)', fontSize: 44, fontWeight: 800, color: 'var(--g)', lineHeight: 1 }}>67%</div>
            <div style={{ fontSize: 14, color: 'var(--t3)' }}>Completion Rate</div>
            <div style={{ fontSize: 13, color: 'var(--a)', marginTop: 6 }}>{'\u{1F525}'} Streak: 7 Tage</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6, flexShrink: 0 }}>
          {([['6', 'Offen', 'a'], ['1', '\u00dcberf\u00e4llig', 'r'], ['3', 'Heute', 'c'], ['12', 'Erledigt', 'g']] as const).map(s => (
            <div key={s[1]} className="sbox"><div className={`sbv t${s[2]}`} style={{ fontSize: 22 }}>{s[0]}</div><div className="sbl">{s[1]}</div></div>
          ))}
        </div>
      </Card>

      {/* Prioritäten & Verlauf — col 4/7, row 1/2 */}
      <Card title="Prioritäten & Verlauf" badge="7 Tage" badgeClass="ba" style={{ gridColumn: '4/7', gridRow: '1/2' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10, flexShrink: 0 }}>
          <svg width={80} height={80} viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
            <circle fill="none" stroke="rgba(255,68,102,0.55)" strokeWidth={10} strokeDasharray="35 88" strokeDashoffset={0} cx={40} cy={40} r={28} strokeLinecap="round" />
            <circle fill="none" stroke="rgba(255,184,0,0.55)" strokeWidth={10} strokeDasharray="29 88" strokeDashoffset={-35} cx={40} cy={40} r={28} strokeLinecap="round" />
            <circle fill="none" stroke="rgba(0,232,136,0.55)" strokeWidth={10} strokeDasharray="24 88" strokeDashoffset={-64} cx={40} cy={40} r={28} strokeLinecap="round" />
          </svg>
          <div>
            {([['Hoch', 'r', '3'], ['Mittel', 'a', '2'], ['Niedrig', 'g', '1']] as const).map(p => (
              <div key={p[0]} className="dr">
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: `var(--${p[1]})`, flexShrink: 0 }} />
                <span className="dl" style={{ fontSize: 13 }}>{p[0]}</span>
                <span style={{ fontFamily: 'var(--fh)', fontSize: 18, fontWeight: 700, color: `var(--${p[1]})` }}>{p[2]}</span>
              </div>
            ))}
          </div>
        </div>
        <AnimatedWeekBars id="td-wk" />
      </Card>

      {/* Nächster Schritt — col 7/10, row 1/2 */}
      <Card title="Nächster Schritt" badge="Jetzt" badgeClass="bg" style={{ gridColumn: '7/10', gridRow: '1/2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 8 }}>
          <div className="lbl" style={{ flexShrink: 0 }}>Nächstes Todo</div>
          <div style={{ fontFamily: 'var(--fh)', fontSize: 22, fontWeight: 800, color: 'var(--t1)', lineHeight: 1.25, flexShrink: 0 }}>{nextTodo.txt}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 16 }}>{nextProj.e}</span>
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>{nextProj.n}</span>
            <span className={`bdg ${nextTodo.ov ? 'br' : 'ba'}`} style={{ marginLeft: 'auto' }}>{'\u{1F4C5}'} {nextTodo.due}</span>
          </div>
          <div className="dv" />
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
            <div style={{ background: 'rgba(0,232,136,0.08)', border: '1px solid rgba(0,232,136,0.25)', borderRadius: 12, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--g)', marginBottom: 3 }}>{'\u2B21'} KANI Empfehlung</div>
              <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5 }}>Direkt starten — höchste Revenue-Auswirkung. TennisCoach wartet auf diesen Schritt für Go-Live.</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button className="abtn s" style={{ flex: 1, margin: 0, fontSize: 12, padding: 10 }} onClick={() => alert('\u2713 Erledigt!')}>{'\u2713'} Erledigt</button>
            <button className="abtn" style={{ flex: 1, margin: 0, fontSize: 12, padding: 10 }} onClick={() => alert('Delegiert')}>{'\u2192'} Delegieren</button>
          </div>
        </div>
      </Card>

      {/* Pro Projekt — col 10/13, row 1/2 */}
      <Card title="Pro Projekt" badge="Verteilung" badgeClass="bp" style={{ gridColumn: '10/13', gridRow: '1/2' }}>
        <div className="lbl" style={{ marginBottom: 8, flexShrink: 0 }}>Todos pro Projekt</div>
        {PROJ.map(p => {
          const cnt = TODOS.filter(t => t.proj === p.id && !t.done).length
          const done = TODOS.filter(t => t.proj === p.id && t.done).length
          const rate = cnt + done > 0 ? Math.round(done / (cnt + done) * 100) : 0
          return (
            <div key={p.id} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{p.e} {p.n}</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="bdg ba" style={{ fontSize: 10 }}>{cnt} offen</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: p.col }}>{rate}%</span>
                </div>
              </div>
              <DeferredBar percent={rate} color={`linear-gradient(90deg,rgba(${p.cr},0.4),${p.col})`} />
            </div>
          )
        })}
      </Card>

      {/* Alle Todos — col 1/7, row 2/3 */}
      <Card title="Alle Todos" badge="9 Gesamt" badgeClass="ba" style={{ gridColumn: '1/7', gridRow: '2/3' }}>
        <div className="frow">
          {['Alle', 'Heute', '\u00dcberf\u00e4llig', 'Diese Woche', 'Erledigt'].map((f, i) => (
            <span key={f} className={`fpill${i === 0 ? ' act' : ''}`}>{f}</span>
          ))}
        </div>
        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {TODOS.map(t => {
            const pn = PROJ.find(p => p.id === t.proj) || { n: '', e: '', col: 'var(--t1)' }
            return (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px', borderRadius: 10, background: 'var(--inp)', border: `1px solid ${t.ov ? 'rgba(255,68,102,0.3)' : 'var(--b)'}`, transition: 'all 0.18s' }}>
                <input type="checkbox" defaultChecked={t.done} style={{ accentColor: 'var(--c)', width: 14, height: 14, flexShrink: 0 }} readOnly />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--t1)', ...(t.done ? { textDecoration: 'line-through', opacity: 0.4 } : {}) }}>{t.txt}</div>
                  {t.proj && <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 1 }}>{pn.e} {pn.n}</div>}
                </div>
                <span className={`bdg ${t.prio === 'h' ? 'br' : t.prio === 'm' ? 'ba' : 'bg'}`} style={{ fontSize: 9 }}>{t.due}</span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Completion / Projekt — col 7/13, row 2/4 */}
      <Card title="Completion / Projekt" badge="Stats" badgeClass="bg" style={{ gridColumn: '7/13', gridRow: '2/4' }}>
        <div className="lbl" style={{ marginBottom: 8, flexShrink: 0 }}>Completion Rate / Projekt</div>
        {PROJ.map(p => {
          const op = TODOS.filter(t => t.proj === p.id && !t.done).length
          const dn = TODOS.filter(t => t.proj === p.id && t.done).length
          const rt = op + dn > 0 ? Math.round(dn / (op + dn) * 100) : 0
          return (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--inp)', border: '1px solid var(--b)', borderRadius: 10, marginBottom: 5 }}>
              <span style={{ fontSize: 18 }}>{p.e}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{p.n}</div>
                <div style={{ fontSize: 10, color: 'var(--t3)' }}>{op} offen · {dn} done</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--fh)', fontSize: 20, fontWeight: 700, color: p.col }}>{rt}%</div>
              </div>
            </div>
          )
        })}
      </Card>

      {/* Actions — col 1/7, row 3/4 */}
      <Card title="Actions" badge="Todos" badgeClass="bo" style={{ gridColumn: '1/7', gridRow: '3/4' }}>
        <button className="abtn p" onClick={() => alert('Neues Todo anlegen')}>+ Neues Todo anlegen</button>
        <button className="abtn" onClick={() => alert('Archiviert')}>{'\u{1F4E6}'} Erledigte archivieren</button>
        <button className="abtn" onClick={() => alert('Exportiert...')}>{'\u2193'} Todos exportieren</button>
      </Card>
    </>
  )
}
