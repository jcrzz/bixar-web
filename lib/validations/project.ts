import { z } from 'zod'

/**
 * Same note as in `auth.ts`: without `{ error }`, a field that is absent comes
 * back as "Invalid input: expected string, received undefined" instead of the
 * message below, and the admin form would render that English text.
 */
export const projectSchema = z.object({
  name: z
    .string({ error: 'El título es requerido' })
    .min(1, 'El título es requerido')
    .max(200),
  category: z
    .string({ error: 'La categoría es requerida' })
    .min(1, 'La categoría es requerida')
    .max(100),
  description: z
    .string({ error: 'La descripción es requerida' })
    .min(1, 'La descripción es requerida'),
  cover: z
    .string({ error: 'La imagen de portada es requerida' })
    .min(1, 'La imagen de portada es requerida'),
  images: z.array(z.string()).default([]),
  published: z.boolean().default(true),
})

export type ProjectInput = z.infer<typeof projectSchema>
