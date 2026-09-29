'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#202020] px-6 text-center">
      <h1 className="text-6xl font-bold text-[#09C895]">Error</h1>
      <p className="mt-4 max-w-md text-white/60">
        Algo salió mal. Por favor, intentá nuevamente o contactá al equipo de
        soporte.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-lg bg-[#09C895] px-6 py-3 font-semibold text-[#202020] transition hover:bg-[#56e4bc]"
      >
        Intentar de nuevo
      </button>
    </div>
  )
}
