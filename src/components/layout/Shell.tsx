import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const routeLabels: Record<string, string> = {
  '/system': 'System',
  '/office': 'Office',
};

export function Shell() {
  const location = useLocation();
  const navigate = useNavigate();
  const label = routeLabels[location.pathname];

  // Show breadcrumb only for /system and /office
  const showBreadcrumb = !!label;

  return (
    <div className="min-h-screen bg-white text-black">
      {showBreadcrumb && (
        <nav className="fixed top-0 left-0 right-0 z-30 h-10 flex items-center px-6 bg-white border-b border-gray-200">
          <div className="flex items-center gap-1.5 text-sm">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-black cursor-pointer"
            >
              Cockpit
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-black font-medium">{label}</span>
          </div>
        </nav>
      )}

      <main className={showBreadcrumb ? 'pt-10' : ''}>
        <Outlet />
      </main>
    </div>
  );
}
