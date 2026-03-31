import Card from '../ui/Card'
import { MEM } from '../../lib/data'

export default function Memory() {
  return (
    <>
      {/* Memory Sync — col 1/4, row 1/2 */}
      <Card title="Memory Sync" badge="Synchron" badgeClass="bg" style={{ gridColumn: '1/4', gridRow: '1/2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle at 35% 32%,rgba(0,232,136,0.25),rgba(0,232,136,0.06))', border: '2px solid rgba(0,232,136,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, boxShadow: '0 0 30px rgba(0,232,136,0.25),inset 0 1px 0 rgba(255,255,255,0.06)' }}>{'\u{1F9E0}'}</div>
              <div style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: '50%', background: 'var(--g)', border: '2px solid var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{'\u2713'}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--fh)', fontSize: 36, fontWeight: 800, color: 'var(--g)', lineHeight: 1 }}>Synchron</div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>Letzte Sync: Heute 09:41</div>
              <div style={{ fontSize: 12, color: 'var(--g)', marginTop: 3 }}>{'\u25CF'} Alle Files aktuell</div>
            </div>
          </div>
          <div className="dv" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flexShrink: 0 }}>
            {([['156', 'Einträge', 'a'], ['8', 'Core Files', 'c'], ['47', 'Chat-Exports', 'g'], ['4.8MB', 'Gesamt', 'p']] as const).map(s => (
              <div key={s[1]} className="sbox">
                <div style={{ fontFamily: 'var(--fh)', fontSize: 26, fontWeight: 800, color: `var(--${s[2]})`, lineHeight: 1 }}>{s[0]}</div>
                <div className="sbl" style={{ marginTop: 5 }}>{s[1]}</div>
              </div>
            ))}
          </div>
          <div className="dv" />
          <button className="abtn p" onClick={() => alert('Memory synchronisiert...')}>{'\u{1F504}'} Jetzt synchronisieren</button>
          <button className="abtn" onClick={() => alert('MEMORY.md öffnet...')}>{'\u{1F4DD}'} MEMORY.md bearbeiten</button>
        </div>
      </Card>

      {/* Core Files — col 4/9, row 1/2 */}
      <Card title="Core Files" badge="8 Files" badgeClass="bb" style={{ gridColumn: '4/9', gridRow: '1/2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 5, overflowY: 'auto' }}>
          {MEM.map(f => (
            <div key={f.n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 11, background: 'var(--inp)', border: '1px solid var(--b)', cursor: 'pointer', transition: 'all 0.18s' }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{f.ico}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.n}</div>
                <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 1 }}>{f.m}</div>
              </div>
              <span className="mfb">{f.b}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Memory Suche — col 9/13, row 1/2 */}
      <Card title="Memory Suche" badge="Live" badgeClass="bb" style={{ gridColumn: '9/13', gridRow: '1/2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 8 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <input className="inp" placeholder="Was wissen wir über X?" style={{ fontSize: 13, paddingRight: 40 }} readOnly />
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--c)', cursor: 'pointer', fontSize: 16 }} onClick={() => alert('Memory-Suche...')}>{'\u2B21'}</span>
          </div>
          <div className="lbl" style={{ flexShrink: 0 }}>Letzte Einträge</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, overflowY: 'auto', flex: 1, minHeight: 0 }}>
            {([
              ['Dashboard Design finalisiert', 'Heute \u00b7 Design', 'c'],
              ['TennisCoach Deploy Strategie', 'Gestern \u00b7 Deploy', 'g'],
              ['Gastro Suite Marktanalyse', 'Vor 2d \u00b7 Research', 'a'],
              ['KANI Prompt-Optimierungen', 'Vor 3d \u00b7 System', 'p'],
              ['Stripe Webhook Pattern', 'Vor 4d \u00b7 Dev', 'bl'],
              ['FindeMeine SEO Strategie', 'Vor 5d \u00b7 Marketing', 'c'],
            ] as const).map(e => (
              <div key={e[0]} style={{ padding: '9px 11px', background: 'var(--inp)', border: '1px solid var(--b)', borderRadius: 10, cursor: 'pointer', transition: 'all 0.18s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 3, height: 32, borderRadius: 2, background: `var(--${e[2]})`, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--t1)' }}>{e[0]}</div>
                    <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>{e[1]}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Registry & DNA — col 1/7, row 2/3 */}
      <Card title="Registry & DNA" badge="Stabil" badgeClass="bg" style={{ gridColumn: '1/7', gridRow: '2/3' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 8 }}>
          <div className="lbl" style={{ flexShrink: 0 }}>REGISTRY.md Status</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flexShrink: 0 }}>
            {([['18', 'Skills', 'c'], ['9', 'Agents', 'g'], ['7', 'Commands', 'a'], ['4', 'Workflows', 'p']] as const).map(r => (
              <div key={r[1]} className="sbox">
                <div style={{ fontFamily: 'var(--fh)', fontSize: 30, fontWeight: 800, color: `var(--${r[2]})`, lineHeight: 1 }}>{r[0]}</div>
                <div className="sbl" style={{ marginTop: 5 }}>{r[1]}</div>
              </div>
            ))}
          </div>
          <div className="dv" />
          <div className="lbl" style={{ flexShrink: 0 }}>DNA.md v3.2</div>
          <div style={{ background: 'rgba(0,232,136,0.07)', border: '1px solid rgba(0,232,136,0.2)', borderRadius: 12, padding: '12px 14px', fontSize: 12, color: 'var(--t2)', lineHeight: 1.7, flexShrink: 0 }}>
            <strong style={{ color: 'var(--g)' }}>Stil:</strong> Direkt, präzise, Deutsch<br />
            <strong style={{ color: 'var(--c)' }}>Modell:</strong> Sonnet Standard, Opus für Architektur<br />
            <strong style={{ color: 'var(--a)' }}>Workflow:</strong> Iterativ, Memory-first, KANI-centric
          </div>
          <div className="dv" />
          <div className="lbl" style={{ flexShrink: 0 }}>Sync-Status per File</div>
          {([
            ['MEMORY.md', 'Heute', 'g'],
            ['REGISTRY.md', 'Heute', 'g'],
            ['DNA.md', '22.01.', 'a'],
            ['Hebamme/CLAUDE.md', 'Gestern', 'g'],
          ] as const).map(f => (
            <div key={f[0]} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--b)', flexShrink: 0 }}>
              <span className={`led l${f[2]}`} style={{ width: 6, height: 6 }} />
              <span style={{ flex: 1, fontSize: 12, color: 'var(--t2)' }}>{f[0]}</span>
              <span style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--fm)' }}>{f[1]}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Memory Actions — col 7/13, row 2/3 */}
      <Card title="Memory Actions" badge="Actions" badgeClass="bo" style={{ gridColumn: '7/13', gridRow: '2/3' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 8 }}>
          <div className="lbl" style={{ flexShrink: 0 }}>Memory Actions</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flexShrink: 0 }}>
            {([
              ['\u{1F504}', 'Sync', 'p'],
              ['\u{1F4DD}', 'Edit', ''],
              ['\u{1F4CB}', 'Registry', ''],
              ['\u{1F4C1}', 'Context', ''],
              ['\u2193', 'Export', 'w'],
              ['\u{1F50D}', 'Suche', ''],
            ] as const).map(a => (
              <button key={a[1]} className={`abtn ${a[2]}`} style={{ margin: 0, fontSize: 13, padding: 12, textAlign: 'center' }} onClick={() => alert(a[1] + '...')}>{a[0]} {a[1]}</button>
            ))}
          </div>
          <div className="dv" />
          <div style={{ background: 'rgba(0,200,232,0.06)', border: '1px solid rgba(0,200,232,0.18)', borderRadius: 12, padding: '12px 14px', flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--c)', marginBottom: 5 }}>{'\u2B21'} KANI Memory Update</div>
            <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.6 }}>3 neue Einträge heute. Session-Zusammenfassung bereit. Context-Optimierung: 94% relevant.</div>
            <button className="abtn p" style={{ marginTop: 8, fontSize: 11 }} onClick={() => alert('Memory updated!')}>Memory jetzt updaten</button>
          </div>
        </div>
      </Card>
    </>
  )
}
