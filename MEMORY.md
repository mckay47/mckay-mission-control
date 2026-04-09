# Mission Control — Project Memory
> Ebene 1: Pro-Projekt Memory · Updated: 2026-04-09
> Wird bei jedem Session-Ende von KANI aktualisiert.

---

## Letzte Session: 2026-04-09 (Bugfixes — Signal-Filter + Shutdown Race)

**Was gebaut wurde:**

`[SIGNAL]`-Filter im Terminal (`useKaniStream.ts`):
- `[SIGNAL]`-Zeilen werden beim Restore aus History gefiltert
- `[SIGNAL]`-Zeilen werden beim Live-Streaming gefiltert
- Sauberere Terminal-Ausgabe — Signale gehen nur ans Dashboard

Shutdown/Refresh Race-Fix (`ProjectDetail.tsx`):
- `.catch(() => {})` → `.finally()` bei beiden fetch-Aufrufen (reset endpoint)
- State-Updates (setShuttingDown, setSessionActive, setSessionKey) erst nach Reset-Response
- Refresh-Delay 100ms → 200ms für sicheres Remount

**Commits (branch: dev):** 1ab4bd3 + dieser Session-End Commit

---

## Next Steps

1. **Ideas-Terminal** mit gleichem Pattern wie Projects (Todo-Tracking, Lifecycle)
2. **Kalender** — Google Calendar Anbindung (P2)
3. **Notizen** — persistent in ~/mckay-os/notes/ (P2)
4. **E-Mail** — Resend-Integration (P3)

---

## Bekannte Issues

- Terminal Startup: 5-15s bei Kaltstart (normal, kein Bug)
- Feierabend/Shutdown-Sequenz dauert ~60-80s bei Kaltstart (Claude lädt Kontext)

---

## Technischer Stand

- **URL lokal:** localhost:5173 (dev, via launchd)
- **Branch:** dev
- **Supabase:** 17+ Tabellen, Realtime auf notifications + launch_sessions + projects + todos + agents + ticker_items
- **launchd:** aktiv (com.mckay.mission-control.plist)
- **RLS:** Alle Tabellen haben anon-Policies
- **Session Persistence:** Server-side Buffer + Disk-Log + Reconnect
- **Auto-Sync:** TODOS.md → Supabase + Feed-Einträge nach jedem Prompt
- **Terminal-Lifecycle:** Dormant → Active → Shutdown mit Session-Detection
