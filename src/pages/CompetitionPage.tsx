import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

import { AboutSection } from '@/components/competition/AboutSection'
import { CompetitionFaq } from '@/components/competition/CompetitionFaq'
import { CompetitionHero } from '@/components/competition/CompetitionHero'
import { CompetitionSummary } from '@/components/competition/CompetitionSummary'
import { CompetitionTrust } from '@/components/competition/CompetitionTrust'
import { MatchList } from '@/components/competition/MatchList'
import { StadiumsGrid } from '@/components/competition/StadiumsGrid'
import { TeamsGrid } from '@/components/competition/TeamsGrid'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  buildBreadcrumbList,
  buildFaqPage,
} from '@/components/seo/jsonLdBuilders'
import { Seo } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { getCompetitionBySlug } from '@/data/competitions'
import { competitionFaqs } from '@/data/faqs'
import { getMatchesByCompetition } from '@/data/matches'
import { getTeamsByCompetition } from '@/data/teams'
import { getVenuesByCompetition } from '@/data/venues'
import { useNewsletterAutoOpen } from '@/hooks/useNewsletterAutoOpen'
import { useFilterStore } from '@/store/filterStore'

function personalizeQuestion(question: string, competitionName: string): string {
  return question.replace(/Premier League/g, competitionName)
}

export function CompetitionPage() {
  const { competition: slug = '' } = useParams()
  const competition = getCompetitionBySlug(slug)
  const resetCompetitionFilters = useFilterStore((s) => s.resetCompetitionFilters)

  useNewsletterAutoOpen(Boolean(competition))

  useEffect(() => {
    resetCompetitionFilters()
  }, [slug, resetCompetitionFilters])

  const breadcrumbLd = useMemo(
    () =>
      competition
        ? buildBreadcrumbList([
            { name: 'Home', item: '/' },
            { name: 'Football', item: '/football/premier-league' },
            { name: competition.name },
          ])
        : null,
    [competition],
  )

  const faqLd = useMemo(
    () =>
      competition
        ? buildFaqPage(
            competitionFaqs.map((faq) => ({
              question: personalizeQuestion(faq.question, competition.name),
              answer: faq.answer,
            })),
          )
        : null,
    [competition],
  )

  if (!competition) {
    return (
      <>
        <Seo
          title="Competition not found | FootballTicketClub"
          description="We couldn't find that competition. Browse football tickets from the home page."
        />
        <div className="flex min-h-[60vh] flex-col items-center justify-center bg-surface px-4 pt-28 text-center">
          <h1 className="text-2xl font-bold text-ink">Competition not found</h1>
          <p className="mt-3 max-w-md text-muted">
            We couldn&apos;t find that competition. Browse football tickets from the
            home page.
          </p>
          <Button asChild className="mt-8">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </>
    )
  }

  const matches = getMatchesByCompetition(competition.id)
  const teams = getTeamsByCompetition(competition.id)
  const venues = getVenuesByCompetition(competition.id)

  return (
    <>
      <Seo
        title={`${competition.name} Tickets | FootballTicketClub`}
        description={competition.description}
      />
      {breadcrumbLd ? <JsonLd data={breadcrumbLd} /> : null}
      {faqLd ? <JsonLd data={faqLd} /> : null}
      <CompetitionHero competition={competition} />
      <CompetitionSummary competition={competition} />
      <MatchList
        competitionName={competition.name}
        matches={matches}
        teams={teams}
        venues={venues}
      />
      <AboutSection competition={competition} />
      <CompetitionTrust competitionName={competition.name} />
      <TeamsGrid competition={competition} teams={teams} />
      <StadiumsGrid competition={competition} venues={venues} />
      <CompetitionFaq competition={competition} />
    </>
  )
}
