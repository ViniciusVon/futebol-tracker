import { api } from '@/services/api';
import { AggregatedStats, PlayerData, Statistics } from '@/types/player';
import {
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
import React, { useEffect, useMemo, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;

const statsMapping: { [key: string]: { [subkey: string]: string } } = {
    games: {
        appearences: 'Aparições',
        lineups: 'Titular',
        minutes: 'Minutos Jogados',
    },
    goals: {
        total: 'Gols',
        assists: 'Assistências',
    },
    shots: {
        total: 'Finalizações',
    },
    passes: {
        total: 'Passes',
    },
    tackles: {
        total: 'Desarmes',
    },
    cards: {
        yellow: 'Cartões Amarelos',
        red: 'Cartões Vermelhos',
    },
    substitutes: {
        in: 'Entrou',
        out: 'Substituído',
        bench: 'Banco',
    },
};


export default function PlayerDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTeamTab, setSelectedTeamTab] = useState(0);
  const [selectedCompetitionPerTab, setSelectedCompetitionPerTab] = useState<
    Record<number, IndexPath | null>
  >({});

  const player = playerData?.player;
  const statistics = playerData?.statistics || [];

  const statsByTeam = useMemo(() => {
    const grouped: Record<string, Statistics[]> = {};
    statistics.forEach((stat) => {
      const teamName = stat.team.name;
      if (!grouped[teamName]) grouped[teamName] = [];
      grouped[teamName].push(stat);
    });
    return grouped;
  }, [statistics]);

  const teamNames = ['Visão Geral', ...Object.keys(statsByTeam)];

  const statsPerTab = useMemo(() => {
    return teamNames.map((team, i) => {
      const teamStats = i === 0 ? statistics : statsByTeam[team] || [];
      const selectedCompetition = selectedCompetitionPerTab[i] || null;

      if (!selectedCompetition || selectedCompetition.row === 0) {
        return teamStats.reduce(
          (acc: AggregatedStats, s: Statistics) => {
            acc.games.appearences += s.games.appearences || 0;
            acc.games.lineups += s.games.lineups || 0;
            acc.games.minutes += s.games.minutes || 0;
            acc.goals.total += s.goals.total || 0;
            acc.goals.assists += s.goals.assists || 0;
            acc.shots.total += s.shots.total || 0;
            acc.passes.total += s.passes.total || 0;
            acc.tackles.total += s.tackles.total || 0;
            acc.cards.yellow += s.cards.yellow || 0;
            acc.cards.red += s.cards.red || 0;
            acc.substitutes.in += s.substitutes.in || 0;
            acc.substitutes.out += s.substitutes.out || 0;
            acc.substitutes.bench += s.substitutes.bench || 0;
            return acc;
          },
          {
            games: { appearences: 0, lineups: 0, minutes: 0 },
            goals: { total: 0, assists: 0 },
            shots: { total: 0 },
            passes: { total: 0 },
            tackles: { total: 0 },
            cards: { yellow: 0, red: 0 },
            substitutes: { in: 0, out: 0, bench: 0 },
          }
        );
      }
      
      return teamStats[selectedCompetition.row - 1] || {};
    });
  }, [teamNames, statsByTeam, statistics, selectedCompetitionPerTab]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get('/players', { params: { id, season: 2023 } });
        setPlayerData(res.data.response[0]);
      } catch (err) {
        console.error('Erro ao buscar dados do jogador:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const renderBackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
    />
  );

  if (loading) {
    return (
      <Layout style={[styles.center, { flex: 1 }]}>
        <Spinner size="large" />
      </Layout>
    );
  }

  if (!playerData || !player) {
    return (
      <Layout style={[styles.center, { flex: 1 }]}>
        <Text>Nenhum jogador encontrado</Text>
      </Layout>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1 }}>
        <TopNavigation
          title={() => <Text category="h5">{player.name}</Text>}
          alignment="center"
          accessoryLeft={renderBackAction}
        />

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={styles.header}>
            <Image source={{ uri: player.photo }} style={styles.playerPhoto} />
            <View style={{ marginLeft: 16 }}>
              <Text category="h6">
                {player.firstname} {player.lastname}
              </Text>
            </View>
          </View>

          <TabView
            selectedIndex={selectedTeamTab}
            onSelect={(index) => setSelectedTeamTab(index)}
          >
            {teamNames.map((team, i) => {
              const teamStats = i === 0 ? statistics : statsByTeam[team] || [];
              const selectedCompetition = selectedCompetitionPerTab[i] || null;
              const statsForTab = statsPerTab[i];

              return (
                <Tab key={i} title={team}>
                  <Layout style={{ padding: 16 }}>
                    <Select
                      selectedIndex={selectedCompetition || undefined}
                      placeholder="Todas competições"
                      onSelect={(index) => {
                        const sel = Array.isArray(index) ? index[0] : index;
                        setSelectedCompetitionPerTab((prev) => ({
                          ...prev,
                          [i]: sel,
                        }));
                      }}
                    >
                      {[
                        <SelectItem title="Todas competições" key="all-competitions"/>,
                        ...teamStats.map((s: Statistics) => (
                          <SelectItem
                            key={s.league.id}
                            title={s.league.name}
                            accessoryLeft={() => (
                              <Image
                                source={{ uri: s.league.logo }}
                                style={{ width: 20, height: 20 }}
                              />
                            )}
                          />
                        )),
                      ]}
                    </Select>

                    <View style={{ marginTop: 16 }}>
                      {Object.entries(statsMapping).map(([category, subcategories]) => (
                        <View key={category} style={styles.categoryContainer}>
                           {Object.entries(subcategories).map(([subKey, label]) => {
                             const value = (statsForTab as any)?.[category]?.[subKey] ?? 0;
                             return (
                               <View style={styles.row} key={`${category}-${subKey}`}>
                                 <Text style={styles.statLabel}>{label}</Text>
                                 <Text style={styles.statValue}>{value}</Text>
                               </View>
                             );
                           })}
                        </View>
                      ))}
                    </View>
                  </Layout>
                </Tab>
              );
            })}
          </TabView>
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  playerPhoto: { width: 80, height: 80, borderRadius: 40 },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryContainer: {
    marginBottom: 12,
  },
  statLabel: {
    color: '#666',
  },
  statValue: {
    fontWeight: 'bold',
  },
});
