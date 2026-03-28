import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Shell } from './components/layout';
import { KaniHub } from './components/KaniHub';
import type { HubMode, ChatContext } from './components/KaniHub';
import {
  CommandCenter,
  ProjectDashboard,
  SystemDashboard,
  Pipeline,
  Personal,
} from './pages';

function AppRoutes() {
  const [hubMode, setHubMode] = useState<HubMode>('boot');
  const [chatContext, setChatContext] = useState<ChatContext>('welcome');
  const navigate = useNavigate();

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const handleModeChange = useCallback((mode: HubMode) => {
    setHubMode(mode);
  }, []);

  return (
    <>
      {/* KANI Hub — always present */}
      <KaniHub
        mode={hubMode}
        onModeChange={handleModeChange}
        onNavigate={handleNavigate}
        context={chatContext}
        onContextChange={setChatContext}
      />

      {/* Full-screen dashboard routes — visible when mode is 'fullscreen' */}
      {hubMode === 'fullscreen' && (
        <div className="animate-fade-in">
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
      )}
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
