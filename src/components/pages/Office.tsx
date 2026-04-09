import { useState } from 'react'
import { Header } from '../shared/Header.tsx'
import { SplitLayout } from '../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText, TcStatRow, TcStat } from '../shared/PreviewPanel.tsx'
import { BottomTicker } from '../shared/BottomTicker.tsx'
import { officeCategories } from '../../lib/categories.ts'

interface Props { toggleTheme: () => void }

const categoryTabs: Record<string, string[]> = {
  buchhaltung: ['Uebersicht', 'Belege', 'Datev'],
  subscriptions: ['Uebersicht', 'Services', 'Kosten'],
  vertraege: ['Uebersicht', 'Aktiv', 'Auslaufend'],
  kunden: ['Uebersicht', 'Hebam Agency', 'HebamBuero'],
  'business-email': ['Uebersicht', 'Postfaecher', 'Ungelesen'],
}

const tabPlaceholders: Record<string, Record<string, string>> = {
  buchhaltung: {
    Uebersicht: 'Buchhaltungs-Dashboard mit Monatsueberblick wird in Phase 2 eingebaut.',
    Belege: 'Belege-Upload und Kategorisierung wird in Phase 2 eingebaut.',
    Datev: 'Datev-Export und Steuerberaterin-Schnittstelle wird in Phase 2 eingebaut.',
  },
  subscriptions: {
    Uebersicht: 'Alle aktiven Subscriptions mit monatlichen Kosten auf einen Blick.',
    Services: 'Detailliste aller SaaS-Services, Lizenzen und API-Kosten.',
    Kosten: 'Kostenentwicklung und Optimierungspotenziale werden hier angezeigt.',
  },
  vertraege: {
    Uebersicht: 'Alle laufenden Vertraege mit Kuendigungsfristen im Ueberblick.',
    Aktiv: '7 aktive Vertraege — Handy, Auto, Lizenzen, Hosting.',
    Auslaufend: 'Vertraege die in den naechsten 90 Tagen auslaufen.',
  },
  kunden: {
    Uebersicht: 'Kunden-Dashboard fuer alle Businesses.',
    'Hebam Agency': 'findemeinehebamme.de — ca. 100 Bestellungen in 10 Wochen.',
    HebamBuero: 'HebamBuero SaaS — 12 aktive Kunden im Pilotbetrieb.',
  },
  'business-email': {
    Uebersicht: 'Alle Business-Postfaecher auf einen Blick.',
    Postfaecher: '3 Postfaecher: support@, info@, mehti@ — Uebersicht pro Postfach.',
    Ungelesen: '5 ungelesene E-Mails — sortiert nach Prioritaet.',
  },
}

export function Office({ toggleTheme }: Props) {
  const [sel, setSel] = useState(0)
  const [tab, setTab] = useState(0)

  const cat = officeCategories[sel]
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
        title="Office"
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
                {officeCategories.length} Bereiche
              </span>
            </div>

            {/* Category cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {officeCategories.map((c, i) => (
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
        label="OFFICE"
        ledColor="var(--bl)"
        ledGlow="var(--blg)"
        items={[
          { color: 'var(--bl)', label: 'BUCHHALTUNG', labelColor: 'var(--bl)', text: 'Letzter Beleg-Upload: 28. Maerz 2026' },
          { color: 'var(--p)', label: 'SUBSCRIPTIONS', labelColor: 'var(--p)', text: '9 aktive Services — Monatlich EUR 347' },
          { color: 'var(--g)', label: 'KUNDEN', labelColor: 'var(--g)', text: 'Hebam Agency: ~100 Bestellungen' },
          { color: 'var(--o)', label: 'EMAIL', labelColor: 'var(--o)', text: '5 ungelesene Business-Mails' },
        ]}
      />
    </div>
  )
}
