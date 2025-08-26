export interface Player {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  photo: string;
}

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface League {
  id: number;
  name: string;
  logo: string;
}

interface GamesStats {
  appearences: number | null;
  lineups: number | null;
  minutes: number | null;
}

interface GoalsStats {
  total: number | null;
  assists: number | null;
}

interface ShotsStats {
  total: number | null;
  on: number | null;
}

interface PassesStats {
  total: number | null;
  key: number | null;
  accuracy: number | null;
}

interface TacklesStats {
  total: number | null;
  blocks: number | null;
  interceptions: number | null;
}

interface CardsStats {
  yellow: number | null;
  red: number | null;
}

interface SubstitutesStats {
  in: number | null;
  out: number | null;
  bench: number | null;
}

export interface Statistics {
  team: Team;
  league: League;
  games: GamesStats;
  goals: GoalsStats;
  shots: ShotsStats;
  passes: PassesStats;
  tackles: TacklesStats;
  cards: CardsStats;
  substitutes: SubstitutesStats;
}

export interface PlayerData {
  player: Player;
  statistics: Statistics[];
}

export interface AggregatedStats {
  games: { appearences: number; lineups: number; minutes: number };
  goals: { total: number; assists: number };
  shots: { total: number };
  passes: { total: number };
  tackles: { total: number };
  cards: { yellow: number; red: number };
  substitutes: { in: number; out: number; bench: number };
}