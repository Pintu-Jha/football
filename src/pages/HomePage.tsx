import { BrowseCategories } from '@/components/home/BrowseCategories'
import { EventLists } from '@/components/home/EventLists'
import { FeaturedCompetitions } from '@/components/home/FeaturedCompetitions'
import { Hero } from '@/components/home/Hero'
import { IconicDestinations } from '@/components/home/IconicDestinations'
import { NewsletterBanner } from '@/components/home/NewsletterBanner'
import { PopularClubs } from '@/components/home/PopularClubs'
import { UpcomingMatches } from '@/components/home/UpcomingMatches'
import { ValueProps } from '@/components/home/ValueProps'
import { Seo } from '@/components/seo/Seo'

export function HomePage() {
  return (
    <>
      <Seo
        title="FootballTicketClub | Compare Football & Live Event Tickets"
        description="FootballTicketClub — compare football and live event ticket prices from trusted partners. An independent comparison marketplace, not a ticket seller."
      />
      <Hero />
      <FeaturedCompetitions />
      <EventLists />
      <UpcomingMatches />
      <PopularClubs />
      <IconicDestinations />
      <BrowseCategories />
      <ValueProps />
      <NewsletterBanner />
    </>
  )
}
