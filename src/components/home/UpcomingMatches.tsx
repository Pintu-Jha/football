import useEmblaCarousel from 'embla-carousel-react'
import { ArrowRight, MapPin } from 'lucide-react'
import { useCallback } from 'react'
import { Link } from 'react-router-dom'

import { HomeSectionHeader } from '@/components/home/HomeSectionHeader'
import { upcomingMatchCards } from '@/data/homeContent'

export function UpcomingMatches() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
  })
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section className="bg-white py-8">
      <div className="container-home">
        <HomeSectionHeader
          title="Upcoming Matches"
          viewAllHref="/football/premier-league"
          viewAllLabel="View all matches"
          onPrev={scrollPrev}
          onNext={scrollNext}
        />

        <div ref={emblaRef} className="mt-4 overflow-hidden">
          <div className="-ml-4 flex">
          {upcomingMatchCards.map((card) => (
            <div
              key={card.id}
              className="min-w-0 shrink-0 grow-0 basis-[85%] pl-4 sm:basis-1/2 lg:basis-1/4"
            >
            <article className="flex h-full flex-col rounded-lg border border-border bg-white p-4 transition-shadow hover:shadow-card">
              <p className="text-[11px] text-muted">
                {card.dateLabel} · {card.time}
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-ink">
                <img
                  src={card.competitionLogo}
                  alt=""
                  loading="lazy"
                  className="size-3.5 object-contain"
                />
                {card.competition}
              </p>

              <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-start gap-2">
                <div className="flex flex-col items-center gap-2 text-center">
                  <img
                    src={card.homeLogo}
                    alt={card.home}
                    loading="lazy"
                    className="size-11 object-contain"
                  />
                  <p className="text-[12px] font-semibold text-ink">{card.home}</p>
                </div>
                <span className="mt-3.5 text-[11px] font-medium text-muted">vs</span>
                <div className="flex flex-col items-center gap-2 text-center">
                  <img
                    src={card.awayLogo}
                    alt={card.away}
                    loading="lazy"
                    className="size-11 object-contain"
                  />
                  <p className="text-[12px] font-semibold text-ink">{card.away}</p>
                </div>
              </div>

              <div className="mt-3 flex items-start justify-center gap-1 text-center text-[10px] leading-snug text-muted">
                <MapPin className="mt-px size-3 shrink-0" aria-hidden />
                <span>
                  {card.venue}
                  <br />
                  {card.city}
                </span>
              </div>

              <div className="mt-4 flex items-end justify-between gap-3">
                <div className="leading-none">
                  <p className="text-[11px] text-muted">From</p>
                  <p className="mt-1 text-[20px] font-bold text-ink">
                    ${card.priceFrom}
                  </p>
                </div>
                <Link
                  to={card.href}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md bg-brand px-4 text-[12px] font-semibold text-white transition-colors hover:bg-brand-hover"
                >
                  View Tickets
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </div>
            </article>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}
