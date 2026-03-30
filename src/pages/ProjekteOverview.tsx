import { useNavigate } from 'react-router-dom';
import { projects, initialTodos } from '../data/dummy';

export function ProjekteOverview() {
  const navigate = useNavigate();

  const buildingProjects = projects.filter((p) => p.status === 'building');
  const liveProjects = projects.filter((p) => p.status === 'live');

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black">ARBEITSPLATZ — Projekte</h1>
          <button
            onClick={() => navigate('/cockpit')}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black"
          >
            &larr; Zurueck
          </button>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {buildingProjects.map((project) => {
            const openTodos = initialTodos.filter(
              (t) => t.projectId === project.id && !t.done
            ).length;
            const doneTodos = initialTodos.filter(
              (t) => t.projectId === project.id && t.done
            ).length;
            const lastTimeline = project.timeline[project.timeline.length - 1];
            const isAttention = project.health === 'attention';

            return (
              <div key={project.id} className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-black">{project.name}</h3>
                  <span className="text-sm text-gray-600">
                    {project.phase} &middot; ● {project.health === 'healthy' ? 'Healthy' : 'Attention'}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-700 mb-3">
                  <p>Fortschritt: {project.progressPercent}%</p>
                  <p>
                    Todos: {openTodos} offen / {doneTodos} done
                  </p>
                  <p>
                    Tokens: {project.tokenUsage >= 1000 ? `${Math.round(project.tokenUsage / 1000)}K` : project.tokenUsage} &middot; EUR {project.monthlyCost.toFixed(2)}/mo
                  </p>
                  {lastTimeline && (
                    <p>Zuletzt: {lastTimeline.title}</p>
                  )}
                  {project.milestones && (
                    <p>
                      Naechster:{' '}
                      {project.milestones.find((m) => m.active)?.label ||
                        project.milestones.find((m) => !m.completed)?.label ||
                        'Fertig'}
                    </p>
                  )}
                  {isAttention && (
                    <p className="text-orange-600 font-bold">
                      KANI wartet auf Freigabe
                    </p>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black"
                >
                  Projekt oeffnen &rarr;
                </button>
              </div>
            );
          })}

          {liveProjects.map((project) => (
            <div key={project.id} className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-black">{project.name}</h3>
                <span className="text-sm text-gray-600">● LIVE</span>
              </div>
              <div className="space-y-1 text-sm text-gray-700 mb-3">
                <p>~100 Vermittlungen</p>
                <p>EUR {project.monthlyCost.toFixed(2)}/mo</p>
              </div>
              <button
                onClick={() => navigate(`/project/${project.id}`)}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black"
              >
                Ansehen &rarr;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
