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

export interface Match {
  fixture: Fixture;
  league?: { name: string; season: string; round: string };
  teams: { home: Team; away: Team };
  goals?: { home: number; away: number };
  events?: Event[];
  lineups?: Lineup[];
  players?: { team: Team; players: { player: Player }[] }[];
  statistics?: TeamStatistics[];
}

export interface PlayerWithStats {
  player?: {
    name: string;
    photo?: string;
  };
  statistics: {
    games: {
      minutes: number;
      position: string;
      rating: string;
    };
    goals: {
      total: number | null;
      assists: number | null;
    };
  }[];
}

