# Mission Control — Project Memory
> Ebene 1: Pro-Projekt Memory · Updated: 2026-04-10
> Wird bei jedem Session-Ende von KANI aktualisiert.

---

## Letzte Session: 2026-04-10 (Kurz — kein Build)

**Was gebaut wurde:**

Keine Build-Aktivität. Kurze Session — nur Verbindungstest + auto-generierte Datei-Updates (CLAUDE.md Timestamps, data.ts Todo-Count).

**Letzter Build-Stand (2026-04-09 Spätschicht):**
- Hub Rebuild: 8 Kategorien, Google Calendar OAuth2, IMAP 17/20 Konten, Todo CRUD
- Commits: 28982b7, 4cfed29, 91fa9bc

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
