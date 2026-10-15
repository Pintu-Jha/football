import type { Competition, Venue } from '@/data/types'

import { DirectoryGrid } from '@/components/competition/DirectoryGrid'

export type StadiumsGridProps = {
  competition: Competition
  venues: Venue[]
}

export function StadiumsGrid({ competition, venues }: StadiumsGridProps) {
  return (
    <DirectoryGrid
      id="venues"
      title={`All ${competition.name} Stadiums`}
      items={venues.map((venue) => ({
        id: venue.id,
        name: venue.name,
        meta: `${venue.eventsCount} events`,
        href: `/football/${competition.slug}`,
      }))}
    />
  )
}
