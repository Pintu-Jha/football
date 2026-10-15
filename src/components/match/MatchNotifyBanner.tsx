import { useGSAP } from '@gsap/react'
import { Bell } from 'lucide-react'
import { useRef, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { MOTION } from '@/lib/motion'
import { useUiStore } from '@/store/uiStore'

export type MatchNotifyBannerProps = {
  matchLabel: string
}

export function MatchNotifyBanner({ matchLabel }: MatchNotifyBannerProps) {
  const openNewsletter = useUiStore((s) => s.openNewsletter)
  const bellRef = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      const bell = bellRef.current
      if (!bell || prefersReducedMotion()) {
        return
      }

      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 4,
        defaults: { ease: MOTION.ease.soft },
      })

      tl.to(bell, { rotation: 12, duration: 0.12 })
        .to(bell, { rotation: -10, duration: 0.12 })
        .to(bell, { rotation: 7, duration: 0.1 })
        .to(bell, { rotation: -5, duration: 0.1 })
        .to(bell, { rotation: 0, duration: 0.12 })

      return () => {
        tl.kill()
      }
    },
    { scope: bellRef },
  )

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    openNewsletter('notify')
  }

  return (
    <section className="bg-white pb-2 pt-2" data-reveal>
      <div className="container-home">
        <div className="flex flex-col gap-5 rounded-xl border border-brand/35 bg-white px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div
              ref={bellRef}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-white will-change-transform"
              aria-hidden
            >
              <Bell className="size-5 fill-current" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-ink">
                Get match ticket updates
              </h2>
              <p className="mt-0.5 text-[13px] leading-relaxed text-muted">
                Be the first to know when prices drop, new tickets are available
                or this match is close to selling out.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:max-w-md lg:shrink-0"
            aria-label={`Notify me about ${matchLabel} tickets`}
          >
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="Your email address"
              className="h-10 flex-1 rounded-lg border border-border bg-white px-3 text-[13px] text-ink outline-none placeholder:text-muted-soft focus-visible:ring-2 focus-visible:ring-brand"
            />
            <Button
              type="submit"
              className="h-10 shrink-0 rounded-lg px-5 text-[13px] font-semibold"
            >
              Notify me
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
