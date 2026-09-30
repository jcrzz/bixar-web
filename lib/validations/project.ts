import { z } from 'zod'

export const projectSchema = z.object({
  name: z.string().min(1, 'El título es requerido').max(200),
  category: z.string().min(1, 'La categoría es requerida').max(100),
  description: z.string().min(1, 'La descripción es requerida'),
  cover: z.string().min(1, 'La imagen de portada es requerida'),
  images: z.array(z.string()).default([]),
  published: z.boolean().default(true),
})

export type ProjectInput = z.infer<typeof projectSchema>
