# Mission Control V3 — Reset Kit
> Alles was du brauchst um das Dashboard komplett frisch aufzusetzen.
> Stand: 6. April 2026

---

## Ablauf

1. Reset-Script ausfuehren (loescht ideas/*.md und todos/*.md)
2. `npm run generate` → leeres Dashboard
3. Projekte einzeln einpflegen (6 echte Projekte)
4. Ideen einzeln einpflegen (18 echte Ideen)
5. Todos einzeln einpflegen (7 echte Todos)
6. Nach jedem Batch: `npm run generate` → Aenderung live pruefen
7. Wenn alles sauber → `vercel deploy --prod`

---

## TEIL 1: ECHTE PROJEKTE (haben URL/Mockup/Code)

Diese 6 bleiben als Projekte im Dashboard. Alle anderen werden zu Ideen.

### Projekt 1: Hebammenbuero
```
Name: Hebammenbuero
ID: heb
Status: Phase 0 (mockup live)
URL: https://hebammenbuero.vercel.app
Domain: hebammenbuero.de
Stack: React+Vite, Supabase, Vercel
Beschreibung: SaaS Plattform fuer Hebammenpraxen. Onboarding, Konfigurator, Behandlung, Kalender, Kurse.
Fortschritt: 40%
Naechster Schritt: Extended Mockup (6 Seiten), Validation mit Hebammen
Letztes Update: Phase 0 Mockup LIVE at hebammenbuero.vercel.app
```

### Projekt 2: Mission Control
```
Name: Mission Control
ID: mc
Status: Phase 0 (active)
URL: localhost:5174 / mckay-os.vercel.app
Domain: mckay-os.vercel.app
Stack: React+Vite, TailwindCSS, Vercel
Beschreibung: MCKAY OS Dashboard. Das System das alles steuert.
Fortschritt: 67%
Naechster Schritt: Real Data Integration, Deploy
Letztes Update: V3 Ghost UI Rebuild + Pakets A-D
```

### Projekt 3: TennisCoach Pro
```
Name: TennisCoach Pro
ID: tcp
Status: Phase 3 (code complete)
URL: ~/TennisAPP (lokal)
Domain: tenniscoach.pro
Stack: Next.js 16, Supabase, Stripe, Resend
Beschreibung: AI Tennis-Trainer. Videoanalyse, Trainingsplaene, Matchstatistik.
Fortschritt: 80%
Naechster Schritt: Deploy auf Vercel, Beta-Launch
Letztes Update: 47/47 Tests bestanden, Phase 3 code complete
```

### Projekt 4: FindeMeineHebamme
```
Name: FindeMeineHebamme
ID: fmh
Status: Live
URL: https://findemeinehebamme.de
Domain: findemeinehebamme.de
Stack: Next.js, Supabase, Vercel (auf Lovable gehostet)
Beschreibung: Hebammen-Suchportal. Live seit Februar 2026.
Fortschritt: 100%
Naechster Schritt: Monitoring, V2 Redesign geplant
Letztes Update: ~100 Orders in 10 Wochen
```

### Projekt 5: Stillprobleme
```
Name: Stillprobleme
ID: stl
Status: Phase 0 (scaffolded, blocked)
URL: -
Domain: stillprobleme.de (registriert)
Stack: Next.js, Supabase+PostGIS, Vercel, Stripe
Beschreibung: Notfall-Telemedizin: Muetter mit Stillproblemen mit IBCLC-Stillberaterinnen verbinden.
Fortschritt: 10%
Naechster Schritt: API Key beschaffen oder parken
Letztes Update: Scaffolded, API Credentials blocked
Blocker: RED Medical API Credentials fehlen
```

### Projekt 6: Tax Architect (Kundenprojekt)
```
Name: Tax Architect
ID: tax
Status: Content fertig, Build pending
URL: -
Domain: steuerberaterinott.de
Stack: React+Vite, Vercel
Beschreibung: Website fuer Steuerberaterin Ott. Erstes externes Kundenprojekt.
Fortschritt: 30%
Naechster Schritt: Design aus Stitch exportieren, mit KANI bauen
Letztes Update: Content-Skript + Design in Stitch fertig
```

---

## TEIL 2: IDEEN (18 Stueck — alles was KEIN echtes Projekt ist)

Jede Idee hat den Original-Text den du damals eingegeben hast.
Kopiere den Prompt in ein leeres KANI-Terminal um die Idee neu anzulegen.

### Idee 1: AI Callcenter-as-a-Service
```
Kategorie: Service | Prioritaet: medium | Status: researching
Tags: voice-ai, saas, vapi

AI-powered call center service using VAPI. Businesses can outsource their
phone support to AI agents that handle calls, route inquiries, and escalate
when needed. Massive market — every SMB needs phone support but can't afford
a call center.

Next Steps:
- VAPI pricing and capabilities researchen
- Use Cases definieren (appointment booking, support, sales)
- Business model (per-minute, per-call, or monthly)
```

### Idee 2: Webdesign Agentur als Front
```
Kategorie: Sales | Prioritaet: medium | Status: researching
Tags: agentur, websites, kunden, autopilot

Webdesign-Agentur Marke als Frontend fuer autopilot-sales. Website-Services
fuer lokale Businesses. Die Agentur sieht aus wie eine etablierte Firma mit
Team und Referenzen — ist aber vollstaendig KI-gesteuert.

Warum eigene Brand: MCKAY.AGENCY = Holding/Tech. Die Webdesign-Agentur =
"Wir machen Ihre Webseite schoen" fuer KMU, Handwerker, Gastro. Kunde soll
nicht wissen dass alles KI-gebaut ist.

Next Steps:
- Brand Name + Positionierung definieren
- Landing Page + Service Packages
- An autopilot-sales Pipeline anschliessen
```

### Idee 3: Autonomous Website Sales System
```
Kategorie: Sales | Prioritaet: medium | Status: new
Tags: automation, sales, scraping

Vollautonomes Sales-System: Taeglich veraltete Webseiten identifizieren via
Google Maps, automatisch moderne Ersatz-Webseiten bauen, Firmen per Cold
Outreach kontaktieren. Jeden Tag 5-10 neue potentielle Kunden automatisch
ansprechen — mit fertiger Preview-Webseite und Pitchmappe.

Workflow: FINDEN (Google Maps) → BEWERTEN (Lighthouse) → SCRAPEN (Puppeteer)
→ WETTBEWERBSANALYSE → NEUE WEBSEITE BAUEN → OUTREACH

Next Steps:
- Prototype: Google Maps scraper + quality scorer
- Legal review: GDPR fuer cold outreach
- Outreach Templates definieren
```

### Idee 4: FindeMeineHebamme v2 Rebuild
```
Kategorie: Health | Prioritaet: medium | Status: new
Tags: hebammen, matching, rebuild, n8n

Rebuild from Lovable to KANI stack. Automation via n8n + Claude API.
Currently ~100 orders in 10 weeks on v1. v1 auf Lovable ist limitiert in
Customization und Skalierbarkeit.

Next Steps:
- Scope delta zwischen v1 und v2 definieren
- n8n Workflows fuer Migration mappen
- Data Migration von Lovable planen
```

### Idee 5: MCKAY Inbox
```
Kategorie: System | Prioritaet: medium | Status: new
Tags: email, automation, gmail, intern

Zentrale E-Mail Kommandozentrale mit KI Triage. 20 Postfaecher
zusammenfuehren. Gmail API + MS Graph. Ein zentrales Dashboard + KI Agent
ueberwacht alle 20 Postfaecher, kategorisiert nach Projekt/Prioritaet/Aktion.
Automatische Antworten bei klaren Faellen.

Next Steps:
- Inventory aller 20 Mailboxes und Provider
- Gmail API + MS Graph Integration researchen
- Triage-Regeln und Prioritaetslogik definieren
```

### Idee 6: MCKAY Sales CRM
```
Kategorie: Sales | Prioritaet: medium | Status: new
Tags: crm, leads, pipeline, intern

Internes Sales CRM Tool. Lead-Tracking, Pipeline-Management,
Angebotsverwaltung. Kein externes SaaS — direkt in MCKAY OS integriert.

Pipeline: Lead → Qualifiziert → Angebot → Verhandlung → Abschluss

Next Steps:
- Pipeline Stages und Lead-Felder definieren
- Data Model in Supabase designen
- Integration mit autopilot-sales planen
```

### Idee 7: MCKAY Marketing & Social Media Hub
```
Kategorie: Marketing | Prioritaet: medium | Status: new
Tags: social-media, automation, content, multichannel

Marketing-Hub fuer alle Social Media Kanaele. Content-Planung, Automation,
Analytics. Multi-Platform (Instagram, LinkedIn, TikTok). KI Content
Generierung, Scheduling, Redaktionskalender, Campaign-Tracking.

Next Steps:
- Inventory aller aktiven Social Media Kanaele
- Feature Scope definieren (planning, scheduling, analytics)
- API Access pro Plattform evaluieren
```

### Idee 8: MCKAY LinkedIn Automation
```
Kategorie: Marketing | Prioritaet: medium | Status: new
Tags: linkedin, social-media, content, automation

LinkedIn Content Automation via n8n + Claude API. Automatische Posts,
Engagement, Lead Generation. Profil optimieren, Content Strategie entwickeln,
Netzwerk aufbauen.

Next Steps:
- Content Pillars und Posting-Frequenz definieren
- n8n Workflow fuer Content-Generierung bauen
- LinkedIn API Limits und Compliance researchen
```

### Idee 9: MCKAY.AGENCY Website Neuaufbau
```
Kategorie: Marketing | Prioritaet: medium | Status: new
Tags: website, branding, agentur

Kompletter Website-Neuaufbau fuer MCKAY.AGENCY. Corporate Identity,
Portfolio, Referenzen. MCKAY COMMAND Design System anwenden. Showcase aller
aktiven Projekte.

Next Steps:
- Page Structure und Content definieren
- MCKAY COMMAND Design System fuer Public Site adaptieren
- Portfolio Items und Case Studies sammeln
```

### Idee 10: Social Media Capture Pipeline
```
Kategorie: Marketing | Prioritaet: medium | Status: new
Tags: automation, content, ai

Capture content from Instagram, TikTok, YouTube via yt-dlp. Transcribe with
Whisper. Feed into MCKAY OS memory pipeline for knowledge extraction.
Alles was Mehti sieht, hoert oder bespricht landet strukturiert im System.

Workflow: Link kopieren → yt-dlp + Whisper → Claude analysiert →
Memory-Eintrag mit Tags

Next Steps:
- Prototype: yt-dlp + Whisper CLI pipeline
- Output-Format fuer Memory-Integration definieren
```

### Idee 11: AI Dating Platform
```
Kategorie: Marketplace | Prioritaet: medium | Status: new
Tags: marketplace, ai, dating

Dating platform where matching is based on AI chat histories — not photos
or profiles. Users share their AI conversation patterns, and the system
matches compatible thinking/communication styles.

Unique differentiator: No other platform uses AI interaction data for matching.

Next Steps:
- Research: existing AI-based dating apps
- Matching algorithm concept definieren
- Business model (freemium vs. subscription)
```

### Idee 12: SmartHome Dashboard
```
Kategorie: Marketplace | Prioritaet: medium | Status: new
Tags: smart-home, iot, dashboard

Universelles Dashboard fuer Smart-Home-Geraete. Herstelleruebergreifend,
KI-gesteuerte Energieoptimierung. Existing dashboards sind manufacturer-locked.

Next Steps:
- Smart Home APIs researchen (Home Assistant, Matter, Zigbee)
- MVP Feature Set definieren
- Energy optimization algorithms evaluieren
```

### Idee 13: Auto-Scheduling (Motion-Alternative)
```
Kategorie: System | Prioritaet: medium | Status: new
Tags: kalender, automation, scheduling, intern

Die Auto-Scheduling-Funktion von Motion selbst bauen. Aufgabe mit Deadline +
Dauer → KI plant optimales Zeitfenster. Statt 19$/Monat. Integriert in
MCKAY OS.

Next Steps:
- Google Calendar API fuer read/write researchen
- Scheduling algorithm logic definieren
- Prototype: simple task → time slot matching
```

### Idee 14: Scale-First Agent/Skill
```
Kategorie: System | Prioritaet: medium | Status: new
Tags: skalierung, architektur, agent, skill

Bei jedem neuen Projekt automatisch Skalierbarkeits-Fragen stellen (Max User,
Traffic, Kosten eines Ausfalls) und daraus den richtigen Stack ableiten.
Verhindert Under- und Over-Engineering.

Next Steps:
- Scalability Questionnaire definieren
- Answers → Stack Recommendations mappen
- In launch-agent Protocol integrieren
```

### Idee 15: Kling AI Video Content
```
Kategorie: System | Prioritaet: low | Status: new
Tags: video, ai, branding

Generate branded video content using Kling AI: Boot Sequence Animation,
Cockpit Loop Background, Neon Tunnel Transition, Button Videos fuer
Mission Control. Elevates Dashboard from static to cinematic.

Next Steps:
- Shutterstock vs. Kling-generated evaluieren
- Video Prompts fuer jede Szene schreiben
- Kling Output Quality testen
```

### Idee 16: PowerPoint Template Collection
```
Kategorie: System | Prioritaet: low | Status: new
Tags: templates, presentations

Curated PowerPoint template collection as a KANI skill. Generate branded
presentations from structured data. Mehti braucht haeufig professionelle
Praesentationen fuer Kunden und Pitches.

Next Steps:
- Standalone Projekt oder MCKAY OS Skill?
- Template Requirements sammeln
```

### Idee 17: Compute Power als Asset
```
Kategorie: Investment | Prioritaet: low | Status: parked
Tags: compute, tokens, AI-infrastructure, investment, future

Compute Power ist ein knappes Gut — genau wie Oel. Wer Compute besitzt oder
Rechte daran haelt, kontrolliert die Zukunft.

Szenario: MCKAY OS skaliert auf 1 Million User → jeder braucht AI Compute.
Wie kauft man sich Compute-Rechte? GPU-Cluster, Cloud, dezentrale
Marktplaetze (Akash, io.net)?

Richtungen: Investor, Reseller, eigene Infrastruktur, dezentral, hybrid.
Trigger: Research-Agent aktivieren wenn bereit.
```

### Idee 18: MCKAY Agency Vision (Voice-Memo)
```
Kategorie: Consulting | Prioritaet: medium | Status: new
Tags: agentur, consulting, freelancer, ki-transformation

Das SAP-Berater-Modell auf KI/Cloud uebertragen. Netzwerk aus autonomen
Freelancern mit Cloud Code + KI-Expertise. Unternehmen koennen KI/Cloud
nicht intern entwickeln. Die benoetigten Experten sind autonome Freelancer,
nicht Angestellte. Es fehlt eine serioese Corporate-Anlaufstelle.

Vision: Gleiche Struktur wie SAP-Beratung, aber fuer KI/Cloud.
Vermittlung von Consulting Projects und Custom Cloud Setups.
Tagessaetze, vollstaendige Ausbuchung durch hohe Nachfrage.

Next Steps:
- 3-5 verlaessliche KI/Cloud-Freelancer aus eigenem Netzwerk finden
- Erstes Corporate-Pilotprojekt testen
```

---

## TEIL 3: TODOS (7 echte — ohne Test-Eintraege)

### Todo 1
```
ID: dashboard-echte-daten
Titel: Dashboard mit echten Daten verbinden (Phase E)
Prioritaet: high
Projekt: mission-control
Assignee: kani
Status: in-progress
```

### Todo 2
```
ID: dashboard-production-deploy
Titel: dev → main merge + Production Deploy
Prioritaet: high
Projekt: mission-control
Assignee: kani
Status: open
```

### Todo 3
```
ID: hebammenbuero-extended-mockup
Titel: Hebammenbuero Extended Mockup fertigstellen
Prioritaet: high
Projekt: hebammenbuero
Assignee: mehti
Status: open
```

### Todo 4
```
ID: stillprobleme-mockup
Titel: Stillprobleme.de Phase 0 Mockup bauen
Prioritaet: medium
Projekt: stillprobleme
Assignee: kani
Status: open
```

### Todo 5
```
ID: tenniscoach-phase4
Titel: TennisCoach Pro Phase 4/5 planen
Prioritaet: medium
Projekt: tenniscoach
Assignee: mehti
Status: open
```

### Todo 6
```
ID: findemeinehebamme-github-repo
Titel: findemeinehebamme-v2 GitHub Repo URL liefern
Prioritaet: medium
Projekt: findemeinehebamme-v2
Assignee: mehti
Status: blocked
```

### Todo 7
```
ID: mckay-inbox-postfaecher
Titel: mckay-inbox Liste aller 20 Postfaecher erstellen
Prioritaet: medium
Projekt: mckay-inbox
Assignee: mehti
Status: blocked
```

---

## TEIL 4: NICHT UEBERNEHMEN (Muell)

Diese Eintraege waren Test/Placeholder und werden NICHT neu angelegt:

- `test.md` (Idee) — War nur ein Test-Eintrag
- `test-todo-aus-dem-dashboard` (Todo) — War nur ein Test
- `agent-workflows-definieren` (Todo) — Zu generisch, kein konkretes Projekt
- `also-pass-auf-genauso-wie-der-sack...` (Idee) — Raw Voice Memo, Kerninhalt ist in "MCKAY Agency Vision" (Idee 18) sauber erfasst

---

## TEIL 5: RESET-ANLEITUNG

Wenn du bereit bist, sage KANI:

```
Fuehre den Dashboard-Reset durch. Loesche alle Ideas und Todos,
dann pflege ich alles frisch ein aus dem RESET-KIT.md.
```

KANI wird dann:
1. Alle Dateien in ~/mckay-os/ideas/ loeschen (ausser _INDEX.md, _TEMPLATE.md)
2. Alle Dateien in ~/mckay-os/todos/ loeschen (ausser _INDEX.md, _TEMPLATE.md)
3. `npm run generate` ausfuehren → leeres Dashboard
4. Auf deine Eingaben warten

Du pflegst dann Stueck fuer Stueck ein — Projekt fuer Projekt, Idee fuer Idee.
