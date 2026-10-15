import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

import { HeroSearch } from '@/components/home/HeroSearch'
import { TrustStrip } from '@/components/home/TrustStrip'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { MOTION } from '@/lib/motion'

const HERO_IMAGE = '/images/hero-fan.jpg'

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      const content = contentRef.current
      if (!content || prefersReducedMotion()) {
        return
      }
      const items = content.querySelectorAll<HTMLElement>('[data-hero-item]')
      gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION.duration.base,
          stagger: 0.08,
          ease: MOTION.ease.out,
          delay: 0.1,
        },
      )
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-ink"
    >
      <img
        src={HERO_IMAGE}
        alt=""
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-[70%_30%]"
      />
      <div className="gradient-hero absolute inset-0 -z-10" aria-hidden />

      <div
        ref={contentRef}
        className="container-home pb-6 pt-[92px] md:pt-[104px]"
      >
        <p
          data-hero-item
          className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90"
        >
          Football &amp; Live Events Tickets
        </p>
        <h1
          data-hero-item
          className="mt-3 text-[34px] font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-[44px] lg:text-[52px]"
        >
          Live the <span className="text-brand">moments</span> that matter.
        </h1>
        <p
          data-hero-item
          className="mt-3 max-w-[560px] text-[15px] leading-[1.55] text-white/90 md:text-[18px]"
        >
          Secure tickets for the world&apos;s biggest football matches, iconic
          concerts, and unforgettable live events.
        </p>

        <div data-hero-item className="relative z-30 mt-6 lg:mr-[6%]">
          <HeroSearch />
        </div>

        <div data-hero-item className="relative z-20 mt-6">
          <TrustStrip variant="hero" />
        </div>
      </div>
    </section>
  )
}
