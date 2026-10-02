import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { projectSchema } from '@/lib/validations/project'
import { unauthorizedIfNoSession } from '@/lib/api-auth'
import { toValidationError } from '@/lib/api-errors'

/**
 * Public read endpoint: only published projects, so drafts never leak.
 * The admin panel reads straight from Prisma in a server component instead.
 */
export async function GET() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { images: { orderBy: { order: 'asc' } } },
  })

  return NextResponse.json(
    projects.map(({ images, ...project }) => ({
      ...project,
      images: images.map((image) => image.url),
    }))
  )
}

export async function POST(request: Request) {
  const unauthorized = await unauthorizedIfNoSession()
  if (unauthorized) return unauthorized

  try {
    const body = await request.json()
    const data = projectSchema.parse(body)

    const { images, ...projectData } = data

    const project = await prisma.project.create({
      data: {
        ...projectData,
        images: {
          create: images.map((url, index) => ({ url, order: index })),
        },
      },
      include: { images: true },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    const validation = toValidationError(error)
    if (validation) {
      return NextResponse.json(validation, { status: 400 })
    }

    console.error('Error al crear proyecto', error)
    return NextResponse.json({ error: 'Error al crear el proyecto' }, { status: 500 })
  }
}
