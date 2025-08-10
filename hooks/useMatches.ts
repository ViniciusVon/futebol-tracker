import { api } from '@/services/api';
import { useEffect, useState } from 'react';

export function useMatches() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await api.get('/fixtures?league=71&season=2023');
      setMatches(response.data.response);
    }
    fetchData();
  }, []);

  return matches;
}
