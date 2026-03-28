import { useState, useRef } from 'react';
import { Search, CornerDownLeft } from 'lucide-react';

interface CommandInputProps {
  placeholder?: string;
  onSubmit?: (value: string) => void;
  className?: string;
}

export function CommandInput({ placeholder = 'Type a command...', onSubmit, className = '' }: CommandInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (value.trim() && onSubmit) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  return (
    <div className={`glass rounded-lg flex items-center gap-2 px-3 py-2 group focus-within:border-neon-cyan/30 transition-colors duration-200 ${className}`}>
      <Search className="w-4 h-4 text-text-muted flex-shrink-0" />

      <span className="text-text-muted text-sm select-none">/</span>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
      />

      {value && (
        <button
          onClick={handleSubmit}
          className="text-text-muted hover:text-neon-cyan transition-colors cursor-pointer"
          aria-label="Submit command"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
