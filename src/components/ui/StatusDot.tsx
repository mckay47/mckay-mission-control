type Status = 'healthy' | 'attention' | 'risk' | 'critical';

interface StatusDotProps {
  status: Status;
  pulse?: boolean;
  className?: string;
}

const dotColorMap: Record<Status, string> = {
  healthy: 'bg-status-healthy',
  attention: 'bg-status-attention',
  risk: 'bg-status-risk',
  critical: 'bg-status-critical',
};

const glowMap: Record<Status, string> = {
  healthy: 'glow-green',
  attention: '',
  risk: 'glow-orange',
  critical: '',
};

export function StatusDot({ status, pulse = true, className = '' }: StatusDotProps) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${dotColorMap[status]} ${glowMap[status]} ${pulse ? 'animate-pulse-glow' : ''} ${className}`}
      aria-label={status}
    />
  );
}
