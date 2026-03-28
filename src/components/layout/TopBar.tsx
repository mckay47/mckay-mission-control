import { useState } from 'react';
import { Bell, Terminal, Check } from 'lucide-react';
import { notifications } from '../../data/dummy';

interface TopBarProps {
  title: string;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function TopBar({ title, isDark, onToggleTheme }: TopBarProps) {
  const [copied, setCopied] = useState(false);
  const notificationCount = notifications.length;

  const handleOpenKani = () => {
    navigator.clipboard.writeText('cd ~/mckay-os && claude').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <header className="h-14 glass border-b border-glass-border flex items-center justify-between px-6 z-30">
      {/* Left: Page title */}
      <h1 className="text-sm font-semibold text-text-primary tracking-wide">
        {title}
      </h1>

      {/* Center: Command input placeholder */}
      <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-lg bg-bg-surface border border-glass-border text-text-muted text-sm w-80">
        <Terminal size={14} className="shrink-0" />
        <span className="opacity-50">Search or run command...</span>
        <kbd className="ml-auto text-[10px] font-mono bg-glass-bg px-1.5 py-0.5 rounded border border-glass-border">
          /
        </kbd>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Open KANI button */}
        <button
          onClick={handleOpenKani}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 hover:bg-neon-cyan/20 transition-all duration-200"
          title="Copy terminal command to clipboard"
        >
          {copied ? <Check size={14} /> : <Terminal size={14} />}
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Open KANI'}</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-glass-bg transition-colors"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Notification bell */}
        <button
          className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-glass-bg transition-colors"
          aria-label={`${notificationCount} notifications`}
        >
          <Bell size={16} />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-neon-orange text-[9px] font-bold text-white tabular-nums">
              {notificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
