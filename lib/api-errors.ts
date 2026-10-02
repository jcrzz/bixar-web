import { z } from 'zod'

export type ValidationError = {
  error: string
  /** Field name → first message, so the form can highlight individual inputs. */
  fields: Record<string, string>
}

/**
 * Turns a `ZodError` into a message a human can act on.
 *
 * Without this the routes returned `error.message`, which for Zod is the
 * serialized issue array — the UI would render a wall of JSON instead of
 * "La categoría es requerida". Returns null for anything that isn't a
 * validation failure, so callers can fall through to a 500.
 */
export function toValidationError(error: unknown): ValidationError | null {
  if (!(error instanceof z.ZodError)) {
    return null
  }

  const fields: Record<string, string> = {}

  for (const issue of error.issues) {
    const key = issue.path[0]
    if (typeof key === 'string' && !(key in fields)) {
      fields[key] = issue.message
    }
  }

  return {
    error: error.issues[0]?.message ?? 'Datos inválidos',
    fields,
  }
}

/** Prisma raises P2025 when an update/delete targets a row that isn't there. */
export function isRecordNotFound(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 'P2025'
  )
}
