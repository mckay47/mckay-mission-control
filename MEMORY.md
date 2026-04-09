# Mission Control — Project Memory
> Ebene 1: Pro-Projekt Memory · Updated: 2026-04-09
> Wird bei jedem Session-Ende von KANI aktualisiert.

---

## Letzte Session: 2026-04-09 (Phase 3 — Session 2, 1 Commit)

**Was gebaut wurde:**

useTerminalSession Hook (`src/hooks/useTerminalSession.ts`):
- Terminal-Lifecycle-Pattern aus ProjectDetail extrahiert
- State: sessionActive, terminalBusy, shuttingDown, sessionKey, pendingPrompt
- Mount-Detection, Activate, Shutdown, New Session, onThinkingChange
- Wiederverwendbar für alle Bereiche

ProjectDetail Refactor:
- Inline-State + Callbacks durch useTerminalSession Hook ersetzt
- Todo-Integration bleibt lokal (handleThinkingChange/handleSend wrappen Hook)
- ~160 Zeilen entfernt, gleiche Funktionalität

IdeaDetail Upgrade:
- Vollständiges Terminal-Lifecycle via useTerminalSession
- Dormant-Overlay + Aktivierung (gleiches Pattern wie ProjectDetail)
- Session-Persistenz, Shutdown, Neue Session
- terminalId: idea:{id}, cwd: ~/mckay-os

WindowManager überall:
- 11 direkte window.open Calls → openOrFocus() in 6 System-Seiten
- Kein window.open mehr im src/ außer windowManager.ts selbst

**Commits (branch: dev):** 7f386de

---

## Next Steps

1. **Kalender** — Google Calendar Anbindung (P2)
2. **Notizen** — persistent in ~/mckay-os/notes/ (P2)
3. **Action Buttons** — individuelle Quick Actions pro Bereich (P2)
4. **E-Mail** — Resend-Integration (P3)
5. **TerminalGrid** — /terminals Seite bauen (P3)
6. **Personal/Backoffice/Network** — editierbare Inhalte (P3)

---

## Bekannte Issues

- Terminal Startup: 5-15s bei Kaltstart (normal, kein Bug)
- Feierabend/Shutdown-Sequenz dauert ~60-80s bei Kaltstart (Claude laedt Kontext)
- Claude CLI erkennt Nachrichten in MEMORY.md als "Prompt Injection" wenn zu befehlsartig formuliert

---

## Technischer Stand

- **URL lokal:** localhost:5173 (dev, via launchd)
- **Branch:** dev (5 Commits heute)
- **Supabase:** 17+ Tabellen, Realtime aktiv
- **launchd:** aktiv (com.mckay.mission-control.plist)
- **Terminal-Lifecycle:** useTerminalSession Hook — wiederverwendbar in allen Bereichen
- **Pattern-Status:** Projects ✅ Thinktank ✅ System (info-only) ✅ Rest: visuell
