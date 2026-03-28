import { useState } from 'react';
import { FileText, Activity, RefreshCw, Rocket } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { ActionButton } from '../ui/ActionButton';

interface QuickAction {
  command: string;
  label: string;
  icon: React.ReactNode;
  color: 'cyan' | 'green' | 'orange' | 'pink';
}

const actions: QuickAction[] = [
  { command: '/brief', label: 'Daily Brief', icon: <FileText className="w-5 h-5" />, color: 'cyan' },
  { command: '/status', label: 'Status Check', icon: <Activity className="w-5 h-5" />, color: 'green' },
  { command: '/sync', label: 'Sync Memory', icon: <RefreshCw className="w-5 h-5" />, color: 'orange' },
  { command: '/launch', label: 'Launch New', icon: <Rocket className="w-5 h-5" />, color: 'pink' },
];

export function QuickActions() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const handleCopy = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    setTimeout(() => setCopiedCommand(null), 1500);
  };

  return (
    <GlassCard>
      <h2 className="text-base font-semibold text-text-primary mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <div key={action.command} className="relative">
            <ActionButton
              icon={action.icon}
              label={action.label}
              color={action.color}
              onClick={() => handleCopy(action.command)}
            />
            {copiedCommand === action.command && (
              <span className="absolute -top-2 right-0 text-[10px] text-neon-green animate-fade-in">
                Copied!
              </span>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
