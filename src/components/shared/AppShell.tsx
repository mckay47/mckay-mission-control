import { useState, useEffect } from 'react'
import Header from './Header'
import KaniChat from './KaniChat'

interface AppShellProps {
  children: React.ReactNode
  backLink?: { label: string; href: string }
  title?: string
  ledColor?: string
  kaniContext?: string
}

export default function AppShell({ children, backLink, title, ledColor, kaniContext = 'cockpit' }: AppShellProps) {
  const [kaniOpen, setKaniOpen] = useState(false)

  useEffect(() => {
    function handleToggle() {
      setKaniOpen((prev) => !prev)
    }
    document.addEventListener('toggle-kani-chat', handleToggle)
    return () => document.removeEventListener('toggle-kani-chat', handleToggle)
  }, [])

  return (
    <div className="app">
      <Header backLink={backLink} title={title} ledColor={ledColor} />
      {children}
      {/* KANI floating button */}
      <div className="kf" onClick={() => setKaniOpen((prev) => !prev)}>
        <div className="kf-in">
          <svg viewBox="0 0 24 24">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
          </svg>
        </div>
        <span className="kf-l">KANI</span>
      </div>
      <KaniChat open={kaniOpen} onClose={() => setKaniOpen(false)} context={kaniContext} />
    </div>
  )
}
