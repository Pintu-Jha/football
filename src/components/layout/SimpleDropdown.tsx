import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { MegaMenuLink } from '@/data/navigation'
import { cn } from '@/lib/utils'

export interface SimpleDropdownProps {
  label: string
  links: MegaMenuLink[]
  className?: string
  panelClassName?: string
  /** light = white text (dark nav), dark = ink text (white nav) */
  tone?: 'light' | 'dark'
  /** Called when a link is activated (e.g. close mobile menu) */
  onNavigate?: () => void
}

export function SimpleDropdown({
  label,
  links,
  className,
  panelClassName,
  tone = 'light',
  onNavigate,
}: SimpleDropdownProps) {
  const isDark = tone === 'dark'

  return (
    <div
      className={cn('group/simple relative', className)}
      data-menu={label.toLowerCase()}
    >
      <button
        type="button"
        className={cn(
          'inline-flex items-center gap-1 rounded-md px-3 py-2 text-xs font-medium transition-colors sm:text-[13px]',
          isDark
            ? 'text-ink hover:bg-surface-muted focus-visible:bg-surface-muted group-focus-within/simple:bg-surface-muted'
            : 'text-white/90 hover:bg-white/10 focus-visible:bg-white/10 group-focus-within/simple:bg-white/10',
        )}
        aria-haspopup="true"
        aria-expanded="false"
        id={`nav-trigger-${label.toLowerCase()}`}
      >
        {label}
        <ChevronDown className="size-3.5 opacity-70" aria-hidden />
      </button>
      <div
        role="menu"
        aria-labelledby={`nav-trigger-${label.toLowerCase()}`}
        className={cn(
          'pointer-events-none invisible absolute left-0 top-full z-50 min-w-[12rem] translate-y-1 rounded-xl border p-2 opacity-0 shadow-nav transition-all duration-200',
          isDark
            ? 'border-border bg-surface'
            : 'border-white/10 bg-ink-soft/95 backdrop-blur-xl',
          'group-hover/simple:pointer-events-auto group-hover/simple:visible group-hover/simple:translate-y-0 group-hover/simple:opacity-100',
          'group-focus-within/simple:pointer-events-auto group-focus-within/simple:visible group-focus-within/simple:translate-y-0 group-focus-within/simple:opacity-100',
          panelClassName,
        )}
      >
        <ul className="flex flex-col gap-0.5">
          {links.map((link) => (
            <li key={link.href + link.label} role="none">
              <Link
                role="menuitem"
                to={link.href}
                className={cn(
                  'block rounded-lg px-3 py-2.5 text-sm transition-colors',
                  isDark
                    ? 'text-ink hover:bg-surface-muted focus-visible:bg-surface-muted'
                    : 'text-white/85 hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white',
                )}
                onClick={onNavigate}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
