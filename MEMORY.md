# Mission Control — Project Memory
> Ebene 1: Pro-Projekt Memory · Updated: 2026-04-09
> Wird bei jedem Session-Ende von KANI aktualisiert.

---

## Letzte Session: 2026-04-09 Spaetschicht (Session A: Hub)

**Was gebaut wurde:**
- Hub Rebuild: 8 Kategorien statt 3 (Kalender, Todos, E-Mail Uebersicht + 5 Postfach-Gruppen)
- Google Calendar API: OAuth2 Setup, Refresh Token, /api/calendar/events Endpoint, useCalendarEvents Hook
- Kalender UI: Heute (Zeitstrahl), Woche (7-Tage Grid), Monat (Kalender-Grid mit Punkt-Indikatoren)
- Non-Projekt Todos CRUD: hubTodos in MissionControlProvider, addTodo/setStatus/deleteTodo mit project_id=null
- E-Mail Postfaecher: 20 Konten in 5 Gruppen (Persoenlich, Stillzentrum, Hebammenbuero, MCKAY.AGENCY, Hebammen.Agency)
- categories.ts: Neue Datei fuer Category-Daten (sicher vor Auto-Generation)
- Office/Life/Network Imports auf categories.ts umgestellt

**Learnings:**
- data.ts wird von scripts/generate-data.mjs ueberschrieben — manuelle Daten muessen in separate Datei (categories.ts)
- Google Calendar: Testnutzer muss explizit im OAuth Consent Screen hinzugefuegt werden, sonst 403

---

## Next Steps — Roadmap zu Live

**Session A:** ✅ Hub fertig (Google Calendar, Todos CRUD, E-Mail 20 Konten)
**Session B:** Office ausbauen (Buchhaltung Upload, Subscriptions, Vertraege, Kunden)
**Session C:** Life ausbauen (Wohnung, Familie, Gesundheit, Private Todos)
**Session D:** Network ausbauen (Kontakte, Events, Portale, Partner, Opportunities)
**Session E:** Final Review + Go Live (alle Bereiche durchgehen, Action Buttons finalisieren, dev→main)

7 von 9 Bereichen sind live-ready. Office/Life/Network brauchen noch echten Inhalt.

---

## Bekannte Issues

- Terminal Startup: 5-15s bei Kaltstart (normal, kein Bug)
- Feierabend/Shutdown-Sequenz dauert ~60-80s bei Kaltstart (Claude laedt Kontext)
- Google Calendar: Refresh Token kann ablaufen — dann OAuth Playground erneut durchlaufen

---

## Technischer Stand

- **URL lokal:** localhost:5173 (dev, via launchd)
- **Branch:** dev
- **Supabase:** 17+ Tabellen, Realtime aktiv
- **launchd:** aktiv (com.mckay.mission-control.plist)
- **Google Calendar:** OAuth2 via Refresh Token, GCP Projekt "MCKAY Mission Control"
- **Cockpit:** 9 Tiles (Projects, Thinktank, System, Office, Life, Hub, Network, Briefing, Kitchen)
- **Hub:** 8 Kategorien (Kalender, Todos, E-Mail Uebersicht + 5 Postfach-Gruppen)
- **Category-Daten:** categories.ts (sicher vor Auto-Generation), nicht data.ts
- **Hub-Todos:** project_id=null in Supabase todos, hubTodos im Context
- **E-Mail:** 20 Konten in 5 Gruppen, statisch, MCP-Server fuer Strato IMAP ausstehend
