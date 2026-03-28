import { useState } from 'react';
import { Terminal, Hammer, Database, Rocket, ScrollText, Check } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface ProjectActionsProps {
  projectId: string;
}

interface ActionDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  command: (projectId: string) => string;
  color: string;
  hoverColor: string;
}

const actions: ActionDef[] = [
  {
    id: 'terminal',
    label: 'Open Terminal',
    icon: <Terminal className="w-4 h-4" />,
    command: (id) => `cd ~/mckay-os/projects/${id} && claude`,
    color: 'text-neon-cyan border-neon-cyan/20 bg-neon-cyan/10',
    hoverColor: 'hover:bg-neon-cyan/20',
  },
  {
    id: 'build',
    label: 'Build Feature',
    icon: <Hammer className="w-4 h-4" />,
    command: (id) => `/build ${id}`,
    color: 'text-neon-green border-neon-green/20 bg-neon-green/10',
    hoverColor: 'hover:bg-neon-green/20',
  },
  {
    id: 'memory',
    label: 'Update Memory',
    icon: <Database className="w-4 h-4" />,
    command: (id) => `cd ~/mckay-os/projects/${id} && cat MEMORY.md`,
    color: 'text-neon-purple border-neon-purple/20 bg-neon-purple/10',
    hoverColor: 'hover:bg-neon-purple/20',
  },
  {
    id: 'deploy',
    label: 'Deploy',
    icon: <Rocket className="w-4 h-4" />,
    command: (id) => `cd ~/mckay-os/projects/${id} && vercel --prod`,
    color: 'text-neon-pink border-neon-pink/20 bg-neon-pink/10',
    hoverColor: 'hover:bg-neon-pink/20',
  },
  {
    id: 'logs',
    label: 'View Logs',
    icon: <ScrollText className="w-4 h-4" />,
    command: (id) => `cd ~/mckay-os/projects/${id} && vercel logs`,
    color: 'text-neon-orange border-neon-orange/20 bg-neon-orange/10',
    hoverColor: 'hover:bg-neon-orange/20',
  },
];

export function ProjectActions({ projectId }: ProjectActionsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (action: ActionDef) => {
    navigator.clipboard.writeText(action.command(projectId));
    setCopiedId(action.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <GlassCard>
      <h2 className="text-base font-semibold text-text-primary mb-4">Project Actions</h2>

      <div className="space-y-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleCopy(action)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg border transition-all ${action.color} ${action.hoverColor}`}
          >
            {copiedId === action.id ? (
              <Check className="w-4 h-4 text-neon-green" />
            ) : (
              action.icon
            )}
            <span>{action.label}</span>
            {copiedId === action.id && (
              <span className="ml-auto text-[10px] text-neon-green">Copied!</span>
            )}
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
