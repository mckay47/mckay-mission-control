import { useState } from 'react'
import { Header } from '../shared/Header.tsx'
import { SplitLayout } from '../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText, TcStatRow, TcStat } from '../shared/PreviewPanel.tsx'
import { BottomTicker } from '../shared/BottomTicker.tsx'
import { lifeCategories } from '../../lib/data.ts'

interface Props { toggleTheme: () => void }

const categoryTabs: Record<string, string[]> = {
  wohnung: ['Uebersicht', 'Mieter', 'Hausverwaltung'],
  familie: ['Uebersicht', 'Termine', 'Organisation'],
  gesundheit: ['Uebersicht', 'Fitness', 'Arzttermine'],
  'private-todos': ['Uebersicht', 'Offen', 'Erledigt'],
  'private-email': ['Uebersicht', 'Postfaecher'],
}

const tabPlaceholders: Record<string, Record<string, string>> = {
  wohnung: {
    Uebersicht: 'Wohnungs-Dashboard: Mieteinnahmen, Nebenkosten, Hausverwaltung.',
    Mieter: 'Aktueller Mieter — Vertragslaufzeit, Zahlungsstatus, Kontaktdaten.',
    Hausverwaltung: 'Hausverwaltungs-Kontakt, Nebenkostenabrechnungen, Reparaturen.',
  },
  familie: {
    Uebersicht: 'Familien-Hub: Naechste Termine, offene Aufgaben, wichtige Infos.',
    Termine: 'Gemeinsame Familien-Termine — Schule, Arzt, Aktivitaeten.',
    Organisation: 'Einkaufslisten, Urlaubsplanung, gemeinsame Projekte.',
  },
  gesundheit: {
    Uebersicht: 'Gesundheits-Tracker: Fitness-Streak, naechste Arzttermine.',
    Fitness: 'Gym 3x pro Woche — aktueller Streak: 12 Tage. Trainingsplan-Update faellig.',
    Arzttermine: 'Naechster Termin: 15.04. — Blutbild-Ergebnisse abholen.',
  },
  'private-todos': {
    Uebersicht: 'Alle privaten Aufgaben — Bank, Steuerberater, Erledigungen.',
    Offen: '5 offene Todos — 2 davon diese Woche faellig.',
    Erledigt: 'Abgeschlossene private Aufgaben der letzten 30 Tage.',
  },
  'private-email': {
    Uebersicht: 'Private Postfaecher — 12 ungelesene Mails, 4 davon heute.',
    Postfaecher: '2 Postfaecher: Gmail privat, iCloud — sortiert nach Relevanz.',
  },
}

export function Life({ toggleTheme }: Props) {
  const [sel, setSel] = useState(0)
  const [tab, setTab] = useState(0)

  const cat = lifeCategories[sel]
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
        title="Life"
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
                {lifeCategories.length} Bereiche
              </span>
            </div>

            {/* Category cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {lifeCategories.map((c, i) => (
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
        label="LIFE"
        ledColor="var(--pk)"
        ledGlow="var(--pkg)"
        items={[
          { color: 'var(--pk)', label: 'FAMILIE', labelColor: 'var(--pk)', text: 'Naechster Familientermin: Heute' },
          { color: 'var(--g)', label: 'GESUNDHEIT', labelColor: 'var(--g)', text: 'Gym-Streak: 12 Tage — weiter so!' },
          { color: 'var(--a)', label: 'TODOS', labelColor: 'var(--a)', text: '5 private Todos offen — 2 diese Woche' },
          { color: 'var(--t)', label: 'EMAIL', labelColor: 'var(--t)', text: '12 ungelesene private Mails' },
        ]}
      />
    </div>
  )
}
