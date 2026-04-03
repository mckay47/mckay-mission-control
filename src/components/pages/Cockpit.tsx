import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../shared/AppShell'
import Notifications from '../shared/Notifications'
import QuickAccess from '../shared/QuickAccess'
import LiveFeed from '../shared/LiveFeed'
import { PROJ, TODOS, AGENTS } from '../../lib/data'
import type { Project } from '../../lib/types'

/* ── Helpers ─────────────────────────────────────────── */

function statusOf(p: Project): { label: string; status: string; bg: string; color: string; ledClass: string; ledStyle?: React.CSSProperties } {
  if (p.phase === 'LIVE') return { label: '\u2605 Live', status: 'live', bg: 'var(--blc)', color: 'var(--bl)', ledClass: 'sl b' }
  if (p.term === 'Waiting' && p.health === 'Attention') return { label: '\u26A0 Blocked', status: 'blocked', bg: 'var(--rc)', color: 'var(--r)', ledClass: 'sl r' }
  if (p.term === 'Waiting') return { label: '\u23F8 Pause', status: 'pause', bg: 'var(--ac)', color: 'var(--a)', ledClass: 'sl a', ledStyle: { animation: 'none' } }
  if (p.term === 'Idle') return { label: 'Idle', status: 'idle', bg: 'rgba(0,0,0,0.04)', color: 'var(--tx3)', ledClass: 'sl off', ledStyle: { width: 8, height: 8 } }
  // Active
  return { label: '\u25CF Aktiv', status: 'active', bg: 'var(--gc)', color: 'var(--g)', ledClass: 'sl g' }
}

function colToVar(col: string): { color: string; glow: string; hov: string; ultra: string } {
  switch (col) {
    case 'var(--bl)': return { color: 'var(--bl)', glow: 'var(--blg)', hov: 'var(--blg)', ultra: 'var(--blu)' }
    case 'var(--g)': return { color: 'var(--g)', glow: 'var(--gg)', hov: 'var(--gg)', ultra: 'var(--gu)' }
    case 'var(--a)': return { color: 'var(--a)', glow: 'var(--ag)', hov: 'var(--ag)', ultra: 'var(--au)' }
    case 'var(--p)': return { color: 'var(--p)', glow: 'var(--pg)', hov: 'var(--pg)', ultra: 'var(--pu)' }
    case 'var(--c)': return { color: 'var(--c)', glow: 'var(--cg)', hov: 'var(--cg)', ultra: 'var(--cu)' }
    case 'var(--o)': return { color: 'var(--o)', glow: 'var(--og)', hov: 'var(--og)', ultra: 'var(--ou)' }
    case 'var(--t)': return { color: 'var(--t)', glow: 'var(--tg)', hov: 'var(--tg)', ultra: 'var(--tu)' }
    default: return { color: 'var(--g)', glow: 'var(--gg)', hov: 'var(--gg)', ultra: 'var(--gu)' }
  }
}

function prioLabel(p: string): { label: string; bg: string; color: string } {
  switch (p) {
    case 'h': return { label: 'P0', bg: 'var(--rc)', color: 'var(--r)' }
    case 'm': return { label: 'P1', bg: 'rgba(124,77,255,.06)', color: 'var(--p)' }
    case 'l': return { label: 'P2', bg: 'rgba(124,77,255,.06)', color: 'var(--tx3)' }
    default: return { label: 'P1', bg: 'rgba(124,77,255,.06)', color: 'var(--p)' }
  }
}

function projLabel(projId: string): { name: string; dotColor: string; dotGlow: string } {
  const found = PROJ.find(p => p.n === projId || p.id === projId || p.n.startsWith(projId))
  if (found) {
    const cv = colToVar(found.col)
    return { name: found.n.length > 12 ? found.n.slice(0, 12) : found.n, dotColor: cv.color, dotGlow: cv.glow }
  }
  return { name: projId || 'MCKAY OS', dotColor: 'var(--tx3)', dotGlow: 'transparent' }
}

/* ── Main grid: first 9 projects sorted by activity ── */

const MAIN_PROJECTS = PROJ.slice(0, 9)
const OVERFLOW_PROJECTS = PROJ.slice(9)

/* ── Component ──────────────────────────────────────────── */

export default function Cockpit() {
  const navigate = useNavigate()
  const [pipelineOpen, setPipelineOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState(0)

  /* KPIs computed from real data */
  const openTodos = useMemo(() => TODOS.filter(t => !t.done), [])
  const overdueTodos = useMemo(() => openTodos.filter(t => t.ov), [openTodos])
  const activeProjects = useMemo(() => PROJ.filter(p => p.term === 'Active'), [])
  const blockedProjects = useMemo(() => PROJ.filter(p => (p.term === 'Waiting' && p.health === 'Attention')), [])

  /* Pipeline groups computed from PROJ */
  const pipelineGroups = useMemo(() => {
    const aktiv = PROJ.filter(p => p.term === 'Active')
    const blocked = PROJ.filter(p => p.term === 'Waiting' && p.health === 'Attention')
    const live = PROJ.filter(p => p.phase === 'LIVE')
    const pause = PROJ.filter(p => p.term === 'Waiting' && p.health !== 'Attention')
    const idle = PROJ.filter(p => p.term === 'Idle')
    return [
      { color: 'var(--g)', glow: 'var(--gg)', label: 'Aktiv', count: aktiv.length, items: aktiv.map(p => `${p.n} \u2014 ${p.pct}%`) },
      { color: 'var(--r)', glow: 'var(--rg)', label: 'Blocked', count: blocked.length, items: blocked.map(p => `${p.n}`) },
      { color: 'var(--bl)', glow: 'var(--blg)', label: 'Live', count: live.length, items: live.map(p => `${p.n} \u2014 ${p.pct}%`) },
      { color: 'var(--a)', glow: 'var(--ag)', label: 'Pause', count: pause.length, items: pause.map(p => `${p.n}`) },
      { color: 'var(--tx3)', glow: 'transparent', label: 'Idle', count: idle.length, items: idle.map(p => p.n) },
    ].filter(g => g.count > 0)
  }, [])

  /* Todo filters computed from real data */
  const todoFilters = useMemo(() => {
    // Get unique project prefixes from open todos
    const projCounts: Record<string, { count: number; proj: Project | undefined }> = {}
    openTodos.forEach(t => {
      const key = t.proj || '_global'
      if (!projCounts[key]) {
        projCounts[key] = { count: 0, proj: PROJ.find(p => p.n === t.proj || p.id === t.proj || p.n.startsWith(t.proj)) }
      }
      projCounts[key].count++
    })
    // Top 4 project filters by count
    const sorted = Object.entries(projCounts)
      .filter(([k]) => k !== '_global')
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 4)

    const filters: { label: string; count: number; bgColor?: string; textColor?: string; projKey?: string }[] = [
      { label: 'Alle', count: openTodos.length },
    ]
    sorted.forEach(([key, val]) => {
      const cv = val.proj ? colToVar(val.proj.col) : { color: 'var(--tx3)', glow: 'transparent' }
      const name = val.proj ? (val.proj.n.length > 8 ? val.proj.n.slice(0, 8) : val.proj.n) : key
      filters.push({
        label: name,
        count: val.count,
        bgColor: `rgba(${val.proj?.cr || '0,0,0'}, 0.1)`,
        textColor: cv.color,
        projKey: key,
      })
    })
    return filters
  }, [openTodos])

  /* Filtered + sorted todos: high prio first, then overdue, max 6 displayed */
  const filteredTodos = useMemo(() => {
    let todos = openTodos
    if (activeFilter > 0 && todoFilters[activeFilter]?.projKey) {
      const key = todoFilters[activeFilter].projKey!
      todos = todos.filter(t => t.proj === key || t.proj.startsWith(key))
    }
    return todos
      .sort((a, b) => {
        const pMap: Record<string, number> = { h: 0, m: 1, l: 2 }
        return (pMap[a.prio] ?? 1) - (pMap[b.prio] ?? 1)
      })
      .slice(0, 6)
  }, [openTodos, activeFilter, todoFilters])

  const remainingTodos = openTodos.length - 6

  return (
    <AppShell>
      {/* ── KPI ROW ── */}
      <div className="krow">
        {/* Aktiv */}
        <div className="kpi cf" style={{ '--kc': 'var(--gg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--gg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--g)">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--g)' }}>{activeProjects.length}</div>
            <div className="kl">Aktiv</div>
          </div>
        </div>

        {/* Blocked */}
        <div className="kpi cf" style={{ '--kc': 'var(--rg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--rg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--r)">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--r)' }}>{blockedProjects.length}</div>
            <div className="kl">Blocked</div>
          </div>
        </div>

        {/* Todos */}
        <div className="kpi cf" style={{ '--kc': 'var(--ag)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--ag)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--a)">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
            </svg>
          </div>
          <div>
            <div className="kv">{openTodos.length}</div>
            <div className="kl">Todos</div>
          </div>
          {overdueTodos.length > 0 && (
            <span className="kx" style={{ background: 'var(--rc)', color: 'var(--r)' }}>{overdueTodos.length} overdue</span>
          )}
        </div>

        {/* Terminals */}
        <div className="kpi cf" style={{ '--kc': 'var(--blg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--blg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--bl)">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--bl)' }}>{AGENTS.filter(a => a.st === 'active').length}</div>
            <div className="kl">Agents</div>
          </div>
        </div>

        {/* Capture */}
        <div className="capc cf" style={{ '--kc': 'var(--pg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--pg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--p)">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <input className="in" placeholder="Schnelle Idee festhalten..." />
          <button>Capture</button>
        </div>
      </div>

      {/* ── PIPELINE BAR ── */}
      <div style={{ padding: '0 40px', marginBottom: 12, flexShrink: 0 }}>
        <div className="cf" style={{ overflow: 'hidden' }}>
          {/* Collapsed bar */}
          <div
            style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', transition: 'all .3s' }}
            onClick={() => setPipelineOpen((p) => !p)}
          >
            <span className="st" style={{ whiteSpace: 'nowrap' }}>Projekt Status</span>
            <div className="in" style={{ flex: 1, height: 10, borderRadius: 5, display: 'flex', gap: 3, overflow: 'hidden' }}>
              {pipelineGroups.map((g) => (
                <div
                  key={g.label}
                  style={{
                    flex: g.count,
                    height: '100%',
                    borderRadius: 4,
                    background: g.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 7,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,.8)',
                    opacity: g.label === 'Idle' ? 0.3 : 1,
                  }}
                >
                  {g.count}
                </div>
              ))}
            </div>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: 'var(--g)', whiteSpace: 'nowrap' }}>{PROJ.length} Projekte</span>
            <span className="plx" style={{ fontSize: 10, color: 'var(--tx3)', cursor: 'pointer' }}>{pipelineOpen ? '\u25B2' : '\u25BC'}</span>
          </div>

          {/* Expanded detail */}
          {pipelineOpen && (
            <div style={{ display: 'flex', padding: '14px 22px 18px', borderTop: '1px solid rgba(0,0,0,.04)', marginTop: 10, gap: 24, flexWrap: 'wrap' }}>
              {pipelineGroups.map((group) => (
                <div key={group.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, minWidth: 160 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: group.color,
                    boxShadow: group.glow !== 'transparent' ? `0 0 8px ${group.glow}` : undefined,
                    opacity: group.label === 'Idle' ? 0.5 : 1,
                    marginTop: 3, flexShrink: 0,
                  }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: group.color }}>
                      {group.label} ({group.count})
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--tx3)', lineHeight: 1.5 }}>
                      {group.items.map((item, i) => (
                        <span key={i}>
                          {'\u25CF'} {item}
                          {i < group.items.length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION TITLES ── */}
      <div className="trow">
        <span className="st">Weitere</span>
        <span className="st">Projekte</span>
        <span className="st">Todos</span>
      </div>

      {/* ── MAIN BODY (3-col) ── */}
      <div className="mbody">
        {/* Left Nav */}
        <div className="lnav">
          {OVERFLOW_PROJECTS.map((p) => {
            const cv = colToVar(p.col)
            const st = statusOf(p)
            return (
              <div
                key={p.id}
                className="ni cf"
                style={{ '--nc': cv.glow, cursor: 'pointer' } as React.CSSProperties}
                onClick={() => navigate(`/projekte/${p.id}`)}
              >
                <span
                  className={`ni-dot ${st.ledClass}`}
                  style={{
                    width: 8, height: 8, animation: 'none',
                    ...(st.status === 'active' ? { background: cv.color, ['--lc' as string]: cv.glow } : {}),
                  }}
                />
                <span className="ni-l">{p.id.toUpperCase().slice(0, 2)}</span>
                <span className="ni-n">{p.n.length > 10 ? p.n.slice(0, 8) + '.' : p.n}</span>
              </div>
            )
          })}
          {/* Divider */}
          <div style={{ height: 1, margin: '4px 12px', background: 'linear-gradient(90deg,transparent,rgba(0,0,0,.06),transparent)' }} />
          {/* More */}
          <div className="ni cf" style={{ opacity: 0.4 }}>
            <span className="ni-l" style={{ fontSize: 12, color: 'var(--tx3)' }}>{'\u2022\u2022\u2022'}</span>
            <span className="ni-n">Mehr</span>
          </div>
          {/* Neu */}
          <div className="ni cf" style={{ opacity: 0.6 }}>
            <span className="ni-l" style={{ fontSize: 20, color: 'var(--tx3)' }}>+</span>
            <span className="ni-n">Neu</span>
          </div>
        </div>

        {/* Project Grid 3x3 */}
        <div className="center">
          <div className="pgrid">
            {MAIN_PROJECTS.map((p) => {
              const st = statusOf(p)
              const cv = colToVar(p.col)
              const phaseTotal = 5
              const phaseDone = Math.max(0, p.phN + 1)

              if (st.status === 'idle') {
                return (
                  <div
                    key={p.id}
                    className="pt cf"
                    style={{ opacity: 0.3, cursor: 'pointer' }}
                    onClick={() => navigate(`/projekte/${p.id}`)}
                  >
                    <div className="pt-top">
                      <div className={st.ledClass} style={st.ledStyle} />
                      <span className="pt-bdg" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </div>
                    <div className="pt-nm" style={{ color: 'var(--tx3)' }}>{p.n}</div>
                    <div className="pt-ag" style={{ opacity: 0.5 }}>Nicht gestartet</div>
                    <div className="phr">
                      <span className="phl">Phase</span>
                      <div className="phd">
                        {Array.from({ length: phaseTotal }).map((_, i) => (
                          <div key={i} className="pd in" style={{ background: 'var(--bg)' }} />
                        ))}
                      </div>
                      <span className="phl">0/{phaseTotal}</span>
                    </div>
                    <div className="pt-pr">
                      <div className="pt-b in">
                        <div className="pt-f" style={{ width: '0%' }} />
                      </div>
                      <span className="pt-pc" style={{ color: 'var(--tx3)' }}>0%</span>
                    </div>
                    <div className="pt-ft">
                      <span className="pt-td"><strong>{p.todos}</strong> Todos</span>
                      <span className="pt-ar">{'\u2192'}</span>
                    </div>
                  </div>
                )
              }

              // Status-dependent colors for the card
              const cardColor = st.status === 'blocked' ? 'var(--r)' : st.status === 'live' ? 'var(--bl)' : st.status === 'pause' ? 'var(--a)' : cv.color
              const cardGlow = st.status === 'blocked' ? 'var(--rg)' : st.status === 'live' ? 'var(--blg)' : st.status === 'pause' ? 'var(--ag)' : cv.glow
              const cardUltra = st.status === 'blocked' ? 'var(--ru)' : st.status === 'live' ? 'var(--blu)' : st.status === 'pause' ? 'var(--au)' : cv.ultra

              // Agent icon
              const agentIcon = st.status === 'active' ? (
                <svg viewBox="0 0 24 24" width="10" height="10" stroke={cardColor} strokeWidth="2" fill="none" style={{ filter: `drop-shadow(0 0 3px ${cardGlow})` }}>
                  <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              ) : st.status === 'blocked' ? (
                <svg viewBox="0 0 24 24" width="10" height="10" stroke="var(--r)" strokeWidth="2" fill="none">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
              ) : st.status === 'live' ? (
                <svg viewBox="0 0 24 24" width="10" height="10" stroke="var(--bl)" strokeWidth="2" fill="none" style={{ filter: 'drop-shadow(0 0 3px var(--blg))' }}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ) : st.status === 'pause' ? (
                <svg viewBox="0 0 24 24" width="10" height="10" stroke="var(--a)" strokeWidth="2" fill="none">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : null

              const agentLabel = st.status === 'active' ? 'build-agent' : st.status === 'blocked' ? p.health : st.status === 'live' ? `\u20AC${p.rev || 0}/mo` : st.status === 'pause' ? 'Feedback' : 'kein Agent'

              return (
                <div
                  key={p.id}
                  className="cgw"
                  style={{ '--gc2': cardUltra } as React.CSSProperties}
                  onClick={() => navigate(`/projekte/${p.id}`)}
                >
                  <div className="pt cf" style={{ '--hc': cardGlow } as React.CSSProperties}>
                    <div className="pt-top">
                      <div className={st.ledClass} style={st.ledStyle} />
                      <span className="pt-bdg" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </div>
                    <div className="pt-nm">{p.n}</div>
                    <div className="pt-ag" style={st.status === 'blocked' ? { color: 'var(--r)' } : undefined}>
                      {agentIcon}
                      {agentLabel}
                    </div>
                    <div className="phr">
                      <span className="phl">Phase</span>
                      <div className="phd">
                        {Array.from({ length: phaseTotal }).map((_, i) => (
                          <div
                            key={i}
                            className={`pd in${i < phaseDone ? ' done' : ''}`}
                            style={{
                              background: i < phaseDone ? cardColor : 'var(--bg)',
                              ['--pc' as string]: i < phaseDone ? cardGlow : undefined,
                            }}
                          />
                        ))}
                      </div>
                      <span className="phl" style={{ color: 'var(--tx2)' }}>{phaseDone}/{phaseTotal}</span>
                    </div>
                    <div className="pt-pr">
                      <div className="pt-b in">
                        <div
                          className="pt-f"
                          style={{
                            width: `${p.pct}%`,
                            background: cardColor,
                            ['--b2' as string]: cardGlow,
                          }}
                        />
                      </div>
                      <span className="pt-pc" style={{ color: st.color }}>{p.pct}%</span>
                    </div>
                    <div className="pt-ft">
                      <span className="pt-td"><strong>{p.todos}</strong> Todos</span>
                      <span className="pt-ar">{'\u2192'}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Todos Sidebar */}
        <div className="right">
          <div className="todos cf">
            <div className="t-hdr">
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>{openTodos.length} offen</span>
            </div>
            <div className="t-flt">
              {todoFilters.map((f, i) => (
                <button
                  key={f.label}
                  className={`fb${i === activeFilter ? ' active' : ''}`}
                  onClick={() => setActiveFilter(i)}
                >
                  {f.label}{' '}
                  <span
                    className="fc"
                    style={f.bgColor ? { background: f.bgColor, color: f.textColor } : undefined}
                  >
                    {f.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="t-list">
              {filteredTodos.map((todo) => {
                const prio = prioLabel(todo.prio)
                const pl = projLabel(todo.proj)
                const isOverdue = todo.ov
                const dateStr = todo.due || (todo.prio === 'h' ? 'Heute' : '')
                return (
                  <div key={todo.id} className="tc">
                    <div className="tck in" />
                    <div className="tb">
                      <div className="tt" style={isOverdue ? { color: 'var(--r)' } : undefined}>{todo.txt.length > 40 ? todo.txt.slice(0, 40) + '...' : todo.txt}</div>
                      <div className="td2">{todo.proj || 'MCKAY OS'}</div>
                      <div className="ti">
                        Impact:
                        <div className="ti-b">
                          {Array.from({ length: 5 }).map((_, di) => (
                            <div key={di} className="ti-d" style={{ background: di < (todo.prio === 'h' ? 5 : todo.prio === 'm' ? 3 : 1) ? prio.color : 'var(--bg)' }} />
                          ))}
                        </div>
                      </div>
                      <div className="ttg">
                        <span className="tpd" style={{ background: pl.dotColor, boxShadow: `0 0 4px ${pl.dotGlow}` }} />
                        <span style={{ fontSize: 8, color: 'var(--tx3)' }}>{pl.name}</span>
                        {isOverdue && <span className="tg" style={{ background: 'var(--rc)', color: 'var(--r)' }}>Overdue</span>}
                      </div>
                    </div>
                    <div className="tr">
                      <span className="tdt" style={isOverdue ? { color: 'var(--r)' } : undefined}>{dateStr}</span>
                      <span className="tpb" style={{ background: prio.bg, color: prio.color }}>{prio.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Bottom fade + "more" link */}
            <div style={{ padding: '8px 16px 14px', textAlign: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -30, left: 0, right: 0, height: 30, background: 'linear-gradient(transparent,var(--sf))', pointerEvents: 'none' }} />
              {remainingTodos > 0 && (
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--p)', cursor: 'pointer' }}>+ {remainingTodos} weitere Todos anzeigen</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW (3-col) ── */}
      <div className="brow">
        <div />
        <Notifications />
        <QuickAccess />
      </div>

      {/* ── LIVE FEED ── */}
      <LiveFeed />
    </AppShell>
  )
}
