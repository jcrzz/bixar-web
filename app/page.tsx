'use client'

import { useRevealOnScroll } from '@/hooks/useRevealOnScroll'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Specialties } from '@/components/Specialties'
import { Projects } from '@/components/Projects'
import { About } from '@/components/About'
import { Advantage } from '@/components/Advantage'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

export default function Page() {
  useRevealOnScroll()

  return (
    <main className="min-h-screen overflow-hidden bg-[#202020] text-white">
      {/* Skip navigation for accessibility */}
      <a
        href="#inicio"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-[#09C895] focus:px-4 focus:py-2 focus:text-[#202020]"
      >
        Saltar al contenido principal
      </a>

      <Navbar />
      <Hero />
      <Specialties />
      <Projects />
      <About />
      <Advantage />
      <Contact />
      <Footer />
    </main>
  )
}
