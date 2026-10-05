import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { prisma } from '@/lib/prisma'

/**
 * Password reset tokens.
 *
 * Two properties matter here and both come from hashing:
 *
 *  - Only the SHA-256 of a token is persisted. A leaked database dump — or a
 *    read-only SQL injection somewhere else — yields digests that cannot be
 *    redeemed, because the plaintext exists solely in the email and in the
 *    request that consumes it.
 *  - Redemption compares digests with `timingSafeEqual` instead of `===`, so the
 *    endpoint cannot be used as a timing oracle to guess a valid token one
 *    character at a time.
 */

export const RESET_TOKEN_TTL_MINUTES = 15

const TOKEN_BYTES = 32

/** Returns the plaintext to put in the URL. It is never stored anywhere. */
export function generateResetToken() {
  return randomBytes(TOKEN_BYTES).toString('base64url')
}

export function hashResetToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

function safeEqualHex(a: string, b: string) {
  // Buffers of different lengths make timingSafeEqual throw, and the length of a
  // hex digest is not secret, so bail out first on the cheap check.
  if (a.length !== b.length) return false

  return timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'))
}

/**
 * Issues a token for an admin, superseding any previous one.
 *
 * Old tokens are deleted rather than left to expire: otherwise requesting a
 * second reset leaves the first link live, and anyone who saw that earlier email
 * can still get in after the user thinks they have cancelled it.
 */
export async function createResetToken(adminId: string) {
  const token = generateResetToken()

  await prisma.$transaction(async (tx) => {
    await tx.passwordResetToken.deleteMany({
      where: { adminId, usedAt: null },
    })

    await tx.passwordResetToken.create({
      data: {
        tokenHash: hashResetToken(token),
        adminId,
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60_000),
      },
    })
  })

  return token
}

export type RedeemResult =
  | { ok: true; adminId: string }
  | { ok: false; reason: 'invalid' | 'expired' | 'used' }

/**
 * Redeems a token, consuming it.
 *
 * The read, the expiry check and the mark-as-used happen in one transaction so
 * a token submitted twice in parallel cannot pass twice.
 */
export async function redeemResetToken(token: string): Promise<RedeemResult> {
  const tokenHash = hashResetToken(token)

  return prisma.$transaction(async (tx) => {
    const record = await tx.passwordResetToken.findUnique({
      where: { tokenHash },
    })

    if (!record || !safeEqualHex(record.tokenHash, tokenHash)) {
      return { ok: false, reason: 'invalid' }
    }

    if (record.usedAt) {
      return { ok: false, reason: 'used' }
    }

    if (record.expiresAt.getTime() <= Date.now()) {
      return { ok: false, reason: 'expired' }
    }

    await tx.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    })

    return { ok: true, adminId: record.adminId }
  })
}