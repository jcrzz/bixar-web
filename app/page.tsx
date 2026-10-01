import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Specialties } from '@/components/Specialties'
import { ProjectsSection } from '@/components/ProjectsSection'
import { About } from '@/components/About'
import { Advantage } from '@/components/Advantage'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'
import { RevealOnScroll } from '@/components/RevealOnScroll'

// The projects section reads from Postgres, so revalidate instead of baking the
// page at build time. 60s keeps the marketing site fast while making panel
// edits show up within a minute.
export const revalidate = 60

export default function Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#202020] text-white">
      <RevealOnScroll />

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
      <ProjectsSection />
      <About />
      <Advantage />
      <Contact />
      <Footer />
    </main>
  )
}
