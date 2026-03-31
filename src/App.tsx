import { useState } from 'react'
import Boot from './components/Boot'
import Nav from './components/Nav'
import Cockpit from './components/screens/Cockpit'
import System from './components/screens/System'
import Projects from './components/screens/Projects'
import Finance from './components/screens/Finance'
import Agents from './components/screens/Agents'
import Thinktank from './components/screens/Thinktank'
import Todos from './components/screens/Todos'
import Briefing from './components/screens/Briefing'
import Office from './components/screens/Office'
import Productivity from './components/screens/Productivity'
import Memory from './components/screens/Memory'

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
          {mode === 'system' && <System />}
          {mode === 'projects' && <Projects />}
          {mode === 'finance' && <Finance />}
          {mode === 'agents' && <Agents />}
          {mode === 'thinktank' && <Thinktank />}
          {mode === 'todos' && <Todos />}
          {mode === 'briefing' && <Briefing />}
          {mode === 'office' && <Office />}
          {mode === 'productivity' && <Productivity />}
          {mode === 'memory' && <Memory />}
        </div>
      </div>
    </div>
  )
}
