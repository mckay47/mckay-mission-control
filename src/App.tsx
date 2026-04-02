import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Boot from './components/Boot'
import Dashboard from './components/layout/Dashboard'
import DetailPage from './components/detail/DetailPage'
import ProjectWindow from './components/detail/ProjectWindow'
import { ToastProvider } from './components/Toast'

export default function App() {
  const [booted, setBooted] = useState(false)

  if (!booted) {
    return (
      <ToastProvider>
        <Boot onComplete={() => setBooted(true)} />
      </ToastProvider>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/detail/:page" element={<DetailPage />} />
        <Route path="/project/:id" element={<ProjectWindow />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
