# MCKAY MISSION CONTROL — Kompletter Workflow
> Stand: 30.03.2026 | Wie Mehti das System nutzt, warum, was er sehen will

---

## DAS ZIEL

Mission Control ist kein Dashboard — es ist Mehtis persönliches Betriebssystem. Eine einzige Oberfläche von der aus er alle Projekte steuert, Ideen erfasst, Fortschritt verfolgt, und KANI als Co-Founder neben sich hat.

**Ein Prompt triggert alles.** Mehti gibt eine Idee ein, und das System recherchiert, plant, baut, deployed — parallel, automatisiert, orchestriert.

**Mehtis Rolle:** Entscheidungen treffen, Ideen liefern, Qualität freigeben. Nicht: manuell Dateien erstellen, Ordner anlegen, Todos verwalten.

---

## DER TAGESABLAUF

### Morgens: Ankommen

```
1. Laptop aufklappen
2. Mission Control öffnen (Browser, Ultrawide Monitor)
3. System fährt hoch (Boot-Animation)
4. Login (Touch ID oder Passwort)
5. "Hallo Mehti, Welcome back. Legen wir los."
6. Drei Optionen:
   → Briefing (Was war gestern, was kommt heute)
   → Cockpit (Sofort Überblick)
   → Arbeitsplatz (Direkt an Projekten weiter)
```

### Briefing wählen:

**Warum:** Ich will wissen was los ist bevor ich loslege. Klarheit, Ruhe, Überblick.

**Was ich sehe:**
- Links: Was gestern passiert ist — Todos erledigt, Projekte bearbeitet, Fortschritt
- Mitte: KANI Empfehlung — was heute in welcher Reihenfolge anpacken
- Rechts: Was heute ansteht — geplante Todos, Termine, Projekte
- Unten: KANI Insights — Synergien, Tipps, Warnungen

**Was ich tue:** Lese das Briefing, stimme zu oder passe an, gehe dann ins Cockpit oder direkt arbeiten.

### Cockpit wählen:

**Warum:** Ich will auf einen Blick sehen wie alles steht — wie ein Kontrollraum.

**Was ich sehe:** 9 Monitor-Kacheln, jede zeigt einen Bereich:
- System Status (online, Hardware, Sessions)
- Finanzen (Tokens, Kosten, Budget, Umsatz)
- Agents & Skills (wer arbeitet, was ist aktiv)
- Projekte (alle 4, mit Status und Fortschritt)
- Todos (offen, fällig, erledigt)
- Ideen Pipeline (geparkte Ideen)
- Briefing (Quick Access)
- Thinktank (Quick Access)
- KANI Status + Quick Access (System, Office)

**Was ich tue:** Klicke auf eine Kachel → Detail-View erscheint (gleicher Screen, Grid transformiert sich). Oder klicke auf ein Projekt → neues Fenster auf dem MacBook.

### Arbeitsplatz wählen:

**Warum:** Ich will sofort an einem Projekt weiterarbeiten, ohne erst durch Übersichten zu navigieren.

**Was ich sehe:** Alle aktiven Projekte als "Akten auf dem Tisch". Jede zeigt:
- Name, Phase, Fortschritt
- Letzter und nächster Schritt
- Offene Todos
- Status (läuft / pausiert / wartet auf Input)

**Was ich tue:** Klicke auf ein Projekt → neues Fenster öffnet sich auf dem MacBook.

---

## ARBEITEN AN EINEM PROJEKT

### Das Projekt-Fenster (MacBook Display)

**Was ich sehe:**
- Oben: Projekt-Infos (Name, Phase, Deploy-Link, Metriken, Milestones)
- Links groß: TERMINAL — hier arbeite ich mit KANI
- Rechts: Ideen-Parking, Todos, Projekt-Info

### Terminal-Workflow:
1. Ich tippe einen Prompt → KANI arbeitet
2. KANI liefert Ergebnis → ich prüfe
3. Wenn gut → weiter zum nächsten Prompt
4. Wenn nicht → Feedback, Korrektur

### Ideen während der Arbeit:
**Problem:** KANI arbeitet gerade am Terminal, aber mir fällt eine Idee ein.
**Lösung:** Ideen-Parking rechts. Ich tippe die Idee ein, sie wird geparkt.
- Original-Version (wie ich es gesagt hab)
- Strukturierte Version (KANI macht daraus einen sauberen Prompt)
- Button "→ Prompt" kopiert den strukturierten Text ins Terminal

### Ideen-Zustände:
- **Neu** — frisch angelegt, noch nicht verwendet
- **Gepromptet** — ins Terminal übergeben, wird ausgegraut
- **Archiviert** — aufklappbar, für Referenz

### Todos:
- Projekt-spezifisch gefiltert
- Jedes Todo hat "→ Prompt" Button (generiert Terminal-Eingabe)
- Completion-Stats: X offen / Y erledigt
- Deadlines sichtbar

### Pause/Resume:
- **Pause-Button:** Terminal stoppt sofort, kein Fortschritt geht verloren
- **Banner:** "Terminal pausiert — klicke Fortsetzen"
- **Fortsetzen:** Nahtlos weiter wo aufgehört
- **Warum:** Sicherheit. Wenn KANI etwas macht was ich nicht will → sofort stoppen.

### Fenster schließen:
- Prozess läuft im Hintergrund weiter
- Im Cockpit: Projekt zeigt "● Läuft im Hintergrund"
- Jederzeit wieder öffnen

---

## NEUE IDEE HABEN

### Wo: Thinktank (aus dem Cockpit oder als Quick Action)

**Der Flow:**

```
1. Gedanken teilen
   └── Textfeld (unbegrenzt), frei reinlabern
   └── [Absenden]

2. System verarbeitet
   └── Original-Text wird gespeichert (unveränderlich)
   └── Strukturierte Version erstellt (KANI)
   └── Business Feedback generiert (Stärken, Probleme, Einschätzung)
   └── Grobe Planung erstellt (Themen, Aufwand, Hindernisse, Kosten)
   └── Bewertung/Judge (Machbarkeit, Potenzial, Risiko, Empfehlung)

3. Ich entscheide
   └── [Research starten] → Agent recherchiert tiefer
   └── [Als Projekt starten] → Briefing + Ordner + Workflow
   └── [Parken] → Idee in Pool, für später
   └── [Verwerfen] → Weg damit
```

### Ideen-Übersicht (Default im Thinktank):
- Alle Ideen als Karten, filterbar nach: Branche, Volumen, Komplexität, Geschwindigkeit, Status
- KANI Empfehlung: "Starte als nächstes [X] weil [Y]"
- Strategisches Denken: Ideen die kein Projekt sind (Strategien, Agent-Ideen, Research)
- Fließender Übergang: Thinktank → Idee → Projekt

### Ideen-Detail (neues Fenster, MacBook):
- Gleicher Aufbau wie "Neue Idee", aber mit gespeicherten Daten
- Alle Schritte die schon gelaufen sind → sichtbar
- Offene Schritte → aktivierbar

---

## NICHT VERGESSEN: ALLES REIN INS SYSTEM

### Wo Gedanken hinkommen:
KANI erkennt automatisch aus dem Kontext:

| Was ich sage | Wohin KANI es legt |
|---|---|
| "Ich hab eine Idee für eine App..." | → Ideen-Pool (Projekt-Idee) |
| "Bei Hebammenbuero sollten wir noch..." | → Projekt-Ideenliste |
| "Wie groß ist der Markt für..." | → Research-Queue |
| "Langfristig will ich alle Healthcare..." | → Strategie-Board |
| "Zahnarzt Termin machen" | → Office Todos (privat) |
| "Morgen unbedingt Mockup fertig" | → Projekt-Todos |

### Nichts geht verloren:
- Jede Idee wird gespeichert: Original + Strukturiert
- Jede Idee hat einen Action-Pfad (Projekt, Research, Parken)
- Alles ist filterbar, suchbar, kategorisiert

---

## FINANZEN IM BLICK

### Was ich tracken will:
- Claude API Tokens (Hauptverbraucher)
- Supabase monatlich
- Vercel (free/paid)
- Resend, Domains, Google Workspace
- Stripe Transaktionsgebühren (wenn Umsatz)
- Umsatz pro Projekt (wenn live)
- Gewinn/Verlust Rechnung

### Warum:
- Ich will wissen ob sich das lohnt
- Ich will wissen wann ich den Plan upgraden muss
- Ich will sehen welches Projekt am meisten frisst vs. am meisten bringt

---

## SYSTEM & AGENTS VERWALTEN

### System-Bereich:
- Übersicht: 18 Skills, 9 Agents, 5 MCP Server
- Quick Action: Neuen Skill recherchieren (Eingabe → Kompatibilitäts-Check)
- System-Terminal: Für Skill-Installation, Agent-Konfiguration, System-Änderungen

### Agent-Workflow-Vision (in Entwicklung):
Wenn ich "Ich hab eine neue Idee" sage, sollen automatisch 8 Abteilungen parallel loslegen:

```
1. Idea Intake Agent → Pitch strukturieren, Gegenfragen
2. Market Research Agent → Marktdaten, Wettbewerb
3. Marketing Agent → Branding, CI, Kanäle
4. Sales Agent → Vermarktung, Plattformen
5. Strategy Agent → Business Model, Pricing
6. Prototyp Agent → Wireframe → Mockup
7. Development Agent → Code bauen
8. Ops Agent → Deploy, Monitor
```

**Status:** Vision, noch nicht implementiert. Agents werden nach und nach definiert.

---

## OFFICE / PERSÖNLICHES

### Was drin ist:
- Aufgaben (privat + projekt getrennt)
- Kalender (Google Calendar, Phase 1)
- Posteingang (20 Postfächer, KI-Triage, Phase 2)
- Notizen (Freitext)
- Kontakte (Phase 2)

### Warum separat:
- Nicht alles ist Projekt-Arbeit
- Zahnarzt, Steuererklärung, Kinder — gehört auch gemanaged
- Der persönliche Assistent kümmert sich um MICH, nicht nur um Projekte

---

## FEIERABEND

### Der Tagesabschluss:
1. Klicke "Feierabend" (im Hamburger-Menü)
2. Dialog: "Folgendes wird ausgeführt..."
3. System speichert alle Projekte
4. Memory wird synchronisiert
5. Briefing für morgen wird vorbereitet
6. System fährt runter
7. "Gute Nacht, Mehti. Bis morgen."

### Warum wichtig:
- Nichts geht verloren
- Morgen weiß das System wo ich aufgehört habe
- KANI kann über Nacht nichts kaputt machen
- Klarer Start und klares Ende → gesunder Workflow

---

## DUAL-SCREEN SETUP

### Ultrawide Monitor (3440x1440):
- Mission Control Dashboard (immer offen)
- 3x3 Grid mit allen Bereichen
- Zeigt Gesamtübersicht, KPIs, Status
- Transformiert sich je nach View (Briefing, Thinktank, Details)

### MacBook Pro Display:
- Projekt-Fenster (neues Browser-Fenster)
- Ideen-Detail (neues Fenster)
- Aktiver Arbeitsbildschirm

### Synchronisation:
- Phase 0: Keine echte Sync (Dummy-Daten)
- Phase 1: File Parser (Dashboard liest ~/mckay-os/ live)
- Phase 3+: WebSocket State-Server (live bidirektional)

---

## DESIGN-PRINZIPIEN

### Apple Vision Pro Glaseffekt:
- Panels sind fast durchsichtig (rgba 0.03-0.08)
- Hintergrund scheint durch
- Tiefe Schatten für Schwebeffekt
- Subtile Borders (rgba weiß 0.08)
- Backdrop-blur 40px

### Dicht gepackt:
- Jede Zelle hat ein eigenes Sub-Grid mit KPIs
- Keine leeren Cards
- Charts, Gauges, Bars, Zahlen überall
- JetBrains Mono für Daten, Space Grotesk für Text

### Animationen:
- Alles bewegt sich — Counter zählen hoch, Bars füllen sich, Dots pulsen
- Grid-Transformationen sind smooth (300ms ease)
- Neue Panels faden/sliden rein
- Status-Updates leuchten kurz auf
- Boot-Sequence cineastisch (4-5 Sekunden)

### Buttons:
- Vision Pro Stil (pill-shaped, blur, tiefe Schatten)
- Hover: Lift + Glow
- Active: Press-Feel (scale 0.98)
- Jeder Button reagiert — Toast für Unfertiges

---

## PHASEN-PLAN

| Phase | Was | Status |
|---|---|---|
| Phase 0 | Wireframe + Mockup mit Dummy-Daten | **JETZT** |
| Phase 1 | File Parser (Dashboard liest ~/mckay-os/ live) | Nächster Schritt |
| Phase 2 | Supabase Backend (Todos, Ideen persistent) | |
| Phase 3 | Local Agent v1 (File Watch + Memory Sync) | |
| Phase 4 | Terminal Integration (echte Claude Code Sessions) | |
| Phase 5 | Full Local Agent (WebSocket, alle Features) | Die Vision |

---

## ZUSAMMENFASSUNG IN EINEM SATZ

**MCKAY Mission Control = Ich öffne eine Oberfläche, sehe alles auf einen Blick, steuere alles mit einem Klick, und das System wächst mit jedem Prompt den ich gebe.**
