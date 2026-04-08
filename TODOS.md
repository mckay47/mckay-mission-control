---
type: project-todos
project: "mission-control"
updated: 2026-04-08
---

## Active

### Phase 3: Personal Modules
- [ ] **P1** Todo-Widget funktional machen (persistent, schreibt in Dateien)
- [ ] **P2** Kalender — Google Calendar Anbindung
- [ ] **P2** Notizen — persistent in ~/mckay-os/notes/
- [ ] **P3** E-Mail — Resend-Integration

### Cleanup
- [ ] **P2** Agent Status mit echten Daten befüllen (aktuell Dummy)
- [ ] **P2** Bottom Ticker mit echten Daten statt Dummy

## Done

- [x] Full architecture plan (5 layers, 41 components, design system)
- [x] Scaffold (Vite + TypeScript + Tailwind + react-router-dom + lucide-react)
- [x] Design system tokens (dark #0a0a0c, neon accents, glassmorphism, glow effects)
- [x] All 18 UI components built
- [x] All 4 Layout components (Shell, Sidebar, TopBar, PageContainer)
- [x] All 11 Display widgets + All 8 Workspace widgets
- [x] All 5 Layers (Command Center, Project Dashboard, System Dashboard, Pipeline, Personal)
- [x] Dark/Light mode toggle
- [x] Real data via generate-data.mjs (reads REGISTRY.md, ideas/, todos/)
- [x] Live KANI Terminal (Vite plugin, streamed responses)
- [x] Multi-turn KANI sessions (--continue flag, per-terminal session state)
- [x] Ghost UI V3 (Boot animation, Zone/Matrix Stempeluhr, Light/Dark polish)
- [x] Zone/Matrix Stempeluhr (global, persistent, idle-popup after 5min)
- [x] SIGNALS.md Bridge (project terminals → sync/SIGNALS.md → Cockpit KANI)
- [x] generate-project-claude-md.mjs (auto-context in all 14 project CLAUDE.md files)
- [x] launchd auto-start at login (com.mckay.mission-control.plist)
- [x] Deployed to Vercel (dev branch)
- [x] scaffold-project Skill aktualisiert (2026-04-08)
- [x] Ideen-Workflow: IDEA INTAKE PROTOCOL (2026-04-08)
- [x] Supabase Datenmigration: 14 Workflows + 4 Todos (2026-04-08)
- [x] Shutdown-Sequenz: POST /api/kani/session-end + ShutdownDialog (2026-04-08)
- [x] Go Live: dev → main, Vercel Production Deploy (2026-04-08)
- [x] Phase 2: Live Notifications (Supabase Realtime, Dismiss, Auto-Notifications) (2026-04-08)
- [x] Phase 2: LaunchWizard (5-Step: Describe → Research → Brief → Review → Created) (2026-04-08)
- [x] Phase 2: Session Persistence (Server Buffer + Disk Log + Reconnect) (2026-04-08)
- [x] Phase 2: Feierabend-Button pro Projekt (2026-04-08)
- [x] Phase 2: Auto-Sync TODOS.md → Supabase (2026-04-08)
- [x] Phase 2: Auto-Feed — Live Feed aus Terminal-Aktivität (2026-04-08)
- [x] TypeScript null-safety Fixes (10+ Komponenten) (2026-04-08)
- [x] RLS Policies für anon-Zugriff auf alle Tabellen (2026-04-08)
