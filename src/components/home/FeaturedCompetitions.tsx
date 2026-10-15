import useEmblaCarousel from 'embla-carousel-react'
import { useCallback } from 'react'
import { Link } from 'react-router-dom'

import { CardArrow } from '@/components/home/CardArrow'
import { HomeSectionHeader } from '@/components/home/HomeSectionHeader'
import { featuredCompetitionCards } from '@/data/homeContent'

function CardWordmark({ type }: { type: 'laliga' | 'seriea' }) {
  if (type === 'laliga') {
    return (
      <span className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 text-[34px] font-black italic tracking-[-0.06em] text-white drop-shadow-md">
        LALIGA
      </span>
    )
  }
  return (
    <span className="absolute left-1/2 top-[38%] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white text-[28px] font-black text-white">
      A
    </span>
  )
}

export function FeaturedCompetitions() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section className="bg-white pb-8 pt-8 md:pt-10">
      <div className="container-home">
        <HomeSectionHeader
          title="Featured Competitions"
          viewAllHref="/football/premier-league"
          viewAllLabel="View all competitions"
          onPrev={scrollPrev}
          onNext={scrollNext}
        />

        <div ref={emblaRef} className="mt-4 overflow-hidden">
          <div className="-ml-4 flex">
            {featuredCompetitionCards.map((card) => (
              <div
                key={card.id}
                className="min-w-0 shrink-0 grow-0 basis-[62%] pl-4 sm:basis-1/3 lg:basis-1/5"
              >
                <Link
                  to={card.href}
                  className="group relative block aspect-[256/204] overflow-hidden rounded-lg bg-ink"
                >
                  {card.image ? (
                    <img
                      src={card.image}
                      alt={card.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}
                  {'wordmark' in card && card.wordmark ? (
                    <CardWordmark type={card.wordmark} />
                  ) : null}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5">
                    <div className="min-w-0">
                      <h3 className="truncate text-[15px] font-semibold leading-tight text-white">
                        {card.name}
                      </h3>
                      <p className="mt-0.5 text-[12px] text-white/75">
                        {card.region}
                      </p>
                    </div>
                    <CardArrow />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
