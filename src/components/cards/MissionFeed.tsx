import type React from 'react'
import { NOTIFS } from '../../lib/data'

interface FeedEntry {
  iconClass: string
  iconPath: string
  title: string
  desc: string
  time: string
  tag: string
  tagClass: string
}

/* ── Map notification typ to icon/tag styling ── */
function mapNotif(n: typeof NOTIFS[number]): FeedEntry {
  const map: Record<string, { iconClass: string; iconPath: string; tag: string; tagClass: string }> = {
    wichtig: {
      iconClass: 'warning',
      iconPath: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
      tag: 'Action',
      tagClass: 'warn',
    },
    sofort: {
      iconClass: 'info',
      iconPath: 'M22 12h-4l-3 9L9 3l-3 9H2',
      tag: 'Active',
      tagClass: 'active',
    },
    info: {
      iconClass: 'success',
      iconPath: 'M22 11.08V12a10 10 0 1 1-5.93-9.14',
      tag: 'Done',
      tagClass: 'success',
    },
    review: {
      iconClass: 'calendar',
      iconPath: 'M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z',
      tag: 'Review',
      tagClass: 'soon',
    },
  }
  const m = map[n.typ] || map.info
  return {
    iconClass: m.iconClass,
    iconPath: m.iconPath,
    title: n.tit,
    desc: n.sub,
    time: n.t,
    tag: m.tag,
    tagClass: m.tagClass,
  }
}

const FEED_ITEMS: FeedEntry[] = NOTIFS.map(mapNotif)

// Duplicate for seamless loop
const DUPLICATED = [...FEED_ITEMS, ...FEED_ITEMS]

function FeedIcon({ iconClass, iconPath }: { iconClass: string; iconPath: string }) {
  // Additional SVG elements for specific icon types
  const extras: Record<string, React.ReactNode> = {
    success: <polyline points="22 4 12 14.01 9 11.01" />,
    calendar: <><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    email: <polyline points="22 6 12 13 2 6" />,
  }
  return (
    <div className={`feed-item-icon ${iconClass}`}>
      <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d={iconPath} />
        {extras[iconClass] ?? null}
      </svg>
    </div>
  )
}

export default function MissionFeed() {
  if (FEED_ITEMS.length === 0) {
    return (
      <div className="mission-feed">
        <div className="feed-header">
          <div className="feed-live">
            <span className="feed-live-dot" />
            <span className="feed-live-text">LIVE</span>
          </div>
          <span className="feed-title">MISSION CONTROL</span>
          <span className="feed-count">0 events</span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Keine Events</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mission-feed">
      {/* Header */}
      <div className="feed-header">
        <div className="feed-live">
          <span className="feed-live-dot" />
          <span className="feed-live-text">LIVE</span>
        </div>
        <span className="feed-title">MISSION CONTROL</span>
        <span className="feed-count">{FEED_ITEMS.length} events</span>
      </div>

      {/* Ticker */}
      <div className="feed-ticker">
        <div className="feed-track">
          {DUPLICATED.map((item, i) => (
            <div key={`${item.title}-${i}`} className="feed-item">
              <FeedIcon iconClass={item.iconClass} iconPath={item.iconPath} />
              <div className="feed-item-body">
                <span className="feed-item-title">{item.title}</span>
                <span className="feed-item-desc">{item.desc}</span>
              </div>
              <span className="feed-item-time">{item.time}</span>
              <span className={`feed-item-tag ${item.tagClass}`}>{item.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
