import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { MOTION } from '@/lib/motion'
import { formatPrice } from '@/lib/format'
import type { CurrencyCode } from '@/store/uiStore'

export interface AnimatedPriceProps {
  /** Amount in EUR (base currency) */
  amountEur: number
  currency: CurrencyCode
  className?: string
}

/** Tweens between price values when the quantity or currency changes. */
export function AnimatedPrice({
  amountEur,
  currency,
  className,
}: AnimatedPriceProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const previous = useRef<number | null>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const from = previous.current
      previous.current = amountEur
      const finalText = formatPrice(amountEur, currency)

      if (from === null || from === amountEur || prefersReducedMotion()) {
        el.textContent = finalText
        return
      }

      const state = { value: from }
      const tween = gsap.to(state, {
        value: amountEur,
        duration: MOTION.duration.base,
        ease: MOTION.ease.out,
        onUpdate: () => {
          el.textContent = formatPrice(state.value, currency)
        },
        onComplete: () => {
          el.textContent = finalText
        },
      })

      return () => {
        tween.kill()
        el.textContent = finalText
      }
    },
    { dependencies: [amountEur, currency] },
  )

  return <span ref={ref} className={className} />
}
