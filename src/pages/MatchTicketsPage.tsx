import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

import { MatchAbout } from '@/components/match/MatchAbout'
import { MatchFaq } from '@/components/match/MatchFaq'
import { MatchHero } from '@/components/match/MatchHero'
import { MoreMatches } from '@/components/match/MoreMatches'
import { MatchTrustStrip } from '@/components/match/MatchTrustStrip'
import { StadiumMapSection } from '@/components/match/StadiumMapSection'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  buildBreadcrumbList,
  buildFaqPage,
} from '@/components/seo/jsonLdBuilders'
import { Seo } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { getMatchFaqs } from '@/data/faqs'
import { getMatchBySlug, getMoreMatches } from '@/data/matches'

/** Stadium map + ticket list — shown after “View tickets”, before checkout. */
export function MatchTicketsPage() {
  const { slug = '' } = useParams()
  const match = getMatchBySlug(slug)
  const matchLabel = match
    ? `${match.homeTeam} vs ${match.awayTeam}`
    : 'Match'

  const breadcrumbLd = useMemo(
    () =>
      match
        ? buildBreadcrumbList([
            { name: 'Home', item: '/' },
            { name: 'Football', item: '/football/premier-league' },
            {
              name: match.competitionName,
              item: `/football/${match.competitionId}`,
            },
            {
              name: matchLabel,
              item: `/match/${match.slug}`,
            },
            { name: 'Select tickets' },
          ])
        : null,
    [match, matchLabel],
  )

  const faqLd = useMemo(
    () =>
      match
        ? buildFaqPage(
            getMatchFaqs(matchLabel).map((faq) => ({
              question: faq.question,
              answer: faq.answer,
            })),
          )
        : null,
    [match],
  )

  if (!match) {
    return (
      <>
        <Seo
          title="Match not found | FootballTicketClub"
          description="We couldn't find that fixture. Browse competitions from the home page."
        />
        <div className="flex min-h-[60vh] flex-col items-center justify-center bg-surface px-4 pt-28 text-center">
          <h1 className="text-2xl font-bold text-ink">Match not found</h1>
          <p className="mt-3 max-w-md text-muted">
            We couldn&apos;t find that fixture. Browse competitions from the home
            page.
          </p>
          <Button asChild className="mt-8">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </>
    )
  }

  const moreMatches = getMoreMatches(match)

  return (
    <>
      <Seo
        title={`${matchLabel} Tickets | FootballTicketClub`}
        description={`Choose seats for ${matchLabel} at ${match.venue}, ${match.city}. Compare categories on the stadium map, then continue to checkout.`}
      />
      {breadcrumbLd ? <JsonLd data={breadcrumbLd} /> : null}
      {faqLd ? <JsonLd data={faqLd} /> : null}
      <MatchHero match={match} />
      <StadiumMapSection match={match} />
      <MatchTrustStrip />
      <MatchAbout match={match} />
      <MatchFaq match={match} />
      <MoreMatches
        matches={moreMatches}
        competitionName={match.competitionName}
        competitionId={match.competitionId}
      />
    </>
  )
}
