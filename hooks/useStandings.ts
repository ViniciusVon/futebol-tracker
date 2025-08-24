import { api } from '@/services/api';
import { LeagueData, Standing } from '@/types';
import { useEffect, useState } from 'react';

export function useStandings(leagueId: number, season: number) {
  const [standings, setStandings] = useState<Standing[][]>([]); 
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
        
        const rawStandingsGroups = leagueInfo?.standings || [];

        if (Array.isArray(rawStandingsGroups[0])) {
            setStandings(rawStandingsGroups);
        } else {
            setStandings([rawStandingsGroups]);
        }

        if (leagueInfo) {
          setLeagueData({
            id: leagueInfo.id,
            name: leagueInfo.name,
            country: leagueInfo.country,
            logo: leagueInfo.logo,
            flag: leagueInfo.flag,
            season: leagueInfo.season,
          });
        }
      } catch (err) {
        console.error('Erro ao buscar standings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [leagueId, season]);

  return { standings, leagueData, loading };
}