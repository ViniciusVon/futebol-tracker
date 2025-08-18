import { api } from '@/services/api';
import { useEffect, useState } from 'react';

interface TeamStanding {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  played: number;
  win: number;
  draw: number;
  lose: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
}

interface LeagueData {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
}

export function useStandings(leagueId: number, season: number) {
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [leagueData, setLeagueData] = useState<LeagueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);

        const res = await api.get('/standings', {
          params: { league: leagueId, season },
        });

        const leagueInfo = res.data.response?.[0]?.league || null;
        const rawStandings = leagueInfo?.standings?.[0] || [];

        const formattedStandings = rawStandings.map((team: any) => ({
          rank: team.rank,
          team: team.team,
          points: team.points,
          played: team.all.played,
          win: team.all.win,
          draw: team.all.draw,
          lose: team.all.lose,
          goalsFor: team.all.goals.for,
          goalsAgainst: team.all.goals.against,
          goalDiff: team.goalsDiff,
        }));

        setStandings(formattedStandings);

        if (leagueInfo) {
          setLeagueData({
            id: leagueInfo.id,
            name: leagueInfo.name,
            country: leagueInfo.country,
            logo: leagueInfo.logo,
            flag: leagueInfo.flag,
            season: leagueInfo.season,
          });
        } else {
          setLeagueData(null);
        }
      } catch (err) {
        console.error('Erro ao buscar standings:', err);
        setStandings([]);
        setLeagueData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [leagueId, season]);

  return { standings, leagueData, loading };
}
