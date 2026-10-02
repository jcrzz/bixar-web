import { notFound } from 'next/navigation'

import { PageHeader } from '@/components/admin/PageHeader'
import { ProjectFormDialog } from '@/components/admin/ProjectFormDialog'
import { ProjectList } from '@/components/admin/ProjectList'
import { prisma } from '@/lib/prisma'

type EditarProyectoPageProps = {
  params: Promise<{ id: string }>
}

/**
 * Server component on purpose. The previous version fetched the project from a
 * `useEffect` and never checked `res.ok`, so a 404 left the form blank with no
 * error. Reading it here means a missing project is a real 404, and the form
 * always mounts with valid data.
 */
export default async function EditarProyectoPage({
  params,
}: EditarProyectoPageProps) {
  const { id } = await params

  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
      cover: true,
      published: true,
      images: { orderBy: { order: 'asc' }, select: { url: true } },
    },
  })

  if (!project) {
    notFound()
  }

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none space-y-6 select-none blur-[1px]"
      >
        <PageHeader />
        <ProjectList />
      </div>

      <ProjectFormDialog
        mode="edit"
        project={{ ...project, images: project.images.map((i) => i.url) }}
      />
    </>
  )
}
