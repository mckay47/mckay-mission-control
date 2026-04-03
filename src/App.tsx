import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Boot from './components/Boot'
import Cockpit from './components/pages/Cockpit'
import ProjectDetail from './components/pages/ProjectDetail'
import Thinktank from './components/pages/Thinktank'
import IdeaDetail from './components/pages/IdeaDetail'
import Agents from './components/pages/Agents'
import AgentDetail from './components/pages/AgentDetail'
import Backoffice from './components/pages/Backoffice'
import TermineTodos from './components/pages/TermineTodos'
import Private from './components/pages/Private'
import Briefing from './components/pages/Briefing'

export default function App() {
  const [booted, setBooted] = useState(false)

  if (!booted) return <Boot onComplete={() => setBooted(true)} />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cockpit />} />
        <Route path="/projekte/:id" element={<ProjectDetail />} />
        <Route path="/thinktank" element={<Thinktank />} />
        <Route path="/thinktank/:id" element={<IdeaDetail />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/agents/:id" element={<AgentDetail />} />
        <Route path="/backoffice" element={<Backoffice />} />
        <Route path="/termine-todos" element={<TermineTodos />} />
        <Route path="/private" element={<Private />} />
        <Route path="/briefing" element={<Briefing />} />
      </Routes>
    </BrowserRouter>
  )
}
