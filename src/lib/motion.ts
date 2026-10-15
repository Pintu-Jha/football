/** Shared GSAP timing tokens — tweak here to retune site-wide motion. */

export const MOTION = {
  ease: {
    out: 'power3.out',
    inOut: 'power2.inOut',
    soft: 'power2.out',
  },
  duration: {
    instant: 0.2,
    fast: 0.35,
    base: 0.55,
    slow: 0.85,
    kenBurns: 18,
    pageWipe: 0.45,
    loader: 0.7,
  },
  reveal: {
    y: 48,
    stagger: 0.09,
    start: 'top 85%',
  },
  magnetic: {
    strength: 0.35,
    ease: 0.18,
  },
  kenBurns: {
    scaleFrom: 1,
    scaleTo: 1.08,
    parallaxYPercent: 12,
  },
  cursor: {
    lag: 0.15,
    expand: 2.4,
  },
} as const
