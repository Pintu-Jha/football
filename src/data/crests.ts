const CREST_BASE = 'https://crests.football-data.org'

/** football-data.org team ids keyed by the team names used in mock data */
const teamCrestIds: Record<string, number> = {
  Arsenal: 57,
  'Aston Villa': 58,
  Chelsea: 61,
  Everton: 62,
  Fulham: 63,
  Liverpool: 64,
  'Manchester City': 65,
  'Manchester United': 66,
  'Newcastle United': 67,
  'Tottenham Hotspur': 73,
  'Wolverhampton Wanderers': 76,
  Southampton: 340,
  'Bolton Wanderers': 1079,
  'Leeds United': 341,
  'West Brom': 74,
  'West Bromwich Albion': 74,
  'Norwich City': 68,
  'Cardiff City': 715,
  Sunderland: 71,
  'Sheffield United': 356,
  'Leicester City': 338,
  'Ipswich Town': 349,
  'Nottingham Forest': 351,
  'Crystal Palace': 354,
  Brighton: 397,
  Brentford: 402,
  'West Ham United': 563,
  Bournemouth: 1044,
  'Real Madrid': 86,
  Barcelona: 81,
  'Bayern Munich': 5,
  'Borussia Dortmund': 4,
  Roma: 100,
  'Bayer Leverkusen': 3,
  'Paris Saint-Germain': 524,
  'Inter Milan': 108,
  'AC Milan': 98,
}

export function getTeamCrest(teamName: string): string | undefined {
  const id = teamCrestIds[teamName]
  return id ? `${CREST_BASE}/${id}.png` : undefined
}

export function getCompetitionCrest(code: string | undefined): string | undefined {
  return code ? `${CREST_BASE}/${code}.png` : undefined
}
