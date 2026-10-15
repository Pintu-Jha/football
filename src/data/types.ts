export type CategorySlug =
  | 'football'
  | 'concerts'
  | 'sports'
  | 'theatre'
  | 'more'

export interface NavLink {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

export interface Competition {
  id: string
  slug: string
  name: string
  region: string
  country: string
  image: string
  imageAlt: string
  description: string
  longDescription: string
  teamsCount: number
  matchesPerSeason: number
  founded: number
  popularity: string
  popularityLabel?: string
  logoLabel: string
  /** football-data.org competition code, used for the crest image */
  crestCode?: string
  /** Short blurb shown beside the logo in the hero */
  tagline?: string
  /** Paragraphs for the "About … Tickets" section */
  about?: string[]
}

export interface Team {
  id: string
  slug: string
  name: string
  competitionId: string
  city: string
  eventsCount: number
  crestColor: string
  crestInitials: string
}

export interface Venue {
  id: string
  slug: string
  name: string
  city: string
  country: string
  competitionId: string
  eventsCount: number
}

export interface Match {
  id: string
  slug: string
  homeTeam: string
  awayTeam: string
  homeInitials: string
  awayInitials: string
  homeColor: string
  awayColor: string
  competitionId: string
  competitionName: string
  venue: string
  city: string
  country: string
  datetime: string
  priceFrom: number
  availableCount: number
  featured?: boolean
  vipTicket?: boolean
  vipHotel?: boolean
  verified?: boolean
  pageType: 'partners' | 'stadium'
}

export interface PartnerOffer {
  id: string
  partnerName: string
  partnerSlug: string
  ticketType: string
  ticketDetail?: string
  section: string
  sectionDetail?: string
  available: number
  price: number
  bookmarked?: boolean
  url: string
}

export interface SeatCategory {
  id: string
  label: string
  color: string
}

export interface StadiumSection {
  id: string
  /** Short label rendered on the map, e.g. "L25" */
  label: string
  name: string
  categoryId: string
  /** Tickets are listed per zone; every section belongs to exactly one zone */
  zoneId: string
  path: string
  labelX: number
  labelY: number
}

export interface StadiumZone {
  id: string
  name: string
  categoryId: string
}

export interface StadiumTicket {
  id: string
  /** Default "Recommended Order" position */
  rank: number
  zoneId: string
  tierName: string
  available: number
  /** Price per ticket in EUR (base currency) */
  price: number
  eTicket: boolean
  cheapest?: boolean
  mostPopular?: boolean
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface ClubCard {
  id: string
  name: string
  slug: string
  image: string
  imageAlt: string
  crestColor: string
  crestInitials: string
}

export interface Destination {
  id: string
  name: string
  slug: string
  image: string
  imageAlt: string
}

export interface CategoryCard {
  id: string
  name: string
  slug: CategorySlug
  description: string
  image: string
  imageAlt: string
}

export interface FooterColumn {
  title: string
  links: { label: string; href: string }[]
}
