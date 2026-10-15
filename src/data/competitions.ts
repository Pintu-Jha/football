import type { Competition } from './types'

export const competitions: Competition[] = [
  {
    id: 'premier-league',
    slug: 'premier-league',
    name: 'Premier League',
    region: 'England',
    country: 'England',
    image:
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Premier League stadium under floodlights at night',
    description:
      'Buy and sell Premier League tickets for all matches. Experience world-class football at the biggest stadiums in England.',
    longDescription:
      'The Premier League is the most watched football league in the world, featuring 20 iconic clubs including Manchester United, Liverpool, Arsenal, Manchester City, Tottenham Hotspur and more. Known for its fast-paced football, world-class players and passionate fans, the Premier League delivers unforgettable moments at legendary stadiums across England.',
    tagline:
      'The Premier League is the most popular football league in the world, featuring 20 of the best teams competing for the title every season.',
    about: [
      'The Premier League is the most popular football league in the world, featuring 20 of the best teams competing for the title every season. From historic clubs like Manchester United, Liverpool, Arsenal, and Chelsea to rising contenders, every match delivers unforgettable moments. Secure your Premier League tickets and be part of the action live at iconic stadiums across England.',
      'With world-class players, passionate fans, and legendary stadiums, the Premier League offers an unmatched football experience. Whether you\u2019re supporting your favourite team or simply love the beautiful game, attending a Premier League match is a memory that lasts a lifetime. Find tickets for regular season fixtures, big derbies, and end-of-season matches at the best prices.',
      'Every season runs from August to May, with each club playing 38 matches \u2014 19 at home and 19 away. Demand peaks for derbies such as the North London Derby, the Manchester Derby and Liverpool vs Manchester United, so compare partner offers early to secure the best seats at the best prices.',
    ],
    teamsCount: 20,
    matchesPerSeason: 380,
    founded: 1992,
    popularity: 'Global',
    popularityLabel: 'Most Popular League',
    logoLabel: 'PL',
    crestCode: 'PL',
  },
  {
    id: 'champions-league',
    slug: 'champions-league',
    name: 'Champions League',
    region: 'Europe',
    country: 'Europe',
    image:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Champions League night atmosphere in a packed stadium',
    description:
      'Europe’s elite club competition. Find and compare Champions League tickets across group and knockout stages.',
    longDescription:
      'UEFA Champions League brings together the best clubs in Europe for a season of unforgettable nights. From the group stage through to the final, compare partner offers for every fixture.',
    teamsCount: 36,
    matchesPerSeason: 189,
    founded: 1955,
    popularity: 'Europe’s Premier Club Competition',
    logoLabel: 'UCL',
  },
  {
    id: 'europa-league',
    slug: 'europa-league',
    name: 'Europa League',
    region: 'Europe',
    country: 'Europe',
    image:
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'European night match with orange stadium lights',
    description:
      'Compare tickets for UEFA Europa League fixtures across Europe’s top clubs.',
    longDescription:
      'The UEFA Europa League offers competitive midweek football and memorable away nights. Browse partner prices for upcoming ties.',
    teamsCount: 36,
    matchesPerSeason: 141,
    founded: 1971,
    popularity: 'Major European Competition',
    logoLabel: 'UEL',
  },
  {
    id: 'la-liga',
    slug: 'la-liga',
    name: 'La Liga',
    region: 'Spain',
    country: 'Spain',
    image:
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Spanish football stadium filled with fans',
    description:
      'Spain’s top division. Compare La Liga tickets for El Clásico and every weekend fixture.',
    longDescription:
      'La Liga is known for technical football and world-famous clubs. Secure seats by comparing trusted partner offers.',
    teamsCount: 20,
    matchesPerSeason: 380,
    founded: 1929,
    popularity: 'Spain’s Top Division',
    logoLabel: 'LL',
  },
  {
    id: 'serie-a',
    slug: 'serie-a',
    name: 'Serie A',
    region: 'Italy',
    country: 'Italy',
    image:
      'https://images.unsplash.com/photo-1489944440615-453fc71ff44a?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Italian football match atmosphere',
    description:
      'Italy’s Serie A delivers passion and history. Compare tickets for Milan, Rome, Turin and more.',
    longDescription:
      'Serie A clubs play in some of Europe’s most atmospheric venues. Compare partner prices before you book.',
    teamsCount: 20,
    matchesPerSeason: 380,
    founded: 1898,
    popularity: 'Italy’s Top Division',
    logoLabel: 'SA',
  },
  {
    id: 'championship',
    slug: 'championship',
    name: 'Championship',
    region: 'England',
    country: 'England',
    image:
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'English Championship football stadium',
    description:
      'England’s fiercely competitive second tier. Compare Championship tickets from trusted partners.',
    longDescription:
      'The EFL Championship is known for intensity, promotion races and packed grounds every weekend.',
    teamsCount: 24,
    matchesPerSeason: 552,
    founded: 2004,
    popularity: 'England Second Tier',
    logoLabel: 'EFL',
  },
  {
    id: 'ligue-1',
    slug: 'ligue-1',
    name: 'Ligue 1',
    region: 'France',
    country: 'France',
    image:
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'French Ligue 1 stadium under lights',
    description:
      'France’s top flight. Compare Ligue 1 tickets for Paris, Marseille, Lyon and more.',
    longDescription:
      'Ligue 1 blends elite talent with passionate support. Compare partner offers for every matchday.',
    teamsCount: 18,
    matchesPerSeason: 306,
    founded: 1932,
    popularity: 'France’s Top Division',
    logoLabel: 'L1',
  },
]

export function getCompetitionBySlug(slug: string): Competition | undefined {
  return competitions.find((c) => c.slug === slug)
}
