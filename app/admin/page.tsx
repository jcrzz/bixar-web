import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { DeleteButton } from './DeleteButton'

export default async function AdminPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Proyectos</h2>
        <Link
          href="/admin/proyectos/nuevo"
          className="bg-[#09C895] px-4 py-2 text-sm font-semibold text-[#202020] transition hover:bg-[#56e4bc]"
        >
          + Nuevo Proyecto
        </Link>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center gap-4 border border-white/10 bg-white/5 p-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.cover}
              alt={project.name}
              className="h-16 w-16 object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{project.name}</h3>
              <p className="text-sm text-white/60">{project.category}</p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/proyectos/${project.id}/editar`}
                className="border border-white/20 px-3 py-1 text-sm hover:border-[#09C895]"
              >
                Editar
              </Link>
              <DeleteButton id={project.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
