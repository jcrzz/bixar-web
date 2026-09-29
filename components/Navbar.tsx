'use client'

import { useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { Logo } from './Logo'

const navLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#ingenieria', label: 'Ingeniería' },
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#nosotros', label: 'Nosotros' },
]

export function Navbar() {
  const navVisible = useScrollDirection()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#202020]/90 backdrop-blur-xl transition-transform duration-300 ${
        navVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <a href="#inicio">
          <Logo />
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#contacto"
          className="nav-cta hidden items-center gap-2 md:flex"
        >
          Contacto <ArrowUpRight size={16} />
        </a>

        {/* Mobile menu button */}
        <button
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white md:hidden"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col gap-5 border-t border-white/10 px-6 py-6 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-white/80 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={() => setMenuOpen(false)}
            className="mt-2 flex items-center gap-2 text-[#09C895]"
          >
            Contacto <ArrowUpRight size={16} />
          </a>
        </div>
      )}
    </nav>
  )
}
