'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { projects } from '@/data/projects'
import type { Project } from '@/types'
import { SectionLabel } from './SectionLabel'
import { ProjectModal } from './ProjectModal'

export function Projects() {
  const [activeProject, setActiveProject] = useState<number | null>(null)
  const [projectSlide, setProjectSlide] = useState(0)
  const [cardImages, setCardImages] = useState<Record<string, number>>({})
  const [projectCardWidth, setProjectCardWidth] = useState(0)
  const projectTrackRef = useRef<HTMLDivElement | null>(null)

  const project = activeProject === null ? null : projects[activeProject]

  // Calculate card width for carousel
  useEffect(() => {
    const updateProjectCardWidth = () => {
      if (!projectTrackRef.current) return

      const firstCard = projectTrackRef.current.querySelector(
        '.project-carousel-card'
      ) as HTMLElement | null
      if (!firstCard) return

      const trackStyles = window.getComputedStyle(projectTrackRef.current)
      const gap =
        Number.parseFloat(trackStyles.columnGap || trackStyles.gap || '0') || 0
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

  const openProject = (index: number) => {
    setActiveProject(index)
  }

  const moveCardImage = (projectName: string, imageCount: number, direction: number) => {
    setCardImages((current) => {
      const imageIndex = current[projectName] ?? 0
      return { ...current, [projectName]: (imageIndex + direction + imageCount) % imageCount }
    })
  }

  const maxProjectSlide = Math.max(0, projects.length - 3)
  const projectSlideDots = Array.from({ length: maxProjectSlide + 1 }, (_, index) => index)

  const moveProjectSlide = (direction: number) => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const maxSlide = isMobile ? projects.length - 1 : maxProjectSlide
    setProjectSlide((current) => Math.max(0, Math.min(current + direction, maxSlide)))
  }

  const projectTrackTransform =
    projectCardWidth > 0
      ? `translateX(-${projectSlide * projectCardWidth}px)`
      : undefined

  return (
    <>
      <section id="proyectos" className="px-6 py-28 lg:px-10 lg:py-40">
        <div className="mx-auto w-full max-w-7xl">
          {/* Header */}
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <SectionLabel>Proyectos destacados</SectionLabel>
              <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
                Trabajos que hablan
                <br />
                <span className="text-[#09C895]">por nosotros.</span>
              </h2>
            </div>
            <p className="max-w-sm justify-self-end text-right text-lg leading-8 text-white/50">
              Explora una selección de proyectos donde la ingeniería se convierte
              en obra.
            </p>
          </div>

          {/* Carousel */}
          <div className="project-carousel mt-16">
            <div className="project-carousel-viewport">
              <div
                ref={projectTrackRef}
                className="project-carousel-track"
                style={{ transform: projectTrackTransform }}
              >
                {projects.map((item, index) => (
                  <button
                    key={item.name}
                    onClick={() => openProject(index)}
                    className="project-carousel-card group text-left"
                    aria-label={`Ver proyecto ${item.name}`}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#2a2a2a]">
                      <img
                        src={item.images[cardImages[item.name] ?? 0]}
                        alt={item.name}
                        className="h-full w-full object-cover grayscale-[15%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                        loading="lazy"
                      />
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label={`Imagen anterior de ${item.name}`}
                        onClick={(event) => {
                          event.stopPropagation()
                          moveCardImage(item.name, item.images.length, -1)
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            event.stopPropagation()
                            moveCardImage(item.name, item.images.length, -1)
                          }
                        }}
                        className="project-image-arrow project-image-arrow-left"
                      >
                        <ChevronLeft size={18} />
                      </span>
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label={`Siguiente imagen de ${item.name}`}
                        onClick={(event) => {
                          event.stopPropagation()
                          moveCardImage(item.name, item.images.length, 1)
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            event.stopPropagation()
                            moveCardImage(item.name, item.images.length, 1)
                          }
                        }}
                        className="project-image-arrow project-image-arrow-right"
                      >
                        <ChevronRight size={18} />
                      </span>
                    </div>
                    <div className="mt-5 border-t border-white/10 pt-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#09C895]">
                        {item.category}
                      </p>
                      <h3 className="mt-3 text-2xl font-medium">{item.name}</h3>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Carousel controls */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                aria-label="Proyecto anterior"
                onClick={() => moveProjectSlide(-1)}
                className="carousel-arrow p-3"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-2">
                {projectSlideDots.map((index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Ir al proyecto ${index + 1}`}
                    onClick={() =>
                      setProjectSlide(Math.max(0, Math.min(index, maxProjectSlide)))
                    }
                    className={`carousel-dot ${projectSlide === index ? 'is-active' : ''}`}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Siguiente proyecto"
                onClick={() => moveProjectSlide(1)}
                className="carousel-arrow p-3"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Project modal */}
      {project && (
        <ProjectModal
          project={project}
          onClose={() => setActiveProject(null)}
        />
      )}
    </>
  )
}
