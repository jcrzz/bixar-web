import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { put } from '@vercel/blob'

import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from '@/lib/upload-rules'

export class UploadError extends Error {}

/**
 * Stores an uploaded image and returns the URL to persist on the project.
 *
 * Production writes to Vercel Blob, because Vercel's filesystem is read-only
 * and wiped on every deploy. Local development falls back to `public/uploads`
 * when no token is configured, and refuses to pretend otherwise in production
 * where it would lose files.
 *
 * The fallback is deliberately limited to the *absent* token. A token that is
 * present but rejected — private store, rotated value, revoked scopes — is a
 * misconfiguration, not a missing feature, so it fails loudly in development
 * too. Otherwise a stale token would keep working against `public/uploads`
 * locally and only break in production, which is the worst way to find out.
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
  const token = process.env.BLOB_READ_WRITE_TOKEN

  if (token) {
    try {
      const { url } = await put(key, file, {
        access: 'public',
        token,
        addRandomSuffix: false,
      })
      return url
    } catch (error) {
      // Surface the SDK's own wording. It names the exact cause — e.g. "Cannot
      // use public access on a private store" — which is a one-line fix, versus
      // a generic "Error al subir archivo" that hides it entirely.
      throw new UploadError(
        `No se pudo guardar la imagen en Vercel Blob: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  } else if (process.env.NODE_ENV === 'production') {
    throw new UploadError(
      'BLOB_READ_WRITE_TOKEN no está configurado. Sin él no se pueden guardar imágenes en producción.'
    )
  } else {
    console.warn(
      '[storage] BLOB_READ_WRITE_TOKEN no configurado; guardando en public/uploads. Las imágenes NO se van a publicar.'
    )
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  const filename = path.basename(key)
  const dir = path.join(process.cwd(), 'public', 'uploads')

  // writeFile does not create parent directories, so a missing folder would
  // otherwise surface as an opaque ENOENT on the very first upload.
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, filename), bytes)

  return `/uploads/${filename}`
}
