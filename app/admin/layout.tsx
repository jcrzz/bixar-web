import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

import { AdminShell } from '@/components/admin/AdminShell'
import { ToastProvider } from '@/components/ui/toast'

// The panel reads the session cookie and live project rows on every request, so
// it must never be prerendered at build time (which would need a DB connection
// and would bake in the wrong access control).
export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <ToastProvider>
      <AdminShell email={session.email}>{children}</AdminShell>
    </ToastProvider>
  )
}
