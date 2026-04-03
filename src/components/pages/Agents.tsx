import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../shared/AppShell'
import QuickAccess from '../shared/QuickAccess'
import { AGENTS } from '../../lib/data'
import type { Agent } from '../../lib/types'

/* ── Helpers ─────────────────────────────────────────── */

/** Glow variant from col */
function glowFromCol(col: string): string {
  const map: Record<string, string> = {
    'var(--g)': 'var(--gg)',
    'var(--bl)': 'var(--blg)',
    'var(--p)': 'var(--pg)',
    'var(--a)': 'var(--ag)',
    'var(--t)': 'var(--tg)',
    'var(--o)': 'var(--og)',
    'var(--c)': 'var(--blg)',
    'var(--r)': 'var(--rg)',
    'var(--t3)': 'rgba(0,0,0,.04)',
  }
  return map[col] || 'var(--blg)'
}

/** Generate slug from agent name */
function agentSlug(agent: Agent): string {
  return agent.n.toLowerCase().replace(/\s+/g, '-')
}

/** Agent icon based on type/name */
function agentIcon(agent: Agent): React.ReactNode {
  const stroke = agent.col
  // Map specific agent names to icons
  const name = agent.n.toLowerCase()
  if (name.includes('build'))
    return <svg viewBox="0 0 24 24" stroke={stroke}><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  if (name.includes('research'))
    return <svg viewBox="0 0 24 24" stroke={stroke}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
  if (name.includes('launch'))
    return <svg viewBox="0 0 24 24" stroke={stroke}><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>
  if (name.includes('ops'))
    return <svg viewBox="0 0 24 24" stroke={stroke}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
  if (name.includes('test'))
    return <svg viewBox="0 0 24 24" stroke={stroke}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
  if (name.includes('sales'))
    return <svg viewBox="0 0 24 24" stroke={stroke}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
  if (name.includes('seo'))
    return <svg viewBox="0 0 24 24" stroke={stroke}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
  if (name.includes('strategy'))
    return <svg viewBox="0 0 24 24" stroke={stroke}><circle cx="12" cy="12" r="10" /><path d="M16 12l-4-4-4 4" /><path d="M12 16V8" /></svg>
  if (name.includes('life'))
    return <svg viewBox="0 0 24 24" stroke={stroke}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
  if (name.includes('mockup') || name.includes('brief'))
    return <svg viewBox="0 0 24 24" stroke={stroke}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
  // Default: kani hexagon
  return <svg viewBox="0 0 24 24" stroke={stroke}><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" /></svg>
}

/* ── Types ────────────────────────────────────────────── */

interface TickerItem {
  agent: string
  color: string
  text: string
}

/* ── Notification data for agents context ─────────────── */

interface AgentNotifCategory {
  label: string
  count: number
  colorVar: string
  glowVar: string
  icon: React.ReactNode
  items: { project: string; text: string }[]
}

/* ── Component ────────────────────────────────────────── */

export default function Agents() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'active' | 'idle'>('all')
  const [selectedId, setSelectedId] = useState<string>(AGENTS.length > 0 ? agentSlug(AGENTS[0]) : '')
  const [pipelineOpen, setPipelineOpen] = useState(false)

  /* ── Empty state ──────────────────────────────────── */

  if (AGENTS.length === 0) {
    return (
      <AppShell title="Agents" ledColor="g">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--tx3)', fontSize: 14 }}>
          Keine Agents aktiv
        </div>
      </AppShell>
    )
  }

  const activeCount = AGENTS.filter((a) => a.st === 'active').length
  const idleCount = AGENTS.filter((a) => a.st === 'idle').length
  const totalTasks = AGENTS.reduce((sum, a) => sum + a.pr, 0)

  const filtered =
    filter === 'all'
      ? AGENTS
      : AGENTS.filter((a) => a.st === filter)

  const selected = AGENTS.find((a) => agentSlug(a) === selectedId) ?? AGENTS[0]
  // const _selectedGlow = glowFromCol(selected.col)

  // Ticker items from real agents
  const tickerItems: TickerItem[] = AGENTS.filter((a) => a.act).map((a) => ({
    agent: agentSlug(a),
    color: a.col,
    text: a.act,
  }))

  // Notification categories derived from agent data
  const agentNotifCategories: AgentNotifCategory[] = [
    {
      label: 'Aktiv',
      count: activeCount,
      colorVar: 'var(--g)',
      glowVar: 'var(--gg)',
      icon: (
        <svg viewBox="0 0 24 24" stroke="var(--g)">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      items: AGENTS.filter((a) => a.st === 'active').map((a) => ({
        project: a.n,
        text: a.act || 'Aktiv',
      })),
    },
    {
      label: 'Idle',
      count: idleCount,
      colorVar: 'var(--a)',
      glowVar: 'var(--ag)',
      icon: (
        <svg viewBox="0 0 24 24" stroke="var(--a)">
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      ),
      items: AGENTS.filter((a) => a.st === 'idle').map((a) => ({
        project: a.n,
        text: a.proj === '\u2014' ? 'Kein Projekt' : a.proj,
      })),
    },
  ]

  return (
    <AppShell title="Agents" ledColor="g">
      {/* KPI Row */}
      <div className="krow">
        <div className="kpi cf" style={{ '--kc': 'var(--gg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--gg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--g)">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--g)' }}>{activeCount}</div>
            <div className="kl">Aktiv</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--ag)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--ag)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--a)">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--a)' }}>{idleCount}</div>
            <div className="kl">Idle</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--blg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--blg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--bl)">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--bl)' }}>{totalTasks}</div>
            <div className="kl">Tasks erledigt</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--pg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--pg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--p)">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--p)' }}>{AGENTS.length}</div>
            <div className="kl">Total Agents</div>
          </div>
        </div>
      </div>

      {/* Pipeline / Agent Status */}
      <div style={{ padding: '0 40px', marginBottom: 14, flexShrink: 0 }}>
        <div className="cf" style={{ overflow: 'hidden' }}>
          <div
            style={{
              padding: '14px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              cursor: 'pointer',
              transition: 'all .3s',
            }}
            onClick={() => setPipelineOpen((p) => !p)}
          >
            <span className="st" style={{ whiteSpace: 'nowrap' }}>Agent Status</span>
            <div
              className="in"
              style={{
                flex: 1,
                height: 10,
                borderRadius: 5,
                display: 'flex',
                gap: 3,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  flex: activeCount,
                  height: '100%',
                  borderRadius: 4,
                  background: 'var(--g)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 7,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,.8)',
                }}
              >
                {activeCount}
              </div>
              <div
                style={{
                  flex: idleCount,
                  height: '100%',
                  borderRadius: 4,
                  background: 'var(--a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 7,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,.8)',
                }}
              >
                {idleCount}
              </div>
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono'",
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--g)',
                whiteSpace: 'nowrap',
              }}
            >
              {AGENTS.length} Agents
            </span>
            <span style={{ fontSize: 10, color: 'var(--tx3)', cursor: 'pointer' }}>
              {pipelineOpen ? '\u25B2' : '\u25BC'}
            </span>
          </div>
          {pipelineOpen && (
            <div
              style={{
                padding: '14px 22px 18px',
                borderTop: '1px solid rgba(0,0,0,.04)',
                marginTop: 10,
                display: 'flex',
                gap: 24,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, minWidth: 180 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: 'var(--g)',
                    boxShadow: '0 0 8px var(--gg)',
                    marginTop: 3,
                    flexShrink: 0,
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--g)' }}>
                    Aktiv ({activeCount})
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--tx3)', lineHeight: 1.5 }}>
                    {AGENTS
                      .filter((a) => a.st === 'active')
                      .map((a, i, arr) => (
                        <span key={agentSlug(a)}>
                          {'\u25CF'} {a.n} {'\u2192'} {a.proj}
                          {i < arr.length - 1 && <br />}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, minWidth: 180 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: 'var(--a)',
                    marginTop: 3,
                    flexShrink: 0,
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--a)' }}>
                    Idle ({idleCount})
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--tx3)', lineHeight: 1.5 }}>
                    {AGENTS
                      .filter((a) => a.st === 'idle')
                      .map((a, i, arr) => (
                        <span key={agentSlug(a)}>
                          {'\u25CF'} {a.n} — {a.proj === '\u2014' ? 'Kein Projekt' : a.proj}
                          {i < arr.length - 1 && <br />}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Row */}
      <div className="filter-row">
        <span className="st" style={{ marginRight: 12 }}>Agents</span>
        <button
          className={`fb${filter === 'all' ? ' active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Alle <span className="fc">{AGENTS.length}</span>
        </button>
        <button
          className={`fb${filter === 'active' ? ' active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Aktiv <span className="fc">{activeCount}</span>
        </button>
        <button
          className={`fb${filter === 'idle' ? ' active' : ''}`}
          onClick={() => setFilter('idle')}
        >
          Idle <span className="fc">{idleCount}</span>
        </button>
      </div>

      {/* Main Body: Grid left | Detail+Chat right */}
      <div className="abody">
        <div className="aleft">
          <div className="agrid">
            {filtered.map((agent) => {
              const slug = agentSlug(agent)
              const glow = glowFromCol(agent.col)
              const isActive = agent.st === 'active'
              return (
                <div
                  key={slug}
                  className="cgw"
                  style={{ '--gc2': glow } as React.CSSProperties}
                  onClick={() => setSelectedId(slug)}
                >
                  <div
                    className="ac cf"
                    style={{ '--hc': glow } as React.CSSProperties}
                  >
                    <div className="ac-top">
                      <div
                        className="ac-icon btn3d"
                        style={{ '--bc': glow } as React.CSSProperties}
                      >
                        {isActive && (
                          <div
                            className="sl"
                            style={{
                              position: 'absolute',
                              top: -2,
                              right: -2,
                              width: 8,
                              height: 8,
                              background: agent.col,
                              '--lc': glow,
                              animation: 'lp 3s ease-in-out infinite',
                            } as React.CSSProperties}
                          />
                        )}
                        {agentIcon(agent)}
                      </div>
                      <span
                        className="ac-badge"
                        style={{
                          background: agent.bg,
                          color: agent.col,
                        }}
                      >
                        {isActive ? '\u25CF Aktiv' : '\u23F8 Idle'}
                      </span>
                    </div>
                    <div className="ac-name">{agent.n}</div>
                    <div
                      className="ac-task"
                      style={!isActive ? { color: 'var(--tx3)' } : undefined}
                    >
                      {agent.act || (isActive ? 'Arbeitet...' : 'Wartet auf Auftrag')}
                    </div>
                    <div className="ac-project">
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: isActive ? agent.col : 'var(--tx3)',
                          boxShadow: isActive ? `0 0 4px ${glow}` : 'none',
                        }}
                      />
                      <span style={{ color: 'var(--tx3)' }}>{agent.proj}</span>
                    </div>
                    <div className="ac-stats">
                      <div className="ac-stat">
                        <span className="ac-stat-val" style={{ color: agent.col }}>
                          {agent.pr}
                        </span>
                        <span className="ac-stat-label">Tasks</span>
                      </div>
                      <div className="ac-stat">
                        <span className="ac-stat-val" style={{ color: agent.col }}>
                          {agent.suc}%
                        </span>
                        <span className="ac-stat-label">Erfolg</span>
                      </div>
                      <div className="ac-stat">
                        <span className="ac-stat-val">{agent.mdl}</span>
                        <span className="ac-stat-label">Modell</span>
                      </div>
                    </div>
                    <div className="ac-foot">
                      <span className="ac-uptime">{agent.typ}</span>
                      <span
                        className="ac-arrow"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/agents/${slug}`)
                        }}
                      >
                        &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
            {/* Add agent placeholder */}
            <div
              className="ac cf"
              style={{
                opacity: 0.15,
                border: '2px dashed rgba(0,0,0,.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 140,
              }}
            >
              <span style={{ fontSize: 28, color: 'var(--tx3)' }}>+</span>
            </div>
          </div>
        </div>

        {/* Right: Agent Detail + Chat */}
        <div className="aright">
          <div className="adet cf">
            <div className="adet-hdr">
              <div className="adet-title">{selected.n}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 5,
                    background: selected.bg,
                    color: selected.col,
                  }}
                >
                  {selected.st === 'active' ? '\u25CF Aktiv' : '\u23F8 Idle'}
                </span>
              </div>
            </div>
            <div className="adet-body">
              <div>
                <div className="adet-label">Typ & Modell</div>
                <div className="adet-text">
                  <span style={{ color: selected.col, fontWeight: 600 }}>{selected.typ}</span>
                  {' \u00B7 '}{selected.mdl}
                </div>
              </div>
              <div>
                <div className="adet-label">Aktivitaet</div>
                <div className="adet-text">{selected.act || '\u2014'}</div>
              </div>
              <div>
                <div className="adet-label">Stats</div>
                <div className="adet-stat">
                  <div className="adet-si in">
                    <div className="adet-si-val" style={{ color: selected.col }}>
                      {selected.pr}
                    </div>
                    <div className="adet-si-label">Tasks</div>
                  </div>
                  <div className="adet-si in">
                    <div className="adet-si-val" style={{ color: selected.col }}>
                      {selected.suc}%
                    </div>
                    <div className="adet-si-label">Erfolg</div>
                  </div>
                  <div className="adet-si in">
                    <div className="adet-si-val" style={{ color: 'var(--bl)' }}>
                      {selected.tkn}
                    </div>
                    <div className="adet-si-label">Tokens</div>
                  </div>
                  <div className="adet-si in">
                    <div className="adet-si-val" style={{ color: 'var(--p)' }}>
                      {selected.cost}
                    </div>
                    <div className="adet-si-label">Kosten</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="adet-label">Projekt</div>
                <div className="adet-text">
                  <b>{selected.proj}</b>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Chat */}
          <div className="akani cf">
            <div className="akani-hdr">
              <div className="akani-av">
                {agentIcon(selected)}
              </div>
              <span className="akani-nm">{selected.n} · Chat</span>
              <span style={{ fontSize: 7, color: 'var(--g)', marginLeft: 'auto' }}>
                {selected.st === 'active' ? 'Running' : 'Idle'}
              </span>
            </div>
            <div className="akani-body">
              <div className="akm k in">
                {selected.n} hier. {selected.act ? `Arbeite gerade an: ${selected.act}` : 'Warte auf naechsten Auftrag.'}
              </div>
              <div className="akm u">Status?</div>
              <div className="akm k in">
                Typ: {selected.typ}. Modell: {selected.mdl}. Projekt: {selected.proj}. Kosten: {selected.cost}.
              </div>
            </div>
            <div className="akani-in">
              <input
                className="akani-inp in"
                placeholder={`Nachricht an ${selected.n}...`}
                readOnly
              />
              <button className="akani-send">
                <svg viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Notifications + Quick Access */}
      <div
        className="brow"
        style={{ gridTemplateColumns: '1fr 420px', marginTop: 16, flex: 0 }}
      >
        <div className="notif cf">
          <div className="notif-t">Notifications</div>
          <div className="notif-g">
            {agentNotifCategories.map((cat) => (
              <div key={cat.label} className="notif-cat">
                <div
                  className="btn3d btn3d-lg"
                  style={{ '--bc': cat.glowVar } as React.CSSProperties}
                >
                  <span
                    className="notif-badge"
                    style={{
                      background: cat.colorVar,
                      boxShadow: `0 2px 8px ${cat.glowVar}`,
                    }}
                  >
                    {cat.count}
                  </span>
                  {cat.icon}
                </div>
                <div className="notif-label" style={{ color: cat.colorVar }}>
                  {cat.label}
                </div>
                <div className="notif-detail">
                  {cat.items.map((item, i) => (
                    <span key={i}>
                      <span style={{ color: cat.colorVar }}>{'\u25CF'}</span>{' '}
                      <b>{item.project}:</b> {item.text}
                      {i < cat.items.length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <QuickAccess />
      </div>

      {/* Live Feed */}
      <div className="ticker-w">
        <div className="ticker cf" style={{ borderRadius: 24 }}>
          <div className="ticker-lbl">
            <span className="ticker-ld" />
            AGENTS
          </div>
          <div className="ticker-c">
            <div className="ticker-s">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <div key={i} className="ticker-i">
                  <span className="ticker-id" style={{ background: item.color }} />
                  <span className="ticker-ia" style={{ color: item.color }}>
                    {item.agent}
                  </span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
