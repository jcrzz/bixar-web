/**
 * Applies Resend's DNS records to a Vercel-managed domain.
 *
 *   pnpm run dns:resend -- registros.json          # shows what would change
 *   pnpm run dns:resend -- registros.json --apply  # actually creates them
 *
 * The guards below are the reason this script exists instead of pasting records
 * into the dashboard by hand:
 *
 *  - Dry run by default. Writing DNS is the one operation here that can break
 *    the live site, so nothing happens until --apply.
 *  - Create only. It never deletes or edits a record, so the ALIAS and CAA
 *    records Vercel manages automatically cannot be collaterally damaged.
 *  - Refuses an MX at the apex. bixar.com.ar has no mailbox, and publishing an
 *    MX would make `@bixar.com.ar` look deliverable when it silently is not.
 *  - Refuses a second SPF record. Two of them is a permerror that invalidates
 *    both, silently degrading deliverability.
 *  - Skips records that already exist, so running it twice is safe.
 */

import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const TEAM_ID = process.env.VERCEL_TEAM_ID ?? 'team_cEAWcytggHQoHIdiS4S6RTdq'
const DOMAIN = process.env.VERCEL_DOMAIN ?? 'bixar.com.ar'
const API = 'https://api.vercel.com'

/**
 * The `vercel` CLI already holds a login token on disk. Reusing it means this
 * script needs no extra setup. An explicit VERCEL_TOKEN still wins if set.
 */
function resolveToken(): string | undefined {
  if (process.env.VERCEL_TOKEN) return process.env.VERCEL_TOKEN

  const candidates = [
    join(process.env.APPDATA ?? '', 'com.vercel.cli', 'Data', 'auth.json'),
    join(homedir(), '.local', 'share', 'com.vercel.cli', 'auth.json'),
  ]

  for (const path of candidates) {
    if (!existsSync(path)) continue

    try {
      const token = JSON.parse(readFileSync(path, 'utf8'))?.token
      if (typeof token === 'string' && token) return token
    } catch {
      // A malformed auth file is not this script's problem to report.
    }
  }

  return undefined
}

type IncomingRecord = {
  name?: string
  type?: string
  value?: string
  priority?: number
}
type ExistingRecord = {
  id: string
  name: string
  type: string
  value: string
  creator?: string
}

/** "(raíz)" reads better than an empty column when a record targets the apex. */
const label = (name: string) => name || '(raíz)'

/**
 * Vercel rewrites hostnames into fully-qualified form, so a value POSTed as
 * `mail.example.com` reads back as `mail.example.com.`. Comparing the raw
 * strings misses that, and the miss is not cosmetic: re-running the script would
 * create a *second* MX for a mail exchanger that already exists, which is a
 * genuinely confusing thing to debug in the dashboard.
 *
 * TXT is compared verbatim — a DKIM `p=` value is base64 and case-sensitive, so
 * lowercasing it would hide a real mismatch rather than a formatting one.
 */
function normalize(type: string, value: string): string {
  const trimmed = value.trim()
  return type === 'TXT' ? trimmed : trimmed.replace(/\.$/, '').toLowerCase()
}

async function vercel(path: string, init?: RequestInit) {
  const token = resolveToken()

  if (!token) {
    throw new Error(
      'no encontré un token de Vercel (probá `vercel login` o definí VERCEL_TOKEN)'
    )
  }

  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  const text = await res.text()
  const body = text ? JSON.parse(text) : null

  if (!res.ok) {
    throw new Error(`[${res.status}] ${body?.error?.message ?? text}`)
  }

  return body
}

async function main(): Promise<number> {
  // --- argumentos -----------------------------------------------------------
  const args = process.argv.slice(2)
  const apply = args.includes('--apply')
  const file = args.find((a) => !a.startsWith('--'))

  if (!file) {
    console.error('\n  Uso: pnpm run dns:resend -- <archivo.json> [--apply]\n')
    return 1
  }

  let incoming: IncomingRecord[]
  try {
    incoming = JSON.parse(readFileSync(file, 'utf8'))
  } catch (error) {
    console.error(
      `\n  ✗ No pude leer ${file}: ${error instanceof Error ? error.message : error}\n`
    )
    return 1
  }

  if (!Array.isArray(incoming) || incoming.length === 0) {
    console.error(`\n  ✗ ${file} no contiene una lista de registros.\n`)
    console.error('  Formato esperado:')
    console.error(
      '  [{"name":"resend._domainkey","type":"CNAME","value":"...destino..."}]\n'
    )
    return 1
  }

  // --- estado actual --------------------------------------------------------
  let existing: ExistingRecord[]
  try {
    existing =
      (await vercel(`/v3/domains/${DOMAIN}/records?teamId=${TEAM_ID}`))
        .records ?? []
  } catch (error) {
    console.error(
      `\n  ✗ No pude leer los registros de ${DOMAIN}: ${
        error instanceof Error ? error.message : error
      }\n`
    )
    return 1
  }

  console.log(`\n  ${DOMAIN} — ${existing.length} registros existentes`)

  const systemCount = existing.filter((r) => r.creator === 'system').length
  console.log(`  ${systemCount} los maneja Vercel (no se tocan)`)
  console.log(`  ${existing.length - systemCount} son manuales\n`)

  // Two SPF records *at the same name* is a permerror that invalidates both.
  // Two at *different* names is normal and required — SES custom return path
  // wants an SPF on the bounce subdomain alongside the one at the apex. So this
  // has to be tracked per name; a single global flag silently dropped the
  // bounce SPF, which is easy to miss because the apex one still verifies.
  const spfNames = new Set(
    existing
      .filter((r) => r.type === 'TXT' && r.value.includes('v=spf1'))
      .map((r) => normalize('name', r.name))
  )

  // --- plan -----------------------------------------------------------------
  const toCreate: IncomingRecord[] = []
  const skipped: { record: IncomingRecord; why: string }[] = []

  for (const record of incoming) {
    const name = (record.name ?? '').trim()
    const type = (record.type ?? '').toUpperCase()

    // Resend shows TXT values wrapped in quotes, and a pasted SPF record keeps
    // them. Storing the quotes makes the TXT record invalid at every resolver,
    // so the domain would sit in "pending" with no error to explain why. Strip
    // one balanced pair of quotes before anything else looks at the value.
    let value = (record.value ?? '').trim()
    if (type === 'TXT' && value.length > 1 && value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1).trim()
    }

    if (!type || !value) {
      skipped.push({ record, why: 'le falta type o value' })
      continue
    }

    // Checked before the guards below: a record that already exists verbatim is
    // simply done, and saying so is more useful than reporting it as a
    // duplicate-SPF conflict and implying the operator has to merge something.
    const duplicate = existing.some(
      (r) =>
        r.type === type &&
        normalize('name', r.name) === normalize('name', name) &&
        normalize(type, r.value) === normalize(type, value)
    )

    if (duplicate) {
      skipped.push({ record, why: 'ya existe exactamente igual' })
      continue
    }

    // Guard: an MX at the apex would imply a mailbox that does not exist.
    if (type === 'MX' && name === '') {
      skipped.push({
        record,
        why: 'MX en la raíz: no hay buzón, publicarlo haría creer que @bixar.com.ar recibe correo',
      })
      continue
    }

    if (type === 'TXT' && value.includes('v=spf1')) {
      if (spfNames.has(normalize('name', name))) {
        skipped.push({
          record,
          why: `ya hay un SPF en ${label(name)}: hay que fusionar los mecanismos en uno, no agregar otro`,
        })
        continue
      }
      spfNames.add(normalize('name', name))
    }

    toCreate.push({
      name,
      type,
      value,
      // Vercel rejects an MX without an explicit priority (400 mxPriority), and
      // SES only ever publishes one mail exchanger, so 10 is the whole story.
      priority: type === 'MX' ? (record.priority ?? 10) : undefined,
    })
  }

  for (const { record, why } of skipped) {
    console.log(
      `  = ${label((record.type ?? '?').toUpperCase())} ${label(
        (record.name ?? '').trim()
      )} — ${why}`
    )
  }

  if (toCreate.length === 0) {
    console.log('\n  Nada que hacer. Todo está en su lugar.\n')
    return 0
  }

  console.log(`  + ${toCreate.length} a crear:`)
  for (const r of toCreate) {
    console.log(
      `      ${r.type.padEnd(6)} ${label(r.name ?? '').padEnd(28)} ${r.value}`
    )
  }

  // --- ejecución ------------------------------------------------------------
  if (!apply) {
    console.log('\n  SIMULACIÓN. Nada se modificó. Para aplicar de verdad:')
    console.log(`    pnpm run dns:resend -- ${file} --apply\n`)
    return 0
  }

  console.log('')

  for (const { name, type, value, priority } of toCreate) {
    try {
      await vercel(`/v3/domains/${DOMAIN}/records?teamId=${TEAM_ID}`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          type,
          value,
          ...(type === 'MX' ? { mxPriority: priority ?? 10 } : {}),
        }),
      })
      console.log(`  ✓ creado ${type} ${label(name)}`)
    } catch (error) {
      console.error(
        `  ✗ falló ${type} ${label(name)}: ${
          error instanceof Error ? error.message : error
        }`
      )
    }
  }

  console.log(
    '\n  Ahora en resend.com > Domains > bixar.com.ar debería pasar a "pending".\n' +
      '  La verificación tarda de minutos a unas horas según la propagación de DNS.\n'
  )

  return 0
}

// Assigned rather than passed to process.exit(): exiting while undici still
// holds a keep-alive socket trips an assertion in Node on Windows and lands a
// non-zero code on a run that actually succeeded.
process.exitCode = await main()