import { NOTIFS } from '../lib/data'
import { useToast } from './Toast'

interface NotificationPanelProps {
  open: boolean
  onClose: () => void
}

const GROUPS: Record<string, string> = {
  sofort: '\u26a1 Sofort',
  wichtig: '\u26a0 Wichtig',
  info: '\u2713 Info',
  optional: '\u{1F4A1} Optional',
  review: '\u{1F4CA} Review',
}

export default function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const { toast } = useToast()

  // Group notifications by type
  const grouped: Record<string, typeof NOTIFS> = {}
  for (const n of NOTIFS) {
    if (!grouped[n.typ]) grouped[n.typ] = []
    grouped[n.typ].push(n)
  }

  const neuCount = NOTIFS.length

  return (
    <div
      id="npanel"
      className={open ? 'show' : ''}
      style={open ? { display: 'flex' } : {}}
    >
      <div className="nph">
        <span className="npt">
          Notifications{' '}
          <span style={{ fontSize: 10, color: 'var(--t3)' }}>({neuCount} neu)</span>
        </span>
        <span className="npc" onClick={onClose}>{'\u2715'}</span>
      </div>
      <div className="npb">
        {Object.keys(GROUPS).map(key => {
          const items = grouped[key]
          if (!items || items.length === 0) return null
          return (
            <div key={key}>
              <div className="nglbl">{GROUPS[key]}</div>
              {items.map((n, i) => (
                <div key={i} className="nitem">
                  <span className="niico">{n.ico}</span>
                  <div className="nibody">
                    <div className="nitit">{n.tit}</div>
                    <div className="nisub">{n.sub}</div>
                    <div className="nisub" style={{ marginTop: 2, fontSize: 9 }}>{n.t}</div>
                    <div className="niacts">
                      <button
                        className="niact"
                        onClick={(e) => { e.stopPropagation(); toast('\u00d6ffne...') }}
                      >
                        {'\u00d6'}ffnen
                      </button>
                      <button
                        className="niact"
                        onClick={(e) => { e.stopPropagation(); toast('Erledigt') }}
                      >
                        Erledigt
                      </button>
                      <button
                        className="niact"
                        onClick={(e) => { e.stopPropagation(); toast('Ignoriert') }}
                      >
                        Ignorieren
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
