import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Terminal } from '../shared/Terminal.tsx'
import { useMissionControl } from '../../lib/MissionControlProvider.tsx'

interface Props { type: 'project' | 'idea' }

export function StandaloneTerminal({ type }: Props) {
  const { projects, ideas } = useMissionControl()
  const { id } = useParams<{ id: string }>()
  const [input, setInput] = useState('')

  if (type === 'project') {
    const project = projects.find(p => p.id === id)
    if (!project) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0c', color: '#6a6a74', fontFamily: "'JetBrains Mono', monospace" }}>Projekt nicht gefunden</div>

    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', padding: 12 }}>
        <Terminal
          title={`Claude Code · ~/mckay-os/projects/${project.id}`}
          statusLabel={project.health === 'active' ? 'Running' : project.health === 'blocked' ? 'Blocked' : 'Idle'}
          statusColor={project.color}
          statusGlow={project.glow}
          placeholder={`mckay.os/kani → ${project.id} ...`}
          mode="live"
          cwd={`~/mckay-os/projects/${id}`}
          terminalId={`project:${id}`}
          inputValue={input}
          onInputChange={setInput}
          onClearInput={() => setInput('')}
          onSend={() => setInput('')}
        />
      </div>
    )
  }

  // Idea terminal
  const idea = ideas.find(i => i.id === id)
  if (!idea) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0c', color: '#6a6a74', fontFamily: "'JetBrains Mono', monospace" }}>Idee nicht gefunden</div>

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', padding: 12 }}>
      <Terminal
        title={`Claude Code · ~/mckay-os/ideas/${idea.id}`}
        statusLabel="Research"
        statusColor={idea.color}
        statusGlow={idea.glow}
        placeholder={`mckay.os/kani → ${idea.id} ...`}
        mode="live"
        cwd={`~/mckay-os/ideas/${id}`}
        terminalId={`idea:${id}`}
        inputValue={input}
        onInputChange={setInput}
        onClearInput={() => setInput('')}
        onSend={() => setInput('')}
      />
    </div>
  )
}
