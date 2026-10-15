import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { getLenis } from '@/hooks/useLenis'

export function useRouteScrollReset(): void {
  const { pathname } = useLocation()

  useEffect(() => {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname])
}
