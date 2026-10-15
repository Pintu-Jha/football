import { cn } from '@/lib/utils'

const sizeClasses = {
  sm: 'size-8 text-[10px]',
  md: 'size-10 text-xs',
  lg: 'size-14 text-sm',
} as const

export type CrestSize = keyof typeof sizeClasses

export type CrestProps = {
  initials: string
  color: string
  size?: CrestSize
  className?: string
}

export function Crest({
  initials,
  color,
  size = 'md',
  className,
}: CrestProps) {
  const display = initials.slice(0, 3).toUpperCase()

  return (
    <span
      role="img"
      aria-label={`${display} crest placeholder`}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white shadow-soft ring-2 ring-white/20',
        sizeClasses[size],
        className,
      )}
      style={{ backgroundColor: color }}
    >
      {display}
    </span>
  )
}
