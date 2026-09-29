'use client'

import { useEffect } from 'react'

export function useLockBody(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [locked])
}
