import { ArrowDown } from 'lucide-react'
import { useState } from 'react'

import type { Match } from '@/data/types'

function buildAboutParagraphs(match: Match): string[] {
  const label = `${match.homeTeam} vs ${match.awayTeam}`
  return [
    `${label} is a highly anticipated ${match.competitionName} fixture at ${match.venue}. This match brings together two historic English football clubs with passionate fan bases, promising an exciting atmosphere and a memorable matchday experience.`,
    `Tickets for this fixture are in demand, especially for the best seats and home sections. Prices can vary depending on the stand, seat location, availability and the ticket seller. On FootballTicketClub, you can compare ticket offers from multiple trusted partners to find the best value for your budget.`,
    `${match.venue} is known for its vibrant atmosphere and excellent facilities, making it a great venue to enjoy live football. Attending a ${label} match is a fantastic opportunity to experience the passion, excitement and tradition of English football.`,
  ]
}

export type MatchAboutProps = {
  match: Match
}

export function MatchAbout({ match }: MatchAboutProps) {
  const [expanded, setExpanded] = useState(false)
  const paragraphs = buildAboutParagraphs(match)
  const extra = `Use the comparison table to filter by group size and availability, then continue to a partner site to choose seats and complete your ${match.homeTeam} vs ${match.awayTeam} booking.`
  const visible = expanded ? [...paragraphs, extra] : paragraphs
  const matchLabel = `${match.homeTeam} vs ${match.awayTeam}`

  return (
    <section className="bg-white py-10 md:py-12">
      <div className="container-home">
        <h2 className="text-[22px] font-bold tracking-[-0.01em] text-ink">
          About {matchLabel} Tickets
        </h2>
        <div className="mt-4 max-w-4xl space-y-4 text-[13px] leading-relaxed text-muted">
          {visible.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
        {!expanded ? (
          <button
            type="button"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg border border-brand px-4 text-[13px] font-semibold text-brand transition-colors hover:bg-brand-soft"
            onClick={() => setExpanded(true)}
          >
            Load More Content
            <ArrowDown className="size-3.5" aria-hidden />
          </button>
        ) : null}
      </div>
    </section>
  )
}
