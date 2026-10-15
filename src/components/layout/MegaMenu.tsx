import { ChevronRight } from 'lucide-react'
import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
} from 'react'
import { Link } from 'react-router-dom'

import { footballCompetitions } from '@/data/navigation'
import { cn } from '@/lib/utils'

export interface MegaMenuProps {
  className?: string
  onNavigate?: () => void
}

function ColumnHeader({ children }: { children: string }) {
  return (
    <p className="mb-2 px-2 text-[13px] font-semibold text-ink">{children}</p>
  )
}

function MenuRow({
  to,
  label,
  active = false,
  onNavigate,
  onHover,
  tabIndex,
  ...rest
}: {
  to: string
  label: string
  active?: boolean
  onNavigate?: () => void
  onHover?: () => void
  tabIndex?: number
} & Omit<ComponentProps<typeof Link>, 'to' | 'children' | 'onMouseEnter' | 'onFocus'>) {
  return (
    <Link
      to={to}
      tabIndex={tabIndex}
      onClick={onNavigate}
      onMouseEnter={onHover}
      onFocus={onHover}
      className={cn(
        'flex h-8 items-center justify-between gap-2 rounded-md px-2 text-[13px] transition-colors',
        active
          ? 'bg-brand font-medium text-white'
          : 'text-ink hover:bg-surface-muted',
      )}
      {...rest}
    >
      <span className="truncate">{label}</span>
      <ChevronRight
        className={cn('size-3.5 shrink-0', active ? 'text-white' : 'text-muted-soft')}
        aria-hidden
      />
    </Link>
  )
}

export function MegaMenu({ className, onNavigate }: MegaMenuProps) {
  const menuId = useId()
  const listRef = useRef<HTMLUListElement>(null)
  const [activeId, setActiveId] = useState(
    () => footballCompetitions[0]?.id ?? '',
  )

  const active = useMemo(
    () =>
      footballCompetitions.find((c) => c.id === activeId) ??
      footballCompetitions[0],
    [activeId],
  )

  const focusCompetitionAt = useCallback((index: number) => {
    const items = listRef.current?.querySelectorAll<HTMLAnchorElement>(
      '[data-competition-item]',
    )
    const el = items?.[index]
    if (el) {
      el.focus()
      const id = el.getAttribute('data-competition-id')
      if (id) setActiveId(id)
    }
  }, [])

  const onCompetitionKeyDown = (
    event: KeyboardEvent<HTMLAnchorElement>,
    index: number,
  ) => {
    const count = footballCompetitions.length
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault()
        focusCompetitionAt((index + 1) % count)
        break
      }
      case 'ArrowUp': {
        event.preventDefault()
        focusCompetitionAt((index - 1 + count) % count)
        break
      }
      case 'Home': {
        event.preventDefault()
        focusCompetitionAt(0)
        break
      }
      case 'End': {
        event.preventDefault()
        focusCompetitionAt(count - 1)
        break
      }
      default:
        break
    }
  }

  if (!active) {
    return null
  }

  return (
    <div
      data-mega-root
      className={cn(
        'grid w-[min(100vw-2rem,44rem)] grid-cols-1 overflow-hidden rounded-xl bg-white shadow-[0_12px_40px_rgba(11,11,15,0.16)] md:grid-cols-3',
        className,
      )}
      role="region"
      aria-label="Football navigation"
      id={menuId}
    >
      <div className="px-3 py-4 md:border-r md:border-border">
        <ColumnHeader>Competitions</ColumnHeader>
        <ul ref={listRef} className="flex flex-col" role="listbox">
          {footballCompetitions.map((competition, index) => {
            const isActive = competition.id === activeId
            return (
              <li key={competition.id} role="presentation" data-mega-item>
                <MenuRow
                  data-competition-item
                  data-competition-id={competition.id}
                  to={competition.href}
                  label={competition.label}
                  active={isActive}
                  role="option"
                  aria-selected={isActive}
                  onHover={() => setActiveId(competition.id)}
                  onNavigate={onNavigate}
                  onKeyDown={(event) => onCompetitionKeyDown(event, index)}
                />
              </li>
            )
          })}
        </ul>
      </div>

      <div className="px-3 py-4 md:border-r md:border-border">
        <ColumnHeader>Teams</ColumnHeader>
        <ul className="flex flex-col">
          {active.teams.map((link) => (
            <li key={link.href + link.label} data-mega-item>
              <MenuRow to={link.href} label={link.label} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </div>

      <div className="px-3 py-4">
        <ColumnHeader>Popular Matches</ColumnHeader>
        <ul className="flex flex-col">
          {active.popularMatches.map((link) => (
            <li key={link.href + link.label} data-mega-item>
              <MenuRow to={link.href} label={link.label} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
