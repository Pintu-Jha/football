import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { MOTION } from '@/lib/motion'

/** Animated success tick (static under prefers-reduced-motion). */
export function SuccessCheck() {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useGSAP(
    () => {
      const svg = svgRef.current
      if (!svg || prefersReducedMotion()) return
      const ring = svg.querySelector('[data-success-ring]')
      const tick = svg.querySelector('[data-success-tick]')
      gsap.fromTo(
        svg,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: MOTION.duration.fast,
          ease: MOTION.ease.out,
        },
      )
      if (ring) {
        gsap.fromTo(
          ring,
          { strokeDashoffset: 226 },
          {
            strokeDashoffset: 0,
            duration: MOTION.duration.base,
            ease: MOTION.ease.out,
          },
        )
      }
      if (tick) {
        gsap.fromTo(
          tick,
          { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' },
          {
            opacity: 1,
            scale: 1,
            duration: MOTION.duration.fast,
            delay: 0.2,
            ease: MOTION.ease.out,
          },
        )
      }
    },
    { scope: svgRef },
  )

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 80 80"
      className="mx-auto size-20 text-success"
      aria-hidden
    >
      <circle
        cx="40"
        cy="40"
        r="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="text-success-soft"
      />
      <circle
        data-success-ring
        cx="40"
        cy="40"
        r="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="226"
        strokeDashoffset="0"
        strokeLinecap="round"
      />
      <path
        data-success-tick
        d="M26 41 L36 51 L54 31"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
