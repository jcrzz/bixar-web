import { prisma } from '@/lib/prisma'
import { projects as hardcodedProjects } from '@/data/projects'
import { Projects } from './Projects'
import type { Project } from '@/types'

/**
 * Server wrapper for the client-side carousel: reads published projects from
 * the database and hands them down as plain props.
 *
 * Falls back to the hardcoded list when the database is unreachable, so a
 * database outage degrades the section instead of blanking the homepage.
 * An empty table is *not* a failure and renders as an empty section.
 */
export async function ProjectsSection() {
  let projects: Project[]

  try {
    const rows = await prisma.project.findMany({
      where: { published: true },
      orderBy: { createdAt: 'asc' },
      include: { images: { orderBy: { order: 'asc' } } },
    })

    projects = rows.map(({ id, createdAt, updatedAt, published, ...row }) => ({
      name: row.name,
      category: row.category,
      description: row.description,
      cover: row.cover,
      // The carousel and modal index into this array unguarded, so a project
      // with an empty gallery still needs at least its cover.
      images:
        row.images.length > 0 ? row.images.map((image) => image.url) : [row.cover],
    }))
  } catch (error) {
    console.error(
      'No se pudieron leer los proyectos de la base, se usa la lista local.',
      error
    )
    projects = hardcodedProjects
  }

  return <Projects projects={projects} />
}
