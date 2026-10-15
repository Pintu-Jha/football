import { Crest } from '@/components/ui/Crest'
import { getTeamCrest } from '@/data/crests'
import { cn } from '@/lib/utils'

export type TeamCrestProps = {
  name: string
  initials: string
  color: string
  size?: number
  className?: string
}

export function TeamCrest({
  name,
  initials,
  color,
  size = 40,
  className,
}: TeamCrestProps) {
  const src = getTeamCrest(name)
  if (src) {
    return (
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        className={cn('shrink-0 object-contain', className)}
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <Crest
      initials={initials}
      color={color}
      size={size >= 48 ? 'lg' : size >= 36 ? 'md' : 'sm'}
      className={className}
    />
  )
}
