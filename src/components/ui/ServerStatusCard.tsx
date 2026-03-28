import { Server } from 'lucide-react';
import { StatusDot } from './StatusDot';
import type { MCPServer, MCPStatus } from '../../data/types';

interface ServerStatusCardProps {
  server?: MCPServer;
  name?: string;
  status?: MCPStatus;
  tools?: number;
  description?: string;
  className?: string;
}

const statusDotMap: Record<MCPStatus, 'healthy' | 'risk' | 'critical'> = {
  connected: 'healthy',
  disconnected: 'risk',
  error: 'critical',
};

const statusLabelMap: Record<MCPStatus, string> = {
  connected: 'Connected',
  disconnected: 'Disconnected',
  error: 'Error',
};

export function ServerStatusCard({ server, name, status, tools, description, className = '' }: ServerStatusCardProps) {
  const resolvedName = server?.name ?? name ?? '';
  const resolvedStatus = server?.status ?? status ?? 'connected';
  const resolvedTools = server?.tools ?? tools ?? 0;
  const resolvedDescription = server?.description ?? description ?? '';

  return (
    <div className={`glass rounded-lg p-4 animate-slide-in ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-glass-bg">
          <Server className="w-4 h-4 text-neon-cyan" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-text-primary truncate">{resolvedName}</h4>
            <StatusDot status={statusDotMap[resolvedStatus]} />
          </div>

          <div className="flex items-center gap-3 mb-2 text-xs text-text-secondary">
            <span>{statusLabelMap[resolvedStatus]}</span>
            <span className="tabular-nums">{resolvedTools} tools</span>
          </div>

          <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{resolvedDescription}</p>
        </div>
      </div>
    </div>
  );
}
