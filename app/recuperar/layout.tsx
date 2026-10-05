import type { Metadata } from 'next'

/**
 * Metadata lives in a layout rather than the page because the page is a client
 * component, and `metadata` can only be exported from a server one.
 */
export const metadata: Metadata = {
  title: 'Recuperar contraseña',
  // Nothing to index here, and a page about passwords has no business showing
  // up in search results.
  robots: { index: false, follow: false },
}

export default function RecuperarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}