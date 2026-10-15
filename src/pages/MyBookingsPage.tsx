import { Calendar, ChevronRight, MapPin, Ticket } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { Seo } from '@/components/seo/Seo'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Crest } from '@/components/ui/Crest'
import { getMatchBySlug } from '@/data/matches'
import { formatMatchDate, formatPrice } from '@/lib/format'
import { useAuthStore } from '@/store/authStore'
import { type Order, useBookingStore } from '@/store/bookingStore'

function byNewest(a: Order, b: Order): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}

function BookingCard({ order }: { order: Order }) {
  const match = getMatchBySlug(order.matchSlug)
  const date = formatMatchDate(order.datetime)

  return (
    <li>
      <article className="group relative rounded-xl border border-border bg-surface p-5 shadow-soft transition-shadow duration-base focus-within:shadow-card hover:shadow-card sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            {match ? (
              <div className="hidden shrink-0 items-center sm:flex">
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
                  className="-ml-3 ring-surface"
                />
              </div>
            ) : null}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="success">Confirmed</Badge>
                <span className="text-xs font-semibold tracking-wider text-muted">
                  {order.reference}
                </span>
              </div>
              <h2 className="mt-2 text-lg font-extrabold leading-snug text-ink">
                <Link
                  to={`/booking/confirmation/${order.id}`}
                  className="rounded after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-brand"
                >
                  {order.matchLabel}
                </Link>
              </h2>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                <li className="flex items-center gap-2">
                  <Calendar className="size-4 shrink-0 text-brand" aria-hidden />
                  {date.full} · {date.time}
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-brand" aria-hidden />
                  {order.venue}, {order.city}
                </li>
                <li className="flex items-center gap-2">
                  <Ticket className="size-4 shrink-0 text-brand" aria-hidden />
                  {order.quantity} × {order.ticketTitle}
                  {order.section ? ` · ${order.section}` : ''}
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border pt-4 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
            <div className="sm:text-right">
              <p className="text-xs text-muted">Total</p>
              <p className="text-xl font-extrabold text-ink">
                {formatPrice(order.total, order.displayCurrency)}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-hover">
              View booking
              <ChevronRight
                className="size-4 transition-transform duration-base group-hover:translate-x-0.5"
                aria-hidden
              />
            </span>
          </div>
        </div>
      </article>
    </li>
  )
}

function BookingGroup({
  title,
  orders,
}: {
  title: string
  orders: Order[]
}) {
  if (orders.length === 0) return null
  return (
    <section aria-label={title} className="mt-10 first:mt-0">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted">
        {title}{' '}
        <span className="font-semibold normal-case tracking-normal">
          ({orders.length})
        </span>
      </h2>
      <ul className="space-y-4">
        {orders.map((order) => (
          <BookingCard key={order.id} order={order} />
        ))}
      </ul>
    </section>
  )
}

export function MyBookingsPage() {
  const user = useAuthStore((s) => s.user)
  const allOrders = useBookingStore((s) => s.orders)
  // Captured once per visit: avoids calling an impure function during render.
  const [now] = useState(() => Date.now())
  const email = user?.email.toLowerCase()

  const { upcoming, past, total } = useMemo(() => {
    const mine = email
      ? allOrders.filter((o) => o.userEmail.toLowerCase() === email)
      : []
    const sorted = [...mine].sort(byNewest)
    return {
      upcoming: sorted.filter((o) => new Date(o.datetime).getTime() >= now),
      past: sorted.filter((o) => new Date(o.datetime).getTime() < now),
      total: sorted.length,
    }
  }, [allOrders, email, now])
  return (
    <>
      <Seo
        title="My bookings | FootballTicketClub"
        description="View your FootballTicketClub demo bookings and ticket confirmations."
      />

      <section className="bg-linear-to-br from-maroon-deep via-maroon to-brand pb-12 pt-28 text-white md:pb-14 md:pt-32">
        <div className="container-ftc">
          <p className="eyebrow text-white/80">Your account</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
            My bookings
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/85 md:text-base">
            {total === 0
              ? 'Your confirmed tickets will appear here.'
              : `${total} ${total === 1 ? 'booking' : 'bookings'} on ${user?.email ?? 'your account'}.`}
          </p>
        </div>
      </section>

      <section className="bg-surface-muted py-10 md:py-14">
        <div className="container-ftc">
        <div className="mx-auto max-w-4xl">
          {total === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-border bg-surface px-6 py-14 text-center shadow-soft">
              <span className="flex size-14 items-center justify-center rounded-full bg-brand-soft text-brand-hover">
                <Ticket className="size-7" aria-hidden />
              </span>
              <h2 className="mt-5 text-xl font-extrabold text-ink">
                No bookings yet
              </h2>
              <p className="mt-2 max-w-sm text-sm text-muted">
                When you book tickets they&apos;ll show up here, ready to view
                or print.
              </p>
              <Button asChild className="mt-6" size="lg">
                <Link to="/football/premier-league">Browse matches</Link>
              </Button>
            </div>
          ) : (
            <>
              <BookingGroup title="Upcoming" orders={upcoming} />
              <BookingGroup title="Past" orders={past} />
            </>
          )}
        </div>
        </div>
      </section>
    </>
  )
}
