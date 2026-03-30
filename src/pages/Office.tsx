import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui';

type TodoMode = 'privat' | 'projekte';
type CalendarView = 'tag' | 'woche' | 'monat';

const btnClass =
  'bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300 cursor-pointer text-sm text-black';

const privateTodos = [
  { text: 'Zahnarzt', done: false },
  { text: 'Steuer', done: false },
  { text: 'Auto TUEV', done: false },
];

const calendarEntries = [
  { time: '09:00', title: 'Standup' },
  { time: '11:00', title: 'Hebammen Review' },
  { time: '14:00', title: 'Designer' },
  { time: '16:00', title: 'Testing' },
];

const emails = [
  { from: 'Rechtsanwalt', subject: 'Vertrag Unterschrift', auto: false },
  { from: 'Hetzner', subject: 'Angebot Hosting', auto: false },
  { from: 'Newsletter', subject: 'Newsletter (auto)', auto: true },
];

export function Office() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [todoMode, setTodoMode] = useState<TodoMode>('privat');
  const [calendarView, setCalendarView] = useState<CalendarView>('tag');
  const [noteText, setNoteText] = useState('');

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black">OFFICE</h1>
          <button
            onClick={() => navigate('/')}
            className={btnClass}
          >
            Zurueck zum Cockpit
          </button>
        </div>

        {/* KPI bar */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6">
          <p className="text-sm text-black">
            Termine: {calendarEntries.length} heute | Mails: {emails.filter((e) => !e.auto).length} offen | Todos privat: {privateTodos.length}
          </p>
        </div>

        {/* Three-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* AUFGABEN */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h2 className="text-lg font-bold text-black mb-3 pb-2 border-b border-gray-200">AUFGABEN</h2>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setTodoMode('privat')}
                className={`px-3 py-1 rounded border text-sm cursor-pointer ${
                  todoMode === 'privat'
                    ? 'bg-gray-300 border-gray-500 text-black font-bold'
                    : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-black'
                }`}
              >
                Privat
              </button>
              <button
                onClick={() => setTodoMode('projekte')}
                className={`px-3 py-1 rounded border text-sm cursor-pointer ${
                  todoMode === 'projekte'
                    ? 'bg-gray-300 border-gray-500 text-black font-bold'
                    : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-black'
                }`}
              >
                Projekte
              </button>
            </div>
            <div className="space-y-2">
              {privateTodos.map((todo, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-black">
                  <span>{todo.done ? '[x]' : '[ ]'}</span>
                  <span>{todo.text}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => showToast('Neues Todo')}
              className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded border border-gray-300 cursor-pointer text-sm text-black mt-3"
            >
              + Neues Todo
            </button>
          </div>

          {/* KALENDER */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h2 className="text-lg font-bold text-black mb-3 pb-2 border-b border-gray-200">KALENDER</h2>
            <p className="text-sm text-gray-600 mb-3">
              Heute {new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
            </p>
            <div className="space-y-2 mb-4">
              {calendarEntries.map((entry, i) => (
                <div key={i} className="text-sm text-black">
                  {entry.time} {entry.title}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {(['tag', 'woche', 'monat'] as CalendarView[]).map((view) => (
                <button
                  key={view}
                  onClick={() => {
                    if (view !== 'tag') {
                      showToast('Modul noch nicht aktiviert');
                    } else {
                      setCalendarView(view);
                    }
                  }}
                  className={`px-3 py-1 rounded border text-xs cursor-pointer ${
                    calendarView === view
                      ? 'bg-gray-300 border-gray-500 text-black font-bold'
                      : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-black'
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* POSTEINGANG */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h2 className="text-lg font-bold text-black mb-3 pb-2 border-b border-gray-200">POSTEINGANG</h2>
            <div className="space-y-3">
              {emails.map((email, i) => (
                <div key={i} className={`border border-gray-200 rounded p-2 ${email.auto ? 'opacity-50' : ''}`}>
                  <p className="text-sm font-bold text-black">{email.subject}</p>
                  <p className="text-xs text-gray-600">von: {email.from}</p>
                  {!email.auto && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => showToast('Antworten: ' + email.subject)}
                        className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-300 cursor-pointer text-xs text-black"
                      >
                        Antworten
                      </button>
                      <button
                        onClick={() => showToast('Geparkt: ' + email.subject)}
                        className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-300 cursor-pointer text-xs text-black"
                      >
                        Parken
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <p className="text-xs text-gray-500">3 ignoriert</p>
            </div>
          </div>
        </div>

        {/* NOTIZEN */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-black mb-3 pb-2 border-b border-gray-200">NOTIZEN</h2>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Freitext-Editor..."
            rows={4}
            className="w-full border border-gray-300 rounded p-3 text-sm text-black bg-white resize-none"
          />
        </div>

        {/* ZUKUENFTIGE MODULE */}
        <div className="border border-gray-300 rounded-lg p-4">
          <h2 className="text-lg font-bold text-black mb-3 pb-2 border-b border-gray-200">ZUKUENFTIGE MODULE</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['E-Mail Agent', 'Kontakte', 'Finanzen', 'Docs'].map((mod) => (
              <div key={mod} className="border border-gray-300 rounded-lg p-3 text-center opacity-50">
                <p className="text-sm text-gray-600">{mod}</p>
                <p className="text-xs text-gray-400">Gesperrt</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
