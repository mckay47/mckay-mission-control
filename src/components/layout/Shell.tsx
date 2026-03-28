import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

const routeTitles: Record<string, string> = {
  '/': 'Command Center',
  '/system': 'System Dashboard',
  '/pipeline': 'Ideas Pipeline',
  '/personal': 'Personal',
};

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/project/')) {
    const id = pathname.split('/project/')[1];
    const projectNames: Record<string, string> = {
      hebammenbuero: 'Hebammenbuero',
      stillprobleme: 'Stillprobleme.de',
      'tenniscoach-pro': 'TennisCoach Pro',
    };
    return projectNames[id] ?? 'Project Dashboard';
  }
  return routeTitles[pathname] ?? 'Mission Control';
}

export function Shell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isDark, toggle } = useTheme();
  const location = useLocation();

  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    const handleResize = () => {
      setSidebarCollapsed(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarWidth = sidebarCollapsed ? 64 : 240;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      <div
        className="transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <TopBar
          title={pageTitle}
          isDark={isDark}
          onToggleTheme={toggle}
        />

        <main className="min-h-[calc(100vh-3.5rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
