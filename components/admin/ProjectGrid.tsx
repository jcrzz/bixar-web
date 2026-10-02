'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { FolderKanban, Plus, Search, X } from 'lucide-react'

import { ProjectCard, type ProjectCardData } from '@/components/admin/ProjectCard'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Filter = 'all' | 'published' | 'drafts'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'published', label: 'Publicados' },
  { value: 'drafts', label: 'Borradores' },
]

export function ProjectGrid({ projects }: { projects: ProjectCardData[] }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const counts = useMemo(
    () => ({
      all: projects.length,
      published: projects.filter((p) => p.published).length,
      drafts: projects.filter((p) => !p.published).length,
    }),
    [projects],
  )

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()

    return projects.filter((project) => {
      if (filter === 'published' && !project.published) return false
      if (filter === 'drafts' && project.published) return false

      if (!term) return true

      return (
        project.name.toLowerCase().includes(term) ||
        project.category.toLowerCase().includes(term)
      )
    })
  }, [projects, query, filter])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título o categoría"
            aria-label="Buscar proyectos"
            className="w-full rounded-lg border border-input bg-muted py-2.5 pr-9 pl-10 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Limpiar búsqueda"
              className="absolute top-1/2 right-2.5 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div
            role="group"
            aria-label="Filtrar por estado"
            className="flex rounded-lg border border-border bg-muted p-0.5"
          >
            {FILTERS.map(({ value, label }) => {
              const active = filter === value

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  aria-pressed={active}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                    active
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {label}
                  <span className="ml-1.5 text-muted-foreground/70">
                    {counts[value]}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {visible.length > 0 ? (
        <>
          <p className="text-xs text-muted-foreground">
            {visible.length === projects.length
              ? `${visible.length} ${visible.length === 1 ? 'proyecto' : 'proyectos'}`
              : `${visible.length} de ${projects.length} proyectos`}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <span className="grid size-11 place-items-center rounded-full border border-border text-muted-foreground">
            <FolderKanban className="size-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">
              Todavía no hay proyectos
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Creá el primero para que aparezca en el sitio.
            </p>
          </div>
          <Link href="/admin/proyectos/nuevo" className={buttonVariants({ className: 'mt-1' })}>
            <Plus />
            Nuevo proyecto
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <span className="grid size-11 place-items-center rounded-full border border-border text-muted-foreground">
            <Search className="size-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">Sin resultados</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ningún proyecto coincide con la búsqueda o el filtro.
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-1"
            onClick={() => {
              setQuery('')
              setFilter('all')
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  )
}
