import { useState, useEffect } from 'react'
import { Terminal } from '../shared/Terminal.tsx'
import { useMissionControl } from '../../lib/MissionControlProvider.tsx'
import { openOrFocus } from '../../lib/windowManager'

export function TerminalGrid() {
  const { projects } = useMissionControl()
  const activeProjects = projects.filter(p => p.health === 'active' || p.health === 'live')
  const [inputs, setInputs] = useState<Record<string, string>>({})

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') window.close()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (activeProjects.length === 0) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070708', color: '#6a6a74', fontFamily: "'JetBrains Mono', monospace" }}>
        Keine aktiven Terminals
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#070708', padding: 8, display: 'flex', flexDirection: 'column' }}>
      {/* Minimal header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', flexShrink: 0 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: '#6a6a74', letterSpacing: 2 }}>
          ALLE TERMINALS — {activeProjects.length} aktiv
        </div>
        <div
          onClick={() => window.close()}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#6a6a74', cursor: 'pointer', padding: '4px 12px', borderRadius: 6 }}
        >
          ESC zum Schliessen
        </div>
      </div>

      {/* Terminal grid */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${activeProjects.length <= 2 ? '600px' : activeProjects.length <= 4 ? '500px' : '400px'}, 1fr))`,
        gap: 8,
        minHeight: 0,
        overflow: 'hidden',
      }}>
        {activeProjects.map(p => (
            <div
              key={p.id}
              style={{ display: 'flex', flexDirection: 'column', minHeight: 0, cursor: 'pointer' }}
              onClick={() => openOrFocus(`/project/${p.id}/terminal`, 'width=1440,height=900,menubar=no,toolbar=no')}
            >
              <Terminal
                title={`${p.name} · ~/projects/${p.id}`}
                statusLabel={p.health === 'active' ? 'Running' : p.health === 'live' ? 'Live' : 'Idle'}
                statusColor={p.color}
                statusGlow={p.glow}
                placeholder={`${p.id} → ...`}
                mode="live"
                cwd={`~/mckay-os/projects/${p.id}`}
                terminalId={`project:${p.id}`}
                inputValue={inputs[p.id] || ''}
                onInputChange={(v) => setInputs(prev => ({ ...prev, [p.id]: v }))}
                onClearInput={() => setInputs(prev => ({ ...prev, [p.id]: '' }))}
                onSend={() => setInputs(prev => ({ ...prev, [p.id]: '' }))}
              />
            </div>
          ))}
      </div>
    </div>
  )
}
