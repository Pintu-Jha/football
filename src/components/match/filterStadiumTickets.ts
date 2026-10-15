import type { StadiumTicket } from '@/data/types'
import type { StadiumTicketFilters } from '@/store/filterStore'

export function filterStadiumTickets(
  tickets: StadiumTicket[],
  filters: StadiumTicketFilters,
): StadiumTicket[] {
  let result = tickets

  if (filters.zoneId) {
    result = result.filter((t) => t.zoneId === filters.zoneId)
  }

  if (filters.hiddenSoldOut) {
    result = result.filter((t) => t.available > 0)
  }

  const sorted = [...result]

  switch (filters.sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'recommended':
    default:
      sorted.sort((a, b) => a.rank - b.rank)
      break
  }

  return sorted
}
