import { useGSAP } from '@gsap/react'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { useLocation } from 'react-router-dom'

import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { MOTION } from '@/lib/motion'

export type UsePageTransitionOptions = {
  /** Skip first paint wipe (loader usually covers it). */
  skipInitial?: boolean
}

/**
 * Lightweight fixed overlay fade on route changes.
 * Returns overlay props + whether the wipe layer should render.
 */
export function usePageTransition(
  options: UsePageTransitionOptions = {},
): {
  overlayRef: RefObject<HTMLDivElement | null>
  active: boolean
} {
  const { skipInitial = true } = options
  const location = useLocation()
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const isFirst = useRef(true)
  const [active, setActive] = useState(false)
  const pathnameRef = useRef(location.pathname)

  useEffect(() => {
    if (location.pathname === pathnameRef.current) {
      return
    }
    pathnameRef.current = location.pathname

    if (isFirst.current && skipInitial) {
      isFirst.current = false
      return
    }
    isFirst.current = false

    if (prefersReducedMotion()) {
      return
    }

    setActive(true)
  }, [location.pathname, skipInitial])

  useGSAP(
    () => {
      const el = overlayRef.current
      if (!el || !active) {
        return
      }

      gsap.set(el, { opacity: 0, pointerEvents: 'none' })

      const tl = gsap.timeline({
        onComplete: () => {
          setActive(false)
        },
      })

      tl.to(el, {
        opacity: 0.55,
        duration: MOTION.duration.pageWipe * 0.45,
        ease: MOTION.ease.soft,
        pointerEvents: 'auto',
      }).to(el, {
        opacity: 0,
        duration: MOTION.duration.pageWipe * 0.55,
        ease: MOTION.ease.out,
        pointerEvents: 'none',
        delay: 0.05,
      })

      return () => {
        tl.kill()
      }
    },
    { dependencies: [active] },
  )

  return { overlayRef, active }
}
