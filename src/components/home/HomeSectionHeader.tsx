import { ArrowLeft, ArrowRight, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

export type HomeSectionHeaderProps = {
  title: string
  icon?: LucideIcon
  viewAllHref?: string
  viewAllLabel?: string
  onPrev?: () => void
  onNext?: () => void
  className?: string
}

export function HomeSectionHeader({
  title,
  icon: Icon,
  viewAllHref,
  viewAllLabel = 'View all',
  onPrev,
  onNext,
  className,
}: HomeSectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <h2 className="flex items-center gap-2 text-[20px] font-bold leading-tight tracking-[-0.01em] text-ink md:text-[24px]">
        {Icon ? <Icon className="size-5 text-brand md:size-6" aria-hidden /> : null}
        {title}
      </h2>
      <div className="flex shrink-0 items-center gap-4">
        {viewAllHref ? (
          <Link
            to={viewAllHref}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-brand transition-colors hover:text-brand-hover md:text-[13px]"
          >
            {viewAllLabel}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        ) : null}
        {onPrev || onNext ? (
          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              aria-label="Previous"
              onClick={onPrev}
              className="text-ink transition-colors hover:text-brand"
            >
              <ArrowLeft className="size-[18px]" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={onNext}
              className="text-ink transition-colors hover:text-brand"
            >
              <ArrowRight className="size-[18px]" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
