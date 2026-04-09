# Mission Control — Project Memory
> Ebene 1: Pro-Projekt Memory · Updated: 2026-04-09
> Wird bei jedem Session-Ende von KANI aktualisiert.

---

## Letzte Session: 2026-04-09 (Phase 3 — Session 2, 4 Commits)

**Was gebaut wurde:**

useTerminalSession Hook + Refactoring:
- Hook extrahiert aus ProjectDetail, wiederverwendbar
- ProjectDetail + IdeaDetail nutzen beide den Hook
- WindowManager: alle 11 window.open → openOrFocus

Kitchen + TerminalGrid Attention:
- "Kitchen" Tile im Cockpit (Flame-Icon, rot-orange Glow)
- 3 Severity-Level: Gruen (fertig), Orange (wartet), Rot (eingriff)
- Volles Overlay mit pulsierender Sirenen-Animation (4s Zyklus)
- Status-Endpoint: Disk-Discovery fuer Terminals nach Server-Restart
- Window-Dedup: Kitchen und Projects oeffnen gleichen Pfad

Kumulativer Time Tracker:
- ZoneProvider: todayTotal akkumuliert ueber Zone/Matrix-Wechsel
- localStorage Persistenz (mckay-workday + 30-Tage History)
- StampButton: H:MM:SS Format ab 60min
- ShutdownDialog: zeigt Arbeitszeit + resetDay() bei Shutdown
- Briefing: heute (live) + gestern (aus History)

**Commits (branch: dev):** 7f386de, f0165ba, 9b412c3, fc7ee80

---

## Next Steps

1. **Action Buttons** — individuelle Quick Actions pro Bereich (P2)
2. **Kalender** — Google Calendar Anbindung (P2)
3. **E-Mail** — Resend-Integration (P3)
4. **Personal/Backoffice/Network** — editierbare Inhalte (P3)

---

## Bekannte Issues

- Terminal Startup: 5-15s bei Kaltstart (normal, kein Bug)
- Feierabend/Shutdown-Sequenz dauert ~60-80s bei Kaltstart (Claude laedt Kontext)

---

## Technischer Stand

- **URL lokal:** localhost:5173 (dev, via launchd)
- **Branch:** dev (8 Commits, 4 heute)
- **Supabase:** 17+ Tabellen, Realtime aktiv
- **launchd:** aktiv (com.mckay.mission-control.plist)
- **Terminal-Lifecycle:** useTerminalSession Hook — Projects + Thinktank
- **Kitchen:** TerminalGrid mit 3-Severity Attention-System
- **Time Tracker:** Kumulativ, localStorage, Shutdown-Reset, Briefing-Integration
