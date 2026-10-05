'use client'

import { useState } from 'react'
import { ArrowUpRight, Check, Mail, MapPin, Phone } from 'lucide-react'
import { SectionLabel } from './SectionLabel'
import { site } from '@/lib/site'

type Status = 'idle' | 'sending' | 'sent'

export function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    setStatus('sending')
    setError('')
    setFieldErrors({})

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          message: data.get('message'),
          // Present but never filled by a human: hidden and excluded from
          // tab order and assistive tech.
          company: data.get('company'),
        }),
      })

      const payload = await res.json().catch(() => ({}))

      if (res.ok) {
        setStatus('sent')
        form.reset()
        return
      }

      setFieldErrors(payload.fields ?? {})
      setError(payload.error || 'No pudimos enviar tu mensaje. Intentá de nuevo.')
      setStatus('idle')
    } catch {
      setError('Error de conexión. Revisá tu internet e intentá de nuevo.')
      setStatus('idle')
    }
  }

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
              href={site.address.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex gap-3 hover:text-white"
            >
              <MapPin className="shrink-0 text-[#09C895]" size={18} />
              <span>
                {site.address.street}
                <br />
                {site.address.city}, {site.address.region}
              </span>
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex gap-3 hover:text-white"
            >
              <Mail className="text-[#09C895]" size={18} />
              {site.email}
            </a>
            <a
              href={`tel:${site.phone.href}`}
              className="flex gap-3 hover:text-white"
            >
              <Phone className="text-[#09C895]" size={18} />
              {site.phone.display}
            </a>
          </div>
        </div>

        {/* Right: Form */}
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          <label className="form-label" htmlFor="contact-name">
            Nombre y apellido
          </label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            aria-invalid={fieldErrors.name ? true : undefined}
            className="form-input aria-[invalid=true]:border-red-400"
          />
          {fieldErrors.name && (
            <p role="alert" className="-mt-6 text-xs text-red-400">
              {fieldErrors.name}
            </p>
          )}

          <label className="form-label" htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            aria-invalid={fieldErrors.email ? true : undefined}
            className="form-input aria-[invalid=true]:border-red-400"
          />
          {fieldErrors.email && (
            <p role="alert" className="-mt-6 text-xs text-red-400">
              {fieldErrors.email}
            </p>
          )}

          <label className="form-label" htmlFor="contact-message">
            Mensaje
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            maxLength={4000}
            aria-invalid={fieldErrors.message ? true : undefined}
            className="form-input resize-none aria-[invalid=true]:border-red-400"
          />
          {fieldErrors.message && (
            <p role="alert" className="-mt-6 text-xs text-red-400">
              {fieldErrors.message}
            </p>
          )}

          {/* Honeypot: off-screen, not announced, not focusable. Bots that fill
              every input they find trip this; people never see it. */}
          <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
            <label htmlFor="contact-company">Empresa</label>
            <input
              id="contact-company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            className="button-primary"
            type="submit"
            disabled={status === 'sending'}
          >
            {status === 'sending'
              ? 'Enviando...'
              : status === 'sent'
                ? 'Mensaje enviado'
                : 'Evaluar proyecto'}{' '}
            {status === 'sending' ? null : <ArrowUpRight size={16} />}
          </button>

          {status === 'sent' && (
            <p
              role="status"
              className="flex items-center gap-2 text-sm text-[#09C895]"
            >
              <Check size={16} /> Gracias, nos pondremos en contacto.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}