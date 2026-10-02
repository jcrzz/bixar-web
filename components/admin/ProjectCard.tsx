'use client'

import Link from 'next/link'
import { ExternalLink, ImageIcon, Pencil } from 'lucide-react'

import { DeleteProjectButton } from '@/components/admin/DeleteProjectButton'
import { cn } from '@/lib/utils'

export type ProjectCardData = {
  id: string
  name: string
  category: string
  cover: string
  published: boolean
  imageCount: number
}

const ACTION_BASE =
  'grid size-8 place-items-center rounded-lg border border-border bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200',
        'hover:border-primary/50',
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {project.cover ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={project.cover}
            alt={project.name}
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid size-full place-items-center text-muted-foreground">
            <ImageIcon className="size-8" />
          </div>
        )}

        {!project.published && (
          <span className="absolute top-3 left-3 rounded-md bg-background/80 px-2 py-1 text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase backdrop-blur-sm">
            Borrador
          </span>
        )}

        {/* Always visible on touch, revealed on hover for pointer devices. */}
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
          {project.published && (
            <a
              href={`/#proyecto-${project.id}`}
              target="_blank"
              rel="noreferrer"
              title="Ver en el sitio"
              aria-label="Ver en el sitio"
              className={cn(ACTION_BASE, 'hover:text-foreground')}
            >
              <ExternalLink className="size-4" />
            </a>
          )}

          <Link
            href={`/admin/proyectos/${project.id}/editar`}
            title="Editar"
            aria-label={`Editar ${project.name}`}
            className={cn(ACTION_BASE, 'hover:text-foreground')}
          >
            <Pencil className="size-4" />
          </Link>

          <DeleteProjectButton
            id={project.id}
            name={project.name}
            triggerClassName={cn(ACTION_BASE, 'hover:border-destructive/50 hover:text-destructive')}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
          {project.name}
        </h3>

        <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-muted-foreground">
          <span className="truncate">{project.category}</span>
          {project.imageCount > 0 && (
            <>
              <span aria-hidden className="size-1 shrink-0 rounded-full bg-muted-foreground/40" />
              <span className="shrink-0">
                {project.imageCount}{' '}
                {project.imageCount === 1 ? 'imagen' : 'imágenes'}
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
