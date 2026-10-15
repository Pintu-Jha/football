import { useGSAP } from '@gsap/react'
import {
  type RefObject,
  useRef,
} from 'react'

import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { MOTION } from '@/lib/motion'

export type UseRevealOnScrollOptions = {
  /** Scope element; defaults to document when omitted. */
  scope?: RefObject<HTMLElement | null>
  /** CSS selector within scope. Default: `[data-reveal]` */
  selector?: string
  /** ScrollTrigger start. */
  start?: string
  y?: number
  stagger?: number
  /** Re-run when this changes (e.g. route key). */
  deps?: ReadonlyArray<unknown>
}

/**
 * Fade/slide-up reveal for `[data-reveal]` (or custom selector).
 * Groups with `[data-reveal-stagger]` stagger their children.
 * Skips heavy motion when prefers-reduced-motion is set.
 */
export function useRevealOnScroll(
  options: UseRevealOnScrollOptions = {},
): RefObject<HTMLElement | null> {
  const localRef = useRef<HTMLElement | null>(null)
  const {
    scope,
    selector = '[data-reveal]',
    start = MOTION.reveal.start,
    y = MOTION.reveal.y,
    stagger = MOTION.reveal.stagger,
    deps = [],
  } = options

  const targetRef = scope ?? localRef

  useGSAP(
    () => {
      const root: ParentNode = targetRef.current ?? document
      const nodes = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(selector),
      )

      if (nodes.length === 0) {
        return
      }

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(nodes, { clearProps: 'opacity,transform' })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (prefersReducedMotion()) {
          gsap.set(nodes, { clearProps: 'opacity,transform' })
          return
        }

        for (const el of nodes) {
          const isGroup = el.hasAttribute('data-reveal-stagger')
          const targets = isGroup
            ? gsap.utils.toArray<HTMLElement>(
                el.querySelectorAll(':scope > *'),
              )
            : [el]

          if (targets.length === 0) {
            continue
          }

          gsap.set(targets, { opacity: 0, y })

          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: MOTION.duration.base,
            ease: MOTION.ease.out,
            stagger: isGroup ? stagger : 0,
            scrollTrigger: {
              trigger: el,
              start,
              once: true,
            },
          })
        }
      })

      return () => {
        mm.revert()
      }
    },
    {
      ...(scope ? { scope } : {}),
      dependencies: [...deps],
    },
  )

  return targetRef
}
