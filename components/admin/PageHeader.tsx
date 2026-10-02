import Link from 'next/link'
import { Plus } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'

export function PageHeader() {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Proyectos
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestioná los trabajos que aparecen en el sitio.
        </p>
      </div>

      <Link
        href="/admin/proyectos/nuevo"
        className={buttonVariants({ className: 'w-full sm:w-auto' })}
      >
        <Plus />
        Nuevo proyecto
      </Link>
    </header>
  )
}
