import { useState } from 'react'

const TODOS_TODAY = [
  { text: 'Auth-Flow finalisieren', proj: 'MC', projColor: 'purple', time: '45m', tag: 'high' },
  { text: 'Kalender-API integrieren', proj: 'HB', projColor: 'green', time: '30m', tag: 'agent' },
  { text: 'Deploy Preview testen', proj: 'TC', projColor: 'orange', time: '15m' },
  { text: 'Dashboard Grid finalisieren', proj: 'MC', projColor: 'purple', time: '60m' },
  { text: 'Analytics-Report reviewen', proj: 'FM', projColor: 'cyan', time: '20m' },
]

const TODOS_DONE = [
  { text: 'Analytics Review', proj: 'FM', projColor: 'cyan' },
  { text: 'Projekt-Card Design', proj: 'MC', projColor: 'purple' },
]

const TOP_PROJECTS = [
  { rank: 1, name: 'Mission Control', count: 4, pct: 80, color: 'purple' },
  { rank: 2, name: 'Hebammenbuero', count: 3, pct: 60, color: 'green' },
  { rank: 3, name: 'TennisCoach', count: 2, pct: 40, color: 'orange' },
]

export default function TodosCard() {
  const [checked, setChecked] = useState<Record<number, boolean>>({})

  return (
    <div className="card todos">
      <div className="card-header">
        <div className="card-header-left"><span className="card-icon green" /><span className="card-title">Todos</span></div>
        <div className="pills">
          <div className="pill"><span className="pill-dot" style={{ background: 'var(--red)' }} /><span style={{ color: 'var(--red)' }}>1</span> Overdue</div>
          <div className="pill"><span className="pill-dot" style={{ background: 'var(--cyan)' }} /><span style={{ color: 'var(--cyan)' }}>8</span> Today</div>
          <div className="pill"><span className="pill-dot" style={{ background: 'var(--green)' }} /><span style={{ color: 'var(--green)' }}>2</span> Done</div>
        </div>
        <div className="btns">
          <button className="btn"><svg viewBox="0 0 24 24" width={10} height={10} stroke="currentColor" strokeWidth={2} fill="none"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>Kanban</button>
          <button className="btn primary"><svg viewBox="0 0 24 24" width={10} height={10} stroke="currentColor" strokeWidth={2} fill="none"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>Neu</button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 170px', gap: 16, padding: '14px 16px', overflow: 'hidden' }}>
        {/* Left: Overdue + Projects */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: 'linear-gradient(145deg, rgba(239,68,68,0.08) 0%, transparent 100%)', borderRadius: 14, padding: 12, border: '1px solid rgba(239,68,68,0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 16, height: 16, borderRadius: 5, background: 'rgba(239,68,68,0.15)', color: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width={9} height={9} stroke="currentColor" strokeWidth={2} fill="none"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              </div>
              <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: 1 }}>{'\u00dc'}berf{'\u00e4'}llig</span>
              <span style={{ fontSize: 7, padding: '2px 6px', background: 'rgba(239,68,68,0.12)', color: 'var(--red)', borderRadius: 8, marginLeft: 'auto' }}>1</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '10px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.08)', cursor: 'pointer' }}>
              <div style={{ width: 14, height: 14, border: '2px solid var(--red)', borderRadius: 4 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--red)' }}>API Credentials eintragen</div>
                <div style={{ fontSize: 7, color: 'var(--text-muted)', marginTop: 2 }}>Stillprobleme {'\u00b7'} 2d {'\u00fc'}berf{'\u00e4'}llig</div>
              </div>
              <span style={{ fontSize: 7, color: 'var(--red)', background: 'rgba(239,68,68,0.12)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>blocked</span>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(145deg, rgba(139,92,246,0.06) 0%, transparent 100%)', borderRadius: 14, padding: 12, border: '1px solid rgba(139,92,246,0.1)', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 16, height: 16, borderRadius: 5, background: 'rgba(139,92,246,0.12)', color: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width={9} height={9} stroke="currentColor" strokeWidth={2} fill="none"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
              </div>
              <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--violet)', textTransform: 'uppercase', letterSpacing: 1 }}>Projects by Todos</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
              {TOP_PROJECTS.map(p => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border)', cursor: 'pointer' }}>
                  <span style={{ fontSize: 8, color: 'var(--text-muted)', width: 14 }}>{p.rank}</span>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: `var(--${p.color})`, boxShadow: `0 0 10px var(--${p.color})` }} />
                  <span style={{ flex: 1, fontSize: 10, fontWeight: 500 }}>{p.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{p.count}</span>
                  <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}><div style={{ height: '100%', width: `${p.pct}%`, borderRadius: 2, background: `var(--${p.color})` }} /></div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
              {[['FindeMeine', 'cyan', 2], ['Stillprobleme', 'red', 1], ['MCKAY Mobile', 'violet', 2]].map(([n, c, count]) => (
                <div key={n as string} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 7, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: `var(--${c})` }} />{n} ({count})
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Today */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 16, height: 16, borderRadius: 5, background: 'rgba(0,212,200,0.12)', color: 'var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width={9} height={9} stroke="currentColor" strokeWidth={2} fill="none"><circle cx="12" cy="12" r="10" /></svg>
            </div>
            <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: 1 }}>Heute</span>
            <span style={{ fontSize: 7, padding: '2px 6px', background: 'rgba(0,212,200,0.12)', color: 'var(--cyan)', borderRadius: 8, marginLeft: 'auto' }}>8</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1, overflowY: 'auto' }}>
            {TODOS_TODAY.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'rgba(0,0,0,0.15)', borderRadius: 10, borderLeft: `2px solid var(--${t.projColor})`, cursor: 'pointer', opacity: checked[i] ? 0.45 : 1, transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)' }} onClick={() => setChecked(c => ({ ...c, [i]: !c[i] }))}>
                <div style={{ width: 14, height: 14, borderRadius: 4, border: checked[i] ? 'none' : '2px solid var(--text-muted)', background: checked[i] ? 'var(--green)' : 'transparent', boxShadow: checked[i] ? '0 0 12px var(--green-glow)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 8, color: '#fff', fontWeight: 700 }}>{checked[i] ? '\u2713' : ''}</div>
                <span style={{ flex: 1, fontSize: 9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textDecoration: checked[i] ? 'line-through' : 'none' }}>{t.text}</span>
                <span style={{ fontSize: 6, padding: '2px 5px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 4, height: 4, borderRadius: '50%', background: `var(--${t.projColor})` }} />{t.proj}</span>
                {t.time && <span style={{ fontSize: 7, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{t.time}</span>}
                {t.tag === 'high' && <span style={{ fontSize: 6, padding: '2px 5px', borderRadius: 3, textTransform: 'uppercase', fontWeight: 600, background: 'rgba(239,68,68,0.12)', color: 'var(--red)' }}>High</span>}
                {t.tag === 'agent' && <span style={{ fontSize: 6, padding: '2px 5px', borderRadius: 3, textTransform: 'uppercase', fontWeight: 600, background: 'rgba(139,92,246,0.12)', color: 'var(--purple)' }}>{'\u2192'} agent</span>}
              </div>
            ))}
            {TODOS_DONE.map((t, i) => (
              <div key={`d${i}`} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'rgba(0,0,0,0.15)', borderRadius: 10, borderLeft: `2px solid var(--${t.projColor})`, opacity: 0.45 }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--green)', boxShadow: '0 0 12px var(--green-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 8, color: '#fff', fontWeight: 700 }}>{'\u2713'}</div>
                <span style={{ flex: 1, fontSize: 9, textDecoration: 'line-through' }}>{t.text}</span>
                <span style={{ fontSize: 6, padding: '2px 5px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 4, height: 4, borderRadius: '50%', background: `var(--${t.projColor})` }} />{t.proj}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', padding: 6, fontSize: 7, color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: 8, cursor: 'pointer', marginTop: 6 }}>{'\u2193'} 2 weitere Todos</div>
        </div>

        {/* Right: Focus + Perf + Milestones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ background: 'linear-gradient(145deg, rgba(0,212,200,0.08) 0%, transparent 100%)', border: '1px solid rgba(0,212,200,0.12)', borderRadius: 14, padding: 14, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 8, fontWeight: 600, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, position: 'relative' }}>
              <span style={{ width: 6, height: 6, background: 'var(--cyan)', borderRadius: '50%', boxShadow: '0 0 15px var(--cyan-glow)', animation: 'dotPulse 1.5s ease-in-out infinite' }} />Focus Mode
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, position: 'relative' }}>Auth-Flow finalisieren</div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)', display: 'flex', gap: 18, marginBottom: 12, position: 'relative' }}>
              <span style={{ color: 'var(--purple)' }}>{'\u25cf'} MC</span>
              <span style={{ color: 'var(--cyan)' }}>{'\u23f1'} ~45 min</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 12, position: 'relative' }}>
              <div style={{ width: 50, height: 50, position: 'relative' }}>
                <svg viewBox="0 0 50 50" width={50} height={50} style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0 0 8px var(--cyan-glow))' }}>
                  <circle cx={25} cy={25} r={20} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={4} />
                  <circle cx={25} cy={25} r={20} fill="none" stroke="url(#timerGrad)" strokeWidth={4} strokeLinecap="round" strokeDasharray={125.6} strokeDashoffset={0} />
                </svg>
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textShadow: '0 0 15px var(--cyan-glow)' }}>45:00</span>
            </div>
            <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
              <button style={{ flex: 1, padding: 8, border: 'none', borderRadius: 10, fontSize: 9, fontWeight: 700, cursor: 'pointer', background: 'linear-gradient(135deg, var(--cyan), var(--green))', color: 'var(--bg-dark)', boxShadow: '0 0 20px var(--cyan-glow)' }}>{'\u25b6'} Start</button>
              <button style={{ flex: 1, padding: 8, border: '1px solid var(--border)', borderRadius: 10, fontSize: 9, fontWeight: 700, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)' }}>{'\u2713'} Done</button>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 12, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Performance</div>
            <div style={{ display: 'flex', gap: 18, marginBottom: 10 }}>
              <div><div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>67%</div><div style={{ fontSize: 6, color: 'var(--text-muted)' }}>Completion</div></div>
              <div><div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>4.2h</div><div style={{ fontSize: 6, color: 'var(--text-muted)' }}>Focus/Tag</div></div>
            </div>
            <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 32 }}>
              {[30, 50, 40, 60, 45, 30, 55].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--green)', borderRadius: 2, opacity: i === 6 ? 1 : 0.35, boxShadow: i === 6 ? '0 0 12px var(--green-glow)' : 'none' }} />
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 12, border: '1px solid var(--border)', flex: 1 }}>
            <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Milestones</div>
            {[['MC MVP', 'purple', '2d'], ['Tennis Launch', 'orange', '3d']].map(([n, c, d]) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 9, marginBottom: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: `var(--${c})` }} />
                <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{n}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: `var(--${c})` }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
