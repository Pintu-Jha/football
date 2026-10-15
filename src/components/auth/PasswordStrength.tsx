import { Check, Circle } from 'lucide-react'
import { useId } from 'react'

import { getPasswordChecks } from '@/components/auth/authUtils'
import { cn } from '@/lib/utils'
import { PASSWORD_MIN_LENGTH } from '@/store/authStore'

const LEVELS = ['Weak', 'Fair', 'Good', 'Strong'] as const
const SEGMENT_COLORS = [
  'bg-brand',
  'bg-vip',
  'bg-seat-cat2',
  'bg-success',
] as const

export interface PasswordStrengthProps {
  password: string
  className?: string
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const id = useId()
  const checks = getPasswordChecks(password)
  const empty = password.length === 0

  // 0..4 points: length, letter+number, symbol, long (12+)
  const points =
    (checks.length ? 1 : 0) +
    (checks.letter && checks.number ? 1 : 0) +
    (checks.symbol ? 1 : 0) +
    (password.length >= 12 ? 1 : 0)
  const filled = empty ? 0 : Math.max(1, points)
  const level = LEVELS[Math.max(0, filled - 1)] ?? LEVELS[0]
  const color = SEGMENT_COLORS[Math.max(0, filled - 1)] ?? SEGMENT_COLORS[0]

  const items: ReadonlyArray<{ key: string; label: string; met: boolean; optional?: boolean }> = [
    { key: 'length', label: `${PASSWORD_MIN_LENGTH}+ characters`, met: checks.length },
    { key: 'letter', label: 'A letter', met: checks.letter },
    { key: 'number', label: 'A number', met: checks.number },
    { key: 'symbol', label: 'A symbol (optional)', met: checks.symbol, optional: true },
  ]

  return (
    <div className={cn('space-y-2.5', className)}>
      <div className="flex items-center gap-3">
        <div
          className="grid flex-1 grid-cols-4 gap-1.5"
          role="img"
          aria-label={empty ? 'Password strength: not set' : `Password strength: ${level}`}
        >
          {[0, 1, 2, 3].map((index) => (
            <span
              key={index}
              className={cn(
                'h-1.5 rounded-full transition-colors duration-200',
                index < filled ? color : 'bg-surface-subtle',
              )}
            />
          ))}
        </div>
        <span
          className={cn(
            'w-14 text-right text-xs font-semibold',
            empty ? 'text-muted-soft' : 'text-ink',
          )}
        >
          {empty ? '' : level}
        </span>
      </div>

      <p id={`${id}-live`} className="sr-only" aria-live="polite">
        {empty ? '' : `Password strength: ${level}`}
      </p>

      <ul className="grid grid-cols-2 gap-x-3 gap-y-1" aria-label="Password requirements">
        {items.map((item) => (
          <li
            key={item.key}
            className={cn(
              'flex items-center gap-1.5 text-xs transition-colors',
              item.met ? 'text-success' : 'text-muted',
            )}
          >
            {item.met ? (
              <Check className="size-3.5 shrink-0" aria-hidden />
            ) : (
              <Circle className="size-3.5 shrink-0 opacity-50" aria-hidden />
            )}
            <span>
              {item.label}
              <span className="sr-only">{item.met ? ' – done' : ' – not yet'}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
