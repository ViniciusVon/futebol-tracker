import { PlayerModal } from '@/components/PlayerModal';
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
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;

export default function MatchDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);


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

  const getPlayerTop = (index: number, formation: string, isHomeTeam: boolean) => {
    const lines = formation?.split('-').map((n) => parseInt(n));
    lines.unshift(1);
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

    const fraction = line / totalLines;

    return isHomeTeam
      ? fraction * (500 / 2)
      : 450 - fraction * (500 / 2);
  };

  const getPlayerLeft = (index: number, formation: string) => {
    const lines = formation?.split('-').map((n) => parseInt(n));
    lines.unshift(1);
    let line = 0,
        count = 0;
    for (let i = 0; i < lines.length; i++) {
      count += lines[i];
      if (index < count) {
        line = i;
        const playersInLine = lines[i];
        const posInLine = index - (count - playersInLine);
        const fraction = (posInLine + 1) / (playersInLine + 1);
        return fraction * 300;
      }
    }
    return 150;
  };

  const getPlayerPhoto = (playerId: number) => {
    if (!match?.players) return `https://randomuser.me/api/portraits/men/${playerId}.jpg`;
    for (const team of match.players) {
      const playerData = team.players.find((p: any) => p.player.id === playerId);
      if (playerData) return playerData.player.photo;
    }
    return `https://randomuser.me/api/portraits/men/${playerId}.jpg`;
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
                <View style={styles.card}>
                  <Text style={styles.infoHeader}>Escalações</Text>

                  {/* Campo */}
                  <View style={styles.pitch}>
                    <ImageBackground
                      source={require('@/assets/images/football-pitch.jpg')} 
                      style={{ width: '100%', height: 500, borderRadius: 16 }}
                      imageStyle={{ borderRadius: 16 }}
                    >
                      {(() => {
                        const homeTeamLineup = match.lineups.find((l: any) => l.team.id === homeTeam.id);
                        const awayTeamLineup = match.lineups.find((l: any) => l.team.id === awayTeam.id);
                        if (!homeTeamLineup || !awayTeamLineup) return null;

                        return (
                          <>
                            {/* Técnico time da casa */}
                            {homeTeamLineup.coach && (
                              <View style={[styles.coachSpot, { top: 0, left: 10 }]}>
                                <Avatar size="small" source={{ uri: homeTeamLineup.coach.photo }} />
                                <Text style={styles.playerName}>{homeTeamLineup.coach.name}</Text>
                              </View>
                            )}

                            {/* Técnico time visitante */}
                            {awayTeamLineup.coach && (
                              <View style={[styles.coachSpot, { bottom: 0, right: 10 }]}>
                                <Avatar size="small" source={{ uri: awayTeamLineup.coach.photo }} />
                                <Text style={styles.playerName}>{awayTeamLineup.coach.name}</Text>
                              </View>
                            )}

                            {/* Time da casa */}
                            {homeTeamLineup.startXI.map((playerObj: any, i: number) => (
                              <View
                                key={`home-${i}`}
                                style={[
                                  styles.playerSpot,
                                  {
                                    top: getPlayerTop(i, homeTeamLineup.formation, true),
                                    left: getPlayerLeft(i, homeTeamLineup.formation),
                                  },
                                ]}
                              >
                                <Avatar
                                  size="small"
                                  source={{ uri: playerObj.player.photo || getPlayerPhoto(playerObj.player.id) }}
                                />
                                <Text style={styles.playerName}>{playerObj.player.name}</Text>
                              </View>
                            ))}

                            {/* Time visitante */}
                            {awayTeamLineup.startXI.map((playerObj: any, i: number) => (
                              <View
                                key={`away-${i}`}
                                style={[
                                  styles.playerSpot,
                                  {
                                    top: getPlayerTop(i, awayTeamLineup.formation, false),
                                    left: getPlayerLeft(i, awayTeamLineup.formation),
                                  },
                                ]}
                              >
                                <Avatar
                                  size="small"
                                  source={{ uri: playerObj.player.photo || getPlayerPhoto(playerObj.player.id) }}
                                />
                                <Text style={styles.playerName}>{playerObj.player.name}</Text>
                              </View>
                            ))}

                          </>
                        );
                      })()}
                      
                    </ImageBackground>
                  </View>

                  {/* Reservas home */}
                  {match.lineups.find((l: any) => l.team.id === homeTeam.id)?.substitutes?.length > 0 && (
                    <>
                      <Text style={[styles.infoHeader, { marginTop: 12 }]}>Reservas {homeTeam.name}:</Text>
                      {match.lineups
                        .find((l: any) => l.team.id === homeTeam.id)
                        .substitutes.map((sub: any, i: number) => (
                          <Text key={`home-sub-${i}`} style={styles.infoText}>
                            {sub.player?.name ?? '-'}
                          </Text>
                        ))}
                    </>
                  )}

                  {/* Reservas away */}
                  {match.lineups.find((l: any) => l.team.id === awayTeam.id)?.substitutes?.length > 0 && (
                    <>
                      <Text style={[styles.infoHeader, { marginTop: 12 }]}>Reservas {awayTeam.name}:</Text>
                      {match.lineups
                        .find((l: any) => l.team.id === awayTeam.id)
                        .substitutes.map((sub: any, i: number) => (
                          <Text key={`away-sub-${i}`} style={styles.infoText}>
                            {sub.player?.name ?? '-'}
                          </Text>
                        ))}
                    </>
                  )}
                </View>
              ) : (
                <Text appearance="hint">Nenhuma escalação disponível.</Text>
              )}
            </ScrollView>
          </Tab>


          {/* Aba de setatisticas */}
          <Tab title="Estatísticas">
            <ScrollView style={styles.tabContent}>
              {match.statistics?.length > 0 ? (
                match.statistics.map((teamStat: any, idx: number) => (
                  <View key={idx} style={styles.card}>
                    {/* Time */}
                    <View style={styles.teamRow}>
                      {teamStat.team.logo && (
                        <Image
                          source={{ uri: teamStat.team.logo }}
                          style={styles.teamLogo}
                        />
                      )}
                      <Text style={styles.teamName}>{teamStat.team.name}</Text>
                    </View>

                    {/* Estatísticas */}
                    {teamStat.statistics.map((stat: any, i: number) => (
                      <View key={i} style={styles.statRow}>
                        <Text style={styles.statLabel}>{stat.type}</Text>
                        <Text style={styles.statValue}>{stat.value}</Text>
                      </View>
                    ))}
                  </View>
                ))
              ) : (
                <Text appearance="hint">Nenhuma estatística disponível.</Text>
              )}
            </ScrollView>
          </Tab>
        </TabView>
        <PlayerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          selectedPlayer={selectedPlayer}
        />
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
    height: 500,
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
  teamRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  teamLogo: { width: 32, height: 32, marginRight: 8, resizeMode: 'contain' },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  statLabel: { color: '#555', fontWeight: '500' },
  statValue: { color: '#222', fontWeight: '700' },
  coachSpot: {
    position: 'absolute',
    alignItems: 'center',
    width: 60,
  },
});
