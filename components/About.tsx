import { Building2, Check, ShieldCheck, Sparkles } from 'lucide-react'
import { pillars } from '@/data/pillars'
import { SectionLabel } from './SectionLabel'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  ShieldCheck,
  Building2,
  Sparkles,
  Check,
}

export function About() {
  return (
    <section
      id="nosotros"
      className="border-t border-white/10 bg-[#1b1b1b] px-6 py-28 lg:px-10 lg:py-40"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="grid gap-16 lg:grid-cols-[1fr_.8fr]">
          <div>
            <SectionLabel>Nosotros</SectionLabel>
            <h2 className="max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl">
              Ingeniería aplicada,
              <br />
              <span className="text-[#186DD4]">soluciones eficientes.</span>
            </h2>
          </div>
          <p className="max-w-xl self-end text-lg leading-8 text-white/60">
            En Bixar desarrollamos soluciones de ingeniería pensadas para llevarse
            a obra. Integramos cálculo, instalaciones, estudios técnicos y modelado
            BIM para resolver cada proyecto con precisión, coordinación y criterio
            constructivo.
          </p>
        </div>

        {/* Pillars */}
        <div className="mt-20 border-t border-white/10">
          <p className="py-8 font-mono text-xs uppercase tracking-[0.24em] text-white/50">
            La base de nuestros proyectos
          </p>
          <div className="grid border-b border-white/10 md:grid-cols-2">
            {pillars.map((pillar) => {
              const Icon = iconMap[pillar.icon] ?? ShieldCheck
              return (
                <div key={pillar.title} className="border-t border-white/10 p-7 lg:p-10">
                  <Icon className="mb-10 text-[#09C895]" size={22} />
                  <h3 className="text-2xl font-medium">{pillar.title}</h3>
                  <p className="mt-3 max-w-xs leading-7 text-white/50">
                    {pillar.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
