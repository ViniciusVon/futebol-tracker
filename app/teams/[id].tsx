import { api } from '@/services/api';
import {
  Card,
  Icon,
  IndexPath,
  Layout,
  Select,
  SelectItem,
  Spinner,
  Tab,
  TabView,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

interface TeamDetail {
  team: {
    id: number;
    name: string;
    country: string;
    founded: number | null;
    national: boolean;
    logo: string;
  };
  venue: {
    id: number;
    name: string;
    address: string;
    city: string;
    capacity: number;
    surface: string;
    image: string;
  };
}

type HomeAwayTotal<T> = {
  home: T;
  away: T;
  total: T;
};

type GameResult = 'V' | 'D' | 'E';

type TimeInterval = 
  | "0-15" | "16-30" | "31-45" | "46-60" 
  | "61-75" | "76-90" | "91-105" | "106-120";

type StatsByTimeInterval = {
  [interval in TimeInterval]?: {
    total: number | null;
    percentage: number | null;
  }
};

interface LeagueInfo {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
}

interface TeamInfo {
  id: number;
  name: string;
  logo: string;
}

interface FixturesStats {
  played: HomeAwayTotal<number>;
  wins: HomeAwayTotal<number>;
  draws: HomeAwayTotal<number>;
  loses: HomeAwayTotal<number>;
}

interface GoalStats {
  total: HomeAwayTotal<number>;
  average: HomeAwayTotal<string>;
  minute: StatsByTimeInterval;
}

interface PenaltyStats {
  scored: {
    total: number;
    percentage: string;
  };
  missed: {
    total: number;
    percentage: string;
  };
  total: number;
}

interface Lineup {
  formation: string;
  played: number;
}

interface CardStats {
  yellow: StatsByTimeInterval;
  red: StatsByTimeInterval;
}

interface TeamStatistic {
  league: LeagueInfo;
  team: TeamInfo;
  form: GameResult[];
  fixtures: FixturesStats;
  goals: {
    for: GoalStats;
    against: GoalStats;
  };
  biggest: {
    streak: {
      wins: number;
      draws: number;
      loses: number;
    };
    wins: HomeAwayTotal<string>;
    loses: HomeAwayTotal<string>;
    goals: {
      for: HomeAwayTotal<number>;
      against: HomeAwayTotal<number>;
    };
  };
  clean_sheet: HomeAwayTotal<number>;
  failed_to_score: HomeAwayTotal<number>;
  penalty: PenaltyStats;
  lineups: Lineup[];
  cards: CardStats;
}

const StatisticsContent = ({ stats }: { stats: TeamStatistic }) => (
  <ScrollView showsVerticalScrollIndicator={false}>
    <Card style={styles.card} status="basic">
      <Text category="h6" style={styles.cardTitle}>Desempenho Geral</Text>
      <Layout style={styles.infoRow}>
        <Text appearance="hint">Forma:</Text>
        <Text category="s1">{stats.form.join(' ')}</Text>
      </Layout>
      <Layout style={styles.infoRow}>
        <Text appearance="hint">Total de Jogos:</Text>
        <Text category="s1">{stats.fixtures?.played.total}</Text>
      </Layout>
      <Layout style={styles.infoRow}>
        <Text appearance="hint">Vitórias:</Text>
        <Text category="s1" status="success">{stats.fixtures?.wins.total}</Text>
      </Layout>
      <Layout style={styles.infoRow}>
        <Text appearance="hint">Empates:</Text>
        <Text category="s1">{stats.fixtures?.draws.total}</Text>
      </Layout>
      <Layout style={styles.infoRow}>
        <Text appearance="hint">Derrotas:</Text>
        <Text category="s1" status="danger">{stats.fixtures?.loses.total}</Text>
      </Layout>
    </Card>

    <Card style={styles.card} status="basic">
      <Text category="h6" style={styles.cardTitle}>Gols Marcados</Text>
      <Layout style={styles.infoRow}>
        <Text appearance="hint">Total:</Text>
        <Text category="s1">{stats.goals?.for.total.total}</Text>
      </Layout>
      <Layout style={styles.infoRow}>
        <Text appearance="hint">Média por jogo:</Text>
        <Text category="s1">{stats.goals?.for.average}</Text>
      </Layout>
    </Card>

     <Card style={styles.card} status="basic">
      <Text category="h6" style={styles.cardTitle}>Gols Sofridos</Text>
      <Layout style={styles.infoRow}>
        <Text appearance="hint">Total:</Text>
        <Text category="s1">{stats.goals?.against.total.total}</Text>
      </Layout>
      <Layout style={styles.infoRow}>
        <Text appearance="hint">Média por jogo:</Text>
        <Text category="s1">{stats.goals?.against.average}</Text>
      </Layout>
    </Card>
  </ScrollView>
);

export default function TeamsDetail() {
  const router = useRouter();
  const { id, leagueId } = useLocalSearchParams();
  const [teamDetail, setTeamDetail] = useState<TeamDetail | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [statistics, setStatistics] = useState<TeamStatistic | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [availableLeagues, setAvailableLeagues] = useState<LeagueInfo[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<IndexPath | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [resTeam, resPlayers, resLeagues] = await Promise.all([
          api.get('/teams', { params: { id } }),
          api.get('/players', { params: { team: id, season: 2023 } }),
          api.get('/leagues', { params: { team: id, season: 2023 } })
        ]);

        setTeamDetail(resTeam.data.response[0]);
        setPlayers(resPlayers.data.response || []);
        
        const leaguesData = resLeagues.data.response.map((item: { league: LeagueInfo }) => item.league);
        setAvailableLeagues(leaguesData);

        if (leagueId && leaguesData.length > 0) {
          const initialIndex = leaguesData.findIndex((l: LeagueInfo) => l.id === Number(leagueId));
          if (initialIndex !== -1) {
            setSelectedLeague(new IndexPath(initialIndex));
          }
        }
        
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, leagueId]);

  const fetchStatistics = useCallback(async () => {
    if (!selectedLeague || availableLeagues.length === 0) {
      setStatistics(null);
      return;
    }

    try {
      setIsStatsLoading(true);
      setStatistics(null);

      const selectedLeagueId = availableLeagues[selectedLeague.row].id;
      
      const resStats = await api.get('/teams/statistics', { 
        params: { team: id, season: 2023, league: selectedLeagueId } 
      });

      const statsData = resStats.data.response;
      if (statsData) {
        setStatistics({
          ...statsData,
          form: (statsData.form || '').split('') as GameResult[],
        });
      }
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
    } finally {
      setIsStatsLoading(false);
    }
  }, [id, selectedLeague, availableLeagues]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const handleLeagueSelect = useCallback((index: IndexPath | IndexPath[]) => {
    setSelectedLeague(index as IndexPath);
  }, []);

  const renderBackAction = () => (
    <TopNavigationAction
      icon={(props) => <Icon {...props} name="arrow-back" />}
      onPress={() => router.back()}
    />
  );

  if (loading) {
    return (
      <Layout style={[styles.container, styles.center]}>
        <Spinner size="large" />
      </Layout>
    );
  }

  if (!teamDetail) {
    return (
      <Layout style={[styles.container, styles.center]}>
        <Text status="danger" category="s1">
          Não foi possível carregar os dados do time.
        </Text>
      </Layout>
    );
  }

  const { team, venue } = teamDetail;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1 }}>
        <TopNavigation
          title="Detalhes do Time"
          alignment="center"
          accessoryLeft={renderBackAction}
        />

        <TabView
          selectedIndex={selectedIndex}
          onSelect={(index) => setSelectedIndex(index)}
          style={{ flex: 1 }}
        >
          {/* Aba Time */}
          <Tab title="Time">
            <Layout style={styles.tabContent}>
              <Card style={styles.card} status="basic">
                <Image source={{ uri: team.logo }} style={styles.logo} />
                <Text category="h5" style={styles.name}>
                  {team.name}
                </Text>
                <Layout style={styles.infoRow}>
                  <Text category="s1" appearance="hint">País:</Text>
                  <Text category="s1">{team.country}</Text>
                </Layout>
                <Layout style={styles.infoRow}>
                  <Text category="s1" appearance="hint">Fundado:</Text>
                  <Text category="s1">{team.founded ?? '---'}</Text>
                </Layout>
                <Layout style={styles.infoRow}>
                  <Text category="s1" appearance="hint">Tipo:</Text>
                  <Text category="s1">{team.national ? 'Seleção Nacional' : 'Clube'}</Text>
                </Layout>
              </Card>
            </Layout>
          </Tab>

          {/* Aba Estádio */}
          <Tab title="Estádio">
            <Layout style={styles.tabContent}>
              <Card style={styles.card} status="basic">
                <Text category="h6" style={{ marginBottom: 12 }}>Estádio</Text>
                <Image source={{ uri: venue.image }} style={styles.venueImage} />
                <Text category="s1" style={{ fontWeight: '600' }}>{venue.name}</Text>
                <Text appearance="hint">{venue.address}</Text>
                <Text appearance="hint">{venue.city}</Text>
                <Layout style={styles.infoRow}>
                  <Text category="s1" appearance="hint">Capacidade:</Text>
                  <Text category="s1">{venue.capacity.toLocaleString()}</Text>
                </Layout>
                <Layout style={styles.infoRow}>
                  <Text category="s1" appearance="hint">Superfície:</Text>
                  <Text category="s1">{venue.surface}</Text>
                </Layout>
              </Card>
            </Layout>
          </Tab>

          {/* Aba Jogadores */}
          <Tab title="Jogadores">
            <Layout style={styles.tabContent}>
              <FlatList
                data={players}
                keyExtractor={(item) => item.player.id.toString()}
                renderItem={({ item }) => (
                  <Card
                    style={[styles.card, { flexDirection: 'row', alignItems: 'center' }]}
                    status="basic"
                    onPress={() => {
                      router.push(`/players/${item.player?.id}`);
                    }}
                  >
                    <Image source={{ uri: item.player.photo }} style={styles.playerPhoto} />
                    <Text category="s1" style={{ marginLeft: 12 }}>
                      {item.player.name}
                    </Text>
                  </Card>
                )}
              />
            </Layout>
          </Tab>
          {/*Tab de Estatísticas*/}
          <Tab title="Estatísticas">
            <Layout style={styles.tabContent}>
              <Select
                style={{ marginBottom: 16 }}
                placeholder="Selecione uma liga"
                value={selectedLeague ? availableLeagues[selectedLeague.row].name : ''}
                selectedIndex={selectedLeague}
                onSelect={handleLeagueSelect}
              >
                {availableLeagues.map((league) => (
                  <SelectItem
                    key={league.id}
                    title={league.name}
                    accessoryLeft={(props) => (
                      <Image
                        style={[props?.style, styles.leagueLogoInSelect]}
                        source={{ uri: league.logo }}
                      />
                    )}
                  />
                ))}
              </Select>
              
              {isStatsLoading ? (
                <Layout style={styles.center}>
                  <Spinner size="large" />
                </Layout>
              ) : statistics ? (
                <StatisticsContent stats={statistics} />
              ) : (
                <Layout style={styles.center}>
                  <Text appearance="hint">
                    Selecione uma liga para ver as estatísticas.
                  </Text>
                </Layout>
              )}
            </Layout>
          </Tab>
        </TabView>
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { justifyContent: 'center', alignItems: 'center' },
  tabContent: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  card: { borderRadius: 12, padding: 16, marginBottom: 12 },
  logo: { width: 80, height: 80, marginBottom: 16, resizeMode: 'contain', alignSelf: 'center' },
  venueImage: { width: '100%', height: 150, marginBottom: 12, borderRadius: 8 },
  name: { marginBottom: 12, color: '#222B45', textAlign: 'center' },
  infoRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  playerPhoto: { width: 50, height: 50, borderRadius: 25 },
  cardTitle: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF1F7',
    paddingBottom: 8,
  },
  leagueLogoInSelect: {
    width: 24,
    height: 24,
    marginRight: 8,
  }
});
