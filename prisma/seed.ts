import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { projects } from '../data/projects'

const prisma = new PrismaClient()

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error(
      'Faltan SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD. Agregalos a .env.local (mirá .env.example) y volvé a ejecutar el seed.'
    )
  }

  if (password.length < 12) {
    throw new Error('SEED_ADMIN_PASSWORD debe tener al menos 12 caracteres.')
  }

  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash: await bcrypt.hash(password, 12) },
    create: {
      email,
      passwordHash: await bcrypt.hash(password, 12),
      name: 'Administrador',
    },
  })

  console.log(`Admin listo: ${email}`)
}

async function seedProjects() {
  const existing = await prisma.project.count()

  if (existing > 0) {
    console.log(`Ya hay ${existing} proyectos en la base, se omite el seed.`)
    return
  }

  // createdAt is set explicitly: Postgres gives every row in a transaction the
  // same now(), so the public section (ordered by createdAt asc) would otherwise
  // have no deterministic order.
  const base = new Date('2024-01-01T00:00:00.000Z')

  for (const [index, project] of projects.entries()) {
    const createdAt = new Date(base.getTime() + index * 60_000)

    await prisma.project.create({
      data: {
        name: project.name,
        category: project.category,
        description: project.description,
        cover: project.cover,
        published: true,
        createdAt,
        images: {
          create: project.images.map((url, order) => ({ url, order })),
        },
      },
    })
  }

  console.log(`Proyectos creados: ${projects.length}`)
}

async function main() {
  await seedAdmin()
  await seedProjects()
}

main()
  .catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
