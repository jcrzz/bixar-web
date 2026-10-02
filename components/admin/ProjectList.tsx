import { prisma } from '@/lib/prisma'
import { ProjectGrid } from '@/components/admin/ProjectGrid'
import type { ProjectCardData } from '@/components/admin/ProjectCard'

/**
 * Server component: reads the projects straight from Postgres and hands plain
 * data to the client grid, which only needs it to search and filter.
 */
export async function ProjectList() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      category: true,
      cover: true,
      published: true,
      _count: { select: { images: true } },
    },
  })

  const data: ProjectCardData[] = projects.map((project) => ({
    id: project.id,
    name: project.name,
    category: project.category,
    cover: project.cover,
    published: project.published,
    imageCount: project._count.images,
  }))

  return <ProjectGrid projects={data} />
}
