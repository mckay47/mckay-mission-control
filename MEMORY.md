# Mission Control — Project Memory
> Ebene 1: Pro-Projekt Memory · Updated: 2026-04-08
> Wird bei jedem Session-Ende von KANI aktualisiert.

---

## Letzte Session: 2026-04-08 (Phase 2 Complete + Session Persistence)

**Was gebaut wurde:**

Phase 2 — Live Notifications + Launch Integration:
- Supabase `notifications` + `launch_sessions` Tabellen mit Realtime
- Notifications.tsx: Supabase-backed, Dismiss, Mark-read, Unread-Counter
- LiveFeed.tsx: Echtzeit-Ticker aus Notifications
- LaunchWizard: 5-Step Modal (Describe → Research → Brief → Review → Created)
- /api/project: Supabase Insert + Folder Scaffold (CLAUDE.md, TODOS.md, MEMORY.md, DECISIONS.md)
- /api/launch/research: Claude CLI Research mit JSON-Output
- Auto-Notifications bei KANI Signals, Session-End, Projekt-Erstellung

Session Persistence + Terminal Features:
- Server-side Session Buffer (in-memory + .terminal-log.jsonl auf Disk)
- Terminal Reconnect: History laden beim Öffnen, Background-Prozesse weiterlaufen
- Feierabend Quick Action Button pro Projekt (Session-End Protokoll)
- Auto-Sync TODOS.md → Supabase nach jedem Terminal-Prompt
- Auto-Feed: Live Feed Einträge aus Terminal-Aktivität in Supabase
- Quick Action Buttons mit echten Prompts (Status, Deploy, Test, Todos, Ideas, Feierabend)

Fixes:
- TypeScript null-safety Fixes über 10+ Komponenten
- Claude CLI spawn: absolute Pfade + expliziter PATH + shell:true für launchd
- Projekt-ID Fix: mc → mission-control (Supabase + FK Updates)
- RLS Policies: anon-Zugriff für alle Dashboard-Tabellen
- Dummy-Feed gelöscht, nur noch echte Einträge

**Commits:** 10881f8, 952c2d5, 644c9e9 + pending (branch: dev)

---

## Next Steps

1. Feierabend-Button Debug: Button reagiert optisch nicht — wahrscheinlich Browser-Cache, morgen mit Hard-Reload testen
2. Phase 3: Personal Modules (Todo, Kalender, Notizen, E-Mail)
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
