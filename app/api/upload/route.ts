import { NextResponse } from 'next/server'
import { storeImage, UploadError } from '@/lib/storage'
import { unauthorizedIfNoSession } from '@/lib/api-auth'

export async function POST(request: Request) {
  const unauthorized = await unauthorizedIfNoSession()
  if (unauthorized) return unauthorized

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 })
    }

    const url = await storeImage(file)

    return NextResponse.json({ url })
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.error('Error al subir archivo', error)
    return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 })
  }
}
