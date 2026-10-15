import { ArrowRight, Mail } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { cn } from '@/lib/utils'
import { useUiStore } from '@/store/uiStore'

const BANNER_IMAGE = '/images/newsletter-fans.jpg'

export function NewsletterBanner() {
  const openNewsletter = useUiStore((s) => s.openNewsletter)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    openNewsletter('banner')
    setSubmitted(true)
  }

  return (
    <section className="bg-white pb-10 pt-2">
      <div className="container-home">
        <div className="relative isolate overflow-hidden rounded-xl bg-maroon-deep">
          <img
            src={BANNER_IMAGE}
            alt=""
            loading="lazy"
            className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
          />
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-r from-[#5a0a12]/95 via-[#b0141d]/70 to-[#e8202a]/55"
            aria-hidden
          />

          <div className="flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8 md:py-10">
            <div>
              <h2 className="text-[26px] font-bold leading-tight tracking-[-0.01em] text-white md:text-[30px]">
                Make every match a memory.
              </h2>
              <p className="mt-2 text-[14px] text-white/85">
                Join millions of fans who book with FootballTicketClub.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex w-full items-center rounded-md bg-white p-1.5 md:w-[480px]"
            >
              <Mail className="ml-2.5 size-4 shrink-0 text-muted-soft" aria-hidden />
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="Your email address"
                className="h-10 min-w-0 flex-1 bg-transparent px-3 text-[13px] text-ink outline-none placeholder:text-muted-soft"
              />
              <button
                type="submit"
                className={cn(
                  'inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md px-6 text-[13px] font-semibold text-white transition-colors',
                  submitted ? 'bg-success' : 'bg-brand hover:bg-brand-hover',
                )}
              >
                {submitted ? 'Subscribed!' : 'Subscribe'}
                {submitted ? null : <ArrowRight className="size-3.5" aria-hidden />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
