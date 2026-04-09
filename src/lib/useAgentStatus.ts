import { useState, useEffect } from 'react'
import type { Agent } from './types.ts'

interface AgentStatusItem {
  name: string
  status: 'active' | 'waiting' | 'idle'
  task: string
  since: string
}

interface ActiveTerminal {
  terminalId: string
  cwd: string
  runningFor: number
}

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  return `${h}h ${m % 60}m`
}

export function useAgentStatus(projectId: string, agents: Agent[]): AgentStatusItem[] {
  const [activeTerminals, setActiveTerminals] = useState<ActiveTerminal[]>([])

  useEffect(() => {
    let mounted = true

    async function poll() {
      try {
        const res = await fetch('/api/kani/status')
        if (res.ok) {
          const data = await res.json()
          if (mounted) setActiveTerminals(data.activeTerminals || [])
        }
      } catch { /* */ }
    }

    poll()
    const interval = setInterval(poll, 10000)
    return () => { mounted = false; clearInterval(interval) }
  }, [projectId])

  // Check if this project has an active terminal
  const projectTerminal = activeTerminals.find(t => t.terminalId === `project:${projectId}`)

  // Build agent status list from agents table + live process data
  const coreAgents = agents.filter(a => a.type === 'core' || !a.type)
  const result: AgentStatusItem[] = []

  for (const agent of coreAgents) {
    const isKani = agent.name.toLowerCase().includes('kani')
    const isBuild = agent.name.toLowerCase().includes('build')
    const isOps = agent.name.toLowerCase().includes('ops')
    const isLaunch = agent.name.toLowerCase().includes('launch')

    let status: 'active' | 'waiting' | 'idle' = 'idle'
    let task = agent.purpose || ''
    let since = ''

    if (projectTerminal) {
      if (isBuild || isKani) {
        status = 'active'
        task = 'KANI Session aktiv'
        since = formatDuration(projectTerminal.runningFor)
      } else if (isOps) {
        status = 'waiting'
        task = 'Monitoring'
        since = ''
      }
    } else {
      if (isOps && agent.status === 'active') {
        status = 'waiting'
        task = 'Standby'
      }
    }

    if (isLaunch) {
      status = 'idle'
      task = 'Bereit'
    }

    result.push({ name: agent.name, status, task, since })
  }

  return result
}
