import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Shell } from './components/layout';
import { ToastProvider } from './components/ui/Toast';
import {
  Cockpit,
  ProjectDashboard,
  SystemDashboard,
  Office,
} from './pages';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Cockpit />} />
        <Route path="/project/:id" element={<ProjectDashboard />} />
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
