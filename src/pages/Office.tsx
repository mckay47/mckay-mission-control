import { useState } from 'react';
import { useToast } from '../components/ui';

type TodoMode = 'privat' | 'projekte';
type CalendarView = 'tag' | 'woche' | 'monat';

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
    <div className="grid-cockpit">
      {/* [1,1] KPI UEBERSICHT */}
      <div className="grid-cell">
        <h3 className="cell-title">UEBERSICHT</h3>
        <div className="space-y-2 text-sm text-[#7B8DB5]">
          <p>Termine heute: <span className="stat-number text-base">{calendarEntries.length}</span></p>
          <p>Mails offen: <span className="stat-number text-base">{emails.filter((e) => !e.auto).length}</span></p>
          <p>Todos privat: <span className="stat-number text-base">{privateTodos.filter((t) => !t.done).length}</span></p>
          <p>Todos Projekte: <span className="stat-number text-base">{projektTodos.filter((t) => !t.done).length}</span></p>
          <p className="text-xs text-[#4A5A7A] mt-2">Naechster Termin: {calendarEntries[0]?.time} {calendarEntries[0]?.title}</p>
        </div>
      </div>

      {/* [1,2] AUFGABEN */}
      <div className="grid-cell">
        <h3 className="cell-title">AUFGABEN</h3>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setTodoMode('privat')}
            className={`px-3 py-1 rounded-lg border text-sm cursor-pointer transition-all ${
              todoMode === 'privat'
                ? 'bg-[rgba(0,240,255,0.1)] border-[rgba(0,240,255,0.3)] text-[#00F0FF] font-bold'
                : 'cell-btn'
            }`}
          >
            Privat
          </button>
          <button
            onClick={() => setTodoMode('projekte')}
            className={`px-3 py-1 rounded-lg border text-sm cursor-pointer transition-all ${
              todoMode === 'projekte'
                ? 'bg-[rgba(0,240,255,0.1)] border-[rgba(0,240,255,0.3)] text-[#00F0FF] font-bold'
                : 'cell-btn'
            }`}
          >
            Projekte
          </button>
        </div>
        <div className="space-y-2">
          {activeTodos.map((todo, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-[#E0E6F0]">
              <span className="text-[#4A5A7A]">{todo.done ? '[x]' : '[ ]'}</span>
              <span>{todo.text}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => showToast('Neues Todo')}
          className="cell-btn mt-3"
        >
          + Neues Todo
        </button>
      </div>

      {/* [1,3] KALENDER */}
      <div className="grid-cell">
        <h3 className="cell-title">KALENDER</h3>
        <p className="text-sm text-[#7B8DB5] mb-3">
          Heute {new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
        </p>
        <div className="space-y-2 mb-4">
          {calendarEntries.map((entry, i) => (
            <div key={i} className="text-sm text-[#E0E6F0] flex gap-2">
              <span className="text-[#00F0FF] font-mono">{entry.time}</span>
              <span>{entry.title}</span>
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
              className={`px-3 py-1 rounded-lg border text-xs cursor-pointer transition-all ${
                calendarView === view
                  ? 'bg-[rgba(0,240,255,0.1)] border-[rgba(0,240,255,0.3)] text-[#00F0FF] font-bold'
                  : 'cell-btn-sm'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* [2,1] POSTEINGANG */}
      <div className="grid-cell">
        <h3 className="cell-title">POSTEINGANG</h3>
        <div className="space-y-3">
          {emails.map((email, i) => (
            <div key={i} className={`glass-inner ${email.auto ? 'opacity-50' : ''}`}>
              <p className="text-sm font-bold text-[#E0E6F0]">{email.subject}</p>
              <p className="text-xs text-[#7B8DB5]">von: {email.from}</p>
              {!email.auto && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => showToast('Antworten: ' + email.subject)}
                    className="cell-btn-sm"
                  >
                    Antworten
                  </button>
                  <button
                    onClick={() => showToast('Geparkt: ' + email.subject)}
                    className="cell-btn-sm"
                  >
                    Parken
                  </button>
                </div>
              )}
            </div>
          ))}
          <p className="text-xs text-[#4A5A7A]">3 ignoriert</p>
        </div>
      </div>

      {/* [2,2] NOTIZEN */}
      <div className="grid-cell">
        <h3 className="cell-title">NOTIZEN</h3>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Freitext-Editor..."
          rows={8}
          className="w-full glass-input resize-none"
          style={{ borderRadius: '12px', padding: '12px' }}
        />
      </div>

      {/* [2,3] KONTAKTE */}
      <div className="grid-cell">
        <h3 className="cell-title">KONTAKTE</h3>
        <div className="space-y-2">
          {[
            { name: 'Designer', info: 'Letzer Call: gestern' },
            { name: 'Rechtsanwalt', info: 'Vertrag offen' },
            { name: 'Steuerberater', info: 'Quartalsabschluss' },
          ].map((contact) => (
            <div key={contact.name} className="text-sm border-b border-white/5 pb-1">
              <p className="text-[#E0E6F0] font-medium">{contact.name}</p>
              <p className="text-xs text-[#4A5A7A]">{contact.info}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => showToast('Kontakte-Modul kommt in Phase 1')}
          className="cell-btn-sm mt-3"
        >
          Alle Kontakte
        </button>
      </div>

      {/* [3,1] ZUKUENFTIGE MODULE */}
      <div className="grid-cell">
        <h3 className="cell-title">ZUKUENFTIGE MODULE</h3>
        <div className="space-y-2">
          {['E-Mail Agent', 'Finanzen', 'Docs', 'Reisen'].map((mod) => (
            <div key={mod} className="glass-inner text-center opacity-50">
              <p className="text-sm text-[#7B8DB5]">{mod}</p>
              <p className="text-xs text-[#4A5A7A]">Gesperrt</p>
            </div>
          ))}
        </div>
      </div>

      {/* [3,2] TAGESPLAN */}
      <div className="grid-cell">
        <h3 className="cell-title">TAGESPLAN</h3>
        <div className="space-y-2 text-sm text-[#7B8DB5]">
          <p>Morgen: Standup, Mails checken</p>
          <p>Vormittag: Hebammenbuero Review</p>
          <p>Nachmittag: Designer Call + Testing</p>
          <p>Abend: Familie</p>
        </div>
        <p className="text-xs text-[#4A5A7A] mt-3">Automatisch generiert (Mockup)</p>
      </div>

      {/* [3,3] QUICK LINKS */}
      <div className="grid-cell">
        <h3 className="cell-title">QUICK LINKS</h3>
        <div className="space-y-2">
          <button
            onClick={() => showToast('Google Calendar oeffnen')}
            className="cell-btn w-full text-left"
          >
            Google Calendar
          </button>
          <button
            onClick={() => showToast('Gmail oeffnen')}
            className="cell-btn w-full text-left"
          >
            Gmail
          </button>
          <button
            onClick={() => showToast('Drive oeffnen')}
            className="cell-btn w-full text-left"
          >
            Google Drive
          </button>
        </div>
        <p className="text-xs text-[#4A5A7A] mt-3">Integration kommt in Phase 1</p>
      </div>
    </div>
  );
}
