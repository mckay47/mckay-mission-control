import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Shell } from './components/layout';
import { ToastProvider } from './components/ui/Toast';
import {
  Briefing,
  Cockpit,
  CockpitDashboard,
  ProjekteOverview,
  ProjectDashboard,
  Thinktank,
  SystemDashboard,
  Office,
} from './pages';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Cockpit />} />
        <Route path="/briefing" element={<Briefing />} />
        <Route path="/cockpit" element={<CockpitDashboard />} />
        <Route path="/projekte" element={<ProjekteOverview />} />
        <Route path="/project/:id" element={<ProjectDashboard />} />
        <Route path="/thinktank" element={<Thinktank />} />
        <Route path="/system" element={<SystemDashboard />} />
        <Route path="/office" element={<Office />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </BrowserRouter>
  );
}
