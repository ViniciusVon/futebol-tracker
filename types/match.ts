export interface Team {
  id: number;
  name: string;
  logo?: string;
}

export interface Player {
  id: number;
  name: string;
  photo?: string;
  nationality?: string;
  age?: number;
  position?: string;
}

export interface Event {
  id: number;
  type: 'Goal' | 'Card' | 'Substitution' | string;
  detail?: 'Yellow Card' | 'Red Card';
  time: { elapsed: number };
  player?: Player;
  assist?: Player;
  team?: Team;
}

export interface Lineup {
  team: Team;
  formation: string;
  coach?: Player;
  startXI: { player: Player }[];
  substitutes: { player: Player }[];
}

export interface Statistic {
  type: string;
  value: string | number;
}

export interface TeamStatistics {
  team: Team;
  statistics: Statistic[];
}

export interface Fixture {
  id: number;
  date: string;
  status: { long: string };
  venue?: { name: string; city: string };
  referee?: string;
}

export interface GamesStats {
  minutes: number;
  number: number;
  position: string;
  rating: string;
  captain: boolean;
  substitute: boolean;
}

export interface GoalsStats {
  total: number | null;
  conceded: number;
  assists: number | null;
  saves: number;
}

export interface PassesStats {
  total: number;
  key: number;
  accuracy: string;
}

export interface StatisticsBlock {
  games: GamesStats;
  offsides: null;
  shots: { total: number; on: number };
  goals: GoalsStats;
  passes: PassesStats;
  tackles: { total: number | null; blocks: number; interceptions: number };
  duels: { total: number | null; won: number | null };
  dribbles: { attempts: number; success: number; past: number | null };
  fouls: { drawn: number; committed: number };
  cards: { yellow: number; red: number };
  penalty: { won: null; commited: null; scored: number; missed: number; saved: number };
}

export interface PlayerWithStats {
  player: Player;
  statistics: StatisticsBlock[];
}

export interface TeamPlayerData {
  team: Team;
  players: PlayerWithStats[];
}

export interface Match {
  fixture: Fixture;
  league?: { name: string; season: string; round: string };
  teams: { home: Team; away: Team };
  goals?: { home: number; away: number };
  events?: Event[];
  lineups?: Lineup[];
  players?: TeamPlayerData[];
  statistics?: TeamStatistics[];
}