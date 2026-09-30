'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NuevoProyectoPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [cover, setCover] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/proyectos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, description, cover, images }),
    })

    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Error al crear proyecto')
      setLoading(false)
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()

    if (data.url) {
      if (!cover) {
        setCover(data.url)
      } else {
        setImages([...images, data.url])
      }
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-6 text-xl font-semibold">Nuevo Proyecto</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-white/60">Título</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-[#09C895]"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-white/60">Categoría</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-[#09C895]"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-white/60">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={6}
            className="w-full border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-[#09C895]"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-white/60">
            Imagen de portada
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="w-full text-white/60"
          />
          {cover && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={cover} alt="Portada" className="mt-2 h-32 w-32 object-cover" />
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-white/60">
            Imágenes de galería
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="w-full text-white/60"
          />
          <div className="mt-2 flex gap-2">
            {images.map((img, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={i} src={img} alt="" className="h-16 w-16 object-cover" />
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#09C895] px-4 py-2 font-semibold text-[#202020] transition hover:bg-[#56e4bc] disabled:opacity-50"
        >
          {loading ? 'Creando...' : 'Crear Proyecto'}
        </button>
      </form>
    </div>
  )
}
