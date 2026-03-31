import { useState } from 'react'
import Boot from './components/Boot'
import Nav from './components/Nav'
import Cockpit from './components/screens/Cockpit'

const GRID_CLASS: Record<string, string> = {
  cockpit: 'gc',
  system: 'g-sys',
  projects: 'g-proj',
  finance: 'g-fin',
  agents: 'g-ag',
  thinktank: 'g-tt',
  todos: 'g-td',
  briefing: 'g-br',
  office: 'g-of',
  productivity: 'g-pd',
  memory: 'g-mm',
}

export default function App() {
  const [booted, setBooted] = useState(false)
  const [mode, setMode] = useState('cockpit')

  if (!booted) return <Boot onComplete={() => setBooted(true)} />

  const gridClass = GRID_CLASS[mode] || 'gc'

  return (
    <div id="dash" className="show" style={{ display: 'flex', flexDirection: 'column', position: 'fixed', inset: 0 }}>
      <Nav currentMode={mode} onModeChange={setMode} />
      <div className="gwrap">
        <div className={`grid ${gridClass}`} key={mode}>
          {mode === 'cockpit' && <Cockpit onModeChange={setMode} />}
          {mode === 'system' && <PlaceholderScreen label="System" />}
          {mode === 'projects' && <PlaceholderScreen label="Projekte" />}
          {mode === 'finance' && <PlaceholderScreen label="Finanzen" />}
          {mode === 'agents' && <PlaceholderScreen label="Agents" />}
          {mode === 'thinktank' && <PlaceholderScreen label="Thinktank" />}
          {mode === 'todos' && <PlaceholderScreen label="Todos" />}
          {mode === 'briefing' && <PlaceholderScreen label="Briefing" />}
          {mode === 'office' && <PlaceholderScreen label="Office" />}
          {mode === 'productivity' && <PlaceholderScreen label="Stats" />}
          {mode === 'memory' && <PlaceholderScreen label="Memory" />}
        </div>
      </div>
    </div>
  )
}

function PlaceholderScreen({ label }: { label: string }) {
  return (
    <div className="card" style={{ gridColumn: '1/-1', gridRow: '1/-1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--fh)', fontSize: 32, fontWeight: 700, color: 'var(--c)', marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: 13, color: 'var(--t3)' }}>Screen wird in Phase 2 gebaut</div>
      </div>
    </div>
  )
}
