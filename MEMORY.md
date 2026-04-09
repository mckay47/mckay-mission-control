# Mission Control — Project Memory
> Ebene 1: Pro-Projekt Memory · Updated: 2026-04-09
> Wird bei jedem Session-Ende von KANI aktualisiert.

---

## Letzte Session: 2026-04-09 (Build: Todo-Widget + Agent Status)

**Was gebaut wurde:**

- `useTodoActions.ts` — CRUD für Todos via Supabase (add/toggle/delete)
- `useAgentStatus.ts` — Echtzeit Agent-Status aus Terminal-Aktivität
- `ProjectDetail.tsx` — massiv erweitert (333 Insertions): Todo-Widget + Agent Status integriert
- `MissionControlProvider.tsx` — erweitert für neue Hooks
- `vite.config.ts` — 70 neue Zeilen (Proxy/Plugin-Setup)
- `Header.tsx`, `Terminal.tsx`, `data.ts` — kleinere Anpassungen
- `TODOS.md` — Todo-Widget ✓ + Kalender ✓ abgehakt

**Commits (branch: dev):** ca01aa7 + dieser Session-End Commit

---

## Next Steps

1. **Bottom Ticker** mit echten Daten statt statischen Einträgen (P2)
2. **Notizen** — persistent in ~/mckay-os/notes/ (P2)
3. **E-Mail** — Resend-Integration (P3)
4. Agent Status weiter verfeinern (Live-Daten verifizieren)

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
