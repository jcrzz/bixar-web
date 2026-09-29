import { Zap } from 'lucide-react'
import { SectionLabel } from './SectionLabel'

export function Advantage() {
  return (
    <section className="relative overflow-hidden bg-[#1F2832] px-6 py-28 lg:px-10 lg:py-40">
      <div className="relative mx-auto max-w-7xl">
        <SectionLabel>Una forma distinta de hacer</SectionLabel>
        <h2 className="max-w-5xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl">
          Nuestra ventaja competitiva es la{' '}
          <span className="text-[#09C895]">ingeniería coordinada.</span>
        </h2>
        <div className="mt-12 flex max-w-2xl gap-5 border-l border-[#09C895] pl-6">
          <Zap className="mt-1 shrink-0 text-[#09C895]" size={22} />
          <p className="text-lg leading-8 text-white/60">
            Integramos cálculo estructural, diseño de instalaciones y modelado BIM
            para desarrollar proyectos más precisos, detectar interferencias antes
            de la obra y optimizar cada etapa del proceso.
          </p>
        </div>
      </div>
    </section>
  )
}
