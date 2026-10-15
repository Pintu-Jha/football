import * as Popover from '@radix-ui/react-popover'
import { Calendar, ChevronDown, Landmark, MapPin } from 'lucide-react'
import { useMemo, useState } from 'react'

import { TeamSuggest } from '@/components/competition/TeamSuggest'
import {
  DateCalendar,
  formatSelectedDate,
} from '@/components/home/DateCalendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import type { Match, Team, Venue } from '@/data/types'
import { cn } from '@/lib/utils'
import { useFilterStore } from '@/store/filterStore'

export type MatchFiltersProps = {
  competitionName: string
  matches: Match[]
  teams: Team[]
  venues: Venue[]
}

const SORT_OPTIONS = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
] as const

const fieldClass =
  'h-10 rounded-md border-border bg-surface-muted text-[12px] font-medium text-ink hover:bg-surface-subtle focus:ring-offset-0'

export function MatchFilters({
  competitionName,
  matches,
  teams,
  venues,
}: MatchFiltersProps) {
  const filters = useFilterStore((s) => s.competition)
  const setCompetitionFilter = useFilterStore((s) => s.setCompetitionFilter)
  const resetCompetitionFilters = useFilterStore((s) => s.resetCompetitionFilters)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const cities = useMemo(
    () => [...new Set(matches.map((m) => m.city))].sort((a, b) => a.localeCompare(b)),
    [matches],
  )

  const dateLabel = formatSelectedDate(filters.date || null)
  const sortLabel =
    SORT_OPTIONS.find((o) => o.value === filters.sort)?.label ?? 'Upcoming'

  return (
    <div className="relative z-20 rounded-lg border border-border bg-white px-5 py-5">
      <h2 className="text-[20px] font-bold tracking-[-0.01em] text-ink">
        Find {competitionName} Matches
      </h2>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4 lg:max-w-[640px]">
          <Select
            value={filters.city || 'all'}
            onValueChange={(v) => setCompetitionFilter('city', v === 'all' ? '' : v)}
          >
            <SelectTrigger icon={<MapPin />} className={fieldClass} aria-label="City">
              <SelectValue>{filters.city || 'City'}</SelectValue>
            </SelectTrigger>
            <SelectContent className="z-[200]">
              <SelectItem value="all">All cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <TeamSuggest
            teams={teams}
            value={filters.team}
            onChange={(name) => setCompetitionFilter('team', name)}
            placeholder="Team"
            className={cn(fieldClass, 'text-ink focus:ring-offset-0')}
          />

          <Popover.Root open={calendarOpen} onOpenChange={setCalendarOpen}>
            <Popover.Trigger asChild>
              <button
                type="button"
                className={cn(
                  'flex w-full items-center justify-between gap-2 border px-3 transition-colors focus:outline-none focus:ring-2 focus:ring-brand',
                  fieldClass,
                )}
                aria-label={dateLabel ? `Date: ${dateLabel}` : 'Choose a date'}
              >
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <Calendar className="size-4 shrink-0 text-muted" aria-hidden />
                  <span className="truncate">{dateLabel || 'Date'}</span>
                </span>
                <ChevronDown className="size-4 shrink-0 text-muted" aria-hidden />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                align="start"
                side="bottom"
                sideOffset={8}
                collisionPadding={16}
                className="z-[200] outline-none"
              >
                <DateCalendar
                  value={filters.date || null}
                  clearLabel="Anytime"
                  onChange={(iso) => setCompetitionFilter('date', iso ?? '')}
                  onClose={() => setCalendarOpen(false)}
                />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          <Select
            value={filters.venue || 'all'}
            onValueChange={(v) => setCompetitionFilter('venue', v === 'all' ? '' : v)}
          >
            <SelectTrigger icon={<Landmark />} className={fieldClass} aria-label="Venue">
              <SelectValue>{filters.venue || 'Venue'}</SelectValue>
            </SelectTrigger>
            <SelectContent className="z-[200]">
              <SelectItem value="all">All venues</SelectItem>
              {venues.map((venue) => (
                <SelectItem key={venue.id} value={venue.name}>
                  {venue.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
          <span className="text-[12px] text-muted">Sort by</span>
          <Select
            value={filters.sort}
            onValueChange={(v) =>
              setCompetitionFilter('sort', v as 'upcoming' | 'price-asc' | 'price-desc')
            }
          >
            <SelectTrigger className={cn(fieldClass, 'w-[160px] bg-white')} aria-label="Sort by">
              <SelectValue>{sortLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent className="z-[200]">
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="button"
            onClick={() => setCompetitionFilter('sort', filters.sort)}
            className="inline-flex h-10 w-[150px] items-center justify-center rounded-md bg-brand text-[13px] font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={() => resetCompetitionFilters()}
            className="text-[12px] font-medium text-brand hover:text-brand-hover"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  )
}
