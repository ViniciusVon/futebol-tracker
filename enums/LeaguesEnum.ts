export interface League {
  id: number;
  name: string;
  logo: string;
  country: string;
}

export const ALL_LEAGUES: League[] = [
  // Inglaterra
  { id: 39, name: 'Premier League', country: 'Inglaterra', logo: 'https://media.api-sports.io/football/leagues/39.png' },
  { id: 40, name: 'Championship', country: 'Inglaterra', logo: 'https://media.api-sports.io/football/leagues/40.png' },

  // Espanha
  { id: 140, name: 'La Liga', country: 'Espanha', logo: 'https://media.api-sports.io/football/leagues/140.png' },
  { id: 141, name: 'La Liga 2', country: 'Espanha', logo: 'https://media.api-sports.io/football/leagues/141.png' },

  // Itália
  { id: 135, name: 'Serie A', country: 'Itália', logo: 'https://media.api-sports.io/football/leagues/135.png' },
  { id: 136, name: 'Serie B', country: 'Itália', logo: 'https://media.api-sports.io/football/leagues/136.png' },

  // Alemanha
  { id: 78, name: 'Bundesliga', country: 'Alemanha', logo: 'https://media.api-sports.io/football/leagues/78.png' },
  { id: 79, name: '2. Bundesliga', country: 'Alemanha', logo: 'https://media.api-sports.io/football/leagues/79.png' },

  // França
  { id: 61, name: 'Ligue 1', country: 'França', logo: 'https://media.api-sports.io/football/leagues/61.png' },
  { id: 62, name: 'Ligue 2', country: 'França', logo: 'https://media.api-sports.io/football/leagues/62.png' },

  // Portugal
  { id: 94, name: 'Primeira Liga', country: 'Portugal', logo: 'https://media.api-sports.io/football/leagues/94.png' },
  { id: 95, name: 'Segunda Liga', country: 'Portugal', logo: 'https://media.api-sports.io/football/leagues/95.png' },

  // Holanda
  { id: 88, name: 'Eredivisie', country: 'Holanda', logo: 'https://media.api-sports.io/football/leagues/88.png' },
  { id: 89, name: 'Eerste Divisie', country: 'Holanda', logo: 'https://media.api-sports.io/football/leagues/89.png' },

  // Brasil
  { id: 71, name: 'Brasileirão Série A', country: 'Brasil', logo: 'https://media.api-sports.io/football/leagues/71.png' },
  { id: 72, name: 'Brasileirão Série B', country: 'Brasil', logo: 'https://media.api-sports.io/football/leagues/72.png' },

  // Argentina
  { id: 128, name: 'Liga Profesional', country: 'Argentina', logo: 'https://media.api-sports.io/football/leagues/128.png' },
  { id: 129, name: 'Primera Nacional', country: 'Argentina', logo: 'https://media.api-sports.io/football/leagues/129.png' },
  
  // EUA
  { id: 253, name: 'Major League Soccer (MLS)', country: 'EUA', logo: 'https://media.api-sports.io/football/leagues/253.png' },

  
  { id: 2, name: 'UEFA Champions League', country: 'Internacional', logo: 'https://media.api-sports.io/football/leagues/2.png' },
  { id: 3, name: 'UEFA Europa League', country: 'Internacional', logo: 'https://media.api-sports.io/football/leagues/3.png' },
  { id: 13, name: 'Copa Libertadores', country: 'Internacional', logo: 'https://media.api-sports.io/football/leagues/13.png' },
  { id: 11, name: 'Copa Sudamericana', country: 'Internacional', logo: 'https://media.api-sports.io/football/leagues/11.png' },
];

const groupLeaguesByCountry = () => {
  return ALL_LEAGUES.reduce((acc, league) => {
    const { country, ...leagueData } = league;
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(leagueData);
    return acc;
  }, {} as { [country: string]: Omit<League, 'country'>[] });
};

export const leaguesByCountry = groupLeaguesByCountry();

export const leaguesSections = Object.entries(leaguesByCountry).map(([title, data]) => ({
  title,
  data,
}));