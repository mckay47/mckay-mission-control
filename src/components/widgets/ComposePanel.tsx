import { useState } from 'react';
import { Mail, Save, Send } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export function ComposePanel() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<'idle' | 'saved' | 'sent'>('idle');

  const handleSave = () => {
    setStatus('saved');
    setTimeout(() => setStatus('idle'), 2000);
  };

  const handleSend = () => {
    setStatus('sent');
    setTimeout(() => {
      setTo('');
      setSubject('');
      setBody('');
      setStatus('idle');
    }, 2000);
  };

  const inputClass =
    'w-full bg-white/[0.03] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-cyan/40 transition-colors';

  return (
    <GlassCard className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/5">
        <Mail className="w-5 h-5 text-neon-pink" />
        <h2 className="text-base font-semibold text-text-primary">Neue Nachricht</h2>
        {status !== 'idle' && (
          <span className="ml-auto text-xs text-neon-green animate-fade-in">
            {status === 'saved' ? 'Entwurf gespeichert' : 'Gesendet'}
          </span>
        )}
      </div>

      {/* Fields */}
      <div className="space-y-3 flex-1">
        <div>
          <label className="block text-xs text-text-muted mb-1.5">An</label>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="empfaenger@email.de"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1.5">Betreff</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Betreff eingeben..."
            className={inputClass}
          />
        </div>

        <div className="flex-1">
          <label className="block text-xs text-text-muted mb-1.5">Nachricht</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Nachricht verfassen..."
            rows={8}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/5 mt-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white/5 border border-white/8 text-text-secondary hover:text-text-primary hover:border-white/15 transition-all"
        >
          <Save className="w-4 h-4" />
          Entwurf speichern
        </button>
        <button
          onClick={handleSend}
          disabled={!to.trim() || !subject.trim()}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all ml-auto"
        >
          <Send className="w-4 h-4" />
          Senden
        </button>
      </div>
    </GlassCard>
  );
}
