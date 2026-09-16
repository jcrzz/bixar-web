'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Activity,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Calculator,
  Layers3,
  Mail,
  MapPin,
  Menu,
  MoveUpRight,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'

const projects = [
  {
    name: 'Complejo Río Uruguay',
    category: 'Cálculo estructural · BIM',
    cover: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=85',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1503387762-592dea58ef25?auto=format&fit=crop&w=1800&q=85',
    ],
  },
  {
    name: 'Centro Logístico Norte',
    category: 'Instalaciones · Coordinación',
    cover: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1400&q=85',
    images: [
      'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1581094794329-c8112a4e5190?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1800&q=85',
    ],
  },
  {
    name: 'Casa Patio Sur',
    category: 'Estructuras · Modelado 3D',
    cover: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85',
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
    ],
  },
]

const specialties = [
  ['Cálculo estructural', 'Hormigón armado, acero y madera. Modelado 3D. Diseño bajo normativa vigente.'],
  ['Instalaciones', 'Eléctricas, sanitarias, termomecánicas, gas, y protección contra incendios.'],
  ['Estudios técnicos', 'Topografía y factibilidad técnica.'],
  ['BIM', 'Modelado y coordinación para gestión de proyectos.'],
]

const pillars = [
  ['Precisión técnica', 'Decisiones alineadas a las normativas vigentes.', ShieldCheck],
  ['Colaboración', 'Disciplinas que trabajan en simultáneo.', Building2],
  ['Innovación', 'Buscamos soluciones más eficientes para cada desafío.', Sparkles],
  ['Compromiso', 'Garantía de calidad técnica y cumplimiento de plazos.', Check],
]

function Logo() {
  return <div className="flex items-center gap-3" aria-label="Bixar Ingeniería"><span className="flex h-9 w-9 items-center justify-center border border-[#09C895] text-sm font-bold text-[#09C895]">B</span><span className="logo-font text-sm font-semibold tracking-[0.2em] text-white">BIXAR<span className="text-[#09C895]">.</span></span></div>
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-[#09C895]">// {children}</p>
}

function SpecialtyIcon({ title }: { title: string }) {
  const icons = { 'Cálculo estructural': Calculator, Instalaciones: Activity, 'Estudios técnicos': Layers3, BIM: Cpu }
  const Icon = icons[title as keyof typeof icons] ?? Activity
  return <Icon aria-hidden="true" className="specialty-icon" size={28} strokeWidth={1.5} />
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [navVisible, setNavVisible] = useState(true)
  const [activeProject, setActiveProject] = useState<number | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [sent, setSent] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY <= 8) {
        setNavVisible(true)
      } else if (currentScrollY > lastScrollY.current) {
        setNavVisible(false)
        setMenuOpen(false)
      } else {
        setNavVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const revealSections = Array.from(document.querySelectorAll<HTMLElement>('main > section:not(#inicio)'))
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      revealSections.forEach((section) => section.classList.add('is-visible'))
      return
    }

    document.documentElement.classList.add('reveal-ready')
    revealSections.forEach((section) => {
      section.style.opacity = '0'
      section.style.transform = 'translateY(32px)'
      Array.from(section.children).forEach((child) => {
        const element = child as HTMLElement
        element.style.opacity = '0'
        element.style.transform = 'translateY(24px)'
      })
    })

    const revealVisibleSections = () => {
      revealSections.forEach((section) => {
        const { top, bottom } = section.getBoundingClientRect()
        if (top < window.innerHeight * 0.88 && bottom > 0) {
          section.classList.add('is-visible')
          section.style.opacity = '1'
          section.style.transform = 'translateY(0)'
          Array.from(section.children).forEach((child) => {
            const element = child as HTMLElement
            element.style.opacity = '1'
            element.style.transform = 'translateY(0)'
          })
        }
      })
    }

    revealVisibleSections()
    window.addEventListener('scroll', revealVisibleSections, { passive: true })
    return () => window.removeEventListener('scroll', revealVisibleSections)
  }, [])

  const openProject = (index: number) => { setActiveProject(index); setActiveImage(0) }
  const project = activeProject === null ? null : projects[activeProject]

  return (
    <main className="min-h-screen overflow-hidden bg-[#202020] text-white">
      <nav className={`fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#202020]/90 backdrop-blur-xl transition-transform duration-300 ${navVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <a href="#inicio"><Logo /></a>
          <div className="hidden items-center gap-9 md:flex"><a href="#inicio" className="nav-link">Inicio</a><a href="#ingenieria" className="nav-link">Ingeniería</a><a href="#nosotros" className="nav-link">Nosotros</a><a href="#contacto" className="nav-link">Contacto</a></div>
          <a href="#contacto" className="nav-cta hidden items-center gap-2 md:flex">Contacto <ArrowUpRight size={16} /></a>
          <button aria-label="Abrir menú" onClick={() => setMenuOpen(!menuOpen)} className="text-white md:hidden">{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <div className="flex flex-col gap-5 border-t border-white/10 px-6 py-6 md:hidden"><a href="#inicio" onClick={() => setMenuOpen(false)}>Inicio</a><a href="#ingenieria" onClick={() => setMenuOpen(false)}>Ingeniería</a><a href="#nosotros" onClick={() => setMenuOpen(false)}>Nosotros</a><a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a></div>}
      </nav>

      <section id="inicio" className="relative flex min-h-[780px] items-end border-b border-white/10 px-6 pb-20 pt-36 lg:min-h-screen lg:px-10 lg:pb-28">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(90deg, #202020 0%, rgba(32,32,32,.78) 40%, rgba(32,32,32,.25) 100%), url('https://images.unsplash.com/photo-1503387762-592dea58ef25?auto=format&fit=crop&w=2200&q=85')", backgroundPosition: 'center', backgroundSize: 'cover' }} />
        <div className="absolute right-[12%] top-1/3 hidden h-56 w-56 border border-[#186DD4]/40 lg:block"><div className="absolute -right-4 -top-4 h-full w-full border border-[#09C895]/30" /></div>
        <div className="relative mx-auto w-full max-w-7xl"><SectionLabel>Ingeniería que transforma</SectionLabel><h1 className="max-w-4xl text-balance text-5xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[5rem]">Proyectos integrales,<br /><span className="text-[#186DD4]">Resultados</span> de calidad.</h1><p className="mt-8 max-w-lg text-base leading-7 text-white/60">Desarrollamos soluciones de ingeniería aplicada, combinando precisión técnica, experiencia y tecnología.</p><div className="mt-10 flex flex-wrap gap-4"><a href="#contacto" className="button-primary">Iniciar proyecto <MoveUpRight size={16} /></a><a href="#nosotros" className="button-secondary">Conocé Bixar</a></div></div>
      </section>

      <section id="ingenieria" className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40"><div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><SectionLabel>Ingeniería</SectionLabel><h2 className="max-w-xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl">Ingeniería basada en precisión y criterio técnico</h2></div><p className="max-w-xl text-lg leading-8 text-white/60">Gestionamos todo el proceso mediante herramientas BIM y seguimiento de obra para transformar el diseño en resultados concretos, minimizando errores y optimizando recursos.</p></div><div className="mt-16 overflow-hidden border border-white/10"><div className="h-72 bg-cover bg-center grayscale-[20%] transition duration-700 hover:scale-[1.02] lg:h-[500px]" style={{ backgroundImage: "linear-gradient(90deg, rgba(32,32,32,.45), transparent), url('https://images.unsplash.com/photo-1581094794329-c8112a4e5190?auto=format&fit=crop&w=2200&q=85')" }} /><div className="grid gap-px overflow-hidden border border-[#186DD4]/30 bg-[#186DD4]/30 md:grid-cols-2">{specialties.map(([title, text], i) => <div key={title} className="specialty-card group bg-[#202020] p-7 lg:p-9"><div className="mb-8 flex items-start justify-between"><SpecialtyIcon title={title} /><span className="font-mono text-xs text-[#09C895]">0{i + 1}</span></div><h3 className="text-xl font-medium transition-colors duration-300 group-hover:text-[#09C895]">{title}</h3><p className="mt-3 max-w-md leading-7 text-white/55">{text}</p><span aria-hidden="true" className="specialty-card-line" /></div>)}</div></div></section>

      <section className="border-y border-white/10 bg-[#186DD4] px-6 py-16 lg:px-10"><div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-12 md:grid-cols-4">{[['+60','proyectos entregados'],['5','especialidades integradas'],['48h','respuesta técnica'],['3D','modelado BIM']].map(([value, label]) => <div key={label} className="border-l border-white/30 pl-5"><p className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{value}</p><p className="mt-2 text-sm text-white/70">{label}</p></div>)}</div></section>

      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><SectionLabel>Proyectos destacados</SectionLabel><h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Trabajo que habla<br /><span className="text-[#09C895]">por nosotros.</span></h2></div><p className="max-w-xs text-sm leading-6 text-white/50">Explorá una selección de proyectos donde la ingeniería se convierte en obra.</p></div><div className="mt-16 grid gap-5 md:grid-cols-3">{projects.map((item, index) => <button key={item.name} onClick={() => openProject(index)} className="group text-left"><div className="relative aspect-[4/5] overflow-hidden bg-[#2a2a2a]"><img src={item.cover} alt={item.name} className="h-full w-full object-cover grayscale-[15%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0" /><div className="absolute inset-0 bg-gradient-to-t from-[#202020] via-transparent to-transparent opacity-80" /><span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-[#202020]/30 transition group-hover:bg-[#09C895] group-hover:text-[#202020]"><ArrowUpRight size={18} /></span><div className="absolute bottom-6 left-6"><p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#09C895]">{item.category}</p><h3 className="text-xl font-medium">{item.name}</h3></div></div></button>)}</div></section>

      <section id="nosotros" className="border-t border-white/10 bg-[#1b1b1b] px-6 py-28 lg:px-10 lg:py-40"><div className="mx-auto max-w-7xl"><div className="grid gap-16 lg:grid-cols-[1fr_.8fr]"><div><SectionLabel>Nosotros</SectionLabel><h2 className="max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl">Ingeniería aplicada.<br /><span className="text-[#186DD4]">Soluciones eficientes.</span></h2></div><p className="max-w-xl self-end text-lg leading-8 text-white/60">En Bixar desarrollamos soluciones de ingeniería pensadas para llevarse a obra. Integramos cálculo, instalaciones, estudios técnicos y modelado BIM para resolver cada proyecto con precisión, coordinación y criterio constructivo.</p></div><div className="mt-20 border-t border-white/10"><p className="py-8 font-mono text-xs uppercase tracking-[0.24em] text-white/50">La base de nuestros proyectos</p><div className="grid border-b border-white/10 md:grid-cols-2">{pillars.map(([title, text, Icon]) => <div key={title as string} className="border-t border-white/10 p-7 lg:p-10"><Icon className="mb-10 text-[#09C895]" size={22} /><h3 className="text-2xl font-medium">{title as string}</h3><p className="mt-3 max-w-xs leading-7 text-white/50">{text as string}</p></div>)}</div></div><div className="mt-20 grid grid-cols-2 gap-y-10 md:grid-cols-4">{[['100%','cumplimiento normativo'],['+5','profesionales'],['100%','soporte técnico'],['+30','empresas y comitentes']].map(([value,label]) => <div key={label}><p className="font-mono text-3xl text-[#09C895]">{value}</p><p className="mt-2 max-w-[130px] text-sm leading-5 text-white/50">{label}</p></div>)}</div></div></section>

      <section className="relative overflow-hidden bg-[#1F2832] px-6 py-28 lg:px-10 lg:py-40"><div className="relative mx-auto max-w-7xl"><SectionLabel>Una forma distinta de hacer</SectionLabel><h2 className="max-w-5xl text-4xl font-semibold leading-[1.06] tracking-[-0.05em] sm:text-6xl lg:text-8xl">Nuestra ventaja competitiva es la <span className="text-[#09C895]">ingeniería coordinada.</span></h2><div className="mt-12 flex max-w-2xl gap-5 border-l border-[#09C895] pl-6"><Zap className="mt-1 shrink-0 text-[#09C895]" size={22} /><p className="text-lg leading-8 text-white/60">Integramos cálculo estructural, diseño de instalaciones y modelado BIM para desarrollar proyectos más precisos, detectar interferencias antes de la obra y optimizar cada etapa del proceso.</p></div></div></section>

      <section id="contacto" className="border-t border-white/10 px-6 py-28 lg:px-10 lg:py-40"><div className="mx-auto grid max-w-7xl gap-20 lg:grid-cols-[.8fr_1.2fr]"><div><SectionLabel>Contacto</SectionLabel><h2 className="text-5xl font-semibold leading-tight tracking-[-0.05em] sm:text-7xl">Evaluemos<br /><span className="text-[#186DD4]">tu proyecto.</span></h2><div className="mt-20 space-y-6 text-sm text-white/55"><div className="flex gap-3"><MapPin className="shrink-0 text-[#09C895]" size={18} /><span>Sarmiento 1564<br />Concepción del Uruguay, E.R.</span></div><a href="mailto:hola@bixar.com.ar" className="flex gap-3 hover:text-white"><Mail className="text-[#09C895]" size={18} />hola@bixar.com.ar</a><div className="flex gap-5 pt-5 font-mono text-xs uppercase tracking-widest"><a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#09C895]">LinkedIn</a><a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#09C895]">Instagram</a><a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#09C895]">Facebook</a></div></div></div><form onSubmit={(event) => { event.preventDefault(); setSent(true) }} className="space-y-8"><label className="form-label">Nombre y apellido<input required className="form-input" /></label><label className="form-label">Email<input required type="email" className="form-input" /></label><label className="form-label">Mensaje<textarea required rows={5} className="form-input resize-none" /></label><button className="button-primary" type="submit">{sent ? 'Mensaje enviado' : 'Evaluar proyecto'} <ArrowUpRight size={16} /></button>{sent && <p className="flex items-center gap-2 text-sm text-[#09C895]"><Check size={16} /> Gracias, nos pondremos en contacto.</p>}</form></div></section>

      <footer className="border-t border-white/10 px-6 py-8 lg:px-10"><div className="mx-auto max-w-7xl"><Logo /></div></footer>

      {project && <div role="dialog" aria-modal="true" aria-label={project.name} className="fixed inset-0 z-50 flex items-center justify-center bg-[#202020]/95 p-5 backdrop-blur-md" onClick={() => setActiveProject(null)}><div className="relative w-full max-w-5xl" onClick={(event) => event.stopPropagation()}><button onClick={() => setActiveProject(null)} aria-label="Cerrar galería" className="absolute -right-1 -top-14 text-white/70 hover:text-white"><X /></button><div className="relative aspect-video overflow-hidden"><img src={project.images[activeImage]} alt={`${project.name}, imagen ${activeImage + 1}`} className="h-full w-full object-cover" /><button aria-label="Foto anterior" onClick={() => setActiveImage((activeImage - 1 + project.images.length) % project.images.length)} className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#202020]/70"><ChevronLeft /></button><button aria-label="Foto siguiente" onClick={() => setActiveImage((activeImage + 1) % project.images.length)} className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#202020]/70"><ChevronRight /></button></div><div className="flex items-center justify-between pt-5"><div><p className="font-mono text-xs uppercase tracking-widest text-[#09C895]">{project.category}</p><h3 className="mt-2 text-2xl">{project.name}</h3></div><span className="font-mono text-sm text-white/50">{String(activeImage + 1).padStart(2, '0')} / {String(project.images.length).padStart(2, '0')}</span></div><div className="mt-5 flex gap-3">{project.images.map((image, index) => <button key={image} onClick={() => setActiveImage(index)} className={`h-16 w-24 overflow-hidden border-2 ${index === activeImage ? 'border-[#09C895]' : 'border-transparent opacity-50'}`}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}</div></div></div>}
    </main>
  )
}
