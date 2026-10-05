import type { Metadata } from 'next'
import { ResetPasswordForm } from './reset-password-form'

export const metadata: Metadata = {
  title: 'Elegir nueva contraseña',
  // A page holding a one-shot credential has no business in an index.
  robots: { index: false, follow: false },
}

/**
 * Server component on purpose: the token arrives as a route param and is handed
 * to the client form as a prop, rather than being read from `window` on mount.
 * That keeps the value out of the prerendered shell and avoids a flash of
 * "invalid link" before hydration finishes.
 *
 * `params` is a Promise in Next 16 — it must be awaited.
 */
export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  return <ResetPasswordForm token={token} />
}