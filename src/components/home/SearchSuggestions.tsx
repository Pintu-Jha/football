import { Building2, MapPin, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Crest } from '@/components/ui/Crest'
import {
  groupSuggestions,
  type SearchSuggestion,
  type SuggestionKind,
  suggestionKindLabel,
} from '@/lib/searchSuggestions'
import { cn } from '@/lib/utils'

const KIND_ICON: Record<SuggestionKind, typeof Trophy> = {
  match: Trophy,
  team: Trophy,
  venue: Building2,
  competition: MapPin,
}

export type SearchSuggestionsProps = {
  items: SearchSuggestion[]
  query: string
  activeId: string | null
  onHighlight: (id: string | null) => void
  onSelect: (item: SearchSuggestion) => void
  className?: string
}

export function SearchSuggestions({
  items,
  query,
  activeId,
  onHighlight,
  onSelect,
  className,
}: SearchSuggestionsProps) {
  const groups = groupSuggestions(items)

  if (groups.length === 0) {
    return (
      <div
        role="listbox"
        className={cn(
          'overflow-hidden rounded-xl border border-border bg-white shadow-lift',
          className,
        )}
      >
        <p className="px-4 py-6 text-center text-sm text-muted">
          No results for &ldquo;{query}&rdquo;. Try a team, venue, or league.
        </p>
      </div>
    )
  }

  return (
    <div
      role="listbox"
      id="hero-search-suggestions"
      className={cn(
        'max-h-[min(28rem,70vh)] overflow-y-auto overscroll-contain rounded-xl border border-border bg-white shadow-lift',
        className,
      )}
      data-lenis-prevent
    >
      <p className="sticky top-0 z-10 border-b border-border bg-white/95 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted backdrop-blur-sm">
        {query.trim() ? 'Suggestions' : 'Popular searches'}
      </p>

      {groups.map((group) => (
        <div key={group.kind} className="border-b border-border last:border-b-0">
          <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-soft">
            {suggestionKindLabel(group.kind)}
          </p>
          <ul className="pb-2">
            {group.items.map((item) => {
              const Icon = KIND_ICON[item.kind]
              const active = activeId === item.id

              return (
                <li key={item.id} role="option" aria-selected={active}>
                  <Link
                    to={item.href}
                    id={`suggestion-${item.id}`}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 transition-colors',
                      active ? 'bg-brand-soft' : 'hover:bg-surface-muted',
                    )}
                    onMouseEnter={() => onHighlight(item.id)}
                    onMouseLeave={() => onHighlight(null)}
                    onClick={() => onSelect(item)}
                  >
                    {item.accent && item.initials ? (
                      <Crest
                        initials={item.initials}
                        color={item.accent}
                        size="sm"
                      />
                    ) : (
                      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-muted">
                        <Icon className="size-3.5" aria-hidden />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">
                        {item.title}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {item.subtitle}
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
