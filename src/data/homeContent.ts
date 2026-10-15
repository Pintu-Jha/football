const CREST = (id: number | string) =>
  `https://crests.football-data.org/${id}.png`

export type HomeEventRow = {
  readonly id: string
  readonly month: string
  readonly day: string
  readonly weekday: string
  readonly title: string
  readonly time: string
  readonly venue: string
  readonly price: string
  readonly availability: string
  readonly href: string
}

export type UpcomingMatchCard = {
  readonly id: string
  readonly dateLabel: string
  readonly time: string
  readonly competition: string
  readonly competitionLogo: string
  readonly home: string
  readonly away: string
  readonly homeLogo: string
  readonly awayLogo: string
  readonly venue: string
  readonly city: string
  readonly priceFrom: number
  readonly href: string
}

export type TrustBarItem = {
  readonly title: string
  readonly subtitle: string
}

export type FeatureStripItem = {
  readonly title: string
  readonly description: string
}

export type FeaturedCompetitionCard = {
  readonly id: string
  readonly name: string
  readonly region: string
  readonly href: string
  readonly image?: string
  readonly logo?: string
  readonly invertLogo?: boolean
  readonly background?: string
  readonly wordmark?: 'laliga' | 'seriea'
}

export type CrestCard = {
  readonly id: string
  readonly name: string
  readonly logo: string
  readonly tint: string
  readonly href: string
}

export type ImageCard = {
  readonly id: string
  readonly name: string
  readonly description?: string
  readonly image: string
  readonly href: string
}

export const featuredCompetitionCards = [
  {
    id: 'premier-league',
    name: 'Premier League',
    region: 'England',
    href: '/football/premier-league',
    image: '/images/card-premier-league.jpg',
  },
  {
    id: 'champions-league',
    name: 'Champions League',
    region: 'Europe',
    href: '/football/champions-league',
    image: '/images/comp-champions-league.jpg',
  },
  {
    id: 'europa-league',
    name: 'Europa League',
    region: 'Europe',
    href: '/football/europa-league',
    image: '/images/card-europa-trophy.jpg',
  },
  {
    id: 'la-liga',
    name: 'La Liga',
    region: 'Spain',
    href: '/football/la-liga',
    image: '/images/card-laliga-bg.jpg',
    wordmark: 'laliga',
  },
  {
    id: 'serie-a',
    name: 'Serie A',
    region: 'Italy',
    href: '/football/serie-a',
    image: '/images/card-seriea-bg.jpg',
    wordmark: 'seriea',
  },
] as const satisfies readonly FeaturedCompetitionCard[]

export const dontMissRows = [
  {
    id: 'dm1',
    month: 'OCT',
    day: '20',
    weekday: 'Tue',
    title: 'Fenerbahçe - Slavia Prag',
    time: '18:45',
    venue: 'Fenerbahçe Chobani Stadium',
    price: '102 EUR',
    availability: '10+ Available Ticket',
    href: '/match/fenerbahce-vs-slavia-prague/tickets',
  },
  {
    id: 'dm2',
    month: 'OCT',
    day: '17',
    weekday: 'Sat',
    title: 'Fenerbahçe - Alanyaspor',
    time: '19:00',
    venue: 'Fenerbahçe Chobani Stadium',
    price: '57 EUR',
    availability: '10+ Available Ticket',
    href: '/match/fenerbahce-vs-alanyaspor/tickets',
  },
  {
    id: 'dm3',
    month: 'OCT',
    day: '26',
    weekday: 'Sun',
    title: 'Galatasaray - Fenerbahçe',
    time: '21:30',
    venue: 'Galatasaray Rams Global Stadium',
    price: '289 EUR',
    availability: '10+ Available Ticket',
    href: '/match/galatasaray-vs-fenerbahce/tickets',
  },
  {
    id: 'dm4',
    month: 'NOV',
    day: '03',
    weekday: 'Mon',
    title: 'Galatasaray - VFB Stuttgart',
    time: '21:00',
    venue: 'Galatasaray Rams Global Stadium',
    price: '226 EUR',
    availability: '10+ Available Ticket',
    href: '/match/galatasaray-vs-vfb-stuttgart/tickets',
  },
  {
    id: 'dm5',
    month: 'NOV',
    day: '04',
    weekday: 'Wed',
    title: 'Fenerbahçe - Liverpool',
    time: '21:00',
    venue: 'Fenerbahçe Chobani Stadium',
    price: '265 EUR',
    availability: '10+ Available Ticket',
    href: '/match/fenerbahce-vs-liverpool/tickets',
  },
] as const satisfies readonly HomeEventRow[]

export const featuredEventRows = [
  {
    id: 'fe1',
    month: 'OCT',
    day: '17',
    weekday: 'Sat',
    title: 'Fenerbahçe - Alanyaspor',
    time: '19:00',
    venue: 'Fenerbahçe Chobani Stadium',
    price: '57 EUR',
    availability: '10+ Available Ticket',
    href: '/match/fenerbahce-vs-alanyaspor/tickets',
  },
  {
    id: 'fe2',
    month: 'OCT',
    day: '22',
    weekday: 'Thu',
    title: 'Beşiktaş - Crystal Palace',
    time: '22:00',
    venue: 'Beşiktaş Tüpraş Stadium',
    price: '93 EUR',
    availability: '10+ Available Ticket',
    href: '/match/besiktas-vs-crystal-palace/tickets',
  },
  {
    id: 'fe3',
    month: 'OCT',
    day: '26',
    weekday: 'Sun',
    title: 'Galatasaray - Fenerbahçe',
    time: '21:30',
    venue: 'Galatasaray Rams Global Stadium',
    price: '289 EUR',
    availability: '10+ Available Ticket',
    href: '/match/galatasaray-vs-fenerbahce/tickets',
  },
  {
    id: 'fe4',
    month: 'NOV',
    day: '03',
    weekday: 'Mon',
    title: 'Galatasaray - VFB Stuttgart',
    time: '21:00',
    venue: 'Galatasaray Rams Global Stadium',
    price: '226 EUR',
    availability: '10+ Available Ticket',
    href: '/match/galatasaray-vs-vfb-stuttgart/tickets',
  },
  {
    id: 'fe5',
    month: 'NOV',
    day: '12',
    weekday: 'Thu',
    title: 'Turkey - Belgium (2025 UEFA Nations League A)',
    time: '20:00',
    venue: 'Gürsel Aksel Stadium',
    price: '90 EUR',
    availability: '10+ Available Ticket',
    href: '/match/turkey-vs-belgium/tickets',
  },
] as const satisfies readonly HomeEventRow[]

export const upcomingMatchCards = [
  {
    id: 'um1',
    dateLabel: 'Sat, 26 Apr 2025',
    time: '17:30',
    competition: 'Premier League',
    competitionLogo: CREST('PL'),
    home: 'Arsenal',
    away: 'Tottenham',
    homeLogo: CREST(57),
    awayLogo: CREST(73),
    venue: 'Emirates Stadium',
    city: 'London, England',
    priceFrom: 89,
    href: '/match/arsenal-vs-tottenham/tickets',
  },
  {
    id: 'um2',
    dateLabel: 'Sun, 27 Apr 2025',
    time: '16:00',
    competition: 'Premier League',
    competitionLogo: CREST('PL'),
    home: 'Man United',
    away: 'Liverpool',
    homeLogo: CREST(66),
    awayLogo: CREST(64),
    venue: 'Old Trafford',
    city: 'Manchester, England',
    priceFrom: 112,
    href: '/match/man-utd-vs-liverpool/tickets',
  },
  {
    id: 'um3',
    dateLabel: 'Tue, 30 Apr 2025',
    time: '20:00',
    competition: 'Champions League',
    competitionLogo: CREST('CL'),
    home: 'Real Madrid',
    away: 'Bayern Munich',
    homeLogo: CREST(86),
    awayLogo: CREST(5),
    venue: 'Santiago Bernabéu',
    city: 'Madrid, Spain',
    priceFrom: 145,
    href: '/match/real-madrid-vs-bayern-munich/tickets',
  },
  {
    id: 'um4',
    dateLabel: 'Thu, 2 May 2025',
    time: '18:45',
    competition: 'Europa League',
    competitionLogo: CREST('EL'),
    home: 'Roma',
    away: 'Bayer Leverkusen',
    homeLogo: CREST(100),
    awayLogo: CREST(3),
    venue: 'Stadio Olimpico',
    city: 'Rome, Italy',
    priceFrom: 95,
    href: '/match/roma-vs-bayer-leverkusen/tickets',
  },
] as const satisfies readonly UpcomingMatchCard[]

export const popularClubCards = [
  { id: 'man-utd', name: 'Manchester United', logo: CREST(66), tint: '#da291c', href: '/football/premier-league' },
  { id: 'liverpool', name: 'Liverpool', logo: CREST(64), tint: '#c8102e', href: '/football/premier-league' },
  { id: 'real-madrid', name: 'Real Madrid', logo: CREST(86), tint: '#1b2a4a', href: '/football/la-liga' },
  { id: 'barcelona', name: 'Barcelona', logo: CREST(81), tint: '#a50044', href: '/football/la-liga' },
  { id: 'arsenal', name: 'Arsenal', logo: CREST(57), tint: '#ef0107', href: '/football/premier-league' },
  { id: 'chelsea', name: 'Chelsea', logo: CREST(61), tint: '#034694', href: '/football/premier-league' },
] as const satisfies readonly CrestCard[]

export const destinationCards = [
  {
    id: 'london',
    name: 'London',
    image:
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
    href: '/football/premier-league',
  },
  {
    id: 'manchester',
    name: 'Manchester',
    image:
      'https://images.unsplash.com/photo-1515586838455-8f8f940d6853?auto=format&fit=crop&w=600&q=80',
    href: '/football/premier-league',
  },
  {
    id: 'madrid',
    name: 'Madrid',
    image:
      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=600&q=80',
    href: '/football/la-liga',
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    image: '/images/dest-barcelona.jpg',
    href: '/football/la-liga',
  },
  {
    id: 'rome',
    name: 'Rome',
    image: '/images/dest-rome.jpg',
    href: '/football/serie-a',
  },
  {
    id: 'paris',
    name: 'Paris',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    href: '/football/ligue-1',
  },
] as const satisfies readonly ImageCard[]

export const categoryCards = [
  {
    id: 'football',
    name: 'Football',
    description: 'Club matches, leagues and international games',
    image: '/images/cat-football.jpg',
    href: '/football/premier-league',
  },
  {
    id: 'concerts',
    name: 'Concerts',
    description: 'World tours & music festivals',
    image: '/images/cat-concerts.jpg',
    href: '/#concerts',
  },
  {
    id: 'theatre',
    name: 'Theatre',
    description: 'Musicals, plays and live shows',
    image: '/images/cat-theatre.jpg',
    href: '/#theatre',
  },
  {
    id: 'sports',
    name: 'Other Sports',
    description: 'F1, Tennis, Boxing and more',
    image: '/images/cat-sports.jpg',
    href: '/#sports',
  },
] as const satisfies readonly ImageCard[]

export const trustBarItems = [
  { title: '100% Buyer Guarantee', subtitle: 'Safe & secure purchases' },
  { title: 'Verified Sellers', subtitle: 'Real tickets, real fans' },
  { title: '24/7 Customer Support', subtitle: "We're here to help" },
  { title: 'Secure Payments', subtitle: 'Your data is protected' },
] as const satisfies readonly TrustBarItem[]

export const featureStripItems = [
  {
    title: 'Verified Tickets',
    description: '100% authentic and verified sellers',
  },
  {
    title: 'Secure Payments',
    description: 'Your data is always protected',
  },
  {
    title: 'Transparent Pricing',
    description: 'No hidden fees. What you see is what you pay',
  },
  {
    title: '24/7 Support',
    description: 'Our team is here day and night.',
  },
] as const satisfies readonly FeatureStripItem[]
