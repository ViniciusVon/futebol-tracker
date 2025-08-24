export interface Team {
  id: number;
  name: string;
  logo: string;
}

export interface GameStats {
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals: {
    for: number;
    against: number;
  };
}

export interface Standing {
  rank: number;
  team: Team;
  points: number;
  goalsDiff: number;
  all: GameStats;
  group?: string;
}

export interface LeagueData {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
}