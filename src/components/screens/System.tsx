import { useEffect, useRef, useState } from 'react'
import Card from '../ui/Card'
import Gauge from '../ui/Gauge'

export default function System() {
  const logRef = useRef<HTMLDivElement>(null)
  const [sessionTime, setSessionTime] = useState('03:24:17')
  const [clicks, setClicks] = useState(2847)

  // Session timer
  useEffect(() => {
    const start = Date.now() - ((3 * 3600 + 24 * 60 + 17) * 1000)
    const id = setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000)
      const h = Math.floor(s / 3600)
      const m = Math.floor((s % 3600) / 60)
      const sc = s % 60
      setSessionTime(`${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${sc < 10 ? '0' : ''}${sc}`)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // Click counter
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.7) setClicks(c => c + 1)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  // Live system log
  useEffect(() => {
    const LMSGS = ['KANI context optimiert \u00b7 8K frei', 'Token Rate: 24K/h', 'MCP Supabase: 4ms \u25cf', 'Claude API: 340ms avg', 'Memory snapshot saved', 'GitHub Actions: passing \u2713', 'Vercel preview deployed', 'Resend: 3 emails sent', 'FindeMeine: +3 neue User', 'TennisCoach: Deploy bereit']
    const cols = ['var(--g)', 'var(--bl)', 'var(--c)', 'var(--a)']
    let li = 0
    const id = setInterval(() => {
      const c = logRef.current
      if (!c) return
      const t = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
      const el = document.createElement('div')
      el.className = 'le'
      el.style.cssText = 'opacity:0;transform:translateX(-4px);transition:all 0.32s'
      el.innerHTML = `<span class="lt">${t}</span><div class="lbar" style="background:${cols[li % 4]};min-height:14px"></div><span class="lm">${LMSGS[li % LMSGS.length]}</span>`
      c.insertBefore(el, c.firstChild)
      setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'none' }, 15)
      if (c.children.length > 12 && c.lastChild) c.removeChild(c.lastChild)
      li++
    }, 3500)
    return () => clearInterval(id)
  }, [])

  const cpuValues = [28, 31, 29, 34, 32, 30, 35, 33, 34, 38, 36, 34, 32, 34, 31, 29, 33, 36, 34, 32, 28, 31, 34, 32]
  const ramValues = [58, 61, 59, 64, 62, 60, 65, 63, 64, 68, 66, 64, 62, 64, 61, 59, 63, 66, 64, 62, 60, 63, 66, 62]

  return (
    <>
      {/* CPU — col 1/4, row 1/2 */}
      <Card title="CPU" badge="M2 Pro" badgeClass="bg" style={{ gridColumn: '1/4', gridRow: '1/2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minHeight: 0 }}>
            <Gauge pct={34} color="var(--c)" size={100} stroke={8} label="34%" sub="CPU" />
            <div>
              <div style={{ fontFamily: 'var(--fh)', fontSize: 56, fontWeight: 800, color: 'var(--c)', lineHeight: 1 }}>34</div>
              <div style={{ fontSize: 14, color: 'var(--t3)' }}>% Load</div>
              <div className="dv" />
              <div className="dr"><span className="dl">Core</span><span className="dval ta">M2 Pro 10</span></div>
              <div className="dr"><span className="dl">Temp</span><span className="dval ta">34°C</span></div>
              <div className="dr"><span className="dl">Fan</span><span className="dval">1.200 RPM</span></div>
            </div>
          </div>
          <svg viewBox="0 0 120 24" width="100%" height={24} style={{ flexShrink: 0 }}>
            {cpuValues.map((v, i) => {
              const h2 = (v / 38 * 20).toFixed(1)
              return <rect key={i} x={i * 5} y={24 - Number(h2)} width={4} height={Number(h2)} fill={`rgba(0,200,232,${v > 35 ? '0.7' : '0.3'})`} rx={1} />
            })}
          </svg>
        </div>
      </Card>

      {/* RAM — col 4/7, row 1/2 */}
      <Card title="RAM" badge="16 GB unified" badgeClass="bg" style={{ gridColumn: '4/7', gridRow: '1/2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minHeight: 0 }}>
            <Gauge pct={60} color="var(--g)" size={100} stroke={8} label="60%" sub="RAM" />
            <div>
              <div style={{ fontFamily: 'var(--fh)', fontSize: 56, fontWeight: 800, color: 'var(--g)', lineHeight: 1 }}>6.2</div>
              <div style={{ fontSize: 14, color: 'var(--t3)' }}>GB used</div>
              <div className="dv" />
              <div className="dr"><span className="dl">Total</span><span className="dval tg">16 GB</span></div>
              <div className="dr"><span className="dl">Free</span><span className="dval">9.8 GB</span></div>
              <div className="dr"><span className="dl">GPU</span><span className="dval tg">8% · 38°C</span></div>
            </div>
          </div>
          <svg viewBox="0 0 120 24" width="100%" height={24} style={{ flexShrink: 0 }}>
            {ramValues.map((v, i) => {
              const h2 = (v / 68 * 20).toFixed(1)
              return <rect key={i} x={i * 5} y={24 - Number(h2)} width={4} height={Number(h2)} fill={`rgba(0,232,136,${v > 65 ? '0.7' : '0.3'})`} rx={1} />
            })}
          </svg>
        </div>
      </Card>

      {/* Disk & Battery — col 7/10, row 1/2 */}
      <Card title="Disk & Battery" badge="Hardware" badgeClass="bb" style={{ gridColumn: '7/10', gridRow: '1/2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minHeight: 0 }}>
          <div>
            <div className="lbl" style={{ marginBottom: 5 }}>Disk</div>
            <div style={{ fontFamily: 'var(--fh)', fontSize: 32, fontWeight: 700, color: 'var(--bl)', lineHeight: 1 }}>48%</div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 6 }}>245 / 512 GB</div>
            <DeferredBar percent={48} color="linear-gradient(90deg,rgba(68,153,255,0.5),var(--bl))" />
          </div>
          <div className="dv" />
          <div>
            <div className="lbl" style={{ marginBottom: 5 }}>Batterie</div>
            <div style={{ fontFamily: 'var(--fh)', fontSize: 32, fontWeight: 700, color: 'var(--g)', lineHeight: 1 }}>87%</div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 6 }}>{'\u{1F50C}'} Charging · ~2h</div>
            <DeferredBar percent={87} color="linear-gradient(90deg,rgba(0,232,136,0.5),var(--g))" />
          </div>
        </div>
      </Card>

      {/* Internet — col 10/13, row 1/2 */}
      <Card title="Internet" badge="580 Mbps" badgeClass="bg" style={{ gridColumn: '10/13', gridRow: '1/2' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flexShrink: 0, marginBottom: 8 }}>
          <div style={{ textAlign: 'center', background: 'var(--inp)', border: '1px solid var(--b)', borderRadius: 12, padding: 12 }}>
            <div style={{ fontFamily: 'var(--fh)', fontSize: 34, fontWeight: 800, color: 'var(--g)' }}>580</div>
            <div style={{ fontSize: 11, color: 'var(--t3)' }}>{'\u2193'} Mbps Down</div>
          </div>
          <div style={{ textAlign: 'center', background: 'var(--inp)', border: '1px solid var(--b)', borderRadius: 12, padding: 12 }}>
            <div style={{ fontFamily: 'var(--fh)', fontSize: 34, fontWeight: 800, color: 'var(--c)' }}>42</div>
            <div style={{ fontSize: 11, color: 'var(--t3)' }}>{'\u2191'} Mbps Up</div>
          </div>
        </div>
        <div className="dr"><span className="dl" style={{ fontSize: 13 }}>Latenz</span><span className="dval tg" style={{ fontSize: 13 }}>8ms</span></div>
        <div className="dr"><span className="dl" style={{ fontSize: 13 }}>ISP</span><span className="dval" style={{ fontSize: 13 }}>Deutsche Telekom</span></div>
        <div className="dv" />
        <div className="lbl" style={{ marginBottom: 5 }}>Browser Fenster</div>
        <div className="dr"><span style={{ fontFamily: 'var(--fh)', fontSize: 32, fontWeight: 700, color: 'var(--t1)' }}>8</span><span className="dl" style={{ fontSize: 11, marginLeft: 6 }}>Fenster offen</span></div>
      </Card>

      {/* Session Timer — col 1/5, row 2/3 */}
      <Card title="Session" badge="Live" badgeClass="bb" style={{ gridColumn: '1/5', gridRow: '2/3' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 0, gap: 8 }}>
          <div className="lbl">Session Timer</div>
          <div style={{ fontFamily: 'var(--fm)', fontSize: 48, fontWeight: 500, color: 'var(--c)', textShadow: '0 0 20px rgba(0,200,232,0.4)', letterSpacing: '0.06em' }}>{sessionTime}</div>
          <div className="dv" style={{ width: '100%' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%' }}>
            <div className="sbox"><div className="sbv tg" style={{ fontSize: 22 }}>2h48m</div><div className="sbl">Aktiv</div></div>
            <div className="sbox"><div className="sbv ta" style={{ fontSize: 22 }}>36m</div><div className="sbl">Idle</div></div>
            <div className="sbox"><div className="sbv tc" style={{ fontSize: 22 }}>6h12m</div><div className="sbl">Screen</div></div>
            <div className="sbox"><div className="sbv" style={{ fontSize: 22 }}>{clicks.toLocaleString('de-DE')}</div><div className="sbl">Klicks</div></div>
          </div>
        </div>
      </Card>

      {/* MCP Network — col 5/9, row 2/3 */}
      <Card title="MCP Network" badge="5/5 Online" badgeClass="bg" style={{ gridColumn: '5/9', gridRow: '2/3' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
          {([
            ['\u{1F5C4}', 'Supabase', '4ms', '23 Tools', 'g'],
            ['\u{1F419}', 'GitHub', '12ms', '18 Tools', 'g'],
            ['\u25B2', 'Vercel', '8ms', '15 Tools', 'g'],
            ['\u{1F3A8}', 'Figma', '45ms', '12 Tools', 'g'],
            ['\u{1F4AC}', 'Slack', '20ms', '8 Tools', 'g'],
          ] as const).map(m => (
            <div key={m[1]} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'rgba(0,232,136,0.06)', border: '1px solid rgba(0,232,136,0.2)', borderRadius: 10 }}>
              <span style={{ fontSize: 16 }}>{m[0]}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>{m[1]}</div>
                <div style={{ fontSize: 9, color: 'var(--t3)', fontFamily: 'var(--fm)' }}>{m[4]}&nbsp;&nbsp;{m[2]}&nbsp;&nbsp;{m[3]}</div>
              </div>
              <span className={`led l${m[4]}`} style={{ width: 8, height: 8 }} />
            </div>
          ))}
        </div>
      </Card>

      {/* Build & Git — col 9/13, row 2/3 */}
      <Card title="Build & Git" badge="2/3 OK" badgeClass="bb" style={{ gridColumn: '9/13', gridRow: '2/3' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1, minHeight: 0 }}>
          {([
            ['\u{1F3BE} TennisCoach', '\u2713 OK', '45s \u00b7 0 errors', 'g'],
            ['\u{1F3E5} Hebamme', '\u2713 OK', '38s \u00b7 0 errors', 'g'],
            ['\u{1F931} Stillprobleme', '\u2717 Error', 'TypeScript L142', 'r'],
          ] as const).map(b => (
            <div key={b[0]} style={{ padding: '9px 11px', borderRadius: 10, background: 'var(--inp)', border: `1px solid rgba(${b[3] === 'r' ? '255,68,102' : '0,232,136'},0.22)` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{b[0]}</span>
                <span className={`bdg b${b[3]}`} style={{ fontSize: 9 }}>{b[1]}</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--fm)' }}>{b[2]}</div>
            </div>
          ))}
          <div className="dv" />
          {([
            ['TennisCoach', '\u2713 Clean', 'tg'],
            ['Hebamme', '3 uncommitted', 'ta'],
            ['FindeMeine', '\u2191 2 ahead', 'tc'],
          ] as const).map(r => (
            <div key={r[0]} className="dr">
              <span className="dl" style={{ fontSize: 12 }}>{r[0]}</span>
              <span className={`dval ${r[2]}`} style={{ fontSize: 12 }}>{r[1]}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* System Log — col 1/7, row 3/4 */}
      <Card title="System Log" badge={'\u25cf Live'} badgeClass="bb" scan style={{ gridColumn: '1/7', gridRow: '3/4' }}>
        <div ref={logRef} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, minHeight: 0 }}>
          {[
            ['09:41', 'var(--g)', 'Vercel Deploy TennisCoach \u2713'],
            ['09:38', 'var(--bl)', 'Supabase Migration OK'],
            ['09:32', 'var(--bl)', 'GitHub Push \u00b7 4a7f2c'],
            ['09:15', 'var(--a)', 'Build Warning: deprecated API'],
            ['09:00', 'var(--c)', 'System boot \u00b7 all MCP OK'],
            ['08:52', 'var(--g)', 'Health Check: nominal'],
          ].map((l, i) => (
            <div key={i} className="le">
              <span className="lt">{l[0]}</span>
              <div className="lbar" style={{ background: l[1], minHeight: 14 }} />
              <span className="lm">{l[2]}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions — col 7/13, row 3/4 */}
      <Card title="Quick Actions" badge="System" badgeClass="bo" style={{ gridColumn: '7/13', gridRow: '3/4' }}>
        <button className="abtn p" onClick={() => alert('Terminal öffnet...')}>{'\u2328'} System-Terminal öffnen</button>
        <button className="abtn" onClick={() => alert('Health-Check läuft...')}>{'\u26A1'} Health-Check</button>
        <button className="abtn" onClick={() => alert('Logs geladen')}>{'\u{1F4CB}'} Logs anzeigen</button>
        <button className="abtn w" onClick={() => alert('Backup erstellt')}>{'\u{1F4BE}'} Backup</button>
        <button className="abtn" onClick={() => alert('Report generiert')}>{'\u{1F4CA}'} Performance Report</button>
      </Card>
    </>
  )
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
    <div className="prg-bar" style={{ height: 8 }}>
      <div ref={ref} className="prg-fill" style={{ width: 0, background: color, borderRadius: 100 }} />
    </div>
  )
}
