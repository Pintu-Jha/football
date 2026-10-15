import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { MOTION } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface AnimatedCheckProps {
  className?: string
}

/** Success tick whose circle and check stroke draw themselves in. */
export function AnimatedCheck({ className }: AnimatedCheckProps) {
  const rootRef = useRef<SVGSVGElement>(null)
  const circleRef = useRef<SVGCircleElement>(null)
  const checkRef = useRef<SVGPathElement>(null)

  useGSAP(
    () => {
      const circle = circleRef.current
      const check = checkRef.current
      if (!circle || !check || prefersReducedMotion()) return

      const circleLength = circle.getTotalLength()
      const checkLength = check.getTotalLength()

      gsap.set(circle, {
        strokeDasharray: circleLength,
        strokeDashoffset: circleLength,
      })
      gsap.set(check, {
        strokeDasharray: checkLength,
        strokeDashoffset: checkLength,
      })

      const tl = gsap.timeline({ defaults: { ease: MOTION.ease.inOut } })
      tl.fromTo(
        rootRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: MOTION.duration.fast },
        0,
      )
        .to(circle, { strokeDashoffset: 0, duration: MOTION.duration.slow }, 0)
        .to(
          check,
          { strokeDashoffset: 0, duration: MOTION.duration.base },
          '-=0.25',
        )
    },
    { scope: rootRef },
  )

  return (
    <svg
      ref={rootRef}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="Success"
      className={cn('size-20', className)}
    >
      <circle
        ref={circleRef}
        cx="32"
        cy="32"
        r="29"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        ref={checkRef}
        d="M19 33.5 28.5 43 46 23.5"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
