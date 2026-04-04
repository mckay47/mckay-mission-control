import { NOTIFS } from '../../lib/data'

interface NotifCategory {
  label: string
  count: number
  colorVar: string
  glowVar: string
  icon: React.ReactNode
  items: { project: string; text: string }[]
}

function buildCategories(): NotifCategory[] {
  const wichtig = NOTIFS.filter((n) => n.typ === 'wichtig')
  const sofort = NOTIFS.filter((n) => n.typ === 'sofort')
  const info = NOTIFS.filter((n) => n.typ === 'info')
  const review = NOTIFS.filter((n) => n.typ === 'review')

  return [
    {
      label: 'Issues',
      count: wichtig.length,
      colorVar: 'var(--r)',
      glowVar: 'var(--rg)',
      icon: (
        <svg viewBox="0 0 24 24" stroke="var(--r)">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      items: wichtig.map((n) => ({ project: n.tit.split(':')[0] ?? n.tit, text: n.tit.split(':').slice(1).join(':').trim() || n.sub })),
    },
    {
      label: 'Attention',
      count: sofort.length,
      colorVar: 'var(--o)',
      glowVar: 'var(--og)',
      icon: (
        <svg viewBox="0 0 24 24" stroke="var(--o)">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      items: sofort.map((n) => ({ project: n.tit.split(':')[0] ?? n.tit, text: n.tit.split(':').slice(1).join(':').trim() || n.sub })),
    },
    {
      label: 'Freigabe',
      count: info.length,
      colorVar: 'var(--g)',
      glowVar: 'var(--gg)',
      icon: (
        <svg viewBox="0 0 24 24" stroke="var(--g)">
          <path d="M9 12l2 2 4-4" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
      items: info.map((n) => ({ project: n.tit.split(':')[0] ?? n.tit, text: n.tit.split(':').slice(1).join(':').trim() || n.sub })),
    },
    {
      label: 'Results',
      count: review.length,
      colorVar: 'var(--bl)',
      glowVar: 'var(--blg)',
      icon: (
        <svg viewBox="0 0 24 24" stroke="var(--bl)">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      items: review.length > 0
        ? review.map((n) => ({ project: n.tit.split(':')[0] ?? n.tit, text: n.tit.split(':').slice(1).join(':').trim() || n.sub }))
        : [],
    },
  ]
}

export default function Notifications() {
  const categories = buildCategories()

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
              {cat.items.length > 0 ? (
                cat.items.map((item, i) => (
                  <span key={i}>
                    <span style={{ color: cat.colorVar }}>{'\u25CF'}</span>{' '}
                    <b>{item.project}:</b> {item.text}
                    {i < cat.items.length - 1 && <br />}
                  </span>
                ))
              ) : (
                <span style={{ color: 'var(--tx3)' }}>Keine</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
