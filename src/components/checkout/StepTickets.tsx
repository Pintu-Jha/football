import { Minus, Plus, Smartphone } from 'lucide-react'
import { useId } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  type CheckoutItem,
  MAX_TICKETS_PER_ORDER,
} from '@/data/checkout'
import { formatPrice } from '@/lib/format'
import type { CurrencyCode } from '@/store/uiStore'

const LOW_STOCK_THRESHOLD = 10

export interface StepTicketsProps {
  item: CheckoutItem
  quantity: number
  currency: CurrencyCode
  onQuantityChange: (quantity: number) => void
  onContinue: () => void
}

export function StepTickets({
  item,
  quantity,
  currency,
  onQuantityChange,
  onContinue,
}: StepTicketsProps) {
  const labelId = useId()
  const limitId = useId()
  const atMin = quantity <= 1
  const atMax = quantity >= item.maxQuantity
  const lowStock = item.available <= LOW_STOCK_THRESHOLD

  let limitNote: string | null = null
  if (atMax) {
    limitNote =
      item.maxQuantity < MAX_TICKETS_PER_ORDER
        ? `That's all that's available — ${item.available} left.`
        : `Maximum ${MAX_TICKETS_PER_ORDER} tickets per order.`
  }

  return (
    <div className="space-y-5">
      <section
        aria-labelledby={`${labelId}-ticket`}
        className="rounded-xl border border-border bg-surface p-5 shadow-soft sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2
              id={`${labelId}-ticket`}
              className="flex items-center gap-2 text-lg font-extrabold text-ink"
            >
              {item.categoryColor ? (
                <span
                  aria-hidden
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: item.categoryColor }}
                />
              ) : null}
              {item.title}
            </h2>
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
          <div className="text-right">
            <p className="text-xl font-extrabold text-ink">
              {formatPrice(item.unitPrice, currency)}
            </p>
            <p className="text-xs text-muted">per ticket</p>
          </div>
        </div>
        {lowStock ? (
          <Badge variant="vip" className="mt-4">
            Only {item.available} left
          </Badge>
        ) : null}
      </section>

      <section
        aria-labelledby={labelId}
        className="rounded-xl border border-border bg-surface p-5 shadow-soft sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 id={labelId} className="text-base font-bold text-ink">
              Number of tickets
            </h2>
            <p className="mt-0.5 text-sm text-muted">
              Choose up to {item.maxQuantity}.
            </p>
          </div>
          <div
            role="group"
            aria-labelledby={labelId}
            aria-describedby={limitNote ? limitId : undefined}
            className="flex items-center gap-1 rounded-full border border-border-strong p-1"
          >
            <button
              type="button"
              onClick={() => onQuantityChange(quantity - 1)}
              disabled={atMin}
              aria-label="Decrease ticket quantity"
              className="flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-muted-soft disabled:hover:bg-transparent"
            >
              <Minus className="size-4" aria-hidden />
            </button>
            <output
              aria-live="polite"
              aria-label={`${quantity} ${quantity === 1 ? 'ticket' : 'tickets'} selected`}
              className="min-w-10 text-center text-lg font-extrabold tabular-nums text-ink"
            >
              {quantity}
            </output>
            <button
              type="button"
              onClick={() => onQuantityChange(quantity + 1)}
              disabled={atMax}
              aria-label="Increase ticket quantity"
              className="flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-muted-soft disabled:hover:bg-transparent"
            >
              <Plus className="size-4" aria-hidden />
            </button>
          </div>
        </div>
        {limitNote ? (
          <p id={limitId} className="mt-3 text-sm font-medium text-muted">
            {limitNote}
          </p>
        ) : null}
      </section>

      <section className="flex items-start gap-3 rounded-xl border border-border bg-surface-muted p-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-ink shadow-soft">
          <Smartphone className="size-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-sm font-bold text-ink">Delivery</h2>
          <p className="mt-0.5 text-sm text-muted">
            {item.eTicket
              ? 'Mobile e-ticket delivered after payment.'
              : 'Delivery details are sent to your email after payment.'}
          </p>
        </div>
      </section>

      <div className="flex justify-end pt-1">
        <Button size="lg" className="w-full sm:w-auto" onClick={onContinue}>
          Continue to your details
        </Button>
      </div>
    </div>
  )
}
