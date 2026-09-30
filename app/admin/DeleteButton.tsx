'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await fetch(`/api/proyectos/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? '...' : 'Confirmar'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="border border-white/20 px-3 py-1 text-sm hover:border-white/40"
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="border border-white/20 px-3 py-1 text-sm text-red-400 hover:border-red-400"
    >
      Eliminar
    </button>
  )
}
