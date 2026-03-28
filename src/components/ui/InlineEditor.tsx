import { useState, useRef, useEffect } from 'react';

interface InlineEditorProps {
  value: string;
  onChange?: (newValue: string) => void;
  className?: string;
}

export function InlineEditor({ value, onChange, className = '' }: InlineEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const commit = () => {
    setIsEditing(false);
    if (draft !== value) {
      onChange?.(draft);
    }
  };

  const cancel = () => {
    setDraft(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') cancel();
        }}
        className={`bg-glass-bg border border-neon-cyan/30 rounded px-2 py-1 text-sm text-text-primary outline-none ${className}`}
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      onKeyDown={(e) => e.key === 'Enter' && setIsEditing(true)}
      tabIndex={0}
      role="button"
      className={`text-sm text-text-primary cursor-text hover:border-b hover:border-dashed hover:border-text-muted transition-colors ${className}`}
    >
      {value}
    </span>
  );
}
