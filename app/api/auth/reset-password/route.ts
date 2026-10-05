import { NextResponse } from 'next/server'
import { resetPasswordSchema } from '@/lib/validations/auth'
import { toValidationError } from '@/lib/api-errors'
import { checkRateLimit, clientIp } from '@/lib/rate-limit'
import { redeemResetToken } from '@/lib/password-reset'
import { setAdminPassword } from '@/lib/auth'

/**
 * Step two of password recovery: redeem the token and set the new password.
 *
 * Accepting the password twice would be the one unrecoverable mistake here — the
 * second set silently discards the first — so `setAdminPassword` also stamps
 * `passwordChangedAt`, which invalidates every session issued before now.
 */

const RATE_LIMIT = { max: 10, windowMs: 15 * 60_000 }

/**
 * One message for every failure mode.
 *
 * Telling a caller apart "expired" from "already used" from "never existed"
 * tells them whether a guessed token is real. They all get the same sentence.
 */
const INVALID_TOKEN = {
  error: 'El enlace es inválido o venció. Pedí uno nuevo desde la pantalla de inicio de sesión.',
}

export async function POST(request: Request) {
  const limit = await checkRateLimit(`reset:${clientIp(request)}`, RATE_LIMIT)

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
    const { token, password } = resetPasswordSchema.parse(await request.json())

    const result = await redeemResetToken(token)

    if (!result.ok) {
      return NextResponse.json(INVALID_TOKEN, { status: 400 })
    }

    await setAdminPassword(result.adminId, password)

    // No session is created here: the user must sign in with the new password,
    // which also proves the reset actually took effect.
    return NextResponse.json({ success: true })
  } catch (error) {
    const validation = toValidationError(error)
    if (validation) {
      return NextResponse.json(validation, { status: 400 })
    }

    // Prisma raises P2025 if the admin row disappeared between redeeming the
    // token and updating it; either way the caller learns nothing useful.
    console.error('Error en POST /api/auth/reset-password', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}