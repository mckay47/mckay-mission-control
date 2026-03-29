import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { KaniPanel } from '../KaniPanel';

const routeLabels: Record<string, string> = {
  '/': 'Cockpit',
  '/briefing': 'Briefing',
  '/operator': 'Arbeitsplatz',
  '/lab': 'Lab',
  '/system': 'System',
  '/office': 'Office',
  '/maschinenraum': 'Maschinenraum',
};

function getProjectName(id: string): string {
  const names: Record<string, string> = {
    hebammenbuero: 'Hebammenbuero',
    stillprobleme: 'Stillprobleme.de',
    'tenniscoach-pro': 'TennisCoach Pro',
    findemeinehebamme: 'findemeinehebamme.de',
  };
  return names[id] ?? id;
}

function getBreadcrumbs(pathname: string): { label: string; path: string }[] {
  const crumbs = [{ label: 'Cockpit', path: '/' }];

  if (pathname === '/') return crumbs;

  if (pathname.startsWith('/project/')) {
    const id = pathname.split('/project/')[1];
    crumbs.push({ label: 'Arbeitsplatz', path: '/operator' });
    crumbs.push({ label: getProjectName(id), path: pathname });
    return crumbs;
  }

  const label = routeLabels[pathname];
  if (label && label !== 'Cockpit') {
    crumbs.push({ label, path: pathname });
  }

  return crumbs;
}

export function Shell() {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbs = getBreadcrumbs(location.pathname);
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary relative">
      {/* Ambient background */}
      <div className="ambient-bg">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2,
              height: 2,
              background: 'rgba(0,240,255,0.4)',
              left: `${15 + i * 18}%`,
              top: '100%',
              animation: `drift ${12 + i * 4}s linear infinite`,
              animationDelay: `${i * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Breadcrumb navigation bar */}
      {!isHome && (
        <nav className="breadcrumb-bar scan-line-container fixed top-0 left-0 right-0 z-30 h-12 flex items-center px-6">
          <div className="flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.path} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-text-muted" />}
                {i < breadcrumbs.length - 1 ? (
                  <button
                    onClick={() => navigate(crumb.path)}
                    className="text-text-muted hover:text-neon-cyan transition-colors flex items-center gap-1"
                  >
                    {i === 0 && <Home className="w-3.5 h-3.5" />}
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-text-primary font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        </nav>
      )}

      {/* Main content */}
      <main className={`relative z-10 ${isHome ? '' : 'pt-12'}`}>
        <Outlet />
      </main>

      {/* KANI side panel — always available */}
      <KaniPanel />
    </div>
  );
}
