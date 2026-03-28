import { useState } from 'react';
import { ListTodo, Plus } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { ChecklistItem } from '../ui/ChecklistItem';
import { initialTodos } from '../../data/dummy';
import type { TodoItem } from '../../data/types';

export function TodoEditor() {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newTodo: TodoItem = {
      id: `todo-${Date.now()}`,
      text: trimmed,
      done: false,
    };

    setTodos((prev) => [newTodo, ...prev]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleToggle = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
    );
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const doneCount = todos.filter((t) => t.done).length;

  return (
    <GlassCard>
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <ListTodo className="w-5 h-5 text-neon-cyan" />
        <h2 className="text-base font-semibold text-text-primary">To-Do</h2>
        <span className="ml-auto text-xs text-text-muted tabular-nums">
          {doneCount}/{todos.length}
        </span>
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Neues To-Do..."
          className="flex-1 bg-white/[0.03] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-cyan/40 transition-colors"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="p-2.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Todo list */}
      <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
        {todos.map((todo) => (
          <ChecklistItem
            key={todo.id}
            todo={todo}
            onToggle={() => handleToggle(todo.id)}
            onDelete={() => handleDelete(todo.id)}
          />
        ))}
        {todos.length === 0 && (
          <p className="text-sm text-text-muted text-center py-6">
            Keine To-Dos vorhanden
          </p>
        )}
      </div>
    </GlassCard>
  );
}
