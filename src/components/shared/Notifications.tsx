import { useMissionControl } from '../../lib/MissionControlProvider'
import { supabase } from '../../lib/supabase'
import type { Notification } from '../../lib/types'

interface NotifCategory {
  label: string
  count: number
  unread: number
  colorVar: string
  glowVar: string
  icon: React.ReactNode
  items: { id: string; project: string; text: string; is_read: boolean }[]
}

function buildCategories(notifications: Notification[]): NotifCategory[] {
  const wichtig = notifications.filter((n) => n.typ === 'wichtig')
  const sofort = notifications.filter((n) => n.typ === 'sofort')
  const info = notifications.filter((n) => n.typ === 'info')
  const review = notifications.filter((n) => n.typ === 'review')

  const mapItems = (list: Notification[]) =>
    list.map((n) => ({
      id: n.id,
      project: n.title.split(':')[0] ?? n.title,
      text: n.title.split(':').slice(1).join(':').trim() || n.subtitle,
      is_read: n.is_read,
    }))

  return [
    {
      label: 'Issues',
      count: wichtig.length,
      unread: wichtig.filter((n) => !n.is_read).length,
      colorVar: 'var(--r)',
      glowVar: 'var(--rg)',
      icon: (
        <svg viewBox="0 0 24 24" stroke="var(--r)">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      items: mapItems(wichtig),
    },
    {
      label: 'Attention',
      count: sofort.length,
      unread: sofort.filter((n) => !n.is_read).length,
      colorVar: 'var(--o)',
      glowVar: 'var(--og)',
      icon: (
        <svg viewBox="0 0 24 24" stroke="var(--o)">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      items: mapItems(sofort),
    },
    {
      label: 'Freigabe',
      count: info.length,
      unread: info.filter((n) => !n.is_read).length,
      colorVar: 'var(--g)',
      glowVar: 'var(--gg)',
      icon: (
        <svg viewBox="0 0 24 24" stroke="var(--g)">
          <path d="M9 12l2 2 4-4" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
      items: mapItems(info),
    },
    {
      label: 'Results',
      count: review.length,
      unread: review.filter((n) => !n.is_read).length,
      colorVar: 'var(--bl)',
      glowVar: 'var(--blg)',
      icon: (
        <svg viewBox="0 0 24 24" stroke="var(--bl)">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      items: mapItems(review),
    },
  ]
}

async function dismissNotification(id: string) {
  await supabase.from('notifications').update({ dismissed: true }).eq('id', id)
}

async function markAsRead(id: string) {
  await supabase.from('notifications').update({ is_read: true }).eq('id', id)
}

async function markAllRead() {
  await supabase.from('notifications').update({ is_read: true }).eq('is_read', false)
}

export default function Notifications() {
  const { notifications } = useMissionControl()
  const categories = buildCategories(notifications)
  const totalUnread = notifications.filter((n) => !n.is_read).length

  return (
    <div className="notif cf">
      <div className="notif-t" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        Notifications
        {totalUnread > 0 && (
          <span
            style={{
              fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 8,
              background: 'var(--r)', color: '#fff', fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {totalUnread}
          </span>
        )}
        {totalUnread > 0 && (
          <button
            onClick={() => markAllRead()}
            style={{
              marginLeft: 'auto', fontSize: 9, color: 'var(--tx3)', background: 'none',
              border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0,
            }}
          >
            Alle gelesen
          </button>
        )}
      </div>
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
              {cat.unread > 0 && (
                <span style={{ fontSize: 9, color: 'var(--tx3)', marginLeft: 4 }}>
                  ({cat.unread} neu)
                </span>
              )}
            </div>
            <div className="notif-detail">
              {cat.items.length > 0 ? (
                cat.items.map((item) => (
                  <span key={item.id} style={{ display: 'flex', alignItems: 'start', gap: 4, opacity: item.is_read ? 0.5 : 1 }}>
                    <span style={{ flex: 1 }}>
                      <span style={{ color: cat.colorVar }}>{'\u25CF'}</span>{' '}
                      <b>{item.project}:</b> {item.text}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); dismissNotification(item.id) }}
                      onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--r)' }}
                      onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--tx3)' }}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--tx3)', fontSize: 11, padding: '0 2px', lineHeight: 1, flexShrink: 0,
                      }}
                      title="Dismiss"
                    >
                      ✕
                    </button>
                    {!item.is_read && (
                      <button
                        onClick={(e) => { e.stopPropagation(); markAsRead(item.id) }}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--tx3)', fontSize: 9, padding: '0 2px', lineHeight: 1, flexShrink: 0,
                        }}
                        title="Gelesen"
                      >
                        ●
                      </button>
                    )}
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
