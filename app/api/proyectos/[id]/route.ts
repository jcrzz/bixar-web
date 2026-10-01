import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { projectSchema } from '@/lib/validations/project'
import { unauthorizedIfNoSession } from '@/lib/api-auth'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: { orderBy: { order: 'asc' } } },
  })

  if (!project) {
    return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
  }

  return NextResponse.json({
    ...project,
    images: project.images.map((image) => image.url),
  })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await unauthorizedIfNoSession()
  if (unauthorized) return unauthorized

  try {
    const { id } = await params
    const body = await request.json()
    const data = projectSchema.parse(body)

    const { images, ...projectData } = data

    // The gallery is replaced wholesale, so clear the previous rows first.
    await prisma.projectImage.deleteMany({ where: { projectId: id } })

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        images: {
          create: images.map((url, index) => ({ url, order: index })),
        },
      },
      include: { images: true },
    })

    return NextResponse.json(project)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Error desconocido' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await unauthorizedIfNoSession()
  if (unauthorized) return unauthorized

  const { id } = await params

  try {
    // ProjectImage rows cascade, so this is a single statement.
    await prisma.project.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    console.error('Error al eliminar proyecto', error)
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
