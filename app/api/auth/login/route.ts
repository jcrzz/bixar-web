import { NextResponse } from 'next/server'
import { verifyCredentials, createSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    const admin = await verifyCredentials(email, password)
    if (!admin) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    await createSession(admin.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    // Swallowed errors here are undiagnosable: Vercel only records the 500, not
    // the cause, so a bad AUTH_SECRET or an unreachable DB look identical from
    // the outside. The message is generic on purpose, the log is not.
    console.error('Error en POST /api/auth/login', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
