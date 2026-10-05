import { z } from 'zod'

/**
 * Every field below carries an explicit `error` message for the *missing*
 * case, not just for the malformed one.
 *
 * Left to itself, Zod reports a missing field as "Invalid input: expected
 * string, received undefined" — developer text that `toValidationError` passes
 * straight through to the form. `{ error }` is what makes an absent field read
 * like "Ingresá tu email".
 */

/**
 * Login input.
 *
 * `toLowerCase` is not cosmetic: without it an admin who types
 * `Bixar.Ingenieria@Gmail.com` gets "invalid credentials" even though the
 * account exists, and there is no way for them to work out why.
 *
 * The length ceiling matters more than it looks. bcryptjs only considers the
 * first 72 bytes, so an unbounded string still costs the same to hash — but it
 * has to travel over the network and get parsed first, and nothing legitimate
 * is ever 200 characters long.
 */
export const loginSchema = z.object({
  email: z
    .string({ error: 'Ingresá tu email' })
    .trim()
    .toLowerCase()
    .email('Ingresá un email válido'),
  password: z
    .string({ error: 'Ingresá tu contraseña' })
    .min(1, 'Ingresá tu contraseña')
    .max(200, 'La contraseña es demasiado larga'),
})

export const forgotPasswordSchema = z.object({
  email: z
    .string({ error: 'Ingresá tu email' })
    .trim()
    .toLowerCase()
    .email('Ingresá un email válido'),
})

export const resetPasswordSchema = z
  .object({
    token: z
      .string({ error: 'Enlace inválido' })
      .min(20, 'Enlace inválido'),
    password: z
      .string({ error: 'Ingresá una contraseña' })
      .min(12, 'La contraseña debe tener al menos 12 caracteres')
      .max(200, 'La contraseña es demasiado larga'),
  })
  .refine((data) => data.password.trim().length > 0, {
    message: 'La contraseña no puede ser solo espacios',
    path: ['password'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>