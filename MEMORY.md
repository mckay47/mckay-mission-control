# Mission Control — Project Memory
> Ebene 1: Pro-Projekt Memory · Updated: 2026-04-09
> Wird bei jedem Session-Ende von KANI aktualisiert.

---

## Letzte Session: 2026-04-09 Spaetschicht

**Was gebaut wurde:**
- Hub Rebuild: 8 Kategorien (Kalender, Todos, E-Mail Uebersicht + 5 Postfach-Gruppen)
- Google Calendar API: OAuth2 Setup, /api/calendar/events, useCalendarEvents Hook, 3 Views (Heute/Woche/Monat)
- Non-Projekt Todos CRUD: hubTodos (project_id=null), Add/Check/Delete
- E-Mail IMAP Integration: 17/20 Konten live via imapflow, /api/email/unread Endpoint, 5-Min Cache
- 20 Konten in 5 Gruppen mit echten Unread-Counts im Hub
- categories.ts: Eigene Datei fuer Category-Daten (sicher vor Auto-Generation)

**Commits (branch: dev):** 28982b7, 4cfed29

**Learnings:**
- data.ts wird von generate-data.mjs ueberschrieben — manuelle Daten in categories.ts
- Google OAuth: Testnutzer muss im Consent Screen stehen, sonst 403
- Strato Umlaut-Domains brauchen Punycode (xn--hebammenbro-1hb.de)
- Gmail App-Passwoerter brauchen 2FA — 3 Konten ohne 2FA uebersprungen
- Credentials NIE im Chat — immer via nano direkt in Datei

---

## Next Steps

**Naechste Session:** Mehtis Vision fuer E-Mail + Kalender Funktionen im Hub (Preview, Aktionen, etc.)
**Session B:** Office ausbauen
**Session C:** Life ausbauen
**Session D:** Network ausbauen
**Session E:** Final Review + Go Live

7 von 9 Bereichen live-ready. Hub ist jetzt mit echten Daten ausgestattet.

---

## Bekannte Issues

- Gmail: 3 Konten ohne 2FA (mckaykay0711, cryptomkay, Stillzentrum.ulm) — uebersprungen
- IMAP Polling: 17 parallele Verbindungen alle 5 Min — bei Strato kein Problem bisher
- Google Calendar Refresh Token kann ablaufen — OAuth Playground erneut durchlaufen

---

## Technischer Stand

- **Branch:** dev (2 neue Commits)
- **Google Calendar:** OAuth2, GCP "MCKAY Mission Control", useCalendarEvents Hook
- **IMAP:** imapflow, .email-credentials.json (gitignored), /api/email/unread + /api/email/refresh
- **Hub:** 8 Kategorien, echte Calendar Events, echte Unread-Counts, Todo CRUD
- **Category-Daten:** categories.ts (nicht data.ts)
- **Hub-Todos:** project_id=null in Supabase, hubTodos im Context
- **Verbundene Konten:** 17/20 (14 Strato + 2 Punycode-Fix + 1 Gmail App-PW)
