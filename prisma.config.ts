import path from 'path'
import dotenv from 'dotenv'
import { defineConfig } from 'prisma/config'

// Prisma CLI only reads .env by default. This project keeps secrets in
// .env.local (shared with Next.js), so load it explicitly.
dotenv.config({ path: path.resolve(import.meta.dirname, '.env.local') })

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
    seed: 'tsx prisma/seed.ts',
  },
})
