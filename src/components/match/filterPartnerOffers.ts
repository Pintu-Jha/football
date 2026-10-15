import type { PartnerOffer } from '@/data/types'

export type PartnerFilterState = {
  ticketCount: number
  sort: 'lowest' | 'highest' | 'availability'
  availability: 'all' | 'available' | 'limited'
}

export function filterPartnerOffers(
  offers: PartnerOffer[],
  filters: PartnerFilterState,
): PartnerOffer[] {
  let result = offers.filter((o) => o.available >= filters.ticketCount)

  if (filters.availability === 'available') {
    result = result.filter((o) => o.available >= 10)
  } else if (filters.availability === 'limited') {
    result = result.filter((o) => o.available < 10)
  }

  const sorted = [...result]
  switch (filters.sort) {
    case 'highest':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'availability':
      sorted.sort((a, b) => b.available - a.available)
      break
    case 'lowest':
    default:
      sorted.sort((a, b) => a.price - b.price)
      break
  }

  return sorted
}
