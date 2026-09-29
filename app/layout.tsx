import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { JsonLd } from '@/components/JsonLd'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://bixar.com.ar'),
  title: {
    default: 'Bixar Ingeniería',
    template: '%s | Bixar Ingeniería',
  },
  description:
    'Soluciones de ingeniería aplicada, cálculo estructural, instalaciones y coordinación BIM. Proyectos integrales con precisión técnica y criterio constructivo.',
  keywords: [
    'ingeniería',
    'cálculo estructural',
    'instalaciones',
    'BIM',
    'construcción',
    'arquitectura',
    'Concepción del Uruguay',
    'Entre Ríos',
  ],
  authors: [{ name: 'Bixar Ingeniería' }],
  creator: 'Bixar Ingeniería',
  generator: 'Bixar Ingeniería',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://bixar.com.ar',
    siteName: 'Bixar Ingeniería',
    title: 'Bixar Ingeniería',
    description:
      'Soluciones de ingeniería aplicada, cálculo estructural, instalaciones y coordinación BIM.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Bixar Ingeniería',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bixar Ingeniería',
    description:
      'Soluciones de ingeniería aplicada, cálculo estructural, instalaciones y coordinación BIM.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#202020',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="bg-[#202020]">
      <head>
        <JsonLd />
      </head>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
