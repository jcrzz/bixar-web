'use client'

import { useState } from 'react'
import { Activity, Calculator, ChevronLeft, ChevronRight, Cpu, Layers3 } from 'lucide-react'
import { specialties } from '@/data/specialties'
import { SectionLabel } from './SectionLabel'

const iconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  'Cálculo estructural': Calculator,
  Instalaciones: Activity,
  'Estudios técnicos': Layers3,
  BIM: Cpu,
}

export function Specialties() {
  const [activeSpecialty, setActiveSpecialty] = useState(0)

  const moveSpecialty = (direction: number) => {
    setActiveSpecialty(
      (current) => (current + direction + specialties.length) % specialties.length
    )
  }

  return (
    <section id="ingenieria" className="px-6 py-28 lg:px-10 lg:py-40">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <SectionLabel>Ingeniería</SectionLabel>
            <h2 className="max-w-xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl">
              Ingeniería basada en{' '}
              <span className="text-[#186DD4]">precisión y criterio técnico</span>
            </h2>
          </div>
          <p className="max-w-xl justify-self-end text-lg leading-8 text-white/60 lg:text-right">
            Gestionamos todo el proceso mediante herramientas BIM y seguimiento de
            obra para transformar el diseño en resultados concretos, minimizando
            errores y optimizando recursos.
          </p>
        </div>

        {/* Carousel + Grid */}
        <div className="mt-16 overflow-hidden border border-white/10">
          {/* Image carousel */}
          <div className="specialty-carousel-viewport">
            <div
              className="specialty-carousel-track"
              style={{ '--specialty-slide': activeSpecialty } as React.CSSProperties}
            >
              {specialties.map((specialty, index) => (
                <div key={specialty.title} className="specialty-carousel-slide">
                  <img
                    src={specialty.image}
                    alt={`${specialty.title} en acción`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              aria-label="Especialidad anterior"
              onClick={() => moveSpecialty(-1)}
              className="specialty-carousel-arrow specialty-carousel-arrow-left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Siguiente especialidad"
              onClick={() => moveSpecialty(1)}
              className="specialty-carousel-arrow specialty-carousel-arrow-right"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Cards grid */}
          <div className="grid gap-px overflow-hidden border border-[#186DD4]/30 bg-[#186DD4]/30 md:grid-cols-2">
            {specialties.map((specialty, i) => {
              const Icon = iconMap[specialty.title] ?? Activity
              return (
                <button
                  type="button"
                  key={specialty.title}
                  onClick={() => setActiveSpecialty(i)}
                  className={`specialty-card group bg-[#202020] p-7 text-left lg:p-9 ${
                    activeSpecialty === i ? 'is-active' : ''
                  }`}
                  aria-pressed={activeSpecialty === i}
                >
                  <div className="mb-8 flex items-start justify-between">
                    <Icon aria-hidden="true" className="specialty-icon" size={28} strokeWidth={1.5} />
                    <span className="font-mono text-xs text-[#09C895]">0{i + 1}</span>
                  </div>
                  <h3 className="text-xl font-medium transition-colors duration-300 group-hover:text-[#09C895]">
                    {specialty.title}
                  </h3>
                  <p className="mt-3 max-w-md leading-7 text-white/55">
                    {specialty.description}
                  </p>
                  <span aria-hidden="true" className="specialty-card-line" />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
