import * as LabelPrimitive from '@radix-ui/react-label'
import { AlertCircle } from 'lucide-react'
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type ReactNode,
} from 'react'

import { cn } from '@/lib/utils'

export interface FormFieldProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'id' | 'className'> {
  id: string
  label: string
  error?: string | undefined
  hint?: string
  /** Rendered inside the input on the right (e.g. a brand badge). */
  trailing?: ReactNode
  className?: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField(
    { id, label, error, hint, trailing, className, required, ...inputProps },
    ref,
  ) {
    const hintId = `${id}-hint`
    const errorId = `${id}-error`
    const describedBy =
      [hint ? hintId : null, error ? errorId : null]
        .filter(Boolean)
        .join(' ') || undefined

    return (
      <div className={className}>
        <LabelPrimitive.Root
          htmlFor={id}
          className="mb-1.5 block text-sm font-semibold text-ink"
        >
          {label}
          {required ? (
            <span className="text-brand-hover" aria-hidden>
              {' '}
              *
            </span>
          ) : null}
        </LabelPrimitive.Root>
        <div className="relative">
          <input
            ref={ref}
            id={id}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              'h-12 w-full rounded-lg border bg-surface px-3.5 text-base text-ink placeholder:text-muted-soft transition-colors duration-fast',
              'focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30',
              error ? 'border-brand-hover' : 'border-border-strong',
              trailing ? 'pr-24' : null,
            )}
            {...inputProps}
          />
          {trailing ? (
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              {trailing}
            </div>
          ) : null}
        </div>
        {hint ? (
          <p id={hintId} className="mt-1.5 text-xs text-muted">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-brand-hover"
          >
            <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden />
            {error}
          </p>
        ) : null}
      </div>
    )
  },
)
