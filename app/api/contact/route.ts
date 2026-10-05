import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/lib/validations/contact'
import { toValidationError } from '@/lib/api-errors'
import { checkRateLimit, clientIp } from '@/lib/rate-limit'
import { sendEmail, MailError } from '@/lib/mail'
import { contactNotificationEmail } from '@/lib/emails/contact-notification'
import { CONTACT_NOTIFICATION_EMAIL } from '@/lib/site'

/**
 * Public contact form. No session: this is how a visitor reaches the company.
 *
 * The row is written *before* the email is attempted, and an email failure does
 * not change the response. Resend being down is not the visitor's problem and
 * not a reason to make them retype the form — and the lead stays recoverable in
 * the ContactMessage table either way.
 */

/** 5 per hour per IP: generous for a real enquiry, hostile to a script. */
const RATE_LIMIT = { max: 5, windowMs: 60 * 60_000 }

export async function POST(request: Request) {
  const ip = clientIp(request)

  const limit = await checkRateLimit(`contact:${ip}`, RATE_LIMIT)

  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Demasiados envíos desde esta conexión. Probá más tarde.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfterSeconds) },
      }
    )
  }

  try {
    const { name, email, message, company } = contactSchema.parse(
      await request.json()
    )

    // Honeypot tripped. Reported as success so the bot has nothing to tune
    // against, and nothing is stored or sent.
    if (company) {
      return NextResponse.json({ success: true }, { status: 201 })
    }

    const record = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
        // Hashed, not raw, so the table is not a list of visitor addresses.
        ipHash: createHash('sha256').update(ip).digest('hex'),
      },
      select: { id: true },
    })

    const notification = contactNotificationEmail({ name, email, message })

    try {
      await sendEmail({
        to: CONTACT_NOTIFICATION_EMAIL,
        replyTo: email,
        subject: notification.subject,
        html: notification.html,
        text: notification.text,
        tags: [{ name: 'kind', value: 'contact' }],
        // One notification per stored row, however many times the visitor
        // retries with the same content.
        idempotencyKey: `contact-${record.id}`,
      })
    } catch (error) {
      console.error(
        `[contact] mensaje ${record.id} guardado pero no notificado: ${
          error instanceof MailError ? error.message : String(error)
        }. Queda en la tabla ContactMessage.`
      )
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    const validation = toValidationError(error)
    if (validation) {
      return NextResponse.json(validation, { status: 400 })
    }

    console.error('Error en POST /api/contact', error)
    return NextResponse.json(
      {
        error:
          'No pudimos enviar tu mensaje. Intentá de nuevo en unos minutos.',
      },
      { status: 500 }
    )
  }
}