import { PROJ, AGENTS } from '../../lib/data'

const totalCost = PROJ.reduce((s, p) => s + p.cost, 0)
const totalAgents = AGENTS.length
const activeAgents = AGENTS.filter(a => a.st === 'active').length

const KPIS = [
  {
    value: `\u20ac${(totalCost / 1000).toFixed(1)}k`,
    label: 'Cost/W (est.)',
    colorClass: 'orange',
    icon: (
      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    value: '\u2014',
    label: 'Tokens',
    colorClass: 'pink',
    icon: (
      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    value: '\u2014',
    label: 'Latency',
    colorClass: 'cyan',
    icon: (
      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    value: `${totalAgents}`,
    label: 'Agents',
    colorClass: 'purple',
    icon: (
      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    value: `${activeAgents}`,
    label: 'Active',
    colorClass: 'green',
    icon: (
      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
]

export default function TokenStrip() {
  return (
    <div className="token-strip">
      {KPIS.map(kpi => (
        <div key={kpi.label} className="token-kpi">
          <div className={`token-icon ${kpi.colorClass}`}>
            {kpi.icon}
          </div>
          <span className="token-val">{kpi.value}</span>
          <span className="token-lbl">{kpi.label}</span>
        </div>
      ))}
    </div>
  )
}
