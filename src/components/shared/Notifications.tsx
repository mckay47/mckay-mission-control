interface NotifCategory {
  label: string
  count: number
  colorVar: string
  glowVar: string
  icon: React.ReactNode
  items: { project: string; text: string }[]
}

const categories: NotifCategory[] = [
  {
    label: 'Issues',
    count: 4,
    colorVar: 'var(--r)',
    glowVar: 'var(--rg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--r)">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    items: [
      { project: 'Stillprobleme', text: 'API Credentials fehlen' },
      { project: 'TennisCoach', text: 'Build Error /api/payments' },
      { project: 'Gastro Suite', text: 'Rate Limit Agent erreicht' },
      { project: 'FMH', text: 'SSL-Zertifikat läuft in 7d ab' },
    ],
  },
  {
    label: 'Attention',
    count: 3,
    colorVar: 'var(--o)',
    glowVar: 'var(--og)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--o)">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    items: [
      { project: 'Mission Control', text: 'Design Input benötigt' },
      { project: 'Hebammenbuero', text: 'Feedback seit 5d aus' },
      { project: 'Gastro Suite', text: 'Marktanalyse wartet' },
    ],
  },
  {
    label: 'Freigabe',
    count: 3,
    colorVar: 'var(--g)',
    glowVar: 'var(--gg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--g)">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    items: [
      { project: 'Hebammenbuero', text: 'Mockup Review' },
      { project: 'TennisCoach', text: 'Pricing Tiers' },
      { project: 'Mission Control', text: 'Deploy v0.9 Prod' },
    ],
  },
  {
    label: 'Results',
    count: 4,
    colorVar: 'var(--bl)',
    glowVar: 'var(--blg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--bl)">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    items: [
      { project: 'Gastro Suite', text: 'Research Report fertig' },
      { project: 'Mission Control', text: 'Deploy v0.8 live' },
      { project: 'TennisCoach', text: '47/47 Tests passed' },
      { project: 'Hebammenbuero', text: 'SEO Audit done' },
    ],
  },
]

export default function Notifications() {
  return (
    <div className="notif cf">
      <div className="notif-t">Notifications</div>
      <div className="notif-g">
        {categories.map((cat) => (
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
                  <span style={{ color: cat.colorVar }}>●</span>{' '}
                  <b>{item.project}:</b> {item.text}
                  {i < cat.items.length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
