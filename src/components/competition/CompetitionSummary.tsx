import { CalendarDays, Flag, Globe2, History, Trophy } from 'lucide-react'

import type { Competition } from '@/data/types'

export type CompetitionSummaryProps = {
  competition: Competition
}

export function CompetitionSummary({ competition }: CompetitionSummaryProps) {
  const stats = [
    { label: 'Teams', value: String(competition.teamsCount), icon: Trophy },
    {
      label: 'Matches per Season',
      value: String(competition.matchesPerSeason),
      icon: CalendarDays,
    },
    { label: 'Founded', value: String(competition.founded), icon: History },
    { label: 'Country', value: competition.country, icon: Flag },
    {
      label: competition.popularityLabel ?? 'Popularity',
      value: competition.popularity,
      icon: Globe2,
    },
  ]

  return (
    <section id="overview" className="scroll-mt-20 bg-white pt-6">
      <div className="container-home">
        <div className="rounded-lg border border-border bg-white px-5 py-5">
          <h2 className="text-[20px] font-bold tracking-[-0.01em] text-ink">
            {competition.name} – Competition Summary
          </h2>

          <dl className="mt-4 grid grid-cols-2 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 lg:border-l lg:border-border lg:px-5 lg:first:border-l-0 lg:first:pl-0"
              >
                <Icon className="size-6 shrink-0 stroke-[1.5] text-ink" aria-hidden />
                <div className="flex min-w-0 flex-col-reverse">
                  <dt className="text-[11px] text-muted">{label}</dt>
                  <dd className="text-[16px] font-bold leading-tight text-ink">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <p className="mt-4 text-[13px] leading-relaxed text-muted">
            {competition.longDescription}
          </p>
        </div>
      </div>
    </section>
  )
}
