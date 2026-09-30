import dotenv from 'dotenv'
import path from 'path'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const prisma = new PrismaClient()

async function main() {
  // Crear admin por defecto
  const passwordHash = await bcrypt.hash('admin123', 10)
  await prisma.admin.upsert({
    where: { email: 'admin@bixar.com' },
    update: {},
    create: {
      email: 'admin@bixar.com',
      passwordHash,
      name: 'Admin',
    },
  })

  // Migrar proyectos existentes
  const existingProjects = [
    {
      name: 'Complejo Río Uruguay',
      category: 'CÁLCULO ESTRUCTURAL · BIM',
      description: 'Desarrollo integral de estructura y modelado BIM para complejo residencial.',
      cover: 'https://images.unsplash.com/photo-1503387762-592dea58ef25?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1503387762-592dea58ef25?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Puente Vial Norte',
      category: 'INGENIERÍA VIAL',
      description: 'Cálculo y diseño de puente vial de 120m de luz.',
      cover: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      ],
    },
  ]

  for (const project of existingProjects) {
    const { images, ...projectData } = project
    await prisma.project.create({
      data: {
        ...projectData,
        images: {
          create: images.map((url, index) => ({ url, order: index })),
        },
      },
    })
  }

  console.log('Seed completado')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
