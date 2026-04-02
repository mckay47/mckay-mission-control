import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import Background from './Background'
import ProjekteCard from '../cards/ProjekteCard'
import TodosCard from '../cards/TodosCard'
import EmailsCard from '../cards/EmailsCard'
import KalenderCard from '../cards/KalenderCard'
import PersoenlichCard from '../cards/PersoenlichCard'
import ThinktankCard from '../cards/ThinktankCard'
import SystemKaniCard from '../cards/SystemKaniCard'
import AgentsCard from '../cards/AgentsCard'
import TokenStrip from '../cards/TokenStrip'
import MissionFeed from '../cards/MissionFeed'
import { ToastProvider } from '../Toast'
import ProjectOverlay from '../ProjectOverlay'
import type { Project } from '../../lib/types'

export default function Dashboard() {
  const navigate = useNavigate()
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const openProject = useCallback((p: Project) => setActiveProject(p), [])
  const closeProject = useCallback(() => setActiveProject(null), [])

  // Card hover glow tracking
  useEffect(() => {
    function handleMove(e: MouseEvent) {
      const card = (e.target as HTMLElement).closest('.card') as HTMLElement | null
      if (!card) return
      const rect = card.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      card.style.setProperty('--glow-pos', `${x}% ${y}%`)
    }
    document.addEventListener('mousemove', handleMove)
    return () => document.removeEventListener('mousemove', handleMove)
  }, [])

  // Double-click on cards → navigate to detail page
  useEffect(() => {
    function handleDblClick(e: MouseEvent) {
      const card = (e.target as HTMLElement).closest('.card') as HTMLElement | null
      if (!card) return
      const routes: Record<string, string> = {
        projekte: '/detail/projekte',
        todos: '/detail/todos',
        emails: '/detail/quickaccess',
        kalender: '/detail/briefing',
        persoenlich: '/detail/quickaccess',
        thinktank: '/detail/thinktank',
        'system-card': '/detail/system',
        'agents-card': '/detail/agents',
      }
      for (const [cls, route] of Object.entries(routes)) {
        if (card.classList.contains(cls)) {
          navigate(route)
          return
        }
      }
    }
    document.addEventListener('dblclick', handleDblClick)
    return () => document.removeEventListener('dblclick', handleDblClick)
  }, [navigate])

  return (
    <ToastProvider>
      <Background />
      <div className="dashboard">
        <Header />
        <ProjekteCard onOpenProject={openProject} />
        <TodosCard />
        <EmailsCard />
        <KalenderCard />
        <PersoenlichCard />
        <div className="right-col">
          <ThinktankCard />
          <SystemKaniCard />
          <AgentsCard />
          <TokenStrip />
          <MissionFeed />
        </div>
      </div>

      {activeProject && (
        <ProjectOverlay
          project={activeProject}
          onClose={closeProject}
          onOpenTodoModal={() => {}}
          onOpenThoughtModal={() => {}}
        />
      )}
    </ToastProvider>
  )
}
