import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const routeLabels: Record<string, string> = {
  '/': 'Welcome',
  '/briefing': 'Briefing',
  '/cockpit': 'Cockpit',
  '/projekte': 'Arbeitsplatz',
  '/thinktank': 'Thinktank',
  '/system': 'System',
  '/office': 'Office',
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
  const crumbs = [{ label: 'Home', path: '/' }];

  if (pathname === '/') return crumbs;

  if (pathname.startsWith('/project/')) {
    const id = pathname.split('/project/')[1];
    crumbs.push({ label: 'Arbeitsplatz', path: '/projekte' });
    crumbs.push({ label: getProjectName(id), path: pathname });
    return crumbs;
  }

  const label = routeLabels[pathname];
  if (label && label !== 'Welcome') {
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
    <div className="min-h-screen bg-white text-black">
      {/* Breadcrumb navigation bar */}
      {!isHome && (
        <nav className="fixed top-0 left-0 right-0 z-30 h-10 flex items-center px-6 bg-white border-b border-gray-200">
          <div className="flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.path} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-400">/</span>}
                {i < breadcrumbs.length - 1 ? (
                  <button
                    onClick={() => navigate(crumb.path)}
                    className="text-gray-500 hover:text-black cursor-pointer"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-black font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        </nav>
      )}

      {/* Main content */}
      <main className={isHome ? '' : 'pt-10'}>
        <Outlet />
      </main>
    </div>
  );
}
