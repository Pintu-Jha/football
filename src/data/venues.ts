import type { Venue } from './types'

const plVenueSeed: Array<[id: string, slug: string, name: string, city: string]> = [
  ['old-trafford', 'old-trafford', 'Old Trafford', 'Manchester'],
  ['emirates', 'emirates-stadium', 'Emirates Stadium', 'London'],
  ['tottenham', 'tottenham-hotspur-stadium', 'Tottenham Hotspur Stadium', 'London'],
  ['etihad', 'etihad-stadium', 'Etihad Stadium', 'Manchester'],
  ['stamford-bridge', 'stamford-bridge', 'Stamford Bridge', 'London'],
  ['villa-park', 'villa-park', 'Villa Park', 'Birmingham'],
  ['vitality', 'vitality-stadium', 'Vitality Stadium', 'Bournemouth'],
  ['craven-cottage', 'craven-cottage', 'Craven Cottage', 'London'],
  ['selhurst-park', 'selhurst-park', 'Selhurst Park Stadium', 'London'],
  ['gtech', 'gtech-community-stadium', 'Gtech Community Stadium', 'London'],
  ['city-ground', 'city-ground', 'City Ground', 'Nottingham'],
  ['portman-road', 'portman-road', 'Portman Road Stadium', 'Ipswich'],
  ['anfield', 'anfield', 'Anfield', 'Liverpool'],
  ['st-james', 'st-james-park', 'St James Park', 'Newcastle'],
  ['amex', 'american-express-community-stadium', 'American Express Community Stadium', 'Brighton'],
  ['elland-road', 'elland-road', 'Elland Road', 'Leeds'],
]

export const venues: Venue[] = plVenueSeed.map(([id, slug, name, city]) => ({
  id,
  slug,
  name,
  city,
  country: 'England',
  competitionId: 'premier-league',
  eventsCount: 28,
}))

export function getVenuesByCompetition(competitionId: string): Venue[] {
  return venues.filter((v) => v.competitionId === competitionId)
}
