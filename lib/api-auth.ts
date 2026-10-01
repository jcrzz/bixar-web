import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

/**
 * Guard for mutating API routes.
 *
 * The admin layout only protects the UI, so every write endpoint has to verify
 * the session cookie itself. Returns a 401 response when the request must be
 * rejected, or `null` when it may proceed:
 *
 *   const unauthorized = await unauthorizedIfNoSession()
 *   if (unauthorized) return unauthorized
 */
export async function unauthorizedIfNoSession() {
  const session = await getSession()

  if (session) return null

  return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
}
