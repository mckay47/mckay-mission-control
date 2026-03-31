import Card from '../ui/Card'
import { CAL } from '../../lib/data'

export default function Briefing() {
  return (
    <>
      {/* Rückblick — col 1/5, row 1/2 */}
      <Card title="Rückblick" badge="Gestern" badgeClass="bb" style={{ gridColumn: '1/5', gridRow: '1/2' }}>
        <div style={{ fontFamily: 'var(--fh)', fontSize: 22, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>Gestern</div>
        <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 10 }}>Montag, 31.03.2025</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10, flexShrink: 0 }}>
          {([['5/6', 'Todos', 'g'], ['2', 'Projekte', 'c'], ['8%', 'Fortschritt', 'g'], ['1', 'Neue Ideen', 'a']] as const).map(s => (
            <div key={s[1]} className="sbox"><div className={`sbv t${s[2]}`} style={{ fontSize: 22 }}>{s[0]}</div><div className="sbl">{s[1]}</div></div>
          ))}
        </div>
        <div className="dv" />
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 6 }}>Heute erledigt</div>
        <div className="dr"><span className="dl" style={{ fontSize: 12 }}>Tokens verbraucht</span><span className="dval" style={{ fontSize: 12 }}>24.2K</span></div>
        <div className="dr"><span className="dl" style={{ fontSize: 12 }}>Kosten gestern</span><span className="dval ta" style={{ fontSize: 12 }}>{'\u20ac'}4.20</span></div>
        <div className="dr"><span className="dl" style={{ fontSize: 12 }}>Effizienz-Score</span><span className="dval tg" style={{ fontSize: 12 }}>87/100</span></div>
        <div className="dv" />
        <div className="frow">
          {['Gestern', 'Letzte Woche', 'Letzter Monat'].map((f, i) => (
            <span key={f} className={`fpill${i === 0 ? ' act' : ''}`}>{f}</span>
          ))}
        </div>
      </Card>

      {/* KANI Advisory — col 5/9, row 1/2 */}
      <Card title="KANI Advisory" badge="Live" badgeClass="bb" style={{ gridColumn: '5/9', gridRow: '1/2' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <div className="kspin" style={{ width: 56, height: 56 }} />
            <div className="korb" style={{ width: 50, height: 50, fontSize: 22 }}>{'\u2B21'}</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--fh)', fontSize: 16, fontWeight: 700, color: 'var(--c)' }}>KANI Empfehlung</div>
            <div style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--fm)' }}>Generiert: Heute 09:15</div>
          </div>
        </div>
        <div style={{ fontFamily: 'var(--fh)', fontSize: 18, fontWeight: 700, color: 'var(--t1)', marginBottom: 8, flexShrink: 0 }}>Prioritäten für heute</div>
        {([
          ['01', 'TennisCoach \u2192 Deploy', '2h \u00b7 direkte Revenue', 'g'],
          ['02', 'Hebamme \u2192 Stripe Webhook', '1.5h \u00b7 Critical Path', 'c'],
          ['03', 'Stillprobleme MVP Scope', '45min \u00b7 Quick Win', 'a'],
        ] as const).map(p => (
          <div key={p[0]} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'rgba(0,200,232,0.06)', border: '1px solid rgba(0,200,232,0.15)', marginBottom: 6, flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--fh)', fontSize: 22, fontWeight: 800, color: `var(--${p[3]})`, opacity: 0.5 }}>{p[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: `var(--${p[3]})` }}>{p[1]}</div>
              <div style={{ fontSize: 11, color: 'var(--t3)' }}>{p[2]}</div>
            </div>
            <span className={`led l${p[3]}`} style={{ width: 8, height: 8 }} />
          </div>
        ))}
        <div className="dv" />
        <div style={{ fontSize: 12, color: 'var(--c)', fontStyle: 'italic', borderLeft: '3px solid rgba(0,200,232,0.4)', paddingLeft: 10, lineHeight: 1.6 }}>"Fokus auf TennisCoach — Deploy heute bedeutet Revenue ab morgen. Dann Stripe für Hebamme."</div>
      </Card>

      {/* KANI Insights — col 9/13, row 1/2 */}
      <Card title="KANI Insights" badge="4 neu" badgeClass="bp" style={{ gridColumn: '9/13', gridRow: '1/2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, minHeight: 0 }}>
          {([
            ['\u{1F4A1}', 'Synergie', 'Hebamme + Stillprobleme: 80% Code-Overlap nutzen', 'c'],
            ['\u{1F4CA}', 'Effizienz', 'Token-Verbrauch 20% unter \u00d8 — gut!', 'g'],
            ['\u26A0', 'Warnung', 'Stillprobleme 3 Tage ohne Commit', 'a'],
            ['\u{1F680}', 'Chance', 'Steuerberater: Wettbewerber erhöhen Preise jetzt', 'p'],
          ] as const).map(ins => (
            <div key={ins[1]} style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(0,200,232,0.05)', border: '1px solid rgba(0,200,232,0.12)', cursor: 'pointer', transition: 'all 0.18s' }}>
              <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 15 }}>{ins[0]}</span>
                <span style={{ fontFamily: 'var(--fh)', fontSize: 13, fontWeight: 700, color: `var(--${ins[3]})` }}>{ins[1]}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.5 }}>{ins[2]}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Vollständiges Briefing — col 1/7, row 2/3 */}
      <Card title="Vollständiges Briefing" badge="09:15" badgeClass="bg" style={{ gridColumn: '1/7', gridRow: '2/3' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 8 }}>
          <div style={{ fontFamily: 'var(--fh)', fontSize: 18, fontWeight: 700, color: 'var(--t1)', flexShrink: 0 }}>Vollständiges Briefing</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, flexShrink: 0 }}>
            {([['7.2h', 'Arbeit', 'g'], ['156', 'Prompts', 'c'], ['\u20ac4.20', 'Kosten', 'a']] as const).map(s => (
              <div key={s[1]} className="sbox">
                <div style={{ fontFamily: 'var(--fh)', fontSize: 22, fontWeight: 800, color: `var(--${s[2]})` }}>{s[0]}</div>
                <div className="sbl" style={{ marginTop: 4 }}>{s[1]}</div>
              </div>
            ))}
          </div>
          <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, fontSize: 13, color: 'var(--t2)', lineHeight: 1.85, background: 'var(--inp)', border: '1px solid var(--b)', borderRadius: 12, padding: '14px 16px' }}>
            <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--c)', fontFamily: 'var(--fh)', fontSize: 15 }}>Guten Morgen!</strong> Heute ist ein wichtiger Tag — TennisCoach steht kurz vor dem Launch.</p>
            <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--t1)' }}>TennisCoach</strong> ist bereit für Production Launch. Alle Tests grün, Vercel konfiguriert. <strong style={{ color: 'var(--g)' }}>Erste Priorität</strong> — 2h, direkte Revenue ab morgen.</p>
            <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--t1)' }}>Hebammenbuero</strong> wartet auf Stripe. Review-Call heute 14:00 ist kritisch. Feature-Freeze in 2 Tagen.</p>
            <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--t1)' }}>FindeMeine</strong> läuft stabil — 12 neue User gestern. SEO diese Woche nebenbei.</p>
            <p><strong style={{ color: 'var(--t1)' }}>Stillprobleme</strong> — 3 Tage keine Aktivität. MVP-Scope heute kurz definieren reicht.</p>
          </div>
        </div>
      </Card>

      {/* Termine & Actions — col 7/13, row 2/3 */}
      <Card title="Termine & Actions" badge="Heute" badgeClass="bb" style={{ gridColumn: '7/13', gridRow: '2/3' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 8 }}>
          <div className="lbl" style={{ flexShrink: 0 }}>Termine heute</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
            {CAL.filter(e => e.today).map(e => (
              <div key={e.t} style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 11, background: 'rgba(0,200,232,0.07)', border: '1px solid rgba(0,200,232,0.22)', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--fh)', fontSize: 16, fontWeight: 800, color: 'var(--c)', width: 48, flexShrink: 0, lineHeight: 1.3 }}>{e.t}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{e.n}</div>
                  <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>{e.s}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="dv" />
          <div className="lbl" style={{ flexShrink: 0 }}>Diese Woche</div>
          <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {CAL.filter(e => !e.today).map(e => (
              <div key={e.t} style={{ display: 'flex', gap: 10, padding: '8px 12px', borderRadius: 10, background: 'var(--inp)', border: '1px solid var(--b)' }}>
                <div style={{ fontFamily: 'var(--fm)', fontSize: 12, color: 'var(--t3)', width: 48, flexShrink: 0 }}>{e.t}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--t2)' }}>{e.n}</div>
                  <div style={{ fontSize: 10, color: 'var(--t3)' }}>{e.s}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="dv" />
          <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
            <button className="abtn p" style={{ flex: 1, margin: 0, fontSize: 11 }} onClick={() => alert('Briefing generiert...')}>{'\u2600'} Briefing</button>
            <button className="abtn s" style={{ flex: 1, margin: 0, fontSize: 11 }} onClick={() => alert('Todos erstellt')}>+ Todos</button>
          </div>
        </div>
      </Card>
    </>
  )
}
