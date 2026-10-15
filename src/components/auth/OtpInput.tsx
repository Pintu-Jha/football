import {
  type ClipboardEvent,
  type KeyboardEvent,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'

import { cn } from '@/lib/utils'
import { OTP_LENGTH } from '@/store/authStore'

export interface OtpInputHandle {
  focusFirst: () => void
}

export interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  /** Fired once every box is filled. */
  onComplete?: (code: string) => void
  /** id of the element that labels the group. */
  labelledBy: string
  describedBy?: string
  disabled?: boolean
  hasError?: boolean
  length?: number
  className?: string
}

function digitsOnly(input: string): string {
  return input.replace(/\D/g, '')
}

export const OtpInput = forwardRef<OtpInputHandle, OtpInputProps>(
  function OtpInput(
    {
      value,
      onChange,
      onComplete,
      labelledBy,
      describedBy,
      disabled = false,
      hasError = false,
      length = OTP_LENGTH,
      className,
    },
    ref,
  ) {
    const inputs = useRef<Array<HTMLInputElement | null>>([])

    const focusAt = (index: number) => {
      const clamped = Math.min(Math.max(index, 0), length - 1)
      const el = inputs.current[clamped]
      if (el) {
        el.focus()
        el.select()
      }
    }

    useImperativeHandle(ref, () => ({ focusFirst: () => focusAt(0) }))

    const commit = (next: string) => {
      const trimmed = next.slice(0, length)
      if (trimmed === value) return
      onChange(trimmed)
      if (trimmed.length === length) onComplete?.(trimmed)
    }

    const handleChange = (index: number, raw: string) => {
      let digits = digitsOnly(raw)
      if (digits.length === 0) return

      // Typed into a box that already held a digit without it being selected.
      const existing = value.charAt(index)
      if (digits.length === 2 && existing && digits.includes(existing)) {
        digits = digits.replace(existing, '')
      }

      if (digits.length > 1) {
        // Browser autofill / multi-char input: spread from this box.
        const base = value.slice(0, index)
        const next = (base + digits).slice(0, length)
        commit(next)
        focusAt(next.length >= length ? length - 1 : next.length)
        return
      }

      const next =
        index < value.length
          ? value.slice(0, index) + digits + value.slice(index + 1)
          : value + digits
      commit(next)
      focusAt(index + 1)
    }

    const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
      switch (event.key) {
        case 'Backspace': {
          event.preventDefault()
          if (index < value.length) {
            onChange(value.slice(0, index) + value.slice(index + 1))
            focusAt(index)
          } else if (index > 0) {
            onChange(value.slice(0, index - 1) + value.slice(index))
            focusAt(index - 1)
          }
          break
        }
        case 'Delete': {
          event.preventDefault()
          if (index < value.length) {
            onChange(value.slice(0, index) + value.slice(index + 1))
          }
          break
        }
        case 'ArrowLeft':
          event.preventDefault()
          focusAt(index - 1)
          break
        case 'ArrowRight':
          event.preventDefault()
          focusAt(index + 1)
          break
        case 'Home':
          event.preventDefault()
          focusAt(0)
          break
        case 'End':
          event.preventDefault()
          focusAt(length - 1)
          break
        default:
          break
      }
    }

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault()
      const digits = digitsOnly(event.clipboardData.getData('text')).slice(0, length)
      if (digits.length === 0) return
      commit(digits)
      focusAt(digits.length >= length ? length - 1 : digits.length)
    }

    return (
      <div
        role="group"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        className={cn('flex justify-between gap-2 sm:gap-3', className)}
      >
        {Array.from({ length }, (_, index) => {
          const digit = value.charAt(index)
          return (
            <input
              key={index}
              ref={(el) => {
                inputs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              aria-label={`Digit ${index + 1} of ${length}`}
              aria-invalid={hasError || undefined}
              disabled={disabled}
              value={digit}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={handlePaste}
              onFocus={(event) => event.target.select()}
              className={cn(
                'h-14 min-w-0 flex-1 rounded-xl border bg-surface text-center text-xl font-bold text-ink outline-none transition-[border-color,box-shadow] duration-150 sm:h-16 sm:text-2xl',
                'focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand',
                'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60',
                hasError
                  ? 'border-brand bg-brand-soft/40'
                  : digit
                    ? 'border-ink/60'
                    : 'border-border-strong',
              )}
            />
          )
        })}
      </div>
    )
  },
)
