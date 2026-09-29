'use client'

import { useState } from 'react'
import { ArrowUpRight, Check, Mail, MapPin, Phone } from 'lucide-react'
import { SectionLabel } from './SectionLabel'

export function Contact() {
  const [sent, setSent] = useState(false)

  return (
    <section
      id="contacto"
      className="border-t border-white/10 px-6 py-28 lg:px-10 lg:py-40"
    >
      <div className="mx-auto grid max-w-7xl gap-20 lg:grid-cols-[.8fr_1.2fr]">
        {/* Left: Info */}
        <div>
          <SectionLabel>Contacto</SectionLabel>
          <h2 className="text-5xl font-semibold leading-tight tracking-[-0.05em] sm:text-7xl">
            Evaluemos
            <br />
            <span className="text-[#186DD4]">tu proyecto.</span>
          </h2>
          <p className="mt-6 max-w-md text-sm text-white/55">
            Coordinamos una reunión sin compromiso para evaluar alcance, plazos y
            presupuesto.
          </p>
          <div className="mt-20 space-y-6 text-sm text-white/55">
            <a
              href="https://www.google.com/maps/place/Sarmiento+1564,+Concepci%C3%B3n+del+Uruguay,+Entre+R%C3%ADos/@-32.4893701,-58.2494713,1018m/data=!3m2!1e3!4b1!4m6!3m5!1s0x95afdbb20f99e7e3:0x7e26bd81ffe2d993!8m2!3d-32.4893701!4d-58.246891!16s%2Fg%2F11c25fn4ll?entry=ttu&g_ep=EgoyMDI2MDkyNy4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noreferrer"
              className="flex gap-3 hover:text-white"
            >
              <MapPin className="shrink-0 text-[#09C895]" size={18} />
              <span>
                Sarmiento 1564
                <br />
                Concepción del Uruguay, E.R.
              </span>
            </a>
            <a href="mailto:bixar.ingenieria@gmail.com" className="flex gap-3 hover:text-white">
              <Mail className="text-[#09C895]" size={18} />
              bixar.ingenieria@gmail.com
            </a>
            <a href="tel:+5492901307648" className="flex gap-3 hover:text-white">
              <Phone className="text-[#09C895]" size={18} />
              2901-307648
            </a>
          </div>
        </div>

        {/* Right: Form */}
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setSent(true)
          }}
          className="space-y-8"
        >
          <label className="form-label">
            Nombre y apellido
            <input required className="form-input" name="name" autoComplete="name" />
          </label>
          <label className="form-label">
            Email
            <input
              required
              type="email"
              className="form-input"
              name="email"
              autoComplete="email"
            />
          </label>
          <label className="form-label">
            Mensaje
            <textarea
              required
              rows={5}
              className="form-input resize-none"
              name="message"
            />
          </label>
          <button className="button-primary" type="submit">
            {sent ? 'Mensaje enviado' : 'Evaluar proyecto'} <ArrowUpRight size={16} />
          </button>
          {sent && (
            <p className="flex items-center gap-2 text-sm text-[#09C895]">
              <Check size={16} /> Gracias, nos pondremos en contacto.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
