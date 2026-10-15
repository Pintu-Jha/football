import type { Competition, Team } from '@/data/types'

import { DirectoryGrid } from '@/components/competition/DirectoryGrid'

export type TeamsGridProps = {
  competition: Competition
  teams: Team[]
}

export function TeamsGrid({ competition, teams }: TeamsGridProps) {
  return (
    <DirectoryGrid
      id="teams"
      title={`All ${competition.name} Teams`}
      items={teams.map((team) => ({
        id: team.id,
        name: team.name,
        meta: `${team.eventsCount} events`,
        href: `/football/${competition.slug}`,
      }))}
    />
  )
}
