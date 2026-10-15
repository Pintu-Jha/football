import { useGSAP } from '@gsap/react'
import { useEffect, useRef, useState } from 'react'

import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { MOTION } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * Desktop-only custom cursor (dot + ring). Expands over `[data-cursor="card"]`.
 * Hidden on touch devices and when prefers-reduced-motion is set.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine) and (hover: hover)')
    const update = () => {
      setEnabled(finePointer.matches && !prefersReducedMotion())
    }
    update()
    finePointer.addEventListener('change', update)
    return () => finePointer.removeEventListener('change', update)
  }, [])

  useGSAP(
    () => {
      if (!enabled) {
        return
      }

      const dot = dotRef.current
      const ring = ringRef.current
      if (!dot || !ring) {
        return
      }

      const xDot = gsap.quickTo(dot, 'x', {
        duration: 0.05,
        ease: 'power3',
      })
      const yDot = gsap.quickTo(dot, 'y', {
        duration: 0.05,
        ease: 'power3',
      })
      const xRing = gsap.quickTo(ring, 'x', {
        duration: MOTION.cursor.lag,
        ease: 'power3',
      })
      const yRing = gsap.quickTo(ring, 'y', {
        duration: MOTION.cursor.lag,
        ease: 'power3',
      })

      let expanded = false

      const onMove = (event: PointerEvent) => {
        xDot(event.clientX)
        yDot(event.clientY)
        xRing(event.clientX)
        yRing(event.clientY)

        const target = event.target
        const overCard =
          target instanceof Element &&
          Boolean(target.closest('[data-cursor="card"]'))

        if (overCard !== expanded) {
          expanded = overCard
          gsap.to(ring, {
            scale: overCard ? MOTION.cursor.expand : 1,
            opacity: overCard ? 0.35 : 1,
            duration: MOTION.duration.instant,
            ease: MOTION.ease.soft,
          })
        }
      }

      window.addEventListener('pointermove', onMove)

      return () => {
        window.removeEventListener('pointermove', onMove)
      }
    },
    { dependencies: [enabled] },
  )

  if (!enabled) {
    return null
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[190] hidden md:block"
      aria-hidden
    >
      <div
        ref={dotRef}
        className={cn(
          'fixed top-0 left-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand',
        )}
      />
      <div
        ref={ringRef}
        className={cn(
          'fixed top-0 left-0 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/70',
        )}
      />
    </div>
  )
}
