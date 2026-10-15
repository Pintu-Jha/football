import { cva, type VariantProps } from 'class-variance-authority'
import { type ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
  {
    variants: {
      variant: {
        default: 'bg-surface-subtle text-ink',
        vip: 'bg-vip-soft text-amber-900',
        featured:
          'bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white',
        success: 'bg-success-soft text-success',
        brand: 'bg-brand-soft text-brand',
        muted: 'bg-surface-muted text-muted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeProps = ComponentPropsWithoutRef<'span'> &
  VariantProps<typeof badgeVariants>

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { badgeVariants }
