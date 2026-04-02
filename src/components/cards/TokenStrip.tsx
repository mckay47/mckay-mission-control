const KPIS = [
  {
    value: '\u20ac4.4k',
    label: 'Cost/W',
    colorClass: 'orange',
    icon: (
      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    value: '1.2M',
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
    value: '340ms',
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
    value: '23',
    label: 'Convos',
    colorClass: 'purple',
    icon: (
      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    value: '89%',
    label: 'Success',
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
