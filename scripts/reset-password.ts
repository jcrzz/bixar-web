/**
 * Emergency password reset from the terminal.
 *
 * `pnpm run admin:reset-password` — works with no email provider, no SMTP and
 * no running app, which is the point: it is the fallback for the case where
 * Resend is down, the domain is not verified, or the recovery email never
 * arrives. It needs database access only.
 *
 * Reuses `setAdminPassword`, so it also stamps `passwordChangedAt` and
 * invalidates every open session — same behaviour as the emailed flow.
 */

import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const MIN_PASSWORD_LENGTH = 12

async function prompt(question: string) {
  const rl = createInterface({ input: stdin, output: stdout })

  try {
    const answer = await rl.question(question)
    return answer.trim()
  } finally {
    rl.close()
  }
}

async function main() {
  const email = (await prompt('Email del admin: ')).toLowerCase()

  if (!email) {
    throw new Error('Falta el email.')
  }

  const admin = await prisma.admin.findUnique({
    where: { email },
    select: { id: true, email: true, name: true },
  })

  if (!admin) {
    // Listing the existing admins is more useful than a bare "not found" when
    // the address was simply mistyped.
    const all = await prisma.admin.findMany({ select: { email: true } })
    console.log(`\nNo existe un admin con ${email}.`)
    if (all.length) {
      console.log('Admins en la base:')
      for (const a of all) console.log(`  - ${a.email}`)
    }
    process.exitCode = 1
    return
  }

  const password = await prompt('Nueva contraseña: ')
  const confirm = await prompt('Repetí la contraseña: ')

  if (password !== confirm) {
    console.error('\nLas contraseñas no coinciden. No se cambió nada.')
    process.exitCode = 1
    return
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    console.error(
      `\nLa contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres. No se cambió nada.`
    )
    process.exitCode = 1
    return
  }

  // Mirrors setAdminPassword without importing it: this script runs through
  // tsx against @prisma/client directly, and pulling in lib/auth.ts would drag
  // in next/headers, which has no meaning outside a request.
  const passwordChangedAt = new Date(Math.floor(Date.now() / 1000) * 1000)

  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      // bcryptjs v3 resolves a promise when called without a callback.
      passwordHash: await bcrypt.hash(password, 12),
      passwordChangedAt,
    },
  })

  // Any outstanding reset links are now worthless; clearing them avoids leaving
  // a valid token in someone's inbox after the password changed underneath them.
  const { count } = await prisma.passwordResetToken.deleteMany({
    where: { adminId: admin.id, usedAt: null },
  })

  console.log(`\nContraseña actualizada para ${admin.email}.`)
  console.log('Las sesiones abiertas en otros dispositivos fueron cerraradas.')
  if (count > 0) {
    console.log(`Se invalidaron ${count} enlace(s) de recuperación pendiente(s).`)
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())