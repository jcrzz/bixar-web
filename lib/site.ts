/**
 * Single source of truth for the details the site repeats in several places.
 *
 * These used to be hardcoded per component, and they had drifted apart: the
 * contact section showed bixar.ingenieria@gmail.com while the JSON-LD
 * advertised hola@bixar.com.ar, and the footer displayed a real phone number
 * behind a `tel:` link pointing at the 1100 placeholder — so the button nobody
 * was ever meant to press dialed the fire brigade. Everything now reads from
 * here, so a wrong value can only be fixed in one spot.
 *
 * Values are literals rather than env vars because the client components
 * (`Contact.tsx`, `Footer.tsx`) cannot read server-side env at runtime. Only
 * the site URL, which is already public via NEXT_PUBLIC_*, is configurable.
 */
export const site = {
  name: 'Bixar Ingeniería',

  /** Canonical origin. NEXT_PUBLIC_* is inlined at build time, so it is safe in client components. */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bixar.com.ar',

  /** Public contact address — shown in the UI, the footer and the structured data. */
  email: 'bixar.ingenieria@gmail.com',

  phone: {
    /** How it is displayed to people. */
    display: '2901-307648',
    /** How a phone is dialled: no symbols, no leading zero, 54 for Argentina. */
    href: '+5492901307648',
  },

  address: {
    street: 'Sarmiento 1564',
    city: 'Concepción del Uruguay',
    region: 'Entre Ríos',
    regionShort: 'Entre Ríos, AR',
    country: 'AR',
    mapsUrl:
      'https://www.google.com/maps/place/Sarmiento+1564,+Concepci%C3%B3n+del+Uruguay,+Entre+R%C3%ADos/@-32.4893701,-58.2494713,1018m/data=!3m2!1e3!4b1!4m6!3m5!1s0x95afdbb20f99e7e3:0x7e26bd81ffe2e993!8m2!3d-32.4893701!4d-58.246891!16s%2Fg%2F11c25fn4ll',
  },
} as const

/**
 * Where "olvidé mi contraseña" sends the reset link to.
 *
 * Falls back to `site.email` so a fresh deploy still works with only the site
 * constants set; override with CONTACT_NOTIFICATION_EMAIL to route submissions
 * to a different inbox.
 */
export const CONTACT_NOTIFICATION_EMAIL =
  process.env.CONTACT_NOTIFICATION_EMAIL || site.email