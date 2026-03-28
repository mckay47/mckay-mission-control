import type { Agent } from '../types';

export const agents: Agent[] = [
  { name: 'kani-master', type: 'core', status: 'active', purpose: 'Primary orchestrator — synthesizes agent outputs, manages context, drives decisions', triggers: 'Always loaded' },
  { name: 'launch-agent', type: 'core', status: 'active', purpose: 'Executes the full Launch Protocol — from raw idea to live project', triggers: '/launch command' },
  { name: 'build-agent', type: 'core', status: 'active', purpose: 'Implements features, writes code, runs builds, fixes bugs', triggers: 'Any build or feature task' },
  { name: 'ops-agent', type: 'core', status: 'active', purpose: 'Monitors active projects — performance, errors, uptime, cost tracking', triggers: 'Ongoing project operations' },
  { name: 'research-agent', type: 'specialist', status: 'active', purpose: 'Market research, competitor analysis, opportunity sizing', triggers: 'New project launch or strategic decision' },
  { name: 'sales-agent', type: 'specialist', status: 'active', purpose: 'Marketing strategy, funnel design, content automation', triggers: 'Go-to-market or sales work' },
  { name: 'strategy-agent', type: 'specialist', status: 'active', purpose: 'Business strategy, roadmap planning, prioritization', triggers: 'Strategic decisions, planning sessions' },
  { name: 'life-agent', type: 'specialist', status: 'active', purpose: 'Personal task management, scheduling, life organization', triggers: 'Personal requests' },
];
