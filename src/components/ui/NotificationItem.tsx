import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Notification } from '../../data/types';

type NotificationType = 'info' | 'warning' | 'success' | 'error';

interface NotificationItemProps {
  notification?: Notification;
  title?: string;
  message?: string;
  time?: string;
  type?: NotificationType;
  action?: ReactNode;
  className?: string;
}

const iconMap: Record<NotificationType, ReactNode> = {
  info: <Info className="w-4 h-4 text-neon-cyan" />,
  warning: <AlertTriangle className="w-4 h-4 text-status-attention" />,
  success: <CheckCircle className="w-4 h-4 text-neon-green" />,
  error: <XCircle className="w-4 h-4 text-status-critical" />,
};

const borderMap: Record<NotificationType, string> = {
  info: 'border-l-neon-cyan',
  warning: 'border-l-status-attention',
  success: 'border-l-neon-green',
  error: 'border-l-status-critical',
};

export function NotificationItem({ notification, title, message, time, type, action, className = '' }: NotificationItemProps) {
  const resolvedTitle = notification?.title ?? title ?? '';
  const resolvedMessage = notification?.message ?? message ?? '';
  const resolvedTime = notification?.time ?? time ?? '';
  const resolvedType = notification?.type ?? type ?? 'info';

  return (
    <div className={`glass rounded-lg p-3 border-l-2 ${borderMap[resolvedType]} animate-slide-in ${className}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">{iconMap[resolvedType]}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium text-text-primary">{resolvedTitle}</h4>
            <span className="text-xs text-text-muted flex-shrink-0 tabular-nums">{resolvedTime}</span>
          </div>
          <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{resolvedMessage}</p>
          {action && <div className="mt-2">{action}</div>}
        </div>
      </div>
    </div>
  );
}
