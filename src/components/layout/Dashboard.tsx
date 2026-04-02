import { useEffect } from 'react'
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

const CARD_ROUTES: Record<string, string> = {
  projekte: '/detail/projekte',
  todos: '/detail/todos',
  emails: '/detail/quickaccess',
  kalender: '/detail/briefing',
  persoenlich: '/detail/quickaccess',
  thinktank: '/detail/thinktank',
  'system-card': '/detail/system',
  'agents-card': '/detail/agents',
}

export default function Dashboard() {
  const navigate = useNavigate()

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

  // Click on card-header → navigate to detail page
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const header = (e.target as HTMLElement).closest('.card-header') as HTMLElement | null
      if (!header) return
      const card = header.closest('.card') as HTMLElement | null
      if (!card) return
      // Don't navigate if clicking a button inside the header
      if ((e.target as HTMLElement).closest('.btn, .btns, button')) return
      for (const [cls, route] of Object.entries(CARD_ROUTES)) {
        if (card.classList.contains(cls)) {
          navigate(route)
          return
        }
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [navigate])

  return (
    <ToastProvider>
      <Background />
      <div className="dashboard">
        <Header />
        <ProjekteCard />
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
    </ToastProvider>
  )
}
