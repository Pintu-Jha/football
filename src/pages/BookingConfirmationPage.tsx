import {
  Calendar,
  Home,
  MapPin,
  Printer,
  SearchX,
  Ticket,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'

import { AnimatedCheck } from '@/components/checkout/AnimatedCheck'
import { CheckoutNotice } from '@/components/checkout/CheckoutNotice'
import { PseudoQr } from '@/components/checkout/PseudoQr'
import { Seo } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { Crest } from '@/components/ui/Crest'
import { getMatchBySlug } from '@/data/matches'
import { formatMatchDate, formatPrice } from '@/lib/format'
import { useAuthStore } from '@/store/authStore'
import { type Order, useBookingStore } from '@/store/bookingStore'

function paymentLabel(payment: Order['payment']): string {
  if (payment.method === 'paypal') return 'PayPal'
  if (payment.method === 'applepay') return 'Apple Pay'
  const brand = payment.brand ?? 'Card'
  return payment.last4 ? `${brand} •••• ${payment.last4}` : brand
}

function TicketField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <dt className="eyebrow text-muted">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-ink">{children}</dd>
    </div>
  )
}

export function BookingConfirmationPage() {
  const { orderId = '' } = useParams()
  const user = useAuthStore((s) => s.user)
  const order = useBookingStore((s) => s.orders.find((o) => o.id === orderId))

  const owned =
    order !== undefined &&
    user !== null &&
    order.userEmail.toLowerCase() === user.email.toLowerCase()

  if (!order || !owned) {
    return (
      <>
        <Seo
          title="Booking not found | FootballTicketClub"
          description="We couldn't find that booking on your account."
        />
        <div className="pt-24">
          <CheckoutNotice
            icon={SearchX}
            title="We couldn't find that booking"
            message="It may belong to a different account, or the link is incorrect. Your bookings are listed in your account."
            actionLabel="View my bookings"
            actionTo="/account/bookings"
          />
        </div>
      </>
    )
  }

  const match = getMatchBySlug(order.matchSlug)
  const date = formatMatchDate(order.datetime)
  const currency = order.displayCurrency
  const feePercent =
    order.subtotal > 0
      ? Math.round((order.serviceFee / order.subtotal) * 100)
      : 0

  return (
    <>
      <Seo
        title={`Booking confirmed ${order.reference} | FootballTicketClub`}
        description={`Your booking for ${order.matchLabel} is confirmed.`}
      />

      <section className="bg-linear-to-br from-maroon-deep via-maroon to-brand pb-12 pt-28 text-center text-white md:pb-16 md:pt-32 print:bg-none print:pb-6 print:pt-6 print:text-ink">
        <div className="container-ftc flex flex-col items-center">
          <AnimatedCheck className="text-white print:text-success" />
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight md:text-5xl">
            Booking confirmed
          </h1>
          <p className="eyebrow mt-6 text-white/80 print:text-muted">
            Booking reference
          </p>
          <p className="mt-2 text-3xl font-extrabold tracking-[0.14em] md:text-5xl">
            {order.reference}
          </p>
          <p className="mt-5 max-w-xl text-sm text-white/85 print:text-muted">
            A confirmation was sent to{' '}
            <strong className="font-semibold text-white print:text-ink">
              {order.buyer.email}
            </strong>{' '}
            (demo).
          </p>
        </div>
      </section>

      <section className="bg-surface-muted py-10 md:py-14">
        <div className="container-ftc grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
          {/* Ticket */}
          <article
            aria-label={`Ticket for ${order.matchLabel}`}
            className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card md:flex-row"
          >
            <div className="flex-1 p-6 sm:p-8">
              <p className="eyebrow text-brand-hover">
                {order.competitionName}
              </p>
              <div className="mt-4 flex items-center gap-4">
                {match ? (
                  <div className="flex shrink-0 items-center">
                    <Crest
                      initials={match.homeInitials}
                      color={match.homeColor}
                      size="lg"
                      className="ring-border"
                    />
                    <Crest
                      initials={match.awayInitials}
                      color={match.awayColor}
                      size="lg"
                      className="-ml-4 ring-surface"
                    />
                  </div>
                ) : null}
                <h2 className="text-xl font-extrabold leading-tight text-ink sm:text-2xl">
                  {order.matchLabel}
                </h2>
              </div>

              <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5">
                <TicketField label="Date & time">
                  <span className="flex items-start gap-1.5">
                    <Calendar
                      className="mt-0.5 size-4 shrink-0 text-brand"
                      aria-hidden
                    />
                    <span>
                      {date.full}
                      <br />
                      {date.time}
                    </span>
                  </span>
                </TicketField>
                <TicketField label="Venue">
                  <span className="flex items-start gap-1.5">
                    <MapPin
                      className="mt-0.5 size-4 shrink-0 text-brand"
                      aria-hidden
                    />
                    <span>
                      {order.venue}
                      <br />
                      {order.city}
                    </span>
                  </span>
                </TicketField>
                <TicketField label="Section">{order.section}</TicketField>
                <TicketField label="Ticket">{order.ticketTitle}</TicketField>
                <TicketField label="Quantity">
                  {order.quantity} {order.quantity === 1 ? 'ticket' : 'tickets'}
                </TicketField>
                <TicketField label="Ticket holder">
                  {order.buyer.fullName}
                </TicketField>
              </dl>
            </div>

            {/* Perforated edge */}
            <div
              aria-hidden
              className="relative h-0 border-t-2 border-dashed border-border-strong md:h-auto md:w-0 md:border-l-2 md:border-t-0"
            >
              <span className="absolute -left-3 -top-3 size-6 rounded-full bg-surface-muted" />
              <span className="absolute -right-3 -top-3 size-6 rounded-full bg-surface-muted md:-bottom-3 md:-left-3 md:right-auto md:top-auto" />
            </div>

            {/* Stub */}
            <div className="flex flex-col items-center justify-center gap-3 bg-surface-muted/60 p-6 text-center md:w-56 md:p-8">
              <PseudoQr reference={order.reference} />
              <p className="text-xs text-muted">
                Placeholder graphic — not a scannable code.
              </p>
              <p className="flex items-center gap-1.5 text-sm font-bold tracking-wider text-ink">
                <Ticket className="size-4 text-brand" aria-hidden />
                {order.reference}
              </p>
            </div>
          </article>

          {/* Payment + actions */}
          <div className="space-y-5">
            <section
              aria-labelledby="payment-summary-heading"
              className="rounded-xl border border-border bg-surface p-6 shadow-soft"
            >
              <h2
                id="payment-summary-heading"
                className="text-lg font-extrabold text-ink"
              >
                Payment summary
              </h2>
              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Paid with</dt>
                  <dd className="font-semibold text-ink">
                    {paymentLabel(order.payment)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">
                    {order.quantity} × {formatPrice(order.unitPrice, currency)}
                  </dt>
                  <dd className="font-semibold text-ink">
                    {formatPrice(order.subtotal, currency)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Service fee ({feePercent}%)</dt>
                  <dd className="font-semibold text-ink">
                    {formatPrice(order.serviceFee, currency)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-border pt-4">
                  <dt className="text-base font-extrabold text-ink">
                    Total paid
                  </dt>
                  <dd className="text-xl font-extrabold text-ink">
                    {formatPrice(order.total, currency)}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-muted">
                Shown in {currency}. Demo order — no real payment was taken.
              </p>
            </section>

            {order.source === 'partner' && order.partnerName ? (
              <p className="rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed text-muted">
                Demo flow: in production you would complete this purchase on{' '}
                {order.partnerName}&apos;s site.
              </p>
            ) : null}

            <div className="no-print flex flex-col gap-3">
              <Button size="lg" onClick={() => window.print()}>
                <Printer className="size-4" aria-hidden />
                Print ticket
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link to="/account/bookings">
                  <Ticket className="size-4" aria-hidden />
                  View my bookings
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link to="/">
                  <Home className="size-4" aria-hidden />
                  Back to home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
