import { useState } from 'react';
import { Database, RefreshCw } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InlineEditor } from '../ui/InlineEditor';
import { memoryEntries as initialEntries } from '../../data/dummy';
import type { MemoryEntry } from '../../data/types';

export function MemoryViewer() {
  const [entries, setEntries] = useState<MemoryEntry[]>(initialEntries);
  const [saved, setSaved] = useState(false);

  const handleValueChange = (id: string, newValue: string) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, value: newValue } : entry))
    );
  };

  const handleUpdate = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <GlassCard>
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <Database className="w-5 h-5 text-neon-purple" />
        <h2 className="text-base font-semibold text-text-primary">MEMORY.md</h2>
        <div className="ml-auto flex items-center gap-2">
          {saved && (
            <span className="text-xs text-neon-green animate-fade-in">Updated</span>
          )}
          <button
            onClick={handleUpdate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-neon-purple/10 border border-neon-purple/20 text-neon-purple hover:bg-neon-purple/20 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Update Memory
          </button>
        </div>
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-col gap-1.5 p-3 rounded-lg bg-white/[0.02] border border-white/5"
          >
            <span className="text-xs font-medium text-neon-cyan/70 uppercase tracking-wider">
              {entry.key}
            </span>
            <InlineEditor
              value={entry.value}
              onChange={(newValue) => handleValueChange(entry.id, newValue)}
            />
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
