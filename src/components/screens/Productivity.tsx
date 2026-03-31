import { useEffect, useRef } from 'react'
import Card from '../ui/Card'
import Gauge from '../ui/Gauge'
import { PROJ } from '../../lib/data'

function DeferredBar8({ percent, color }: { percent: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const timer = setTimeout(() => { el.style.width = percent + '%' }, 120)
    return () => clearTimeout(timer)
  }, [percent])
  return (
    <div style={{ height: 8, background: 'var(--b)', borderRadius: 100, overflow: 'hidden' }}>
      <div ref={ref} className="prg-fill" style={{ width: 0, height: '100%', borderRadius: 100, background: color }} />
    </div>
  )
}

export default function Productivity() {
  const wv: [number, boolean][] = [[6.5, false], [8.2, false], [5.1, false], [8.8, false], [7.4, false], [3.2, false], [7.2, true]]
  const wl = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
  const hrs = [3.2, 0.5, 2.8, 0.7]

  return (
    <>
      {/* Arbeitsstunden — col 1/5, row 1/2 */}
      <Card title="Arbeitsstunden" badge="Heute 7.2h" badgeClass="bg" style={{ gridColumn: '1/5', gridRow: '1/2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <Gauge pct={72} color="var(--c)" size={86} stroke={7} label="72%" sub="Aktiv" />
            <div>
              <div style={{ fontFamily: 'var(--fh)', fontSize: 56, fontWeight: 800, color: 'var(--c)', lineHeight: 1 }}>7.2</div>
              <div style={{ fontSize: 14, color: 'var(--t3)' }}>Stunden heute</div>
            </div>
          </div>
          <div className="dv" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, flexShrink: 0 }}>
            {([['38.5h', 'Diese Woche', 'g'], ['142h', 'Dieser Monat', 'a'], ['87', 'Effizienz', 'c']] as const).map(s => (
              <div key={s[1]} className="sbox">
                <div style={{ fontFamily: 'var(--fh)', fontSize: 26, fontWeight: 800, color: `var(--${s[2]})`, lineHeight: 1 }}>{s[0]}</div>
                <div className="sbl" style={{ marginTop: 5 }}>{s[1]}</div>
              </div>
            ))}
          </div>
          <div className="dv" />
          <div className="lbl" style={{ marginBottom: 6, flexShrink: 0 }}>Arbeitsstunden diese Woche</div>
          <svg viewBox="0 0 180 48" width="100%" height={48} style={{ flexShrink: 0 }}>
            <defs>
              <linearGradient id="wk-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,200,232,0.35)" />
                <stop offset="100%" stopColor="rgba(0,200,232,0)" />
              </linearGradient>
            </defs>
            {wv.map((d, i) => {
              const h = (d[0] / 8.8 * 38).toFixed(1)
              const x = (i * 25.7 + 1).toFixed(1)
              return (
                <g key={i}>
                  <rect x={x} y={48 - Number(h)} width={22} height={Number(h)} fill={d[1] ? 'rgba(0,200,232,0.5)' : 'rgba(0,200,232,0.18)'} rx={3} />
                  <text x={(i * 25.7 + 12).toFixed(1)} y={46} textAnchor="middle" fontSize={7} fill={d[1] ? 'rgba(0,200,232,0.9)' : 'rgba(255,255,255,0.25)'}>{wl[i]}</text>
                </g>
              )
            })}
          </svg>
        </div>
      </Card>

      {/* Prompt Trend — col 5/8, row 1/2 */}
      <Card title="Prompt Trend" badge="30 Tage" badgeClass="bb" style={{ gridColumn: '5/8', gridRow: '1/2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--fh)', fontSize: 52, fontWeight: 800, color: 'var(--t1)', lineHeight: 1 }}>156</div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--t3)' }}>Prompts heute</div>
              <div style={{ fontSize: 12, color: 'var(--g)' }}>{'\u2191'} +17% vs {'\u00d8'}</div>
            </div>
          </div>
          <div className="dv" />
          <div className="lbl" style={{ marginBottom: 5, flexShrink: 0 }}>30-Tage Verlauf</div>
          <svg viewBox="0 0 180 44" width="100%" height={44} style={{ flexShrink: 0 }}>
            {[120, 145, 98, 167, 203, 234, 178, 145, 189, 212, 156, 134, 178, 192, 168, 145, 134, 189, 203, 178, 145, 167, 189, 212, 198, 178, 156, 145, 189, 156].map((v, i) => {
              const h = (v / 234 * 40).toFixed(1)
              const x = (i * 6).toFixed(1)
              return <rect key={i} x={x} y={44 - Number(h)} width={5} fill={`rgba(0,200,232,${i === 29 ? '0.7' : '0.22'})`} height={Number(h)} rx={1} />
            })}
          </svg>
          <div className="dv" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flexShrink: 0 }}>
            {([['134', 'Tages-\u00d8', 't2'], ['4.680', 'Gesamt', 'a']] as const).map(s => (
              <div key={s[1]} className="sbox">
                <div style={{ fontFamily: 'var(--fh)', fontSize: 22, fontWeight: 800, color: `var(--${s[2]})`, lineHeight: 1 }}>{s[0]}</div>
                <div className="sbl" style={{ marginTop: 4 }}>{s[1]}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Fokus-Verteilung — col 8/11, row 1/2 */}
      <Card title="Fokus-Verteilung" badge="Heute" badgeClass="bp" style={{ gridColumn: '8/11', gridRow: '1/2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 8 }}>
          <div className="lbl" style={{ flexShrink: 0 }}>Fokus-Verteilung Heute</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minHeight: 0, justifyContent: 'center' }}>
            <svg width={110} height={110} viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
              <circle fill="none" stroke="rgba(0,232,136,0.55)" strokeWidth={13} strokeDasharray="44 88" strokeDashoffset={0} cx={55} cy={55} r={34} strokeLinecap="round" />
              <circle fill="none" stroke="rgba(68,153,255,0.55)" strokeWidth={13} strokeDasharray="29 88" strokeDashoffset={-44} cx={55} cy={55} r={34} strokeLinecap="round" />
              <circle fill="none" stroke="rgba(255,184,0,0.55)" strokeWidth={13} strokeDasharray="21 88" strokeDashoffset={-73} cx={55} cy={55} r={34} strokeLinecap="round" />
              <circle fill="none" stroke="rgba(187,136,255,0.55)" strokeWidth={13} strokeDasharray="14 88" strokeDashoffset={-94} cx={55} cy={55} r={34} strokeLinecap="round" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {([['Projekte', 'g', '40%', '2.88h'], ['Code', 'bl', '27%', '1.94h'], ['Research', 'a', '19%', '1.37h'], ['Briefing', 'p', '14%', '1.01h']] as const).map(d => (
                <div key={d[0]} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: `var(--${d[1]})`, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--t2)', flex: 1 }}>{d[0]}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--fh)', fontSize: 16, fontWeight: 700, color: `var(--${d[1]})` }}>{d[2]}</div>
                    <div style={{ fontSize: 9, color: 'var(--t4)' }}>{d[3]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Screen & Aktivität — col 11/13, row 1/2 */}
      <Card title="Screen & Aktivität" badge="Heute" badgeClass="ba" style={{ gridColumn: '11/13', gridRow: '1/2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 8 }}>
          <div style={{ fontFamily: 'var(--fh)', fontSize: 46, fontWeight: 800, color: 'var(--t1)', lineHeight: 1, flexShrink: 0 }}>6h 12m</div>
          <div style={{ fontSize: 13, color: 'var(--t3)', flexShrink: 0 }}>Bildschirmzeit heute</div>
          <div className="dv" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flexShrink: 0 }}>
            {([['2.847', 'Klicks', 'c'], ['4', 'Projekte', 'g'], ['3', 'Apps', 'a'], ['1', 'Idee', 'p']] as const).map(s => (
              <div key={s[1]} className="sbox">
                <div style={{ fontFamily: 'var(--fh)', fontSize: 26, fontWeight: 800, color: `var(--${s[2]})`, lineHeight: 1 }}>{s[0]}</div>
                <div className="sbl" style={{ marginTop: 4 }}>{s[1]}</div>
              </div>
            ))}
          </div>
          <div className="dv" />
          <div className="lbl" style={{ marginBottom: 5, flexShrink: 0 }}>Screen-Zeit Woche</div>
          <svg viewBox="0 0 140 32" width="100%" height={32} style={{ flexShrink: 0 }}>
            {[5.5, 7.2, 4.8, 8.1, 6.9, 3.4, 6.2].map((v, i) => {
              const h = (v / 8.1 * 28).toFixed(1)
              const x = (i * 20).toFixed(1)
              return <rect key={i} x={x} y={32 - Number(h)} width={17} height={Number(h)} fill={`rgba(0,200,232,${i === 6 ? '0.5' : '0.18'})`} rx={2} />
            })}
          </svg>
        </div>
      </Card>

      {/* Kosten-Effizienz — col 1/6, row 2/3 */}
      <Card title="Kosten-Effizienz" badge={'\u2193 Besser'} badgeClass="bg" style={{ gridColumn: '1/6', gridRow: '2/3' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--fh)', fontSize: 46, fontWeight: 800, color: 'var(--g)', lineHeight: 1 }}>1.847</div>
            <div style={{ fontSize: 13, color: 'var(--t3)' }}>Token/Todo</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--g)' }}>{'\u2193'} 16% besser als {'\u00d8'} (2.210)</div>
          <div className="dv" />
          <div className="lbl" style={{ marginBottom: 5, flexShrink: 0 }}>Effizienz-Trend 30 Tage</div>
          <svg viewBox="0 0 200 46" width="100%" height={46} style={{ flexShrink: 0 }}>
            <defs>
              <linearGradient id="eff-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,232,136,0.2)" />
                <stop offset="100%" stopColor="rgba(0,232,136,0)" />
              </linearGradient>
            </defs>
            <polygon points="0,40 20,36 40,38 60,26 80,30 100,20 120,24 140,14 160,17 180,10 200,13 200,46 0,46" fill="url(#eff-g)" />
            <polyline points="0,40 20,36 40,38 60,26 80,30 100,20 120,24 140,14 160,17 180,10 200,13" fill="none" stroke="var(--g)" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={200} cy={13} r={4} fill="var(--g)" />
          </svg>
          <div className="dv" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, flexShrink: 0 }}>
            {([['\u20ac0.08', 'Pro Prompt', 'a'], ['87%', 'Nutzung', 'c'], ['4.7K', 'Prompts Mo.', 'g']] as const).map(s => (
              <div key={s[1]} className="sbox">
                <div style={{ fontFamily: 'var(--fh)', fontSize: 18, fontWeight: 800, color: `var(--${s[2]})`, lineHeight: 1 }}>{s[0]}</div>
                <div className="sbl" style={{ marginTop: 4 }}>{s[1]}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Zeit pro Projekt — col 6/13, row 2/3 */}
      <Card title="Zeit pro Projekt" badge="Heute" badgeClass="bb" style={{ gridColumn: '6/13', gridRow: '2/3' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 8 }}>
          <div className="lbl" style={{ flexShrink: 0 }}>Zeit pro Projekt heute</div>
          {PROJ.map((p, pi) => {
            const h = hrs[pi]
            const pct = Math.round(h / 3.2 * 100)
            return (
              <div key={p.id} style={{ flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{p.e} {p.n}</span>
                  <span style={{ fontFamily: 'var(--fh)', fontSize: 24, fontWeight: 800, color: p.col }}>{h}h</span>
                </div>
                <DeferredBar8 percent={pct} color={`linear-gradient(90deg,rgba(${p.cr},0.4),${p.col})`} />
              </div>
            )
          })}
          <div className="dv" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flexShrink: 0 }}>
            {([['7.2h', 'Gesamt heute', 't1'], ['HEB', 'Meiste Zeit', 'c']] as const).map(s => (
              <div key={s[1]} className="sbox">
                <div style={{ fontFamily: 'var(--fh)', fontSize: 20, fontWeight: 800, color: `var(--${s[2]})`, lineHeight: 1 }}>{s[0]}</div>
                <div className="sbl" style={{ marginTop: 4 }}>{s[1]}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  )
}
