import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

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
    <div className="min-h-screen bg-[#202020] text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-lg font-semibold">Panel de Administración</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60">{session.email}</span>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="text-sm text-white/60 hover:text-white"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  )
}
