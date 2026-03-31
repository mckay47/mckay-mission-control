interface NavProps {
  currentMode: string
  onModeChange: (mode: string) => void
}

const TABS = [
  { id: 'cockpit', icon: '\u229e', label: 'Cockpit' },
  { id: 'system', icon: '\u2699', label: 'System' },
  { id: 'projects', icon: '\u25c8', label: 'Projekte' },
  { id: 'finance', icon: '\u25ce', label: 'Finanzen' },
  { id: 'agents', icon: '\u2b21', label: 'Agents' },
  { id: 'thinktank', icon: '\u{1F4A1}', label: 'Thinktank' },
  { id: 'todos', icon: '\u2713', label: 'Todos' },
  { id: 'briefing', icon: '\u2600', label: 'Briefing' },
  { id: 'office', icon: '\u{1F4CB}', label: 'Office' },
  { id: 'productivity', icon: '\u{1F4CA}', label: 'Stats' },
  { id: 'memory', icon: '\u{1F9E0}', label: 'Memory' },
]

function toggleTheme() {
  const html = document.documentElement
  html.setAttribute('data-theme', html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
}

export default function Nav({ currentMode, onModeChange }: NavProps) {
  return (
    <nav className="tnav">
      <span className="tlogo">MCKAY<span>.</span>OS</span>
      <div className="ttabs">
        {TABS.map(tab => (
          <span
            key={tab.id}
            className={`tab${currentMode === tab.id ? ' act' : ''}`}
            onClick={() => onModeChange(tab.id)}
          >
            {tab.icon} {tab.label}
          </span>
        ))}
      </div>
      <div className="tglbtn" onClick={toggleTheme} title="Dark/Light" />
    </nav>
  )
}
