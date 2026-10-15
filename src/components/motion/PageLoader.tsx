import { useGSAP } from '@gsap/react'
import { useRef, useState } from 'react'

import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { MOTION } from '@/lib/motion'

const SESSION_KEY = 'ftc-page-loader-seen'

/**
 * Brief brand-red curtain on first load (once per session).
 * Respects prefers-reduced-motion — dismisses immediately.
 */
export function PageLoader() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return sessionStorage.getItem(SESSION_KEY) !== '1'
    } catch {
      return true
    }
  })

  const rootRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      if (!visible) {
        return
      }

      const root = rootRef.current
      const panel = panelRef.current
      if (!root || !panel) {
        return
      }

      const dismiss = () => {
        try {
          sessionStorage.setItem(SESSION_KEY, '1')
        } catch {
          /* ignore */
        }
        setVisible(false)
      }

      if (prefersReducedMotion()) {
        dismiss()
        return
      }

      const tl = gsap.timeline({
        onComplete: dismiss,
      })

      tl.fromTo(
        panel,
        { yPercent: 0 },
        {
          yPercent: -100,
          duration: MOTION.duration.loader,
          ease: MOTION.ease.inOut,
          delay: 0.35,
        },
      ).to(
        root,
        {
          opacity: 0,
          duration: MOTION.duration.fast,
          ease: MOTION.ease.soft,
        },
        '-=0.15',
      )

      return () => {
        tl.kill()
      }
    },
    { dependencies: [visible] },
  )

  if (!visible) {
    return null
  }

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center"
      aria-hidden
    >
      <div
        ref={panelRef}
        className="absolute inset-0 bg-brand"
      />
      <span className="relative z-[1] text-sm font-extrabold tracking-tight text-white md:text-base">
        Football <span className="opacity-90">Ticket</span> Club
      </span>
    </div>
  )
}
