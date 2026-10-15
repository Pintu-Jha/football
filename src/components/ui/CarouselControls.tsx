import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export type CarouselControlsProps = {
  onPrev?: () => void
  onNext?: () => void
  prevDisabled?: boolean
  nextDisabled?: boolean
  className?: string
}

export function CarouselControls({
  onPrev,
  onNext,
  prevDisabled = false,
  nextDisabled = false,
  className,
}: CarouselControlsProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        type="button"
        aria-label="Previous slide"
        disabled={prevDisabled || !onPrev}
        onClick={onPrev}
        className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-ink transition-colors hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="size-5" aria-hidden />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        disabled={nextDisabled || !onNext}
        onClick={onNext}
        className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-ink transition-colors hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="size-5" aria-hidden />
      </button>
    </div>
  )
}
