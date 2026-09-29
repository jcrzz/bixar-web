import { Mail, MapPin, MoveUpRight } from 'lucide-react'
import { Logo } from './Logo'
import { SocialIcon } from './SocialIcon'

const socialLinks = [
  { network: 'linkedin' as const, href: 'https://www.linkedin.com', label: 'LinkedIn' },
  { network: 'instagram' as const, href: 'https://www.instagram.com/bixaringenieria/', label: 'Instagram' },
  { network: 'facebook' as const, href: 'https://www.facebook.com/bixaringenieria', label: 'Facebook' },
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
                href="mailto:bixar.ingenieria@gmail.com"
                className="flex items-center gap-3 transition hover:text-white"
              >
                <Mail size={17} /> bixar.ingenieria@gmail.com
              </a>
              <a
                href="tel:+541100000000"
                className="flex items-center gap-3 transition hover:text-white"
              >
                <MoveUpRight size={17} /> +54 2901-307648
              </a>
              <a
                href="https://www.google.com/maps/place/Sarmiento+1564,+Concepci%C3%B3n+del+Uruguay,+Entre+R%C3%ADos/@-32.4893701,-58.2494713,1018m/data=!3m2!1e3!4b1!4m6!3m5!1s0x95afdbb20f99e7e3:0x7e26bd81ffe2d993!8m2!3d-32.4893701!4d-58.246891!16s%2Fg%2F11c25fn4ll?entry=ttu&g_ep=EgoyMDI2MDkyNy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition hover:text-white"
              >
                <MapPin size={17} /> Entre Rios, AR
              </a>
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
