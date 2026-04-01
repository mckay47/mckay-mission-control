import { useState, useCallback, useEffect } from 'react'
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
import { ToastProvider } from './components/Toast'
import NotificationPanel from './components/NotificationPanel'
import TodoModal from './components/TodoModal'
import ThoughtModal from './components/ThoughtModal'
import ProjectOverlay from './components/ProjectOverlay'
import type { Project } from './lib/types'

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
  const [showNotifications, setShowNotifications] = useState(false)
  const [showTodoModal, setShowTodoModal] = useState(false)
  const [showThoughtModal, setShowThoughtModal] = useState(false)
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  const toggleNotifications = useCallback(() => setShowNotifications(v => !v), [])
  const openTodoModal = useCallback(() => setShowTodoModal(true), [])
  const closeTodoModal = useCallback(() => setShowTodoModal(false), [])
  const openThoughtModal = useCallback(() => setShowThoughtModal(true), [])
  const closeThoughtModal = useCallback(() => setShowThoughtModal(false), [])
  const openProject = useCallback((p: Project) => setActiveProject(p), [])
  const closeProject = useCallback(() => setActiveProject(null), [])

  // Click outside notification panel to close
  useEffect(() => {
    if (!showNotifications) return
    function handleClick(e: MouseEvent) {
      const panel = document.getElementById('npanel')
      const target = e.target as HTMLElement
      if (panel && !panel.contains(target) && !target.closest('.nbtn')) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [showNotifications])

  if (!booted) {
    return (
      <ToastProvider>
        <Boot onComplete={() => setBooted(true)} />
      </ToastProvider>
    )
  }

  const gridClass = GRID_CLASS[mode] || 'gc'

  return (
    <ToastProvider>
      <div id="dash" className="show" style={{ display: 'flex', flexDirection: 'column', position: 'fixed', inset: 0 }}>
        <Nav
          currentMode={mode}
          onModeChange={setMode}
          onToggleNotifications={toggleNotifications}
        />
        <div className="gwrap">
          <div className={`grid ${gridClass}`} key={mode}>
            {mode === 'cockpit' && (
              <Cockpit
                onModeChange={setMode}
                onToggleNotifications={toggleNotifications}
                onOpenTodoModal={openTodoModal}
                onOpenThoughtModal={openThoughtModal}
              />
            )}
            {mode === 'system' && <System />}
            {mode === 'projects' && (
              <Projects
                onOpenProject={openProject}
                onOpenTodoModal={openTodoModal}
              />
            )}
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

      {/* Notification Panel */}
      <NotificationPanel
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Modals */}
      <TodoModal open={showTodoModal} onClose={closeTodoModal} />
      <ThoughtModal open={showThoughtModal} onClose={closeThoughtModal} />

      {/* Project Overlay */}
      {activeProject && (
        <ProjectOverlay
          project={activeProject}
          onClose={closeProject}
          onOpenTodoModal={openTodoModal}
          onOpenThoughtModal={openThoughtModal}
        />
      )}
    </ToastProvider>
  )
}
