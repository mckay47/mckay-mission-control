# Mission Control — Project Memory
> Ebene 1: Pro-Projekt Memory · Updated: 2026-04-09
> Wird bei jedem Session-Ende von KANI aktualisiert.

---

## Letzte Session: 2026-04-09 (Mehrere kurze Sessions — kein neuer Build)

**Was gebaut wurde:**

Keine Build-Aktivität. Alle Sessions wurden direkt beendet (nur Verbindungstests).
Offene Änderungen im Working Directory (immer noch uncommitted):
- src/components/pages/ProjectDetail.tsx
- src/components/shared/Terminal.tsx
- src/lib/data.ts
- vite.config.ts
→ Dringend prüfen + committen in nächster Session.

**Letzter bekannter Build-Stand (2026-04-08):**
Phase 2 vollständig: Live Notifications, LaunchWizard, Session Persistence,
Feierabend-Button, Auto-Sync TODOS→Supabase, RLS Policies, TypeScript Fixes.

**Commits (branch: dev):** 2349c80, 644c9e9, 952c2d5, 10881f8

---

## Next Steps

1. **Offene Änderungen prüfen + committen** — ProjectDetail.tsx, Terminal.tsx, data.ts, vite.config.ts
2. Phase 3: Personal Modules — Todo-Widget persistent (P1), Kalender (P2), Notizen (P2)
3. Agent Status mit echten Daten befüllen (aktuell Dummy)
4. Bottom Ticker mit echten Daten statt statischen Einträgen

---

## Bekannte Issues

- Feierabend Quick Action Button zeigt keinen visuellen Effekt beim Klick (vermutlich alter Cache)
- Terminal im Projektfenster: Claude CLI Startup dauert 5-15 Sekunden (normal, kein Bug)

---

## Technischer Stand

- **URL lokal:** localhost:5173 (dev, via launchd)
- **Branch:** dev
- **Supabase:** 17 Tabellen, Realtime auf notifications + launch_sessions + projects + todos + agents + ticker_items
- **launchd:** aktiv (com.mckay.mission-control.plist)
- **RLS:** Alle Tabellen haben anon-Policies
- **Session Persistence:** Server-side Buffer + Disk-Log + Reconnect
- **Auto-Sync:** TODOS.md → Supabase + Feed-Einträge nach jedem Prompt
