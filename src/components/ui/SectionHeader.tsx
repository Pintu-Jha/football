import { type ReactNode } from 'react'

import { CarouselControls } from '@/components/ui/CarouselControls'
import { cn } from '@/lib/utils'

export type SectionHeaderProps = {
  title: string
  viewAllHref?: string
  viewAllLabel?: string
  onPrev?: () => void
  onNext?: () => void
  children?: ReactNode
  className?: string
}

export function SectionHeader({
  title,
  viewAllHref,
  viewAllLabel = 'View all',
  onPrev,
  onNext,
  children,
  className,
}: SectionHeaderProps) {
  const showControls = Boolean(onPrev ?? onNext ?? viewAllHref)

  return (
    <div
      data-reveal
      className={cn(
        'flex flex-wrap items-end justify-between gap-4',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
          {title}
        </h2>
        {children ? (
          <div className="mt-1 text-sm text-muted">{children}</div>
        ) : null}
      </div>

      {showControls ? (
        <div className="flex shrink-0 items-center gap-4">
          {viewAllHref ? (
            <a
              href={viewAllHref}
              className="text-sm font-semibold text-brand transition-colors hover:text-brand-hover"
            >
              {viewAllLabel} →
            </a>
          ) : null}
          {(onPrev ?? onNext) ? (
            <CarouselControls onPrev={onPrev} onNext={onNext} />
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
