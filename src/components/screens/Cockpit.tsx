import { useEffect, useRef, useState } from 'react'
import Card from '../ui/Card'
import Gauge from '../ui/Gauge'
import { PROJ, AGENTS, SKILLS, TODOS, SCCAT } from '../../lib/data'

interface CockpitProps {
  onModeChange: (mode: string) => void
}

function WaveEQ({ id }: { id: string }) {
  useEffect(() => {
    const w = document.getElementById(id)
    if (!w) return
    w.innerHTML = ''
    const cols = ['#FFB800', '#00C8E8', '#00E888']
    for (let i = 0; i < 9; i++) {
      const b = document.createElement('div')
      b.className = 'wb'
      b.style.cssText = `width:3px;border-radius:2px;height:100%;background:${cols[i % 3]};animation-delay:${i * 0.1}s`
      w.appendChild(b)
    }
  }, [id])
  return <div className="weq" id={id} />
}

function AnimatedProjectBars({ id }: { id: string }) {
  useEffect(() => {
    const w = document.getElementById(id)
    if (!w) return
    w.innerHTML = ''
    PROJ.forEach((p, i) => {
      const b = document.createElement('div')
      b.style.cssText = `flex:1;height:0;border-radius:4px 4px 0 0;position:relative;overflow:hidden;transition:height 1.5s ${i * 0.12}s ease;background:rgba(${p.cr},0.16);border:1px solid rgba(${p.cr},0.38);border-bottom:none`
      const lbl = document.createElement('div')
      lbl.style.cssText = `position:absolute;bottom:-16px;left:0;right:0;text-align:center;font-size:9px;font-weight:700;color:${p.col}`
      lbl.textContent = p.pct + '%'
      b.appendChild(lbl)
      const sh = document.createElement('div')
      sh.style.cssText = `position:absolute;inset:0;background:linear-gradient(180deg,${p.col} 0%,transparent 80%);opacity:0.3`
      b.appendChild(sh)
      w.appendChild(b)
      setTimeout(() => { b.style.height = `${(p.pct / 100) * 44}px` }, 400)
    })
  }, [id])
  return <div id={id} style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 44, paddingBottom: 16, position: 'relative', flexShrink: 0 }} />
}

function UptimeBars({ id }: { id: string }) {
  useEffect(() => {
    const w = document.getElementById(id)
    if (!w) return
    w.innerHTML = ''
    for (let i = 0; i < 30; i++) {
      const ok = Math.random() > 0.02
      const b = document.createElement('div')
      b.style.cssText = `flex:1;border-radius:2px 2px 0 0;height:0;border:1px solid;border-bottom:none;transition:height 0.8s ${i * 0.02}s ease;${ok ? 'background:rgba(0,232,136,0.22);border-color:rgba(0,232,136,0.42)' : 'background:rgba(255,68,102,0.22);border-color:rgba(255,68,102,0.42)'}`
      w.appendChild(b)
      setTimeout(() => { b.style.height = ok ? '100%' : '18%' }, 450)
    }
  }, [id])
  return <div id={id} style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 60, flexShrink: 0 }} />
}

function WeekBars({ id }: { id: string }) {
  const vals = [6.5, 8.2, 5.1, 8.8, 7.4, 3.2, 6.1]
  const labs = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
  useEffect(() => {
    const w = document.getElementById(id)
    if (!w) return
    w.innerHTML = ''
    const maxV = Math.max(...vals)
    vals.forEach((v, i) => {
      const isHi = i === 3
      const b = document.createElement('div')
      b.style.cssText = `flex:1;height:0;border-radius:3px 3px 0 0;position:relative;overflow:hidden;transition:height 1.5s ${i * 0.09}s ease;background:rgba(0,200,232,${isHi ? '0.32' : '0.12'});border:1px solid rgba(0,200,232,${isHi ? '0.6' : '0.22'});border-bottom:none${isHi ? ';box-shadow:0 0 14px rgba(0,200,232,0.25)' : ''}`
      const lbl = document.createElement('div')
      lbl.style.cssText = `position:absolute;bottom:-15px;left:0;right:0;text-align:center;font-size:8px;font-weight:700;color:${isHi ? 'var(--c)' : 'var(--t4)'}`
      lbl.textContent = labs[i]
      b.appendChild(lbl)
      if (isHi) {
        const sh = document.createElement('div')
        sh.style.cssText = 'position:absolute;inset:0;background:linear-gradient(180deg,var(--c) 0%,transparent 100%);opacity:0.35'
        b.appendChild(sh)
      }
      w.appendChild(b)
      setTimeout(() => { b.style.height = `${(v / maxV) * 80}px` }, 400)
    })
  }, [id])
  return <div id={id} style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 80, paddingBottom: 20, flexShrink: 0 }} />
}

export default function Cockpit({ onModeChange }: CockpitProps) {
  const [clock, setClock] = useState('--:--')
  const [cpuVal, setCpuVal] = useState(34)
  const [promptCtr, setPromptCtr] = useState(156)
  const logRef = useRef<HTMLDivElement>(null)

  // Clock
  useEffect(() => {
    function tick() { setClock(new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })) }
    tick()
    const id = setInterval(tick, 5000)
    return () => clearInterval(id)
  }, [])

  // CPU flicker
  useEffect(() => {
    const id = setInterval(() => { setCpuVal(Math.floor(28 + Math.random() * 24)) }, 4500)
    return () => clearInterval(id)
  }, [])

  // Prompt counter
  useEffect(() => {
    const id = setInterval(() => { if (Math.random() > 0.65) setPromptCtr(c => c + 1) }, 7000)
    return () => clearInterval(id)
  }, [])

  // Live log
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

  const openTodos = TODOS.filter(t => !t.done)

  return (
    <>
      {/* SYSTEM STATUS — col 1/4, row 1/6 */}
      <Card title="System Status" badge="Live" badgeClass="bg" style={{ gridColumn: '1/4', gridRow: '1/6' }} onClick={(e) => { if ((e.target as HTMLElement).tagName !== 'BUTTON') onModeChange('system') }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
            <div style={{ position: 'relative' }}>
              <div className="kspin" style={{ width: 42, height: 42, inset: -4 }} />
              <div className="korb" style={{ width: 38, height: 38, fontSize: 16 }}>{'\u2b21'}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--fh)', fontSize: 13, fontWeight: 700, color: 'var(--c)' }}>KANI Online</div>
              <div style={{ fontSize: 9, color: 'var(--t3)', fontFamily: 'var(--fm)' }}>claude-opus-4-6</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--fh)', fontSize: 18, fontWeight: 700, color: 'var(--t1)' }}>{clock}</div>
              <div style={{ fontSize: 9, color: 'var(--t3)' }}>Sa, 28.03.2026</div>
            </div>
          </div>
          <div className="dv" />
          <div className="dr"><span className="led lg" /><span className="dl">Tokens</span><span className="dval tc mono">175K/500K</span></div>
          <div className="dr"><span className="led lc" /><span className="dl">CPU</span><span className="dval">{cpuVal}%</span></div>
          <div className="dr"><span className="led lg" style={{ animationDelay: '0.3s' }} /><span className="dl">Session</span><span className="dval mono">3h 24m</span></div>
          <div className="dr"><span className="led lg" style={{ animationDelay: '0.6s' }} /><span className="dl">MCP</span><span className="dval tg">5 {'\u25cf'}</span></div>
          <div className="dv" />
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <button className="abtn p" style={{ margin: 0, flex: 1, fontSize: 10, padding: 6 }}>{'\u{1F4A1}'}</button>
            <button className="abtn p" style={{ margin: 0, flex: 1, fontSize: 10, padding: 6 }}>+{'\u2713'}</button>
            <button className="abtn" style={{ margin: 0, flex: 1, fontSize: 10, padding: 6 }}>{'\u2328'}</button>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--b)', borderRadius: 10, padding: 6, cursor: 'pointer', transition: 'all 0.2s', background: 'var(--inp)' }}>{'\u{1F514}'}</div>
          </div>
        </div>
      </Card>

      {/* ACTIVE PROJECTS — col 4/10, row 1/6 */}
      <Card title="Active Projects" badge="4 Projekte" badgeClass="bg" scan style={{ gridColumn: '4/10', gridRow: '1/6' }} onClick={(e) => { if ((e.target as HTMLElement).tagName !== 'BUTTON') onModeChange('projects') }}>
        {PROJ.map(p => (
          <div key={p.id} className="prg">
            <div className="prg-top">
              <span className="prg-n" style={{ fontSize: 13, fontWeight: 600 }}>{p.e} {p.n}</span>
              <span className="prg-p" style={{ fontSize: 14, color: p.col }}>{p.pct}%</span>
            </div>
            <div className="prg-bar">
              <AnimatedFill percent={p.pct} bg={`linear-gradient(90deg,rgba(${p.cr},0.5),${p.col})`} />
            </div>
            <div className="prg-sub">{p.phase} {'\u00b7'} {p.tkn}K tkn {'\u00b7'} {'\u20ac'}{p.cost.toFixed(2)} {'\u00b7'} {p.term}</div>
          </div>
        ))}
        <div className="dv" />
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <span className="bdg bg" style={{ fontSize: 10 }}>2 Running</span>
          <span className="bdg ba" style={{ fontSize: 10 }}>1 Waiting</span>
          <span className="bdg bb" style={{ fontSize: 10 }}>1 Live</span>
        </div>
        <div className="dv" />
        <AnimatedProjectBars id="cck-proj" />
        <div className="dv" />
        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
          <button className="abtn p" style={{ margin: 0, flex: 1, fontSize: 11 }} onClick={() => onModeChange('projects')}>{'\u2192'} Detail</button>
          <button className="abtn" style={{ margin: 0, flex: 1, fontSize: 11 }}>+ Todo</button>
        </div>
      </Card>

      {/* KANI ORB — col 10/13, row 1/6 */}
      <Card title="KANI" badge={'\u25cf Live'} badgeClass="bb" style={{ gridColumn: '10/13', gridRow: '1/6', borderColor: 'rgba(0,200,232,0.25)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'center' }}>
          <div style={{ position: 'relative', margin: 4 }}>
            <div className="kspin" style={{ width: 80, height: 80 }} />
            <div className="korb" style={{ width: 72, height: 72, fontSize: 28 }}>{'\u2b21'}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--fh)', fontSize: 15, fontWeight: 700, color: 'var(--c)' }}>Bereit</div>
            <div style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--fm)' }}>Opus 4.6</div>
          </div>
          <div className="dv" style={{ width: '100%' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, width: '100%' }}>
            <div className="sbox"><div className="sbv tc" style={{ fontSize: 20 }}>{promptCtr}</div><div className="sbl">Prompts</div></div>
            <div className="sbox"><div className="sbv tg" style={{ fontSize: 20 }}>3</div><div className="sbl">Terminals</div></div>
            <div className="sbox"><div className="sbv ta" style={{ fontSize: 20 }}>18</div><div className="sbl">Skills</div></div>
            <div className="sbox"><div className="sbv tp" style={{ fontSize: 20 }}>9</div><div className="sbl">Agents</div></div>
          </div>
          <div className="dv" style={{ width: '100%' }} />
          <div style={{ width: '100%' }}>
            <Gauge pct={24} color="var(--c)" size={60} stroke={5} label="24%" sub="Context" />
          </div>
        </div>
      </Card>

      {/* FINANCIALS — col 13/18, row 1/4 */}
      <Card title="Financials" badge="~18 Tage" badgeClass="ba" style={{ gridColumn: '13/18', gridRow: '1/4' }} onClick={() => onModeChange('finance')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="lbl" style={{ marginBottom: 4 }}>Token Budget</div>
              <Gauge pct={35} color="var(--c)" size={72} stroke={6} label="35%" sub="175K" />
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="lbl" style={{ marginBottom: 4 }}>Monatskosten</div>
              <div style={{ fontFamily: 'var(--fh)', fontSize: 32, fontWeight: 700, color: 'var(--a)', lineHeight: 1 }}>{'\u20ac'}52</div>
              <div style={{ fontSize: 11, color: 'var(--t3)' }}>.78 / Mo</div>
            </div>
          </div>
          <div className="dv" />
          <div style={{ display: 'flex', gap: 4 }}>
            <div className="sbox"><div className="sbv tg" style={{ fontSize: 18 }}>{'\u20ac'}3K</div><div className="sbl">Live Rev.</div></div>
            <div className="sbox"><div className="sbv tp" style={{ fontSize: 18 }}>18d</div><div className="sbl">Bis Reset</div></div>
          </div>
          <div className="dv" />
          <WaveEQ id="w-fin" />
        </div>
      </Card>

      {/* BRIEFING — col 18/25, row 1/4 */}
      <Card title="KANI Briefing" badge="09:15" badgeClass="bg" style={{ gridColumn: '18/25', gridRow: '1/4' }} onClick={() => onModeChange('briefing')}>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--c)', marginBottom: 2 }}>Heute: 3 Priorit{'\u00e4'}ten</div>
          <div style={{ background: 'rgba(0,232,136,0.08)', border: '1px solid rgba(0,232,136,0.18)', borderRadius: 10, padding: '8px 10px', flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--g)', marginBottom: 2 }}>01 {'\u00b7'} Mission Control V10</div>
            <div style={{ fontSize: 10, color: 'var(--t3)' }}>3h {'\u00b7'} Foundation Build</div>
          </div>
          <div style={{ background: 'rgba(0,200,232,0.08)', border: '1px solid rgba(0,200,232,0.18)', borderRadius: 10, padding: '8px 10px', flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--c)', marginBottom: 2 }}>02 {'\u00b7'} Hebamme Validation</div>
            <div style={{ fontSize: 10, color: 'var(--t3)' }}>1.5h {'\u00b7'} Critical Path</div>
          </div>
          <div style={{ background: 'var(--inp)', border: '1px solid var(--b)', borderRadius: 10, padding: '8px 10px', flexShrink: 0, opacity: 0.6 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t2)', marginBottom: 2 }}>03 {'\u00b7'} Stillprobleme MVP</div>
            <div style={{ fontSize: 10, color: 'var(--t3)' }}>45min</div>
          </div>
        </div>
      </Card>

      {/* AGENTS & SKILLS — col 13/18, row 4/6 */}
      <Card title="Agents & Skills" badge="9/18/5" badgeClass="bb" style={{ gridColumn: '13/18', gridRow: '4/6' }} onClick={() => onModeChange('agents')}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, marginBottom: 7, flexShrink: 0 }}>
          <div className="sbox"><div className="sbv tc" style={{ fontSize: 22 }}>9</div><div className="sbl">Agents</div></div>
          <div className="sbox"><div className="sbv" style={{ fontSize: 22, color: 'var(--c2)' }}>18</div><div className="sbl">Skills</div></div>
          <div className="sbox"><div className="sbv tg" style={{ fontSize: 22 }}>5</div><div className="sbl">MCP</div></div>
        </div>
        <div className="lbl" style={{ marginBottom: 5, flexShrink: 0 }}>MCP Live</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 3 }}>
          {[['\u{1F5C4}', 'SUPA'], ['\u{1F419}', 'GIT'], ['\u25b2', 'VCL'], ['\u{1F3A8}', 'FIG'], ['\u{1F4AC}', 'SLK']].map(m => (
            <div key={m[1]} className="chip on" style={{ fontSize: 12 }}>{m[0]}<span>{m[1]}</span></div>
          ))}
        </div>
        <div className="dv" />
        {AGENTS.filter(a => a.st === 'active').slice(0, 2).map(a => (
          <div key={a.n} className="dr"><span className="led lg" /><span className="dl" style={{ fontSize: 11 }}>{a.n}</span><span style={{ fontSize: 9, color: 'var(--t3)' }}>{a.proj}</span></div>
        ))}
      </Card>

      {/* TODOS — col 18/25, row 4/6 */}
      <Card title="Todos" badge="3 F{'\u00e4'}llig" badgeClass="ba" style={{ gridColumn: '18/25', gridRow: '4/6' }} onClick={(e) => { if ((e.target as HTMLElement).tagName !== 'INPUT') onModeChange('todos') }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexShrink: 0 }}>
          <Gauge pct={67} color="var(--g)" size={68} stroke={6} label="67%" sub="Done" />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--fh)', fontSize: 22, fontWeight: 700, color: 'var(--g)' }}>67%</div>
            <div style={{ fontSize: 10, color: 'var(--t3)' }}>6 offen {'\u00b7'} 3 heute</div>
            <div style={{ fontSize: 10, color: 'var(--a)', marginTop: 3 }}>Streak 7 Tage {'\u{1F525}'}</div>
          </div>
        </div>
        {openTodos.slice(0, 3).map(t => (
          <div key={t.id} className="dr">
            <input type="checkbox" style={{ accentColor: 'var(--c)', flexShrink: 0 }} readOnly />
            <span className="dl" style={{ fontSize: 12, ...(t.ov ? { color: 'var(--r)' } : {}) }}>{t.txt}</span>
          </div>
        ))}
      </Card>

      {/* LIVE LOG — col 1/7, row 6/11 */}
      <Card title="Live Log" badge={'\u25cf Live'} badgeClass="bb" scan style={{ gridColumn: '1/7', gridRow: '6/11' }}>
        <div ref={logRef} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, minHeight: 0 }}>
          {[
            ['09:41', 'var(--g)', 'Vercel Deploy TennisCoach \u2192 Production \u2713'],
            ['09:38', 'var(--bl)', 'Supabase Schema Migration'],
            ['09:32', 'var(--bl)', 'GitHub Push \u00b7 4a7f2c \u00b7 12 files'],
            ['09:28', 'var(--c)', 'KANI Session init \u00b7 Opus 4.6'],
            ['09:15', 'var(--g)', 'Briefing generiert \u00b7 3 Empfehlungen'],
            ['09:00', 'var(--bl)', 'Boot \u00b7 5/5 MCP verbunden OK'],
            ['08:52', 'var(--a)', 'Resend \u00b7 3 E-Mails delivered'],
            ['08:40', 'var(--g)', 'FindeMeine \u00b7 +12 neue User'],
          ].map((l, i) => (
            <div key={i} className="le">
              <span className="lt">{l[0]}</span>
              <div className="lbar" style={{ background: l[1], minHeight: 14 }} />
              <span className="lm">{l[2]}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* WEEK OVERVIEW — col 7/13, row 6/9 */}
      <Card title="Wochenübersicht" badge={'\u00d8 7.2h/Tag'} badgeClass="bg" style={{ gridColumn: '7/13', gridRow: '6/9' }}>
        <div style={{ fontFamily: 'var(--fh)', fontSize: 28, fontWeight: 700, color: 'var(--t1)', marginBottom: 2 }}>7.2h</div>
        <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 8, flexShrink: 0 }}>Arbeit heute {'\u00b7'} {'\u00d8'} 38.5h/Woche</div>
        <WeekBars id="wchart" />
      </Card>

      {/* PERFORMANCE & MCP — col 13/18, row 6/9 */}
      <Card title="Performance & MCP" badge="5/5" badgeClass="bg" style={{ gridColumn: '13/18', gridRow: '6/9' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 7, flexShrink: 0 }}>
          <div className="sbox"><div className="sbv tc" style={{ fontSize: 20, fontFamily: 'var(--fm)' }}>340</div><div className="sbl">ms API</div></div>
          <div className="sbox"><div className="sbv tg" style={{ fontSize: 20, fontFamily: 'var(--fm)' }}>99.8</div><div className="sbl">% Uptime</div></div>
        </div>
        <div className="lbl" style={{ marginBottom: 5, flexShrink: 0 }}>MCP Status</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, overflow: 'hidden', flex: 1, minHeight: 0 }}>
          {[
            ['\u{1F5C4}', 'Supabase', '4ms', 'g'],
            ['\u{1F419}', 'GitHub', '12ms', 'g'],
            ['\u25b2', 'Vercel', '8ms', 'g'],
            ['\u{1F3A8}', 'Figma', '45ms', 'g'],
            ['\u{1F4AC}', 'Slack', '20ms', 'g'],
          ].map(m => (
            <div key={m[1]} className="dr">
              <span style={{ fontSize: 12 }}>{m[0]}</span>
              <span className="dl" style={{ fontSize: 12 }}>{m[1]}</span>
              <span className={`led l${m[3]}`} style={{ width: 5, height: 5, animationDelay: '0.2s' }} />
              <span className={`dval t${m[3]}`} style={{ fontSize: 11 }}>{m[2]}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* DEPLOYMENTS — col 18/25, row 6/9 */}
      <Card title="Deployments" badge="3 Live" badgeClass="bg" style={{ gridColumn: '18/25', gridRow: '6/9' }}>
        {[
          ['TennisCoach', '\u{1F3BE}', 'var(--g)', '0,232,136', 'prod \u00b7 v1.8.2', 'LIVE'],
          ['FindeMeine', '\u{1F50D}', 'var(--c)', '0,200,232', 'prod \u00b7 v2.1.0', 'LIVE'],
          ['Hebamme', '\u{1F3E5}', 'var(--a)', '255,184,0', 'preview \u00b7 v0.9.4', 'Deploying'],
        ].map(d => (
          <div key={d[0]} className="dep" style={{ borderColor: `rgba(${d[3]},0.28)` }}>
            <div className="depn" style={{ color: d[2] }}>{d[1]} {d[0]}</div>
            <div className="deps">{d[4]} {'\u00b7'} <span style={{ color: d[2] }}>{d[5]}</span></div>
          </div>
        ))}
      </Card>

      {/* SKILLS — col 7/13, row 9/11 */}
      <Card title="Skills Library" badge="18 Aktiv" badgeClass="bb" style={{ gridColumn: '7/13', gridRow: '9/11' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', flex: 1, alignContent: 'flex-start', overflow: 'hidden', gap: 0 }}>
          {SKILLS.slice(0, 14).map(s => (
            <span key={s.n} className="ptag">
              <span className="pdot" style={{ background: SCCAT[s.cat] || 'var(--c)' }} />
              {s.n}
            </span>
          ))}
        </div>
      </Card>

      {/* TOKEN USAGE — col 13/19, row 9/11 */}
      <Card title="Token Usage" badge="35%" badgeClass="bbl" style={{ gridColumn: '13/19', gridRow: '9/11' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexShrink: 0 }}>
          <Gauge pct={35} color="var(--bl)" size={64} stroke={6} label="35%" sub="175K" />
          <div>
            <div style={{ fontFamily: 'var(--fh)', fontSize: 26, fontWeight: 700, color: 'var(--bl)' }}>175K</div>
            <div style={{ fontSize: 10, color: 'var(--t3)' }}>/500K Tokens</div>
            <div style={{ fontSize: 10, color: 'var(--a)', marginTop: 4 }}>Reset in 18 Tagen</div>
          </div>
        </div>
        <svg viewBox="0 0 120 20" style={{ width: '100%', height: 22, flexShrink: 0 }}>
          <polyline points="0,17 17,13 34,17 51,9 68,12 85,6 102,8 120,4" fill="none" stroke="rgba(68,153,255,0.6)" strokeWidth="1.5" />
          <polygon points="0,17 17,13 34,17 51,9 68,12 85,6 102,8 120,4 120,20 0,20" fill="url(#tkg)" />
          <defs>
            <linearGradient id="tkg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(68,153,255,0.14)" />
              <stop offset="100%" stopColor="rgba(68,153,255,0)" />
            </linearGradient>
          </defs>
        </svg>
      </Card>

      {/* UPTIME — col 19/25, row 9/11 */}
      <Card title="Uptime 30d" badge="Stable" badgeClass="bg" style={{ gridColumn: '19/25', gridRow: '9/11' }}>
        <div style={{ fontFamily: 'var(--fh)', fontSize: 38, fontWeight: 700, color: 'var(--g)', lineHeight: 1, marginBottom: 4 }}>99.8%</div>
        <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 8, flexShrink: 0 }}>Uptime {'\u00b7'} letzte 30 Tage</div>
        <UptimeBars id="uptchart" />
      </Card>
    </>
  )
}

/** Animated fill bar for progress bars */
function AnimatedFill({ percent, bg }: { percent: number; bg: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const timer = setTimeout(() => { el.style.width = percent + '%' }, 120)
    return () => clearTimeout(timer)
  }, [percent])
  return <div ref={ref} className="prg-fill" style={{ width: 0, background: bg }} />
}
