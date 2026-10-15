import { useGSAP } from '@gsap/react'
import {
  type RefObject,
  useRef,
} from 'react'

import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { MOTION } from '@/lib/motion'

export type UseCountUpOptions = {
  /** Final numeric value. */
  end: number
  /** Starting value. */
  start?: number
  duration?: number
  /** Decimal places in displayed text. */
  decimals?: number
  /** Prefix / suffix around the number. */
  prefix?: string
  suffix?: string
  /** ScrollTrigger start. */
  triggerStart?: string
}

/**
 * Animates element textContent from start→end when it enters the viewport.
 */
export function useCountUp(
  options: UseCountUpOptions,
): RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null)
  const {
    end,
    start = 0,
    duration = MOTION.duration.slow,
    decimals = 0,
    prefix = '',
    suffix = '',
    triggerStart = MOTION.reveal.start,
  } = options

  useGSAP(
    () => {
      const el = ref.current
      if (!el) {
        return
      }

      const format = (value: number) =>
        `${prefix}${value.toFixed(decimals)}${suffix}`

      if (prefersReducedMotion()) {
        el.textContent = format(end)
        return
      }

      const state = { value: start }
      el.textContent = format(start)

      const tween = gsap.to(state, {
        value: end,
        duration,
        ease: MOTION.ease.out,
        ...(decimals === 0 ? { snap: { value: 1 } } : {}),
        onUpdate: () => {
          el.textContent = format(state.value)
        },
        scrollTrigger: {
          trigger: el,
          start: triggerStart,
          once: true,
        },
      })

      return () => {
        tween.kill()
      }
    },
    {
      dependencies: [
        end,
        start,
        duration,
        decimals,
        prefix,
        suffix,
        triggerStart,
      ],
    },
  )

  return ref
}
