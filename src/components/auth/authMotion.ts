import { gsap, prefersReducedMotion } from '@/lib/gsap'

/** Horizontal shake for failed submits. No-op under prefers-reduced-motion. */
export function shake(element: HTMLElement | null): void {
  if (!element || prefersReducedMotion()) return
  gsap.killTweensOf(element)
  gsap.fromTo(
    element,
    { x: 0 },
    {
      keyframes: [
        { x: -10, duration: 0.07 },
        { x: 10, duration: 0.09 },
        { x: -7, duration: 0.08 },
        { x: 7, duration: 0.08 },
        { x: -3, duration: 0.06 },
        { x: 0, duration: 0.06 },
      ],
      ease: 'power1.inOut',
      clearProps: 'transform',
    },
  )
}
