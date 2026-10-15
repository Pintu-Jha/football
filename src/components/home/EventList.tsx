import { Clock, MapPin, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { HomeSectionHeader } from '@/components/home/HomeSectionHeader'
import type { HomeEventRow } from '@/data/homeContent'
import { cn } from '@/lib/utils'

export type EventListProps = {
  title: string
  icon?: LucideIcon
  rows: readonly HomeEventRow[]
  showFeaturedBadge?: boolean
  viewAllHref?: string
  className?: string
}

export function EventList({
  title,
  icon,
  rows,
  showFeaturedBadge = false,
  viewAllHref = '/football/premier-league',
  className,
}: EventListProps) {
  return (
    <div className={cn('flex min-w-0 flex-col', className)}>
      <HomeSectionHeader title={title} icon={icon} viewAllHref={viewAllHref} />

      <ul className="mt-4 overflow-hidden rounded-lg border border-border bg-white">
        {rows.map((row) => (
          <li key={row.id} className="border-b border-border last:border-b-0">
            <Link
              to={row.href}
              className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-muted"
            >
              <div className="w-10 shrink-0 text-center leading-none">
                <p className="text-[10px] font-semibold uppercase text-brand">
                  {row.month}
                </p>
                <p className="mt-1 text-[22px] font-bold text-ink">{row.day}</p>
                <p className="mt-1 text-[10px] text-muted">{row.weekday}</p>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2">
                  <p className="truncate text-[13px] font-semibold text-ink">
                    {row.title}
                  </p>
                  {showFeaturedBadge ? (
                    <span className="shrink-0 rounded bg-orange-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-orange-600">
                      Featured
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 flex min-w-0 items-center gap-1.5 text-[11px] text-muted">
                  <Clock className="size-3 shrink-0" aria-hidden />
                  <span className="shrink-0">{row.time}</span>
                  <MapPin className="ml-1.5 size-3 shrink-0" aria-hidden />
                  <span className="truncate">{row.venue}</span>
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-[14px] font-bold text-ink">{row.price}</p>
                <p className="mt-1 text-[11px] font-medium text-brand">
                  {row.availability}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
