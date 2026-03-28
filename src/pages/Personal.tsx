import { User } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { TodoEditor } from '../components/widgets/TodoEditor';
import { ComposePanel } from '../components/widgets/ComposePanel';
import { NoteEditor } from '../components/widgets/NoteEditor';

export function Personal() {
  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <User className="w-7 h-7 text-neon-pink" />
        <h1 className="text-3xl font-bold text-neon-pink text-glow-pink">Personal</h1>
      </div>
      <p className="text-sm text-text-muted mb-8">To-Do &middot; Compose &middot; Notes</p>

      {/* Three-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TodoEditor />
        <ComposePanel />
        <NoteEditor />
      </div>
    </PageContainer>
  );
}
