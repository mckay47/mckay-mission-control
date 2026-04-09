# Mission Control — Project Memory
> Ebene 1: Pro-Projekt Memory · Updated: 2026-04-09
> Wird bei jedem Session-Ende von KANI aktualisiert.

---

## Letzte Session: 2026-04-09 (Phase 3 — Große Session, 4 Commits)

**Was gebaut wurde:**

`[SIGNAL]`-Filter im Terminal (`useKaniStream.ts`):
- `[SIGNAL]`-Zeilen werden beim Restore aus History gefiltert
- `[SIGNAL]`-Zeilen werden beim Live-Streaming gefiltert
- Sauberere Terminal-Ausgabe — Signale gehen nur ans Dashboard

Shutdown/Refresh Race-Fix (`ProjectDetail.tsx`):
- `.catch(() => {})` → `.finally()` bei beiden fetch-Aufrufen (reset endpoint)
- State-Updates (setShuttingDown, setSessionActive, setSessionKey) erst nach Reset-Response
- Refresh-Delay 100ms → 200ms für sicheres Remount

**Commits (branch: dev):** ca01aa7, 1ab4bd3, 81e66f9, f567305

**Was gebaut wurde (vollständig):**
- Feierabend-Button Fix: shell:true entfernt (Node 25 DEP0190), Error-Handler, Header-Flush
- Todo-Widget persistent: Terminal-getrieben (Klick → in-progress → done), useTodoActions, Supabase + TODOS.md Sync
- Agent Status mit echten Daten: useAgentStatus Hook, /api/kani/status Polling
- Bottom Ticker mit echten Daten: activity_log + feed + notifications
- Terminal-Lifecycle: Dormant → Active → Shutdown, Session-Detection, Neue Session Button
- /api/kani/reset Fix: clearHistory() wurde nie aufgerufen (Root Cause für persistente History)
- /api/kani/abort: separater Endpoint für Stop-Button (Prozess killen ohne Browser-Disconnect)
- Browser-Disconnect killt Prozess NICHT mehr — Claude arbeitet im Hintergrund weiter
- [SIGNAL]-Zeilen aus Terminal-Output gefiltert
- windowManager.ts: fokussiert bestehende Fenster statt Duplikate zu öffnen
- Header Power-Button: projekt-spezifisch statt global

---

## Next Steps

1. **Terminal-Refactor**: useTerminalSession Hook + TerminalWorkspace Component extrahieren
2. **IdeaDetail**: Terminal + Lifecycle für Thinktank-Ideen (gleiches Pattern wie Projects)
3. **WindowManager überall**: alle window.open Calls auf openOrFocus umstellen
4. **Kalender** — Google Calendar Anbindung (P2)
5. **Notizen** — persistent (P2)

---

## Bekannte Issues

- Terminal Startup: 5-15s bei Kaltstart (normal, kein Bug)
- Feierabend/Shutdown-Sequenz dauert ~60-80s bei Kaltstart (Claude lädt Kontext)
- Claude CLI erkennt Nachrichten in MEMORY.md als "Prompt Injection" wenn zu befehlsartig formuliert

---

## Technischer Stand

- **URL lokal:** localhost:5173 (dev, via launchd)
- **Branch:** dev (4 neue Commits heute)
- **Supabase:** 17+ Tabellen, Realtime aktiv
- **launchd:** aktiv (com.mckay.mission-control.plist)
- **Terminal-Lifecycle:** Dormant → Active → Shutdown mit Session-Detection + Background-Processing
- **Neue Dateien:** useAgentStatus.ts, useTodoActions.ts, windowManager.ts
- **Terminal-Lifecycle:** Dormant → Active → Shutdown mit Session-Detection
