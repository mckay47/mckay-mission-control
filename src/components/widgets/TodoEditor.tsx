import { useState, useMemo } from 'react';
import { ListTodo, Plus, ArrowRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { ChecklistItem } from '../ui/ChecklistItem';
import { initialTodos, projects } from '../../data/dummy';
import type { TodoItem } from '../../data/types';

interface TodoEditorProps {
  projectId?: string;
  onSendPrompt?: (text: string) => void;
}

function formatDeadline(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  return `bis ${day}.${month}.`;
}

function getProjectName(projectId: string): string {
  const project = projects.find((p) => p.id === projectId);
  return project?.name ?? projectId;
}

export function TodoEditor({ projectId, onSendPrompt }: TodoEditorProps) {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [input, setInput] = useState('');
  const [deadlineInput, setDeadlineInput] = useState('');

  const filteredTodos = useMemo(() => {
    if (projectId) return todos.filter((t) => t.projectId === projectId);
    return todos;
  }, [todos, projectId]);

  const groupedTodos = useMemo(() => {
    if (projectId) return null;
    const groups: Record<string, TodoItem[]> = {};
    const noProject: TodoItem[] = [];

    for (const todo of filteredTodos) {
      if (todo.projectId) {
        if (!groups[todo.projectId]) groups[todo.projectId] = [];
        groups[todo.projectId].push(todo);
      } else {
        noProject.push(todo);
      }
    }

    return { groups, noProject };
  }, [filteredTodos, projectId]);

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newTodo: TodoItem = {
      id: `todo-${Date.now()}`,
      text: trimmed,
      done: false,
      ...(deadlineInput ? { deadline: deadlineInput } : {}),
      ...(projectId ? { projectId } : {}),
    };

    setTodos((prev) => [newTodo, ...prev]);
    setInput('');
    setDeadlineInput('');
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

  const doneCount = filteredTodos.filter((t) => t.done).length;

  const renderTodoItem = (todo: TodoItem) => (
    <div key={todo.id} className="group/todo flex items-center gap-2">
      <div className="flex-1">
        <ChecklistItem
          todo={todo}
          onToggle={() => handleToggle(todo.id)}
          onDelete={() => handleDelete(todo.id)}
        />
      </div>
      {onSendPrompt && !todo.done && (
        <button
          onClick={() => onSendPrompt(`Todo umsetzen: ${todo.text}`)}
          className="p-1 rounded text-neon-cyan opacity-0 group-hover/todo:opacity-100 hover:bg-neon-cyan/10 transition-all flex-shrink-0"
          title="Als Prompt senden"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
      {todo.deadline && (
        <span className="text-[10px] text-text-muted tabular-nums whitespace-nowrap flex-shrink-0">
          {formatDeadline(todo.deadline)}
        </span>
      )}
    </div>
  );

  return (
    <GlassCard>
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <ListTodo className="w-5 h-5 text-neon-cyan" />
        <h2 className="text-base font-semibold text-text-primary">To-Do</h2>
        <span className="ml-auto text-xs text-text-muted tabular-nums">
          {doneCount}/{filteredTodos.length}
        </span>
      </div>

      {/* Input row with deadline */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Neues To-Do..."
          className="flex-1 bg-white/[0.03] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-cyan/40 transition-colors"
        />
        <input
          type="date"
          value={deadlineInput}
          onChange={(e) => setDeadlineInput(e.target.value)}
          className="w-[130px] bg-white/[0.03] border border-white/8 rounded-lg px-3 py-2.5 text-xs text-text-secondary focus:outline-none focus:border-neon-cyan/40 transition-colors [color-scheme:dark]"
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
      <div className="space-y-1 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
        {projectId ? (
          <>
            {filteredTodos.map(renderTodoItem)}
            {filteredTodos.length === 0 && (
              <p className="text-sm text-text-muted text-center py-6">
                Keine To-Dos vorhanden
              </p>
            )}
          </>
        ) : groupedTodos ? (
          <>
            {Object.entries(groupedTodos.groups).map(([projId, items]) => (
              <div key={projId} className="mb-3">
                <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1.5 mt-2">
                  {getProjectName(projId)}
                </h3>
                {items.map(renderTodoItem)}
              </div>
            ))}
            {groupedTodos.noProject.length > 0 && (
              <div className="mb-3">
                <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1.5 mt-2">
                  Allgemein
                </h3>
                {groupedTodos.noProject.map(renderTodoItem)}
              </div>
            )}
            {filteredTodos.length === 0 && (
              <p className="text-sm text-text-muted text-center py-6">
                Keine To-Dos vorhanden
              </p>
            )}
          </>
        ) : null}
      </div>
    </GlassCard>
  );
}
