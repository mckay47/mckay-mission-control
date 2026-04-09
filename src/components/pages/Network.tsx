import { useState } from 'react'
import { Header } from '../shared/Header.tsx'
import { SplitLayout } from '../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText, TcStatRow, TcStat } from '../shared/PreviewPanel.tsx'
import { BottomTicker } from '../shared/BottomTicker.tsx'
import { networkCategories } from '../../lib/categories.ts'

interface Props { toggleTheme: () => void }

const categoryTabs: Record<string, string[]> = {
  kontakte: ['Uebersicht', 'Kunden', 'Dienstleister'],
  events: ['Uebersicht', 'Geplant', 'Vergangen'],
  portale: ['Uebersicht', 'Aktiv', 'Abgeschlossen'],
  partner: ['Uebersicht', 'Aktiv', 'Potentiell'],
  opportunities: ['Uebersicht', 'Pipeline', 'Heiss'],
}

const tabPlaceholders: Record<string, Record<string, string>> = {
  kontakte: {
    Uebersicht: '45 Kontakte insgesamt — Kunden, Partner, Dienstleister im CRM.',
    Kunden: '15 aktive Kunden — Hebam Agency, HebamBuero, weitere Projekte.',
    Dienstleister: 'Steuerberaterin, Rechtsanwalt, Designer, Freelancer — alle Kontakte.',
  },
  events: {
    Uebersicht: '3 geplante Events — Meetups, Konferenzen, Networking-Termine.',
    Geplant: 'Naechstes Event: 15. April — Gruendertreffen Stuttgart.',
    Vergangen: 'Vergangene Events mit Kontakt-Notizen und Follow-ups.',
  },
  portale: {
    Uebersicht: '4 aktive Portale und Kurse — Voice Agent, Marketing, Weiterbildung.',
    Aktiv: '2 aktive Kurse — AI Voice Agent Workshop, Growth Marketing Kurs.',
    Abgeschlossen: '1 abgeschlossener Kurs — React Advanced Patterns.',
  },
  partner: {
    Uebersicht: '6 aktive Business-Partner — Agenturen, Freelancer, Kooperationen.',
    Aktiv: '6 aktive Partnerschaften — regelmaessiger Austausch und Projekte.',
    Potentiell: '3 potentielle Partner — in Gespraechen oder Evaluierung.',
  },
  opportunities: {
    Uebersicht: 'Opportunity-Pipeline: 5 Leads, 2 davon heiss.',
    Pipeline: '5 Opportunities in der Pipeline — verschiedene Stadien.',
    Heiss: '2 heisse Opportunities — sofortige Aufmerksamkeit erforderlich.',
  },
}

export function Network({ toggleTheme }: Props) {
  const [sel, setSel] = useState(0)
  const [tab, setTab] = useState(0)

  const cat = networkCategories[sel]
  const tabLabels = categoryTabs[cat.id] || ['Uebersicht']

  const tabs = tabLabels.map((label) => ({
    label,
    content: (
      <>
        <TcLabel>{label}</TcLabel>
        <TcText>{tabPlaceholders[cat.id]?.[label] || 'Inhalt wird in Phase 2 eingebaut.'}</TcText>
        {label === 'Uebersicht' && (
          <>
            <TcLabel>Statistiken</TcLabel>
            <TcStatRow>
              {cat.stats.map((s, i) => (
                <TcStat key={i} value={s.value} label={s.label} color={cat.color} />
              ))}
            </TcStatRow>
          </>
        )}
      </>
    ),
  }))

  return (
    <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        backLink={{ label: 'Cockpit', href: '/' }}
        title="Network"
        toggleTheme={toggleTheme}
      />

      <SplitLayout
        ratio="55% 45%"
        left={
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className="st" style={{ padding: '0 2px' }}>Bereiche</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>
                {networkCategories.length} Bereiche
              </span>
            </div>

            {/* Category cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {networkCategories.map((c, i) => (
                <div
                  key={c.id}
                  className="ghost-card"
                  style={{ '--hc': c.glow, padding: '18px 22px', gap: 8, cursor: 'pointer' } as React.CSSProperties}
                  onClick={() => { setSel(i); setTab(0) }}
                >
                  {/* Emoji + Name + Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{c.emoji}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>{c.name}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                      background: `${c.color}15`, color: c.color, letterSpacing: 1, marginLeft: 'auto',
                    }}>
                      {c.badge}
                    </span>
                  </div>

                  {/* Description */}
                  <div style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.5 }}>{c.desc}</div>

                  {/* Stats */}
                  <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
                    {c.stats.map((s, si) => (
                      <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: c.color }}>{s.value}</span>
                        <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{s.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Color accent bar */}
                  <div style={{ width: 32, height: 3, borderRadius: 2, background: c.color, opacity: 0.5, marginTop: 2 }} />
                </div>
              ))}
            </div>
          </>
        }
        right={
          <PreviewPanel
            title={cat.name}
            ledColor={cat.color}
            ledGlow={cat.glow}
            badge={{ label: cat.badge, bg: `${cat.color}15`, color: cat.color }}
            tabs={tabs}
            activeTab={tab}
            onTabChange={setTab}
            accentColor={cat.color}
          />
        }
      />

      <BottomTicker
        label="NETWORK"
        ledColor="var(--t)"
        ledGlow="var(--tg)"
        items={[
          { color: 'var(--t)', label: 'KONTAKTE', labelColor: 'var(--t)', text: '45 Kontakte im CRM — 15 Kunden, 8 Partner' },
          { color: 'var(--p)', label: 'EVENTS', labelColor: 'var(--p)', text: 'Naechstes Event: 15. April — Gruendertreffen' },
          { color: 'var(--g)', label: 'OPPORTUNITIES', labelColor: 'var(--g)', text: '2 heisse Leads in der Pipeline' },
          { color: 'var(--bl)', label: 'PARTNER', labelColor: 'var(--bl)', text: '6 aktive Partnerschaften' },
        ]}
      />
    </div>
  )
}
