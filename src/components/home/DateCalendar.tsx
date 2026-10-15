import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function parseISODate(value: string | null): Date | null {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

export function formatSelectedDate(iso: string | null): string {
  const d = parseISODate(iso)
  if (!d) return ''
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function buildMonthGrid(view: Date): Array<{ date: Date; inMonth: boolean }> {
  const year = view.getFullYear()
  const month = view.getMonth()
  const first = new Date(year, month, 1)
  // Monday-based: JS getDay() Sun=0 → shift
  const startOffset = (first.getDay() + 6) % 7
  const gridStart = new Date(year, month, 1 - startOffset)

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + i,
    )
    return { date, inMonth: date.getMonth() === month }
  })
}

export type DateCalendarProps = {
  value: string | null
  onChange: (iso: string | null) => void
  onClose?: () => void
  /** Label for the clear action (default: “Any date”) */
  clearLabel?: string
}

export function DateCalendar({
  value,
  onChange,
  onClose,
  clearLabel = 'Any date',
}: DateCalendarProps) {
  const selected = parseISODate(value)
  const today = useMemo(() => startOfDay(new Date()), [])
  const [view, setView] = useState(() => selected ?? today)

  const cells = useMemo(() => buildMonthGrid(view), [view])
  const monthLabel = view.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

  function shiftMonth(delta: number) {
    setView((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1))
  }

  function pick(date: Date) {
    onChange(toISODate(date))
    onClose?.()
  }

  return (
    <div
      className="w-[min(100vw-2rem,20rem)] rounded-2xl border border-border bg-white p-4 shadow-lift"
      data-lenis-prevent
    >
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <p className="text-sm font-bold tracking-tight text-ink">{monthLabel}</p>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label="Next month"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <span
            key={d}
            className="flex h-8 items-center justify-center text-[11px] font-semibold uppercase tracking-wide text-muted-soft"
          >
            {d}
          </span>
        ))}

        {cells.map(({ date, inMonth }) => {
          const isToday = sameDay(date, today)
          const isSelected = selected ? sameDay(date, selected) : false
          const isPast = date < today

          return (
            <button
              key={toISODate(date)}
              type="button"
              disabled={isPast}
              onClick={() => pick(date)}
              className={cn(
                'relative flex h-9 items-center justify-center rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                !inMonth && 'text-muted-soft/50',
                inMonth && !isSelected && !isPast && 'text-ink hover:bg-brand-soft',
                isPast && 'cursor-not-allowed text-muted-soft/40',
                isToday && !isSelected && 'ring-1 ring-brand/40',
                isSelected && 'bg-brand text-white shadow-soft hover:bg-brand-hover',
              )}
              aria-label={date.toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              aria-pressed={isSelected}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted"
          onClick={() => {
            onChange(null)
            onClose?.()
          }}
        >
          {clearLabel}
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            pick(today)
          }}
        >
          Today
        </Button>
      </div>
    </div>
  )
}
