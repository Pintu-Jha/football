import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { TeamCrest } from '@/components/ui/TeamCrest'
import type { Match } from '@/data/types'
import { formatEuroFrom, formatListingDate } from '@/lib/format'

export type MoreMatchesProps = {
  matches: Match[]
  competitionName: string
  competitionId?: string
}

export function MoreMatches({
  matches,
  competitionName,
  competitionId,
}: MoreMatchesProps) {
  if (matches.length === 0) {
    return null
  }

  const directoryHref = `/football/${competitionId ?? matches[0]?.competitionId ?? 'championship'}`

  return (
    <section className="bg-white pb-14 pt-6">
      <div className="container-home">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[18px] font-bold tracking-[-0.01em] text-ink md:text-[20px]">
            More {competitionName} matches
          </h2>
          <Link
            to={directoryHref}
            className="text-[13px] font-semibold text-brand transition-colors hover:text-brand-hover"
          >
            View all {competitionName} matches
          </Link>
        </div>

        <ul className="mt-5 grid gap-4 md:grid-cols-3">
          {matches.map((match) => {
            const date = formatListingDate(match.datetime)
            return (
              <li key={match.id}>
                <Link
                  to={`/match/${match.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-4 transition-shadow hover:shadow-soft"
                >
                  <TeamCrest
                    name={match.homeTeam}
                    initials={match.homeInitials}
                    color={match.homeColor}
                    size={36}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[13px] font-semibold text-ink group-hover:text-brand">
                      {match.homeTeam} vs {match.awayTeam}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {date.full} · {date.time}
                    </p>
                    <p className="text-[11px] text-muted">
                      {match.venue}, {match.city}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[13px] font-bold text-ink">
                      {formatEuroFrom(match.priceFrom)}
                    </p>
                    <p className="text-[11px] text-muted">per ticket</p>
                  </div>
                  <ChevronRight
                    className="size-4 shrink-0 text-muted group-hover:text-brand"
                    aria-hidden
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
