interface SectionLabelProps {
  number: string;
  title: string;
  className?: string;
}

export function SectionLabel({ number, title, className = '' }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-3 mb-4 ${className}`}>
      <span className="hud-label">
        <span>{number}</span> / {title}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-neon-cyan/20 to-transparent" />
    </div>
  );
}
