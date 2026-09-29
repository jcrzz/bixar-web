import { MoveUpRight } from 'lucide-react'
import { SectionLabel } from './SectionLabel'

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[780px] items-end border-b border-white/10 px-6 pb-20 pt-36 lg:min-h-screen lg:px-10 lg:pb-28"
    >
      {/* Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #202020 0%, rgba(32,32,32,.78) 40%, rgba(32,32,32,.25) 100%), url('https://images.unsplash.com/photo-1503387762-592dea58ef25?auto=format&fit=crop&w=2200&q=85')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      />

      {/* Decorative element */}
      <div className="absolute right-[12%] top-1/3 hidden h-56 w-56 border border-[#186DD4]/40 lg:block">
        <div className="absolute -right-4 -top-4 h-full w-full border border-[#09C895]/30" />
      </div>

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl">
        <SectionLabel>Ingeniería que transforma</SectionLabel>
        <h1 className="max-w-4xl text-balance text-5xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[5rem]">
          Proyectos integrales,
          <br />
          <span className="text-[#186DD4]">resultados</span> de calidad.
        </h1>
        <p className="mt-8 max-w-lg text-base leading-7 text-white/60">
          Desarrollamos soluciones de ingeniería aplicada, combinando precisión
          técnica, experiencia y tecnología.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#contacto" className="button-primary">
            Iniciar proyecto <MoveUpRight size={16} />
          </a>
          <a href="#nosotros" className="button-secondary">
            Conocé Bixar
          </a>
        </div>
      </div>
    </section>
  )
}
