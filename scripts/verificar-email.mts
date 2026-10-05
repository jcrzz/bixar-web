/**
 * Email preflight: answers "is email actually working?" in one command.
 *
 * Needed because the failure modes are invisible from the app side. A missing
 * key, an unverified domain and a rejected sender all surface as nothing at all
 * in the UI — the contact form still returns 201 and the reset still creates its
 * token. This script talks to Resend directly and names the broken piece.
 *
 *   pnpm run email:check
 *
 * Reads RESEND_API_KEY from .env.local and sends one real message to
 * CONTACT_NOTIFICATION_EMAIL, so it will land in the inbox.
 *
 * The sending call is the actual test. Listing domains is only a nicety that
 * reports per-record status, and it needs a broader key than the one production
 * should hold — so it is attempted, and its absence is never fatal.
 */

import { Resend } from 'resend'

const from = process.env.RESEND_FROM_EMAIL || 'Bixar <no-reply@bixar.com.ar>'
const to = process.env.CONTACT_NOTIFICATION_EMAIL || 'bixar.ingenieria@gmail.com'
const domain = from.match(/@([^>\s]+)/)?.[1]

async function main(): Promise<number> {
  const key = process.env.RESEND_API_KEY?.trim()

  if (!key) {
    console.error(
      '\n  ✗ RESEND_API_KEY vacía.\n' +
        '    Creala en resend.com > API Keys y ponela en .env.local (o en Vercel).\n'
    )
    return 1
  }

  const resend = new Resend(key)

  console.log(`\n  remitente : ${from}`)
  console.log(`  destino   : ${to}`)
  console.log(`  dominio   : ${domain ?? '(no se pudo deducir del remitente)'}\n`)

  // --- opcional: estado del dominio ------------------------------------------
  // Skipped quietly when the key is send-only, which is the key production
  // should use. Reporting that as "the API key is invalid" would be wrong — the
  // key sends fine — and would send someone off to rotate a healthy credential.
  const { data: domains } = await resend.domains.list()
  const found = domains?.data?.find((d) => d.name === domain)

  if (found) {
    console.log(`  ✓ dominio "${domain}" existe en Resend`)
    console.log(`    estado: ${found.status}`)
  } else {
    console.log('  · estado del dominio: sin consultar (key con permiso solo de envío)')
  }

  // --- el test real ----------------------------------------------------------
  console.log('\n  enviando un mensaje de prueba...\n')

  const { data: sent, error } = await resend.emails.send(
    {
      from,
      to,
      subject: 'Bixar: prueba de configuración de correo',
      html: '<p>Si estás leyendo esto, el envío funciona.</p><p>Podés borrar este mensaje.</p>',
      text: 'Si estás leyendo esto, el envío funciona. Podés borrar este mensaje.',
    },
    { idempotencyKey: `preflight-${Date.now()}` }
  )

  if (!error) {
    console.log(`  ✓ envío aceptado por Resend (id ${sent?.id})`)
    console.log(
      `\n  Revisá ${to}. Si no llega en un par de minutos, el panel de Resend\n` +
        '  muestra el estado exacto (entregado / rebotado / spam).\n'
    )
    return 0
  }

  // --- diagnóstico -----------------------------------------------------------
  console.error(`  ✗ Resend rechazó el envío [${error.name}]: ${error.message}\n`)

  if (error.statusCode === 403) {
    console.error(
      '  Lo más probable: el dominio todavía no está verificado en Resend.\n' +
        '  Los registros DNS importan, pero Resend los chequea por su cuenta cada\n' +
        '  cierto tiempo. Forzalo con el botón "Verify" del dominio en el panel,\n' +
        '  o esperá y volvé a correr este comando.\n'
    )
    return 1
  }

  if (error.statusCode === 401) {
    console.error(
      '  La API key no es válida o venció. Revisala en resend.com > API Keys.\n'
    )
    return 1
  }

  if (error.statusCode === 429) {
    console.error(
      '  Resend está limitando el envío. Raro recién empezando: puede ser que la\n' +
        '  cuenta todavía esté en el tier gratuito con cuota diaria.\n'
    )
    return 1
  }

  return 1
}

// Assigned rather than passed to process.exit(): exiting while undici still
// holds a keep-alive socket trips an assertion in Node on Windows and lands a
// non-zero code on a run that actually succeeded.
process.exitCode = await main()
