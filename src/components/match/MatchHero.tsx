import { Calendar, ChevronRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

import { TeamCrest } from '@/components/ui/TeamCrest'
import type { Match } from '@/data/types'
import { formatListingDate } from '@/lib/format'
import { cn } from '@/lib/utils'

export type MatchHeroProps = {
  match: Match
  className?: string
}

export function MatchHero({ match, className }: MatchHeroProps) {
  const date = formatListingDate(match.datetime)
  const matchLabel = `${match.homeTeam} vs ${match.awayTeam}`

  return (
    <section
      className={cn('relative isolate overflow-hidden pt-14 text-white', className)}
    >
      <img
        src="/images/club-stadium-bg.jpg"
        alt=""
        loading="eager"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#2a060c]/95 via-[#6b1018]/88 to-[#e8202a]/72"
        aria-hidden
      />

      <div className="container-home relative pb-8 pt-5 md:pb-10">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-[11px] text-white/70">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <ChevronRight className="size-3 text-white/45" aria-hidden />
            <li>
              <Link to="/football/premier-league" className="hover:text-white">
                Football
              </Link>
            </li>
            <ChevronRight className="size-3 text-white/45" aria-hidden />
            <li>
              <Link
                to={`/football/${match.competitionId}`}
                className="hover:text-white"
              >
                {match.competitionName}
              </Link>
            </li>
            <ChevronRight className="size-3 text-white/45" aria-hidden />
            <li className="text-white" aria-current="page">
              {matchLabel}
            </li>
          </ol>
        </nav>

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
          {match.competitionName}
        </p>
        <h1 className="mt-2 text-[28px] font-bold leading-[1.15] tracking-[-0.02em] md:text-[36px]">
          {matchLabel} Tickets
        </h1>

        <ul className="mt-3 flex flex-col gap-1.5 text-[13px] text-white/90 sm:flex-row sm:flex-wrap sm:gap-x-6">
          <li className="flex items-center gap-2">
            <Calendar className="size-3.5 shrink-0" aria-hidden />
            <span>
              {date.full} · {date.time}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            <span>
              {match.venue}, {match.city}, {match.country}
            </span>
          </li>
        </ul>

        <div className="mt-7 flex items-center justify-center gap-6 md:gap-10">
          <div className="flex items-center gap-3">
            <TeamCrest
              name={match.homeTeam}
              initials={match.homeInitials}
              color={match.homeColor}
              size={44}
              className="rounded-full bg-white p-1"
            />
            <span className="text-[15px] font-semibold">{match.homeTeam}</span>
          </div>
          <span className="text-[11px] font-bold tracking-[0.22em] text-white/80">
            VS
          </span>
          <div className="flex items-center gap-3">
            <TeamCrest
              name={match.awayTeam}
              initials={match.awayInitials}
              color={match.awayColor}
              size={44}
              className="rounded-full bg-white p-1"
            />
            <span className="text-[15px] font-semibold">{match.awayTeam}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
