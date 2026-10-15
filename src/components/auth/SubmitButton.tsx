import { Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export interface SubmitButtonProps {
  children: ReactNode
  loading?: boolean
  loadingLabel?: string
  disabled?: boolean
  className?: string
}

export function SubmitButton({
  children,
  loading = false,
  loadingLabel = 'Please wait\u2026',
  disabled = false,
  className,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn('w-full', className)}
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
