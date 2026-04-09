import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from './supabase.ts'
import type { Project, Idea, Agent, Skill, Department, PersonalArea, NetworkEntry, TickerItemData, Notification, LaunchSession, Todo } from './types.ts'
import type { PipelineMilestone } from '../components/shared/Pipeline.tsx'
import { Shield, ShieldCheck, ShieldAlert, Power, Activity, CheckCircle, Clock, Zap, TrendingUp } from 'lucide-react'

// ============================================================
// Types for system pages (previously inline in components)
// ============================================================

export interface Workflow {
  id: string
  name: string
  desc: string
  status: 'active' | 'idle' | 'config'
  color: string
  glow: string
  steps: { title: string; desc: string }[]
  pipeline: PipelineMilestone[]
  config: { key: string; value: string }[]
  history: { time: string; text: string }[]
}

export interface McpServer {
  id: string
  name: string
  desc: string
  status: 'connected' | 'idle' | 'error'
  color: string
  glow: string
  tools: string[]
  config: { key: string; value: string }[]
  stats: { label: string; value: string; color?: string }[]
}

export interface SecurityFeature {
  id: string
  name: string
  desc: string
  status: 'active' | 'standby' | 'critical'
  color: string
  glow: string
  icon: React.ComponentType<{ size?: number; stroke?: string }>
  config: { key: string; value: string }[]
  logs: { time: string; text: string; level: 'info' | 'warn' | 'error' }[]
  alerts: { text: string; severity: 'low' | 'medium' | 'high' }[]
}

export interface PerfKpi {
  id: string
  label: string
  value: string
  desc: string
  color: string
  glow: string
  icon: React.ComponentType<{ size?: number; stroke?: string }>
  trend: string
  details: { label: string; value: string; color?: string }[]
}

// ============================================================
// Icon map (string → component)
// ============================================================

const iconMap: Record<string, React.ComponentType<{ size?: number; stroke?: string }>> = {
  Shield, ShieldCheck, ShieldAlert, Power,
  Activity, CheckCircle, Clock, Zap, TrendingUp,
}

// ============================================================
// Pure function — no data dependency
// ============================================================

export function getIdeaPipeline(status: string, color: string, glow: string): PipelineMilestone[] {
  const stages = ['Erfasst', 'Research', 'Bereit', '→ Projekt']
  const stageStatus: Record<string, number> = { new: 0, research: 1, scored: 2, promoted: 3, parked: -1 }
  const activeIdx = stageStatus[status] ?? 0

  const items: string[][] = [
    ['Idee angelegt', 'Tags gesetzt'],
    ['Marktanalyse', 'Wettbewerber', 'Tech-Stack'],
    ['Score finalisieren'],
    ['Projekt anlegen'],
  ]

  return stages.map((title, i) => ({
    title: i < activeIdx ? `${title} ✓` : i === activeIdx ? `${title} → aktiv` : title,
    status: (i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'upcoming') as 'done' | 'active' | 'upcoming',
    color,
    glow,
    items: items[i],
  }))
}

// ============================================================
// Context value type
// ============================================================

interface MissionControlContextValue {
  loading: boolean

  // Core entities
  projects: Project[]
  ideas: Idea[]
  agents: Agent[]
  skills: Skill[]
  departments: Department[]
  personalAreas: PersonalArea[]
  networkEntries: NetworkEntry[]

  // Ticker
  tickerData: Record<string, TickerItemData[]>
  projectTickerData: Record<string, TickerItemData[]>

  // Project detail maps
  projectPipelines: Record<string, PipelineMilestone[]>
  projectTodos: Record<string, { id: string; title: string; priority: 'P1' | 'P2' | 'P3'; duration: string; status: 'open' | 'in-progress' | 'done'; description: string; agent: string; project_id: string }[]>
  projectIdeas: Record<string, { title: string; score: number; description: string }[]>
  projectFeed: Record<string, { time: string; type: 'success' | 'info' | 'warning' | 'error'; text: string }[]>
  projectAgentStatus: Record<string, { name: string; status: 'active' | 'waiting' | 'idle'; task: string; since: string }[]>
  projectLastUpdate: Record<string, string>
  projectNextMilestone: Record<string, string>
  projectContext: Record<string, { goal: string; challenge: string; audience: string; notDoing: string; architecture: string; documents: string[] }>
  projectDocuments: Record<string, { title: string; status: 'done' | 'in-progress' | 'planned'; scope: string }[]>
  projectSuggestions: Record<string, { title: string; description: string; prompt: string }[]>

  // Pipeline maps
  departmentPipelines: Record<string, PipelineMilestone[]>
  personalPipelines: Record<string, PipelineMilestone[]>
  networkPipelines: Record<string, PipelineMilestone[]>

  // Idea detail maps
  getIdeaPipeline: (status: string, color: string, glow: string) => PipelineMilestone[]
  ideaFeedback: Record<string, { problem: string; audience: string; market: string; recommendation: string }>
  ideaResearch: Record<string, { status: 'running' | 'done' | 'not-started'; summary?: string; feasibility?: string; visibility?: string }>
  ideaLastUpdate: Record<string, string>

  // System pages (previously inline)
  workflows: Workflow[]
  mcpServers: McpServer[]
  securityFeatures: SecurityFeature[]
  perfKpis: PerfKpi[]

  // Phase 2: Notifications + Launch
  notifications: Notification[]
  launchSessions: LaunchSession[]

  // Hub
  hubTodos: { id: string; title: string; priority: 'P1' | 'P2' | 'P3'; duration: string; status: 'open' | 'in-progress' | 'done'; description: string; due: string }[]
}

// ============================================================
// Empty defaults
// ============================================================

const emptyContext: MissionControlContextValue = {
  loading: true,
  projects: [], ideas: [], agents: [], skills: [],
  departments: [], personalAreas: [], networkEntries: [],
  tickerData: {},
  projectTickerData: {},
  projectPipelines: {}, projectTodos: {}, projectIdeas: {},
  projectFeed: {}, projectAgentStatus: {},
  projectLastUpdate: {}, projectNextMilestone: {},
  projectContext: {}, projectDocuments: {}, projectSuggestions: {},
  departmentPipelines: {}, personalPipelines: {}, networkPipelines: {},
  getIdeaPipeline,
  ideaFeedback: {}, ideaResearch: {}, ideaLastUpdate: {},
  workflows: [], mcpServers: [], securityFeatures: [], perfKpis: [],
  notifications: [], launchSessions: [],
  hubTodos: [],
}

const MissionControlContext = createContext<MissionControlContextValue>(emptyContext)

// ============================================================
// Transform helpers (DB row → TypeScript interface)
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformProject(row: any): Project {
  return {
    id: row.id,
    name: row.name,
    color: row.color ?? 'var(--tx3)',
    glow: row.glow ?? 'rgba(255,255,255,0.04)',
    emoji: row.emoji,
    description: row.description,
    progress: row.progress,
    phase: row.phase,
    health: row.health,
    colorBg: row.color_bg,
    stack: row.stack,
    domain: row.domain,
    todos: row.todos,
    ideas: row.ideas,
    lastAction: row.last_action,
    nextStep: row.next_step,
    agent: row.agent,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformIdea(row: any): Idea {
  return {
    id: row.id,
    n: row.n || row.name || row.title || '',
    cat: row.cat || row.category || '',
    st: row.st || row.status || 'Neu',
    date: row.date || '',
    txt: row.txt || row.description || '',
    f: row.f ?? 0,
    pot: row.pot ?? 0,
    c: row.c ?? 3,
    spd: row.spd ?? 3,
    r: row.r ?? 2,
    res: row.res || '',
    rec: row.rec || '',
    col: row.col || row.color || 'var(--bl)',
    raw: row.raw,
    structured: row.structured,
    feedback: row.feedback,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformDepartment(row: any): Department {
  return {
    id: row.id,
    name: row.name,
    color: row.color ?? 'var(--tx3)',
    glow: row.glow ?? 'rgba(255,255,255,0.04)',
    description: row.description,
    colorBg: row.color_bg,
    tasks: row.tasks,
    badge: row.badge,
    kpis: row.kpis,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformPersonalArea(row: any): PersonalArea {
  return {
    id: row.id,
    name: row.name,
    color: row.color ?? 'var(--tx3)',
    glow: row.glow ?? 'rgba(255,255,255,0.04)',
    description: row.description,
    colorBg: row.color_bg,
    badge: row.badge,
    items: row.items,
    info: row.info,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformNetworkEntry(row: any): NetworkEntry {
  return {
    id: row.id,
    name: row.name,
    color: row.color ?? 'var(--tx3)',
    glow: row.glow ?? 'rgba(255,255,255,0.04)',
    description: row.description,
    colorBg: row.color_bg,
    badge: row.badge,
    kpis: row.kpis,
    type: row.type,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformWorkflow(row: any): Workflow {
  return {
    id: row.id,
    name: row.name,
    desc: row.description,
    status: row.status,
    color: row.color,
    glow: row.glow,
    steps: row.steps,
    pipeline: row.pipeline,
    config: row.config,
    history: row.history,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformMcpServer(row: any): McpServer {
  return {
    id: row.id,
    name: row.name,
    desc: row.description,
    status: row.status,
    color: row.color,
    glow: row.glow,
    tools: row.tools,
    config: row.config,
    stats: row.stats,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformSecurityFeature(row: any): SecurityFeature {
  return {
    id: row.id,
    name: row.name,
    desc: row.description,
    status: row.status,
    color: row.color,
    glow: row.glow,
    icon: iconMap[row.icon] || Shield,
    config: row.config,
    logs: row.logs,
    alerts: row.alerts,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformPerfKpi(row: any): PerfKpi {
  return {
    id: row.id,
    label: row.label,
    value: row.value,
    desc: row.description,
    color: row.color,
    glow: row.glow,
    icon: iconMap[row.icon] || Activity,
    trend: row.trend,
    details: row.details,
  }
}

// ============================================================
// Provider component
// ============================================================

export function MissionControlProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<MissionControlContextValue>(emptyContext)

  useEffect(() => {
    let mounted = true

    async function fetchAll() {
      const [
        { data: projectRows },
        { data: ideaRows },
        { data: todoRows },
        { data: projectIdeaRows },
        { data: agentRows },
        { data: skillRows },
        { data: workflowRows },
        { data: departmentRows },
        { data: personalRows },
        { data: networkRows },
        { data: mcpRows },
        { data: securityRows },
        { data: kpiRows },
        { data: tickerRows },
        { data: notifRows },
        { data: launchRows },
        { data: activityRows },
      ] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('ideas').select('*').order('score', { ascending: false }),
        supabase.from('todos').select('*').order('sort_order'),
        supabase.from('project_ideas').select('*').order('sort_order'),
        supabase.from('agents').select('*'),
        supabase.from('skills').select('*'),
        supabase.from('workflows').select('*'),
        supabase.from('departments').select('*'),
        supabase.from('personal_areas').select('*'),
        supabase.from('network_entries').select('*'),
        supabase.from('mcp_servers').select('*'),
        supabase.from('security_features').select('*'),
        supabase.from('performance_kpis').select('*'),
        supabase.from('ticker_items').select('*').order('sort_order'),
        supabase.from('notifications').select('*').eq('dismissed', false).order('created_at', { ascending: false }).limit(50),
        supabase.from('launch_sessions').select('*').in('status', ['describe','research','brief','review']).order('created_at', { ascending: false }),
        supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(20),
      ])

      if (!mounted) return

      // Transform projects + extract JSONB maps
      const projects = (projectRows || []).map(transformProject)
      const projectPipelines: Record<string, PipelineMilestone[]> = {}
      const projectDocuments: Record<string, { title: string; status: 'done' | 'in-progress' | 'planned'; scope: string }[]> = {}
      const projectContext: Record<string, { goal: string; challenge: string; audience: string; notDoing: string; architecture: string; documents: string[] }> = {}
      const projectSuggestions: Record<string, { title: string; description: string; prompt: string }[]> = {}
      const projectFeed: Record<string, { time: string; type: 'success' | 'info' | 'warning' | 'error'; text: string }[]> = {}
      const projectAgentStatus: Record<string, { name: string; status: 'active' | 'waiting' | 'idle'; task: string; since: string }[]> = {}
      const projectLastUpdate: Record<string, string> = {}
      const projectNextMilestone: Record<string, string> = {}

      for (const row of projectRows || []) {
        projectPipelines[row.id] = row.pipeline || []
        projectDocuments[row.id] = row.documents || []
        projectContext[row.id] = row.context || {}
        projectSuggestions[row.id] = row.suggestions || []
        projectFeed[row.id] = row.feed || []
        projectAgentStatus[row.id] = row.agent_status || []
        projectLastUpdate[row.id] = row.last_update || ''
        projectNextMilestone[row.id] = row.next_milestone || ''
      }

      // Group todos by project_id + collect hub todos (no project)
      const projectTodos: Record<string, { id: string; title: string; priority: 'P1' | 'P2' | 'P3'; duration: string; status: 'open' | 'in-progress' | 'done'; description: string; agent: string; project_id: string }[]> = {}
      const hubTodos: { id: string; title: string; priority: 'P1' | 'P2' | 'P3'; duration: string; status: 'open' | 'in-progress' | 'done'; description: string; due: string }[] = []
      for (const row of todoRows || []) {
        const pid = row.project_id
        if (!pid) {
          hubTodos.push({
            id: row.id,
            title: row.title,
            priority: row.priority || 'P2',
            duration: row.duration || '',
            status: row.status || 'open',
            description: row.description || '',
            due: row.due || '',
          })
          continue
        }
        if (!projectTodos[pid]) projectTodos[pid] = []
        projectTodos[pid].push({
          id: row.id,
          title: row.title,
          priority: row.priority,
          duration: row.duration || '',
          status: row.status,
          description: row.description || '',
          agent: row.agent || '',
          project_id: pid,
        })
      }

      // Group project_ideas by project_id
      const projectIdeas: Record<string, { title: string; score: number; description: string }[]> = {}
      for (const row of projectIdeaRows || []) {
        const pid = row.project_id
        if (!projectIdeas[pid]) projectIdeas[pid] = []
        projectIdeas[pid].push({
          title: row.title,
          score: row.score,
          description: row.description,
        })
      }

      // Transform ideas + extract JSONB maps
      const ideas = (ideaRows || []).map(transformIdea)
      const ideaFeedback: Record<string, { problem: string; audience: string; market: string; recommendation: string }> = {}
      const ideaResearch: Record<string, { status: 'running' | 'done' | 'not-started'; summary?: string; feasibility?: string; visibility?: string }> = {}
      const ideaLastUpdate: Record<string, string> = {}

      for (const row of ideaRows || []) {
        if (row.feedback && Object.keys(row.feedback).length > 0) ideaFeedback[row.id] = row.feedback
        if (row.research && Object.keys(row.research).length > 0) ideaResearch[row.id] = row.research
        if (row.last_update) ideaLastUpdate[row.id] = row.last_update
      }

      // Transform departments + extract pipeline
      const departments = (departmentRows || []).map(transformDepartment)
      const departmentPipelines: Record<string, PipelineMilestone[]> = {}
      for (const row of departmentRows || []) {
        if (row.pipeline?.length > 0) departmentPipelines[row.id] = row.pipeline
      }

      // Transform personal areas + extract pipeline
      const personalAreas = (personalRows || []).map(transformPersonalArea)
      const personalPipelines: Record<string, PipelineMilestone[]> = {}
      for (const row of personalRows || []) {
        if (row.pipeline?.length > 0) personalPipelines[row.id] = row.pipeline
      }

      // Transform network entries + extract pipeline
      const networkEntries = (networkRows || []).map(transformNetworkEntry)
      const networkPipelines: Record<string, PipelineMilestone[]> = {}
      for (const row of networkRows || []) {
        if (row.pipeline?.length > 0) networkPipelines[row.id] = row.pipeline
      }

      // Group ticker items by page
      const tickerData: Record<string, TickerItemData[]> = {}
      for (const row of tickerRows || []) {
        if (!tickerData[row.page]) tickerData[row.page] = []
        tickerData[row.page].push({
          color: row.color ?? '',
          label: row.label ?? '',
          labelColor: row.label_color ?? '',
          text: row.text ?? '',
        })
      }

      // Flat transforms
      const agents: Agent[] = (agentRows || []).map(r => ({
        name: r.name, emoji: r.emoji, type: r.type, status: r.status,
        model: r.model, purpose: r.purpose, color: r.color ?? 'var(--tx3)',
      }))
      const skills: Skill[] = (skillRows || []).map(r => ({
        name: r.name, category: r.category, status: r.status, purpose: r.purpose,
      }))
      const workflows = (workflowRows || []).map(transformWorkflow)
      const mcpServers = (mcpRows || []).map(transformMcpServer)
      const securityFeatures = (securityRows || []).map(transformSecurityFeature)
      const perfKpis = (kpiRows || []).map(transformPerfKpi)

      // Phase 2: Notifications + Launch Sessions (no transform needed — 1:1 from Supabase)
      const notifications: Notification[] = (notifRows || []).map((r) => ({
        id: r.id, typ: r.typ, title: r.title, subtitle: r.subtitle ?? '',
        source: r.source ?? '', project_id: r.project_id, idea_id: r.idea_id,
        terminal_id: r.terminal_id, is_read: r.is_read ?? false,
        dismissed: r.dismissed ?? false, metadata: r.metadata ?? {},
        created_at: r.created_at,
      }))
      const launchSessions: LaunchSession[] = (launchRows || []).map((r) => ({
        id: r.id, idea_id: r.idea_id, status: r.status, name: r.name ?? '',
        description: r.description ?? '', research_output: r.research_output ?? {},
        strategy_brief: r.strategy_brief ?? {}, project_id: r.project_id,
        error: r.error, created_at: r.created_at, updated_at: r.updated_at,
      }))

      // Compute project ticker from activity_log + feed + notifications
      const projectTickerData: Record<string, TickerItemData[]> = {}
      const activityColorMap: Record<string, string> = { prompt: 'var(--bl)', session_end: 'var(--g)', error: 'var(--r)' }
      const notifColorMap: Record<string, string> = { wichtig: 'var(--r)', sofort: 'var(--o)', info: 'var(--bl)', review: 'var(--p)' }
      const feedColorMap: Record<string, string> = { success: 'var(--g)', info: 'var(--bl)', warning: 'var(--a)', error: 'var(--r)' }

      for (const p of projects) {
        const items: TickerItemData[] = []
        // From activity_log
        for (const row of activityRows || []) {
          if (row.project_id === p.id) {
            items.push({ color: activityColorMap[row.type] || 'var(--bl)', label: row.type || 'KANI', labelColor: activityColorMap[row.type] || 'var(--bl)', text: (row.text || '').substring(0, 80) })
          }
        }
        // From project feed JSONB
        for (const f of projectFeed[p.id] || []) {
          items.push({ color: feedColorMap[f.type] || 'var(--bl)', label: f.type, labelColor: feedColorMap[f.type] || 'var(--bl)', text: f.text })
        }
        // From notifications
        for (const n of notifications) {
          if (n.project_id === p.id) {
            items.push({ color: notifColorMap[n.typ] || 'var(--bl)', label: n.typ, labelColor: notifColorMap[n.typ] || 'var(--bl)', text: n.title })
          }
        }
        if (items.length > 0) projectTickerData[p.id] = items.slice(0, 10)
      }

      setData({
        loading: false,
        projects, ideas, agents, skills,
        departments, personalAreas, networkEntries,
        tickerData, projectTickerData,
        projectPipelines, projectTodos, projectIdeas,
        projectFeed, projectAgentStatus,
        projectLastUpdate, projectNextMilestone,
        projectContext, projectDocuments, projectSuggestions,
        departmentPipelines, personalPipelines, networkPipelines,
        getIdeaPipeline,
        ideaFeedback, ideaResearch, ideaLastUpdate,
        workflows, mcpServers, securityFeatures, perfKpis,
        notifications, launchSessions,
        hubTodos,
      })
    }

    fetchAll()

    // ============================================================
    // Realtime subscriptions
    // ============================================================

    const channel = supabase
      .channel('mission-control')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => fetchAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ideas' }, () => fetchAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, () => fetchAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workflows' }, () => fetchAll())
      // activity_log excluded — audit log, not state — would re-fetch all 14 tables on every KANI prompt
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, () => fetchAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ticker_items' }, () => fetchAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => fetchAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'launch_sessions' }, () => fetchAll())
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <MissionControlContext.Provider value={data}>
      {children}
    </MissionControlContext.Provider>
  )
}

// ============================================================
// Hook
// ============================================================

export function useMissionControl() {
  return useContext(MissionControlContext)
}
