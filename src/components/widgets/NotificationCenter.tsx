import { Bell } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { NotificationItem } from '../ui/NotificationItem';
import { GlowBadge } from '../ui/GlowBadge';
import { notifications } from '../../data/dummy';

export function NotificationCenter() {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Bell className="w-5 h-5 text-neon-orange" />
          <h2 className="text-base font-semibold text-text-primary">Notifications</h2>
        </div>
        <GlowBadge color="orange">{notifications.length}</GlowBadge>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </GlassCard>
  );
}
