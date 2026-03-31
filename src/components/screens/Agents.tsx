import Card from '../ui/Card'
import Gauge from '../ui/Gauge'
import { AGENTS, SKILLS, PROJ, SCCAT, MTRIX } from '../../lib/data'

const stC: Record<string, string> = { active: 'var(--g)', idle: 'var(--a)', ready: 'var(--c)', offline: 'var(--t3)' }
const stL: Record<string, string> = { active: 'Aktiv', idle: 'Idle', ready: 'Bereit', offline: 'Offline' }

export default function Agents() {
  const activeAgents = AGENTS.filter(a => a.st === 'active')

  return (
    <>
      {/* All Agents — col 1/5, row 1/2 */}
      <Card title="All Agents" badge="9 Total" badgeClass="bb" style={{ gridColumn: '1/5', gridRow: '1/2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, overflowY: 'auto', flex: 1, minHeight: 0 }}>
          {AGENTS.map(a => (
            <div key={a.n} className="ag-card">
              <div className="ag-avatar" style={{ background: a.bg, border: `1px solid ${a.col}`, fontSize: 18 }}>{a.e}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="ag-name">{a.n}</div>
                <div className="ag-role">{a.typ} · {a.mdl}</div>
                <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>{a.act}</div>
              </div>
              <div className="ag-stat">
                <div style={{ fontFamily: 'var(--fh)', fontSize: 14, fontWeight: 700, color: stC[a.st] || 'var(--t3)' }}>{stL[a.st] || a.st}</div>
                <div style={{ fontSize: 9, color: 'var(--t3)', fontFamily: 'var(--fm)' }}>{a.tkn}</div>
                <div style={{ fontSize: 10, color: 'var(--t3)' }}>{a.cost}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Active Agent Detail Cards — row 1 */}
      {activeAgents.map((a, i) => {
        const col = ['5/8', '8/10', '10/12'][i]
        if (!col) return null
        return (
          <Card key={a.n} title={a.n} badge="Active" badgeClass="bg" style={{ gridColumn: col, gridRow: '1/2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexShrink: 0 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, background: a.bg, border: `1px solid ${a.col}` }}>{a.e}</div>
              <div>
                <div style={{ fontFamily: 'var(--fh)', fontSize: 14, fontWeight: 700, color: a.col }}>{a.n}</div>
                <div style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--fm)' }}>{a.st} · {a.mdl}</div>
              </div>
            </div>
            <Gauge pct={a.suc} color={a.col} size={60} stroke={5} label={a.suc + '%'} sub="Erfolg" />
            <div className="dv" />
            <div className="dr"><span className="dl" style={{ fontSize: 12 }}>Tokens</span><span className="dval" style={{ fontSize: 12 }}>{a.tkn}</span></div>
            <div className="dr"><span className="dl" style={{ fontSize: 12 }}>Kosten</span><span className="dval ta" style={{ fontSize: 12 }}>{a.cost}</span></div>
            <div className="dr"><span className="dl" style={{ fontSize: 12 }}>Projekt</span><span className="dval" style={{ fontSize: 12 }}>{a.proj}</span></div>
            <div className="ldbar" style={{ marginTop: 6 }}><div className="ldfil" /></div>
          </Card>
        )
      })}

      {/* Skills Library — col 12/13, row 1/2 */}
      <Card title="Skills Library" badge="18 aktiv" badgeClass="bb" style={{ gridColumn: '12/13', gridRow: '1/2' }}>
        <div className="frow">
          {['Alle', 'Core', 'MCKAY', 'Integration', 'Specialist'].map((f, i) => (
            <span key={f} className={`fpill${i === 0 ? ' act' : ''}`}>{f}</span>
          ))}
        </div>
        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SKILLS.map(s => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 8, background: 'var(--inp)', border: `1px solid ${s.st ? 'var(--b)' : 'rgba(255,255,255,0.04)'}` }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: SCCAT[s.cat] || 'var(--c)', flexShrink: 0, opacity: s.st ? 1 : 0.3 }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: `var(--t${s.st ? 1 : 3})`, flex: 1 }}>{s.n}</span>
              <span style={{ fontSize: 9, color: 'var(--t3)' }}>{s.cat}</span>
              <span style={{ fontSize: 9, color: 'var(--t3)', fontFamily: 'var(--fm)', marginLeft: 4 }}>{s.p}P</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Agent Overview Stats — col 1/13, row 2/3 */}
      <Card title="Agent Overview" badge="Live" badgeClass="bg" style={{ gridColumn: '1/13', gridRow: '2/3' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-around', flex: 1 }}>
          {([
            ['9', 'Agents', 'var(--c)'],
            ['3', 'Aktiv', 'var(--g)'],
            ['18', 'Skills', 'var(--p)'],
            ['5', 'MCP', 'var(--a)'],
            ['\u20ac1.64', 'Heute', 'var(--bl)'],
            ['97%', '\u00d8 Erfolg', 'var(--t1)'],
          ] as const).map((s, i, arr) => (
            <span key={s[1]} style={{ display: 'contents' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--fh)', fontSize: 32, fontWeight: 800, color: s[2] }}>{s[0]}</div>
                <div className="sbl">{s[1]}</div>
              </div>
              {i < arr.length - 1 && <div style={{ width: 1, height: 40, background: 'var(--b)' }} />}
            </span>
          ))}
        </div>
      </Card>

      {/* Agent x Projekt Matrix — col 1/5, row 3/4 */}
      <Card title="Agent × Projekt Matrix" badge="Matrix" badgeClass="bp" style={{ gridColumn: '1/5', gridRow: '3/4' }}>
        <div style={{ overflow: 'auto', flex: 1, minHeight: 0 }}>
          <table className="mtbl" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', minWidth: 110 }} />
                {PROJ.map(p => <th key={p.id} style={{ minWidth: 40 }}>{p.e}</th>)}
              </tr>
            </thead>
            <tbody>
              {Object.keys(MTRIX).map(ag => (
                <tr key={ag}>
                  <td style={{ color: 'var(--t2)', textAlign: 'left', paddingRight: 8, fontSize: 11 }}>{ag}</td>
                  {MTRIX[ag].map((v, j) => (
                    <td key={j}><span className={`mch${v ? ' on' : ''}`} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Model Routing — col 5/9, row 3/4 */}
      <Card title="Model Routing" badge="3 Models" badgeClass="bp" style={{ gridColumn: '5/9', gridRow: '3/4' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10, flexShrink: 0 }}>
          <div className="sbox"><div className="sbv tp" style={{ fontSize: 26 }}>3</div><div className="sbl">Opus</div></div>
          <div className="sbox"><div className="sbv tc" style={{ fontSize: 26 }}>4</div><div className="sbl">Sonnet</div></div>
          <div className="sbox"><div className="sbv tg" style={{ fontSize: 26 }}>2</div><div className="sbl">Haiku</div></div>
        </div>
        <div className="dr"><span className="dl" style={{ fontSize: 12 }}>Opus Tasks</span><span className="dval tp" style={{ fontSize: 12 }}>{'\u20ac'}0.42</span></div>
        <div className="dr"><span className="dl" style={{ fontSize: 12 }}>Sonnet Tasks</span><span className="dval tc" style={{ fontSize: 12 }}>{'\u20ac'}0.86</span></div>
        <div className="dr"><span className="dl" style={{ fontSize: 12 }}>Haiku Tasks</span><span className="dval tg" style={{ fontSize: 12 }}>{'\u20ac'}0.08</span></div>
      </Card>

      {/* GitHub Skill Search — col 9/13, row 3/4 */}
      <Card title="GitHub Skill Search" badge="Discover" badgeClass="bg" style={{ gridColumn: '9/13', gridRow: '3/4' }}>
        <div className="lbl" style={{ marginBottom: 6, flexShrink: 0 }}>Skills & Agents suchen</div>
        <div style={{ position: 'relative', marginBottom: 8, flexShrink: 0 }}>
          <input className="inp" placeholder={'\u{1F50D} GitHub: skill name suchen...'} readOnly />
          <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: 'var(--c)' }}>{'\u2B21'}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {([
            ['\u{1F527} mcp-filesystem', 'v1.2.3', 'MCP', '4.2K \u2B50'],
            ['\u{1F310} browser-use', 'v0.8.1', 'Agent', '12K \u2B50'],
            ['\u{1F4CA} data-analyst', 'v2.0.0', 'Specialist', '2.8K \u2B50'],
          ] as const).map(r => (
            <div key={r[0]} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--inp)', border: '1px solid var(--b)', borderRadius: 10, cursor: 'pointer', transition: 'all 0.18s' }}>
              <span style={{ fontSize: 14 }}>{r[0].split(' ')[0]}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{r[0].slice(r[0].indexOf(' ') + 1)}</div>
                <div style={{ fontSize: 9, color: 'var(--t3)', fontFamily: 'var(--fm)' }}>{r[1]} · {r[3]}</div>
              </div>
              <span className="bdg bb" style={{ fontSize: 9 }}>{r[2]}</span>
              <button className="abtn p" style={{ margin: 0, padding: '3px 9px', fontSize: 9, width: 'auto' }} onClick={() => alert('Installiert: ' + r[0].slice(r[0].indexOf(' ') + 1))}>Install</button>
            </div>
          ))}
        </div>
        <div className="dv" style={{ flexShrink: 0 }} />
        <button className="abtn s" onClick={() => alert('New Agent Wizard...')}>{'\u2295'} Create New Agent</button>
        <button className="abtn" onClick={() => alert('New Skill Wizard...')}>{'\u2295'} Create New Skill</button>
      </Card>
    </>
  )
}
