import Card from '../ui/Card'
import { CAL } from '../../lib/data'

const hours: [string, string, string, string, boolean][] = [
  ['08', 'Deep Work', 'Block 1', 'g', true],
  ['09', '', '', '', false],
  ['10', 'Call Designer', 'Figma Review', 'c', true],
  ['11', '', '', '', false],
  ['12', 'Mittagspause', 'Buffer', 't3', false],
  ['13', '', '', '', false],
  ['14', 'TennisCoach', 'Go/No-Go', 'a', true],
  ['15', '', '', '', false],
  ['16', '', '', '', false],
  ['17', 'Deep Work', 'Block 2', 'g', false],
  ['18', 'Feierabend', '', '', false],
]

const days: [string, string, boolean][] = [
  ['Mo', '31.03', true],
  ['Di', '01.04', false],
  ['Mi', '02.04', false],
  ['Do', '03.04', false],
  ['Fr', '04.04', false],
]

export default function Office() {
  return (
    <>
      {/* Nächster Termin — col 1/5, row 1/2 */}
      <Card title="Nächster Termin" badge="10:00 Heute" badgeClass="bb" style={{ gridColumn: '1/5', gridRow: '1/2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 8 }}>
          <div style={{ fontFamily: 'var(--fh)', fontSize: 56, fontWeight: 800, color: 'var(--c)', lineHeight: 1, textShadow: '0 0 30px rgba(0,200,232,0.3)' }}>2h 14m</div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'var(--t3)', fontFamily: 'var(--fh)' }}>Bis zum nächsten Termin</div>
          <div className="dv" />
          <div style={{ background: 'rgba(0,200,232,0.08)', border: '1px solid rgba(0,200,232,0.25)', borderRadius: 14, padding: '14px 16px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontFamily: 'var(--fh)', fontSize: 22, fontWeight: 800, color: 'var(--c)' }}>10:00</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>Call mit Designer</div>
                <div style={{ fontSize: 12, color: 'var(--t3)' }}>Figma Review · Hebammenbuero · 45min</div>
              </div>
            </div>
          </div>
          <div style={{ background: 'var(--inp)', border: '1px solid var(--b)', borderRadius: 14, padding: '14px 16px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontFamily: 'var(--fh)', fontSize: 22, fontWeight: 800, color: 'var(--t2)' }}>14:00</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>TennisCoach Launch Review</div>
                <div style={{ fontSize: 12, color: 'var(--t3)' }}>Go/No-Go · 30min</div>
              </div>
            </div>
          </div>
          <div className="dv" />
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button className="abtn p" style={{ flex: 1, margin: 0, fontSize: 12 }} onClick={() => alert('Google Calendar...')}>{'\u{1F4C5}'} Calendar öffnen</button>
            <button className="abtn s" style={{ flex: 1, margin: 0, fontSize: 12 }} onClick={() => alert('Termin erstellt')}>+ Termin</button>
          </div>
        </div>
      </Card>

      {/* Tagesplan — col 5/9, row 1/2 */}
      <Card title="Tagesplan" badge="Heute" badgeClass="bg" style={{ gridColumn: '5/9', gridRow: '1/2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflowY: 'auto', gap: 0 }}>
          {hours.map(h => {
            const hasBg = h[3] && h[3] !== 't3' && h[3] !== ''
            return (
              <div key={h[0]} style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: '1px solid var(--b)', flexShrink: 0, minHeight: 32, alignItems: 'center' }}>
                <div style={{ fontFamily: 'var(--fm)', fontSize: 11, color: 'var(--t4)', width: 24, flexShrink: 0 }}>{h[0]}</div>
                <div style={{ width: 3, background: hasBg ? `var(--${h[3]})` : 'var(--b)', borderRadius: 2, alignSelf: 'stretch', flexShrink: 0 }} />
                {h[1] ? (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: hasBg ? `var(--${h[3]})` : 'var(--t2)' }}>{h[1]}</div>
                    {h[2] && <div style={{ fontSize: 10, color: 'var(--t3)' }}>{h[2]}</div>}
                  </div>
                ) : (
                  <div style={{ flex: 1, fontSize: 11, color: 'var(--t4)' }}>Frei</div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Fokus & Zeit — col 9/13, row 1/2 */}
      <Card title="Fokus & Zeit" badge="Heute" badgeClass="bg" style={{ gridColumn: '9/13', gridRow: '1/2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flexShrink: 0 }}>
            {([['3.5h', 'Fokus', 'g'], ['1.25h', 'Meetings', 'c'], ['7.2h', 'Screen', 't1'], ['2.8', 'F:M Ratio', 'a']] as const).map(s => (
              <div key={s[1]} className="sbox">
                <div style={{ fontFamily: 'var(--fh)', fontSize: 28, fontWeight: 800, color: `var(--${s[2]})`, lineHeight: 1 }}>{s[0]}</div>
                <div className="sbl" style={{ marginTop: 5 }}>{s[1]}</div>
              </div>
            ))}
          </div>
          <div className="dv" />
          <div className="lbl" style={{ marginBottom: 6, flexShrink: 0 }}>Deep Work Blöcke</div>
          {([
            ['08:00\u201310:00', 'Block 1', 'Hoch produktiv', 'g'],
            ['16:30\u201318:00', 'Block 2', 'Geplant', 'c'],
          ] as const).map(b => (
            <div key={b[1]} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 12px', background: 'rgba(0,232,136,0.07)', border: '1px solid rgba(0,232,136,0.2)', borderRadius: 11, flexShrink: 0, marginBottom: 5 }}>
              <div style={{ fontFamily: 'var(--fm)', fontSize: 12, color: `var(--${b[3]})`, flexShrink: 0 }}>{b[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{b[1]}</div>
                <div style={{ fontSize: 10, color: 'var(--t3)' }}>{b[2]}</div>
              </div>
              <span className={`led l${b[3]}`} />
            </div>
          ))}
          <div className="dv" />
          <button className="abtn" style={{ fontSize: 12 }} onClick={() => alert('Feierabend!')}>{'\u{1F319}'} Feierabend</button>
        </div>
      </Card>

      {/* Diese Woche — col 1/7, row 2/3 */}
      <Card title="Diese Woche" badge="5 Termine" badgeClass="bg" style={{ gridColumn: '1/7', gridRow: '2/3' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6, marginBottom: 8, flexShrink: 0 }}>
          {days.map(d => (
            <div key={d[0]} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: 10, background: d[2] ? 'rgba(0,200,232,0.12)' : 'var(--inp)', border: `1px solid ${d[2] ? 'rgba(0,200,232,0.35)' : 'var(--b)'}` }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: d[2] ? 'var(--c)' : 'var(--t3)', letterSpacing: '0.1em' }}>{d[0]}</div>
              <div style={{ fontFamily: 'var(--fh)', fontSize: 16, fontWeight: 700, color: d[2] ? 'var(--c)' : 'var(--t2)' }}>{d[1].slice(0, 2)}</div>
            </div>
          ))}
        </div>
        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {CAL.map(e => (
            <div key={e.t + e.n} style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 11, background: e.today ? 'rgba(0,200,232,0.07)' : 'var(--inp)', border: `1px solid ${e.today ? 'rgba(0,200,232,0.22)' : 'var(--b)'}` }}>
              <div style={{ fontFamily: 'var(--fh)', fontSize: 14, fontWeight: 700, color: e.today ? 'var(--c)' : 'var(--t3)', width: 52, flexShrink: 0 }}>{e.t}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{e.n}</div>
                <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>{e.s}</div>
              </div>
              {e.today && <span className="led lg" style={{ width: 6, height: 6, flexShrink: 0, marginTop: 4 }} />}
            </div>
          ))}
        </div>
      </Card>

      {/* E-Mail — col 7/13, row 2/3 */}
      <Card title="E-Mail" badge="23 Ungelesen" badgeClass="br" style={{ gridColumn: '7/13', gridRow: '2/3' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, flexShrink: 0 }}>
            {([['23', 'Ungelesen', 'r'], ['5', 'Beantwortet', 'g'], ['3', 'Delegiert', 'c']] as const).map(s => (
              <div key={s[1]} className="sbox">
                <div style={{ fontFamily: 'var(--fh)', fontSize: 32, fontWeight: 800, color: `var(--${s[2]})`, lineHeight: 1 }}>{s[0]}</div>
                <div className="sbl" style={{ marginTop: 5 }}>{s[1]}</div>
              </div>
            ))}
          </div>
          <div className="dv" />
          <div className="lbl" style={{ marginBottom: 5, flexShrink: 0 }}>Priorität Posteingang</div>
          {([
            ['\u{1F4E7} Figma Team', 'Re: Mockup Feedback', 'Heute 08:42', 'r'],
            ['\u{1F4E7} Stripe Support', 'Invoice #2024-038', 'Heute 07:15', 'a'],
            ['\u{1F4E7} Supabase', 'Usage Limit 80%', 'Gestern', 'c'],
            ['\u{1F4E7} GitHub', 'PR Review TennisCoach', 'Gestern', 'g'],
          ] as const).map(m => (
            <div key={m[1]} style={{ display: 'flex', gap: 8, padding: '8px 10px', borderRadius: 10, background: 'var(--inp)', border: '1px solid var(--b)', cursor: 'pointer', transition: 'all 0.18s', flexShrink: 0 }}>
              <span style={{ fontSize: 13 }}>{m[0].split(' ')[0]}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m[0].slice(2)}</div>
                <div style={{ fontSize: 10, color: 'var(--t3)' }}>{m[1]}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 9, color: 'var(--t4)' }}>{m[2]}</div>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: `var(--${m[3]})`, margin: '3px 0 0 auto' }} />
              </div>
            </div>
          ))}
          <div className="dv" />
          <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
            <button className="abtn p" style={{ flex: 1, margin: 0, fontSize: 11 }} onClick={() => alert('Postfach öffnet...')}>{'\u{1F4E7}'} Postfach</button>
            <button className="abtn" style={{ flex: 1, margin: 0, fontSize: 11 }} onClick={() => alert('KANI triagiert...')}>{'\u2B21'} KANI Triage</button>
          </div>
        </div>
      </Card>
    </>
  )
}
