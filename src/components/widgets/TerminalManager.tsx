import { useState } from 'react';
import { TerminalSquare, Copy, Check } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { StatusDot } from '../ui/StatusDot';

interface TerminalSession {
  id: string;
  project: string;
  status: 'active' | 'idle';
  lastCommand: string;
  path: string;
}

const terminals: TerminalSession[] = [
  {
    id: 'term-1',
    project: 'Hebammenbuero',
    status: 'active',
    lastCommand: '/build extended-mockup',
    path: '~/mckay-os/projects/hebammenbuero',
  },
  {
    id: 'term-2',
    project: 'Mission Control',
    status: 'active',
    lastCommand: '/build widgets',
    path: '~/mckay-os/projects/mission-control',
  },
  {
    id: 'term-3',
    project: 'TennisCoach Pro',
    status: 'idle',
    lastCommand: 'git status',
    path: '~/TennisAPP',
  },
];

export function TerminalManager() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (session: TerminalSession) => {
    navigator.clipboard.writeText(`cd ${session.path} && claude`);
    setCopiedId(session.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <GlassCard>
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <TerminalSquare className="w-5 h-5 text-neon-green" />
        <h2 className="text-base font-semibold text-text-primary">Active Terminals</h2>
        <span className="ml-auto text-xs text-text-muted tabular-nums">
          {terminals.filter((t) => t.status === 'active').length} active
        </span>
      </div>

      {/* Terminal cards */}
      <div className="space-y-2.5">
        {terminals.map((session) => (
          <button
            key={session.id}
            onClick={() => handleCopy(session)}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-neon-green/20 hover:bg-white/[0.04] transition-all text-left group"
          >
            <StatusDot
              status={session.status === 'active' ? 'healthy' : 'attention'}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-primary">
                  {session.project}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    session.status === 'active'
                      ? 'bg-neon-green/10 text-neon-green'
                      : 'bg-white/5 text-text-muted'
                  }`}
                >
                  {session.status}
                </span>
              </div>
              <p className="text-xs text-text-muted font-mono mt-0.5 truncate">
                {session.lastCommand}
              </p>
            </div>

            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {copiedId === session.id ? (
                <Check className="w-4 h-4 text-neon-green" />
              ) : (
                <Copy className="w-4 h-4 text-text-muted" />
              )}
            </div>
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
