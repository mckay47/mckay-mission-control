import { useState, useMemo } from 'react'
import { MapPin, ExternalLink } from 'lucide-react'
import { Header } from '../shared/Header.tsx'
import { SplitLayout } from '../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText, TcStatRow, TcStat } from '../shared/PreviewPanel.tsx'
import { BottomTicker } from '../shared/BottomTicker.tsx'
import { StatusLed } from '../ui/StatusLed.tsx'
import { Pipeline } from '../shared/Pipeline.tsx'
import { useMissionControl } from '../../lib/MissionControlProvider.tsx'

interface Props { toggleTheme: () => void }

type NetFilter = 'all' | 'event' | 'contacts'

const typeLabel = (t: string) => t === 'event' ? 'EVENT' : 'CONTACTS'
const typeColor = (t: string) => t === 'event' ? 'var(--bl)' : 'var(--p)'

const detailContent: Record<string, { details: string; location: string; notes: string; contacts: string[] }> = {
  meetup: {
    details: 'Monatliches Gruendertreffen mit Fokus auf AI & SaaS. Networking, Pitches, Erfahrungsaustausch.',
    location: 'Wizemann Stuttgart, Raum 3',
    notes: 'Visitenkarten mitnehmen. Pitch fuer Hebammenbuero vorbereiten.',
    contacts: ['Max Bauer (AI Startup)', 'Lisa Schmidt (SaaS Investor)', 'Tom Krause (Dev Agency)'],
  },
  conference: {
    details: 'Zweitaegige Konferenz zu Enterprise AI. Keynotes, Workshops, Expo.',
    location: 'ICM Muenchen, Halle B',
    notes: 'Tag 1: Keynotes + Workshops. Tag 2: Expo + Networking.',
    contacts: ['Dr. Weber (SAP AI Lab)', 'Anna Meier (Microsoft DACH)'],
  },
  contacts: {
    details: 'Die wichtigsten Kontakte mit offenen Follow-ups. Regelmaessiger Check alle 2 Wochen.',
    location: 'Remote / Diverse',
    notes: '5 Follow-ups offen. Prioritaet: Investor-Gespraeche abschliessen.',
    contacts: ['Sarah Klein (Angel Investor)', 'Marco Rossi (Co-Founder Match)', 'Julia Braun (Hebammenverband)', 'David Park (Y Combinator Scout)', 'Elena Wolf (HTGF)'],
  },
}

export function Network({ toggleTheme }: Props) {
  const { networkEntries, tickerData, networkPipelines } = useMissionControl()
  const [sel, setSel] = useState(0)
  const [tab, setTab] = useState(0)
  const [filter, setFilter] = useState<NetFilter>('all')

  const filtered = useMemo(() => {
    switch (filter) {
      case 'event': return networkEntries.filter(e => e.type === 'event')
      case 'contacts': return networkEntries.filter(e => e.type === 'contacts')
      default: return networkEntries
    }
  }, [filter])

  const entry = filtered[sel] || networkEntries[0] || undefined
  const detail = entry ? detailContent[entry.id] : undefined
  const netMilestones = entry ? (networkPipelines[entry.id] || []) : []
  const netPipeline = netMilestones.length > 0 ? (
    <Pipeline label="Status" milestones={netMilestones} summary={`${netMilestones.filter(m => m.status === 'done').length}/${netMilestones.length}`} />
  ) : undefined

  const tabs = entry && detail ? [
    {
      label: 'Details',
      content: (
        <>
          <TcLabel>Beschreibung</TcLabel>
          <TcText>{detail.details}</TcText>
          <TcLabel>Uebersicht</TcLabel>
          <TcStatRow>
            {entry.kpis.map((k, i) => (
              <TcStat key={i} value={k.value} label={k.label} color={k.color} />
            ))}
          </TcStatRow>
        </>
      ),
    },
    {
      label: 'Location',
      content: (
        <>
          <TcLabel>Ort</TcLabel>
          <div className="ghost-card" style={{ padding: '14px 18px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10, '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
            <MapPin size={16} stroke={entry.color} />
            <span style={{ fontSize: 13, color: 'var(--tx2)' }}>{detail.location}</span>
          </div>
        </>
      ),
    },
    {
      label: 'Kontakte',
      content: (
        <>
          <TcLabel>Relevante Kontakte</TcLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {detail.contacts.map((c, i) => (
              <div key={i} className="ghost-card" style={{ padding: '12px 16px', borderRadius: 12, fontSize: 13, color: 'var(--tx2)', display: 'flex', alignItems: 'center', gap: 10, '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
                <StatusLed color={entry.color} glow={entry.glow} size={7} />
                {c}
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      label: 'Notizen',
      content: (
        <>
          <TcLabel>Notizen</TcLabel>
          <TcText>{detail.notes}</TcText>
        </>
      ),
    },
  ] : []

  return (
    <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        toggleTheme={toggleTheme}
      />

      <SplitLayout
        left={
          <>
            {/* Filter bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
              {([
                { key: 'all' as NetFilter, label: 'All' },
                { key: 'event' as NetFilter, label: 'Events' },
                { key: 'contacts' as NetFilter, label: 'Contacts' },
              ]).map(f => (
                <button
                  key={f.key}
                  onClick={() => { setFilter(f.key); setSel(0); setTab(0) }}
                  style={{
                    padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit', background: 'transparent',
                    border: '1px solid transparent', boxShadow: 'none',
                    color: filter === f.key ? 'var(--tx)' : 'var(--tx3)',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)', letterSpacing: 1,
                  }}
                >
                  {f.label}
                </button>
              ))}
              <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>
                {filtered.length} Eintraege
              </span>
            </div>

            {/* Network cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {filtered.map((e, i) => (
                <div
                  key={e.id}
                  className="ghost-card"
                  style={{ '--hc': e.glow, padding: '18px 22px', gap: 8 } as React.CSSProperties}
                  onClick={() => { setSel(i); setTab(0) }}
                >
                  {/* Top-right external link icon */}
                  <div
                    className="ghost-open-icon"
                    style={{
                      position: 'absolute', top: 12, right: 12, zIndex: 2,
                      cursor: 'pointer', opacity: 0,
                      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                  >
                    <ExternalLink size={14} stroke="var(--tx3)" />
                  </div>

                  {/* Name */}
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>{e.name}</div>

                  {/* Type badge + Status badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                      background: `${typeColor(e.type)}12`, color: typeColor(e.type), letterSpacing: 1,
                    }}>
                      {typeLabel(e.type)}
                    </span>
                    {e.badge.label && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                        background: e.badge.bg, color: e.badge.color, letterSpacing: 1,
                      }}>
                        {e.badge.label}
                      </span>
                    )}
                  </div>

                  {/* First 2 KPIs inline */}
                  <div className="ghost-foot" style={{ display: 'flex', gap: 14, marginTop: 2 }}>
                    {e.kpis.slice(0, 2).map((k, ki) => (
                      <div key={ki} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: k.color }}>{k.value}</span>
                        <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{k.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Color accent bar */}
                  <div style={{ width: 32, height: 3, borderRadius: 2, background: e.color, opacity: 0.5, marginTop: 2 }} />
                </div>
              ))}
            </div>
          </>
        }
        right={
          !entry ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 700, color: 'var(--tx3)', opacity: 0.3 }}>—</span>
              <span style={{ fontSize: 13, color: 'var(--tx3)' }}>Keine Netzwerk-Eintraege</span>
            </div>
          ) : (
          <PreviewPanel
            title={entry.name}
            ledColor={entry.color}
            ledGlow={entry.glow}
            badge={entry.badge.label ? entry.badge : undefined}
            pipeline={netPipeline}
            tabs={tabs}
            activeTab={tab}
            onTabChange={setTab}
            accentColor={entry.color}
            headerAction={
              <div
                className="ghost-btn"
                style={{ '--bc': `${entry.color}22`, padding: '5px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', width: 'auto', height: 'auto' } as React.CSSProperties}
              >
                <ExternalLink size={12} stroke={entry.color} />
                <span style={{ fontSize: 10, fontWeight: 700, color: entry.color }}>Oeffnen</span>
              </div>
            }
          />
          )
        }
      />

      <BottomTicker
        label="NETWORK"
        ledColor="var(--t)"
        ledGlow="var(--tg)"
        items={tickerData.network}
      />
    </div>
  )
}
