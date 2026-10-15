import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export function CardArrow({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-full border border-white/70 text-white transition-colors duration-200 group-hover:border-brand group-hover:bg-brand',
        className,
      )}
      aria-hidden
    >
      <ArrowRight className="size-3.5" />
    </span>
  )
}
