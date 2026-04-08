---
type: project-todos
project: "mission-control"
updated: 2026-04-08
---

## Active

### Go Live Preparation
- [ ] **P0** scaffold-project Skill: CLAUDE.md-Generierung + repo_path bei GitHub-Repo-Erstellung automatisieren (W1 Step 7)
- [ ] **P0** Ideen-Workflow: ideas/{id}/ Verzeichnis + CLAUDE.md automatisch erstellen wenn KANI neue Idee anlegt
- [ ] **P0** Shutdown-Sequenz: /api/kani/session-end Endpoint + Shutdown-Dialog triggert alle aktiven Terminals (MEMORY.md, TODOS.md, git commit+push)
- [ ] **P0** Branch dev → main mergen, Vercel Production Deploy
- [ ] **P0** Supabase: echte Projekt-Daten einpflegen (RESET-KIT.md als Vorlage)

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
