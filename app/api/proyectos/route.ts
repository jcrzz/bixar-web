import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { projectSchema } from '@/lib/validations/project'

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: { images: true },
  })
  return NextResponse.json(projects)
}

export async function POST(request: Request) {
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
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Error desconocido' }, { status: 500 })
  }
}
