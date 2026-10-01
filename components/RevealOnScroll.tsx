'use client'

import { useRevealOnScroll } from '@/hooks/useRevealOnScroll'

/**
 * Side-effect only. Lives here so `app/page.tsx` can stay a server component
 * and fetch projects from the database during the initial render.
 */
export function RevealOnScroll() {
  useRevealOnScroll()
  return null
}
