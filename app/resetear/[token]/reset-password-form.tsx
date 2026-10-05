'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check } from 'lucide-react'

type Status = 'idle' | 'saving' | 'done'

const MIN_PASSWORD_LENGTH = 12

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    // Checked here too, not only on the server: the mismatch is between two
    // fields of this form, and telling the user before a round-trip is the
    // difference between instant feedback and a second of dead air.
    const nextErrors: Record<string, string> = {}

    if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
    }
    if (password !== confirm) {
      nextErrors.confirm = 'Las contraseñas no coinciden'
    }

    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('saving')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setStatus('done')
        return
      }

      setFieldErrors({ ...(data.fields ?? {}) })
      setError(
        res.status === 429
          ? 'Demasiados intentos. Probá de nuevo en unos minutos.'
          : data.error || 'No pudimos actualizar la contraseña. Intentá de nuevo.'
      )
      setStatus('idle')
    } catch {
      setError('Error de conexión. Revisá tu internet e intentá de nuevo.')
      setStatus('idle')
    }
  }

  if (status === 'done') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#202020] px-4">
        <div className="w-full max-w-sm border border-white/10 bg-white/5 p-8 text-center">
          <Check size={28} className="mx-auto mb-4 text-[#09C895]" />
          <h1 className="mb-2 text-lg font-bold text-white">
            Contraseña actualizada
          </h1>
          <p className="mb-6 text-sm text-white/60">
            Ya podés entrar con la nueva contraseña. Por seguridad, cerramos las
            sesiones que estaban abiertas en otros dispositivos.
          </p>
          <Link
            href="/login"
            className="inline-block bg-[#09C895] px-6 py-2 font-semibold text-[#202020] transition hover:bg-[#56e4bc]"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#202020] px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">
          Elegí una nueva contraseña
        </h1>
        <p className="mb-8 text-center text-sm text-white/50">
          Mínimo {MIN_PASSWORD_LENGTH} caracteres.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="new-password"
              className="mb-1 block text-sm text-white/60"
            >
              Nueva contraseña
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-invalid={fieldErrors.password ? true : undefined}
              aria-describedby={
                fieldErrors.password ? 'new-password-error' : undefined
              }
              className="w-full border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-[#09C895] aria-[invalid=true]:border-red-500"
            />
            {fieldErrors.password && (
              <p
                id="new-password-error"
                role="alert"
                className="mt-1.5 text-xs text-red-400"
              >
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1 block text-sm text-white/60"
            >
              Repetí la contraseña
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              aria-invalid={fieldErrors.confirm ? true : undefined}
              aria-describedby={
                fieldErrors.confirm ? 'confirm-password-error' : undefined
              }
              className="w-full border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-[#09C895] aria-[invalid=true]:border-red-500"
            />
            {fieldErrors.confirm && (
              <p
                id="confirm-password-error"
                role="alert"
                className="mt-1.5 text-xs text-red-400"
              >
                {fieldErrors.confirm}
              </p>
            )}
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'saving'}
            className="w-full bg-[#09C895] py-2 font-semibold text-[#202020] transition hover:bg-[#56e4bc] disabled:opacity-50"
          >
            {status === 'saving' ? 'Guardando...' : 'Guardar contraseña'}
          </button>

          <p className="text-center text-xs text-white/35">
            <Link href="/login" className="hover:text-white/60">
              Volver a iniciar sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}