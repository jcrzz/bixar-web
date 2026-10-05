import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { forgotPasswordSchema } from '@/lib/validations/auth'
import { toValidationError } from '@/lib/api-errors'
import { checkRateLimit, clientIp } from '@/lib/rate-limit'
import { createResetToken, RESET_TOKEN_TTL_MINUTES } from '@/lib/password-reset'
import { sendEmail, MailError } from '@/lib/mail'
import { resetPasswordEmail } from '@/lib/emails/reset-password'
import { site } from '@/lib/site'

/**
 * Step one of password recovery: email a single-use link.
 *
 * Always answers 200 with the same message, whether or not the address belongs
 * to an admin. A different reply for "unknown email" turns this into an oracle
 * for enumerating which addresses can administer the site, and it is reachable
 * without authenticating.
 */

const RATE_LIMIT = { max: 5, windowMs: 15 * 60_000 }

export async function POST(request: Request) {
  const genericResponse = NextResponse.json({
    message:
      'Si ese email corresponde a una cuenta, te enviamos un enlace para restablecer la contraseña.',
  })

  const limit = await checkRateLimit(`forgot:${clientIp(request)}`, RATE_LIMIT)

  if (!limit.allowed) {
    return NextResponse.json(
      { message: 'Demasiados intentos. Probá de nuevo en unos minutos.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfterSeconds) },
      }
    )
  }

  try {
    const { email } = forgotPasswordSchema.parse(await request.json())
    const admin = await prisma.admin.findUnique({ where: { email } })

    if (admin) {
      const token = await createResetToken(admin.id)
      const resetUrl = `${site.url}/resetear/${token}`

      const message = resetPasswordEmail({
        adminName: admin.name,
        resetUrl,
        expiresInMinutes: RESET_TOKEN_TTL_MINUTES,
      })

      try {
        await sendEmail({
          to: admin.email,
          subject: message.subject,
          html: message.html,
          text: message.text,
          tags: [{ name: 'kind', value: 'password-reset' }],
          // Same admin + token would be identical anyway, but this makes a
          // double submit collapse into one message instead of two.
          idempotencyKey: `reset-${admin.id}-${token}`,
        })
      } catch (error) {
        // Deliberately swallowed for the visitor: returning a 500 here would
        // reveal which addresses exist, and it would not help them anyway.
        // Resend's own error code is in the log, which is where the fix lives.
        console.error(
          `[auth] no se pudo enviar el reset a ${admin.email}: ${
            error instanceof MailError ? error.message : String(error)
          }`
        )
      }
    }

    return genericResponse
  } catch (error) {
    const validation = toValidationError(error)
    if (validation) {
      return NextResponse.json(validation, { status: 400 })
    }

    console.error('Error en POST /api/auth/forgot-password', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}