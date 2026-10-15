import * as Popover from '@radix-ui/react-popover'
import { ChevronDown, Search, Users } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Crest } from '@/components/ui/Crest'
import type { Team } from '@/data/types'
import { cn } from '@/lib/utils'

export type TeamSuggestProps = {
  teams: Team[]
  value: string
  onChange: (teamName: string) => void
  placeholder?: string
  className?: string
}

export function TeamSuggest({
  teams,
  value,
  onChange,
  placeholder = 'All teams',
  className,
}: TeamSuggestProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return teams
    return teams.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.crestInitials.toLowerCase().includes(q),
    )
  }, [teams, query])

  const label = value || placeholder

  function pick(name: string) {
    onChange(name)
    setOpen(false)
    setQuery('')
  }

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setQuery('')
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface-subtle px-3 text-sm font-medium transition-colors hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2',
            value ? 'text-ink' : 'text-muted',
            className,
          )}
          aria-label={value ? `Team: ${value}` : 'Choose a team'}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <Users className="size-4 shrink-0 text-muted" aria-hidden />
            <span className="truncate">{label}</span>
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted" aria-hidden />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          side="bottom"
          sideOffset={8}
          collisionPadding={16}
          className="z-[200] w-[var(--radix-popover-trigger-width)] min-w-[16rem] outline-none"
          onOpenAutoFocus={(e) => {
            // Keep focus in the search input inside the panel.
            e.preventDefault()
            const input = document.getElementById('team-suggest-input')
            input?.focus()
          }}
        >
          <div
            className="overflow-hidden rounded-xl border border-border bg-white shadow-lift"
            data-lenis-prevent
          >
            <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
              <Search className="size-4 shrink-0 text-muted" aria-hidden />
              <input
                id="team-suggest-input"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search teams…"
                className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted-soft"
                autoComplete="off"
              />
            </div>

            <ul
              role="listbox"
              className="max-h-64 overflow-y-auto overscroll-contain py-1"
            >
              <li role="option" aria-selected={!value}>
                <button
                  type="button"
                  className={cn(
                    'flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors',
                    !value
                      ? 'bg-brand-soft font-semibold text-brand'
                      : 'text-ink hover:bg-surface-muted',
                  )}
                  onClick={() => pick('')}
                >
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-muted">
                    <Users className="size-3.5" aria-hidden />
                  </span>
                  All teams
                </button>
              </li>

              {filtered.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-muted">
                  No teams match &ldquo;{query}&rdquo;
                </li>
              ) : (
                filtered.map((team) => {
                  const selected = value === team.name
                  return (
                    <li
                      key={team.id}
                      role="option"
                      aria-selected={selected}
                    >
                      <button
                        type="button"
                        className={cn(
                          'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors',
                          selected
                            ? 'bg-brand-soft'
                            : 'hover:bg-surface-muted',
                        )}
                        onClick={() => pick(team.name)}
                      >
                        <Crest
                          initials={team.crestInitials}
                          color={team.crestColor}
                          size="sm"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-ink">
                            {team.name}
                          </span>
                          <span className="block truncate text-xs text-muted">
                            {team.city}
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
