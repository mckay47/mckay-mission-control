import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
  className?: string;
}

export function ThemeToggle({ isDark, toggle, className = '' }: ThemeToggleProps) {
  return (
    <button
      onClick={toggle}
      className={`glass rounded-lg p-2 border border-glass-border transition-all duration-300 cursor-pointer hover:border-neon-cyan/30 ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-neon-yellow transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-neon-purple transition-transform duration-300" />
      )}
    </button>
  );
}
