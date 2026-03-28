import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Shell } from './components/layout';
import { BootSequence } from './components/BootSequence';
import {
  CommandCenter,
  ProjectDashboard,
  SystemDashboard,
  Pipeline,
  Personal,
} from './pages';

function AppRoutes() {
  const [booted, setBooted] = useState(false);
  const navigate = useNavigate();

  const handleBootComplete = useCallback((choice: string) => {
    setBooted(true);
    switch (choice) {
      case 'idea': navigate('/pipeline'); break;
      case 'status': navigate('/system'); break;
      default: navigate('/'); break;
    }
  }, [navigate]);

  return (
    <>
      {!booted && <BootSequence onComplete={handleBootComplete} />}
      <div className={booted ? 'animate-fade-in' : 'opacity-0 pointer-events-none'}>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/project/:id" element={<ProjectDashboard />} />
            <Route path="/system" element={<SystemDashboard />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/personal" element={<Personal />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
