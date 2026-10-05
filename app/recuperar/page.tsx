'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check } from 'lucide-react'
import { site } from '@/lib/site'

type Status = 'idle' | 'sending' | 'sent'

export default function RecuperarPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [info, setInfo] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    setFieldError('')
    setInfo('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setStatus('sent')
        return
      }

      // A 429 has no field to blame; validation failures point at the input.
      if (data.fields?.email) {
        setFieldError(data.fields.email)
      } else if (res.status === 429) {
        setInfo(
          data.message || 'Demasiados intentos. Probá de nuevo en unos minutos.'
        )
      } else {
        setError(data.error || 'No pudimos procesar el pedido. Intentá de nuevo.')
      }

      setStatus('idle')
    } catch {
      setError('Error de conexión. Revisá tu internet e intentá de nuevo.')
      setStatus('idle')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#202020] px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">
          Recuperar contraseña
        </h1>
        <p className="mb-8 text-center text-sm text-white/50">
          {status === 'sent'
            ? 'Revisá tu casilla.'
            : `Te enviamos un enlace para restablecer la contraseña de ${site.name}.`}
        </p>

        {status === 'sent' ? (
          <div className="border border-white/10 bg-white/5 p-6 text-center">
            <Check size={24} className="mx-auto mb-3 text-[#09C895]" />
            <p className="text-sm text-white/70">
              Si ese email corresponde a una cuenta, vas a recibir un enlace en
              los próximos minutos. Vence en 15 minutos.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block text-sm text-[#09C895] underline-offset-4 hover:underline"
            >
              Volver a iniciar sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="recuperar-email"
                className="mb-1 block text-sm text-white/60"
              >
                Email
              </label>
              <input
                id="recuperar-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-invalid={fieldError ? true : undefined}
                aria-describedby={fieldError ? 'recuperar-email-error' : undefined}
                className="w-full border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-[#09C895] aria-[invalid=true]:border-red-500"
              />
              {fieldError && (
                <p
                  id="recuperar-email-error"
                  role="alert"
                  className="mt-1.5 text-xs text-red-400"
                >
                  {fieldError}
                </p>
              )}
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}

            {info && (
              <p
                role="status"
                className="border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200"
              >
                {info}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-[#09C895] py-2 font-semibold text-[#202020] transition hover:bg-[#56e4bc] disabled:opacity-50"
            >
              {status === 'sending' ? 'Enviando...' : 'Enviar enlace'}
            </button>

            <p className="text-center text-xs text-white/35">
              <Link href="/login" className="hover:text-white/60">
                Volver a iniciar sesión
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}