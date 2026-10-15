import { Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { buildCheckoutPath } from '@/data/checkout'
import { getSeatCategory, getZone } from '@/data/stadium'
import type { StadiumTicket } from '@/data/types'
import { formatPriceWithCode } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { CurrencyCode } from '@/store/uiStore'

export type StadiumTicketCardProps = {
  ticket: StadiumTicket
  matchSlug: string
  currency: CurrencyCode
  highlighted?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export function StadiumTicketCard({
  ticket,
  matchSlug,
  currency,
  highlighted,
  onMouseEnter,
  onMouseLeave,
}: StadiumTicketCardProps) {
  const zone = getZone(ticket.zoneId)
  const category = zone ? getSeatCategory(zone.categoryId) : undefined

  return (
    <article
      data-ticket-id={ticket.id}
      data-zone-id={ticket.zoneId}
      data-cursor="card"
      className={cn(
        'group relative flex overflow-hidden rounded-xl border bg-white transition-[box-shadow,border-color] duration-200',
        highlighted
          ? 'border-brand/40 shadow-card'
          : 'border-border hover:border-border-strong hover:shadow-soft',
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span
        className="w-1 shrink-0"
        style={{ backgroundColor: category?.color ?? '#9CA3AF' }}
        aria-hidden
      />

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-0 sm:p-0">
        <div className="min-w-0 flex-1 sm:py-3.5 sm:pl-4 sm:pr-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center rounded-full border border-brand/20 bg-brand-soft px-2 py-0.5 text-[10px] font-semibold leading-4 text-brand">
              {ticket.available} Available Ticket
            </span>
            {ticket.cheapest ? (
              <span className="inline-flex items-center rounded-full border border-success/40 bg-white px-2 py-0.5 text-[10px] font-semibold leading-4 text-success">
                Cheapest
              </span>
            ) : null}
            {ticket.mostPopular ? (
              <span className="inline-flex items-center rounded-full border border-brand/40 bg-white px-2 py-0.5 text-[10px] font-semibold leading-4 text-brand">
                Most Popular
              </span>
            ) : null}
          </div>

          <h3 className="mt-2 text-[15px] font-bold leading-snug tracking-tight text-ink">
            {ticket.tierName}
          </h3>

          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {ticket.eTicket ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-surface-subtle px-2 py-0.5 text-[11px] font-medium text-muted">
                <Ticket className="size-3" aria-hidden />
                E-Ticket
              </span>
            ) : null}
            {category ? (
              <span className="text-[11px] text-muted-soft">{category.label}</span>
            ) : null}
          </div>
        </div>

        {/* Perforation */}
        <div
          className="mx-1 hidden h-[calc(100%-1.5rem)] self-center border-l-2 border-dotted border-border-strong sm:block"
          aria-hidden
        />

        <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:gap-2 sm:px-4 sm:py-3.5">
          <p className="whitespace-nowrap text-lg font-extrabold tracking-tight text-ink">
            {formatPriceWithCode(ticket.price, currency)}
          </p>
          <Button
            asChild
            size="sm"
            magnetic
            className="h-9 min-w-[7.5rem] rounded-lg px-4 text-[13px]"
          >
            <Link
              to={buildCheckoutPath(matchSlug, ticket.id, 'stadium')}
              aria-label={`View tickets: ${ticket.tierName}, ${formatPriceWithCode(ticket.price, currency)}`}
            >
              View tickets
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
