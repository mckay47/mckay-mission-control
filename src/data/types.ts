export type ProjectPhase = 'Phase 0' | 'Phase 1' | 'Phase 2' | 'Phase 3' | 'Live';
export type ProjectHealth = 'healthy' | 'attention' | 'risk' | 'critical';
export type SkillCategory = 'core' | 'project-types' | 'domains' | 'integrations';
export type AgentType = 'core' | 'specialist';
export type PipelineStage = 'idea' | 'research' | 'strategy' | 'confirmed' | 'building' | 'live';
export type MCPStatus = 'connected' | 'disconnected' | 'error';

export interface Project {
  id: string;
  name: string;
  description: string;
  domain: string;
  phase: ProjectPhase;
  health: ProjectHealth;
  url?: string;
  deployUrl?: string;
  techStack: string[];
  skills: string[];
  roles: string[];
  stats: { label: string; value: string | number }[];
  businessModel: string;
  marketSize?: string;
  timeline: TimelineEntry[];
}

export interface Skill {
  name: string;
  category: SkillCategory;
  status: 'active' | 'inactive' | 'archived';
  purpose: string;
  activateWhen?: string;
}

export interface Agent {
  name: string;
  type: AgentType;
  status: 'active' | 'inactive';
  purpose: string;
  triggers: string;
}

export interface MCPServer {
  name: string;
  status: MCPStatus;
  tools: number;
  description: string;
}

export interface PipelineIdea {
  id: string;
  name: string;
  description: string;
  stage: PipelineStage;
  type: string;
  features?: string[];
}

export interface Command {
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

export interface Hook {
  name: string;
  event: string;
  purpose: string;
}

export interface KPI {
  label: string;
  value: string | number;
  change?: string;
  color: 'cyan' | 'green' | 'orange' | 'pink' | 'purple';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  time: string;
  action?: string;
}

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export interface Priority {
  id: string;
  text: string;
  project?: string;
  impact: 'high' | 'medium' | 'low';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'kani';
  text: string;
  time: string;
}

export interface TimelineEntry {
  date: string;
  title: string;
  description: string;
}

export interface MemoryEntry {
  id: string;
  key: string;
  value: string;
}

export interface FolderNode {
  name: string;
  type: 'file' | 'folder';
  children?: FolderNode[];
}
