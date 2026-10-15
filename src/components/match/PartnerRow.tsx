import { ArrowRight, Bookmark } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { PartnerWordmark } from '@/components/ui/PartnerWordmark'
import { buildTicketsPath } from '@/data/checkout'
import type { PartnerOffer } from '@/data/types'
import { formatEuro } from '@/lib/format'
import { cn } from '@/lib/utils'

export type PartnerRowProps = {
  offer: PartnerOffer
  matchSlug: string
}

function formatAvailability(count: number): string {
  return count >= 10 ? '10+ available' : `${count} available`
}

export function PartnerRow({ offer, matchSlug }: PartnerRowProps) {
  const ticketsPath = buildTicketsPath(matchSlug)
  const [bookmarked, setBookmarked] = useState(Boolean(offer.bookmarked))

  return (
    <div
      data-offer-id={offer.id}
      className="border-b border-border bg-white last:border-b-0"
    >
      <div className="hidden grid-cols-[minmax(0,1.35fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,0.9fr)_auto] items-center gap-4 px-4 py-3.5 md:grid lg:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <PartnerWordmark name={offer.partnerName} />
          <button
            type="button"
            className={cn(
              'shrink-0 rounded-md p-1 text-muted-soft transition-colors hover:text-brand',
              bookmarked && 'text-brand',
            )}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark offer'}
            aria-pressed={bookmarked}
            onClick={() => setBookmarked((v) => !v)}
          >
            <Bookmark
              className={cn('size-4', bookmarked && 'fill-current')}
              aria-hidden
            />
          </button>
        </div>
        <div className="min-w-0 leading-tight">
          <p className="text-[13px] font-medium text-ink">{offer.ticketType}</p>
          {offer.ticketDetail ? (
            <p className="mt-0.5 text-[12px] text-muted">{offer.ticketDetail}</p>
          ) : null}
        </div>
        <div className="min-w-0 leading-tight">
          <p className="text-[13px] font-medium text-ink">{offer.section}</p>
          {offer.sectionDetail ? (
            <p className="mt-0.5 text-[12px] text-muted">{offer.sectionDetail}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2 text-[13px] text-ink">
          <span
            className="size-2 shrink-0 rounded-full bg-success"
            aria-hidden
          />
          <span>{formatAvailability(offer.available)}</span>
        </div>
        <div className="flex items-center justify-end gap-4">
          <div className="text-right leading-tight">
            <span className="block text-[15px] font-bold text-ink">
              {formatEuro(offer.price)}
            </span>
            <span className="block text-[11px] text-muted">per ticket</span>
          </div>
          <Button
            asChild
            size="sm"
            className="h-9 shrink-0 rounded-md px-3.5 text-[12px] font-semibold"
          >
            <Link to={ticketsPath}>
              View tickets
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4 md:hidden">
        <div className="flex items-start justify-between gap-3">
          <PartnerWordmark name={offer.partnerName} />
          <button
            type="button"
            className={cn(
              'shrink-0 rounded-md p-1 text-muted-soft hover:text-brand',
              bookmarked && 'text-brand',
            )}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark offer'}
            aria-pressed={bookmarked}
            onClick={() => setBookmarked((v) => !v)}
          >
            <Bookmark
              className={cn('size-4', bookmarked && 'fill-current')}
              aria-hidden
            />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 text-[13px]">
          <div>
            <p className="font-medium text-ink">{offer.ticketType}</p>
            {offer.ticketDetail ? (
              <p className="text-[12px] text-muted">{offer.ticketDetail}</p>
            ) : null}
          </div>
          <div>
            <p className="font-medium text-ink">{offer.section}</p>
            {offer.sectionDetail ? (
              <p className="text-[12px] text-muted">{offer.sectionDetail}</p>
            ) : null}
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[13px]">
            <span
              className="size-2 shrink-0 rounded-full bg-success"
              aria-hidden
            />
            {formatAvailability(offer.available)}
          </div>
          <div className="text-right leading-tight">
            <span className="block text-base font-bold text-ink">
              {formatEuro(offer.price)}
            </span>
            <span className="block text-[11px] text-muted">per ticket</span>
          </div>
        </div>
        <Button asChild className="h-10 w-full rounded-md text-[13px]">
          <Link to={ticketsPath}>
            View tickets
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </Button>
      </div>
    </div>
  )
}
