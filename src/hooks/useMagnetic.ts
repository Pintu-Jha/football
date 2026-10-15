import { useGSAP } from '@gsap/react'
import {
  type RefObject,
  useRef,
} from 'react'

import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { MOTION } from '@/lib/motion'

export type UseMagneticOptions = {
  strength?: number
  /** Disable magnetic (e.g. when parent knows reduced motion). */
  enabled?: boolean
}

/**
 * Desktop-only magnetic pull toward the pointer.
 * Attach to primary CTAs; cleans up listeners on unmount.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(
  options: UseMagneticOptions = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null)
  const {
    strength = MOTION.magnetic.strength,
    enabled = true,
  } = options

  useGSAP(
    () => {
      const el = ref.current
      if (!el || !enabled) {
        return
      }

      const mm = gsap.matchMedia()

      mm.add(
        '(prefers-reduced-motion: no-preference) and (pointer: fine) and (hover: hover)',
        () => {
          if (prefersReducedMotion()) {
            return
          }

          const xTo = gsap.quickTo(el, 'x', {
            duration: MOTION.magnetic.ease,
            ease: MOTION.ease.soft,
          })
          const yTo = gsap.quickTo(el, 'y', {
            duration: MOTION.magnetic.ease,
            ease: MOTION.ease.soft,
          })

          const onMove = (event: PointerEvent) => {
            const rect = el.getBoundingClientRect()
            const relX = event.clientX - (rect.left + rect.width / 2)
            const relY = event.clientY - (rect.top + rect.height / 2)
            xTo(relX * strength)
            yTo(relY * strength)
          }

          const onLeave = () => {
            xTo(0)
            yTo(0)
          }

          el.addEventListener('pointermove', onMove)
          el.addEventListener('pointerleave', onLeave)

          return () => {
            el.removeEventListener('pointermove', onMove)
            el.removeEventListener('pointerleave', onLeave)
            gsap.set(el, { x: 0, y: 0 })
          }
        },
      )

      return () => {
        mm.revert()
      }
    },
    { dependencies: [strength, enabled] },
  )

  return ref
}
