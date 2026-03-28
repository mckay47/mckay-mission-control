import type { ReactNode, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'border-neon-cyan/30 text-neon-cyan hover:border-neon-cyan/60 hover:box-glow-cyan',
  secondary: 'border-glass-border text-text-secondary hover:border-neon-purple/40 hover:text-text-primary',
  danger: 'border-status-critical/30 text-status-critical hover:border-status-critical/60',
};

export function ActionButton({ label, icon, variant = 'primary', className = '', ...rest }: ActionButtonProps) {
  return (
    <button
      className={`glass inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {label}
    </button>
  );
}
