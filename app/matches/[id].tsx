import BackButton from '@/components/BackButton';
import { api } from '@/services/api';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

// Tipagem do match (mova para types.ts se preferir)
interface TeamInfo {
  name: string;
  logo?: string;
}
interface Match {
  fixture: {
    id: number;
    date: string;
    status: { long: string };
  };
  teams: {
    home: TeamInfo;
    away: TeamInfo;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

export default function MatchDetail() {
  const { id } = useLocalSearchParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/fixtures', { params: { id } });
        setMatch(res.data.response[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!match) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>
          Não foi possível carregar a partida.
        </Text>
      </View>
    );
  }

  const date = new Date(match.fixture.date);
  const formattedDate = date.toLocaleString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.container}>
      <BackButton />

      <View style={styles.card}>
        <View style={styles.teamsRow}>
          <View style={styles.teamContainer}>
            {match.teams.home.logo && (
              <Image
                source={{ uri: match.teams.home.logo }}
                style={styles.logo}
              />
            )}
            <Text style={styles.teamName}>{match.teams.home.name}</Text>
          </View>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{match.goals.home ?? '-'}</Text>
            <Text style={styles.scoreSeparator}>-</Text>
            <Text style={styles.scoreText}>{match.goals.away ?? '-'}</Text>
          </View>

          <View style={styles.teamContainer}>
            {match.teams.away.logo && (
              <Image
                source={{ uri: match.teams.away.logo }}
                style={styles.logo}
              />
            )}
            <Text style={styles.teamName}>{match.teams.away.name}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.statusText}>{match.fixture.status.long}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#222',
  },
  scoreSeparator: {
    fontSize: 24,
    marginHorizontal: 4,
    color: '#888',
  },
  infoRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#777',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
