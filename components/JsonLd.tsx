export function JsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Bixar Ingeniería',
    description:
      'Soluciones de ingeniería aplicada, cálculo estructural, instalaciones y coordinación BIM.',
    url: 'https://bixar.com.ar',
    email: 'hola@bixar.com.ar',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Sarmiento 1564',
      addressLocality: 'Concepción del Uruguay',
      addressRegion: 'Entre Ríos',
      addressCountry: 'AR',
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
