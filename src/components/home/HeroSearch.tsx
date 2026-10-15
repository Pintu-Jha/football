import * as Popover from '@radix-ui/react-popover'
import {
  Calendar,
  Clapperboard,
  MapPin,
  Globe2,
  MoreHorizontal,
  Music,
  Search,
  Trophy,
} from 'lucide-react'
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import {
  DateCalendar,
  formatSelectedDate,
} from '@/components/home/DateCalendar'
import { SearchSuggestions } from '@/components/home/SearchSuggestions'
import { Button } from '@/components/ui/Button'
import type { CategorySlug } from '@/data/types'
import {
  getSearchSuggestions,
  type SearchSuggestion,
} from '@/lib/searchSuggestions'
import { cn } from '@/lib/utils'

type SearchTab = {
  id: CategorySlug
  label: string
  icon: typeof Trophy
}

const tabs: SearchTab[] = [
  { id: 'football', label: 'Matches', icon: Trophy },
  { id: 'concerts', label: 'Concerts', icon: Music },
  { id: 'sports', label: 'Sports', icon: Globe2 },
  { id: 'theatre', label: 'Theatre', icon: Clapperboard },
  { id: 'more', label: 'More', icon: MoreHorizontal },
]

export function HeroSearch() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<CategorySlug>('football')

  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState<string | null>(null)

  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  const queryInputRef = useRef<HTMLInputElement | null>(null)

  const suggestions = useMemo(() => getSearchSuggestions(query), [query])

  useEffect(() => {
    setActiveId(suggestions[0]?.id ?? null)
  }, [suggestions])

  function openSuggestions() {
    setCalendarOpen(false)
    setSuggestionsOpen(true)
  }

  function selectSuggestion(item: SearchSuggestion) {
    setQuery(item.title)
    setSuggestionsOpen(false)
    setActiveId(null)
    navigate(item.href)
  }

  function onQueryKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!suggestionsOpen || suggestions.length === 0) {
      if (event.key === 'ArrowDown') {
        openSuggestions()
        event.preventDefault()
      }
      return
    }

    const index = suggestions.findIndex((s) => s.id === activeId)

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const next =
        suggestions[(index + 1 + suggestions.length) % suggestions.length]
      if (next) setActiveId(next.id)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      const prev =
        suggestions[(index - 1 + suggestions.length) % suggestions.length]
      if (prev) setActiveId(prev.id)
      return
    }

    if (event.key === 'Enter' && activeId) {
      const item = suggestions.find((s) => s.id === activeId)
      if (item) {
        event.preventDefault()
        selectSuggestion(item)
      }
      return
    }

    if (event.key === 'Escape') {
      setSuggestionsOpen(false)
      setActiveId(null)
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const first = getSearchSuggestions(query)[0]
    if (first) {
      navigate(first.href)
      return
    }
    navigate('/football/premier-league')
  }

  const dateLabel = formatSelectedDate(date)

  return (
    <div className="relative z-20">
      <div className="flex max-w-full overflow-x-auto rounded-t-xl bg-white px-2 scrollbar-none sm:w-fit sm:px-3">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex h-11 shrink-0 items-center gap-2 border-b-2 px-4 text-[13px] font-medium transition-colors sm:px-6',
                active
                  ? 'border-brand text-brand'
                  : 'border-transparent text-ink hover:text-brand',
              )}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </button>
          )
        })}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col rounded-b-xl rounded-tr-xl border-t border-border bg-white shadow-lift md:flex-row md:items-stretch"
        role="search"
        aria-label="Search tickets"
      >
        <div className="flex min-w-0 flex-1 flex-col divide-y divide-border sm:flex-row sm:divide-x sm:divide-y-0">
          {/* Query + portaled suggestions (escapes hero overflow-hidden) */}
          <Popover.Root
            open={suggestionsOpen}
            onOpenChange={(open) => {
              setSuggestionsOpen(open)
              if (open) setCalendarOpen(false)
            }}
          >
            <Popover.Anchor asChild>
              <label className="flex flex-1 items-center gap-3 px-4 py-4 sm:px-5">
                <Search className="size-5 shrink-0 text-muted" aria-hidden />
                <input
                  ref={queryInputRef}
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setSuggestionsOpen(true)
                  }}
                  onFocus={openSuggestions}
                  onClick={openSuggestions}
                  onKeyDown={onQueryKeyDown}
                  placeholder="Team, event, artist or venue"
                  className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted-soft"
                  autoComplete="off"
                  aria-autocomplete="list"
                  aria-expanded={suggestionsOpen}
                  aria-controls="hero-search-suggestions"
                  aria-activedescendant={
                    activeId ? `suggestion-${activeId}` : undefined
                  }
                />
              </label>
            </Popover.Anchor>
            <Popover.Portal>
              <Popover.Content
                align="start"
                side="bottom"
                sideOffset={10}
                collisionPadding={24}
                avoidCollisions
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
                className="z-[200] w-[min(100vw-2rem,28rem)] outline-none"
              >
                <SearchSuggestions
                  items={suggestions}
                  query={query}
                  activeId={activeId}
                  onHighlight={setActiveId}
                  onSelect={selectSuggestion}
                />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          {/* Location */}
          <label className="flex flex-1 items-center gap-3 px-4 py-4 sm:px-5">
            <MapPin className="size-5 shrink-0 text-muted" aria-hidden />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setSuggestionsOpen(false)}
              placeholder="Any location"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted-soft"
              autoComplete="off"
            />
          </label>

          {/* Date + calendar */}
          <Popover.Root
            open={calendarOpen}
            onOpenChange={(open) => {
              setCalendarOpen(open)
              if (open) setSuggestionsOpen(false)
            }}
          >
            <Popover.Trigger asChild>
              <button
                type="button"
                className="flex flex-1 items-center gap-3 px-4 py-4 text-left sm:px-5"
                aria-label={dateLabel ? `Date: ${dateLabel}` : 'Choose any date'}
              >
                <Calendar className="size-5 shrink-0 text-muted" aria-hidden />
                <span
                  className={cn(
                    'min-w-0 flex-1 truncate text-sm',
                    dateLabel ? 'font-medium text-ink' : 'text-muted-soft',
                  )}
                >
                  {dateLabel || 'Any date'}
                </span>
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                align="start"
                sideOffset={10}
                collisionPadding={16}
                className="z-[200] outline-none"
              >
                <DateCalendar
                  value={date}
                  onChange={setDate}
                  onClose={() => setCalendarOpen(false)}
                />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>

        <div className="flex items-center border-t border-border p-2.5 md:border-t-0 md:border-l">
          <Button
            type="submit"
            size="md"
            className="h-11 w-full shrink-0 rounded-md px-7 text-[13px] md:w-[180px]"
          >
            Search Tickets
            <span aria-hidden> →</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
