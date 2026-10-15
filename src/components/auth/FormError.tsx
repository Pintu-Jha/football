import { AlertCircle } from 'lucide-react'
import { forwardRef, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface FormErrorProps {
  children: ReactNode
  className?: string
}

/** Form-level error banner (announced to assistive tech). */
export const FormError = forwardRef<HTMLDivElement, FormErrorProps>(
  function FormError({ children, className }, ref) {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'flex items-start gap-2.5 rounded-xl border border-brand/30 bg-brand-soft px-4 py-3 text-sm font-medium text-brand-hover',
          className,
        )}
      >
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>{children}</span>
      </div>
    )
  },
)
