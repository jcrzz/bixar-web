'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'

import { cn } from '@/lib/utils'

type ToastVariant = 'success' | 'error' | 'info'

type Toast = {
  id: number
  title: string
  description?: string
  variant: ToastVariant
  leaving: boolean
}

type ToastInput = {
  title: string
  description?: string
  variant?: ToastVariant
}

type ToastContextValue = {
  toast: (input: ToastInput) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const DISMISS_AFTER = 4000
const EXIT_DURATION = 200

const VARIANT_STYLES: Record<
  ToastVariant,
  { Icon: typeof Info; icon: string; bar: string }
> = {
  success: { Icon: CircleCheck, icon: 'text-primary', bar: 'bg-primary' },
  error: { Icon: CircleAlert, icon: 'text-destructive', bar: 'bg-destructive' },
  info: { Icon: Info, icon: 'text-secondary', bar: 'bg-secondary' },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>())

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  // Play the exit animation, then unmount once it has finished.
  const dismiss = useCallback(
    (id: number) => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
      )
      const timer = timers.current.get(id)
      if (timer) clearTimeout(timer)
      timers.current.set(id, setTimeout(() => remove(id), EXIT_DURATION))
    },
    [remove],
  )

  const toast = useCallback(
    ({ title, description, variant = 'success' }: ToastInput) => {
      const id = nextId.current++
      setToasts((prev) => [
        ...prev,
        { id, title, description, variant, leaving: false },
      ])
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), DISMISS_AFTER),
      )
    },
    [dismiss],
  )

  // Don't leave timers running if the provider unmounts with toasts on screen.
  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach(clearTimeout)
      pending.clear()
    }
  }, [])

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end"
      >
        {toasts.map((t) => {
          const { Icon, icon, bar } = VARIANT_STYLES[t.variant]

          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                'pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-lg border border-border bg-card py-3.5 pr-3.5 pl-5 shadow-2xl shadow-black/50',
                t.leaving
                  ? 'animate-out fade-out-80 slide-out-to-right-full duration-200'
                  : 'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200',
              )}
            >
              <span
                aria-hidden
                className={cn('absolute inset-y-0 left-0 w-1', bar)}
              />

              <Icon className={cn('mt-0.5 size-5 shrink-0', icon)} />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-sm text-pretty break-words text-muted-foreground">
                    {t.description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Cerrar aviso"
                className="-m-1 shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <X className="size-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast debe usarse dentro de <ToastProvider>')
  }

  return context
}
