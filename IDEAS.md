---
type: project-ideas
project: "mission-control"
updated: 2026-04-01
---

## Ideas

### I-001: CEO Dashboard SaaS Productization
- **Status:** new
- **Description:** Once Mission Control is mature, consider productizing it as a "CEO Dashboard for Serial Entrepreneurs" -- a multi-project command center SaaS. Target: founders running 3-10 projects simultaneously who need operational visibility without switching between 20 tools
- **Source:** Natural extension of building for Mehti's own needs

### I-002: Live Terminal Integration
- **Status:** prompted
- **Description:** Phase 2 feature: embed actual terminal sessions (Claude Code) directly into the ChatPanel widget. Start, monitor, and control agent sessions from within Mission Control. No more switching between terminal windows
- **Source:** Architecture plan Phase 2

### I-003: Real-Time Project Health Monitoring
- **Status:** prompted
- **Description:** Phase 1-2 feature: filesystem watchers that detect changes in project CLAUDE.md, MEMORY.md, and TODOS.md files. Auto-update dashboard KPIs (completion %, active tasks, last session date). Push notifications when a project goes stale (no session in 7+ days)
- **Source:** Architecture plan Phase 1-2

### I-004: Voice Command Input
- **Status:** new
- **Description:** Add voice input to the CommandInput widget. Mehti speaks a command ("launch new project gastro-pilot") and KANI processes it. Useful when hands are busy or during calls
- **Source:** Natural evolution of command center UX

### I-005: Mobile Companion App
- **Status:** new
- **Description:** Lightweight mobile version of Layer 1 (Command Center) showing project health, priority tasks, and notifications. Quick glance at operations while away from desk. Push notifications for critical alerts
- **Source:** CEO operational need -- Mehti is not always at his desk

### I-006: Client Presentation Mode
- **Status:** new
- **Description:** A special view mode that shows a clean, impressive version of the dashboard for client meetings and investor presentations. Hides internal notes and sensitive data, emphasizes KPIs and progress visuals. Uses the MCKAY COMMAND design system at its most impressive
- **Source:** CI impact -- design system is the MCKAY.AGENCY brand

### I-007: Daily Briefing Auto-Generator
- **Status:** prompted
- **Description:** Automated /brief command that generates a daily summary from all project MEMORY.md files, TODOS.md priorities, and session logs. Delivered as a formatted card on the Command Center at session start. Saves the first 5 minutes of every work day
- **Source:** ops-agent briefing workflow

### I-008: Module Registry for Extensibility
- **Status:** prompted
- **Description:** Architecture supports a module registry pattern -- new widgets and data sources can be added without modifying core layout. Third-party or custom widgets register themselves and appear in the appropriate layer
- **Source:** Architecture plan (extensibility pattern)
