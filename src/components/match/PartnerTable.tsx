import { useLayoutEffect, useMemo, useRef } from 'react'
import { Lock } from 'lucide-react'

import { PartnerFilters } from '@/components/match/PartnerFilters'
import { PartnerRow } from '@/components/match/PartnerRow'
import { filterPartnerOffers } from '@/components/match/filterPartnerOffers'
import type { PartnerOffer } from '@/data/types'
import { Flip, gsap, prefersReducedMotion } from '@/lib/gsap'
import { MOTION } from '@/lib/motion'
import { useFilterStore } from '@/store/filterStore'

export type PartnerTableProps = {
  offers: PartnerOffer[]
  matchSlug: string
}

export function PartnerTable({ offers, matchSlug }: PartnerTableProps) {
  const filters = useFilterStore((s) => s.partners)
  const listRef = useRef<HTMLDivElement | null>(null)
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null)

  const filtered = useMemo(
    () => filterPartnerOffers(offers, filters),
    [offers, filters],
  )

  useLayoutEffect(() => {
    const root = listRef.current
    if (!root) {
      return
    }

    if (flipStateRef.current && !prefersReducedMotion()) {
      Flip.from(flipStateRef.current, {
        targets: root.querySelectorAll('[data-offer-id]'),
        duration: MOTION.duration.fast,
        ease: MOTION.ease.inOut,
        absoluteOnLeave: true,
        nested: true,
        stagger: 0.02,
        onEnter: (elements) => {
          gsap.fromTo(
            elements,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: MOTION.duration.fast,
              stagger: 0.03,
              ease: MOTION.ease.out,
            },
          )
        },
        onLeave: (elements) => {
          gsap.to(elements, {
            opacity: 0,
            y: -8,
            duration: MOTION.duration.instant,
            stagger: 0.02,
            ease: MOTION.ease.soft,
          })
        },
      })
    }

    flipStateRef.current = Flip.getState(
      root.querySelectorAll('[data-offer-id]'),
    )
  }, [filtered])

  return (
    <section className="bg-white py-10 md:py-12" data-reveal>
      <div className="container-home">
        <h2 className="text-[22px] font-bold tracking-[-0.01em] text-ink md:text-[26px]">
          Compare Partner Ticket Offers
        </h2>
        <p className="mt-1.5 text-[13px] text-muted">
          Compare prices from trusted ticket partners in one place.
        </p>

        <div className="mt-6">
          <PartnerFilters />
        </div>

        <div ref={listRef} className="mt-6">
          <div className="hidden grid-cols-[minmax(0,1.35fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,0.9fr)_auto] gap-4 border-b border-border px-4 pb-2 text-[12px] font-medium text-muted md:grid lg:px-5">
            <span>Partner</span>
            <span>Ticket type</span>
            <span>Section / Details</span>
            <span>Availability</span>
            <span className="text-right">Price (per ticket)</span>
          </div>

          {filtered.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted">
              No offers match your filters. Try fewer tickets or broaden
              availability.
            </p>
          ) : (
            filtered.map((offer) => (
              <PartnerRow
                key={offer.id}
                offer={offer}
                matchSlug={matchSlug}
              />
            ))
          )}
        </div>

        <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-muted">
          <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span>
            Prices and availability may change at any time. Final purchase takes
            place on the partner&apos;s website. FootballTicketClub is an
            independent ticket comparison site and is not the ticket seller.
          </span>
        </p>
      </div>
    </section>
  )
}
