import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

export interface LogoProps {
  variant?: 'light' | 'dark'
  className?: string
  to?: string
}

/** Circular football mark — white ball + black panels (header); inverted on dark footer */
function SoccerBallIcon({
  className,
  variant,
}: {
  className?: string
  variant: 'light' | 'dark'
}) {
  const isLight = variant === 'light'
  const ball = isLight ? '#fff' : '#fff'
  const panel = isLight ? '#0B0B0F' : '#0B0B0F'
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-8 w-8 shrink-0', className)}
      aria-hidden
    >
      <circle
        cx="16"
        cy="16"
        r="15"
        fill={ball}
        stroke={isLight ? 'rgba(255,255,255,0.35)' : '#E8E8EC'}
        strokeWidth="1"
      />
      <path
        d="M16 6.2 21.8 10.4l-1.7 6.4h-8.2L10.2 10.4 16 6.2Z"
        fill={panel}
        fillOpacity={0.92}
      />
      <path
        d="M10.2 10.4 16 16.8 12.2 26.2 5.4 21.4l1.8-11Z"
        fill={panel}
        fillOpacity={0.72}
      />
      <path
        d="M21.8 10.4 26.6 21.4l-6.8 4.8L16 16.8l5.8-6.4Z"
        fill={panel}
        fillOpacity={0.72}
      />
      <path
        d="M12.2 16.8h7.6L16 26.2 12.2 16.8Z"
        fill={panel}
        fillOpacity={0.5}
      />
    </svg>
  )
}

export function Logo({
  variant = 'dark',
  className,
  to = '/',
}: LogoProps) {
  const isLight = variant === 'light'

  return (
    <Link
      to={to}
      className={cn(
        'group inline-flex items-center gap-2.5 transition-opacity hover:opacity-90',
        className,
      )}
      aria-label="Football Ticket Club home"
    >
      <SoccerBallIcon variant={variant} />
      <span
        className={cn(
          'font-bold leading-none tracking-tight',
          isLight ? 'text-white' : 'text-ink',
        )}
      >
        <span className="text-[15px] sm:text-base">Football</span>
        <span className="text-[15px] text-brand sm:text-base">TicketClub</span>
      </span>
    </Link>
  )
}
