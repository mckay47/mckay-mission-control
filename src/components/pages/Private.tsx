import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../shared/AppShell'

/* ── Dummy Data ─────────────────────────────────────────── */

interface PrivateArea {
  id: string
  name: string
  desc: string
  badgeLabel: string
  badgeBg: string
  badgeColor: string
  colorVar: string
  glowVar: string
  icon: React.ReactNode
  items: string[]
  footInfo: string
}

const areas: PrivateArea[] = [
  {
    id: 'familie',
    name: 'Familie',
    desc: 'Familienaktivitäten, Kindergeburtstage, gemeinsame Zeit.',
    badgeLabel: '3 Events',
    badgeBg: 'var(--rc)',
    badgeColor: 'var(--pk)',
    colorVar: 'var(--pk)',
    glowVar: 'var(--pkg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--pk)">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    items: ['Sa: Kindergeburtstag 14:00', 'So: Familien-Brunch 11:00', 'Do: Abendessen 19:30'],
    footInfo: 'Nächstes: heute 19:30',
  },
  {
    id: 'urlaub',
    name: 'Urlaub',
    desc: 'Urlaubsplanung, Reisen, Auszeiten vom Alltag.',
    badgeLabel: 'geplant',
    badgeBg: 'var(--blc)',
    badgeColor: 'var(--bl)',
    colorVar: 'var(--bl)',
    glowVar: 'var(--blg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--bl)">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    items: ['Sommerurlaub: Griechenland 14.-28. Juni', 'Flüge gebucht \u2713', 'Hotel: noch offen'],
    footInfo: 'In 72 Tagen',
  },
  {
    id: 'wellness',
    name: 'Wellness & Fitness',
    desc: 'Gesundheit, Sport, Ernährung, Routinen.',
    badgeLabel: '\u25CF Aktiv',
    badgeBg: 'var(--gc)',
    badgeColor: 'var(--g)',
    colorVar: 'var(--g)',
    glowVar: 'var(--gg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--g)">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    items: ['3x/Woche Gym', 'Meditation: 15min morgens', 'Nächster Arzttermin: 15.04'],
    footInfo: 'Streak: 12 Tage',
  },
  {
    id: 'sandkasten',
    name: 'Sandkasten',
    desc: 'Persönliche Experimente, Hobbys, Lernprojekte.',
    badgeLabel: '5 Ideen',
    badgeBg: 'rgba(124,77,255,.06)',
    badgeColor: 'var(--p)',
    colorVar: 'var(--p)',
    glowVar: 'var(--pg)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="var(--p)">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    items: ['Japanisch lernen (Duolingo Tag 45)', 'Fotografie-Projekt: Streetart Ulm', 'Buch: "The Lean Startup" lesen'],
    footInfo: '5 aktive Projekte',
  },
]

interface DetailData {
  title: string
  badgeLabel: string
  badgeBg: string
  badgeColor: string
  sections: { label: string; html: React.ReactNode }[]
}

const detailMap: Record<string, DetailData> = {
  familie: {
    title: 'Familie',
    badgeLabel: '3 Events',
    badgeBg: 'var(--rc)',
    badgeColor: 'var(--pk)',
    sections: [
      {
        label: 'Nächste Events',
        html: (
          <div className="pvdet-text">
            <b style={{ color: 'var(--pk)' }}>Heute 19:30</b> -- Abendessen mit Familie<br />
            <b style={{ color: 'var(--pk)' }}>Sa 14:00</b> -- Kindergeburtstag (Emma, 5 Jahre)<br />
            <b style={{ color: 'var(--pk)' }}>So 11:00</b> -- Familien-Brunch bei Oma
          </div>
        ),
      },
      {
        label: 'Einkaufsliste Geburtstag',
        html: (
          <div className="pvdet-text">
            Geschenk: Malset (bestellt {'\u2713'})<br />
            Kuchen: Schoko-Erdbeer (backen Sa morgens)<br />
            Deko: Luftballons + Banner
          </div>
        ),
      },
      {
        label: 'Notizen',
        html: (
          <div className="pvdet-text">
            Restaurant heute: Reservierung 4 Personen<br />
            Oma: Blumen mitbringen Sonntag<br />
            Nächste Woche: Elternabend Mi 18:00
          </div>
        ),
      },
    ],
  },
  urlaub: {
    title: 'Urlaub',
    badgeLabel: 'geplant',
    badgeBg: 'var(--blc)',
    badgeColor: 'var(--bl)',
    sections: [
      {
        label: 'Sommerurlaub',
        html: (
          <div className="pvdet-text">
            <b style={{ color: 'var(--bl)' }}>Griechenland</b> -- 14. bis 28. Juni<br />
            Flüge gebucht {'\u2713'}<br />
            Hotel: noch offen -- Budget {'\u20AC'}2.500
          </div>
        ),
      },
      {
        label: 'Todo',
        html: (
          <div className="pvdet-text">
            Hotel buchen (Kreta oder Santorin)<br />
            Mietwagen reservieren<br />
            Reiseversicherung abschliessen
          </div>
        ),
      },
    ],
  },
  wellness: {
    title: 'Wellness & Fitness',
    badgeLabel: '\u25CF Aktiv',
    badgeBg: 'var(--gc)',
    badgeColor: 'var(--g)',
    sections: [
      {
        label: 'Routine',
        html: (
          <div className="pvdet-text">
            <b style={{ color: 'var(--g)' }}>Gym:</b> Mo/Mi/Fr -- Streak 12 Tage<br />
            <b style={{ color: 'var(--g)' }}>Meditation:</b> Täglich 15min morgens<br />
            <b style={{ color: 'var(--g)' }}>Ernährung:</b> Meal Prep sonntags
          </div>
        ),
      },
      {
        label: 'Termine',
        html: (
          <div className="pvdet-text">
            Arzttermin: 15.04 (Hausarzt)<br />
            Zahnarzt: 22.04
          </div>
        ),
      },
    ],
  },
  sandkasten: {
    title: 'Sandkasten',
    badgeLabel: '5 Ideen',
    badgeBg: 'rgba(124,77,255,.06)',
    badgeColor: 'var(--p)',
    sections: [
      {
        label: 'Aktive Projekte',
        html: (
          <div className="pvdet-text">
            <b style={{ color: 'var(--p)' }}>Japanisch:</b> Duolingo Tag 45 Streak<br />
            <b style={{ color: 'var(--p)' }}>Fotografie:</b> Streetart Ulm Projekt<br />
            <b style={{ color: 'var(--p)' }}>Lesen:</b> The Lean Startup (Kapitel 8)
          </div>
        ),
      },
      {
        label: 'Ideen-Backlog',
        html: (
          <div className="pvdet-text">
            Arduino Smart Home Bastelprojekt<br />
            Podcast starten (AI & Business)
          </div>
        ),
      },
    ],
  },
}

interface TickerItem {
  agent: string
  color: string
  text: string
}

const feedItems: TickerItem[] = [
  { agent: 'familie', color: 'var(--pk)', text: 'Abendessen heute 19:30 -- reserviert' },
  { agent: 'familie', color: 'var(--pk)', text: 'Kindergeburtstag Sa -- Geschenk bestellt' },
  { agent: 'urlaub', color: 'var(--bl)', text: 'Griechenland in 72 Tagen -- Hotel buchen' },
  { agent: 'fitness', color: 'var(--g)', text: 'Gym Streak: 12 Tage -- weiter so!' },
  { agent: 'sandbox', color: 'var(--p)', text: 'Japanisch Tag 45 -- neue Kanji gelernt' },
]

/* ── Component ──────────────────────────────────────────── */

export default function Private() {
  const [selected, setSelected] = useState('familie')
  const navigate = useNavigate()

  const detail = detailMap[selected] ?? detailMap.familie

  return (
    <AppShell title="Private" ledColor="pk">
      {/* KPI Row */}
      <div className="krow">
        <div className="kpi cf" style={{ '--kc': 'var(--pkg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--pkg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--pk)">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--pk)' }}>4</div>
            <div className="kl">Bereiche</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--gg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--gg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--g)">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--g)' }}>3</div>
            <div className="kl">Termine privat</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--blg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--blg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--bl)">
              <path d="M4.93 4.93l14.14 14.14" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--bl)' }}>72d</div>
            <div className="kl">Nächster Urlaub</div>
          </div>
        </div>
        <div className="kpi cf" style={{ '--kc': 'var(--pg)' } as React.CSSProperties}>
          <div className="btn3d btn3d-sm" style={{ '--bc': 'var(--pg)' } as React.CSSProperties}>
            <svg viewBox="0 0 24 24" stroke="var(--p)">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <div className="kv" style={{ color: 'var(--p)' }}>5</div>
            <div className="kl">Sandbox Ideen</div>
          </div>
        </div>
      </div>

      {/* Section labels */}
      <div style={{ padding: '0 40px', marginBottom: 10, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <span className="st">Bereiche</span>
        <span className="st" style={{ marginLeft: 'auto', paddingRight: 400 }}>Detail & KANI</span>
      </div>

      {/* Main body: Grid + Detail */}
      <div className="pvbody">
        <div className="pvleft">
          <div className="pvgrid">
            {areas.map((area) => (
              <div key={area.id} className="cgw" style={{ '--gc2': area.glowVar } as React.CSSProperties}>
                <div
                  className="pvc cf"
                  style={{ '--hc': area.glowVar } as React.CSSProperties}
                  onClick={() => setSelected(area.id)}
                >
                  <div className="pvc-top">
                    <div className="btn3d" style={{ '--bc': area.glowVar } as React.CSSProperties}>
                      {area.icon}
                    </div>
                    <span className="pvc-badge" style={{ background: area.badgeBg, color: area.badgeColor }}>
                      {area.badgeLabel}
                    </span>
                  </div>
                  <div className="pvc-name">{area.name}</div>
                  <div className="pvc-desc">{area.desc}</div>
                  <div className="pvc-items">
                    {area.items.map((item, i) => (
                      <span key={i}>
                        {'\u25CF'} {item}
                        {i < area.items.length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                  <div className="pvc-foot">
                    <span className="pvc-info">{area.footInfo}</span>
                    <span className="pvc-arrow">{'\u2192'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detail + KANI */}
        <div className="pvright">
          <div className="pvdet cf">
            <div className="pvdet-hdr">
              <div className="pvdet-title">{detail.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 8, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: detail.badgeBg, color: detail.badgeColor }}>
                  {detail.badgeLabel}
                </span>
              </div>
            </div>
            <div className="pvdet-body">
              {detail.sections.map((sec, i) => (
                <div key={i}>
                  <div className="pvdet-label">{sec.label}</div>
                  {sec.html}
                </div>
              ))}
            </div>
          </div>

          <div className="pvkani cf">
            <div className="pvkani-hdr">
              <div className="pvkani-av">
                <svg viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="pvkani-nm">KANI &middot; Private</span>
              <span style={{ fontSize: 7, color: 'var(--g)', marginLeft: 'auto' }}>Online</span>
            </div>
            <div className="pvkani-body">
              <div className="pvkm k in">
                Heute Abend: Restaurant reserviert für 4 Personen um 19:30.
                Kindergeburtstag Sa: Geschenk bestellt, Kuchen noch backen. Alles auf Kurs!
              </div>
              <div className="pvkm u">Erinner mich Sa morgens ans Kuchen backen</div>
              <div className="pvkm k in">
                Erledigt! Reminder gesetzt: Sa 08:00 &quot;Schoko-Erdbeer Kuchen backen für Emma&quot;.
                Soll ich die Zutatenliste vorbereiten?
              </div>
            </div>
            <div className="pvkani-in">
              <input className="pvkani-inp in" placeholder="Frag KANI zu Private..." readOnly />
              <button className="pvkani-send">
                <svg viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: Notifications + Quick Access */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 20, padding: '0 40px', marginTop: 16, flexShrink: 0 }}>
        {/* Notifications */}
        <div className="notif cf">
          <div className="notif-t">Notifications</div>
          <div className="notif-g">
            <div className="notif-cat">
              <div className="btn3d btn3d-lg" style={{ '--bc': 'var(--pkg)' } as React.CSSProperties}>
                <span className="notif-badge" style={{ background: 'var(--pk)', boxShadow: '0 2px 8px var(--pkg)' }}>3</span>
                <svg viewBox="0 0 24 24" stroke="var(--pk)"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <div className="notif-label" style={{ color: 'var(--pk)' }}>Familie</div>
              <div className="notif-detail">
                <span style={{ color: 'var(--pk)' }}>{'\u25CF'}</span> <b>Heute:</b> Abendessen 19:30<br />
                <span style={{ color: 'var(--pk)' }}>{'\u25CF'}</span> <b>Sa:</b> Kindergeburtstag 14:00<br />
                <span style={{ color: 'var(--pk)' }}>{'\u25CF'}</span> <b>So:</b> Brunch bei Oma 11:00
              </div>
            </div>
            <div className="notif-cat">
              <div className="btn3d btn3d-lg" style={{ '--bc': 'var(--blg)' } as React.CSSProperties}>
                <span className="notif-badge" style={{ background: 'var(--bl)', boxShadow: '0 2px 8px var(--blg)' }}>1</span>
                <svg viewBox="0 0 24 24" stroke="var(--bl)"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              </div>
              <div className="notif-label" style={{ color: 'var(--bl)' }}>Urlaub</div>
              <div className="notif-detail">
                <span style={{ color: 'var(--bl)' }}>{'\u25CF'}</span> <b>Hotel:</b> Noch nicht gebucht
              </div>
            </div>
            <div className="notif-cat">
              <div className="btn3d btn3d-lg" style={{ '--bc': 'var(--gg)' } as React.CSSProperties}>
                <span className="notif-badge" style={{ background: 'var(--g)', boxShadow: '0 2px 8px var(--gg)' }}>1</span>
                <svg viewBox="0 0 24 24" stroke="var(--g)"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
              </div>
              <div className="notif-label" style={{ color: 'var(--g)' }}>Wellness</div>
              <div className="notif-detail">
                <span style={{ color: 'var(--g)' }}>{'\u25CF'}</span> <b>Gym:</b> Streak 12 Tage!
              </div>
            </div>
            <div className="notif-cat">
              <div className="btn3d btn3d-lg" style={{ '--bc': 'var(--pg)' } as React.CSSProperties}>
                <span className="notif-badge" style={{ background: 'var(--p)', boxShadow: '0 2px 8px var(--pg)' }}>2</span>
                <svg viewBox="0 0 24 24" stroke="var(--p)"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1" /></svg>
              </div>
              <div className="notif-label" style={{ color: 'var(--p)' }}>Sandkasten</div>
              <div className="notif-detail">
                <span style={{ color: 'var(--p)' }}>{'\u25CF'}</span> <b>Japanisch:</b> Tag 45 Streak<br />
                <span style={{ color: 'var(--p)' }}>{'\u25CF'}</span> <b>Buch:</b> Kapitel 8 fertig
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="qa cf">
          <div className="qa-t">Quick Access</div>
          <div className="qa-g">
            <div className="qa-item" onClick={() => navigate('/thinktank')}>
              <div className="btn3d" style={{ '--bc': 'var(--pg)' } as React.CSSProperties}>
                <svg viewBox="0 0 24 24" stroke="var(--p)"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <span className="qa-lb">Thinktank</span>
              <span className="qa-sb">7 Ideen</span>
            </div>
            <div className="qa-item" onClick={() => navigate('/briefing')}>
              <div className="btn3d" style={{ '--bc': 'var(--tg)' } as React.CSSProperties}>
                <svg viewBox="0 0 24 24" stroke="var(--t)"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /></svg>
              </div>
              <span className="qa-lb">Briefing</span>
              <span className="qa-sb">Heute</span>
            </div>
            <div className="qa-item" onClick={() => navigate('/agents')}>
              <div className="btn3d" style={{ '--bc': 'var(--og)' } as React.CSSProperties}>
                <svg viewBox="0 0 24 24" stroke="var(--o)"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
              </div>
              <span className="qa-lb">Agents</span>
              <span className="qa-sb">3 aktiv</span>
            </div>
            <div className="qa-item" onClick={() => navigate('/backoffice')}>
              <div className="btn3d" style={{ '--bc': 'rgba(30,30,30,.06)' } as React.CSSProperties}>
                <svg viewBox="0 0 24 24" stroke="var(--tx2)"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              </div>
              <span className="qa-lb">Backoffice</span>
              <span className="qa-sb">Admin</span>
            </div>
            <div className="qa-item" onClick={() => navigate('/termine-todos')}>
              <div className="btn3d" style={{ '--bc': 'var(--blg)' } as React.CSSProperties}>
                <svg viewBox="0 0 24 24" stroke="var(--bl)"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /></svg>
              </div>
              <span className="qa-lb">Termine & Todos</span>
              <span className="qa-sb">Aufgaben</span>
            </div>
            <div className="qa-item" onClick={() => navigate('/private')}>
              <div className="btn3d" style={{ '--bc': 'var(--pkg)' } as React.CSSProperties}>
                <svg viewBox="0 0 24 24" stroke="var(--pk)"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <span className="qa-lb">Private</span>
              <span className="qa-sb">Persönlich</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Feed */}
      <div className="ticker-w">
        <div className="ticker cf" style={{ borderRadius: 24 }}>
          <div className="ticker-lbl">
            <span className="ticker-ld" style={{ background: 'var(--pk)', boxShadow: '0 0 10px var(--pkg)' }} />
            PRIVATE
          </div>
          <div className="ticker-c">
            <div className="ticker-s">
              {[...feedItems, ...feedItems].map((item, i) => (
                <div key={i} className="ticker-i">
                  <span className="ticker-id" style={{ background: item.color }} />
                  <span className="ticker-ia" style={{ color: item.color }}>{item.agent}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
