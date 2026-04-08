---
type: project-todos
project: "mission-control"
updated: 2026-04-08
---

## Active

### Post Go Live
- [ ] **P1** Supabase Daten einpflegen: Projekte, Agenten, Skills — RESET-KIT.md als Vorlage

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
- [x] scaffold-project Skill: TODOS.md + DECISIONS.md + REGISTRY.md Format + W1 Referenz aktualisiert (2026-04-08)
- [x] Ideen-Workflow: IDEA INTAKE PROTOCOL in kani-master.md — ideas/{id}/ + CLAUDE.md + _INDEX.md + Supabase automatisch (2026-04-08)
- [x] Supabase Datenmigration: 14 Workflows (W1-W14) + 4 echte Todos ersetzt (2026-04-08)
- [x] Shutdown-Sequenz: POST /api/kani/session-end + ShutdownDialog mit realem Polling (2026-04-08)
- [x] Go Live: dev → main gepusht, Vercel Production Deploy läuft (2026-04-08)
