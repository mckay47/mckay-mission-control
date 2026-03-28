import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Terminal, Hammer, Database, Rocket, Check } from 'lucide-react';

interface ProjectActionsProps {
  projectId: string;
}

interface ActionDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  command: (projectId: string) => string;
}

const actions: ActionDef[] = [
  {
    id: 'terminal',
    label: 'Open Terminal',
    icon: <Terminal className="w-3.5 h-3.5" />,
    command: (id) => `cd ~/mckay-os/projects/${id} && claude`,
  },
  {
    id: 'build',
    label: 'Build Feature',
    icon: <Hammer className="w-3.5 h-3.5" />,
    command: (id) => `/build ${id}`,
  },
  {
    id: 'memory',
    label: 'Update Memory',
    icon: <Database className="w-3.5 h-3.5" />,
    command: (id) => `cd ~/mckay-os/projects/${id} && cat MEMORY.md`,
  },
  {
    id: 'deploy',
    label: 'Deploy',
    icon: <Rocket className="w-3.5 h-3.5" />,
    command: (id) => `cd ~/mckay-os/projects/${id} && vercel --prod`,
  },
];

export function ProjectActions({ projectId }: ProjectActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = (action: ActionDef) => {
    navigator.clipboard.writeText(action.command(projectId));
    setCopiedId(action.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/8 text-text-secondary hover:text-text-primary hover:border-white/15 transition-all"
      >
        <MoreVertical className="w-4 h-4" />
        Aktionen
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 rounded-lg bg-elevated border border-glass-border shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleCopy(action)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              {copiedId === action.id ? (
                <Check className="w-3.5 h-3.5 text-neon-green" />
              ) : (
                action.icon
              )}
              <span>{action.label}</span>
              {copiedId === action.id && (
                <span className="ml-auto text-[10px] text-neon-green">Kopiert!</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
