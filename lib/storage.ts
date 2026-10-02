import { writeFile } from 'fs/promises'
import path from 'path'
import { put } from '@vercel/blob'

import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from '@/lib/upload-rules'

export class UploadError extends Error {}

/**
 * Stores an uploaded image and returns the URL to persist on the project.
 *
 * In production this goes to Vercel Blob, because Vercel's filesystem is
 * read-only and wiped on every deploy. Without a token we fall back to
 * `public/uploads` so local development keeps working, but we refuse to
 * pretend that works in production where it would silently lose files.
 */
export async function storeImage(file: File): Promise<string> {
  if (!file.size) {
    throw new UploadError('El archivo está vacío')
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new UploadError('La imagen supera el límite de 10 MB')
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new UploadError('Formato no permitido. Usá JPG, PNG, WebP, AVIF o GIF.')
  }

  const extension = path.extname(file.name) || '.jpg'
  const key = `uploads/${Date.now()}-${crypto.randomUUID().slice(0, 8)}${extension}`

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { url } = await put(key, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
    })
    return url
  }

  if (process.env.NODE_ENV === 'production') {
    throw new UploadError(
      'BLOB_READ_WRITE_TOKEN no está configurado. Sin él no se pueden guardar imágenes en producción.'
    )
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  const filename = path.basename(key)
  await writeFile(
    path.join(process.cwd(), 'public', 'uploads', filename),
    bytes
  )

  return `/uploads/${filename}`
}
