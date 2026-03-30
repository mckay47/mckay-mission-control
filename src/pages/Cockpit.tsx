import { useNavigate } from 'react-router-dom';
import { useClock } from '../hooks/useClock';

export function Cockpit() {
  const navigate = useNavigate();
  const { time, date } = useClock();

  const weekday = new Date().toLocaleDateString('de-DE', { weekday: 'long' });

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="border border-gray-300 rounded-lg p-12 max-w-3xl w-full text-center">
        <h1 className="text-3xl font-bold text-black mb-4">MCKAY MISSION CONTROL</h1>
        <p className="text-lg text-black mb-1">Hallo Mehti, Welcome back.</p>
        <p className="text-lg text-black mb-2">Legen wir los.</p>
        <p className="text-sm text-gray-600 mb-10">
          {weekday}, {date} &middot; {time}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Briefing */}
          <div className="border border-gray-300 rounded-lg p-6 text-left">
            <h2 className="text-lg font-bold text-black mb-2">BRIEFING</h2>
            <p className="text-sm text-gray-600 mb-4">Was war, was kommt</p>
            <button
              onClick={() => navigate('/briefing')}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black"
            >
              Oeffnen &rarr;
            </button>
          </div>

          {/* Cockpit */}
          <div className="border border-gray-300 rounded-lg p-6 text-left">
            <h2 className="text-lg font-bold text-black mb-2">COCKPIT</h2>
            <p className="text-sm text-gray-600 mb-4">Ueberblick und KPIs</p>
            <button
              onClick={() => navigate('/cockpit')}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black"
            >
              Oeffnen &rarr;
            </button>
          </div>

          {/* Arbeitsplatz */}
          <div className="border border-gray-300 rounded-lg p-6 text-left">
            <h2 className="text-lg font-bold text-black mb-2">ARBEITSPLATZ</h2>
            <p className="text-sm text-gray-600 mb-4">An Projekten arbeiten</p>
            <button
              onClick={() => navigate('/projekte')}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black"
            >
              Oeffnen &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
