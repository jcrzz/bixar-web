<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Stack

- Next.js 16.3.3 (App Router) · React 19 · TypeScript · Tailwind CSS v4
- pnpm 12.3.4 — no usar npm/yarn
- Prisma 6.19.3 + PostgreSQL (Neon) · Vercel Blob · Resend
- shadcn/ui (estilo base-nova, primitivas de Base UI)
- Todo el texto de la UI está en español (es_AR)

## Comandos

```bash
pnpm dev              # servidor de desarrollo
pnpm build            # build de producción
pnpm lint / lint:fix  # ESLint
pnpm type-check       # tsc --noEmit
pnpm db:migrate       # prisma migrate dev (necesita DIRECT_URL)
pnpm db:deploy        # prisma migrate deploy
pnpm db:seed          # seed de admin + proyectos (necesita SEED_ADMIN_*)
pnpm db:studio        # Prisma Studio
pnpm admin:reset-password  # tsx scripts/reset-password.ts
pnpm email:check      # verificar config de Resend
pnpm dns:resend       # configuración DNS para Resend
```

No hay suite de tests. La verificación es `pnpm lint && pnpm type-check`.

## Variables de entorno

Los secretos viven en `.env.local` (ignorado por git). Copiar `.env.example` → `.env.local`.

| Variable | Obligatoria | Notas |
|---|---|---|
| `DATABASE_URL` | runtime | Conexión pooled de Neon (el host termina en `-pooler`) |
| `DIRECT_URL` | migraciones | Conexión directa de Neon; la app nunca la usa en runtime |
| `AUTH_SECRET` | runtime | ≥32 caracteres. `openssl rand -base64 32`. Sin fallback — la app falla ruidosamente sin ella |
| `BLOB_READ_WRITE_TOKEN` | producción | Vercel Blob. Los uploads fallan en prod sin ella |
| `RESEND_API_KEY` | email | Recuperación de contraseña + formulario de contacto |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | solo seed | Contraseña ≥12 caracteres |

`prisma.config.ts` carga `.env.local` explícitamente porque el CLI de Prisma solo lee `.env` por defecto.

## Arquitectura

**Dos superficies:** sitio de marketing público (`/`) y panel de administración (`/admin`, protegido por cookie de sesión JWT).

**Auth** (`lib/auth.ts`): sesiones JWT sin estado (jose) en cookie httpOnly, TTL de 7 días. `getSession()` compara el `iat` del token contra `Admin.passwordChangedAt` para rechazar sesiones emitidas antes de un cambio de contraseña. Sin secreto fallback.

**Recuperación de contraseña** (`lib/password-reset.ts`): solo se guarda el SHA-256 del token. TTL de 15 minutos, un solo uso, comparación con `timingSafeEqual`. Pedir un nuevo token elimina todos los anteriores de ese admin.

**Rate limiting** (`lib/rate-limit.ts`): respaldado por Postgres, no en memoria. Los lambdas serverless no comparten memoria, así que un `Map` no limitaría nada en producción. Usar `checkRateLimit()` (cuenta cada request) o `peekRateLimit()` + `recordRateLimitHit()` (cobrar solo en fallo, ej. login).

**Almacenamiento de imágenes** (`lib/storage.ts`): Vercel Blob en producción, `public/uploads/` localmente cuando no hay token. Un token presente pero inválido falla ruidosamente en todos los entornos.

**Reglas de upload** (`lib/upload-rules.ts`): compartidas entre cliente y servidor. No importar `lib/storage.ts` (trae `@vercel/blob` + `node:fs`) desde componentes de cliente.

**Email** (`lib/mail.ts`): el único módulo que debe importar Resend. Usar `sendEmail()` en todos lados.

**Rutas de API:**
- Las rutas que mutan deben llamar `unauthorizedIfNoSession()` de `lib/api-auth.ts` — el layout de admin solo protege la UI.
- Usar `toValidationError()` de `lib/api-errors.ts` para convertir errores de Zod a `{ error, fields }`.
- Usar `isRecordNotFound()` para detectar Prisma P2025.

**Constantes del sitio** (`lib/site.ts`): fuente única de verdad para nombre, URL, email, teléfono, dirección. Los componentes de cliente leen de acá, no de variables de entorno.

**Datos:** `data/projects.ts`, `data/specialties.ts`, `data/pillars.ts` son contenido estático de seed. Los proyectos también están en Postgres (seedeados por `prisma/seed.ts`).

## Gotchas

- **`allowBuilds` en `pnpm-workspace.yaml`** es crítico. Sin él, pnpm 12 saltea el postinstall de `@prisma/engines`, entonces `prisma generate` no produce el query engine y el build de Vercel falla con `ERR_PNPM_IGNORED_BUILDS`.
- **`components/ui/**` está ignorado por ESLint** (generado por shadcn). No editar esos archivos manualmente.
- **El panel de admin es `force-dynamic`** — lee la cookie de sesión y filas de la BD en cada request. Nunca prerrenderizarlo.
- **La homepage tiene `revalidate = 60`** — los edits del panel aparecen en ~60s.
- **El formulario de contacto persiste en BD antes de enviar el email.** Si Resend falla, el lead queda en `ContactMessage`.
- **El seed hace upsert del admin por email.** Cambiar `SEED_ADMIN_EMAIL` y re-seedear crea un *segundo* admin en lugar de renombrar el existente.
- **No hay workflows de CI.** La verificación es manual: `pnpm lint && pnpm type-check`.
