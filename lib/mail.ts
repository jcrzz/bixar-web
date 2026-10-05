/**
 * Email sending, in one place.
 *
 * The rest of the codebase should call `sendEmail` and never import Resend
 * directly: this module is the only thing that knows the API key exists, so
 * there is a single import boundary between a secret and the rest of the app.
 * Only route handlers may import it — it reaches for server-only env.
 */

import { Resend } from 'resend'

/** Carries Resend's own wording up to the caller. Never shown raw to visitors. */
export class MailError extends Error {}

function getApiKey() {
  const key = process.env.RESEND_API_KEY

  if (!key) {
    throw new MailError(
      'RESEND_API_KEY no está configurado. Agregalo a .env.local y a las variables de entorno de Vercel.'
    )
  }

  return key
}

/**
 * Cached per warm lambda. Constructing the client is cheap but not free, and
 * the key is read at most once per instance either way.
 */
let client: Resend | null = null

function getClient() {
  if (!client) {
    client = new Resend(getApiKey())
  }

  return client
}

/**
 * Sender identity. Must match a domain verified in Resend, or every send fails
 * with `invalid_from_address`. Defaults to the real domain so the value that
 * works in production is also the one checked into `.env.example`.
 */
export function getFromAddress() {
  return process.env.RESEND_FROM_EMAIL || 'Bixar <no-reply@bixar.com.ar>'
}

export type SendEmailInput = {
  to: string | string[]
  subject: string
  html: string
  /** Plain-text alternative. Mail clients and spam filters prefer having one. */
  text: string
  /** Lets the recipient hit "Responder" and reach a human. */
  replyTo?: string
  /**
   * Retrying the same logical send must not produce two emails. Resend keys
   * these server-side; without one, a double-clicked button sends twice.
   */
  idempotencyKey?: string
  /** Dashboard-only labels, e.g. `{ name: 'kind', value: 'contact' }`. */
  tags?: { name: string; value: string }[]
}

export async function sendEmail(input: SendEmailInput) {
  const { to, subject, html, text, replyTo, idempotencyKey, tags } = input

  const payload = {
    from: getFromAddress(),
    to,
    subject,
    html,
    text,
    ...(replyTo ? { reply_to: replyTo } : {}),
    ...(tags ? { tags } : {}),
  }

  // Resend reports API-level problems in the resolved value instead of
  // throwing, so the error branch has to be checked explicitly. Its `name` is
  // a stable machine code (`invalid_api_key`, `daily_quota_exceeded`,
  // `invalid_from_address`, …) while `message` is prose worth logging.
  const { data, error } = await getClient().emails.send(
    payload,
    idempotencyKey ? { idempotencyKey } : undefined
  )

  if (error) {
    throw new MailError(`Resend rechazó el envío [${error.name}]: ${error.message}`)
  }

  return data
}