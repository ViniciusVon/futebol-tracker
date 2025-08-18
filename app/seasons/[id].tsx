import BackButton from '@/components/BackButton';
import { api } from '@/services/api';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';

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

export default function TeamSeason() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/fixtures', { 
          params: { team: 529, season: 2024 }
        });
        setMatches(res.data.response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!matches.length) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>
          Não foi possível carregar os jogos da temporada.
        </Text>
      </View>
    );
  }

  const renderMatch = ({ item }: { item: Match }) => {
    const date = new Date(item.fixture.date);
    const formattedDate = date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={styles.card}>
        <View style={styles.teamsRow}>
          <View style={styles.teamContainer}>
            {item.teams.home.logo && (
              <Image source={{ uri: item.teams.home.logo }} style={styles.logo} />
            )}
            <Text style={styles.teamName}>{item.teams.home.name}</Text>
          </View>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{item.goals.home ?? '-'}</Text>
            <Text style={styles.scoreSeparator}>-</Text>
            <Text style={styles.scoreText}>{item.goals.away ?? '-'}</Text>
          </View>

          <View style={styles.teamContainer}>
            {item.teams.away.logo && (
              <Image source={{ uri: item.teams.away.logo }} style={styles.logo} />
            )}
            <Text style={styles.teamName}>{item.teams.away.name}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.statusText}>{item.fixture.status.long}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <FlatList
        data={matches}
        keyExtractor={(item) => item.fixture.id.toString()}
        renderItem={renderMatch}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
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
    marginBottom: 12,
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
    width: 40,
    height: 40,
    marginBottom: 6,
    resizeMode: 'contain',
  },
  teamName: {
    fontSize: 14,
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
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  scoreSeparator: {
    fontSize: 20,
    marginHorizontal: 4,
    color: '#888',
  },
  infoRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
  },
  dateText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#777',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
