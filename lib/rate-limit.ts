import { createHash } from 'node:crypto'
import { prisma } from '@/lib/prisma'

/**
 * Sliding-window rate limiting backed by Postgres.
 *
 * Why not an in-memory Map, which is what most of these examples use: every
 * serverless lambda is its own process, and it is torn down when idle. Two
 * concurrent requests can land on two instances that share nothing, and a cold
 * start wipes the counter outright. An in-memory limiter on Vercel looks like it
 * works in development and throttles nothing in production.
 *
 * Rows live for the length of the window and no longer, so the table stays
 * bounded by traffic rather than growing forever.
 */

export type RateLimit = {
  /** Requests allowed within the window. */
  max: number
  /** Window length in milliseconds. */
  windowMs: number
}

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  /** Seconds until the caller may retry. Always 0 when allowed. */
  retryAfterSeconds: number
}

/**
 * Subjects are hashed before they are stored or matched. The raw IP would turn
 * this table into a log of who visited the site, and it is never needed — only
 * equality is.
 */
function hashKey(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

/**
 * Reports whether `subject` is still under its budget. Records nothing.
 *
 * Split out from recording because the login endpoint must not spend its budget
 * on attempts that succeed: an admin who signs in normally all day would
 * otherwise lock themselves out of a limit that exists to stop guessing.
 */
export async function peekRateLimit(
  subject: string,
  { max, windowMs }: RateLimit
): Promise<RateLimitResult> {
  const key = hashKey(subject)
  const now = Date.now()
  const windowStart = new Date(now - windowMs)

  const used = await prisma.rateLimitEvent.count({
    where: { key, createdAt: { gte: windowStart } },
  })

  if (used < max) {
    return { allowed: true, remaining: max - used, retryAfterSeconds: 0 }
  }

  // Time until the oldest request in the window ages out.
  const oldest = await prisma.rateLimitEvent.findFirst({
    where: { key, createdAt: { gte: windowStart } },
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true },
  })

  const retryAfterMs = oldest
    ? oldest.createdAt.getTime() + windowMs - now
    : windowMs

  return {
    allowed: false,
    remaining: 0,
    retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
  }
}

/**
 * Charges one request against `subject`'s budget.
 *
 * `windowMs` is passed only for the housekeeping sweep below, not for the
 * counting itself — `peekRateLimit` owns that, using the same window, so the two
 * can never drift apart.
 */
export async function recordRateLimitHit(subject: string, windowMs: number) {
  const key = hashKey(subject)
  const windowStart = new Date(Date.now() - windowMs)

  await prisma.rateLimitEvent.create({ data: { key } })

  // Rows that fell out of the window are dead weight for every future lookup.
  // Only the current key is swept, which keeps the delete proportional to the
  // caller instead of scanning the whole table.
  await prisma.rateLimitEvent.deleteMany({
    where: { key, createdAt: { lt: windowStart } },
  })
}

/**
 * Count-only-if-allowed, for endpoints where every request should cost.
 *
 * The contact form and the recovery request work this way: there is no
 * "successful request" worth exempting, and a visitor who resubmits after a
 * validation error has genuinely made two attempts.
 */
export async function checkRateLimit(
  subject: string,
  limit: RateLimit
): Promise<RateLimitResult> {
  const result = await peekRateLimit(subject, limit)

  if (result.allowed) {
    await recordRateLimitHit(subject, limit.windowMs)
    return { ...result, remaining: result.remaining - 1 }
  }

  return result
}

/** Client IP from proxy headers, or a constant when none is present. */
export function clientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')

  if (forwarded) {
    // Left-most entry is the original client; the rest are proxies we added.
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }

  return request.headers.get('x-real-ip') || 'unknown'
}