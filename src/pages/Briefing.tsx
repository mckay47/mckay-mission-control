import { useNavigate } from 'react-router-dom';

export function Briefing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black">BRIEFING</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black"
          >
            &larr; Zurueck
          </button>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* GESTERN */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h2 className="text-lg font-bold text-black mb-4 pb-2 border-b border-gray-200">GESTERN</h2>
            <div className="space-y-3 text-sm text-black">
              <div>
                <span className="font-bold">Erledigte Todos:</span> 12
              </div>
              <div>
                <span className="font-bold">Projekte bearbeitet:</span> 3
              </div>
              <ul className="list-disc list-inside text-gray-600 ml-2">
                <li>Hebammenbuero</li>
                <li>TennisCoach Pro</li>
                <li>Mission Control</li>
              </ul>
              <div>
                <span className="font-bold">Fortschritt:</span> +8% gesamt
              </div>
              <div>
                <span className="font-bold">Neue Ideen:</span> 2
              </div>
            </div>
          </div>

          {/* EMPFEHLUNG */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h2 className="text-lg font-bold text-black mb-4 pb-2 border-b border-gray-200">EMPFEHLUNG</h2>
            <p className="text-sm text-gray-600 italic mb-4">
              "Basierend auf gestern und heute empfehle ich folgende Reihenfolge:"
            </p>
            <ol className="list-decimal list-inside text-sm text-black space-y-2 mb-6">
              <li>
                <span className="font-bold">Hebammenbuero</span>
                <br />
                <span className="text-gray-600 ml-5">Mockup Review</span>
              </li>
              <li>
                <span className="font-bold">Stillprobleme</span>
                <br />
                <span className="text-gray-600 ml-5">Mockup bauen</span>
              </li>
              <li>
                <span className="font-bold">TennisCoach</span>
                <br />
                <span className="text-gray-600 ml-5">Phase 4 Plan</span>
              </li>
            </ol>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/cockpit')}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black w-full text-left"
              >
                &rarr; Cockpit
              </button>
              <button
                onClick={() => navigate('/projekte')}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black w-full text-left"
              >
                &rarr; Arbeitsplatz
              </button>
              <button
                onClick={() => navigate('/thinktank')}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black w-full text-left"
              >
                &rarr; Gedanke teilen
              </button>
            </div>
          </div>

          {/* HEUTE */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h2 className="text-lg font-bold text-black mb-4 pb-2 border-b border-gray-200">HEUTE</h2>
            <div className="space-y-3 text-sm text-black">
              <div>
                <span className="font-bold">Geplante Todos:</span> 6 Aufgaben
              </div>
              <div>
                <span className="font-bold">Projekte heute:</span>
              </div>
              <ul className="list-disc list-inside text-gray-600 ml-2">
                <li>Hebammenbuero</li>
                <li>Stillprobleme</li>
              </ul>
              <div>
                <span className="font-bold">Termine:</span>
              </div>
              <ul className="list-disc list-inside text-gray-600 ml-2">
                <li>14:00 Designer</li>
                <li>16:00 Testing</li>
              </ul>
              <div className="mt-4">
                <span className="font-bold">Ziel:</span> +15% Fortschritt
              </div>
            </div>
          </div>
        </div>

        {/* KANI INSIGHTS */}
        <div className="border border-gray-300 rounded-lg p-4">
          <h2 className="text-lg font-bold text-black mb-3 pb-2 border-b border-gray-200">KANI INSIGHTS</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>&bull; "Hebammenbuero + Stillprobleme teilen 80% der Skills"</li>
            <li>&bull; "TennisCoach: Stripe dauert ~2 Tage"</li>
            <li>&bull; "Token-Verbrauch 20% unter Durchschnitt"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
