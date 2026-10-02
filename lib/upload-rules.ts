/**
 * Upload rules shared by the browser and the server.
 *
 * This lives apart from `lib/storage.ts` on purpose: that module imports
 * `@vercel/blob` and `node:fs`, so importing it from a client component would
 * drag server-only code into the browser bundle. Keeping the rules here lets
 * the dropzone reject a bad file before spending a round-trip, with the server
 * still enforcing the same limits as the source of truth.
 */

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024

export const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
])

/** For the `accept` attribute of the hidden file input. */
export const ACCEPTED_IMAGE_EXTENSIONS = '.jpg,.jpeg,.png,.webp,.avif,.gif'

/** Returns a human-readable reason the file is unacceptable, or null if it is fine. */
export function validateImageFile(file: File): string | null {
  if (file.size === 0) {
    return 'El archivo está vacío.'
  }

  if (file.size > MAX_IMAGE_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1)
    return `La imagen pesa ${mb} MB y el límite es 10 MB.`
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return 'Formato no permitido. Usá JPG, PNG, WebP, AVIF o GIF.'
  }

  return null
}
