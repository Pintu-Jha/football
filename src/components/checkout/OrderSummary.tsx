import {
  Calendar,
  ChevronDown,
  Clock,
  MapPin,
  Smartphone,
  Ticket,
} from 'lucide-react'
import { useId, useState } from 'react'

import { AnimatedPrice } from '@/components/checkout/AnimatedPrice'
import type { CheckoutHold } from '@/components/checkout/useCheckoutHold'
import { Crest } from '@/components/ui/Crest'
import {
  type CheckoutItem,
  computeTotals,
  SERVICE_FEE_RATE,
} from '@/data/checkout'
import { formatMatchDate, formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { CurrencyCode } from '@/store/uiStore'

export interface OrderSummaryProps {
  item: CheckoutItem
  quantity: number
  currency: CurrencyCode
  hold: CheckoutHold
  className?: string
}

function HoldTimer({ hold }: { hold: CheckoutHold }) {
  return (
    <>
      <div
        className={cn(
          'flex items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors duration-base',
          hold.urgent
            ? 'bg-brand-soft text-brand-hover'
            : 'bg-surface-muted text-ink',
        )}
      >
        <span className="flex items-center gap-2 font-medium">
          <Clock className="size-4 shrink-0" aria-hidden />
          Tickets reserved for
        </span>
        <span
          role="timer"
          aria-label={`Time left: ${hold.formatted}`}
          className="text-base font-bold tabular-nums"
        >
          {hold.formatted}
        </span>
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {hold.announcement}
      </p>
    </>
  )
}

export function OrderSummary({
  item,
  quantity,
  currency,
  hold,
  className,
}: OrderSummaryProps) {
  const [open, setOpen] = useState(false)
  const detailsId = useId()
  const { match } = item
  const date = formatMatchDate(match.datetime)
  const totals = computeTotals(item.unitPrice, quantity)
  const feePercent = Math.round(SERVICE_FEE_RATE * 100)

  return (
    <aside
      aria-label="Order summary"
      className={cn(
        'rounded-xl border border-border bg-surface shadow-card',
        className,
      )}
    >
      {/* Mobile: collapsible summary bar */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={detailsId}
        className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 lg:hidden"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Ticket className="size-4 text-brand" aria-hidden />
          Order summary
          <ChevronDown
            className={cn(
              'size-4 text-muted transition-transform duration-base',
              open && 'rotate-180',
            )}
            aria-hidden
          />
        </span>
        <span className="flex items-baseline gap-1.5">
          <span className="text-xs text-muted">Total</span>
          <AnimatedPrice
            amountEur={totals.total}
            currency={currency}
            className="text-base font-extrabold text-ink"
          />
        </span>
      </button>

      <div className="px-4 pb-4 lg:p-6">
        <h2 className="hidden text-lg font-extrabold text-ink lg:block">
          Order summary
        </h2>

        <div className="lg:mt-4">
          <HoldTimer hold={hold} />
        </div>

        <div
          id={detailsId}
          className={cn('mt-5', open ? 'block' : 'hidden', 'lg:block')}
        >
          <div className="flex items-center gap-3">
            <Crest
              initials={match.homeInitials}
              color={match.homeColor}
              size="md"
              className="ring-border"
            />
            <Crest
              initials={match.awayInitials}
              color={match.awayColor}
              size="md"
              className="-ml-5 ring-surface"
            />
            <div className="min-w-0">
              <p className="eyebrow text-brand-hover">
                {match.competitionName}
              </p>
              <p className="mt-0.5 text-sm font-bold leading-snug text-ink">
                {match.homeTeam} vs {match.awayTeam}
              </p>
            </div>
          </div>

          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li className="flex items-start gap-2">
              <Calendar className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
              <span>
                {date.full} · {date.time}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
              <span>
                {match.venue}, {match.city}
              </span>
            </li>
          </ul>

          <hr className="my-5 border-border" />

          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-ink">
              {item.categoryColor ? (
                <span
                  aria-hidden
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.categoryColor }}
                />
              ) : null}
              {item.title}
            </p>
            <p className="mt-1 text-sm text-muted">
              {item.section}
              {item.categoryLabel ? ` · ${item.categoryLabel}` : ''}
            </p>
            {item.source === 'partner' && item.partnerName ? (
              <p className="mt-1 text-sm font-medium text-ink">
                Offer from {item.partnerName}
              </p>
            ) : null}
          </div>

          <dl className="mt-5 space-y-2.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Quantity</dt>
              <dd className="font-semibold text-ink">
                {quantity} {quantity === 1 ? 'ticket' : 'tickets'}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Price per ticket</dt>
              <dd className="font-semibold text-ink">
                {formatPrice(item.unitPrice, currency)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-semibold text-ink">
                <AnimatedPrice amountEur={totals.subtotal} currency={currency} />
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Service fee ({feePercent}%)</dt>
              <dd className="font-semibold text-ink">
                <AnimatedPrice amountEur={totals.serviceFee} currency={currency} />
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-border pt-4">
              <dt className="text-base font-extrabold text-ink">Total</dt>
              <dd className="text-xl font-extrabold text-ink">
                <AnimatedPrice amountEur={totals.total} currency={currency} />
              </dd>
            </div>
          </dl>

          <p className="mt-4 flex items-start gap-2 rounded-lg bg-surface-muted px-3 py-2.5 text-xs leading-relaxed text-muted">
            <Smartphone className="mt-0.5 size-4 shrink-0 text-ink" aria-hidden />
            {item.eTicket
              ? 'Mobile e-ticket delivered to your email after payment.'
              : 'Ticket delivery details are sent to your email after payment.'}
          </p>
        </div>
      </div>
    </aside>
  )
}
