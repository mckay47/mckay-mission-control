import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui';
import { pipelineIdeasV2 } from '../data/dummy';
import type { PipelineIdeaV2 } from '../data/types';

type EntryCategory = 'alle' | 'Ideen' | 'Research' | 'Strategie' | 'Projekte' | 'Privat';

function classifyType(type: string): EntryCategory {
  const lower = type.toLowerCase();
  if (lower.includes('research')) return 'Research';
  if (lower.includes('strateg')) return 'Strategie';
  if (lower.includes('projekt') || lower.includes('project')) return 'Projekte';
  if (lower.includes('privat') || lower.includes('personal')) return 'Privat';
  return 'Ideen';
}

export function Thinktank() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [input, setInput] = useState('');
  const [entries, setEntries] = useState<PipelineIdeaV2[]>([
    ...pipelineIdeasV2,
    {
      id: 'healthcare-eco',
      name: 'Healthcare Ecosystem',
      rawTranscript: 'Alle Healthcare-Projekte zu einem Oekosystem verbinden...',
      structuredVersion: 'Alle Healthcare-Projekte zu einem Oekosystem verbinden — Hebammenbuero, Stillprobleme, findemeinehebamme als zusammenhaengendes System.',
      type: 'Strategie',
      createdAt: '2026-03-20',
    },
    {
      id: 'zahnarzt',
      name: 'Zahnarzt',
      rawTranscript: 'Termin machen, naechste Woche',
      structuredVersion: 'Termin machen, naechste Woche',
      type: 'Privat',
      createdAt: '2026-03-27',
    },
  ]);
  const [activeCategory, setActiveCategory] = useState<EntryCategory>('alle');
  const [showOriginal, setShowOriginal] = useState<Record<string, boolean>>({});
  const [kaniResponse, setKaniResponse] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const category = trimmed.toLowerCase().includes('strateg')
      ? 'Strategie'
      : trimmed.toLowerCase().includes('research')
        ? 'Research'
        : 'Ideen';

    const newEntry: PipelineIdeaV2 = {
      id: `entry-${Date.now()}`,
      name: trimmed.slice(0, 40) + (trimmed.length > 40 ? '...' : ''),
      rawTranscript: trimmed,
      structuredVersion: `Eingabe wird von KANI analysiert...\n\nOriginal: "${trimmed.slice(0, 100)}"`,
      type: category === 'Strategie' ? 'Strategie' : category === 'Research' ? 'Research' : 'Industry SaaS',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setEntries((prev) => [newEntry, ...prev]);
    setInput('');
    setKaniResponse(`Eingeordnet als: ${category}`);
    setTimeout(() => setKaniResponse(null), 4000);
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<EntryCategory, number> = {
      alle: entries.length,
      Ideen: 0,
      Research: 0,
      Strategie: 0,
      Projekte: 0,
      Privat: 0,
    };
    for (const e of entries) {
      const cat = classifyType(e.type);
      counts[cat]++;
    }
    return counts;
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (activeCategory === 'alle') return entries;
    return entries.filter((e) => classifyType(e.type) === activeCategory);
  }, [entries, activeCategory]);

  const categories: EntryCategory[] = ['alle', 'Ideen', 'Research', 'Strategie', 'Projekte', 'Privat'];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black">THINKTANK</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black"
          >
            &larr; Zurueck
          </button>
        </div>

        {/* GEDANKEN TEILEN */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-black mb-3 pb-2 border-b border-gray-200">GEDANKEN TEILEN</h2>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Schreib was du denkst — Ideen, Strategien, Fragen, alles..."
            rows={4}
            className="w-full border border-gray-300 rounded p-3 text-sm text-black bg-white resize-none mb-3"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Absenden
          </button>

          {kaniResponse && (
            <div className="mt-3 border border-gray-300 rounded p-3 bg-gray-50">
              <p className="text-sm text-black">KANI: {kaniResponse}</p>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Nach Absenden: KANI zeigt &quot;Eingeordnet als: [Kategorie]&quot;
          </p>
        </div>

        {/* FILTER */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6">
          <h2 className="text-sm font-bold text-black mb-2">FILTER:</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded border text-sm cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-gray-300 border-gray-500 text-black font-bold'
                    : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-black'
                }`}
              >
                {cat === 'alle' ? 'Alle' : cat}: {categoryCounts[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* EINTRAEGE */}
        <div className="border border-gray-300 rounded-lg p-4">
          <h2 className="text-lg font-bold text-black mb-3 pb-2 border-b border-gray-200">EINTRAEGE</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEntries.map((entry) => {
              const cat = classifyType(entry.type);
              const isOriginalVisible = showOriginal[entry.id];

              return (
                <div key={entry.id} className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-black">{entry.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">
                    Typ: {cat} | Datum: {entry.createdAt}
                  </p>
                  <p className="text-sm text-gray-700 mb-3">
                    &quot;{entry.structuredVersion.slice(0, 120)}
                    {entry.structuredVersion.length > 120 ? '...' : ''}&quot;
                  </p>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <button
                      onClick={() =>
                        setShowOriginal((prev) => ({
                          ...prev,
                          [entry.id]: !prev[entry.id],
                        }))
                      }
                      className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-300 cursor-pointer text-xs text-black"
                    >
                      {isOriginalVisible ? 'Strukturiert' : 'Original'}
                    </button>

                    {cat === 'Ideen' || cat === 'Projekte' ? (
                      <>
                        <button
                          onClick={() => showToast('Projekt starten: ' + entry.name)}
                          className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-300 cursor-pointer text-xs text-black"
                        >
                          &rarr; Projekt starten
                        </button>
                        <button
                          onClick={() => showToast('Research starten: ' + entry.name)}
                          className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-300 cursor-pointer text-xs text-black"
                        >
                          &rarr; Research
                        </button>
                      </>
                    ) : cat === 'Strategie' ? (
                      <>
                        <button
                          onClick={() => showToast('Vertiefen: ' + entry.name)}
                          className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-300 cursor-pointer text-xs text-black"
                        >
                          Vertiefen
                        </button>
                        <button
                          onClick={() => showToast('Geparkt: ' + entry.name)}
                          className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-300 cursor-pointer text-xs text-black"
                        >
                          Parken
                        </button>
                      </>
                    ) : cat === 'Privat' ? (
                      <>
                        <button
                          onClick={() => showToast('Todo erstellt: ' + entry.name)}
                          className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-300 cursor-pointer text-xs text-black"
                        >
                          &rarr; Todo
                        </button>
                        <button
                          onClick={() => showToast('Erledigt: ' + entry.name)}
                          className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-300 cursor-pointer text-xs text-black"
                        >
                          Erledigt
                        </button>
                      </>
                    ) : null}
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-300 cursor-pointer text-xs text-black"
                    >
                      Loeschen
                    </button>
                  </div>

                  {isOriginalVisible && (
                    <div className="border border-gray-200 rounded p-2 bg-gray-50 mt-2">
                      <p className="text-xs text-gray-600 italic">{entry.rawTranscript}</p>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredEntries.length === 0 && (
              <div className="col-span-2 text-center py-8 text-sm text-gray-500">
                Keine Eintraege in dieser Kategorie
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
