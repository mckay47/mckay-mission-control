import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import Background from '../layout/Background'
import { ToastProvider } from '../Toast'
import QuickAccess from './pages/QuickAccess'
import ThinktankDetail from './pages/ThinktankDetail'
import BriefingDetail from './pages/BriefingDetail'
import IdeenDetail from './pages/IdeenDetail'
import TodosDetail from './pages/TodosDetail'
import ProjekteDetail from './pages/ProjekteDetail'
import AgentsDetail from './pages/AgentsDetail'
import FinanzenDetail from './pages/FinanzenDetail'
import SystemDetail from './pages/SystemDetail'

const PAGES: Record<string, () => React.JSX.Element> = {
  quickaccess: QuickAccess,
  thinktank: ThinktankDetail,
  briefing: BriefingDetail,
  ideen: IdeenDetail,
  todos: TodosDetail,
  projekte: ProjekteDetail,
  agents: AgentsDetail,
  finanzen: FinanzenDetail,
  system: SystemDetail,
}

export default function DetailPage() {
  const { page } = useParams<{ page: string }>()
  const PageComponent = page ? PAGES[page] : null

  if (!PageComponent) return <Navigate to="/" replace />

  return (
    <ToastProvider>
      <Background />
      <PageComponent />
    </ToastProvider>
  )
}
