'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Project } from '@/types'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useLockBody } from '@/hooks/useLockBody'

interface ProjectModalProps {
  project: Project
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeImage, setActiveImage] = useState(0)
  const [mobileImage, setMobileImage] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useLockBody(true)
  useEscapeKey(onClose, true)

  // Focus trap
  useEffect(() => {
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusableElements || focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Mobile image click handler
  useEffect(() => {
    const handleThumbnailClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const mainImage = target.closest(
        '[role="dialog"] > div > div.relative > img'
      ) as HTMLImageElement | null
      const thumbnail = target.closest(
        '[role="dialog"] > div > div.mt-5.flex button'
      )
      const image = thumbnail?.querySelector('img')

      if (mainImage) {
        event.stopPropagation()
        setMobileImage(mainImage.currentSrc || mainImage.src)
        return
      }

      if (image && window.matchMedia('(max-width: 767px)').matches) {
        setMobileImage(image.currentSrc || image.src)
      }
    }

    document.addEventListener('click', handleThumbnailClick, true)
    return () => document.removeEventListener('click', handleThumbnailClick, true)
  }, [])

  return (
    <>
      {/* Main modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={project.name}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#101010]/80 p-4 backdrop-blur-md sm:p-6"
        onClick={onClose}
      >
        <div
          ref={dialogRef}
          className="project-modal-shell relative w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#171717]/95 shadow-[0_30px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/5"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Cerrar galería"
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#202020]/80 text-white shadow-lg shadow-black/40 transition hover:border-[#09C895] hover:bg-[#09C895] hover:text-[#202020]"
          >
            <X size={20} />
          </button>

          {/* Main image */}
          <div className="relative aspect-video overflow-hidden border-b border-white/10 bg-[#141414]">
            <img
              src={project.images[activeImage]}
              alt={`${project.name}, imagen ${activeImage + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              aria-label="Foto anterior"
              onClick={() =>
                setActiveImage(
                  (activeImage - 1 + project.images.length) % project.images.length
                )
              }
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#202020]/75 text-white transition hover:bg-[#09C895] hover:text-[#202020]"
            >
              <ChevronLeft />
            </button>
            <button
              aria-label="Foto siguiente"
              onClick={() => setActiveImage((activeImage + 1) % project.images.length)}
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#202020]/75 text-white transition hover:bg-[#09C895] hover:text-[#202020]"
            >
              <ChevronRight />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#09C895]">
                  {project.category}
                </p>
                <h3 className="mt-2 text-2xl">{project.name}</h3>
              </div>
              <span className="font-mono text-sm text-white/50">
                {activeImage + 1} / {project.images.length}
              </span>
            </div>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/60">
              {project.description}
            </p>

            {/* Thumbnails */}
            <div className="mt-5 flex gap-3">
              {project.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`relative h-16 w-24 overflow-hidden rounded-lg border-2 transition ${
                    activeImage === index
                      ? 'border-[#09C895]'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Ver imagen ${index + 1} de ${project.name}`}
                  aria-pressed={activeImage === index}
                >
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile image viewer */}
      {mobileImage && (
        <div
          role="dialog"
          aria-label="Imagen ampliada"
          className="mobile-image-viewer fixed inset-0 z-[60] flex items-center justify-center bg-[#202020]/95 p-4"
          onClick={() => setMobileImage(null)}
        >
          <button
            aria-label="Cerrar imagen ampliada"
            onClick={() => setMobileImage(null)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#202020]/80 text-white shadow-lg shadow-black/40 transition hover:border-[#09C895] hover:bg-[#09C895] hover:text-[#202020]"
          >
            <X size={20} />
          </button>
          <img
            src={mobileImage}
            alt="Imagen ampliada del proyecto"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}
    </>
  )
}
