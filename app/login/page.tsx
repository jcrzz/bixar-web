'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { site } from '@/lib/site'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Credenciales inválidas')
        setLoading(false)
      }
    } catch {
      setError('Error al iniciar sesión')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#202020] px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-bold text-white">
          Panel de Administración
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="mb-1 block text-sm text-white/60"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-[#09C895]"
            />
          </div>

          <div>
            <div className="mb-1 flex items-baseline justify-between">
              <label
                htmlFor="login-password"
                className="block text-sm text-white/60"
              >
                Contraseña
              </label>
              <Link
                href="/recuperar"
                className="text-xs text-white/45 underline-offset-4 transition hover:text-[#09C895] hover:underline"
              >
                ¿La olvidaste?
              </Link>
            </div>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-[#09C895]"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#09C895] py-2 font-semibold text-[#202020] transition hover:bg-[#56e4bc] disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-white/30">
          <Link href="/" className="transition hover:text-white/60">
            Volver a {site.name}
          </Link>
        </p>
      </div>
    </div>
  )
}