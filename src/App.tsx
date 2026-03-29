import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Shell } from './components/layout';
import { BootSequence } from './components/BootSequence';
import { ToastProvider } from './components/ui/Toast';
import {
  Briefing,
  Cockpit,
  Operator,
  ProjectDashboard,
  Lab,
  SystemDashboard,
  Office,
} from './pages';

function AppRoutes() {
  const [booted, setBooted] = useState(false);
  const navigate = useNavigate();

  const handleBootComplete = useCallback((choice: 'briefing' | 'cockpit' | 'operator') => {
    setBooted(true);
    switch (choice) {
      case 'briefing': navigate('/briefing'); break;
      case 'operator': navigate('/operator'); break;
      default: navigate('/'); break;
    }
  }, [navigate]);

  return (
    <>
      {!booted && <BootSequence onComplete={handleBootComplete} />}
      <div className={booted ? 'animate-fade-in' : 'opacity-0 pointer-events-none'}>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<Cockpit />} />
            <Route path="/briefing" element={<Briefing />} />
            <Route path="/operator" element={<Operator />} />
            <Route path="/project/:id" element={<ProjectDashboard />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/system" element={<SystemDashboard />} />
            <Route path="/office" element={<Office />} />
          </Route>
        </Routes>
      </div>
    </>
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
