interface TickerItem {
  agent: string
  color: string
  text: string
}

const feedItems: TickerItem[] = [
  { agent: 'build-agent', color: 'var(--g)', text: 'kompiliert Route /api/appointments für Hebammenbuero' },
  { agent: 'research-agent', color: 'var(--p)', text: 'analysiert Marktdaten für Gastro Suite — 23 Quellen' },
  { agent: 'build-agent', color: 'var(--g)', text: 'TypeScript Check passed — 0 errors, 2 warnings' },
  { agent: 'deploy-agent', color: 'var(--bl)', text: 'Mission Control v0.8 deployed auf Vercel' },
  { agent: 'kani', color: 'var(--a)', text: 'Briefing für morgen — 3 Projekte analysiert' },
  { agent: 'test-agent', color: 'var(--t)', text: 'TennisCoach: 47/47 Tests passing' },
]

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
