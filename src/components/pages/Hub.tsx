import { useState } from 'react'
import { Header } from '../shared/Header.tsx'
import { SplitLayout } from '../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText, TcStatRow, TcStat } from '../shared/PreviewPanel.tsx'
import { BottomTicker } from '../shared/BottomTicker.tsx'
import { hubCategories } from '../../lib/data.ts'

interface Props { toggleTheme: () => void }

const categoryTabs: Record<string, string[]> = {
  kalender: ['Heute', 'Woche', 'Monat'],
  todos: ['Alle', 'Heute faellig', 'Diese Woche'],
  'email-hub': ['Alle', 'Ungelesen', 'Dringend'],
}

const tabPlaceholders: Record<string, Record<string, string>> = {
  kalender: {
    Heute: '2 Termine heute — 10:00 Daily Standup, 14:00 Hebammenbuero Validation Call.',
    Woche: '7 Termine diese Woche — Business + Privat zusammengefasst.',
    Monat: 'Monatsansicht mit allen Terminen aus Google Calendar.',
  },
  todos: {
    Alle: '8 offene Todos — Business und Privat zusammen, sortiert nach Prioritaet.',
    'Heute faellig': '2 Todos heute faellig — Bank-Ueberweisung, Steuerberater anrufen.',
    'Diese Woche': '5 Todos diese Woche — inklusive 2 die heute faellig sind.',
  },
  'email-hub': {
    Alle: 'Alle 5 Postfaecher auf einen Blick — 17 ungelesene Mails gesamt.',
    Ungelesen: '17 ungelesene E-Mails — sortiert nach Postfach und Eingang.',
    Dringend: '3 dringende E-Mails die sofortige Aufmerksamkeit brauchen.',
  },
}

export function Hub({ toggleTheme }: Props) {
  const [sel, setSel] = useState(0)
  const [tab, setTab] = useState(0)

  const cat = hubCategories[sel]
  const tabLabels = categoryTabs[cat.id] || ['Alle']

  const tabs = tabLabels.map((label) => ({
    label,
    content: (
      <>
        <TcLabel>{label}</TcLabel>
        <TcText>{tabPlaceholders[cat.id]?.[label] || 'Inhalt wird in Phase 2 eingebaut.'}</TcText>
        {label === tabLabels[0] && (
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
        title="Hub"
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
                {hubCategories.length} Bereiche
              </span>
            </div>

            {/* Category cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {hubCategories.map((c, i) => (
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
        label="HUB"
        ledColor="var(--t)"
        ledGlow="var(--tg)"
        items={[
          { color: 'var(--g)', label: 'KALENDER', labelColor: 'var(--g)', text: '2 Termine heute — 7 diese Woche' },
          { color: 'var(--o)', label: 'TODOS', labelColor: 'var(--o)', text: '8 offene Todos — 2 heute faellig' },
          { color: 'var(--bl)', label: 'EMAIL', labelColor: 'var(--bl)', text: '17 ungelesene Mails — 3 dringend' },
        ]}
      />
    </div>
  )
}
