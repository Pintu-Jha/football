import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type MutableRefObject,
  type Ref,
} from 'react'

import { useMagnetic } from '@/hooks/useMagnetic'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'rounded-full bg-brand font-semibold text-white hover:bg-brand-hover',
        secondary:
          'rounded-full border border-border-strong bg-surface font-semibold text-ink hover:bg-surface-muted',
        ghost:
          'rounded-full font-medium text-ink hover:bg-surface-subtle',
        'ghost-light':
          'rounded-full font-medium text-white hover:bg-white/10',
        'outline-light':
          'rounded-full border border-white/35 bg-transparent font-semibold text-white hover:bg-white/10',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export type ButtonProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /** Enable desktop magnetic pull (also via data-magnetic / class "magnetic"). */
    magnetic?: boolean
  }

function mergeRefs<T>(
  ...refs: Array<Ref<T> | undefined>
): (node: T | null) => void {
  return (node) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === 'function') {
        ref(node)
      } else {
        ;(ref as MutableRefObject<T | null>).current = node
      }
    }
  }
}

export const Button = forwardRef<ElementRef<'button'>, ButtonProps>(
  function Button(
    {
      className,
      variant,
      size,
      asChild = false,
      type = 'button',
      magnetic,
      ...props
    },
    forwardedRef,
  ) {
    const Comp = asChild ? Slot : 'button'
    const wantsMagnetic =
      Boolean(magnetic) ||
      Boolean(props['data-magnetic' as keyof typeof props]) ||
      Boolean(className?.includes('magnetic'))

    const magneticRef = useMagnetic<HTMLButtonElement>({
      enabled: wantsMagnetic,
    })

    return (
      <Comp
        {...(!asChild ? { type } : {})}
        ref={mergeRefs(
          forwardedRef,
          wantsMagnetic ? magneticRef : undefined,
        )}
        data-magnetic={wantsMagnetic ? '' : undefined}
        className={cn(
          buttonVariants({ variant, size }),
          wantsMagnetic && 'will-change-transform',
          className,
        )}
        {...props}
      />
    )
  },
)

export { buttonVariants }
