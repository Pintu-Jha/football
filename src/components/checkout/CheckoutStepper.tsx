import { useGSAP } from '@gsap/react'
import { Check } from 'lucide-react'
import { useRef } from 'react'

import { CHECKOUT_STEPS, type CheckoutStep } from '@/components/checkout/types'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { MOTION } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface CheckoutStepperProps {
  current: CheckoutStep
  onNavigate: (step: CheckoutStep) => void
  /** Disable navigation (e.g. while a payment is processing). */
  disabled?: boolean
}

export function CheckoutStepper({
  current,
  onNavigate,
  disabled = false,
}: CheckoutStepperProps) {
  const fillRef = useRef<HTMLDivElement>(null)
  const currentIndex = CHECKOUT_STEPS.findIndex((s) => s.key === current)
  const progress = currentIndex / (CHECKOUT_STEPS.length - 1)

  useGSAP(
    () => {
      const el = fillRef.current
      if (!el) return
      if (prefersReducedMotion()) {
        gsap.set(el, { scaleX: progress })
        return
      }
      gsap.to(el, {
        scaleX: progress,
        duration: MOTION.duration.base,
        ease: MOTION.ease.inOut,
      })
    },
    { dependencies: [progress] },
  )

  return (
    <nav aria-label="Checkout progress">
      <div className="relative">
        {/* progress line, running between the centres of the first and last step */}
        <div
          aria-hidden
          className="absolute left-[16.667%] right-[16.667%] top-5 h-0.5 -translate-y-1/2 overflow-hidden rounded-full bg-border"
        >
          <div
            ref={fillRef}
            className="h-full origin-left bg-brand"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        <ol className="relative grid grid-cols-3">
          {CHECKOUT_STEPS.map((step, index) => {
            const isCurrent = index === currentIndex
            const isComplete = index < currentIndex
            const clickable = isComplete && !disabled

            const content = (
              <>
                <span
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors duration-base',
                    isComplete && 'border-brand bg-brand text-white',
                    isCurrent && 'border-brand bg-surface text-brand',
                    !isComplete &&
                      !isCurrent &&
                      'border-border-strong bg-surface text-muted',
                  )}
                  aria-hidden
                >
                  {isComplete ? (
                    <Check className="size-4 stroke-[3]" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    'text-xs font-semibold sm:text-sm',
                    isCurrent ? 'text-ink' : 'text-muted',
                  )}
                >
                  {step.label}
                  {isComplete ? <span className="sr-only"> (completed)</span> : null}
                </span>
              </>
            )

            return (
              <li
                key={step.key}
                aria-current={isCurrent ? 'step' : undefined}
                className="flex justify-center"
              >
                {clickable ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(step.key)}
                    className="flex flex-col items-center gap-2 rounded-lg px-2 py-1 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                  >
                    {content}
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-2 px-2 py-1">
                    {content}
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
