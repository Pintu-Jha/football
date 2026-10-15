export type MegaMenuLink = {
  label: string
  href: string
}

export type FootballCompetitionMenu = {
  id: string
  label: string
  href: string
  teams: MegaMenuLink[]
  popularMatches: MegaMenuLink[]
}

/** @deprecated Use `FootballCompetitionMenu` */
export type MegaMenuCompetition = FootballCompetitionMenu

const team = (label: string, href: string): MegaMenuLink => ({ label, href })
const match = (label: string, href: string): MegaMenuLink => ({ label, href })

const championsLeagueTeams: MegaMenuLink[] = [
  team('Real Madrid', '/football/champions-league#teams'),
  team('Barcelona', '/football/champions-league#teams'),
  team('Manchester United', '/football/premier-league#teams'),
  team('Liverpool', '/football/premier-league#teams'),
  team('Bayern Munich', '/football/champions-league#teams'),
  team('Manchester City', '/football/premier-league#teams'),
  team('Arsenal', '/football/premier-league#teams'),
  team('Chelsea', '/football/premier-league#teams'),
  team('PSG', '/football/champions-league#teams'),
  team('Inter Milan', '/football/serie-a#teams'),
  team('Aston Villa', '/football/premier-league#teams'),
  team('Tottenham Hotspur', '/football/premier-league#teams'),
]

const championsLeagueMatches: MegaMenuLink[] = [
  match('Real Madrid - Barcelona', '/match/madrid-vs-barcelona/tickets'),
  match('Manchester United - Liverpool', '/match/man-utd-vs-liverpool/tickets'),
  match('Bayern Munich - Borussia Dortmund', '/match/bayern-vs-dortmund/tickets'),
  match('Arsenal - Chelsea', '/match/arsenal-vs-chelsea/tickets'),
  match('Manchester City - Tottenham', '/football/premier-league'),
  match('PSG - Marseille', '/match/psg-vs-marseille/tickets'),
  match('Inter Milan - AC Milan', '/match/inter-vs-milan/tickets'),
  match('Juventus - Inter Milan', '/football/serie-a'),
  match('Atletico Madrid - Real Madrid', '/football/la-liga'),
  match('Barcelona - Atletico Madrid', '/football/la-liga'),
  match('Liverpool - Manchester City', '/match/liverpool-vs-man-city/tickets'),
  match('Other Popular Matches', '/football/premier-league'),
]

const premierLeagueTeams: MegaMenuLink[] = [
  team('Arsenal', '/football/premier-league#teams'),
  team('Aston Villa', '/football/premier-league#teams'),
  team('Chelsea', '/football/premier-league#teams'),
  team('Liverpool', '/football/premier-league#teams'),
  team('Manchester City', '/football/premier-league#teams'),
  team('Manchester United', '/football/premier-league#teams'),
  team('Newcastle United', '/football/premier-league#teams'),
  team('Tottenham Hotspur', '/football/premier-league#teams'),
  team('West Ham United', '/football/premier-league#teams'),
  team('Brighton', '/football/premier-league#teams'),
  team('Crystal Palace', '/football/premier-league#teams'),
  team('Everton', '/football/premier-league#teams'),
]

const premierLeagueMatches: MegaMenuLink[] = [
  match('Manchester United - Liverpool', '/match/man-utd-vs-liverpool/tickets'),
  match('Arsenal - Chelsea', '/match/arsenal-vs-chelsea/tickets'),
  match('Manchester City - Tottenham', '/football/premier-league'),
  match('Liverpool - Manchester City', '/match/liverpool-vs-man-city/tickets'),
  match('Chelsea - Manchester United', '/match/chelsea-vs-man-utd/tickets'),
  match('Tottenham Hotspur - Aston Villa', '/match/tottenham-vs-aston-villa/tickets'),
  match('Newcastle United - West Ham United', '/match/newcastle-vs-west-ham/tickets'),
  match('Other Popular Matches', '/football/premier-league'),
]

export const footballCompetitions: FootballCompetitionMenu[] = [
  {
    id: 'champions-league',
    label: 'Champions League',
    href: '/football/champions-league',
    teams: championsLeagueTeams,
    popularMatches: championsLeagueMatches,
  },
  {
    id: 'europa-league',
    label: 'UEFA Europa League',
    href: '/football/europa-league',
    teams: [
      team('Roma', '/football/europa-league'),
      team('Bayer Leverkusen', '/football/europa-league'),
      team('Manchester United', '/football/premier-league#teams'),
      team('Liverpool', '/football/premier-league#teams'),
      team('Tottenham Hotspur', '/football/premier-league#teams'),
      team('Aston Villa', '/football/premier-league#teams'),
      team('Porto', '/football/europa-league'),
      team('Ajax', '/football/europa-league'),
    ],
    popularMatches: championsLeagueMatches.slice(0, 8),
  },
  {
    id: 'turkey-super-league',
    label: 'Turkey Super League',
    href: '/football/premier-league',
    teams: [
      team('Galatasaray', '/football/premier-league'),
      team('Fenerbahçe', '/football/premier-league'),
      team('Beşiktaş', '/football/premier-league'),
      team('Trabzonspor', '/football/premier-league'),
    ],
    popularMatches: [
      match('Galatasaray - Fenerbahçe', '/match/galatasaray-vs-fenerbahce/tickets'),
      match('Fenerbahçe - Galatasaray', '/match/galatasaray-vs-fenerbahce/tickets'),
      match('Beşiktaş - Galatasaray', '/football/premier-league'),
      match('Other Popular Matches', '/football/premier-league'),
    ],
  },
  {
    id: 'premier-league',
    label: 'Premier League',
    href: '/football/premier-league',
    teams: premierLeagueTeams,
    popularMatches: premierLeagueMatches,
  },
  {
    id: 'la-liga',
    label: 'LaLiga',
    href: '/football/la-liga',
    teams: [
      team('Real Madrid', '/football/la-liga#teams'),
      team('Barcelona', '/football/la-liga#teams'),
      team('Atletico Madrid', '/football/la-liga#teams'),
      team('Sevilla', '/football/la-liga#teams'),
      team('Valencia', '/football/la-liga#teams'),
      team('Villarreal', '/football/la-liga#teams'),
    ],
    popularMatches: [
      match('Real Madrid - Barcelona', '/match/madrid-vs-barcelona/tickets'),
      match('Atletico Madrid - Real Madrid', '/football/la-liga'),
      match('Barcelona - Atletico Madrid', '/football/la-liga'),
      match('Other Popular Matches', '/football/la-liga'),
    ],
  },
  {
    id: 'serie-a',
    label: 'Serie A',
    href: '/football/serie-a',
    teams: [
      team('Inter Milan', '/football/serie-a#teams'),
      team('AC Milan', '/football/serie-a#teams'),
      team('Juventus', '/football/serie-a#teams'),
      team('Roma', '/football/serie-a#teams'),
      team('Napoli', '/football/serie-a#teams'),
      team('Lazio', '/football/serie-a#teams'),
    ],
    popularMatches: [
      match('Inter Milan - AC Milan', '/match/inter-vs-milan/tickets'),
      match('Juventus - Inter Milan', '/football/serie-a'),
      match('Other Popular Matches', '/football/serie-a'),
    ],
  },
  {
    id: 'bundesliga',
    label: 'Bundesliga',
    href: '/football/champions-league',
    teams: [
      team('Bayern Munich', '/football/champions-league#teams'),
      team('Borussia Dortmund', '/football/champions-league'),
      team('RB Leipzig', '/football/champions-league'),
      team('Bayer Leverkusen', '/football/champions-league'),
      team('Eintracht Frankfurt', '/football/champions-league'),
      team('VfB Stuttgart', '/football/champions-league'),
    ],
    popularMatches: [
      match('Bayern Munich - Borussia Dortmund', '/match/bayern-vs-dortmund/tickets'),
      match('Other Popular Matches', '/football/champions-league'),
    ],
  },
  {
    id: 'ligue-1',
    label: 'Ligue 1',
    href: '/football/ligue-1',
    teams: [
      team('PSG', '/football/ligue-1#teams'),
      team('Marseille', '/football/ligue-1#teams'),
      team('Monaco', '/football/ligue-1#teams'),
      team('Lyon', '/football/ligue-1#teams'),
      team('Lille', '/football/ligue-1#teams'),
    ],
    popularMatches: [
      match('PSG - Marseille', '/match/psg-vs-marseille/tickets'),
      match('Lille OSC - Stade Brestois', '/match/lille-vs-brestois/tickets'),
      match('Other Popular Matches', '/football/ligue-1'),
    ],
  },
  {
    id: 'national-teams',
    label: 'Football National Teams',
    href: '/football/premier-league',
    teams: [
      team('England', '/football/premier-league'),
      team('France', '/football/ligue-1'),
      team('Germany', '/football/champions-league'),
      team('Spain', '/football/la-liga'),
      team('Italy', '/football/serie-a'),
      team('Portugal', '/football/premier-league'),
    ],
    popularMatches: [
      match('Turkey - Belgium (2025 UEFA Nations League A)', '/match/turkey-vs-belgium/tickets'),
      match('Other Popular Matches', '/football/premier-league'),
    ],
  },
  {
    id: 'nations-league',
    label: 'Nations League',
    href: '/football/premier-league',
    teams: [
      team('England', '/football/premier-league'),
      team('France', '/football/ligue-1'),
      team('Spain', '/football/la-liga'),
      team('Italy', '/football/serie-a'),
      team('Belgium', '/football/premier-league'),
      team('Turkey', '/football/premier-league'),
    ],
    popularMatches: [
      match('Turkey - Belgium (2025 UEFA Nations League A)', '/match/turkey-vs-belgium/tickets'),
      match('Other Popular Matches', '/football/premier-league'),
    ],
  },
  {
    id: 'other-football',
    label: 'Other Football Tickets',
    href: '/football/premier-league',
    teams: championsLeagueTeams.slice(0, 8),
    popularMatches: [
      match('Other Popular Matches', '/football/premier-league'),
    ],
  },
]

/** @deprecated Use `footballCompetitions` */
export const megaMenuCompetitions = footballCompetitions

export type SimpleNavMenu = {
  label: string
  links: MegaMenuLink[]
}

export const simpleMenus: Record<
  'concerts' | 'sports' | 'theatre' | 'more',
  SimpleNavMenu
> = {
  concerts: {
    label: 'Concerts',
    links: [
      { label: 'Stadium Tours', href: '/#concerts' },
      { label: 'Arena Shows', href: '/#concerts' },
      { label: 'Festivals', href: '/#concerts' },
      { label: 'Jazz & Classical', href: '/#concerts' },
    ],
  },
  sports: {
    label: 'Sports',
    links: [
      { label: 'Basketball', href: '/#sports' },
      { label: 'Formula 1', href: '/#sports' },
      { label: 'Tennis', href: '/#sports' },
      { label: 'Rugby', href: '/#sports' },
    ],
  },
  theatre: {
    label: 'Theatre',
    links: [
      { label: 'Musicals', href: '/#theatre' },
      { label: 'West End', href: '/#theatre' },
      { label: 'Broadway', href: '/#theatre' },
      { label: 'Comedy', href: '/#theatre' },
    ],
  },
  more: {
    label: 'More',
    links: [
      { label: 'Theatre', href: '/#theatre' },
      { label: 'Musicals', href: '/#theatre' },
      { label: 'Gift Cards', href: '/#more' },
      { label: 'Travel Guides', href: '/#more' },
      { label: 'Sell Tickets', href: '/#sell' },
      { label: 'Help Centre', href: '/#help' },
    ],
  },
}

export type SimpleNavId = keyof typeof simpleMenus

/** Desktop nav matches design: Football, Concerts, Sports, Theatre, More */
export const navItems = [
  { id: 'football', label: 'Football', type: 'mega' as const },
  { id: 'concerts', label: 'Concerts', type: 'simple' as const },
  { id: 'sports', label: 'Sports', type: 'simple' as const },
  { id: 'theatre', label: 'Theatre', type: 'simple' as const },
  { id: 'more', label: 'More', type: 'simple' as const },
] as const

export function getSimpleNavMenu(id: string): SimpleNavMenu | undefined {
  if (id in simpleMenus) {
    return simpleMenus[id as SimpleNavId]
  }
  return undefined
}
