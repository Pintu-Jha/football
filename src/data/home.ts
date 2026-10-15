import type {
  CategoryCard,
  ClubCard,
  Destination,
  FooterColumn,
} from './types'

export const popularClubs: ClubCard[] = [
  {
    id: 'c1',
    name: 'Manchester United',
    slug: 'man-utd',
    image:
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Stadium crowd waving scarves under lights',
    crestColor: '#DA291C',
    crestInitials: 'MU',
  },
  {
    id: 'c2',
    name: 'Liverpool',
    slug: 'liverpool',
    image:
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Football pitch under evening lights',
    crestColor: '#C8102E',
    crestInitials: 'LFC',
  },
  {
    id: 'c3',
    name: 'Real Madrid',
    slug: 'real-madrid',
    image:
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Packed football stadium stands',
    crestColor: '#FEBE10',
    crestInitials: 'RM',
  },
  {
    id: 'c4',
    name: 'Barcelona',
    slug: 'barcelona',
    image:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Night match atmosphere in a large stadium',
    crestColor: '#A50044',
    crestInitials: 'FCB',
  },
  {
    id: 'c5',
    name: 'Arsenal',
    slug: 'arsenal',
    image:
      'https://images.unsplash.com/photo-1459865270687-1a22be176986?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Football fans in red cheering inside a stadium',
    crestColor: '#EF0107',
    crestInitials: 'ARS',
  },
  {
    id: 'c6',
    name: 'Chelsea',
    slug: 'chelsea',
    image:
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Football stadium exterior at dusk',
    crestColor: '#034694',
    crestInitials: 'CHE',
  },
]

export const destinations: Destination[] = [
  {
    id: 'd1',
    name: 'London',
    slug: 'london',
    image:
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'London skyline at twilight',
  },
  {
    id: 'd2',
    name: 'Manchester',
    slug: 'manchester',
    image:
      'https://images.unsplash.com/photo-1515586838455-8f8f940d6853?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Manchester city buildings',
  },
  {
    id: 'd3',
    name: 'Madrid',
    slug: 'madrid',
    image:
      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Madrid cityscape with historic architecture',
  },
  {
    id: 'd4',
    name: 'Barcelona',
    slug: 'barcelona',
    image:
      'https://images.unsplash.com/photo-1583422409516-2895a84ef416?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Barcelona skyline with Sagrada Família',
  },
  {
    id: 'd5',
    name: 'Rome',
    slug: 'rome',
    image:
      'https://images.unsplash.com/photo-1552832230-c0197dd311d5?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Colosseum and historic Rome at golden hour',
  },
  {
    id: 'd6',
    name: 'Paris',
    slug: 'paris',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Paris Eiffel Tower at dusk',
  },
]

export const categories: CategoryCard[] = [
  {
    id: 'cat-football',
    name: 'Football',
    slug: 'football',
    description: 'Premier League, Champions League and more',
    image:
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Footballer kicking a ball on the pitch',
  },
  {
    id: 'cat-concerts',
    name: 'Concerts',
    slug: 'concerts',
    description: 'Arena tours and stadium shows',
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Concert stage with dramatic lighting',
  },
  {
    id: 'cat-theatre',
    name: 'Theatre',
    slug: 'theatre',
    description: 'West End, Broadway and touring shows',
    image:
      'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Theatre stage with red curtains',
  },
  {
    id: 'cat-sports',
    name: 'Other Sports',
    slug: 'sports',
    description: 'NBA, F1, tennis and more',
    image:
      'https://images.unsplash.com/photo-1461896833974-ffe0ea4b0b0d?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Athletes competing in a stadium',
  },
]

export const footerColumns: FooterColumn[] = [
  {
    title: 'Events',
    links: [
      { label: 'Football', href: '/football/premier-league' },
      { label: 'Concerts', href: '/#concerts' },
      { label: 'Sports', href: '/#sports' },
      { label: 'Theatre', href: '/#theatre' },
      { label: 'Festivals', href: '/#festivals' },
      { label: 'All Events', href: '/' },
    ],
  },
  {
    title: 'Top Competitions',
    links: [
      { label: 'Premier League', href: '/football/premier-league' },
      { label: 'Champions League', href: '/football/champions-league' },
      { label: 'Europa League', href: '/football/europa-league' },
      { label: 'La Liga', href: '/football/la-liga' },
      { label: 'Serie A', href: '/football/serie-a' },
      { label: 'Bundesliga', href: '/football/bundesliga' },
      { label: 'All Competitions', href: '/football/premier-league' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Centre', href: '/#help' },
      { label: 'Contact Us', href: '/#contact' },
      { label: 'Booking Guide', href: '/#booking-guide' },
      { label: 'FAQs', href: '/#faqs' },
      { label: 'Terms & Conditions', href: '/#terms' },
      { label: 'Privacy Policy', href: '/#privacy' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/#about' },
      { label: 'Careers', href: '/#careers' },
      { label: 'Press', href: '/#press' },
      { label: 'Partner With Us', href: '/#partners' },
      { label: 'Affiliates', href: '/#affiliates' },
      { label: 'Blog', href: '/#blog' },
    ],
  },
]

export const newsletterTeams = [
  'Arsenal',
  'Aston Villa',
  'Bournemouth',
  'Brentford',
  'Brighton',
  'Chelsea',
  'Crystal Palace',
  'Everton',
  'Fulham',
  'Ipswich Town',
  'Leicester City',
  'Liverpool',
  'Manchester City',
  'Manchester United',
  'Newcastle United',
  'Nottingham Forest',
  'Southampton',
  'Tottenham Hotspur',
  'West Ham United',
  'Wolverhampton',
]

export const newsletterEuropean = [
  'Champions League',
  'Europa League',
  'Europa Conference League',
]

export const newsletterOther = [
  'La Liga',
  'Serie A',
  'Bundesliga',
  'Ligue 1',
  'FA Cup',
  'Carabao Cup',
  'World Cup',
  'Euro Championship',
]
