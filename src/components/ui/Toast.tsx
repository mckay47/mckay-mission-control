import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Info, X } from 'lucide-react';

interface ToastData {
  id: string;
  message: string;
}

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 3000);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <div className="vision-btn px-5 py-3 flex items-center gap-3 animate-fade-in min-w-[300px]">
      <Info className="w-4 h-4 text-neon-cyan shrink-0" />
      <span className="text-sm text-text-secondary flex-1">{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} className="text-text-muted hover:text-text-primary">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
