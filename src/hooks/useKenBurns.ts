import { useGSAP } from '@gsap/react'
import {
  type RefObject,
  useRef,
} from 'react'

import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { MOTION } from '@/lib/motion'

export type UseKenBurnsOptions = {
  /** Image or media element ref; uses returned ref if omitted. */
  target?: RefObject<HTMLElement | null>
  /** Section that drives parallax ScrollTrigger. */
  trigger?: RefObject<HTMLElement | null>
  scaleFrom?: number
  scaleTo?: number
  duration?: number
  /** Enable yPercent scrub parallax. */
  parallax?: boolean
  parallaxYPercent?: number
}

/**
 * Slow Ken Burns scale on a hero background image, with optional scroll parallax.
 * Disabled under prefers-reduced-motion.
 */
export function useKenBurns(
  options: UseKenBurnsOptions = {},
): RefObject<HTMLElement | null> {
  const localRef = useRef<HTMLElement | null>(null)
  const {
    target,
    trigger,
    scaleFrom = MOTION.kenBurns.scaleFrom,
    scaleTo = MOTION.kenBurns.scaleTo,
    duration = MOTION.duration.kenBurns,
    parallax = true,
    parallaxYPercent = MOTION.kenBurns.parallaxYPercent,
  } = options

  const imageRef = target ?? localRef

  useGSAP(
    () => {
      const img = imageRef.current
      if (!img) {
        return
      }

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(img, { clearProps: 'transform' })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (prefersReducedMotion()) {
          gsap.set(img, { clearProps: 'transform' })
          return
        }

        gsap.fromTo(
          img,
          { scale: scaleFrom },
          {
            scale: scaleTo,
            duration,
            ease: 'none',
            transformOrigin: '50% 50%',
          },
        )

        if (parallax) {
          const triggerEl = trigger?.current ?? img.parentElement ?? img
          gsap.to(img, {
            yPercent: parallaxYPercent,
            ease: 'none',
            scrollTrigger: {
              trigger: triggerEl,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          })
        }
      })

      return () => {
        mm.revert()
      }
    },
    {
      scope: imageRef,
      dependencies: [
        scaleFrom,
        scaleTo,
        duration,
        parallax,
        parallaxYPercent,
      ],
    },
  )

  return imageRef
}
