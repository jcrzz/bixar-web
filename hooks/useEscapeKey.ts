'use client'

import { useEffect } from 'react'

export function useEscapeKey(callback: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') callback()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [callback, active])
}
