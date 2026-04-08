import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { Header } from '../shared/Header.tsx'
import { SplitLayout } from '../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText, TcStatRow, TcStat } from '../shared/PreviewPanel.tsx'
import { BottomTicker } from '../shared/BottomTicker.tsx'
import { StatusLed } from '../ui/StatusLed.tsx'
import { Pipeline } from '../shared/Pipeline.tsx'
import { useMissionControl } from '../../lib/MissionControlProvider.tsx'

interface Props { toggleTheme: () => void }

const detailContent: Record<string, { description: string; stats: { value: string; label: string; color?: string }[]; notes: string }> = {
  familie: {
    description: 'Familienzeit ist nicht verhandelbar. Feste Bloecke im Kalender, Abendessen gemeinsam, Wochenenden frei.',
    stats: [{ value: '3', label: 'Events', color: 'var(--pk)' }, { value: '7', label: 'Tage/Wo', color: 'var(--g)' }],
    notes: 'Kindergeburtstag am Samstag vorbereiten. Geschenk besorgen.',
  },
  urlaub: {
    description: 'Griechenland-Trip im Juni. Fluege gebucht, Hotel noch offen. Budget: EUR 3.500.',
    stats: [{ value: '72', label: 'Tage', color: 'var(--bl)' }, { value: '14', label: 'Naechte', color: 'var(--t)' }],
    notes: 'Hotel auf Kreta vergleichen. Mietwagen reservieren.',
  },
  wellness: {
    description: 'Gym 3x/Woche, Meditation morgens 10 Min. Arzttermin am 15.04 nicht vergessen.',
    stats: [{ value: '12', label: 'Streak', color: 'var(--g)' }, { value: '3x', label: 'Gym/Wo', color: 'var(--bl)' }],
    notes: 'Neues Trainingsplan-Update nach 4 Wochen. Blutbild-Ergebnisse abholen.',
  },
  sandbox: {
    description: 'Persoenliche Projekte und Lernziele. Japanisch, Fotografie, Buecher.',
    stats: [{ value: '5', label: 'Projekte', color: 'var(--p)' }, { value: '45', label: 'Tage JP', color: 'var(--a)' }],
    notes: 'Japanisch: Kanji Set 3 abschliessen. Streetart-Tour Ulm planen.',
  },
}

export function Personal({ toggleTheme }: Props) {
  const { personalAreas, tickerData, personalPipelines } = useMissionControl()
  const [sel, setSel] = useState(0)
  const [tab, setTab] = useState(0)

  const area = personalAreas[sel] || undefined
  const detail = area ? detailContent[area.id] : undefined
  const areaMilestones = area ? (personalPipelines[area.id] || []) : []
  const pipeline = areaMilestones.length > 0 ? (
    <Pipeline label="Status" milestones={areaMilestones} summary={`${areaMilestones.filter(m => m.status === 'done').length}/${areaMilestones.length}`} />
  ) : undefined

  const tabs = area && detail ? [
    {
      label: 'Details',
      content: (
        <>
          <TcLabel>Beschreibung</TcLabel>
          <TcText>{detail.description}</TcText>
          <TcLabel>Uebersicht</TcLabel>
          <TcStatRow>
            {detail.stats.map((s, i) => (
              <TcStat key={i} value={s.value} label={s.label} color={s.color} />
            ))}
          </TcStatRow>
        </>
      ),
    },
    {
      label: 'Items',
      content: (
        <>
          <TcLabel>Aktuelle Eintraege</TcLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {area.items.map((item, i) => (
              <div key={i} className="ghost-card" style={{ padding: '12px 16px', borderRadius: 12, fontSize: 13, color: 'var(--tx2)', display: 'flex', alignItems: 'center', gap: 10, '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
                <StatusLed color={area.color} glow={area.glow} size={7} />
                {item}
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
        backLink={{ label: 'Cockpit', href: '/' }}
        toggleTheme={toggleTheme}
      />

      <SplitLayout
        left={
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className="st" style={{ padding: '0 2px' }}>Bereiche</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>
                {personalAreas.length} Bereiche
              </span>
            </div>

            {/* Area cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {personalAreas.map((a, i) => (
                <div
                  key={a.id}
                  className="ghost-card"
                  style={{ '--hc': a.glow, padding: '18px 22px', gap: 8 } as React.CSSProperties}
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

                  {/* Name + Status badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>{a.name}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                      background: a.badge.bg, color: a.badge.color, letterSpacing: 1,
                    }}>
                      {a.badge.label}
                    </span>
                  </div>

                  {/* Item count */}
                  <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: a.color }}>
                      {a.items.length}
                    </span> Items
                  </div>

                  {/* Short info text */}
                  <div style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.5 }}>{a.info}</div>

                  {/* Color accent bar */}
                  <div style={{ width: 32, height: 3, borderRadius: 2, background: a.color, opacity: 0.5, marginTop: 2 }} />
                </div>
              ))}
            </div>
          </>
        }
        right={
          !area ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 700, color: 'var(--tx3)', opacity: 0.3 }}>—</span>
              <span style={{ fontSize: 13, color: 'var(--tx3)' }}>Keine persoenlichen Bereiche konfiguriert</span>
            </div>
          ) : (
          <PreviewPanel
            title={area.name}
            ledColor={area.color}
            ledGlow={area.glow}
            badge={area.badge}
            pipeline={pipeline}
            tabs={tabs}
            activeTab={tab}
            onTabChange={setTab}
            accentColor={area.color}
            headerAction={
              <div
                className="ghost-btn"
                style={{ '--bc': `${area.color}22`, padding: '5px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', width: 'auto', height: 'auto' } as React.CSSProperties}
              >
                <ExternalLink size={12} stroke={area.color} />
                <span style={{ fontSize: 10, fontWeight: 700, color: area.color }}>Oeffnen</span>
              </div>
            }
          />
          )
        }
      />

      <BottomTicker
        label="PERSONAL"
        ledColor="var(--pk)"
        ledGlow="var(--pkg)"
        items={tickerData.personal}
      />
    </div>
  )
}
