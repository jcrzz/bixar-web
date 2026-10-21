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
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
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

    // The cover is part of the unified gallery: keep it in the list so the
    // public modal never needs a separate cover fallback.
    const imageUrls = images.includes(projectData.cover)
      ? images
      : [projectData.cover, ...images]

    // New projects go to the end of the public order. Without this they would
    // keep the schema default (0) and jump to the front once an admin has
    // reordered anything.
    const last = await prisma.project.aggregate({ _max: { order: true } })

    const project = await prisma.project.create({
      data: {
        ...projectData,
        // Blank means "no location": stored as null, not as an empty string.
        location: projectData.location.trim() || null,
        order: (last._max.order ?? -1) + 1,
        images: {
          create: imageUrls.map((url, index) => ({ url, order: index })),
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
