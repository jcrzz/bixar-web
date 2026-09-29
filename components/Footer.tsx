import { Mail, MapPin, MoveUpRight } from 'lucide-react'
import { Logo } from './Logo'
import { SocialIcon } from './SocialIcon'

const socialLinks = [
  { network: 'linkedin' as const, href: 'https://www.linkedin.com', label: 'LinkedIn' },
  { network: 'instagram' as const, href: 'https://www.instagram.com', label: 'Instagram' },
  { network: 'facebook' as const, href: 'https://www.facebook.com', label: 'Facebook' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#171717] px-6 pt-16 lg:px-10 lg:pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 pb-16 md:grid-cols-[1.3fr_.7fr] lg:gap-24">
          {/* Brand */}
          <div>
            <Logo />
            <p className="mt-7 max-w-md text-sm leading-6 text-white/55">
              Integramos Ingeniería, Arquitectura y Construcción bajo una sola firma.
              Soluciones técnicas y creativas, ejecutadas con precisión.
            </p>
            <div className="mt-7 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.network}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center bg-white/[.07] text-white/65 transition hover:bg-[#09C895] hover:text-[#171717]"
                >
                  <SocialIcon network={social.network} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-[.2em] text-[#09C895]">
              Contacto
            </h2>
            <div className="mt-7 space-y-5 text-sm text-white/60">
              <a
                href="mailto:contacto@bixar.com"
                className="flex items-center gap-3 transition hover:text-white"
              >
                <Mail size={17} /> contacto@bixar.com
              </a>
              <a
                href="tel:+541100000000"
                className="flex items-center gap-3 transition hover:text-white"
              >
                <MoveUpRight size={17} /> +54 11 0000 0000
              </a>
              <p className="flex items-center gap-3">
                <MapPin size={17} /> Buenos Aires, AR
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Bixar. Todos los derechos reservados.</p>
          <p>Ingeniería · Arquitectura · Construcción</p>
        </div>
      </div>
    </footer>
  )
}
