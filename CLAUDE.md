# MCKAY OS Mission Control — Project CLAUDE.md
> MCKAY OS Project | Owner: Mehti Kaymaz | Created: 2026-03-28

---

## 1. Project Overview

**Product:** CEO Operations Center — multi-layered command center dashboard for managing all MCKAY.AGENCY projects, agents, skills, and daily workflow from a single visual interface.

**Type:** Internal Tool (personal use by Mehti)

**Design Direction:** Sci-Fi Command Center — dark mode primary, neon accents (cyan/orange/pink), glassmorphism, radial gauges, glow effects. Inspired by SpaceX Mission Control aesthetics. Design references: ~/Downloads/MCKAY-Dashboard-idea.2 and .3

**CI Impact:** This design system becomes the MCKAY.AGENCY corporate identity.

**Current Status:** Phase 0 — Mockup with dummy data

**Project Path:** `~/mckay-os/projects/mission-control/`
**Plan File:** `~/.claude/plans/vast-churning-taco.md`

---

## 2. Architecture — 5 Layers

| Layer | Route | Purpose |
|---|---|---|
| 1 | `/` | Command Center — projects, KPIs, priorities, notifications, quick actions, todo, terminal manager |
| 2 | `/project/:id` | Project Dashboard — drill-down with KPIs, ChatPanel, MEMORY editor, skills, timeline |
| 3 | `/system` | System Dashboard — 16 skills, 8 agents, 5 MCP servers, hooks, folder tree |
| 4 | `/pipeline` | Ideas Pipeline — kanban board + LaunchWizard |
| 5 | `/personal` | Personal — todo, compose, notes (Phase 0: visual mockup) |

---

## 3. Design System — "MCKAY COMMAND"

### Colors
```
Dark Mode (primary):
  Background:  #0A0A0F
  Elevated:    #0F0F18
  Surface:     #14142B
  Glass BG:    rgba(255, 255, 255, 0.03)
  Glass Border: rgba(255, 255, 255, 0.08)

Neon Accents:
  Cyan:    #00F0FF (primary accent, KPIs, selected)
  Orange:  #FF6B2C (warning, urgency, attention)
  Pink:    #FF2DAA (highlights, active)
  Green:   #00FF88 (success, healthy, live)
  Purple:  #8B5CF6 (system, agents)
  Yellow:  #FFD600 (caution, pending)

Status:
  Healthy:   #00FF88
  Attention: #FFD600
  Risk:      #FF6B2C
  Critical:  #FF2D55

Light Mode (secondary):
  Background:  #F5F5FA
  Elevated:    #FFFFFF
  Neon toned down: cyan→#0891B2, orange→#EA580C, etc.
```

### Typography
```
Headings + Body: Space Grotesk (300-700)
Numbers + Data:  JetBrains Mono (400-600), font-variant-numeric: tabular-nums
```

### Effects
- Glow shadows: `0 0 20px rgba(color, 0.3), 0 0 60px rgba(color, 0.1)`
- Glassmorphism: `backdrop-blur-[12px]` + transparent border
- Pulsing StatusDots for live states
- Animated gauge arcs (CSS animation)

---

## 4. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TailwindCSS |
| Routing | react-router-dom |
| Icons | lucide-react |
| Fonts | Google Fonts (Space Grotesk + JetBrains Mono) |
| Hosting | Vercel |

No backend in Phase 0. All dummy data from TypeScript files.

---

## 5. Component Library (41 total)

### UI Components (18)
GlassCard, KPICard, GaugeChart, GlowNumber, GlowBadge, StatusDot, ProgressBar, ActionButton, PipelineColumn, TimelineItem, SkillCard, AgentCard, ServerStatusCard, NotificationItem, ChecklistItem, ThemeToggle, CommandInput, InlineEditor

### Layout (4)
Shell, Sidebar, TopBar, PageContainer

### Widgets — Display (11)
ProjectCard, GlobalKPIBar, PriorityList, NotificationCenter, QuickActions, SkillInventory, AgentMap, MCPHealthGrid, PipelineBoard, FolderTree, ProjectTimeline

### Widgets — Workspaces (8)
ChatPanel (terminal embed), ComposePanel (email), MemoryViewer (editable), LaunchWizard (multi-step), TodoEditor (add/check/delete), NoteEditor (markdown), TerminalManager, ProjectActions

---

## 6. Dummy Data Sources

| Data | Source File |
|---|---|
| Projects (3) | ~/mckay-os/MEMORY.md + project CLAUDE.md files |
| Skills (16) | ~/mckay-os/REGISTRY.md |
| Agents (8) | ~/mckay-os/REGISTRY.md |
| MCP Servers (5) | ~/.claude/settings.json |
| Pipeline Ideas (9) | Auto Memory: project_ideas_pipeline.md + project_portfolio.md |
| Commands (7) | ~/mckay-os/REGISTRY.md |
| Hooks (2) | ~/.claude/settings.json |

No Lorem ipsum. All real MCKAY OS data.

---

## 7. Active Skills for This Project

```
core/code-quality                 -- clean code standards
core/deploy                       -- Vercel deployment
integrations/react-best-practices -- React performance, a11y
integrations/ui-design            -- design system, components, patterns
```

---

## 8. Build Status

### Phase 0: Mockup
- [ ] Scaffold (Vite + Tailwind + router + icons)
- [ ] Design system (tokens, theme, animations)
- [ ] 18 UI components
- [ ] 4 Layout components
- [ ] Dummy data (from real MCKAY OS)
- [ ] 11 Display widgets
- [ ] 8 Workspace widgets
- [ ] Layer 1: Command Center
- [ ] Layer 2: Project Dashboard (×3)
- [ ] Layer 3: System Dashboard
- [ ] Layer 4: Pipeline + LaunchWizard
- [ ] Layer 5: Personal (visual mockup)
- [ ] Dark/Light mode
- [ ] Deploy to Vercel
- [ ] Verification checklist passed

### Future Phases
- Phase 1: Real data (filesystem parsers)
- Phase 2: Terminal integration, live notifications
- Phase 3: Personal modules (todo, email, calendar)

---

*Read the full architecture plan at ~/.claude/plans/vast-churning-taco.md*
