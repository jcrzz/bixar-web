'use client'

import { useEffect } from 'react'

export function useRevealOnScroll() {
  useEffect(() => {
    const revealSections = Array.from(
      document.querySelectorAll<HTMLElement>('main > section:not(#inicio)')
    )
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
}
