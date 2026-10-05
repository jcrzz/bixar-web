import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const COOKIE_NAME = 'admin_session'
const SESSION_DURATION = 60 * 60 * 24 * 7 // 7 días

/**
 * There is deliberately no fallback secret. A hardcoded default would live in
 * this public repository, so anyone could forge an admin session cookie.
 * Resolved lazily so `next build` works without env vars but every real
 * request fails loudly.
 */
function getJwtSecret() {
  const secret = process.env.AUTH_SECRET

  if (!secret) {
    throw new Error(
      'AUTH_SECRET no está configurado. Generá uno con `openssl rand -base64 32` y agregalo a .env.local y a las variables de entorno de Vercel.'
    )
  }

  if (secret.length < 32) {
    throw new Error('AUTH_SECRET es demasiado corto. Se requieren al menos 32 caracteres.')
  }

  return new TextEncoder().encode(secret)
}

export async function createSession(adminId: string) {
  const token = await new SignJWT({ adminId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${SESSION_DURATION}s`)
    .setIssuedAt()
    .sign(getJwtSecret())

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  })
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) return null

  // Resolved outside the try/catch: a bad AUTH_SECRET is a configuration bug
  // and must not be swallowed into a silent "no session" redirect loop.
  const secret = getJwtSecret()

  try {
    const { payload } = await jwtVerify(token, secret)
    if (!payload.adminId) return null

    const admin = await prisma.admin.findUnique({
      where: { id: payload.adminId as string },
      select: { id: true, email: true, name: true, passwordChangedAt: true },
    })

    if (!admin) return null

    // The session cookie is a stateless JWT that outlives any password change,
    // so resetting the password would otherwise not lock out whoever copied the
    // cookie. Comparing the token's issue time against the last change makes the
    // reset actually revoke outstanding sessions.
    //
    // `iat` has one-second resolution and passwordChangedAt is stored truncated
    // to whole seconds, so a session created immediately after the change is not
    // rejected by sub-second drift.
    if (payload.iat && payload.iat * 1000 < admin.passwordChangedAt.getTime()) {
      return null
    }

    return { id: admin.id, email: admin.email, name: admin.name }
  } catch {
    return null
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function verifyCredentials(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } })
  if (!admin) return null

  const valid = await bcrypt.compare(password, admin.passwordHash)
  if (!valid) return null

  return { id: admin.id, email: admin.email, name: admin.name }
}

/**
 * Replaces an admin's password and stamps the change.
 *
 * The timestamp is truncated to whole seconds on purpose: it is compared
 * against a JWT's `iat`, which has one-second resolution. Keeping millisecond
 * precision here would let a session created in the same second as the change
 * be rejected as "older than the change", logging the user straight back out.
 */
export async function setAdminPassword(adminId: string, password: string) {
  const passwordChangedAt = new Date(Math.floor(Date.now() / 1000) * 1000)

  await prisma.admin.update({
    where: { id: adminId },
    data: {
      passwordHash: await bcrypt.hash(password, 12),
      passwordChangedAt,
    },
  })

  return passwordChangedAt
}
