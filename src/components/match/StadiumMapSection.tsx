import { Calendar, Clock, MapPin } from 'lucide-react'
import { useCallback, useState } from 'react'

import { StadiumMap } from '@/components/match/StadiumMap'
import { StadiumTicketPanel } from '@/components/match/StadiumTicketPanel'
import { lilleStadiumTickets } from '@/data/stadium'
import type { Match } from '@/data/types'
import { formatMatchDate } from '@/lib/format'
import { useFilterStore } from '@/store/filterStore'

export type StadiumMapSectionProps = {
  match: Match
}

export function StadiumMapSection({ match }: StadiumMapSectionProps) {
  const date = formatMatchDate(match.datetime)
  const zoneId = useFilterStore((s) => s.stadium.zoneId)
  const setStadiumFilter = useFilterStore((s) => s.setStadiumFilter)
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null)

  const handleZoneClick = useCallback(
    (id: string) => {
      setStadiumFilter('zoneId', zoneId === id ? null : id)
    },
    [zoneId, setStadiumFilter],
  )

  const longDate = new Date(match.datetime).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <section className="bg-surface-muted/60 py-6 md:py-8" aria-label="Choose your seats">
      <div className="container-ftc">
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
          <div className="rounded-2xl border border-border bg-white p-4 shadow-soft md:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-lg font-extrabold tracking-tight text-ink md:text-xl">
                  {match.venue} - {match.city}
                </h2>
                <ul className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-muted">
                  <li className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 shrink-0 text-muted-soft" aria-hidden />
                    {match.venue}, {match.city}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 shrink-0 text-muted-soft" aria-hidden />
                    <time dateTime={match.datetime}>{longDate}</time>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Clock className="size-3.5 shrink-0 text-muted-soft" aria-hidden />
                    {date.time}
                  </li>
                </ul>
              </div>
              <a
                href="mailto:sales@footballticketclub.com?subject=Corporate%20hospitality%20request"
                className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-brand px-4 text-[13px] font-semibold text-brand transition-colors hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                Corporate Request
              </a>
            </div>

            <div className="mt-4">
              <StadiumMap
                selectedZoneId={zoneId}
                hoveredZoneId={hoveredZoneId}
                onZoneClick={handleZoneClick}
                onZoneHover={setHoveredZoneId}
              />
            </div>
          </div>

          <StadiumTicketPanel
            matchSlug={match.slug}
            tickets={lilleStadiumTickets}
            hoveredZoneId={hoveredZoneId}
            onTicketHover={setHoveredZoneId}
          />
        </div>
      </div>
    </section>
  )
}
