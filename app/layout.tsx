import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bixar Ingeniería | Proyectos integrales, resultados de calidad',
  description: 'Soluciones de ingeniería aplicada, cálculo estructural, instalaciones y coordinación BIM.',
  generator: 'Bixar Ingeniería',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#202020',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="bg-[#202020]">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
