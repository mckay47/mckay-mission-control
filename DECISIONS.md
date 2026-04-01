---
type: project-decisions
project: "mission-control"
updated: 2026-04-01
---

## Decisions

### D-001: React + Vite (Not Next.js)
- **Date:** 2026-03-28
- **Decision:** Use standard DNA.md stack (React + Vite + TailwindCSS) instead of Next.js
- **Reason:** No SEO needed -- this is a personal internal tool accessed via login. Simpler build, faster dev cycles, consistent with DNA.md standard
- **Alternatives:** Next.js (overkill for internal tool), Astro, SvelteKit
- **Impact:** Standard Vite dev experience. react-router-dom for routing. No server-side rendering complexity

### D-002: Sci-Fi Command Center Aesthetic
- **Date:** 2026-03-28
- **Decision:** Dark mode primary (#0A0A0F base), neon accents (cyan #00F0FF, orange #FF6B2C, pink #FF2DAA, green #00FF88, purple #8B5CF6), glassmorphism effects, radial gauges, glow shadows
- **Reason:** Inspired by SpaceX Mission Control aesthetics. Mehti's vision for how a CEO dashboard should feel -- powerful, futuristic, data-rich. Design references provided in ~/Downloads/
- **Alternatives:** Clean minimal (boring for daily use), corporate blue (generic), Material Design (off-the-shelf)
- **Impact:** Defines the entire MCKAY.AGENCY corporate identity. All future presentations, materials, and branding derive from this design system

### D-003: Design System as Corporate Identity
- **Date:** 2026-03-28
- **Decision:** The "MCKAY COMMAND" design system built for Mission Control becomes the MCKAY.AGENCY CI
- **Reason:** Single investment in design that pays off across all business contexts -- presentations, pitch decks, website, client materials
- **Alternatives:** Separate CI design process (duplicated effort)
- **Impact:** Typography (Space Grotesk + JetBrains Mono), color system, glassmorphism effects, and glow patterns become the brand standard

### D-004: 5-Layer Architecture
- **Date:** 2026-03-28
- **Decision:** Five distinct pages/layers: Command Center (/), Project Dashboard (/project/:id), System Dashboard (/system), Ideas Pipeline (/pipeline), Personal (/personal)
- **Reason:** Each layer serves a different operational need. Command Center for daily overview, Project for drill-down, System for technical health, Pipeline for new ideas, Personal for private tasks
- **Alternatives:** Single-page dashboard (too cluttered), tab-based (loses spatial mental model)
- **Impact:** 5 routes with distinct layouts. Each layer has its own widget composition

### D-005: All Dummy Data from Real MCKAY OS
- **Date:** 2026-03-28
- **Decision:** No Lorem ipsum. All dummy data sourced from real MCKAY OS files (REGISTRY.md, project CLAUDE.md files, MEMORY.md, settings.json)
- **Reason:** Dashboard must feel real from day one. Mehti needs to validate the UX with actual data, not placeholders. Easier to transition to live data in Phase 1
- **Alternatives:** Generic placeholder data (would not validate real workflow)
- **Impact:** Data extraction from 7 source files. 3 projects, 16 skills, 8 agents, 5 MCP servers, 9 pipeline ideas, 7 commands, 2 hooks

### D-006: 41 Components (18 UI + 4 Layout + 11 Display + 8 Workspace)
- **Date:** 2026-03-28
- **Decision:** Build a comprehensive component library of 41 total components covering all UI primitives, layout shells, display widgets, and workspace panels
- **Reason:** The dashboard is complex and data-rich. Reusable components ensure visual consistency and make Phase 1+ data integration straightforward
- **Alternatives:** Fewer components with more inline styling (harder to maintain)
- **Impact:** Significant upfront build effort in Phase 0. Payoff in consistency and maintainability

### D-007: Phase 0 = All Interactive, No Backend
- **Date:** 2026-03-28
- **Decision:** Phase 0 mockup uses local TypeScript state only. No Supabase, no API calls, no real-time data. All interactions work with dummy data
- **Reason:** Focus on UX validation before investing in backend infrastructure. Match the mockup-first approach from DNA.md
- **Alternatives:** Build with real filesystem parsers from start (premature optimization)
- **Impact:** Clean separation between UI and data. Phase 1 adds filesystem parsers, Phase 2 adds live terminal integration

### D-008: Project Accent Colors
- **Date:** 2026-03-28
- **Decision:** Each project gets a unique neon accent color for visual identification: Cyan = Hebammenbuero, Pink = Stillprobleme, Orange = TennisCoach Pro (to be confirmed by Mehti)
- **Reason:** Quick visual differentiation when switching between project dashboards. Consistent with the neon accent color system
- **Alternatives:** Same color for all projects (loses quick identification)
- **Impact:** Project cards, KPI bars, and drill-down pages styled with project accent color. Needs Mehti confirmation
