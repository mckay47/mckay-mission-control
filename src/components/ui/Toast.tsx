import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { CheckCircle, AlertTriangle, XCircle, Loader2, Info, X } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'warning' | 'loading' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number // ms, 0 = persistent (for loading)
  progress?: number // 0-100, shows progress bar when set
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  updateToast: (id: string, updates: Partial<Omit<Toast, 'id'>>) => void
}

// ─── Context ─────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

// ─── Icons & Colors ──────────────────────────────────────────
const toastConfig: Record<ToastType, { icon: typeof CheckCircle; color: string; glow: string }> = {
  success: { icon: CheckCircle, color: '#00FF88', glow: 'rgba(0,255,136,0.25)' },
  error:   { icon: XCircle,     color: '#FF2D55', glow: 'rgba(255,45,85,0.25)' },
  warning: { icon: AlertTriangle, color: '#FFD600', glow: 'rgba(255,214,0,0.25)' },
  loading: { icon: Loader2,     color: '#00F0FF', glow: 'rgba(0,240,255,0.25)' },
  info:    { icon: Info,        color: '#8B5CF6', glow: 'rgba(139,92,246,0.25)' },
}

// ─── Single Toast Item ───────────────────────────────────────
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [exiting, setExiting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const cfg = toastConfig[toast.type]
  const Icon = cfg.icon

  const dismiss = useCallback(() => {
    setExiting(true)
    setTimeout(() => onRemove(toast.id), 280)
  }, [toast.id, onRemove])

  useEffect(() => {
    const dur = toast.duration ?? (toast.type === 'loading' ? 0 : 4000)
    if (dur > 0) {
      timerRef.current = setTimeout(dismiss, dur)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [toast.duration, toast.type, dismiss])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '12px 14px',
        borderRadius: 12,
        background: 'rgba(15,15,24,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${cfg.color}25`,
        boxShadow: `0 0 20px ${cfg.glow}, 0 4px 24px rgba(0,0,0,0.5)`,
        minWidth: 280,
        maxWidth: 380,
        transform: exiting ? 'translateX(120%)' : 'translateX(0)',
        opacity: exiting ? 0 : 1,
        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease',
        animation: 'toast-slide-in 0.32s cubic-bezier(0.16,1,0.3,1)',
        cursor: toast.type !== 'loading' ? 'pointer' : 'default',
      }}
      onClick={() => toast.type !== 'loading' && dismiss()}
    >
      {/* Icon */}
      <div style={{
        flexShrink: 0,
        marginTop: 1,
        animation: toast.type === 'loading' ? 'toast-spin 1s linear infinite' : undefined,
      }}>
        <Icon size={16} color={cfg.color} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12,
          fontWeight: 700,
          color: cfg.color,
          lineHeight: 1.3,
        }}>
          {toast.title}
        </div>
        {toast.message && (
          <div style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.55)',
            marginTop: 3,
            lineHeight: 1.4,
          }}>
            {toast.message}
          </div>
        )}
        {toast.progress !== undefined && (
          <div style={{ width: '100%', height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)', marginTop: 6, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, Math.max(0, toast.progress))}%`, height: '100%', borderRadius: 2, background: cfg.color, transition: 'width 0.4s ease' }} />
          </div>
        )}
      </div>

      {/* Close */}
      {toast.type !== 'loading' && (
        <button
          onClick={(e) => { e.stopPropagation(); dismiss() }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 2,
            flexShrink: 0,
            opacity: 0.4,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
        >
          <X size={12} color="rgba(255,255,255,0.6)" />
        </button>
      )}
    </div>
  )
}

// ─── Provider ────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counterRef = useRef(0)

  const addToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = `toast-${++counterRef.current}-${Date.now()}`
    setToasts(prev => [...prev, { ...t, id }])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const updateToast = useCallback((id: string, updates: Partial<Omit<Toast, 'id'>>) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, updateToast }}>
      {children}

      {/* Toast container — fixed bottom-right */}
      <div style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: 8,
        zIndex: 9999,
        pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem toast={t} onRemove={removeToast} />
          </div>
        ))}
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes toast-slide-in {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes toast-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </ToastContext.Provider>
  )
}
