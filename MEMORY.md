# Mission Control — Project Memory
> Ebene 1: Pro-Projekt Memory · Updated: 2026-04-09
> Wird bei jedem Session-Ende von KANI aktualisiert.

---

## Letzte Session: 2026-04-09 (Massive Session, 7 Commits)

**Was gebaut wurde:**
- useTerminalSession Hook: Lifecycle-Pattern extrahiert, ProjectDetail + IdeaDetail refactored
- Kitchen Tile im Cockpit: Flame-Icon, TerminalGrid mit 3-Severity Attention-Overlays (Gruen/Orange/Rot, Sirenen-Pulse)
- Status-Endpoint: Disk-Discovery fuer Terminals nach Server-Restart
- Window-Dedup: Kitchen und Projects oeffnen gleichen Pfad
- Kumulativer Time Tracker: ZoneProvider akkumuliert, Shutdown-Anzeige, Briefing-Integration
- System Detail Quick Actions: alle 4 Seiten verdrahtet mit Platzhalter-Prompts
- Office/Life/Hub Pages: 3 neue Seiten mit Split-Layout, Kategorien, Tabs
- Network Rewrite: neues Category-Pattern statt altem filter-Muster
- Cockpit: 9 Tiles (Projects, Thinktank, System, Office, Life, Hub, Network, Briefing, Kitchen)

**Commits (branch: dev):** 7f386de, f0165ba, 9b412c3, fc7ee80, 07d3c5d, 387bf8a, 717c5fc

---

## Next Steps — Roadmap zu Live

**Session A:** Hub ausbauen (Google Calendar, Non-Projekt Todos CRUD, E-Mail Uebersicht)
**Session B:** Office ausbauen (Buchhaltung Upload, Subscriptions, Vertraege, Kunden)
**Session C:** Life ausbauen (Wohnung, Familie, Gesundheit, Private Todos)
**Session D:** Network ausbauen (Kontakte, Events, Portale, Partner, Opportunities)
**Session E:** Final Review + Go Live (alle Bereiche durchgehen, Action Buttons finalisieren, dev→main)

6 von 9 Bereichen sind live-ready. Office/Life/Hub/Network brauchen echten Inhalt.

---

## Bekannte Issues

- Terminal Startup: 5-15s bei Kaltstart (normal, kein Bug)
- Feierabend/Shutdown-Sequenz dauert ~60-80s bei Kaltstart (Claude laedt Kontext)

---

## Technischer Stand

- **URL lokal:** localhost:5173 (dev, via launchd)
- **Branch:** dev (12+ Commits)
- **Supabase:** 17+ Tabellen, Realtime aktiv
- **launchd:** aktiv (com.mckay.mission-control.plist)
- **Cockpit:** 9 Tiles (Projects, Thinktank, System, Office, Life, Hub, Network, Briefing, Kitchen)
- **Terminal-Lifecycle:** useTerminalSession Hook — Projects + Thinktank
- **Kitchen:** TerminalGrid mit 3-Severity Attention (Gruen/Orange/Rot)
- **Time Tracker:** Kumulativ, localStorage, Shutdown-Reset, Briefing
- **Neue Seiten:** Office, Life, Hub (Split-Layout, Dummy-Daten, Tabs vorbereitet)
- **Network:** Umgeschrieben auf Category-Pattern
- **Daten:** Office/Life/Hub/Network aus data.ts (nicht Supabase), bei Bedarf migrierbar
