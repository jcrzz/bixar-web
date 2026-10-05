import { NextResponse } from 'next/server'
import { verifyCredentials, createSession } from '@/lib/auth'
import { loginSchema } from '@/lib/validations/auth'
import { toValidationError } from '@/lib/api-errors'
import { clientIp, peekRateLimit, recordRateLimitHit } from '@/lib/rate-limit'

/**
 * Sign-in for the admin panel.
 *
 * Rate limited because the account's address is not a secret: it is the same
 * one printed in the site footer and in the JSON-LD, so anyone can read it off
 * the site and aim every guess at a single known account.
 *
 * Keyed by IP rather than by email, and that choice is load-bearing. A counter
 * that only advanced for accounts that exist would answer 429 for a real admin
 * and 401 for a fake one, turning the limit into an oracle for discovering which
 * addresses can administer the site. Keyed by IP, the answer depends only on how
 * many attempts were made.
 *
 * The budget is charged on failure, not on every request. An admin signing in
 * all day would otherwise lock themselves out of a limit that exists to stop
 * guessing.
 */

/** 20 per 15 minutes ≈ 1.900/day: not enough to crack a strong password. */
const RATE_LIMIT = { max: 20, windowMs: 15 * 60_000 }

export async function POST(request: Request) {
  const subject = `login:${clientIp(request)}`

  const limit = await peekRateLimit(subject, RATE_LIMIT)

  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Probá de nuevo en unos minutos.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfterSeconds) },
      }
    )
  }

  try {
    const { email, password } = loginSchema.parse(await request.json())

    const admin = await verifyCredentials(email, password)

    if (!admin) {
      await recordRateLimitHit(subject, RATE_LIMIT.windowMs)

      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    await createSession(admin.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    const validation = toValidationError(error)
    if (validation) {
      return NextResponse.json(validation, { status: 400 })
    }

    // Swallowed errors here are undiagnosable: Vercel only records the 500, not
    // the cause, so a bad AUTH_SECRET or an unreachable DB look identical from
    // the outside. The message is generic on purpose, the log is not.
    console.error('Error en POST /api/auth/login', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}