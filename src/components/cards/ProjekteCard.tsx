import type React from 'react'

const ATTENTION = [
  { title: 'Stillprobleme', badge: 'BLOCKED', type: 'blocked' as const, desc: 'Waiting for Supabase API credentials to continue.', meta: '\u23f1 2d waiting \u00b7 Phase 0', actions: [{ label: 'Provide', primary: true }, { label: 'Delegate' }] },
  { title: 'Hebammenbuero', badge: 'DECISION', type: 'decision' as const, desc: 'Calendar: Build custom vs Cal.com integration', meta: 'Architecture \u00b7 Impacts timeline', actions: [{ label: 'Custom', primary: true }, { label: 'Cal.com', primary: true }, { label: 'Compare' }] },
  { title: 'TennisCoach', badge: 'REVIEW', type: 'review' as const, desc: 'Preview deployment ready. All tests passing.', meta: '\u2713 47 tests \u00b7 Preview live', actions: [{ label: 'Approve', primary: true }, { label: 'Preview' }] },
  { title: 'FindeMeine', badge: 'REPORT', type: 'report' as const, desc: 'Weekly analytics by research-agent.', meta: '\u{1F4CA} 12 insights \u00b7 +23% traffic', actions: [{ label: 'View', primary: true }, { label: 'Summary' }] },
]

const PROJECTS = [
  { rank: '\u2605', name: 'Mission Control', sub: 'build-agent \u00b7 MVP in 2d', color: 'purple', pct: 67, trend: '\u2191', agents: '\u2022\u2022', cost: '\u20ac2.1k', spark: 'M0,18 L9,15 L18,16 L27,12 L36,9 L45,7 L54,5 L65,3' },
  { rank: '2', name: 'Hebammenbuero', sub: '2 agents \u00b7 MVP in 5d', color: 'green', pct: 45, trend: '\u2192', agents: '\u2022\u2022', cost: '\u20ac0.8k', spark: 'M0,14 L9,13 L18,15 L27,12 L36,14 L45,11 L54,13 L65,10' },
  { rank: '3', name: 'TennisCoach', sub: 'review \u00b7 Launch 3d', color: 'orange', pct: 80, trend: '\u2191', agents: '\u2022', cost: '\u20ac0.3k', spark: 'M0,20 L9,16 L18,18 L27,12 L36,8 L45,6 L54,4 L65,3' },
  { rank: '4', name: 'FindeMeine', sub: '\u20ac340/mo \u00b7 Maintenance', color: 'cyan', pct: 100, trend: '\u2191', agents: '\u2022', cost: '\u20ac1.2k', spark: 'M0,18 L9,14 L18,16 L27,10 L36,8 L45,6 L54,4 L65,3', live: true },
  { rank: '\u2014', name: 'Stillprobleme', sub: 'Waiting for credentials', color: 'red', pct: 23, trend: '\u23f8', agents: '\u25cb', cost: '\u20ac0.1k', spark: 'M0,11 L65,11', blocked: true },
]

const PIPELINE = [
  { name: 'Stillprobleme v2', tag: 'planning', tagClass: 'planning' },
  { name: 'Hebammen-App', tag: 'research', tagClass: 'research' },
  { name: 'MCKAY Mobile', tag: 'idea', tagClass: 'idea' },
]

const COLOR_RGB: Record<string, string> = {
  purple: '139,92,246',
  green: '16,185,129',
  orange: '245,158,11',
  cyan: '0,212,200',
  red: '239,68,68',
}

function projectRowStyle(color: string, blocked?: boolean): React.CSSProperties {
  const rgb = COLOR_RGB[color] || '239,68,68'
  return {
    display: 'grid',
    gridTemplateColumns: '20px 8px 1fr 55px 65px 30px 20px 35px',
    gap: 18,
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
    background: `linear-gradient(90deg, rgba(${rgb},0.1) 0%, transparent 100%)`,
    border: `1px solid rgba(${rgb},0.1)`,
    color: `var(--${color})`,
    opacity: blocked ? 0.65 : 1,
  }
}

export default function ProjekteCard() {
  return (
    <div className="card projekte">
      <div className="card-header">
        <div className="card-header-left"><span className="card-icon cyan" /><span className="card-title">Projekte</span></div>
        <div className="pills">
          <div className="pill"><span className="pill-dot" style={{ background: 'var(--orange)' }} /><span style={{ color: 'var(--orange)' }}>2</span> Attention</div>
          <div className="pill"><span className="pill-dot" style={{ background: 'var(--green)' }} /><span style={{ color: 'var(--green)' }}>4</span> Autopilot</div>
          <div className="pill"><span className="pill-dot" style={{ background: 'var(--red)' }} /><span style={{ color: 'var(--red)' }}>1</span> Blocked</div>
        </div>
        <div className="btns">
          <button className="btn"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>Briefing</button>
          <button className="btn primary"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>Portfolio</button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '200px 1fr 180px', gap: 18, padding: '16px 18px', overflow: 'hidden' }}>
        {/* Attention Queue */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 18, height: 18, borderRadius: 8, background: 'rgba(245,158,11,0.12)', color: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width={10} height={10} stroke="currentColor" strokeWidth={2} fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>
            </div>
            <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: 1.5 }}>Attention Queue</span>
            <span style={{ fontSize: 8, padding: '2px 7px', background: 'rgba(245,158,11,0.12)', color: 'var(--orange)', borderRadius: 10, marginLeft: 'auto' }}>4</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, overflowY: 'auto' }}>
            {ATTENTION.map(a => (
              <div key={a.title} className={`attention-item ${a.type}`} style={{ borderRadius: 12, padding: '12px 14px', borderLeft: '3px solid', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>{a.title}</span>
                  <span style={{ fontSize: 6, fontWeight: 700, padding: '2px 5px', borderRadius: 3, background: 'currentColor', color: 'var(--bg-dark)', letterSpacing: 0.5 }}>{a.badge}</span>
                </div>
                <div style={{ fontSize: 9, color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 8 }}>{a.desc}</div>
                <div style={{ fontSize: 8, color: 'var(--text-muted)', marginBottom: 8 }}>{a.meta}</div>
                <div style={{ display: 'flex', gap: 5 }}>
                  {a.actions.map(act => (
                    <button key={act.label} style={{ padding: '5px 10px', borderRadius: 5, fontSize: 8, fontWeight: 600, border: act.primary ? 'none' : '1px solid var(--border)', background: act.primary ? 'currentColor' : 'rgba(255,255,255,0.04)', color: act.primary ? 'var(--bg-dark)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)' }}>{act.label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', padding: 8, fontSize: 8, color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: 10, cursor: 'pointer', marginTop: 'auto' }}>{'\u2193'} 2 more items</div>
        </div>

        {/* Autopilot Monitor */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 18, height: 18, borderRadius: 8, background: 'rgba(0,212,200,0.12)', color: 'var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width={10} height={10} stroke="currentColor" strokeWidth={2} fill="none"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
              </div>
              <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: 1.5 }}>Autopilot Monitor</span>
            </div>
            <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.02)', padding: 3, borderRadius: 10 }}>
              <span style={{ padding: '5px 10px', fontSize: 8, color: 'var(--cyan)', borderRadius: 8, background: 'rgba(0,212,200,0.12)' }}>Active</span>
              <span style={{ padding: '5px 10px', fontSize: 8, color: 'var(--text-muted)', borderRadius: 8 }}>All 13</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10 }}>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{'\u20ac'}4.4k/w</span>
              <span style={{ fontSize: 9, color: 'var(--green)' }}>{'\u2193'}8%</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, overflowY: 'auto' }}>
            {PROJECTS.map(p => (
              <div key={p.name} className="project-row" style={projectRowStyle(p.color, p.blocked)} onClick={() => {
                const pid = p.name.toLowerCase().replace(/\s+/g, '-').slice(0, 3)
                window.open(`/project/${pid}`, '_blank', 'width=1440,height=900,menubar=no,toolbar=no')
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, textAlign: 'center', color: p.rank === '\u2605' ? 'var(--orange)' : 'var(--text-muted)', textShadow: p.rank === '\u2605' ? '0 0 10px var(--orange-glow)' : 'none', animation: p.rank === '\u2605' ? 'float 2s ease-in-out infinite' : 'none' }}>{p.rank}</span>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: `var(--${p.color})`, boxShadow: `0 0 15px var(--${p.color})`, animation: !p.blocked ? 'dotPulse 2s ease-in-out infinite' : 'none' }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {p.name}
                    {p.live && <span style={{ fontSize: 6, fontWeight: 700, color: 'var(--cyan)', background: 'rgba(0,212,200,0.12)', padding: '2px 5px', borderRadius: 3, animation: 'glowPulse 1.5s ease-in-out infinite' }}>{'\u25cf'} LIVE</span>}
                  </div>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 2 }}>{p.sub}</div>
                </div>
                <svg width={65} height={22} viewBox="0 0 65 22" style={{ filter: `drop-shadow(0 0 4px var(--${p.color}))` }}><path d={p.spark} fill="none" stroke={`var(--${p.color})`} strokeWidth={2} /></svg>
                <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.04)', overflow: 'hidden', position: 'relative' }}><div style={{ height: '100%', width: `${p.pct}%`, borderRadius: 3, background: 'currentColor', boxShadow: '0 0 12px currentColor', position: 'relative', overflow: 'hidden' }}><div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)', animation: 'shimmer 2s ease-in-out infinite' }} /></div></div>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', textAlign: 'right', textShadow: '0 0 8px currentColor' }}>{p.pct}</span>
                <span style={{ fontSize: 11, textAlign: 'center', color: p.trend === '\u2191' ? 'var(--green)' : 'inherit' }}>{p.trend}</span>
                <span style={{ fontSize: 9, color: 'var(--green)', letterSpacing: -1, textAlign: 'center' }}>{p.agents}</span>
                <span style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textAlign: 'right' }}>{p.cost}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 14, fontSize: 7, color: 'var(--text-muted)', paddingTop: 10, borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
            <span><span style={{ color: 'var(--green)' }}>{'\u25cf'}</span> Active</span>
            <span><span style={{ color: 'var(--text-muted)' }}>{'\u25cb'}</span> Idle</span>
            <span>{'\u2191\u2193\u2192'} Trend</span>
            <span>{'\u2022\u2022'} Agents</span>
            <span>{'\u20ac'} Cost/w</span>
          </div>
        </div>

        {/* Stats Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="stat-block" style={{ borderRadius: 12, padding: 12, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 65, height: 65, position: 'relative' }}>
                <svg viewBox="0 0 70 70" width={65} height={65} style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0 0 6px var(--cyan))' }}>
                  <circle cx={35} cy={35} r={28} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={5} />
                  <circle cx={35} cy={35} r={28} fill="none" stroke="url(#gaugeGrad)" strokeWidth={5} strokeLinecap="round" strokeDasharray={176} strokeDashoffset={84} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>52</span>
                  <span style={{ fontSize: 6, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Progress</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--green)', textShadow: '0 0 8px var(--green-glow)' }}>{'\u2191'}12%</span><span style={{ fontSize: 7, color: 'var(--text-muted)' }}>Velocity</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--purple)', textShadow: '0 0 8px var(--purple-glow)' }}>89%</span><span style={{ fontSize: 7, color: 'var(--text-muted)' }}>Autonomy</span></div>
              </div>
            </div>
          </div>
          <div className="stat-block" style={{ borderRadius: 12, padding: 12, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Pipeline {'\u00b7'} 3 planned</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PIPELINE.map(p => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 9 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)' }} />
                  <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{p.name}</span>
                  <span style={{ fontSize: 6, padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase', fontWeight: 600, background: p.tagClass === 'planning' ? 'rgba(139,92,246,0.12)' : p.tagClass === 'research' ? 'rgba(0,212,200,0.12)' : 'rgba(255,255,255,0.04)', color: p.tagClass === 'planning' ? 'var(--purple)' : p.tagClass === 'research' ? 'var(--cyan)' : 'var(--text-muted)' }}>{p.tag}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="stat-block" style={{ borderRadius: 12, padding: 12, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Milestones</div>
            {[['MC MVP', 'purple', '2d'], ['Tennis Launch', 'orange', '3d'], ['Hebammen MVP', 'green', '5d']].map(([n, c, d]) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 9, marginBottom: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: `var(--${c})` }} />
                <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{n}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: `var(--${c})` }}>{d}</span>
              </div>
            ))}
          </div>
          <div className="stat-block" style={{ borderRadius: 12, padding: 12, border: '1px solid var(--border)', background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, transparent 100%)', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pipeline ARR</span>
              <span style={{ fontSize: 9, color: 'var(--green)', fontWeight: 600 }}>{'\u2191'} +{'\u20ac'}12k</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--font-mono)', textShadow: '0 0 20px var(--green-glow)' }}>{'\u20ac'}45k</div>
            <div style={{ fontSize: 7, color: 'var(--text-muted)', marginTop: 2 }}>Potential across all projects</div>
          </div>
          <div className="stat-block" style={{ borderRadius: 12, padding: 12, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 8, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Weekly Burn</span>
            <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{'\u20ac'}4.4k<span style={{ fontSize: 9, color: 'var(--text-muted)' }}>/w</span></span>
          </div>
        </div>
      </div>
    </div>
  )
}
