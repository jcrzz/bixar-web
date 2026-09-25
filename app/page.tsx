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
    description: 'El Complejo Río Uruguay reúne viviendas, espacios comunes y áreas de circulación en una propuesta residencial que necesitó una mirada integral desde las primeras decisiones. El trabajo comenzó con el análisis de la documentación disponible, la revisión de las condiciones del terreno y la definición de un sistema estructural claro, eficiente y compatible con la arquitectura. A partir de esa base se estudiaron luces, apoyos, cargas y encuentros para anticipar dificultades antes de llegar a la obra. La coordinación temprana permitió ordenar la información y reducir ajustes durante las distintas etapas del proyecto. El modelo BIM se utilizó como una herramienta de trabajo compartida, capaz de reunir geometría, criterios técnicos y documentación en un mismo entorno. Esto facilitó la comunicación entre disciplinas y ayudó a detectar interferencias entre estructura, instalaciones y terminaciones. También permitió revisar alternativas, comparar soluciones y tomar decisiones con mayor información. El resultado es una propuesta más ordenada, con detalles constructivos coherentes y una base técnica preparada para acompañar el crecimiento del proyecto. La documentación fue pensada para ser útil tanto en la instancia de diseño como durante la ejecución, ofreciendo referencias claras para los equipos involucrados. Cada definición buscó equilibrar seguridad, economía de recursos, facilidad constructiva y mantenimiento a largo plazo. Más que resolver únicamente el cálculo, el proyecto trabajó sobre la relación entre las distintas partes de la obra. Esa forma de coordinar permite que la ingeniería tenga un impacto concreto en la calidad final, en los tiempos de ejecución y en la previsibilidad de las decisiones. La experiencia también dejó una metodología replicable para futuros conjuntos residenciales con necesidades similares.',
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
    description: 'El Centro Logístico Norte fue planteado para sostener una operación intensa, con circulación constante de vehículos, áreas de carga y descarga, depósitos y espacios de apoyo. En este contexto, la coordinación de instalaciones ocupa un lugar central porque cada recorrido técnico debe convivir con la estructura, la arquitectura y las necesidades operativas del edificio. El proyecto comenzó con el relevamiento de los requerimientos generales y la organización de las zonas que intervienen en el funcionamiento diario. Luego se estudiaron trazados, alturas, cruces y puntos de acceso para que las redes pudieran instalarse de manera ordenada y mantenerse disponibles para futuras revisiones. La documentación buscó hacer visibles las decisiones importantes y ofrecer una lectura sencilla para los equipos de obra. El modelo coordinado permitió revisar interferencias antes de la ejecución, evitando que los conflictos aparecieran recién durante el montaje. También ayudó a comparar alternativas de recorrido y a encontrar soluciones que redujeran pérdidas de material, tiempos de instalación y trabajos correctivos. Cada disciplina fue evaluada en relación con las demás, con especial atención a los sectores de mayor demanda y a las áreas donde una interrupción podría afectar la operación. El resultado es una base técnica que acompaña el funcionamiento del centro sin perder flexibilidad para adaptarse a cambios. La propuesta prioriza accesibilidad, claridad y capacidad de mantenimiento, tres condiciones importantes para una infraestructura que debe permanecer activa. Además, la información organizada facilita la comunicación entre proyectistas, proveedores y responsables de obra. La experiencia demuestra que una coordinación precisa no solo evita problemas constructivos: también mejora la previsibilidad, protege la inversión y permite que el edificio responda mejor a las exigencias de su actividad cotidiana.',
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
    description: 'Casa Patio Sur es una propuesta residencial organizada alrededor de la relación entre interior, exterior y luz natural. El proyecto necesitó integrar decisiones arquitectónicas, estructurales y constructivas desde el inicio para que los espacios pudieran desarrollarse con continuidad y sin perder claridad. El modelado tridimensional permitió estudiar proporciones, alturas, apoyos y encuentros antes de definir la documentación final. Gracias a esa revisión se pudieron comparar alternativas para resolver las áreas principales, las circulaciones y los puntos de contacto entre distintos materiales. La estructura se pensó como parte de una solución general, evitando decisiones aisladas que luego generaran modificaciones innecesarias. El modelo también sirvió para revisar el comportamiento visual de los elementos, la ubicación de instalaciones y la forma en que cada componente participa en la experiencia cotidiana de la vivienda. La información quedó organizada para acompañar tanto la etapa de proyecto como la posterior ejecución en obra. Se prestó especial atención a los detalles que suelen concentrar dudas, como cambios de nivel, encuentros de cubierta, aberturas, escaleras y transiciones entre superficies. La coordinación permitió detectar incompatibilidades con anticipación y mejorar la comunicación entre quienes diseñan y quienes construyen. El resultado busca ser preciso sin volverse rígido, dejando espacio para resolver particularidades propias del sitio y de los materiales elegidos. Cada decisión responde a una intención concreta: aprovechar mejor los recursos, simplificar la ejecución y construir una vivienda durable, cómoda y coherente. El uso del modelo 3D aporta además una lectura accesible para presentar el proyecto, revisar avances y conversar sobre cambios con mayor claridad. Casa Patio Sur representa una manera de trabajar donde la tecnología no reemplaza el criterio profesional, sino que lo vuelve más visible, coordinado y útil para tomar mejores decisiones.',
    cover: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85',
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
    ],
  },
  {
    name: 'Torre Costanera',
    category: 'Estructuras · Dirección técnica',
    description: 'Propuesta de estructura y coordinación para una torre residencial ubicada en un entorno urbano consolidado, con especial atención a la eficiencia constructiva, la circulación y la integración con el paisaje de la costa.',
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85',
    ],
  },
  {
    name: 'Planta Industrial Este',
    category: 'Ingeniería industrial · BIM',
    description: 'Diseño coordinado para una planta industrial flexible, pensado para ordenar etapas, mejorar recorridos y facilitar futuras ampliaciones sin perder precisión en la documentación.',
    cover: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1400&q=85',
    images: [
      'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1581094794329-c8112a4e5190?auto=format&fit=crop&w=1800&q=85',
    ],
  },
  {
    name: 'Casa del Parque',
    category: 'Arquitectura · Estructuras',
    description: 'Vivienda unifamiliar proyectada para aprovechar el vínculo con el entorno verde, combinando una estructura clara, espacios luminosos y decisiones constructivas simples de mantener.',
    cover: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85',
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
    ],
  },
  {
    name: 'Nave Industrial Sur',
    category: 'Cálculo estructural · Obra',
    description: 'Resolución técnica de una nave de gran escala con foco en luces, montaje, durabilidad y coordinación entre la estructura principal y las instalaciones de servicio.',
    cover: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=85',
    images: [
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1581094794329-c8112a4e5190?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1800&q=85',
    ],
  },
  {
    name: 'Oficinas Parque Norte',
    category: 'Instalaciones · Coordinación',
    description: 'Coordinación de instalaciones para un conjunto de oficinas contemporáneo, con soluciones que priorizan el confort, la flexibilidad de uso y el mantenimiento eficiente.',
    cover: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85',
    images: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=85',
    ],
  },
]

const projectDescriptionExtension = 'Esta descripción funciona como contenido de muestra para presentar el alcance del trabajo y puede reemplazarse más adelante por información definitiva del cliente. La intención es comunicar proceso, criterio y resultado de una manera clara, cercana y útil para quienes necesitan evaluar una nueva propuesta de ingeniería.'

projects.forEach((project) => {
  project.description += ` ${projectDescriptionExtension}`
})

const specialties = [
  ['Cálculo estructural', 'Hormigón armado, acero y madera. Modelado 3D. Diseño bajo normativa vigente.'],
  ['Instalaciones', 'Eléctricas, sanitarias, termomecánicas, gas, y protección contra incendios.'],
  ['Estudios técnicos', 'Topografía y factibilidad técnica.'],
  ['BIM', 'Modelado y coordinación para gestión de proyectos.'],
]

const specialtyImages = [
  '/ingenieria/1.Calculo estructural.png',
  '/ingenieria/2.Instalaciones.png',
  '/ingenieria/3. Estudios técnicos.png',
  '/ingenieria/4.BIM.png',
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

function SocialIcon({ network }: { network: 'linkedin' | 'instagram' | 'facebook' }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" className="h-[18px] w-[18px]">
    {network === 'linkedin' && <><path d="M6 9v9" /><path d="M6 6.2v.1" /><path d="M10.5 18v-5a3 3 0 0 1 6 0v5" /><path d="M10.5 10v8" /></>}
    {network === 'instagram' && <><rect x="4.5" y="4.5" width="15" height="15" rx="4" /><circle cx="12" cy="12" r="3.5" /><path d="M17.3 6.8h.01" /></>}
    {network === 'facebook' && <path d="M14.5 18v-6h2l.5-2h-2.5V8.8c0-.8.3-1.3 1.3-1.3H16V5.7c-.5-.1-1-.2-1.8-.2-1.8 0-3 1.1-3 3.1V10H9v2h2.2v6" />}
  </svg>
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [navVisible, setNavVisible] = useState(true)
  const [activeProject, setActiveProject] = useState<number | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [mobileImage, setMobileImage] = useState<string | null>(null)
  const [projectSlide, setProjectSlide] = useState(0)
  const [cardImages, setCardImages] = useState<Record<string, number>>({})
  const [activeSpecialty, setActiveSpecialty] = useState(0)
  const [sent, setSent] = useState(false)
  const lastScrollY = useRef(0)
  const projectTrackRef = useRef<HTMLDivElement | null>(null)
  const [projectCardWidth, setProjectCardWidth] = useState(0)

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

  useEffect(() => {
    const handleThumbnailClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const mainImage = target.closest('[role="dialog"] > div > div.relative > img') as HTMLImageElement | null
      const thumbnail = target.closest('[role="dialog"] > div > div.mt-5.flex button')
      const image = thumbnail?.querySelector('img')

      if (mainImage) {
        event.stopPropagation()
        setMobileImage(mainImage.currentSrc || mainImage.src)
        return
      }

      if (image && window.matchMedia('(max-width: 767px)').matches) setMobileImage(image.currentSrc || image.src)
    }

    document.addEventListener('click', handleThumbnailClick, true)
    return () => document.removeEventListener('click', handleThumbnailClick, true)
  }, [])

  const openProject = (index: number) => { setActiveProject(index); setActiveImage(0) }
  const moveCardImage = (projectName: string, imageCount: number, direction: number) => {
    setCardImages((current) => {
      const imageIndex = current[projectName] ?? 0
      return { ...current, [projectName]: (imageIndex + direction + imageCount) % imageCount }
    })
  }
  const moveSpecialty = (direction: number) => {
    setActiveSpecialty((current) => (current + direction + specialties.length) % specialties.length)
  }
  const maxProjectSlide = Math.max(0, projects.length - 3)
  const projectSlideDots = Array.from({ length: maxProjectSlide + 1 }, (_, index) => index)

  useEffect(() => {
    const updateProjectCardWidth = () => {
      if (!projectTrackRef.current) return

      const firstCard = projectTrackRef.current.querySelector('.project-carousel-card') as HTMLElement | null
      if (!firstCard) return

      const trackStyles = window.getComputedStyle(projectTrackRef.current)
      const gap = Number.parseFloat(trackStyles.columnGap || trackStyles.gap || '0') || 0
      setProjectCardWidth(firstCard.getBoundingClientRect().width + gap)
    }

    updateProjectCardWidth()

    const resizeObserver = new ResizeObserver(updateProjectCardWidth)
    if (projectTrackRef.current) resizeObserver.observe(projectTrackRef.current)

    window.addEventListener('resize', updateProjectCardWidth)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateProjectCardWidth)
    }
  }, [])

  const moveProjectSlide = (direction: number) => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const maxSlide = isMobile ? projects.length - 1 : maxProjectSlide
    setProjectSlide((current) => Math.max(0, Math.min(current + direction, maxSlide)))
  }
  const project = activeProject === null ? null : projects[activeProject]
  const projectTrackTransform = projectCardWidth > 0 ? `translateX(-${projectSlide * projectCardWidth}px)` : undefined

  return (
    <main className="min-h-screen overflow-hidden bg-[#202020] text-white">
      <nav className={`fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#202020]/90 backdrop-blur-xl transition-transform duration-300 ${navVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <a href="#inicio"><Logo /></a>
          <div className="hidden items-center gap-9 md:flex"><a href="#inicio" className="nav-link">Inicio</a><a href="#ingenieria" className="nav-link">Ingeniería</a><a href="#proyectos" className="nav-link">Proyectos</a><a href="#nosotros" className="nav-link">Nosotros</a></div>
          <a href="#contacto" className="nav-cta hidden items-center gap-2 md:flex">Contacto <ArrowUpRight size={16} /></a>
          <button aria-label="Abrir menú" onClick={() => setMenuOpen(!menuOpen)} className="text-white md:hidden">{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <div className="flex flex-col gap-5 border-t border-white/10 px-6 py-6 md:hidden"><a href="#inicio" onClick={() => setMenuOpen(false)}>Inicio</a><a href="#ingenieria" onClick={() => setMenuOpen(false)}>Ingeniería</a><a href="#proyectos" onClick={() => setMenuOpen(false)}>Proyectos</a><a href="#nosotros" onClick={() => setMenuOpen(false)}>Nosotros</a></div>}
      </nav>

      <section id="inicio" className="relative flex min-h-[780px] items-end border-b border-white/10 px-6 pb-20 pt-36 lg:min-h-screen lg:px-10 lg:pb-28">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(90deg, #202020 0%, rgba(32,32,32,.78) 40%, rgba(32,32,32,.25) 100%), url('https://images.unsplash.com/photo-1503387762-592dea58ef25?auto=format&fit=crop&w=2200&q=85')", backgroundPosition: 'center', backgroundSize: 'cover' }} />
        <div className="absolute right-[12%] top-1/3 hidden h-56 w-56 border border-[#186DD4]/40 lg:block"><div className="absolute -right-4 -top-4 h-full w-full border border-[#09C895]/30" /></div>
        <div className="relative mx-auto w-full max-w-7xl"><SectionLabel>Ingeniería que transforma</SectionLabel><h1 className="max-w-4xl text-balance text-5xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[5rem]">Proyectos integrales,<br /><span className="text-[#186DD4]">resultados</span> de calidad.</h1><p className="mt-8 max-w-lg text-base leading-7 text-white/60">Desarrollamos soluciones de ingeniería aplicada, combinando precisión técnica, experiencia y tecnología.</p><div className="mt-10 flex flex-wrap gap-4"><a href="#contacto" className="button-primary">Iniciar proyecto <MoveUpRight size={16} /></a><a href="#nosotros" className="button-secondary">Conocé Bixar</a></div></div>
      </section>

      <section id="ingenieria" className="px-6 py-28 lg:px-10 lg:py-40">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><SectionLabel>Ingeniería</SectionLabel><h2 className="max-w-xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl">Ingeniería basada en <span className="text-[#186DD4]">precisión y criterio técnico</span></h2></div><p className="max-w-xl justify-self-end text-lg leading-8 text-white/60 lg:text-right">Gestionamos todo el proceso mediante herramientas BIM y seguimiento de obra para transformar el diseño en resultados concretos, minimizando errores y optimizando recursos.</p></div>
          <div className="mt-16 overflow-hidden border border-white/10">
            <div className="specialty-carousel-viewport"><div className="specialty-carousel-track" style={{ '--specialty-slide': activeSpecialty } as React.CSSProperties}>{specialtyImages.map((image, index) => <div key={image} className="specialty-carousel-slide"><img src={image} alt={`${specialties[index][0]} en acción`} /></div>)}</div><button type="button" aria-label="Especialidad anterior" onClick={() => moveSpecialty(-1)} className="specialty-carousel-arrow specialty-carousel-arrow-left"><ChevronLeft size={20} /></button><button type="button" aria-label="Siguiente especialidad" onClick={() => moveSpecialty(1)} className="specialty-carousel-arrow specialty-carousel-arrow-right"><ChevronRight size={20} /></button></div>
            <div className="grid gap-px overflow-hidden border border-[#186DD4]/30 bg-[#186DD4]/30 md:grid-cols-2">{specialties.map(([title, text], i) => <button type="button" key={title} onClick={() => setActiveSpecialty(i)} className={`specialty-card group bg-[#202020] p-7 text-left lg:p-9 ${activeSpecialty === i ? 'is-active' : ''}`}><div className="mb-8 flex items-start justify-between"><SpecialtyIcon title={title} /><span className="font-mono text-xs text-[#09C895]">0{i + 1}</span></div><h3 className="text-xl font-medium transition-colors duration-300 group-hover:text-[#09C895]">{title}</h3><p className="mt-3 max-w-md leading-7 text-white/55">{text}</p><span aria-hidden="true" className="specialty-card-line" /></button>)}</div>
          </div>
        </div>
      </section>

      <section id="proyectos" className="px-6 py-28 lg:px-10 lg:py-40">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <SectionLabel>Proyectos destacados</SectionLabel>
              <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Trabajos que hablan<br /><span className="text-[#09C895]">por nosotros.</span></h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-white/50">Explor? una selecci?n de proyectos donde la ingenier?a se convierte en obra.</p>
          </div>

          <div className="project-carousel mt-16">
            <div className="project-carousel-viewport">
              <div ref={projectTrackRef} className="project-carousel-track" style={{ transform: projectTrackTransform }}>
                {projects.map((item, index) => (
                  <button key={item.name} onClick={() => openProject(index)} className="project-carousel-card group text-left">
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#2a2a2a]">
                      <img src={item.images[cardImages[item.name] ?? 0]} alt={item.name} className="h-full w-full object-cover grayscale-[15%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                      <span role="button" tabIndex={0} aria-label={`Imagen anterior de ${item.name}`} onClick={(event) => { event.stopPropagation(); moveCardImage(item.name, item.images.length, -1) }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); moveCardImage(item.name, item.images.length, -1) } }} className="project-image-arrow project-image-arrow-left"><ChevronLeft size={18} /></span>
                      <span role="button" tabIndex={0} aria-label={`Siguiente imagen de ${item.name}`} onClick={(event) => { event.stopPropagation(); moveCardImage(item.name, item.images.length, 1) }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); moveCardImage(item.name, item.images.length, 1) } }} className="project-image-arrow project-image-arrow-right"><ChevronRight size={18} /></span>
                    </div>
                    <div className="mt-5 border-t border-white/10 pt-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#09C895]">{item.category}</p>
                      <h3 className="mt-3 text-2xl font-medium">{item.name}</h3>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button type="button" aria-label="Proyecto anterior" onClick={() => moveProjectSlide(-1)} className="carousel-arrow p-3"><ChevronLeft size={18} /></button>
              <div className="flex items-center gap-2">
                {projectSlideDots.map((index) => (
                  <button key={index} type="button" aria-label={`Ir al proyecto ${index + 1}`} onClick={() => setProjectSlide(Math.max(0, Math.min(index, maxProjectSlide)))} className={`carousel-dot ${projectSlide === index ? 'is-active' : ''}`} />
                ))}
              </div>
              <button type="button" aria-label="Siguiente proyecto" onClick={() => moveProjectSlide(1)} className="carousel-arrow p-3"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      </section>
<section id="nosotros" className="border-t border-white/10 bg-[#1b1b1b] px-6 py-28 lg:px-10 lg:py-40"><div className="mx-auto max-w-7xl"><div className="grid gap-16 lg:grid-cols-[1fr_.8fr]"><div><SectionLabel>Nosotros</SectionLabel><h2 className="max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl">Ingeniería aplicada,<br /><span className="text-[#186DD4]">soluciones eficientes.</span></h2></div><p className="max-w-xl self-end text-lg leading-8 text-white/60">En Bixar desarrollamos soluciones de ingeniería pensadas para llevarse a obra. Integramos cálculo, instalaciones, estudios técnicos y modelado BIM para resolver cada proyecto con precisión, coordinación y criterio constructivo.</p></div><div className="mt-20 border-t border-white/10"><p className="py-8 font-mono text-xs uppercase tracking-[0.24em] text-white/50">La base de nuestros proyectos</p><div className="grid border-b border-white/10 md:grid-cols-2">{pillars.map(([title, text, Icon]) => <div key={title as string} className="border-t border-white/10 p-7 lg:p-10"><Icon className="mb-10 text-[#09C895]" size={22} /><h3 className="text-2xl font-medium">{title as string}</h3><p className="mt-3 max-w-xs leading-7 text-white/50">{text as string}</p></div>)}</div></div></div></section>

      <section className="relative overflow-hidden bg-[#1F2832] px-6 py-28 lg:px-10 lg:py-40"><div className="relative mx-auto max-w-7xl"><SectionLabel>Una forma distinta de hacer</SectionLabel><h2 className="max-w-5xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl">Nuestra ventaja competitiva es la <span className="text-[#09C895]">ingeniería coordinada.</span></h2><div className="mt-12 flex max-w-2xl gap-5 border-l border-[#09C895] pl-6"><Zap className="mt-1 shrink-0 text-[#09C895]" size={22} /><p className="text-lg leading-8 text-white/60">Integramos cálculo estructural, diseño de instalaciones y modelado BIM para desarrollar proyectos más precisos, detectar interferencias antes de la obra y optimizar cada etapa del proceso.</p></div></div></section>

      <section id="contacto" className="border-t border-white/10 px-6 py-28 lg:px-10 lg:py-40"><div className="mx-auto grid max-w-7xl gap-20 lg:grid-cols-[.8fr_1.2fr]"><div><SectionLabel>Contacto</SectionLabel><h2 className="text-5xl font-semibold leading-tight tracking-[-0.05em] sm:text-7xl">Evaluemos<br /><span className="text-[#186DD4]">tu proyecto.</span></h2><div className="mt-20 space-y-6 text-sm text-white/55"><div className="flex gap-3"><MapPin className="shrink-0 text-[#09C895]" size={18} /><span>Sarmiento 1564<br />Concepción del Uruguay, E.R.</span></div><a href="mailto:hola@bixar.com.ar" className="flex gap-3 hover:text-white"><Mail className="text-[#09C895]" size={18} />hola@bixar.com.ar</a><div className="flex gap-5 pt-5 font-mono text-xs uppercase tracking-widest"><a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#09C895]">LinkedIn</a><a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#09C895]">Instagram</a><a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#09C895]">Facebook</a></div></div></div><form onSubmit={(event) => { event.preventDefault(); setSent(true) }} className="space-y-8"><label className="form-label">Nombre y apellido<input required className="form-input" /></label><label className="form-label">Email<input required type="email" className="form-input" /></label><label className="form-label">Mensaje<textarea required rows={5} className="form-input resize-none" /></label><button className="button-primary" type="submit">{sent ? 'Mensaje enviado' : 'Evaluar proyecto'} <ArrowUpRight size={16} /></button>{sent && <p className="flex items-center gap-2 text-sm text-[#09C895]"><Check size={16} /> Gracias, nos pondremos en contacto.</p>}</form></div></section>

      <footer className="border-t border-white/10 bg-[#171717] px-6 pt-16 lg:px-10 lg:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 pb-16 md:grid-cols-[1.3fr_.7fr] lg:gap-24">
            <div>
              <Logo />
              <p className="mt-7 max-w-md text-sm leading-6 text-white/55">Integramos Ingeniería, Arquitectura y Construcción bajo una sola firma. Soluciones técnicas y creativas, ejecutadas con precisión.</p>
              <div className="mt-7 flex gap-3">
                <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center bg-white/[.07] text-white/65 transition hover:bg-[#09C895] hover:text-[#171717]"><SocialIcon network="linkedin" /></a>
                <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center bg-white/[.07] text-white/65 transition hover:bg-[#09C895] hover:text-[#171717]"><SocialIcon network="instagram" /></a>
                <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center bg-white/[.07] text-white/65 transition hover:bg-[#09C895] hover:text-[#171717]"><SocialIcon network="facebook" /></a>
              </div>
            </div>
            <div>
              <h2 className="font-mono text-xs font-semibold uppercase tracking-[.2em] text-[#09C895]">Contacto</h2>
              <div className="mt-7 space-y-5 text-sm text-white/60">
                <a href="mailto:contacto@bixar.com" className="flex items-center gap-3 transition hover:text-white"><Mail size={17} /> contacto@bixar.com</a>
                <a href="tel:+541100000000" className="flex items-center gap-3 transition hover:text-white"><MoveUpRight size={17} /> +54 11 0000 0000</a>
                <p className="flex items-center gap-3"><MapPin size={17} /> Buenos Aires, AR</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Bixar. Todos los derechos reservados.</p>
            <p>Ingeniería · Arquitectura · Construcción</p>
          </div>
        </div>
      </footer>

      {project && <div role="dialog" aria-modal="true" aria-label={project.name} className="fixed inset-0 z-50 flex items-center justify-center bg-[#202020]/95 p-5 backdrop-blur-md" onClick={() => setActiveProject(null)}><div className="relative w-full max-w-5xl" onClick={(event) => event.stopPropagation()}><button onClick={() => setActiveProject(null)} aria-label="Cerrar galería" className="absolute -right-1 -top-14 text-white/70 hover:text-white"><X /></button><div className="relative aspect-video overflow-hidden"><img src={project.images[activeImage]} alt={`${project.name}, imagen ${activeImage + 1}`} className="h-full w-full object-cover" /><button aria-label="Foto anterior" onClick={() => setActiveImage((activeImage - 1 + project.images.length) % project.images.length)} className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#202020]/70"><ChevronLeft /></button><button aria-label="Foto siguiente" onClick={() => setActiveImage((activeImage + 1) % project.images.length)} className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#202020]/70"><ChevronRight /></button></div><p className="mt-5 max-w-3xl text-sm leading-7 text-white/60">{project.description}</p><div className="flex items-center justify-between pt-5"><div><p className="font-mono text-xs uppercase tracking-widest text-[#09C895]">{project.category}</p><h3 className="mt-2 text-2xl">{project.name}</h3></div><span className="font-mono text-sm text-white/50">{String(activeImage + 1).padStart(2, '0')} / {String(project.images.length).padStart(2, '0')}</span></div><div className="mt-5 flex gap-3">{project.images.map((image, index) => <button key={image} onClick={() => setActiveImage(index)} className={`h-16 w-24 overflow-hidden border-2 ${index === activeImage ? 'border-[#09C895]' : 'border-transparent opacity-50'}`}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}</div></div></div>}
      {mobileImage && <div role="dialog" aria-label="Imagen ampliada" className="mobile-image-viewer fixed inset-0 z-[60] flex items-center justify-center bg-[#202020]/95 p-4" onClick={() => setMobileImage(null)}><button aria-label="Cerrar imagen ampliada" className="absolute right-5 top-5 text-3xl text-white/80">&times;</button><img src={mobileImage} alt="Imagen ampliada del proyecto" className="max-h-full max-w-full object-contain" /></div>}
    </main>
  )
}
