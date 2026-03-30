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
    <div className="min-h-screen text-[#E0E6F0]">
      {showBreadcrumb && (
        <nav className="fixed top-0 left-0 right-0 z-30 h-10 flex items-center px-6 breadcrumb-bar">
          <div className="flex items-center gap-1.5 text-sm">
            <button
              onClick={() => navigate('/')}
              className="text-[#7B8DB5] hover:text-[#00F0FF] cursor-pointer transition-colors"
            >
              Cockpit
            </button>
            <span className="text-[#4A5A7A]">/</span>
            <span className="text-[#E0E6F0] font-medium">{label}</span>
          </div>
        </nav>
      )}

      <main className={showBreadcrumb ? 'pt-10 pb-14' : 'pb-14'}>
        <Outlet />
      </main>

      {/* Persistent bottom navigation — glass style */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-12 flex items-center justify-center gap-1 px-4"
        style={{
          background: 'rgba(10, 17, 32, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {navButtons.map((btn) => {
          const active = isActive(btn.path);
          return (
            <button
              key={btn.path}
              onClick={() => navigate(btn.path)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                active
                  ? 'text-[#00F0FF] bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.2)]'
                  : 'text-[#7B8DB5] hover:text-[#E0E6F0] hover:bg-[rgba(255,255,255,0.05)] border border-transparent'
              }`}
            >
              <btn.icon size={16} />
              <span>{btn.label}</span>
            </button>
          );
        })}
        <div className="w-px h-6 bg-[rgba(255,255,255,0.08)] mx-2" />
        <button
          onClick={() => setShowFeierabend(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#FF2D55] hover:bg-[rgba(255,45,85,0.1)] transition-all cursor-pointer border border-transparent"
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
