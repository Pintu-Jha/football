import { useGSAP } from '@gsap/react'
import * as Popover from '@radix-ui/react-popover'
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  MapPin,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'

import { filterStadiumTickets } from '@/components/match/filterStadiumTickets'
import { StadiumTicketCard } from '@/components/match/StadiumTicketCard'
import { Button } from '@/components/ui/Button'
import { getZone } from '@/data/stadium'
import type { StadiumTicket } from '@/data/types'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { MOTION } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { type StadiumTicketFilters, useFilterStore } from '@/store/filterStore'
import { useUiStore } from '@/store/uiStore'

const INITIAL_VISIBLE = 5

const SORT_OPTIONS: ReadonlyArray<{
  value: StadiumTicketFilters['sort']
  label: string
}> = [
  { value: 'recommended', label: 'Recommended order' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

const toolButton =
  'grid size-9 shrink-0 place-items-center rounded-lg border border-brand/30 bg-white text-brand transition-colors hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2'

export type StadiumTicketPanelProps = {
  matchSlug: string
  tickets: StadiumTicket[]
  hoveredZoneId: string | null
  onTicketHover: (zoneId: string | null) => void
  className?: string
}

export function StadiumTicketPanel({
  matchSlug,
  tickets,
  hoveredZoneId,
  onTicketHover,
  className,
}: StadiumTicketPanelProps) {
  const filters = useFilterStore((s) => s.stadium)
  const setStadiumFilter = useFilterStore((s) => s.setStadiumFilter)
  const currency = useUiStore((s) => s.currency)
  const [expanded, setExpanded] = useState(false)
  const listRef = useRef<HTMLUListElement | null>(null)

  const filtered = useMemo(
    () => filterStadiumTickets(tickets, filters),
    [tickets, filters],
  )

  const visibleCount = expanded ? filtered.length : INITIAL_VISIBLE
  const visible = filtered.slice(0, visibleCount)
  const hasMore = !expanded && filtered.length > INITIAL_VISIBLE
  const activeZone = filters.zoneId ? getZone(filters.zoneId) : undefined

  const cycleDirection = () =>
    setStadiumFilter(
      'sort',
      filters.sort === 'price-asc' ? 'price-desc' : 'price-asc',
    )

  const loadMore = () => {
    const previous = visible.length
    setExpanded(true)
    requestAnimationFrame(() => {
      const items = listRef.current?.querySelectorAll('li')
      if (!items || prefersReducedMotion()) return
      gsap.fromTo(
        Array.from(items).slice(previous),
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: MOTION.duration.base,
          stagger: MOTION.reveal.stagger,
          ease: MOTION.ease.out,
          clearProps: 'transform,opacity',
        },
      )
    })
  }

  useGSAP(
    () => {
      const items = listRef.current?.querySelectorAll('li')
      if (!items?.length || prefersReducedMotion()) return
      gsap.fromTo(
        items,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: MOTION.duration.fast,
          stagger: 0.05,
          ease: MOTION.ease.out,
          clearProps: 'transform,opacity',
        },
      )
    },
    { dependencies: [filters.zoneId, filters.sort, filters.hiddenSoldOut], scope: listRef },
  )

  const sortDirectionIcon =
    filters.sort === 'price-desc' ? (
      <ArrowDown className="size-4" aria-hidden />
    ) : (
      <ArrowUp className="size-4" aria-hidden />
    )

  return (
    <div className={cn('flex min-h-0 flex-col', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-pressed={filters.sort === 'recommended'}
            onClick={() => setStadiumFilter('sort', 'recommended')}
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
              filters.sort === 'recommended'
                ? 'bg-brand text-white hover:bg-brand-hover'
                : 'border border-brand/30 bg-white text-brand hover:bg-brand-soft',
            )}
          >
            <Star className="size-3.5 fill-current" aria-hidden />
            Recommended Order
          </button>
          <button
            type="button"
            className={toolButton}
            aria-label="Show tickets from all sections"
            title="Show all sections"
            onClick={() => setStadiumFilter('zoneId', null)}
          >
            <MapPin className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            className={toolButton}
            aria-label={
              filters.sort === 'price-desc'
                ? 'Sorted by price high to low. Switch to low to high'
                : 'Sort by price. Toggle direction'
            }
            title="Sort by price"
            onClick={cycleDirection}
          >
            {sortDirectionIcon}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className={toolButton}
            aria-label={filters.hiddenSoldOut ? 'Show sold out tickets' : 'Hide sold out tickets'}
            aria-pressed={filters.hiddenSoldOut}
            title={filters.hiddenSoldOut ? 'Showing available only' : 'Hide sold out'}
            onClick={() => setStadiumFilter('hiddenSoldOut', !filters.hiddenSoldOut)}
          >
            {filters.hiddenSoldOut ? (
              <EyeOff className="size-4" aria-hidden />
            ) : (
              <Eye className="size-4" aria-hidden />
            )}
          </button>

          <Popover.Root>
            <Popover.Trigger asChild>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-brand/30 bg-white px-3.5 text-[13px] font-semibold text-brand transition-colors hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                <SlidersHorizontal className="size-3.5" aria-hidden />
                Filters
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                align="end"
                sideOffset={8}
                className="z-50 w-64 rounded-xl border border-border bg-white p-4 shadow-lift outline-none"
              >
                <fieldset>
                  <legend className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Sort tickets
                  </legend>
                  <div className="mt-2 space-y-1">
                    {SORT_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-ink hover:bg-surface-muted"
                      >
                        <input
                          type="radio"
                          name="stadium-sort"
                          value={option.value}
                          checked={filters.sort === option.value}
                          onChange={() => setStadiumFilter('sort', option.value)}
                          className="size-4 accent-brand"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className="mt-3 flex cursor-pointer items-center gap-2.5 border-t border-border px-2 pt-3 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={filters.hiddenSoldOut}
                    onChange={(e) => setStadiumFilter('hiddenSoldOut', e.target.checked)}
                    className="size-4 accent-brand"
                  />
                  Hide sold out
                </label>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => {
                    setStadiumFilter('zoneId', null)
                    setStadiumFilter('sort', 'recommended')
                    setStadiumFilter('hiddenSoldOut', false)
                  }}
                >
                  Reset filters
                </Button>
                <Popover.Arrow className="fill-white" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>

      {activeZone ? (
        <div className="mt-3 flex items-center gap-2 text-xs text-muted" aria-live="polite">
          <span>Showing</span>
          <button
            type="button"
            onClick={() => setStadiumFilter('zoneId', null)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-2.5 py-1 font-semibold text-ink hover:border-brand/40"
            aria-label={`Clear section filter: ${activeZone.name}`}
          >
            {activeZone.name}
            <X className="size-3" aria-hidden />
          </button>
        </div>
      ) : null}

      <div className="relative mt-4">
        {filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted">
            No tickets in this section. Clear the filter to see every listing.
          </p>
        ) : (
          <ul
            ref={listRef}
            className={cn('space-y-3', expanded && 'max-h-[34rem] overflow-y-auto pr-1')}
            data-lenis-prevent={expanded ? '' : undefined}
          >
            {visible.map((ticket) => (
              <li key={ticket.id}>
                <StadiumTicketCard
                  ticket={ticket}
                  matchSlug={matchSlug}
                  currency={currency}
                  highlighted={hoveredZoneId !== null && ticket.zoneId === hoveredZoneId}
                  onMouseEnter={() => onTicketHover(ticket.zoneId)}
                  onMouseLeave={() => onTicketHover(null)}
                />
              </li>
            ))}
          </ul>
        )}

        {hasMore ? (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/85 to-transparent"
            aria-hidden
          />
        ) : null}
      </div>

      {hasMore ? (
        <button
          type="button"
          onClick={loadMore}
          className="relative mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-brand text-sm font-semibold text-brand transition-colors hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          Load more tickets
          <ArrowDown className="size-4" aria-hidden />
        </button>
      ) : null}
    </div>
  )
}
