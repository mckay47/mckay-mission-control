# Mission Control — Project Memory
> Ebene 1: Pro-Projekt Memory · Updated: 2026-04-08
> Wird bei jedem Session-Ende von KANI aktualisiert.

---

## Letzte Session: 2026-04-08 (Go Live Session)

**Was gebaut wurde:**
- Supabase Datenmigration: 14 Workflows (W1-W14) + 4 echte MC-Todos eingepflegt
- scaffold-project Skill: TODOS.md + DECISIONS.md + W1-Referenz + REGISTRY.md-Format korrigiert
- Ideen-Workflow: IDEA INTAKE PROTOCOL in kani-master.md — 5 Schritte (Folder + CLAUDE.md + _INDEX.md + Supabase)
- Shutdown-Sequenz: POST /api/kani/session-end Endpoint + ShutdownDialog mit echtem API-Polling
- kani-master.md: SESSION START PROTOCOL + LAUNCH PROTOCOL auf W1 aktualisiert
- Go Live: dev → main gemergt + Vercel Production Deploy ausgelöst

**Letzter Commit:** d040216 (branch: main + dev)

---

## Next Steps

1. Supabase Daten einpflegen: Projekte, Agenten, Skills — RESET-KIT.md als Vorlage (P1)
2. Vercel Production URL verifizieren — live check auf Vercel Dashboard

---

## Offene Entscheidungen

keine

---

## Technischer Stand

- **URL lokal:** localhost:5173 (dev, via launchd)
- **URL Produktion:** Vercel Production Deploy am Laufen (main branch, Commit d040216)
- **Branch:** dev (main ist auf Stand von dev)
- **Supabase:** Verbunden — 14 Workflows + 4 Todos live
- **launchd:** aktiv (com.mckay.mission-control.plist), Logs: /tmp/mission-control.log
- **RESET-KIT:** ~/mckay-os/docs/RESET-KIT.md (alle Test-Daten gesichert)
