import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

// Tipagem para o match (pode ser movida para um arquivo types.ts)
interface Match {
  fixture: {
    id: number;
    date: string;
  };
  teams: {
    home: { name: string };
    away: { name: string };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const router = useRouter();

  const formattedDate = new Date(match.fixture.date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/matches/[id]',
          params: { id: String(match.fixture.id) },
        })
      }
    >
      <Text style={styles.title}>
        {match.teams.home.name} x {match.teams.away.name}
      </Text>
      <Text style={styles.date}>{formattedDate}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  date: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
});
