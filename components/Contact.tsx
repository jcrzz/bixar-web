'use client'

import { useState } from 'react'
import { ArrowUpRight, Check, Mail, MapPin } from 'lucide-react'
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
          <div className="mt-20 space-y-6 text-sm text-white/55">
            <div className="flex gap-3">
              <MapPin className="shrink-0 text-[#09C895]" size={18} />
              <span>
                Sarmiento 1564
                <br />
                Concepción del Uruguay, E.R.
              </span>
            </div>
            <a href="mailto:hola@bixar.com.ar" className="flex gap-3 hover:text-white">
              <Mail className="text-[#09C895]" size={18} />
              hola@bixar.com.ar
            </a>
            <div className="flex gap-5 pt-5 font-mono text-xs uppercase tracking-widest">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#09C895]"
              >
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#09C895]"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#09C895]"
              >
                Facebook
              </a>
            </div>
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
