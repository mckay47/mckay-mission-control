import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui';
import { projects } from '../data/dummy';

const buildingProjects = projects.filter((p) => p.status === 'building');
const liveProjects = projects.filter((p) => p.status === 'live');

export function CockpitDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black">COCKPIT</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black"
          >
            &larr; Zurueck
          </button>
        </div>

        {/* KPIs */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-black mb-3 pb-2 border-b border-gray-200">KPIs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-gray-300 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Projekte</p>
              <p className="text-2xl font-bold text-black">aktiv: {buildingProjects.length}</p>
              <p className="text-sm text-gray-600">hold: 0</p>
            </div>
            <div className="border border-gray-300 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Tokens</p>
              <p className="text-2xl font-bold text-black">175K</p>
              <p className="text-sm text-gray-600">von 500K</p>
            </div>
            <div className="border border-gray-300 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Kosten</p>
              <p className="text-2xl font-bold text-black">
                EUR {projects.reduce((sum, p) => sum + p.monthlyCost, 0).toFixed(2)}/mo
              </p>
            </div>
            <div className="border border-gray-300 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Ideen</p>
              <p className="text-2xl font-bold text-black">geparkt: 5</p>
            </div>
          </div>
        </div>

        {/* AKTIVE PROJEKTE */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-black mb-3 pb-2 border-b border-gray-200">AKTIVE PROJEKTE</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {buildingProjects.map((project) => {
              const openTodos = project.id === 'hebammenbuero' ? 3 : project.id === 'stillprobleme' ? 2 : 1;
              return (
                <div key={project.id} className="border border-gray-300 rounded-lg p-4">
                  <h3 className="text-base font-bold text-black mb-1">{project.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {project.phase} &middot; {project.progressPercent}%
                  </p>
                  <p className="text-sm text-gray-600 mb-3">{openTodos} Todos offen</p>
                  <button
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black"
                  >
                    &rarr; Oeffnen
                  </button>
                </div>
              );
            })}
            {liveProjects.map((project) => (
              <div key={project.id} className="border border-gray-300 rounded-lg p-4">
                <h3 className="text-base font-bold text-black mb-1">{project.name}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  ● Live &middot; {project.progressPercent}%
                </p>
                <p className="text-sm text-gray-600 mb-3">~100 Orders</p>
                <button
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black"
                >
                  &rarr; Ansehen
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ABSPRUNG */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-black mb-3 pb-2 border-b border-gray-200">ABSPRUNG</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => navigate('/projekte')}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black"
            >
              Alle Projekte
            </button>
            <button
              onClick={() => navigate('/thinktank')}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black"
            >
              Thinktank
            </button>
            <button
              onClick={() => navigate('/system')}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black"
            >
              System
            </button>
            <button
              onClick={() => navigate('/office')}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black"
            >
              Office
            </button>
          </div>

          <h3 className="text-sm font-bold text-black mb-2">PROJEKTE AUF HOLD (keine Aktivitaet)</h3>
          <div className="text-sm text-gray-600">
            <p>&bull; Stillprobleme.de — seit 1 Tag keine Aktivitaet</p>
            <button
              onClick={() => showToast('Projekt wird aktiviert')}
              className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded border border-gray-300 cursor-pointer text-xs text-black mt-2"
            >
              &rarr; Aktivieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
