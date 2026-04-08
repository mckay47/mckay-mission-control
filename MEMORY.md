# Mission Control — Project Memory
> Ebene 1: Pro-Projekt Memory · Updated: 2026-04-08
> Wird bei jedem Session-Ende von KANI aktualisiert.

---

## Letzte Session: 2026-04-08 (Phase 2 Build)

**Was gebaut wurde:**
- Live Notifications: Supabase-backed, Realtime, Dismiss, Mark-read, Auto-Notifications
- LaunchWizard: 5-Step Modal (Describe → Research → Brief → Review → Created)
- /api/project Endpoint: Supabase Insert + Folder Scaffold
- /api/launch/research: Claude CLI Research mit JSON-Output
- Server-side Session Buffer: Terminal-History persistent über Fenster-Schließen
- Terminal Reconnect: History laden beim Öffnen, Background-Prozesse weiterlaufen
- Feierabend-Button pro Projekt: Session-End Protokoll per Quick Action
- Auto-Sync TODOS.md → Supabase nach Terminal-Prompt
- Auto-Feed: Live Feed Einträge aus Terminal-Aktivität
- Quick Action Buttons: Status, Deploy, Test, Todos, Ideas, Feierabend
- TypeScript null-safety Fixes über 10+ Komponenten
- Claude CLI spawn: absolute Pfade + expliziter PATH für launchd
- Projekt-ID Fix: mc → mission-control

**Letzter Commit:** 952c2d5 (branch: dev)

---

## Next Steps

1. Projekt-Memory und TODOS.md werden jetzt automatisch via Terminal-Session aktualisiert
2. Phase 3: Personal Modules (Todo, Kalender, Notizen, E-Mail)
3. Agent Status und weitere Supabase-Felder mit echten Daten befüllen

---

## Offene Entscheidungen

keine

---

## Technischer Stand

- **URL lokal:** localhost:5173 (dev, via launchd)
- **Branch:** dev
- **Supabase:** Verbunden — 17 Tabellen, Realtime auf notifications + launch_sessions + projects + todos
- **launchd:** aktiv (com.mckay.mission-control.plist)
- **Neue Features:** Live Notifications, LaunchWizard, Session Persistence, Auto-Feed, Feierabend-Button
- **RLS:** Alle Tabellen haben anon-Policies für Dashboard-Zugriff
