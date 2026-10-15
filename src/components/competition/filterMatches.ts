import type { Match } from '@/data/types'

export type CompetitionSort = 'upcoming' | 'price-asc' | 'price-desc'

export type CompetitionMatchFilters = {
  city: string
  team: string
  date: string
  venue: string
  sort: CompetitionSort
}

export function filterAndSortMatches(
  matches: Match[],
  filters: CompetitionMatchFilters,
): Match[] {
  let result = matches.filter((match) => {
    if (filters.city && match.city !== filters.city) {
      return false
    }
    if (filters.venue && match.venue !== filters.venue) {
      return false
    }
    if (filters.date && match.datetime.slice(0, 10) !== filters.date) {
      return false
    }
    if (filters.team) {
      const team = filters.team.toLowerCase()
      const home = match.homeTeam.toLowerCase()
      const away = match.awayTeam.toLowerCase()
      if (!home.includes(team) && !away.includes(team)) {
        return false
      }
    }
    return true
  })

  result = [...result]

  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => a.priceFrom - b.priceFrom)
      break
    case 'price-desc':
      result.sort((a, b) => b.priceFrom - a.priceFrom)
      break
    default:
      result.sort(
        (a, b) =>
          new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
      )
  }

  return result
}
