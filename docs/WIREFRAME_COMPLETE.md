# MCKAY MISSION CONTROL — Komplettes Wireframe
> Stand: 30.03.2026 | Alle Screens, Buttons, Funktionen

---

## ARCHITEKTUR ÜBERSICHT

```
EINSTIEG
  Boot → Login → Launch → Cockpit Dashboard

COCKPIT DASHBOARD (3x3 Grid, Ultrawide)
  ├── System Status    [klick → Detail 9 Zellen]
  ├── Finanzen         [klick → Detail 9 Zellen]
  ├── Agents & Skills  [klick → Detail 9 Zellen]
  ├── Projekte         [klick → Detail 9 Zellen / neues Fenster]
  ├── Todos & Status   [klick → Detail 9 Zellen]
  ├── Ideen Pipeline   [klick → Thinktank View]
  ├── Briefing         [klick → Briefing View]
  ├── Thinktank        [klick → Thinktank View]
  └── Quick Access     [→ /system, /office]

THINKTANK VIEW (inline im Cockpit)
  ├── Übersicht (Default)
  └── Neue Idee (Multi-Step Workflow)

BRIEFING VIEW (inline im Cockpit)
  └── 3-Spalten: Gestern / Empfehlung / Heute

PROJEKT-FENSTER (neues Browser-Fenster, MacBook)
  └── Terminal + Ideen + Todos + Info

SYSTEM (/system, eigene Route, 3x3 Grid)
OFFICE (/office, eigene Route, 3x3 Grid)
```

---

## SCREEN 1: BOOT SEQUENCE

### Phase: Boot (weißer/dunkler Screen, nur Mitte)
```
┌─────────────────────────────────────────────────┐
│                                                 │
│                                                 │
│                                                 │
│                   [ ● START ]                   │
│                                                 │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```
- **Button:** "● START" → wechselt zu Login-Phase
- **Alles andere:** leer/dunkel

### Phase: Login
```
┌─────────────────────────────────────────────────┐
│                                                 │
│              MCKAY MISSION CONTROL              │
│                                                 │
│              ┌───────────────────┐              │
│              │  🔐 Touch ID      │              │
│              │  ─────────────    │              │
│              │  User: ________  │              │
│              │  Pass: ________  │              │
│              │  [Verifizieren]   │              │
│              └───────────────────┘              │
│                                                 │
└─────────────────────────────────────────────────┘
```
- **Touch ID Button:** simuliert Fingerabdruck → wechselt zu Launch
- **Oder:** User/Passwort eingeben + Verifizieren Button
- **Nach Verifizierung:** → Launch Phase

### Phase: Launch
```
┌─────────────────────────────────────────────────┐
│                                                 │
│              ✓ Verifiziert                       │
│                                                 │
│              Hallo Mehti, Welcome back.          │
│              Legen wir los.                     │
│                                                 │
│              [System starten]                   │
│                                                 │
└─────────────────────────────────────────────────┘
```
- **Button:** "System starten" → Animation (Vorhang/Fade) → Dashboard erscheint

---

## SCREEN 2: COCKPIT DASHBOARD (3x3 Grid)

Volle Breite, Ultrawide optimiert (3440x1440). Jede Zelle ist klickbar.

```
┌────────────────────┬────────────────────┬────────────────────┐
│                    │                    │                    │
│  [A] SYSTEM STATUS │  [B] FINANZEN      │  [C] AGENTS/SKILLS │
│                    │                    │                    │
│  ● Online          │  175K/500K Tokens  │  9 Agents          │
│  CPU 42% RAM 68%   │  €52.70/mo         │  3 arbeiten        │
│  3 Projekte aktiv  │  ~18 Tage Budget   │  18 Skills aktiv   │
│  2 Fenster offen   │  Ø €8.20/Tag       │  5 MCP verbunden   │
│  5 MCP verbunden   │                    │                    │
│  3h 24m aktiv      │                    │  KANI ● Build ●    │
│  Internet 120Mbps  │                    │                    │
│                    │                    │                    │
├────────────────────┼────────────────────┼────────────────────┤
│                    │                    │                    │
│  [D] PROJEKTE      │  [E] TODOS/STATUS  │  [F] IDEEN         │
│                    │                    │                    │
│  Hebammenbuero 65% │  6 offen           │  5 geparkt         │
│    [Öffnen →]      │  3 heute fällig    │  2 in Research     │
│  Stillprobleme 25% │  12 erledigt       │  ★ Steuerberater   │
│    [Öffnen →]      │  67% diese Woche   │  ★ SmartHome X     │
│  TennisCoach  80%  │  □ Mockup erw.     │  ★ Gastro Suite    │
│    [Öffnen →]      │  □ Validation      │                    │
│  findemeine  LIVE  │  □ Phase 1         │  [+ Neue Idee]     │
│                    │                    │                    │
├────────────────────┼────────────────────┼────────────────────┤
│                    │                    │                    │
│  [G] BRIEFING      │  [H] THINKTANK     │  [I] KANI STATUS   │
│                    │                    │                    │
│  Letztes: heute    │  12 Einträge       │  ● KANI Online     │
│  09:15 Uhr         │  5 Ideen           │  Session: 3h 24m   │
│  "+8% Fortschritt" │  3 Strategien      │                    │
│  "3 Projekte       │                    │  [System →]        │
│   bearbeitet"      │  [+ Gedanke teilen]│  [Office →]        │
│                    │  [+ Schnell Idee]  │  [Einstellungen]   │
│  [Briefing öffnen] │  [Thinktank öffnen]│                    │
│                    │                    │                    │
└────────────────────┴────────────────────┴────────────────────┘
```

### Buttons und Aktionen:
| Zelle | Klick auf Zelle | Spezial-Buttons |
|---|---|---|
| A: System | → Detail-View System (9 Zellen) | — |
| B: Finanzen | → Detail-View Finanzen (9 Zellen) | — |
| C: Agents | → Detail-View Agents (9 Zellen) | — |
| D: Projekte | → Detail-View Projekte (9 Zellen) | [Öffnen →] = window.open (neues Fenster) |
| E: Todos | → Detail-View Todos (9 Zellen) | — |
| F: Ideen | → Thinktank View | [+ Neue Idee] = Thinktank New |
| G: Briefing | → Briefing View | — |
| H: Thinktank | → Thinktank View | [+ Gedanke], [+ Schnell Idee] |
| I: Quick Access | Nicht klickbar als Ganzes | [System →], [Office →], [Einstellungen] |

### Persistente Navigation (auf allen Screens):
- **Oben rechts:** ← Zurück Button (einen Schritt zurück)
- **Oben rechts:** ☰ Hamburger-Menü (Cockpit / System / Office / Feierabend)
- **Unten links:** ◐ Dark/Light Mode Toggle

---

## SCREEN 3: DETAIL-VIEW — SYSTEM STATUS

Wenn Zelle [A] geklickt → gesamtes 3x3 Grid transformiert sich:

```
┌────────────────────┬────────────────────┬────────────────────┐
│ HARDWARE           │ SESSION HEUTE      │ VERBINDUNGEN       │
│                    │                    │                    │
│ CPU  ████░░ 42%    │ Eingeloggt: 09:15  │ Internet  ● 120Mb  │
│ RAM  ██████░ 68%   │ Aktive Zeit: 3h24m │ Supabase  ● 24ms   │
│ Disk ███░░░ 31%    │ Idle: 45min        │ Vercel    ● online  │
│ GPU  ██░░░░ 18%    │ Klicks: 342        │ GitHub    ● online  │
│ Batterie: 87%      │ Prompts: 28        │ Claude    ● 4.2s    │
│ Temp: 62°C         │ Projekte: 3        │ MCP: 5/5           │
│                    │ Ideen: 2           │                    │
├────────────────────┼────────────────────┼────────────────────┤
│ AKTIVE TERMINALS   │ AKTIVITÄTS-LOG     │ TOKEN BUDGET       │
│                    │                    │                    │
│ ● Hebammenbuero    │ 12:30 Projekt      │ Heute: 12K         │
│   seit 10:15       │   geöffnet         │ Woche: 89K         │
│ ● System           │ 12:15 Thinktank    │ Monat: 175K/500K   │
│   seit 09:30       │   3 Ideen          │ ████████░░ 35%     │
│ ○ Stillprobleme    │ 11:45 Briefing     │ ~18 Tage übrig     │
│   pausiert         │ 11:30 Todo done    │                    │
├────────────────────┼────────────────────┼────────────────────┤
│ UPTIME WOCHE       │ PERFORMANCE        │ DEPLOYMENT         │
│                    │                    │                    │
│ Mo ██████░░ 6h20   │ Ø Claude: 4.2s     │ Branch: dev        │
│ Di ████████░ 8h05  │ Ø Supabase: 89ms   │ Last deploy: heute │
│ Mi █████░░░ 5h45   │ Ø Vercel: 120ms    │ Vercel: ● online   │
│ Do ███████░ 7h10   │ Ø Prompts/Tag: 34  │ Build: 167ms       │
│ Fr ███░░░░░ 3h24   │ Ø Tokens/Tag: 25K  │                    │
│ Gesamt: 30h 44m    │ Ø Kosten/Tag: €8.20│                    │
└────────────────────┴────────────────────┴────────────────────┘
```

---

## SCREEN 4: DETAIL-VIEW — FINANZEN

```
┌────────────────────┬────────────────────┬────────────────────┐
│ BUDGET OVERVIEW    │ KOSTEN PRO SERVICE │ PROGNOSE           │
│                    │                    │                    │
│ Plan: Max $100     │ Claude  ████ €42.50│ Bei aktuellem Tempo│
│ Verbraucht: 35%    │ Supabase ██ €7.20  │ Monatsende: ~€78   │
│ Reset: 15. April   │ Resend  █ €3.00    │ → Budget reicht ✓  │
│ ◎ 175K / 500K      │ Vercel  Free       │                    │
│ ◎ €52.70 / ~€150   │ Domains ~€2.50     │ 4 Projekte parallel│
│                    │ Figma   Free       │ → ~€120 → Max200 ⚠ │
├────────────────────┼────────────────────┼────────────────────┤
│ VERLAUF (7 TAGE)   │ TOKENS PRO TAG     │ UMSATZ             │
│                    │                    │                    │
│ Linien-Chart:      │ Mo ████████ 28K    │ findemeine: ~€3.000 │
│ Kosten pro Tag     │ Di ██████████ 35K  │ Andere: €0          │
│ der letzten Woche  │ Mi ██████ 22K      │                    │
│                    │ Do ████████ 31K    │ Prognose bei Launch:│
│                    │ Fr ████ 12K        │ Hebammen: €240K/J   │
│                    │                    │ Tennis: €600K/J     │
│                    │                    │ Gesamt: €1.235K/J   │
├────────────────────┼────────────────────┼────────────────────┤
│ TOP VERBRAUCHER    │ AGENT-KOSTEN       │ GEWINN/VERLUST     │
│                    │                    │                    │
│ 1. Build 89K (51%) │ kani: 45K          │ Kosten: €52.70/mo  │
│ 2. KANI  45K (26%) │ build: 89K         │ Umsatz: ~€300/mo   │
│ 3. Research 12K(7%)│ research: 12K      │ Gewinn: +€247/mo ✓ │
│ 4. Strategy 8K (5%)│ strategy: 8K       │                    │
│ 5. Andere 21K (12%)│ andere: 21K        │ 3 Launches:        │
│                    │                    │ → +€4.850/mo       │
└────────────────────┴────────────────────┴────────────────────┘
```

---

## SCREEN 5: DETAIL-VIEW — AGENTS & SKILLS

```
┌────────────────────┬────────────────────┬────────────────────┐
│ CORE AGENTS (4)    │ SPECIALISTS (5)    │ AGENT AKTIVITÄT    │
│                    │                    │                    │
│ ● kani-master      │ ○ research-agent   │ Heute aktiv: 3/9   │
│   alle Projekte    │ ○ sales-agent      │ ◎ 33% Auslastung   │
│   12K Tokens heute │ ○ strategy-agent   │ Prompts: 18        │
│ ● build-agent      │ ○ life-agent       │ Tokens: 89K        │
│   Hebammenbuero    │ ○ mockup-brief     │                    │
│   8K Tokens        │                    │ Meistgenutzt:      │
│ ● launch-agent     │                    │ build-agent        │
│ ○ ops-agent        │                    │                    │
├────────────────────┼────────────────────┼────────────────────┤
│ SKILLS CORE +      │ SKILLS DOMAINS (5) │ SKILLS INT. +      │
│ PROJECT TYPES (7)  │                    │ MCKAY (6)          │
│                    │ ● medical          │                    │
│ CORE (4):          │ ● gdpr-health      │ INTEGRATIONS (4):  │
│ ● business-model   │ ● real-estate      │ ● supabase-postgres│
│ ● scaffold-project │ ● voice-ai         │ ● react-best-pract.│
│ ● code-quality     │ ● maps-routing     │ ● webhook-patterns │
│ ● deploy           │                    │ ● ui-design        │
│                    │                    │                    │
│ PROJECT TYPES (3): │                    │ MCKAY (2):         │
│ ● booking-system   │                    │ ● design-system    │
│ ● marketplace      │                    │ ● deploy-workflow  │
│ ● multi-tenant     │                    │                    │
├────────────────────┼────────────────────┼────────────────────┤
│ MCP SERVER (5)     │ AGENT-PROJEKT      │ SKILL NUTZUNG      │
│                    │ MATRIX             │                    │
│ GitHub    ● 24     │        Heb Sti Ten │ booking: 3 Projekte│
│ Supabase  ● 28     │ kani    ●   ●   ●  │ multi-tenant: 3    │
│ Stitch    ● 12     │ build   ●   ○   ○  │ medical: 2         │
│ Memory    ●  8     │ research○   ○   ○  │ deploy: 4          │
│ 21st Magic●  4     │ mockup  ●   ●   ○  │ code-quality: 4    │
│ Total: 76 Tools    │                    │                    │
└────────────────────┴────────────────────┴────────────────────┘
```

---

## SCREEN 6: DETAIL-VIEW — PROJEKTE

```
┌────────────────────┬────────────────────┬────────────────────┐
│ ÜBERSICHT          │ HEBAMMENBUERO      │ STILLPROBLEME      │
│                    │                    │                    │
│ 4 Projekte total   │ Phase 0 · ● 65%   │ Phase 0 · ◐ 25%   │
│ 3 in Arbeit        │ ████████████░░ 65% │ ████░░░░░░░░ 25%   │
│ 1 LIVE             │ ✓✓✓✓●○○○ Review   │ ✓✓✓●○○○○ Mockup    │
│ Gesamt: 68%        │ 42K Tok · €12.50   │ 5K Tok · €1.80     │
│ 175K Tokens        │ 3 Todos            │ 2 Todos            │
│ €52.70/mo          │ [Öffnen →]         │ ⚠ Wartet auf Input │
│ Nächster Launch:   │                    │ [Öffnen →]         │
│ Tennis (~2 Wo)     │                    │                    │
├────────────────────┼────────────────────┼────────────────────┤
│ TENNISCOACH PRO    │ FINDEMEINEHEBAMME  │ FORTSCHRITT CHART  │
│                    │                    │                    │
│ Phase 1 · ● 80%   │ ★ LIVE · 100%      │ Hebammen ████░ 65% │
│ ████████████████░  │ ~100 Vermittlungen │ Still    ██░░░ 25% │
│ ✓✓✓✓✓✓●○ Testing  │ €9.90/mo Hosting   │ Tennis   ████░ 80% │
│ 128K Tok · €38.40  │ Umsatz: ~€3.000    │ finde    █████100% │
│ 1 Todo             │ [Ansehen →]        │                    │
│ [Öffnen →]         │                    │                    │
├────────────────────┼────────────────────┼────────────────────┤
│ KOSTEN VERTEILUNG  │ NÄCHSTE            │ NEUE PROJEKTE      │
│                    │ MEILENSTEINE       │                    │
│ Hebammen ██ €12.50 │                    │ Pipeline: 5 Ideen  │
│ Tennis ████████€38 │ 1. Hebammen:       │ Nächster Kandidat:  │
│ Still  █ €1.80     │    Validation 05.04│ Steuerberater App  │
│ Gesamt: €52.70/mo  │ 2. Still: Mockup   │ "Großer Markt,     │
│                    │    ~02.04          │  schnelle Umsetzung"│
│                    │ 3. Tennis: Stripe  │                    │
│                    │    ~10.04          │ [→ Thinktank]       │
└────────────────────┴────────────────────┴────────────────────┘
```

---

## SCREEN 7: DETAIL-VIEW — TODOS

```
┌────────────────────┬────────────────────┬────────────────────┐
│ KPIs               │ FILTER             │ CHART: TODOS/WOCHE │
│                    │                    │                    │
│ 6 offen            │ [Alle] [Heute: 3]  │ Mo ████ 4          │
│ 3 heute fällig     │ [Überfällig: 0]    │ Di ██████ 6        │
│ 12 erledigt        │ [Woche: 6]         │ Mi ███ 3           │
│ 67% Rate           │ [Erledigt: 12]     │ Do ████████ 8      │
│ Ø 4.2/Tag          │ Projekt: [Alle ▾]  │ Fr ██ 2            │
│                    │ Priorität: [Alle ▾]│                    │
├────────────────────┼────────────────────┼────────────────────┤
│ OFFEN              │ OFFEN (ANDERE)     │ OFFEN (PRIVAT)     │
│ (HEBAMMENBUERO)    │                    │                    │
│                    │ STILLPROBLEME (2): │ PRIVAT:            │
│ □ Mockup erweitern │ □ Mockup bauen     │ □ Zahnarzt         │
│   30.03 ⚡         │ □ Geo-Matching     │ □ Steuerberater    │
│ □ Validation       │                    │ □ Auto TÜV         │
│   05.04            │ TENNISCOACH (1):   │                    │
│ □ Phase 1 starten  │ □ Stripe 10.04     │ ALLGEMEIN:         │
│                    │                    │ □ SmartHome eval.  │
├────────────────────┼────────────────────┼────────────────────┤
│ ERLEDIGT (letzte 5)│ COMPLETION TABLE   │ PRODUKTIVITÄT      │
│                    │                    │                    │
│ ✓ MC V8 deployed   │ Projekt  Open Done │ Streak: 5 Tage     │
│ ✓ Design System    │ Hebammen  3   12   │ Bester Tag: Di (8) │
│ ✓ Deploy Workflow   │ Still     2    0   │ Ø pro Tag: 4.2     │
│ ✓ Mockup-Brief Agt │ Tennis    1   27   │                    │
│ ✓ Dev Branch       │ Privat    3    5   │ [+ Neues Todo]     │
│                    │ Total     9   44   │ [Todos exportieren]│
└────────────────────┴────────────────────┴────────────────────┘
```

---

## SCREEN 8: BRIEFING VIEW (inline im Cockpit)

Ersetzt das Dashboard-Grid temporär:

```
┌────────────────────┬────────────────────┬────────────────────┐
│ GESTERN            │ EMPFEHLUNG         │ HEUTE              │
│                    │                    │                    │
│ 12 Todos ✓         │ Reihenfolge:       │ 6 Todos geplant    │
│ 3 Projekte         │ 1. Hebammenbuero   │                    │
│ bearbeitet         │    Mockup Review   │ Projekte:          │
│ +8% Fortschritt    │ 2. Stillprobleme   │ · Hebammenbuero    │
│ 2 Ideen erstellt   │    Mockup bauen    │ · Stillprobleme    │
│                    │ 3. TennisCoach     │                    │
├────────────────────┤    Phase 4 Plan    ├────────────────────┤
│ PROJEKTE GESTERN   │                    │ TERMINE            │
│                    │ [→ Cockpit]        │                    │
│ Hebammenbuero:     │ [→ Arbeitsplatz]   │ 09:00 Standup      │
│ Mockup erw. (+8%)  │ [→ Gedanke teilen] │ 11:00 Hebammen Rev │
│ TennisCoach:       │                    │ 14:00 Designer     │
│ Auth gebaut (+5%)  │                    │ 16:00 Testing      │
├────────────────────┼────────────────────┼────────────────────┤
│ KANI INSIGHT       │ KANI INSIGHT       │ KANI INSIGHT       │
│                    │                    │                    │
│ "Hebammenbuero +   │ "TennisCoach:      │ "Token-Verbrauch   │
│  Stillprobleme     │  Stripe dauert     │  20% unter         │
│  teilen 80% der    │  ~2 Tage"          │  Durchschnitt"     │
│  Skills"           │                    │                    │
└────────────────────┴────────────────────┴────────────────────┘
```

---

## SCREEN 9: THINKTANK — ÜBERSICHT (Default)

```
┌────────────────────┬────────────────────┬────────────────────┐
│ FILTER             │ IDEE: Steuerberater│ IDEE: SmartHome X  │
│                    │                    │                    │
│ Branche ▾          │ Typ: Industry SaaS │ Typ: Marketplace   │
│ Volumen ▾          │ ★★★★ Potenzial     │ ★★★ Potenzial      │
│ Komplexität ▾      │ 25.03.2026         │ 22.03.2026         │
│ Geschwindigkeit ▾  │ "SaaS für Steuer-  │ "Marketplace für   │
│                    │  berater mit auto- │  Smart Home mit     │
│ [+ Neue Idee]      │  Erinnerungen..."  │  Konfigurator..."  │
│                    │ [Details →]        │ [Details →]        │
├────────────────────┼────────────────────┼────────────────────┤
│ STRATEGISCH        │ IDEE: Gastro Suite │ IDEE: Autowerkstatt│
│                    │                    │                    │
│ · Healthcare       │ Typ: Industry SaaS │ Typ: Industry SaaS │
│   Ökosystem        │ ★★ Potenzial       │ ★★★ Potenzial      │
│ · AI Agent         │ [Details →]        │ [Details →]        │
│   Framework        │                    │                    │
│ · Content Pipeline │                    │                    │
│ [Details →]        │                    │                    │
├────────────────────┼────────────────────┼────────────────────┤
│ IDEE: Immobilien   │ EMPFEHLUNG         │ STATS              │
│                    │                    │                    │
│ Typ: Industry SaaS │ "Starte nächstes:  │ 5 Ideen geparkt    │
│ ★★★ Potenzial      │  Steuerberater App │ 2 in Research      │
│ [Details →]        │  — Großer Markt,   │ 1 in Planung       │
│                    │  schnelle Umsetzung│ 3 Strategien       │
│                    │  hohe Marge"       │                    │
│                    │ [→ Idee öffnen]    │ [← Cockpit]        │
└────────────────────┴────────────────────┴────────────────────┘
```

---

## SCREEN 10: THINKTANK — NEUE IDEE (Multi-Step)

### Phase: Eingabe
```
┌──────────────────────────────────────────┬────────────────────┐
│ NEUE IDEE                                │                    │
│ ┌──────────────────────────────────────┐ │ Wird nach Eingabe  │
│ │ Beschreibe deine Idee...             │ │ gefüllt...         │
│ │                                      │ │                    │
│ │                                      │ │                    │
│ │                                      │ │                    │
│ └──────────────────────────────────────┘ │                    │
│ [Absenden]                               │                    │
├────────────────────┬─────────────────────┼────────────────────┤
│ Wird nach Eingabe  │ Wird nach Eingabe   │ Wird nach Eingabe  │
│ gefüllt...         │ gefüllt...          │ gefüllt...         │
├────────────────────┼─────────────────────┼────────────────────┤
│ Wird nach Eingabe  │ Wird nach Eingabe   │ [← Zurück]         │
│ gefüllt...         │ gefüllt...          │                    │
└────────────────────┴─────────────────────┴────────────────────┘
```

### Phase: Complete (alle Zellen gefüllt)
```
┌────────────────────┬────────────────────┬────────────────────┐
│ ORIGINAL TEXT      │ STRUKTURIERT       │ FEEDBACK           │
│                    │ (KANI Version)     │                    │
│ [Mein Rohtext      │ Konzept: ...       │ Stärken: ...       │
│  wie ich ihn       │ Zielgruppe: ...    │ Besonderheiten: ...│
│  eingegeben habe]  │ USP: ...           │ Löst: ...          │
│                    │ Business Model: ...│ Einschätzung: ...  │
├────────────────────┼────────────────────┼────────────────────┤
│ GROBE PLANUNG      │ BEWERTUNG (JUDGE)  │ RESEARCH           │
│                    │                    │                    │
│ 1. Marktanalyse    │ Machbarkeit: ★★★★  │ Noch kein Research │
│ 2. MVP definieren  │ Potenzial:  ★★★★★  │                    │
│ 3. Mockup bauen    │ Komplexität: ★★★   │ [→ Research        │
│ 4. Backend + Auth  │ Speed:      ★★★★   │    starten]        │
│                    │ Risiko: Mittel     │                    │
│ Aufwand: ~2-3 Wo   │ Empfehlung:        │ Report wird        │
│ Hindernisse: ...   │ Weiterverfolgen    │ separat erstellt   │
├────────────────────┼────────────────────┼────────────────────┤
│ AKTIONEN           │ AKTIONEN           │ NAVIGATION         │
│                    │                    │                    │
│ [→ Als Projekt     │ [→ Idee bearbeiten]│ [← Übersicht]      │
│    starten]        │ [→ Verwerfen]      │ [← Cockpit]        │
│ [→ Research        │                    │                    │
│    starten]        │                    │                    │
│ [→ Parken]         │                    │                    │
└────────────────────┴────────────────────┴────────────────────┘
```

---

## SCREEN 11: PROJEKT-FENSTER (neues Browser-Fenster, MacBook)

Öffnet via window.open. Optimiert für MacBook Display (1440x900).

```
┌─────────────────────────────────────────────────────────────┐
│ ⚠ Fenster kann geschlossen werden — Prozess läuft weiter   │
├─────────────────────────────────────────────────────────────┤
│ PROJEKT: Hebammenbuero · Phase 0 · ● Healthy               │
│ [↗ hebammenbuero.vercel.app]  [Pausieren] [Aktionen ▾] [✕] │
│ 8 Tage | 42K Tokens | 156 Prompts | €12.50                 │
│ ✓✓✓✓●○○○ 65% — Step: Review                               │
├──────────────────────────────┬──────────────────────────────┤
│                              │ IDEEN (3)                    │
│ TERMINAL                     │ [Neue Idee eingeben...]      │
│ ┌──────────────────────────┐ │ · Onboarding Wizard          │
│ │ [09:15] KANI: Was soll   │ │   [→ Prompt] [→ Todo]       │
│ │ ich als nächstes bauen?  │ │ · PDF Export                 │
│ │                          │ │   [→ Prompt] [→ Todo]       │
│ │ [09:18] Mehti: Baue den  │ │ · WhatsApp Integration      │
│ │ Onboarding Wizard        │ │   [→ Prompt] [→ Todo]       │
│ │                          │ ├──────────────────────────────┤
│ │ [09:18] KANI: Verstanden.│ │ TODOS — 3 offen / 12 done   │
│ │ Ich plane 6 Steps...     │ │ □ Mockup erweitern (30.03)  │
│ │                          │ │   [→ Prompt]                │
│ │ > [Eingabe...]    [Send] │ │ □ Validation (05.04)         │
│ └──────────────────────────┘ │   [→ Prompt]                │
│                              │ □ Phase 1 starten            │
│ Zuletzt: Mockup erweitert   │   [→ Prompt]                │
│ Nächster Step: Review        ├──────────────────────────────┤
│                              │ PROJEKT-INFO                 │
│ TIMELINE                     │ Business: Setup + Monthly    │
│ · 28.03 Validation geplant  │ Markt: 19K Hebammen          │
│ · 25.03 Extended mockup     │ Umsatz: €240K/Jahr           │
│ · 22.03 Mockup deployed     │ Gewinn: €180K/Jahr           │
│ · 20.03 Project launched    │ Skills: 12 aktiv             │
└──────────────────────────────┴──────────────────────────────┘
```

### Spezielle Buttons:
| Button | Aktion |
|---|---|
| [Pausieren] | Terminal stoppt, gelbes Banner, Input disabled |
| [Fortsetzen] | Terminal läuft weiter |
| [→ Prompt] (bei Idee) | Text wird ins Terminal-Input kopiert |
| [→ Prompt] (bei Todo) | Text wird ins Terminal-Input kopiert |
| [→ Todo] (bei Idee) | Idee wird als Todo angelegt |
| [Aktionen ▾] | Dropdown: Build Feature, Update Memory, Deploy |
| [✕] | Fenster schließen, Prozess läuft weiter |

### Ideen-Zustände:
- **Neu** — frisch angelegt
- **Gepromptet** — ins Terminal übergeben, ausgegraut
- **Archiviert** — aufklappbar oder ausgeblendet

---

## SCREEN 12: SYSTEM (/system, eigene Route, 3x3 Grid)

```
┌────────────────────┬────────────────────┬────────────────────┐
│ SYSTEM ÜBERSICHT   │ SKILLS: CORE (4)   │ SKILLS: PROJ (3)   │
│                    │                    │                    │
│ ● Online seit 09:15│ ● business-model   │ ● booking-system   │
│ Uptime: 99.8%      │ ● scaffold-project │ ● marketplace      │
│ Letzter Fehler: -  │ ● code-quality     │ ● multi-tenant     │
│ Build: ✓ clean     │ ● deploy           │                    │
├────────────────────┼────────────────────┼────────────────────┤
│ SKILLS: DOMAINS(5) │ SKILLS: INT (4)    │ AGENTS (9)         │
│                    │ + MCKAY (2)        │                    │
│ ● medical          │ ● supabase-postgres│ CORE:              │
│ ● gdpr-health      │ ● react-best       │ ● kani ● build     │
│ ● real-estate      │ ● webhooks         │ ○ launch ○ ops     │
│ ● voice-ai         │ ● ui-design        │ SPECIALISTS:       │
│ ● maps-routing     │ ● design-system    │ ○ research ○ sales │
│                    │ ● deploy-workflow  │ ○ strategy ○ life  │
│                    │                    │ ○ mockup-brief     │
├────────────────────┼────────────────────┼────────────────────┤
│ MCP SERVER (5)     │ COMMANDS & HOOKS   │ QUICK ACTIONS      │
│                    │                    │                    │
│ GitHub    ● 24     │ /launch /build     │ [Skill recherch.]  │
│ Supabase  ● 28     │ /status /brief     │ [Terminal öffnen]  │
│ Stitch    ● 12     │ /skills /help /sync│ [Health-Check]     │
│ Memory    ●  8     │                    │                    │
│ 21st Magic●  4     │ Hooks: Safety, Sess│ [← Cockpit]        │
└────────────────────┴────────────────────┴────────────────────┘
```

---

## SCREEN 13: OFFICE (/office, eigene Route, 3x3 Grid)

```
┌────────────────────┬────────────────────┬────────────────────┐
│ ÜBERSICHT KPIs     │ AUFGABEN           │ KALENDER           │
│                    │                    │                    │
│ Termine: 3 heute   │ [Privat] [Projekte]│ Mo 30. März 2026   │
│ Mails: 8 offen     │                    │ 09:00 Standup KANI │
│ Todos privat: 5    │ □ Zahnarzt         │ 11:00 Hebammen Rev │
│ Todos projekt: 9   │ □ Steuererklärung  │ 14:00 Designer     │
│ Nächster: 14:00    │ □ Auto TÜV         │ 16:00 Tennis Test  │
│                    │ □ Geburtstag Kinder│ 18:00 Feierabend   │
│                    │ [+ Neues Todo]     │ [Tag][Woche][Monat]│
├────────────────────┼────────────────────┼────────────────────┤
│ POSTEINGANG        │ NOTIZEN            │ KONTAKTE           │
│                    │                    │                    │
│ ⚡ Vertrag Untersch│ [Freitext Editor]  │ Letzte Kontakte:   │
│   von: Rechtsanwalt│ "Meeting-Notizen,  │ · Designer (14:00) │
│   [Antw.] [Parken] │  Gedanken..."     │ · Rechtsanwalt     │
│ 📋 Angebot Hosting │                    │ · Hetzner Support  │
│   von: Hetzner     │                    │                    │
│   [Antw.] [Parken] │                    │ Phase 1: CRM       │
│ 📧 Newsletter (3x) │                    │                    │
│   auto-ignoriert   │                    │                    │
├────────────────────┼────────────────────┼────────────────────┤
│ ZUKÜNFTIGE MODULE  │ TAGESPLAN          │ QUICK LINKS        │
│                    │                    │                    │
│ 🔒 E-Mail Agent    │ 09:00-11:00 Arbeit │ [Google Calendar]  │
│ 🔒 Kontakte/CRM    │ 11:00-12:00 Review │ [Gmail]            │
│ 🔒 Finanzen        │ 12:00-13:00 Pause  │ [Google Drive]     │
│ 🔒 Dokumente       │ 14:00-16:00 Calls  │                    │
│                    │ 16:00-18:00 Build  │ [← Cockpit]        │
│ Klick → "Kommt     │ 18:00 Feierabend   │                    │
│  bald" Toast       │                    │                    │
└────────────────────┴────────────────────┴────────────────────┘
```

---

## FEIERABEND SEQUENZ (Overlay)

Wird getriggert durch ⏻ Feierabend Button im Hamburger-Menü.

### Phase: Bestätigung
```
┌─────────────────────────────────────────┐
│                                         │
│          Feierabend?                    │
│                                         │
│  Folgendes wird ausgeführt:            │
│  ✓ Alle Projekte speichern            │
│  ✓ Memory synchronisieren             │
│  ✓ Briefing für morgen vorbereiten    │
│  ✓ System herunterfahren              │
│                                         │
│  [Abbrechen]  [Feierabend machen]      │
│                                         │
└─────────────────────────────────────────┘
```

### Phase: Shutdown (animiert)
```
Projekte werden gespeichert...      ✓
Memory wird synchronisiert...       ✓
Briefing wird vorbereitet...        ✓
System wird heruntergefahren...     ✓
```

### Phase: Complete
```
Gute Nacht, Mehti.
Bis morgen.
```

---

## NAVIGATION — ZUSAMMENFASSUNG

| Von | Nach | Wie |
|---|---|---|
| Boot | Login | Klick "START" |
| Login | Launch | Touch ID oder User/Pass |
| Launch | Cockpit | Klick "System starten" |
| Cockpit | Detail-View | Klick auf Zelle A-E |
| Cockpit | Briefing | Klick Zelle G oder Button |
| Cockpit | Thinktank | Klick Zelle F/H oder Button |
| Cockpit | Projekt-Fenster | Klick "Öffnen →" (neues Fenster) |
| Cockpit | System | Klick "System →" (Route /system) |
| Cockpit | Office | Klick "Office →" (Route /office) |
| Detail-View | Cockpit | ← Zurück (oben rechts) |
| Briefing | Cockpit | ← Zurück oder Button |
| Thinktank | Cockpit | ← Zurück oder Button |
| System/Office | Cockpit | ← Zurück oder Hamburger |
| Projekt-Fenster | Schließen | ✕ (Prozess läuft weiter) |
| Überall | Feierabend | ☰ → Feierabend |
