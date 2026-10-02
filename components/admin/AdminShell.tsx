'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FolderKanban, LayoutDashboard, LogOut } from 'lucide-react'

import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin', label: 'Proyectos', icon: FolderKanban },
  { href: '/', label: 'Sitio público', icon: LayoutDashboard, external: true },
]

function Brand() {
  return (
    <Link
      href="/admin"
      className="flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {/* The mark is vertical (136x152) with a transparent background, so it
          gets an `object-contain` box instead of a fixed ratio that would
          distort it. Same treatment as .logo-img on the public site. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/BIXAR-LOGO-SOLO.png"
        alt="Bixar Ingeniería"
        className="size-9 shrink-0 object-contain"
      />
      <span className="text-sm font-bold tracking-[0.18em] text-foreground">
        BIXAR
      </span>
    </Link>
  )
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex gap-1">
      {NAV.map(({ href, label, icon: Icon, external }) => {
        const active = !external && pathname.startsWith(href)

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              active
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

function LogoutButton({ className }: { className?: string }) {
  return (
    <form action="/api/auth/logout" method="POST">
      <button
        type="submit"
        className={cn(
          'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          className,
        )}
      >
        <LogOut className="size-4 shrink-0" />
        Cerrar sesión
      </button>
    </form>
  )
}

export function AdminShell({
  email,
  children,
}: {
  email: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-card lg:flex">
        <div className="px-5 py-5">
          <Brand />
        </div>

        <div className="px-3">
          <NavLinks />
        </div>

        <div className="mt-auto border-t border-border px-3 py-3">
          <p className="truncate px-3 pb-1.5 text-xs text-muted-foreground">
            {email}
          </p>
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
        <Brand />
        <NavLinks />
        <LogoutButton className="w-auto px-2" />
      </header>

      <main className="lg:pl-60">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
