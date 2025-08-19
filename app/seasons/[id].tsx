import { api } from '@/services/api';
import {
  Icon,
  IndexPath,
  Layout,
  Select, SelectItem,
  TopNavigation,
  TopNavigationAction
} from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    home?: TeamInfo;
    away?: TeamInfo;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;

export default function TeamSeason() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState<number>(2021);
  const [seasonIndex, setSeasonIndex] = useState<IndexPath | null>(null);
  const seasons = [2021, 2022, 2023];
  const [flagSelected, setFlagSelected] = useState(false);

  useEffect(() => {
    if (!flagSelected) {
      setLoading(false);
      return;
    } 
    setLoading(true);

    const fetchMatches = async () => {
      try {
        const res = await api.get('/fixtures', { params: { team: 529, season } });
        setMatches(res.data.response || []);
      } catch (err) {
        console.error(err);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [season, flagSelected]);

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => router.back()} />
  );

  const renderMatch = ({ item }: { item: Match }) => {
    const date = new Date(item.fixture.date);
    const formattedDate = date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    const homeTeam = item.teams.home;
    const awayTeam = item.teams.away;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.card}
        onPress={() => router.push(`/matches/${item.fixture.id}`)}
      >
        <View style={styles.teamsRow}>
          <View style={styles.teamContainer}>
            {homeTeam?.logo && <Image source={{ uri: homeTeam.logo }} style={styles.logo} />}
            <Text style={styles.teamName}>{homeTeam?.name ?? '-'}</Text>
          </View>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{item.goals.home ?? '-'}</Text>
            <Text style={styles.scoreSeparator}>-</Text>
            <Text style={styles.scoreText}>{item.goals.away ?? '-'}</Text>
          </View>

          <View style={styles.teamContainer}>
            {awayTeam?.logo && <Image source={{ uri: awayTeam.logo }} style={styles.logo} />}
            <Text style={styles.teamName}>{awayTeam?.name ?? '-'}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.statusText}>{item.fixture.status.long}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1, padding: 16 }}>
        <TopNavigation
          title="Temporadas"
          alignment="center"
          accessoryLeft={renderBackAction}
        />

        <Select
          placeholder="Selecione a temporada"
          selectedIndex={seasonIndex ?? undefined}
          onSelect={(index) => {
            const selectedIndex = Array.isArray(index) ? index[0] : index;
            setTimeout(() => {
              setSeasonIndex(selectedIndex);
              setSeason(seasons[selectedIndex.row]);
              setFlagSelected(true);
            }, 0);
          }}
        >
          {seasons.map((s) => (
            <SelectItem key={s} title={s.toString()} />
          ))}
        </Select>

        {loading ? (
          <View style={[styles.container, styles.center]}>
            <ActivityIndicator size="large" />
          </View>
        ) : matches.length > 0 ? (
          <FlatList
            data={matches}
            keyExtractor={(item) => item.fixture.id.toString()}
            renderItem={renderMatch}
            contentContainerStyle={{ paddingBottom: 24, paddingTop: 16 }}
            showsVerticalScrollIndicator={false}
          />
        ) : flagSelected ? (
          <View style={[styles.container, styles.center]}>
            <Text style={styles.errorText}>Não foi possível carregar os jogos da temporada.</Text>
          </View>
        ) : (
          <Text style={styles.instructionText}>
            Por favor, selecione uma temporada para visualizar os jogos.
          </Text>
        )}
      </Layout>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8 },
  center: { justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  teamsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  teamContainer: { alignItems: 'center', flex: 1 },
  logo: { width: 40, height: 40, marginBottom: 6, resizeMode: 'contain' },
  teamName: { fontSize: 14, fontWeight: '600', textAlign: 'center', color: '#333' },
  scoreContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  scoreText: { fontSize: 22, fontWeight: '700', color: '#222' },
  scoreSeparator: { fontSize: 20, marginHorizontal: 4, color: '#888' },
  infoRow: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  statusText: { fontSize: 13, fontWeight: '500', color: '#555' },
  dateText: { fontSize: 13, fontWeight: '400', color: '#777' },
  errorText: { color: 'red', fontSize: 16 },
  instructionText: {
    marginTop: 20,
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    textAlign: 'center',
  },
});
