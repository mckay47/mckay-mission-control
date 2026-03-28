import { User } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { SectionLabel } from '../components/ui/SectionLabel';
import { TodoEditor } from '../components/widgets/TodoEditor';
import { ComposePanel } from '../components/widgets/ComposePanel';
import { NoteEditor } from '../components/widgets/NoteEditor';

export function Personal() {
  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-1">
          <User className="w-7 h-7 text-neon-pink" />
          <h1 className="text-3xl font-bold text-neon-pink text-glow-pink">Personal</h1>
        </div>
        <p className="text-sm text-text-muted">To-Do &middot; Notizen &middot; Nachrichten</p>
      </div>

      {/* Three-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="animate-fade-in stagger-1">
          <SectionLabel number="01" title="TODOS" />
          <TodoEditor />
        </div>
        <div className="animate-fade-in stagger-2">
          <SectionLabel number="02" title="NOTIZEN" />
          <NoteEditor />
        </div>
        <div className="animate-fade-in stagger-3">
          <SectionLabel number="03" title="NACHRICHTEN" />
          <ComposePanel />
        </div>
      </div>
    </PageContainer>
  );
}
