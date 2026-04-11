---
type: project-todos
project: "mission-control"
updated: 2026-04-10
---

## Active — Nächste Session: Design-Overhaul
- [ ] **P1** Buchhaltung nach MCKAY COMMAND Design System restylen (physische Tiefe, Gauges, Animationen, 14px+)
- [ ] **P1** Finance-Bereich Konzept: Privatkonto, Auto, Wohnen als Perspektiven
- [ ] **P2** Finom Email-Trigger: "Kontoauszug bereit" → Todo erstellen

## Done (Session D+: 2026-04-10/11)
- [x] **P1** Layout-Redesign: 20%/80% Split, kompakte Karten, Full-Width Preview
- [x] **P1** Monatsnavigation: Pfeile zum Blättern, parameterisierte Components
- [x] **P1** GUV Dashboard + GUV Tab (ersetzt Datev)
- [x] **P1** 14-Monats-Historie backfilled (354 Transaktionen, Feb 2025 - Apr 2026)
- [x] **P1** Amount-basiertes Beleg-Matching (PDF-Beträge extrahieren)
- [x] **P1** Content-basierte Duplikat-Erkennung
- [x] **P1** Auto-Rename: PDFs lesen → Vendor erkennen → umbenennen
- [x] **P1** Privateinlagen (Christina + Mehti) separat kategorisiert
- [x] **P1** History-Endpoint für monatliche Trendübersicht

## Done (Session D: 2026-04-10)
- [x] **P1** Buchhaltung: Funktionaler Beleg-Tracker (Email-Scan, Kontoauszug-Upload, Drag&Drop, Auto-Rename)
- [x] **P1** Toast-System: Global, 5 Typen, Progress-Bar, Glassmorphism
- [x] **P1** 6 Backend-Endpoints: check-folder, upload, mark, scan-email (SSE), parse-kontoauszug
- [x] **P1** 2-Jahres-Beleg-Analyse: Echte Provider, Beträge, Source-Details aus Excel
- [x] **P2** Subscriptions: 23 echte Services, 8 Kategorien, tabellarisch links-aligned
- [x] **P2** Verträge: 7 echte Verträge, Laufzeit-Bars, Kündigungsfristen, Warnungen
- [x] **P2** Kunden: Hebammen.Agency + Hebammenbüro Dashboards mit echten Daten
- [x] **P2** Design-Overhaul: KPIs horizontal, Services tabellarisch, Kosten alle Kategorien

## Active — Session E: Life ausbauen
- [ ] **P2** Wohnung: Mieter, Hausverwaltung, Nebenkosten
- [ ] **P2** Familie + Gesundheit: Termine, Organisation, Fitness
- [ ] **P3** Private Todos + E-Mails

## Active — Session F: Network ausbauen
- [ ] **P2** Kontakte: Kontaktliste mit Rollen
- [ ] **P2** Events + Portale: Links, Zugangsstatus
- [ ] **P3** Partner + Opportunities: CRM-light

## Active — Session G: Go Live
- [ ] **P1** Alle Bereiche mit Mehti durchgehen
- [ ] **P1** Action Buttons pro Bereich finalisieren
- [ ] **P1** Dev → Main merge

## Done (Session C: 2026-04-10)
- [x] **P1** Anhänge Backend — MIME-Parser Attachments, GET /api/email/attachments + /attachment/download
- [x] **P1** Anhänge UI — Paperclip-Header, Typ-Icons, Größe, Download per Klick
- [x] **P1** Dynamische Ordner — KANI/Kunden/{Geschäftsbereich}, KANI/Rechnungen/{Anbieter}
- [x] **P1** Email-Memory Supabase — email_contacts, email_threads, email_rules + 18 Routing-Regeln
- [x] **P1** Kontakt-Profile — upsertEmailContact bei jeder Triage, interaction_count wächst
- [x] **P1** Smart Labels — KANI benennt dynamische Kategorien pro Postfach statt fixe 4
- [x] **P1** SmartKPIBar — KPIs sind klickbare Filter, ersetzt Filter-Tabs komplett
- [x] **P1** Master-Detail Layout — 20/40/40, Email-Liste links, KANI-Empfehlung rechts
- [x] **P1** KANI Empfehlungen — gruppierte Übersicht + 1:1 Detail pro ausgewählter Email
- [x] **P1** Kommentar-Flow — eigene Anweisung → KANI Plan → Bestätigung → Ausführen
- [x] **P1** Reply-Flow — Antwort-Entwurf prominent mit grünem Block + dediziertem Send-Button
- [x] **P2** Kalender Neon-Farben — Google-Farben durch Cyan/Pink/Purple ersetzt
- [x] **P2** Jahresansicht klickbar — Monat anklicken springt in Monatsansicht
- [x] **P2** Today vorausgewählt — Monatsansicht startet mit aktuellem Tag + Termine
- [x] **P2** Todo aus Email — "Todo erstellen" schreibt tatsächlich in Supabase
- [x] **P2** Todo Filter — Alle/Offen/Erledigt Buttons mit Count
- [x] **P2** Bearbeitet-Counter — zählt hoch bei jeder Email-Aktion, persistent pro Tag
- [x] **P2** Schriftgrößen — überall +1-3px für bessere Lesbarkeit
- [x] **P2** Kompakte Karten — Links 20% mit schlanken Kategorie-Karten

## Done (Session B: 2026-04-10)
- [x] **P1** Google Calendar Full CRUD — OAuth2 upgraded, 5 Endpoints, Multi-Calendar Hybrid UI
- [x] **P1** Email AI Triage — 6 Endpoints, Claude Haiku Classification, SMTP Send
- [x] **P1** MIME Body-Parser — Multipart + Base64 Decoding
- [x] **P1** Kalender Views — Tag/Woche/Monat/Jahr, klickbar, Vor/Zurück
- [x] **P1** Email UI — Filter-Buttons, Auto-Load, Expand/Collapse, Sender-Context
- [x] **P2** Memory Cleanup — 24 Legacy-Files gelöscht, 7 MC-Files zu 1 konsolidiert

## Done (Session A: 2026-04-09)
- [x] **P1** Google Calendar API — OAuth2, 3 Views
- [x] **P1** Non-Projekt Todos CRUD
- [x] **P1** IMAP Integration — 17/20 Konten live
- [x] **P2** E-Mail Übersicht — 20 Konten, 5 Gruppen
- [x] **P2** Punycode-Fix + categories.ts geschützt

## Done (Frühere Sessions)
- [x] **P1** useTerminalSession, IdeaDetail, WindowManager, Time Tracker
- [x] **P1** Office/Life/Hub/Network Pages + 9-Tile Cockpit
- [x] **P1** Terminal-Lifecycle, Feierabend-Button, Todo-Widget
