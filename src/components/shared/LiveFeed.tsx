import { NOTIFS } from '../../lib/data'

interface TickerItem {
  agent: string
  color: string
  text: string
}

function typToColor(typ: string): string {
  switch (typ) {
    case 'wichtig': return 'var(--r)'
    case 'sofort': return 'var(--o)'
    case 'info': return 'var(--g)'
    case 'review': return 'var(--bl)'
    default: return 'var(--tx2)'
  }
}

function buildTickerItems(): TickerItem[] {
  if (NOTIFS.length === 0) return []
  return NOTIFS.map((n) => ({
    agent: n.typ,
    color: typToColor(n.typ),
    text: n.sub ? `${n.tit} — ${n.sub}` : n.tit,
  }))
}

function TickerItems({ items }: { items: TickerItem[] }) {
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className="ticker-i">
          <span className="ticker-id" style={{ background: item.color }} />
          <span className="ticker-ia" style={{ color: item.color }}>{item.agent}</span>
          {item.text}
        </div>
      ))}
    </>
  )
}

export default function LiveFeed() {
  const feedItems = buildTickerItems()

  if (feedItems.length === 0) {
    return (
      <div className="ticker-w">
        <div className="ticker cf" style={{ borderRadius: 24 }}>
          <div className="ticker-lbl">
            <span className="ticker-ld" />
            LIVE FEED
          </div>
          <div className="ticker-c">
            <div style={{ padding: '0 20px', fontSize: 11, color: 'var(--tx3)' }}>
              Keine Aktivitäten
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ticker-w">
      <div className="ticker cf" style={{ borderRadius: 24 }}>
        <div className="ticker-lbl">
          <span className="ticker-ld" />
          LIVE FEED
        </div>
        <div className="ticker-c">
          {/* Duplicate items for seamless infinite scroll — CSS animation translates -50% */}
          <div className="ticker-s">
            <TickerItems items={feedItems} />
            <TickerItems items={feedItems} />
          </div>
        </div>
      </div>
    </div>
  )
}
