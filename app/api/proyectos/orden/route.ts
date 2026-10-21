import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { unauthorizedIfNoSession } from '@/lib/api-auth'
import { toValidationError } from '@/lib/api-errors'

const orderSchema = z.object({
  ids: z
    .array(z.string().min(1))
    .min(1, 'Se requiere al menos un proyecto')
    .refine((ids) => new Set(ids).size === ids.length, {
      message: 'Los ids no pueden repetirse',
    }),
})

/**
 * Reorders the public project list. The array position *is* the new `order`:
 * ids[0] becomes order 0, ids[1] becomes order 1, and so on.
 *
 * The update is optimistic on the client: the list moves instantly and this
 * endpoint is called after the drop. A failure reverts the local order.
 */
export async function PATCH(request: Request) {
  const unauthorized = await unauthorizedIfNoSession()
  if (unauthorized) return unauthorized

  try {
    const { ids } = orderSchema.parse(await request.json())

    // Single transaction so a mid-way failure cannot leave two projects
    // sharing an order value.
    await prisma.$transaction(async (tx) => {
      for (const [index, id] of ids.entries()) {
        await tx.project.update({
          where: { id },
          data: { order: index },
        })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const validation = toValidationError(error)
    if (validation) {
      return NextResponse.json(validation, { status: 400 })
    }

    console.error('Error al reordenar proyectos', error)
    return NextResponse.json(
      { error: 'Error al guardar el orden' },
      { status: 500 }
    )
  }
}
