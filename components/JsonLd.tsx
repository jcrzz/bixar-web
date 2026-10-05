import { site } from '@/lib/site'

export function JsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.name,
    description:
      'Soluciones de ingeniería aplicada, cálculo estructural, instalaciones y coordinación BIM.',
    url: site.url,
    // Read from the shared config: this used to advertise hola@bixar.com.ar
    // while every visible contact point on the site showed a different address.
    email: site.email,
    telephone: site.phone.href,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    areaServed: 'Argentina',
    knowsAbout: [
      'Cálculo estructural',
      'Instalaciones',
      'BIM',
      'Ingeniería civil',
      'Construcción',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
