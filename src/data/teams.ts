import type { Team } from './types'

const plTeamsSeed: Array<[string, string, string, string]> = [
  ['arsenal', 'Arsenal', 'London', '#EF0107'],
  ['aston-villa', 'Aston Villa', 'Birmingham', '#670E36'],
  ['bournemouth', 'Bournemouth', 'Bournemouth', '#DA291C'],
  ['brentford', 'Brentford', 'London', '#E30613'],
  ['chelsea', 'Chelsea', 'London', '#034694'],
  ['crystal-palace', 'Crystal Palace', 'London', '#1B458F'],
  ['everton', 'Everton', 'Liverpool', '#003399'],
  ['ipswich', 'Ipswich Town', 'Ipswich', '#0044AA'],
  ['leicester', 'Leicester City', 'Leicester', '#003090'],
  ['liverpool', 'Liverpool', 'Liverpool', '#C8102E'],
  ['man-city', 'Manchester City', 'Manchester', '#6CABDD'],
  ['man-utd', 'Manchester United', 'Manchester', '#DA291C'],
  ['nottingham', 'Nottingham Forest', 'Nottingham', '#DD0000'],
  ['southampton', 'Southampton', 'Southampton', '#D71920'],
  ['tottenham', 'Tottenham Hotspur', 'London', '#132257'],
  ['newcastle', 'Newcastle United', 'Newcastle', '#241F20'],
  ['west-ham', 'West Ham United', 'London', '#7A263A'],
  ['wolves', 'Wolverhampton Wanderers', 'Wolverhampton', '#FDB913'],
  ['fulham', 'Fulham', 'London', '#000000'],
  ['brighton', 'Brighton', 'Brighton', '#0057B8'],
]

export const teams: Team[] = [
  ...plTeamsSeed.map(([slug, name, city, color]) => ({
    id: `pl-${slug}`,
    slug,
    name,
    competitionId: 'premier-league',
    city,
    eventsCount: 28,
    crestColor: color,
    crestInitials: name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 3)
      .toUpperCase(),
  })),
  {
    id: 'cl-real-madrid',
    slug: 'real-madrid',
    name: 'Real Madrid',
    competitionId: 'champions-league',
    city: 'Madrid',
    eventsCount: 12,
    crestColor: '#FEBE10',
    crestInitials: 'RM',
  },
  {
    id: 'cl-barcelona',
    slug: 'barcelona',
    name: 'Barcelona',
    competitionId: 'champions-league',
    city: 'Barcelona',
    eventsCount: 12,
    crestColor: '#A50044',
    crestInitials: 'FCB',
  },
  {
    id: 'cl-bayern',
    slug: 'bayern-munich',
    name: 'Bayern Munich',
    competitionId: 'champions-league',
    city: 'Munich',
    eventsCount: 12,
    crestColor: '#DC052D',
    crestInitials: 'FCB',
  },
  {
    id: 'cl-psg',
    slug: 'psg',
    name: 'Paris Saint-Germain',
    competitionId: 'champions-league',
    city: 'Paris',
    eventsCount: 12,
    crestColor: '#004170',
    crestInitials: 'PSG',
  },
  {
    id: 'cl-inter',
    slug: 'inter-milan',
    name: 'Inter Milan',
    competitionId: 'champions-league',
    city: 'Milan',
    eventsCount: 12,
    crestColor: '#010E80',
    crestInitials: 'INT',
  },
  {
    id: 'cl-dortmund',
    slug: 'dortmund',
    name: 'Borussia Dortmund',
    competitionId: 'champions-league',
    city: 'Dortmund',
    eventsCount: 12,
    crestColor: '#FDE100',
    crestInitials: 'BVB',
  },
]

export function getTeamsByCompetition(competitionId: string): Team[] {
  return teams.filter((t) => t.competitionId === competitionId)
}

export const premierLeagueTeamNames = plTeamsSeed.map(([, name]) => name)
