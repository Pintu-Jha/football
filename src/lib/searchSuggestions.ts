import { competitions } from '@/data/competitions'
import { matches } from '@/data/matches'
import { teams } from '@/data/teams'
import { venues } from '@/data/venues'
import { buildTicketsPath } from '@/data/checkout'

export type SuggestionKind = 'match' | 'team' | 'venue' | 'competition'

export type SearchSuggestion = {
  id: string
  kind: SuggestionKind
  title: string
  subtitle: string
  href: string
  accent?: string
  initials?: string
}

const KIND_LABEL: Record<SuggestionKind, string> = {
  match: 'Matches',
  team: 'Teams',
  venue: 'Venues',
  competition: 'Competitions',
}

export function suggestionKindLabel(kind: SuggestionKind): string {
  return KIND_LABEL[kind]
}

function buildAllSuggestions(): SearchSuggestion[] {
  const matchItems: SearchSuggestion[] = matches.map((m) => ({
    id: `match-${m.id}`,
    kind: 'match',
    title: `${m.homeTeam} vs ${m.awayTeam}`,
    subtitle: `${m.competitionName} · ${m.venue}, ${m.city}`,
    href: buildTicketsPath(m.slug),
    accent: m.homeColor,
    initials: m.homeInitials,
  }))

  const teamItems: SearchSuggestion[] = teams.map((t) => ({
    id: `team-${t.id}`,
    kind: 'team',
    title: t.name,
    subtitle: `${t.city} · ${t.eventsCount} events`,
    href: `/football/${t.competitionId}`,
    accent: t.crestColor,
    initials: t.crestInitials,
  }))

  const venueItems: SearchSuggestion[] = venues.map((v) => ({
    id: `venue-${v.id}`,
    kind: 'venue',
    title: v.name,
    subtitle: `${v.city}, ${v.country}`,
    href: `/football/${v.competitionId}`,
  }))

  const competitionItems: SearchSuggestion[] = competitions.map((c) => ({
    id: `comp-${c.id}`,
    kind: 'competition',
    title: c.name,
    subtitle: `${c.region} · ${c.teamsCount} clubs`,
    href: `/football/${c.slug}`,
  }))

  return [...matchItems, ...teamItems, ...venueItems, ...competitionItems]
}

const ALL = buildAllSuggestions()

const DEFAULT_COUNTS: Record<SuggestionKind, number> = {
  match: 4,
  team: 4,
  venue: 3,
  competition: 3,
}

function matchesQuery(item: SearchSuggestion, query: string): boolean {
  const hay = `${item.title} ${item.subtitle}`.toLowerCase()
  return query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => hay.includes(token))
}

/** Popular defaults when the field is focused with an empty query. */
export function getDefaultSuggestions(): SearchSuggestion[] {
  const result: SearchSuggestion[] = []
  for (const kind of Object.keys(DEFAULT_COUNTS) as SuggestionKind[]) {
    result.push(
      ...ALL.filter((s) => s.kind === kind).slice(0, DEFAULT_COUNTS[kind]),
    )
  }
  return result
}

/** Filtered suggestions for a typed query (grouped later in the UI). */
export function getSearchSuggestions(query: string): SearchSuggestion[] {
  const q = query.trim()
  if (!q) return getDefaultSuggestions()

  const filtered = ALL.filter((s) => matchesQuery(s, q))
  const order: SuggestionKind[] = ['match', 'team', 'venue', 'competition']
  const result: SearchSuggestion[] = []

  for (const kind of order) {
    result.push(...filtered.filter((s) => s.kind === kind).slice(0, 5))
  }

  return result.slice(0, 12)
}

export function groupSuggestions(
  items: SearchSuggestion[],
): Array<{ kind: SuggestionKind; items: SearchSuggestion[] }> {
  const order: SuggestionKind[] = ['match', 'team', 'venue', 'competition']
  return order
    .map((kind) => ({
      kind,
      items: items.filter((s) => s.kind === kind),
    }))
    .filter((g) => g.items.length > 0)
}
