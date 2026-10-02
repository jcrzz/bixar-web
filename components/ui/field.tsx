'use client'

import { cn } from '@/lib/utils'

const CONTROL_BASE =
  'w-full rounded-lg border bg-muted px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-[border-color,box-shadow] duration-150 outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50'

const CONTROL_TONE = (invalid?: boolean) =>
  invalid
    ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/25'
    : 'border-input hover:border-white/25 focus-visible:border-ring focus-visible:ring-ring/25'

type FieldProps = {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  children: React.ReactNode
  className?: string
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-medium tracking-wide text-muted-foreground uppercase"
      >
        {label}
      </label>

      {children}

      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground/80">{hint}</p>
      )}
    </div>
  )
}

type InputProps = React.ComponentProps<'input'> & { invalid?: boolean }

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      className={cn(CONTROL_BASE, CONTROL_TONE(invalid), className)}
      {...props}
    />
  )
}

type TextareaProps = React.ComponentProps<'textarea'> & { invalid?: boolean }

export function Textarea({ className, invalid, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        CONTROL_BASE,
        CONTROL_TONE(invalid),
        'resize-y leading-relaxed',
        className,
      )}
      {...props}
    />
  )
}
