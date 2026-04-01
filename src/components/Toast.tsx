import { createContext, useContext, useState, useCallback, useRef } from 'react'

interface ToastCtx {
  toast: (msg: string) => void
}

const Ctx = createContext<ToastCtx>({ toast: () => {} })

export function useToast() {
  return useContext(Ctx)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState('')
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toast = useCallback((text: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setMsg(text)
    setVisible(true)
    timerRef.current = setTimeout(() => {
      setVisible(false)
      timerRef.current = null
    }, 2500)
  }, [])

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className={`toast${visible ? ' show' : ''}`}>{msg}</div>
    </Ctx.Provider>
  )
}
