import { type ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

export type LazyImageProps = Omit<
  ComponentPropsWithoutRef<'img'>,
  'loading' | 'decoding'
> & {
  aspectRatio?: `${number}/${number}` | `${number}` | number
  wrapperClassName?: string
}

export function LazyImage({
  className,
  aspectRatio,
  wrapperClassName,
  alt,
  ...props
}: LazyImageProps) {
  const img = (
    <img
      loading="lazy"
      decoding="async"
      alt={alt}
      className={cn(
        'block h-full w-full object-cover',
        !aspectRatio && className,
      )}
      {...props}
    />
  )

  if (!aspectRatio) {
    return img
  }

  const ratioStyle =
    typeof aspectRatio === 'number'
      ? { aspectRatio: String(aspectRatio) }
      : { aspectRatio }

  return (
    <div
      className={cn('relative overflow-hidden', wrapperClassName)}
      style={ratioStyle}
    >
      <img
        loading="lazy"
        decoding="async"
        alt={alt}
        className={cn('absolute inset-0 h-full w-full object-cover', className)}
        {...props}
      />
    </div>
  )
}
