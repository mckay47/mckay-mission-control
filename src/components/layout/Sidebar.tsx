import { NavLink } from 'react-router-dom';
import { Gauge, Cpu, FlaskConical, User, FolderOpen, ChevronLeft, ChevronRight, BarChart3, Wrench } from 'lucide-react';
import { projects } from '../../data/dummy';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { label: 'Cockpit', icon: Gauge, path: '/' },
  { label: 'Briefing', icon: BarChart3, path: '/briefing' },
  { label: 'Operator', icon: Wrench, path: '/operator' },
  { label: 'Lab', icon: FlaskConical, path: '/lab' },
  { label: 'System', icon: Cpu, path: '/system' },
  { label: 'Office', icon: User, path: '/office' },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 glass flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-glass-border">
        {!collapsed && (
          <span className="text-lg font-bold tracking-widest text-neon-cyan text-glow-cyan">
            MCKAY
          </span>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded hover:bg-glass-bg transition-colors text-text-secondary hover:text-text-primary"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-neon-cyan border-l-2 border-neon-cyan bg-neon-cyan/5'
                      : 'text-text-secondary hover:text-text-primary hover:bg-glass-bg border-l-2 border-transparent'
                  }`
                }
              >
                <item.icon size={18} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Projects section */}
        {!collapsed && (
          <div className="mt-6 px-2">
            <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              Projects
            </div>
            <ul className="space-y-1">
              {projects.map((project) => (
                <li key={project.id}>
                  <NavLink
                    to={`/project/${project.id}`}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'text-neon-cyan bg-neon-cyan/5'
                          : 'text-text-secondary hover:text-text-primary hover:bg-glass-bg'
                      }`
                    }
                  >
                    <FolderOpen size={14} className="shrink-0" />
                    <span className="truncate">{project.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Collapsed project icons */}
        {collapsed && (
          <div className="mt-6 px-2 space-y-1">
            {projects.map((project) => (
              <NavLink
                key={project.id}
                to={`/project/${project.id}`}
                className={({ isActive }) =>
                  `flex items-center justify-center p-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-neon-cyan bg-neon-cyan/5'
                      : 'text-text-secondary hover:text-text-primary hover:bg-glass-bg'
                  }`
                }
                title={project.name}
              >
                <FolderOpen size={14} />
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Bottom version tag */}
      <div className="px-4 py-3 border-t border-glass-border">
        {!collapsed ? (
          <span className="text-[10px] font-mono text-text-muted">MCKAY OS v1.0</span>
        ) : (
          <span className="block text-center text-[10px] font-mono text-text-muted">v1</span>
        )}
      </div>
    </aside>
  );
}
