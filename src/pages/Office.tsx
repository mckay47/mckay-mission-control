import { useState } from 'react';
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

const projektTodos = [
  { text: 'Hebammenbuero Review', done: false },
  { text: 'TennisCoach Auth testen', done: false },
  { text: 'Mission Control deployen', done: false },
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
  const { showToast } = useToast();
  const [todoMode, setTodoMode] = useState<TodoMode>('privat');
  const [calendarView, setCalendarView] = useState<CalendarView>('tag');
  const [noteText, setNoteText] = useState('');

  const activeTodos = todoMode === 'privat' ? privateTodos : projektTodos;

  return (
    <div className="grid-cockpit bg-white">
      {/* [1,1] KPI UEBERSICHT */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">UEBERSICHT</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Termine heute: <span className="font-bold text-black">{calendarEntries.length}</span></p>
          <p>Mails offen: <span className="font-bold text-black">{emails.filter((e) => !e.auto).length}</span></p>
          <p>Todos privat: <span className="font-bold text-black">{privateTodos.filter((t) => !t.done).length}</span></p>
          <p>Todos Projekte: <span className="font-bold text-black">{projektTodos.filter((t) => !t.done).length}</span></p>
          <p className="text-xs text-gray-400 mt-2">Naechster Termin: {calendarEntries[0]?.time} {calendarEntries[0]?.title}</p>
        </div>
      </div>

      {/* [1,2] AUFGABEN */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">AUFGABEN</h3>
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
          {activeTodos.map((todo, i) => (
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

      {/* [1,3] KALENDER */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">KALENDER</h3>
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

      {/* [2,1] POSTEINGANG */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">POSTEINGANG</h3>
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

      {/* [2,2] NOTIZEN */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">NOTIZEN</h3>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Freitext-Editor..."
          rows={8}
          className="w-full border border-gray-300 rounded p-3 text-sm text-black bg-white resize-none"
        />
      </div>

      {/* [2,3] KONTAKTE */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">KONTAKTE</h3>
        <div className="space-y-2">
          {[
            { name: 'Designer', info: 'Letzer Call: gestern' },
            { name: 'Rechtsanwalt', info: 'Vertrag offen' },
            { name: 'Steuerberater', info: 'Quartalsabschluss' },
          ].map((contact) => (
            <div key={contact.name} className="text-sm border-b border-gray-100 pb-1">
              <p className="text-black font-medium">{contact.name}</p>
              <p className="text-xs text-gray-400">{contact.info}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => showToast('Kontakte-Modul kommt in Phase 1')}
          className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded border border-gray-300 cursor-pointer text-xs text-black mt-3"
        >
          Alle Kontakte
        </button>
      </div>

      {/* [3,1] ZUKUENFTIGE MODULE */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">ZUKUENFTIGE MODULE</h3>
        <div className="space-y-2">
          {['E-Mail Agent', 'Finanzen', 'Docs', 'Reisen'].map((mod) => (
            <div key={mod} className="border border-gray-300 rounded p-2 text-center opacity-50">
              <p className="text-sm text-gray-600">{mod}</p>
              <p className="text-xs text-gray-400">Gesperrt</p>
            </div>
          ))}
        </div>
      </div>

      {/* [3,2] TAGESPLAN */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">TAGESPLAN</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Morgen: Standup, Mails checken</p>
          <p>Vormittag: Hebammenbuero Review</p>
          <p>Nachmittag: Designer Call + Testing</p>
          <p>Abend: Familie</p>
        </div>
        <p className="text-xs text-gray-400 mt-3">Automatisch generiert (Mockup)</p>
      </div>

      {/* [3,3] QUICK LINKS */}
      <div className="grid-cell">
        <h3 className="text-sm font-bold text-black mb-3">QUICK LINKS</h3>
        <div className="space-y-2">
          <button
            onClick={() => showToast('Google Calendar oeffnen')}
            className={btnClass + ' w-full text-left'}
          >
            Google Calendar
          </button>
          <button
            onClick={() => showToast('Gmail oeffnen')}
            className={btnClass + ' w-full text-left'}
          >
            Gmail
          </button>
          <button
            onClick={() => showToast('Drive oeffnen')}
            className={btnClass + ' w-full text-left'}
          >
            Google Drive
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3">Integration kommt in Phase 1</p>
      </div>
    </div>
  );
}
