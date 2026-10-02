'use client'

import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

type DialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

/**
 * Thin wrapper over Base UI's dialog. The library drives enter/exit through
 * `data-starting-style` / `data-ending-style` on the popup and backdrop, so the
 * transitions are plain CSS instead of a state machine.
 *
 * `modal` keeps focus trapped, and Base UI requires a `Close` inside the popup
 * for that to work — hence the X in the header.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange} modal>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop
          className={cn(
            'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',
            'transition-opacity duration-200 ease-out',
            'data-[starting-style]:opacity-0',
            'data-[ending-style]:opacity-0',
          )}
        />

        <BaseDialog.Popup
          className={cn(
            'fixed top-1/2 left-1/2 z-[60] flex max-h-[calc(100dvh-3rem)] w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/60',
            'transition-all duration-200 ease-out',
            'data-[starting-style]:scale-95 data-[starting-style]:opacity-0',
            'data-[ending-style]:scale-95 data-[ending-style]:opacity-0',
            className,
          )}
        >
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div className="min-w-0">
              <BaseDialog.Title className="text-base font-semibold text-foreground">
                {title}
              </BaseDialog.Title>
              {description && (
                <BaseDialog.Description className="mt-0.5 text-sm text-muted-foreground">
                  {description}
                </BaseDialog.Description>
              )}
            </div>

            <BaseDialog.Close
              aria-label="Cerrar"
              className="-mt-1 -mr-1.5 grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <X className="size-4" />
            </BaseDialog.Close>
          </header>

          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}
