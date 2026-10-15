import { AlertCircle, type LucideIcon } from 'lucide-react'
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
  useId,
} from 'react'

import { cn } from '@/lib/utils'

export interface TextFieldProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'className'> {
  label: string
  error?: string | null
  hint?: ReactNode
  /** Left icon (decorative). */
  icon?: LucideIcon
  /** Right-aligned slot inside the input (e.g. password toggle). */
  trailing?: ReactNode
  className?: string
  inputClassName?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      label,
      error,
      hint,
      icon: Icon,
      trailing,
      className,
      inputClassName,
      id,
      type = 'text',
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) {
    const autoId = useId()
    const inputId = id ?? `${autoId}-input`
    const hintId = `${inputId}-hint`
    const errorId = `${inputId}-error`
    const hasError = Boolean(error)

    const describedBy =
      [ariaDescribedBy, hint ? hintId : undefined, hasError ? errorId : undefined]
        .filter(Boolean)
        .join(' ') || undefined

    return (
      <div className={cn('space-y-1.5', className)}>
        <label htmlFor={inputId} className="block text-sm font-semibold text-ink">
          {label}
        </label>
        <div className="relative">
          {Icon ? (
            <Icon
              className="pointer-events-none absolute left-3.5 top-1/2 size-[1.125rem] -translate-y-1/2 text-muted-soft"
              aria-hidden
            />
          ) : null}
          <input
            ref={ref}
            id={inputId}
            type={type}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={cn(
              'h-12 w-full rounded-xl border bg-surface text-[0.9375rem] text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-soft',
              'focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand',
              'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60',
              Icon ? 'pl-11' : 'pl-4',
              trailing ? 'pr-12' : 'pr-4',
              hasError ? 'border-brand bg-brand-soft/30' : 'border-border-strong',
              inputClassName,
            )}
            {...props}
          />
          {trailing ? (
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
              {trailing}
            </div>
          ) : null}
        </div>
        {hint ? (
          <p id={hintId} className="text-xs text-muted">
            {hint}
          </p>
        ) : null}
        <div aria-live="polite">
          {hasError ? (
            <p
              id={errorId}
              role="alert"
              className="flex items-start gap-1.5 text-xs font-medium text-brand"
            >
              <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden />
              <span>{error}</span>
            </p>
          ) : null}
        </div>
      </div>
    )
  },
)
