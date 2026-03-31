import Card from '../ui/Card'
import { IDEAS } from '../../lib/data'

export default function Thinktank() {
  return (
    <>
      {/* Neue Idee — col 1/4, row 1/2 */}
      <Card title="Neue Idee" badge="Eingabe" badgeClass="bo" style={{ gridColumn: '1/4', gridRow: '1/2' }}>
        <div className="lbl" style={{ marginBottom: 8, flexShrink: 0 }}>Workflow: Idee {'\u2192'} KANI {'\u2192'} Projekt</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexShrink: 0 }}>
          <div style={{ textAlign: 'center', flex: 1, padding: 8, background: 'rgba(0,200,232,0.08)', border: '1px solid rgba(0,200,232,0.2)', borderRadius: 10 }}>
            <div style={{ fontSize: 16 }}>{'\u{1F4AC}'}</div>
            <div style={{ fontSize: 9, color: 'var(--c)', marginTop: 3 }}>1. Gedanke</div>
          </div>
          <div style={{ fontSize: 16, color: 'var(--t3)' }}>{'\u2192'}</div>
          <div style={{ textAlign: 'center', flex: 1, padding: 8, background: 'rgba(187,136,255,0.08)', border: '1px solid rgba(187,136,255,0.2)', borderRadius: 10 }}>
            <div style={{ fontSize: 16 }}>{'\u2B21'}</div>
            <div style={{ fontSize: 9, color: 'var(--p)', marginTop: 3 }}>2. KANI</div>
          </div>
          <div style={{ fontSize: 16, color: 'var(--t3)' }}>{'\u2192'}</div>
          <div style={{ textAlign: 'center', flex: 1, padding: 8, background: 'rgba(0,232,136,0.08)', border: '1px solid rgba(0,232,136,0.2)', borderRadius: 10 }}>
            <div style={{ fontSize: 16 }}>{'\u25C8'}</div>
            <div style={{ fontSize: 9, color: 'var(--g)', marginTop: 3 }}>3. Projekt</div>
          </div>
        </div>
        <textarea className="inp" rows={4} placeholder="Einfach rausschreiben — KANI kategorisiert, bewertet und empfiehlt..." style={{ resize: 'none', marginBottom: 8, flexShrink: 0, fontSize: 13 }} readOnly />
        <button className="abtn p" onClick={() => alert('KANI analysiert...')}>{'\u2B21'} An KANI senden</button>
        <div className="dv" />
        <div className="frow">
          {['Alle', 'Projekt-Idee', 'Research', 'Strategie', 'Geparkt'].map((f, i) => (
            <span key={f} className={`fpill${i === 0 ? ' act' : ''}`}>{f}</span>
          ))}
        </div>
      </Card>

      {/* KANI Empfehlung — col 4/7, row 1/2 */}
      <Card title="KANI Empfehlung" badge="Live Analyse" badgeClass="bb" style={{ gridColumn: '4/7', gridRow: '1/2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
          <div style={{ background: 'rgba(0,200,232,0.07)', border: '1px solid rgba(0,200,232,0.2)', borderRadius: 12, padding: 12, flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--fh)', fontSize: 14, fontWeight: 700, color: 'var(--c)', marginBottom: 5 }}>{'\u{1F947}'} Gastro Suite — Jetzt starten</div>
            <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.6 }}>Höchstes Potenzial bei mittlerem Aufwand. 80% Code-Overlap mit Hebamme. Schwache Wettbewerber. MVP in ~8 Wochen möglich.</div>
          </div>
          <div style={{ background: 'rgba(0,232,136,0.06)', border: '1px solid rgba(0,232,136,0.18)', borderRadius: 12, padding: 12, flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--fh)', fontSize: 14, fontWeight: 700, color: 'var(--g)', marginBottom: 5 }}>{'\u{1F948}'} Steuerberater Suite</div>
            <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.6 }}>Research fast fertig. {'\u20ac'}500M TAM. Parallel zu TennisCoach möglich.</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, flexShrink: 0 }}>
            <div className="sbox"><div className="sbv tc" style={{ fontSize: 22 }}>7</div><div className="sbl">Ideen</div></div>
            <div className="sbox"><div className="sbv tg" style={{ fontSize: 22 }}>2</div><div className="sbl">Research</div></div>
            <div className="sbox"><div className="sbv ta" style={{ fontSize: 22 }}>57%</div><div className="sbl">Conversion</div></div>
          </div>
        </div>
      </Card>

      {/* Pipeline Stats — col 7/9, row 1/2 */}
      <Card title="Pipeline Stats" badge="7 Ideen" badgeClass="bg" style={{ gridColumn: '7/9', gridRow: '1/2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
          <div style={{ fontFamily: 'var(--fh)', fontSize: 38, fontWeight: 800, color: 'var(--t1)', lineHeight: 1 }}>7</div>
          <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 6 }}>Ideen total</div>
          {([['Neu', '1', 'c'], ['Research', '2', 'a'], ['Planung', '1', 'g'], ['Geparkt', '3', 't3']] as const).map(s => (
            <div key={s[0]} className="dr">
              <span className="led" style={{ width: 7, height: 7, background: `var(--${s[2]})`, boxShadow: 'none', animation: 'none' }} />
              <span className="dl" style={{ fontSize: 13 }}>{s[0]}</span>
              <span style={{ fontFamily: 'var(--fh)', fontSize: 16, fontWeight: 700, color: `var(--${s[2]})` }}>{s[1]}</span>
            </div>
          ))}
          <div className="dv" />
          <button className="abtn s" onClick={() => alert('Research Agent...')}>{'\u2B21'} Research starten</button>
          <button className="abtn" onClick={() => alert('Projekt erstellt')}>{'\u25C8'} Als Projekt starten</button>
        </div>
      </Card>

      {/* Strategie — col 9/13, row 1/2 */}
      <Card title="Strategie" badge="4 Themen" badgeClass="bp" style={{ gridColumn: '9/13', gridRow: '1/2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
          <div style={{ fontFamily: 'var(--fh)', fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>Strategische Themen</div>
          {([
            ['\u{1F4A1}', 'Haiku Model-Routing', 'Strategie', 'a'],
            ['\u{1F916}', 'Instagram Memory Pipeline', 'Research', 'p'],
            ['\u{1F3D7}', 'MCKAY Skills erweitern', 'Skill', 'c'],
            ['\u{1F4C8}', 'Cross-Projekt Sharing', 'Business', 'g'],
          ] as const).map(s => (
            <div key={s[1]} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--inp)', border: '1px solid var(--b)', borderRadius: 10 }}>
              <span style={{ fontSize: 16 }}>{s[0]}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--t1)' }}>{s[1]}</div>
              </div>
              <span className={`bdg b${s[3]}`} style={{ fontSize: 9 }}>{s[2]}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 4 Idea Cards — row 2 */}
      {IDEAS.slice(0, 4).map((id, i) => {
        const pos = [['1/4', '2/3'], ['4/7', '2/3'], ['7/10', '2/3'], ['10/13', '2/3']]
        const stBadge = id.st === 'Planung' ? 'bg' : id.st === 'Research' ? 'ba' : id.st === 'Neu' ? 'bb' : id.st === 'Aktiv' ? 'bc' : 'br'
        return (
          <Card key={id.n} title={id.n} badge={id.st} badgeClass={stBadge} style={{ gridColumn: pos[i][0], gridRow: pos[i][1] }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexShrink: 0 }}>
              <div style={{ width: 8, height: 40, borderRadius: 4, background: id.col, flexShrink: 0, opacity: 0.7 }} />
              <div>
                <div style={{ fontFamily: 'var(--fh)', fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{id.n}</div>
                <div style={{ fontSize: 10, color: 'var(--t3)' }}>{id.cat} · {id.date}</div>
              </div>
              <span className={`bdg ${stBadge}`} style={{ marginLeft: 'auto' }}>{id.st}</span>
            </div>

            {/* Description */}
            <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 8, flexShrink: 0 }}>{id.txt}</div>

            {/* Ratings */}
            <div style={{ display: 'flex', gap: 5, flexShrink: 0, marginBottom: 8 }}>
              {([['Pot.', id.pot, 'a'], ['Speed', id.spd, 'g'], ['Risk', id.r, 'r'], ['Fit', id.f, 'c']] as const).map(r => (
                <div key={r[0]} style={{ textAlign: 'center', flex: 1, background: 'var(--inp)', borderRadius: 8, padding: '6px 4px', border: '1px solid var(--b)' }}>
                  <div style={{ fontFamily: 'var(--fh)', fontSize: 18, fontWeight: 800, color: `var(--${r[2]})` }}>{r[1]}</div>
                  <div style={{ fontSize: 8, color: 'var(--t3)', marginTop: 2 }}>{r[0]}</div>
                </div>
              ))}
            </div>

            {/* Repeat text */}
            <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5, flex: 1, minHeight: 0, overflow: 'hidden' }}>{id.txt}</div>

            <div className="dv" />

            {/* KANI Recommendation */}
            <div style={{ fontSize: 11, color: 'var(--c)', marginBottom: 8, flexShrink: 0, padding: '7px 10px', background: 'rgba(0,200,232,0.07)', borderRadius: 8, border: '1px solid rgba(0,200,232,0.18)' }}>{'\u2192'} KANI: {id.rec}</div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <button className="abtn s" style={{ margin: 0, flex: 1, fontSize: 11 }} onClick={() => alert('Research startet')}>{'\u{1F52C}'} Research</button>
              <button className="abtn p" style={{ margin: 0, flex: 1, fontSize: 11 }} onClick={() => alert('Projekt erstellt')}>{'\u25C8'} Projekt</button>
            </div>
          </Card>
        )
      })}
    </>
  )
}
