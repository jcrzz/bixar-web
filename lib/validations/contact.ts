import { z } from 'zod'

/**
 * Validation for the public contact form.
 *
 * Limits are generous enough for a real enquiry and tight enough that the
 * endpoint cannot be used as free storage or a mail relay.
 *
 * As in `auth.ts`, every field names its own missing-value message: without it
 * an empty submit renders Zod's "Invalid input: expected string, received
 * undefined" in the visitor's face.
 */
export const contactSchema = z.object({
  name: z
    .string({ error: 'Ingresá tu nombre' })
    .trim()
    .min(2, 'Ingresá tu nombre')
    .max(120, 'El nombre es demasiado largo'),

  email: z
    .string({ error: 'Ingresá tu email' })
    .trim()
    .toLowerCase()
    .email('Ingresá un email válido')
    .max(200, 'El email es demasiado largo'),

  message: z
    .string({ error: 'Contanos un poco más sobre el proyecto' })
    .trim()
    .min(10, 'Contanos un poco más sobre el proyecto')
    .max(4000, 'El mensaje es demasiado largo (máximo 4000 caracteres)'),

  /**
   * Honeypot. Rendered off-screen and never announced, so a human neither sees
   * nor fills it; automated form fillers populate every field they find.
   */
  company: z
    .string({ error: '' })
    .max(200)
    .optional()
    .or(z.literal('')),
})

export type ContactInput = z.infer<typeof contactSchema>