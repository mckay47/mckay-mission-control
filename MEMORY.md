# Mission Control — Project Memory
> Ebene 1: Pro-Projekt Memory · Updated: 2026-04-10
> Wird bei jedem Session-Ende von KANI aktualisiert.

---

## Letzte Session: D — Office (2026-04-10)

### Was gebaut wurde
- **Buchhaltung:** Funktionaler Beleg-Tracker (nicht Mockup!)
  - Email-Scan: 8 IMAP-Konten, SSE-Streaming, PDF-Attachment-Extraktion → iCloud BUCHHALTUNG
  - Kontoauszug-Upload: Finom PDF Parser, dynamische Beleg-Liste aus Transaktionen
  - Drag & Drop Upload + Auto-Rename (YYYY-MM_Vendor_Beschreibung.pdf)
  - Vollständigkeits-Tracker: Live-Status aus iCloud BUCHHALTUNG Ordner
  - Source-Details aus Excel Betriebskosten-Übersicht
  - 2 Jahre Belege analysiert (2024-2026), echte Provider-Liste
- **Subscriptions:** 23 echte Services, 8 Kategorien, tabellarisch
- **Verträge:** 7 echte Verträge, Laufzeit-Bars, Kündigungsfristen
- **Kunden:** Hebammen.Agency + Hebammenbüro Dashboards
- **Toast-System:** Global, 5 Typen, Progress-Bar, Glassmorphism
- **6 neue Backend-Endpoints** für Belege-Management

### Daten-Erkenntnisse
- Echte monatliche Kosten ~€550+/mo (COSTS.md zeigte nur €247)
- Superchat + WixEngine gekündigt Ende 2025
- Vercel/Supabase/n8n = Free Tier
- Neue Services: Anthropic Claude, Pathway Solutions, XAI/Grok, Twilio noch aktiv

## Nächste Sessions
- **E:** Life (Wohnung, Familie, Gesundheit)
- **F:** Network (Kontakte, Events, Partner)
- **G:** Go Live (Review, dev → main merge)

## Offene Verbesserungen
- Proaktive Email-Attachment-Extraktion bei Eingang
- Download-Ordner Scanner
- Buchhaltung Belege-Tab UI polieren
- Alte Toast.tsx in src/components/ entfernen (neue in ui/)
