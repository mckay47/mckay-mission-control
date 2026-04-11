# Mission Control — Project Memory
> Ebene 1: Pro-Projekt Memory · Updated: 2026-04-11
> Wird bei jedem Session-Ende von KANI aktualisiert.

---

## Letzte Session: D+ — Office Buchhaltung funktional (2026-04-10 + 11)

### Was gebaut wurde
- **Toast-System:** Global, 5 Typen, Progress-Bar, Glassmorphism, überall nutzbar
- **6 Belege-Endpoints:** check-folder, upload, mark, scan-email (SSE), parse-kontoauszug, history
- **Kontoauszug-Upload:** Finom PDF Parser, Transaktions-Extraktion, Amount-basiertes Beleg-Matching
- **Email-Scan:** 8 IMAP-Konten parallel, PDF-Attachments direkt in iCloud BUCHHALTUNG
- **Duplikat-Erkennung:** Content-basiert (Dateigröße + erste 512 Bytes)
- **Auto-Rename:** PDFs lesen → Vendor erkennen → YYYY-MM_Vendor_Rechnung.pdf
- **Layout-Redesign:** 20%/80% Split, kompakte Karten links, Full-Width Preview rechts
- **Monatsnavigation:** ← März 2026 → blättern, parameterisierte Components
- **GUV Dashboard:** Einnahmen/Ausgaben/Saldo, Revenue+Expense Breakdown
- **GUV Tab:** Professionelle GuV-Aufstellung (ersetzt Datev)
- **14-Monats-Historie:** Feb 2025 - Apr 2026 backfilled aus 40-Seiten Kontoauszug (354 Tx)
- **Privateinlagen:** Christina + Mehti separat kategorisiert + angezeigt
- **History-Endpoint:** Monatliche Trend-Tabelle mit Mini-Bars

### Daten-Erkenntnisse
- Echte monatliche Ausgaben: €500 (Mär 25) bis €2.643 (Jan 26)
- Einnahmen ab Dez 2025 (Hebammen.Agency Go-Live)
- Privateinlagen: €19.933 gesamt über 14 Monate
- Neue Vendors entdeckt: Perplexity AI, PayPal*Vodafone (Apr 2026)

## Nächste Session: Design-Overhaul

### Priorität 1: Buchhaltung nach MCKAY COMMAND Design System restylen
- Design Skills lesen: `mckay/design-system.md` + `integrations/ui-design.md`
- Physische Tiefe statt flache Cards (Raised Panel Shadows, Inset Displays)
- Gauge/Knob KPIs statt nackte Zahlen
- Schriftgrößen: minimum 14px body, 24px+ für Hero-Zahlen
- Animationen: Counter count-up, Entrance fade-in-up, Glow breathe
- Scan-Lines auf wichtigen Panels
- Alle Anti-Patterns fixen (flat cards, tiny fonts, no animations)

### Priorität 2: Finance-Bereich Konzept
- Mehti will privaten Kontoauszug auch hochladen
- Financial Command Center: Geschäft + Privat + Auto + Wohnen
- Perspektiven als Filter auf dieselben Kontoauszug-Daten
- Evtl. eigener Top-Level-Tile im Cockpit

### Priorität 3: Sessions E+F
- Life ausbauen (Wohnung, Familie, Gesundheit)
- Network ausbauen (Kontakte, Events, Partner)

## Bekannte Issues
- Design ist "katastrophal" (Mehti-Zitat) — muss nach Design Skills überarbeitet werden
- Kunden + Business Email Karten können ausgeblendet werden
- Finom Email-Trigger für Buchhaltung-Erinnerung noch nicht gebaut
- Monatsauswahl-Dropdown fehlt (nur Pfeile)
- Alte Toast.tsx in src/components/ (unused, neue in src/components/ui/)
