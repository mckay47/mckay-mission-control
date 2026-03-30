import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Gauge, Cpu, User, Power } from 'lucide-react';
import { FeierabendOverlay } from '../FeierabendOverlay';

const routeLabels: Record<string, string> = {
  '/system': 'System',
  '/office': 'Office',
};

const navButtons = [
  { label: 'Cockpit', icon: Gauge, path: '/' },
  { label: 'System', icon: Cpu, path: '/system' },
  { label: 'Office', icon: User, path: '/office' },
];

export function Shell() {
  const location = useLocation();
  const navigate = useNavigate();
  const label = routeLabels[location.pathname];
  const [showFeierabend, setShowFeierabend] = useState(false);

  const showBreadcrumb = !!label;

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

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

      <main className={showBreadcrumb ? 'pt-10 pb-14' : 'pb-14'}>
        <Outlet />
      </main>

      {/* Persistent bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-12 flex items-center justify-center gap-1 bg-white border-t border-gray-200 px-4">
        {navButtons.map((btn) => {
          const active = isActive(btn.path);
          return (
            <button
              key={btn.path}
              onClick={() => navigate(btn.path)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                active
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-black'
              }`}
            >
              <btn.icon size={16} />
              <span>{btn.label}</span>
            </button>
          );
        })}
        <div className="w-px h-6 bg-gray-200 mx-2" />
        <button
          onClick={() => setShowFeierabend(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all cursor-pointer"
        >
          <Power size={16} />
          <span>Feierabend</span>
        </button>
      </nav>

      {showFeierabend && (
        <FeierabendOverlay onClose={() => setShowFeierabend(false)} />
      )}
    </div>
  );
}
