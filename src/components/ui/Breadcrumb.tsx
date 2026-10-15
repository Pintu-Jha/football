import { ChevronRight } from 'lucide-react'
import { Fragment } from 'react'

import { cn } from '@/lib/utils'

export type BreadcrumbItem = {
  label: string
  href?: string
}

export type BreadcrumbProps = {
  items: BreadcrumbItem[]
  tone?: 'light' | 'dark'
  className?: string
}

export function Breadcrumb({
  items,
  tone = 'light',
  className,
}: BreadcrumbProps) {
  const isDark = tone === 'dark'

  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 ? (
                <li aria-hidden className="flex items-center">
                  <ChevronRight
                    className={cn(
                      'size-4',
                      isDark ? 'text-white/40' : 'text-muted-soft',
                    )}
                  />
                </li>
              ) : null}
              <li
                className={cn(
                  'font-medium',
                  isLast
                    ? isDark
                      ? 'text-white'
                      : 'text-ink'
                    : isDark
                      ? 'text-white/70'
                      : 'text-muted',
                )}
              >
                {isLast || !item.href ? (
                  <span aria-current={isLast ? 'page' : undefined}>
                    {item.label}
                  </span>
                ) : (
                  <a
                    href={item.href}
                    className={cn(
                      'transition-colors hover:underline',
                      isDark
                        ? 'hover:text-white'
                        : 'hover:text-brand',
                    )}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
