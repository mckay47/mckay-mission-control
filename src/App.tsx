import { useState, useCallback, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Boot from './components/Boot'
import ShutdownDialog from './components/ShutdownDialog'
import { MissionControlProvider } from './lib/MissionControlProvider.tsx'
import { useKaniStream } from './hooks/useKaniStream.ts'
import { ZoneProvider } from './components/ZoneProvider'
import { ToastProvider } from './components/ui/Toast'

// V3 Ghost UI Pages
import { Cockpit } from './components/pages/Cockpit'
import { Projects } from './components/pages/Projects'
import { Thinktank } from './components/pages/Thinktank'
import { IdeaDetail } from './components/pages/IdeaDetail'
import { ProjectDetail } from './components/pages/ProjectDetail'
import { System } from './components/pages/System'
import { Office } from './components/pages/Office'
import { Life } from './components/pages/Life'
import { Hub } from './components/pages/Hub'
import { Network } from './components/pages/Network'
import { Briefing } from './components/pages/Briefing'

// System Detail Pages
import { AgentDetail } from './components/pages/system/AgentDetail'
import { WorkflowDetail } from './components/pages/system/WorkflowDetail'
import { SecurityDetail } from './components/pages/system/SecurityDetail'
import { DepartmentDetail } from './components/pages/system/DepartmentDetail'
import { SystemAgents } from './components/pages/system/SystemAgents'
import { SystemWorkflows } from './components/pages/system/SystemWorkflows'
import { SystemSecurity } from './components/pages/system/SystemSecurity'
import { SystemDepartments } from './components/pages/system/SystemDepartments'
import { SystemMcps } from './components/pages/system/SystemMcps'
import { SystemPerformance } from './components/pages/system/SystemPerformance'

// Standalone windows
import { StandaloneTerminal } from './components/pages/StandaloneTerminal'
import { TerminalGrid } from './components/pages/TerminalGrid'

export default function App() {
  const [booted, setBooted] = useState(() => sessionStorage.getItem('mckay-booted') === '1')
  const [shutdownOpen, setShutdownOpen] = useState(false)
  const kaniStream = useKaniStream({ cwd: '~/mckay-os', terminalId: 'cockpit' })

  // Init dark mode on mount
  useEffect(() => {
    document.body.classList.add('dark')
    document.documentElement.setAttribute('data-theme', 'dark')
  }, [])

  // Listen for shutdown event dispatched by Header power button
  useEffect(() => {
    const handler = () => setShutdownOpen(true)
    document.addEventListener('open-shutdown', handler)
    return () => document.removeEventListener('open-shutdown', handler)
  }, [])

  const toggleTheme = useCallback(() => {
    document.body.classList.toggle('dark')
    const isDark = document.body.classList.contains('dark')
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [])

  const handleShutdown = useCallback(() => {
    sessionStorage.removeItem('mckay-booted')
    setShutdownOpen(false)
    setTimeout(() => setBooted(false), 200)
  }, [])

  if (!booted) return <Boot onComplete={() => { sessionStorage.setItem('mckay-booted', '1'); sessionStorage.setItem('mckay-launching', '1'); setBooted(true) }} />

  return (
    <ZoneProvider>
    <ToastProvider>
    <MissionControlProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Cockpit toggleTheme={toggleTheme} kaniStream={kaniStream} />} />
          <Route path="/projects" element={<Projects toggleTheme={toggleTheme} />} />
          <Route path="/project/:id" element={<ProjectDetail toggleTheme={toggleTheme} />} />
          <Route path="/thinktank" element={<Thinktank toggleTheme={toggleTheme} />} />
          <Route path="/idea/:id" element={<IdeaDetail toggleTheme={toggleTheme} />} />
          <Route path="/system" element={<System toggleTheme={toggleTheme} />} />
          <Route path="/office" element={<Office toggleTheme={toggleTheme} />} />
          <Route path="/life" element={<Life toggleTheme={toggleTheme} />} />
          <Route path="/hub" element={<Hub toggleTheme={toggleTheme} />} />
          <Route path="/network" element={<Network toggleTheme={toggleTheme} />} />
          <Route path="/briefing" element={<Briefing toggleTheme={toggleTheme} />} />

          {/* System Detail Pages */}
          <Route path="/system/agents" element={<SystemAgents toggleTheme={toggleTheme} />} />
          <Route path="/system/agents/:id" element={<AgentDetail toggleTheme={toggleTheme} />} />
          <Route path="/system/workflows" element={<SystemWorkflows toggleTheme={toggleTheme} />} />
          <Route path="/system/workflows/:id" element={<WorkflowDetail toggleTheme={toggleTheme} />} />
          <Route path="/system/security" element={<SystemSecurity toggleTheme={toggleTheme} />} />
          <Route path="/system/security/:id" element={<SecurityDetail toggleTheme={toggleTheme} />} />
          <Route path="/system/departments" element={<SystemDepartments toggleTheme={toggleTheme} />} />
          <Route path="/system/departments/:id" element={<DepartmentDetail toggleTheme={toggleTheme} />} />
          <Route path="/system/mcps" element={<SystemMcps toggleTheme={toggleTheme} />} />
          <Route path="/system/performance" element={<SystemPerformance toggleTheme={toggleTheme} />} />

          {/* Standalone windows */}
          <Route path="/project/:id/terminal" element={<StandaloneTerminal type="project" />} />
          <Route path="/idea/:id/terminal" element={<StandaloneTerminal type="idea" />} />
          <Route path="/terminals" element={<TerminalGrid />} />
        </Routes>

        <ShutdownDialog
          open={shutdownOpen}
          onClose={() => setShutdownOpen(false)}
          onShutdown={handleShutdown}
        />
      </BrowserRouter>
    </MissionControlProvider>
    </ToastProvider>
    </ZoneProvider>
  )
}
