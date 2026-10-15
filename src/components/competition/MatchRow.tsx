import { ArrowRight, Clock, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Crest } from '@/components/ui/Crest'
import { buildTicketsPath } from '@/data/checkout'
import { getTeamCrest } from '@/data/crests'
import type { Match } from '@/data/types'
import { formatMatchDate, formatPrice } from '@/lib/format'
import { useUiStore } from '@/store/uiStore'

export type MatchRowProps = {
  match: Match
}

function TeamName({
  name,
  initials,
  color,
}: {
  name: string
  initials: string
  color: string
}) {
  const crest = getTeamCrest(name)
  return (
    <span className="flex min-w-0 items-center gap-2">
      {crest ? (
        <img src={crest} alt="" loading="lazy" className="size-5 shrink-0 object-contain" />
      ) : (
        <Crest initials={initials} color={color} size="sm" className="size-5 text-[7px] ring-0" />
      )}
      <span className="truncate">{name}</span>
    </span>
  )
}

export function MatchRow({ match }: MatchRowProps) {
  const currency = useUiStore((s) => s.currency)
  const date = formatMatchDate(match.datetime)

  return (
    <article className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-5">
      <div className="flex shrink-0 items-center gap-3 sm:w-12 sm:flex-col sm:gap-0.5 sm:text-center">
        <span className="text-[10px] font-semibold uppercase text-brand">
          {date.weekday}
        </span>
        <span className="text-[24px] font-bold leading-none text-ink">{date.day}</span>
        <span className="text-[10px] font-medium uppercase text-muted">{date.month}</span>
      </div>

      <div className="hidden h-12 w-px bg-border sm:block" aria-hidden />

      <div className="min-w-0 flex-1">
        <h3 className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] font-semibold text-ink">
          <TeamName name={match.homeTeam} initials={match.homeInitials} color={match.homeColor} />
          <span className="text-[11px] font-medium text-muted">vs</span>
          <TeamName name={match.awayTeam} initials={match.awayInitials} color={match.awayColor} />
        </h3>
        <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[11px] text-muted">
          <Clock className="size-3 shrink-0" aria-hidden />
          <span>{date.time}</span>
          <MapPin className="ml-2 size-3 shrink-0" aria-hidden />
          <span>
            {match.venue}, {match.city}
          </span>
        </p>
        {match.vipTicket || match.vipHotel ? (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {match.vipTicket ? (
              <span className="rounded bg-[#ffd84d] px-2 py-0.5 text-[10px] font-semibold text-ink">
                VIP Ticket
              </span>
            ) : null}
            {match.vipHotel ? (
              <span className="rounded bg-[#ffd84d] px-2 py-0.5 text-[10px] font-semibold text-ink">
                VIP Ticket + Hotel
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-6 sm:justify-end">
        <div className="text-left leading-none sm:w-[72px]">
          <p className="text-[11px] text-muted">From</p>
          <p className="mt-1 text-[18px] font-bold text-brand">
            {formatPrice(match.priceFrom, currency)}
          </p>
        </div>
        <Link
          to={buildTicketsPath(match.slug)}
          className="inline-flex h-10 w-[150px] items-center justify-center gap-1.5 rounded-md bg-brand text-[13px] font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          View offers
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </article>
  )
}
