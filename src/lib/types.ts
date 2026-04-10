// ============================================================
// MCKAY OS Mission Control — Canonical Types
// Source of truth: MissionControlProvider.tsx transforms
// Updated: 2026-04-08 — unified to Supabase field names
// ============================================================

export interface Project {
  id: string
  name: string
  color: string
  glow: string
  emoji?: string
  description?: string
  progress?: number
  phase?: string
  health?: string
  colorBg?: string
  stack?: string
  domain?: string
  todos?: number
  ideas?: number
  lastAction?: string
  nextStep?: string
  agent?: string
}

export interface Agent {
  name: string
  color: string
  emoji?: string
  type?: string
  status?: string
  model?: string
  purpose?: string
}

export interface Skill {
  name: string
  category?: string
  status?: string
  purpose?: string
}

export interface BadgeData {
  label: string
  bg: string
  color: string
}

export interface KpiData {
  value: string
  label: string
  color?: string
}

export interface Idea {
  id: string
  // Supabase fields (preferred)
  title?: string
  description?: string
  status?: string
  category?: string
  score?: number
  color?: string
  glow?: string
  last_update?: string
  feedback?: Record<string, unknown>
  research?: Record<string, unknown>
  // Legacy fields (data.ts fallback)
  n?: string
  cat?: string
  st?: string
  date?: string
  txt?: string
  f?: number
  pot?: number
  c?: number
  spd?: number
  r?: number
  res?: string
  rec?: string
  col?: string
  raw?: string
  structured?: string
}

export interface IdeaFeedback {
  branche?: string
  markt?: string
  innovation?: number
  highlights?: string
  problem?: string
  nutzen?: string
}

export interface Todo {
  id: string | number
  title?: string
  txt?: string
  project_id?: string
  proj?: string
  priority?: string
  prio?: string
  duration?: string
  status?: string
  description?: string
  agent?: string
  due?: string
  done?: boolean
  ov?: boolean
}

export interface Department {
  id: string
  name: string
  color: string
  glow: string
  description?: string
  colorBg?: string
  tasks?: number
  badge?: BadgeData
  kpis?: KpiData[]
}

export interface PersonalArea {
  id: string
  name: string
  color: string
  glow: string
  description?: string
  colorBg?: string
  badge?: BadgeData
  items?: string[]
  info?: string
}

export interface NetworkEntry {
  id: string
  name: string
  color: string
  glow: string
  description?: string
  colorBg?: string
  badge?: BadgeData
  kpis?: KpiData[]
  type?: string
}

export interface TickerItemData {
  color: string
  label: string
  labelColor: string
  text: string
}

export interface Notification {
  id: string
  typ: 'wichtig' | 'sofort' | 'info' | 'review'
  title: string
  subtitle: string
  source: string
  project_id?: string
  idea_id?: string
  terminal_id?: string
  is_read: boolean
  dismissed: boolean
  metadata: Record<string, unknown>
  created_at: string
}

export interface LaunchSession {
  id: string
  idea_id?: string
  status: 'describe' | 'research' | 'brief' | 'review' | 'confirmed' | 'rejected' | 'created'
  name: string
  description: string
  research_output: Record<string, unknown>
  strategy_brief: Record<string, unknown>
  project_id?: string
  error?: string
  created_at: string
  updated_at: string
}

export interface CalendarEntry {
  t?: string
  n?: string
  s?: string
  today?: boolean
}

export interface CalendarEvent {
  id: string
  title: string
  start: string    // ISO datetime
  end: string      // ISO datetime
  allDay: boolean
  calendar?: string // calendar name/color
  calendarId?: string
  calendarColor?: string
  location?: string
  description?: string
}

export interface CalendarInfo {
  id: string
  name: string
  backgroundColor: string
  foregroundColor: string
  primary: boolean
  accessRole: string
  selected: boolean
}

export interface EmailAccount {
  email: string
  provider: 'gmail' | 'strato' | 'custom'
  unread?: number   // placeholder, later via MCP
}

export interface EmailGroup {
  id: string
  name: string
  color: string
  glow: string
  emoji: string
  badge: string
  desc: string
  accounts: EmailAccount[]
  stats: { label: string; value: string }[]
}

// ============================================================
// Email Triage — KANI AI Classification
// ============================================================

export type EmailCategory = 'info' | 'action' | 'spam' | 'invoice'
export type EmailUrgency = 'low' | 'medium' | 'high'
export type SuggestedAction = 'note' | 'reply' | 'todo' | 'delete' | 'archive' | 'file_invoice'

export interface EmailEnvelope {
  uid: number
  messageId: string
  from: { name: string; address: string }
  to: { name: string; address: string }[]
  subject: string
  date: string
  snippet: string
  seen: boolean
}

export interface EmailTriage {
  category: EmailCategory
  summary: string
  urgency: EmailUrgency
  suggested_action: SuggestedAction
  draft_reply?: string
  todo_text?: string
  sender_context?: { name: string; role: string; relationship: string }
}

export interface TriagedEmail {
  envelope: EmailEnvelope
  triage: EmailTriage
  account: string
  groupId: string
}

export interface EmailFullBody {
  uid: number
  account: string
  subject: string
  from: { name: string; address: string }
  date: string
  textPlain: string
  textHtml: string
}

export interface TriageStats {
  total: number
  info: number
  action: number
  spam: number
  invoice: number
  pending: number
}

export interface MemoryFile {
  ico?: string
  n?: string
  m?: string
  b?: string
}
