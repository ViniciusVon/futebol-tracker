import { api } from '@/services/api';
import {
  Avatar,
  Icon,
  Layout,
  Spinner,
  Tab,
  TabView,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;

export default function MatchDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => router.back()} />
  );

  if (loading) {
    return (
      <Layout style={[styles.container, styles.center]}>
        <Spinner size="large" />
      </Layout>
    );
  }

  if (!match) {
    return (
      <Layout style={[styles.container, styles.center]}>
        <Text status="danger" category="s1">
          Não foi possível carregar a partida.
        </Text>
      </Layout>
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

  const homeTeam = match.teams.home;
  const awayTeam = match.teams.away;

  const getPlayerTop = (index: number, formation: string) => {
    const lines = formation.split('-').map((n) => parseInt(n));
    lines.unshift(1); // Goleiro
    const totalLines = lines.length;

    let line = 0,
      count = 0;
    for (let i = 0; i < totalLines; i++) {
      count += lines[i];
      if (index < count) {
        line = i;
        break;
      }
    }
    return (line / totalLines) * 300;
  };

  const getPlayerLeft = (index: number, formation: string) => {
    const lines = formation.split('-').map((n) => parseInt(n));
    lines.unshift(1);
    let line = 0,
      count = 0;
    for (let i = 0; i < lines.length; i++) {
      count += lines[i];
      if (index < count) {
        line = i;
        const playersInLine = lines[i];
        const posInLine = index - (count - playersInLine);
        return ((posInLine + 1) / (playersInLine + 1)) * 300;
      }
    }
    return 150;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1 }}>
        <TopNavigation
          title="Detalhes da Partida"
          alignment="center"
          accessoryLeft={renderBackAction}
        />

        <TabView
          selectedIndex={selectedIndex}
          onSelect={(index) => setSelectedIndex(index)}
          style={{ flex: 1 }}
        >
          {/* Aba de informações */}
          <Tab title="Info">
            <ScrollView style={styles.tabContent}>
              {/* Placar e Times */}
              <View style={styles.card}>
                <View style={styles.teamsRow}>
                  <View style={styles.teamContainer}>
                    {homeTeam?.logo && (
                      <Image source={{ uri: homeTeam.logo }} style={styles.logo} />
                    )}
                    <Text style={styles.teamName}>{homeTeam?.name ?? '-'}</Text>
                  </View>

                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>{match.goals?.home ?? '-'}</Text>
                    <Text style={styles.scoreSeparator}>-</Text>
                    <Text style={styles.scoreText}>{match.goals?.away ?? '-'}</Text>
                  </View>

                  <View style={styles.teamContainer}>
                    {awayTeam?.logo && (
                      <Image source={{ uri: awayTeam.logo }} style={styles.logo} />
                    )}
                    <Text style={styles.teamName}>{awayTeam?.name ?? '-'}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.statusText}>
                    {match.fixture?.status?.long ?? '-'}
                  </Text>
                  <Text style={styles.dateText}>{formattedDate}</Text>
                </View>
              </View>

              {/* Liga / Temporada */}
              {match.league && (
                <View style={styles.card}>
                  <Text category="h6" style={styles.infoHeader}>
                    Liga / Temporada
                  </Text>
                  <Text style={styles.infoText}>
                    {match.league?.name ?? '-'} - {match.league?.season ?? '-'}
                  </Text>
                  <Text style={styles.infoText}>
                    {match.league?.round ?? '-'}
                  </Text>
                </View>
              )}

              {/* Local */}
              {match.fixture?.venue && (
                <View style={styles.card}>
                  <Text category="h6" style={styles.infoHeader}>
                    Local do Jogo
                  </Text>
                  <Text style={styles.infoText}>
                    {match.fixture.venue?.name ?? '-'} ({match.fixture.venue?.city ?? '-'})
                  </Text>
                </View>
              )}

              {/* Árbitro */}
              {match.fixture?.referee && (
                <View style={styles.card}>
                  <Text category="h6" style={styles.infoHeader}>
                    Árbitro
                  </Text>
                  <Text style={styles.infoText}>{match.fixture.referee ?? '-'}</Text>
                </View>
              )}
            </ScrollView>
          </Tab>

          {/* Aba de eventos */}
          <Tab title="Eventos">
            <ScrollView style={styles.tabContent}>
              {match.events?.length > 0 ? (
                match.events.map((event: any, i: number) => (
                  <View key={i} style={styles.card}>
                    <Text style={styles.infoText}>
                      [{event.time?.elapsed ?? '-'}'] {event.team?.name ?? '-'} -{' '}
                      {event.player?.name ?? '-'} ({event.detail ?? '-'})
                    </Text>
                  </View>
                ))
              ) : (
                <Text appearance="hint">Nenhum evento registrado.</Text>
              )}
            </ScrollView>
          </Tab>

          {/* Aba de escalações */}
          <Tab title="Escalações">
            <ScrollView style={styles.tabContent}>
              {match.lineups?.length > 0 ? (
                match.lineups.map((lineup: any, idx: number) => (
                  <View key={idx} style={styles.card}>
                    <Text style={styles.infoHeader}>
                      {lineup.team?.name} ({lineup.formation})
                    </Text>

                    {/* Campo */}
                    <View style={styles.pitch}>
                      {lineup.startXI.map((playerObj: any, i: number) => {
                        const player = playerObj.player;
                        return (
                          <View
                            key={i}
                            style={[
                              styles.playerSpot,
                              {
                                top: getPlayerTop(i, lineup.formation),
                                left: getPlayerLeft(i, lineup.formation),
                              },
                            ]}
                          >
                            <Avatar
                              size="small"
                              source={{
                                uri:
                                  player.photo ||
                                  `https://randomuser.me/api/portraits/men/${i}.jpg`,
                              }}
                              style={styles.playerAvatar}
                            />
                            <Text style={styles.playerName}>
                              {player?.name ?? '-'}
                            </Text>
                          </View>
                        );
                      })}
                    </View>

                    {/* Reservas */}
                    <Text style={[styles.infoHeader, { marginTop: 12 }]}>
                      Reservas:
                    </Text>
                    {lineup.substitutes.map((sub: any, i: number) => (
                      <Text key={i} style={styles.infoText}>
                        {sub.player?.name}
                      </Text>
                    ))}
                  </View>
                ))
              ) : (
                <Text appearance="hint">Nenhuma escalação disponível.</Text>
              )}
            </ScrollView>
          </Tab>
        </TabView>
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { justifyContent: 'center', alignItems: 'center' },
  tabContent: { flex: 1, padding: 16 },
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
  teamsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  teamContainer: { alignItems: 'center', flex: 1 },
  logo: { width: 48, height: 48, marginBottom: 8, resizeMode: 'contain' },
  teamName: { fontSize: 16, fontWeight: '600', textAlign: 'center', color: '#333' },
  scoreContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  scoreText: { fontSize: 32, fontWeight: '700', color: '#222' },
  scoreSeparator: { fontSize: 24, marginHorizontal: 4, color: '#888' },
  infoRow: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
  statusText: { fontSize: 14, fontWeight: '500', color: '#555' },
  dateText: { fontSize: 14, fontWeight: '400', color: '#777' },
  infoText: { fontSize: 16, fontWeight: '700', color: '#222' },
  infoHeader: { fontWeight: '700', color: '#222' },
  errorText: { color: 'red', fontSize: 16 },
  pitch: {
    width: '100%',
    height: 300,
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    marginTop: 12,
    position: 'relative',
  },
  playerSpot: {
    position: 'absolute',
    alignItems: 'center',
    width: 60,
  },
  playerAvatar: {
    marginBottom: 4,
  },
  playerName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});
