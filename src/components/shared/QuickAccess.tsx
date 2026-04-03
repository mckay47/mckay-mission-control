import { useNavigate } from 'react-router-dom'

interface QAItem {
  label: string
  sublabel: string
  route: string
  colorVar: string
  glowVar: string
  icon: React.ReactNode
}

const items: QAItem[] = [
  {
    label: 'Thinktank',
    sublabel: '7 Ideen',
    route: '/thinktank',
    colorVar: 'var(--p)',
    glowVar: 'var(--pg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--p)">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    label: 'Briefing',
    sublabel: 'Heute',
    route: '/briefing',
    colorVar: 'var(--t)',
    glowVar: 'var(--tg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--t)">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
      </svg>
    ),
  },
  {
    label: 'Agents',
    sublabel: '3 aktiv',
    route: '/agents',
    colorVar: 'var(--o)',
    glowVar: 'var(--og)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--o)">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: 'Backoffice',
    sublabel: 'Admin',
    route: '/backoffice',
    colorVar: 'var(--tx2)',
    glowVar: 'rgba(30,30,30,.06)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--tx2)">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    label: 'Termine & Todos',
    sublabel: 'Aufgaben',
    route: '/termine-todos',
    colorVar: 'var(--bl)',
    glowVar: 'var(--blg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--bl)">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
      </svg>
    ),
  },
  {
    label: 'Private',
    sublabel: 'Persönlich',
    route: '/private',
    colorVar: 'var(--pk)',
    glowVar: 'var(--pkg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--pk)">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

export default function QuickAccess() {
  const navigate = useNavigate()

  return (
    <div className="qa cf">
      <div className="qa-t">Quick Access</div>
      <div className="qa-g">
        {items.map((item) => (
          <div
            key={item.route}
            className="qa-item"
            onClick={() => navigate(item.route)}
          >
            <div
              className="btn3d"
              style={{ '--bc': item.glowVar } as React.CSSProperties}
            >
              {item.icon}
            </div>
            <span className="qa-lb">{item.label}</span>
            <span className="qa-sb">{item.sublabel}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
