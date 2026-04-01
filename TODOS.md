---
type: project-todos
project: "mission-control"
updated: 2026-04-01
---

## Active

### Phase 0: Mockup Build
- [ ] **P0** Scaffold project (Vite + Tailwind + react-router-dom + lucide-react + fonts)
- [ ] **P0** Implement design system tokens (colors, typography, glow effects, glassmorphism, animations)
- [ ] **P0** Build 18 UI components (GlassCard, KPICard, GaugeChart, GlowNumber, GlowBadge, StatusDot, ProgressBar, ActionButton, PipelineColumn, TimelineItem, SkillCard, AgentCard, ServerStatusCard, NotificationItem, ChecklistItem, ThemeToggle, CommandInput, InlineEditor)
- [ ] **P0** Build 4 Layout components (Shell, Sidebar, TopBar, PageContainer)
- [ ] **P0** Create dummy data files from real MCKAY OS sources (REGISTRY.md, CLAUDE.md files, MEMORY.md, settings.json)
- [ ] **P0** Build 11 Display widgets (ProjectCard, GlobalKPIBar, PriorityList, NotificationCenter, QuickActions, SkillInventory, AgentMap, MCPHealthGrid, PipelineBoard, FolderTree, ProjectTimeline)
- [ ] **P0** Build 8 Workspace widgets (ChatPanel, ComposePanel, MemoryViewer, LaunchWizard, TodoEditor, NoteEditor, TerminalManager, ProjectActions)
- [ ] **P0** Layer 1: Command Center page (/) -- projects, KPIs, priorities, notifications, quick actions, todo, terminal manager
- [ ] **P0** Layer 2: Project Dashboard page (/project/:id) -- drill-down with KPIs, ChatPanel, MEMORY editor, skills, timeline (x3 projects)
- [ ] **P0** Layer 3: System Dashboard page (/system) -- 16 skills, 8 agents, 5 MCP servers, hooks, folder tree
- [ ] **P0** Layer 4: Ideas Pipeline page (/pipeline) -- kanban board + LaunchWizard
- [ ] **P0** Layer 5: Personal page (/personal) -- todo, compose, notes (visual mockup)
- [ ] **P0** Dark/Light mode toggle with toned-down neon for light mode
- [ ] **P0** Deploy to Vercel
- [ ] **P0** Verification checklist passed (all 5 layers functional, all widgets interactive)

### Open Questions (Need Mehti Input)
- [ ] **P1** Logo: use text "MCKAY" or design a logo mark?
- [ ] **P1** Confirm project accent colors: Cyan = Hebammenbuero, Pink = Stillprobleme, Orange = TennisCoach?

### Future Phases
- [ ] **P1** Phase 1: Real data via filesystem parsers (read CLAUDE.md, MEMORY.md, REGISTRY.md live)
- [ ] **P2** Phase 2: Terminal integration, live notifications, real-time project health
- [ ] **P3** Phase 3: Personal modules (todo sync, email compose, calendar integration)

## Done

- [x] Full architecture plan created (5 layers, 41 components, design system defined)
- [x] CLAUDE.md with complete project specification
- [x] MEMORY.md initialized
- [x] Workflow-to-button mapping verified against multi-terminal briefing (zero gaps)
- [x] Project scaffolded in MCKAY OS (Vite + TypeScript + Tailwind configured)

## Blocked

- **Phase 0 build** -- not technically blocked, ready to start. Waiting for Mehti to prioritize (open new terminal and begin build)
- **Logo decision** -- text "MCKAY" vs. designed logo mark needs Mehti's creative direction
- **Project accent colors** -- proposed mapping needs Mehti confirmation before implementing
