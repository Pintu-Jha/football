import { ArrowRight, CalendarDays, ChevronDown } from 'lucide-react'
import { useMemo, useState } from 'react'

import { MatchFilters } from '@/components/competition/MatchFilters'
import { MatchRow } from '@/components/competition/MatchRow'
import { filterAndSortMatches } from '@/components/competition/filterMatches'
import type { Match, Team, Venue } from '@/data/types'
import { useFilterStore } from '@/store/filterStore'

const INITIAL_VISIBLE = 6
const LOAD_MORE_STEP = 6

export type MatchListProps = {
  competitionName: string
  matches: Match[]
  teams: Team[]
  venues: Venue[]
}

export function MatchList({
  competitionName,
  matches,
  teams,
  venues,
}: MatchListProps) {
  const filters = useFilterStore((s) => s.competition)
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)

  const filtered = useMemo(
    () => filterAndSortMatches(matches, filters),
    [matches, filters],
  )

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  return (
    <section id="tickets" className="scroll-mt-20 bg-white pt-6">
      <div className="container-home space-y-6">
        <MatchFilters
          competitionName={competitionName}
          matches={matches}
          teams={teams}
          venues={venues}
        />

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-[20px] font-bold tracking-[-0.01em] text-ink">
              <CalendarDays className="size-5 text-brand" aria-hidden />
              Upcoming {competitionName} Matches
            </h2>
            <div className="flex items-center gap-5 text-[12px]">
              <button
                type="button"
                onClick={() => setVisibleCount(filtered.length)}
                className="inline-flex items-center gap-1 font-medium text-brand hover:text-brand-hover"
              >
                View all fixtures
                <ArrowRight className="size-3.5" aria-hidden />
              </button>
              <span className="text-muted">
                Total {filtered.length} {filtered.length === 1 ? 'match' : 'matches'}
              </span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-border bg-white p-10 text-center text-[13px] text-muted">
              No matches match your filters. Try adjusting city, team, date, or
              venue — or clear all filters to see every fixture.
            </p>
          ) : (
            <ul className="mt-3 overflow-hidden rounded-lg border border-border bg-white">
              {visible.map((match) => (
                <li key={match.id} className="border-b border-border last:border-b-0">
                  <MatchRow match={match} />
                </li>
              ))}
            </ul>
          )}

          {hasMore ? (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((n) => n + LOAD_MORE_STEP)}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-brand/40 bg-brand-soft/40 px-8 text-[13px] font-medium text-brand transition-colors hover:bg-brand-soft"
              >
                Load More Matches
                <ChevronDown className="size-4" aria-hidden />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
