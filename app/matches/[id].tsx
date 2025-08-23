import { EventCard } from '@/components/EventCard';
import { LineupPlayer } from '@/components/LineupPlayer';
import { PlayerModal } from '@/components/PlayerModal';
import { StatsRow } from '@/components/StatsRow';
import { api } from '@/services/api';
import { Match, Player, PlayerWithStats } from '@/types/match';
import { Avatar, Icon, Layout, Spinner, Tab, TabView, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;

export default function MatchDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithStats | null>(null);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/fixtures', { params: { id } });
        setMatch(res.data.response[0] as Match);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const renderBackAction = () => <TopNavigationAction icon={BackIcon} onPress={() => router.back()} />;

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

  const handlePlayerPress = (playerObj: { player: Player }) => {
    if (!playerObj?.player?.id) return;

    const fullPlayerData = match?.players
      ?.flatMap(teamData => teamData.players)
      .find(p => p.player.id === playerObj.player.id);

    if (fullPlayerData) {
      setSelectedPlayer(fullPlayerData);
      setModalVisible(true);
    }
  };

  const homeTeam = match.teams.home;
  const awayTeam = match.teams.away;

  const date = new Date(match.fixture.date);
  const formattedDate = date.toLocaleString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getPlayerPhoto = (playerId: number): string => {
    const playerInfo = match.players
      ?.flatMap(teamData => teamData.players)
      .find(p => p.player.id === playerId);
    return playerInfo?.player.photo || '';
  };

  const getPlayerTop = (index: number, formation: string, isHome: boolean): `${number}%` => {
    const formationParts = formation.split('-').map(Number);
    let line = 0;
    if (index > 0) {
      let playersInLine = formationParts[0];
      if (index > playersInLine) {
        line = 1;
        playersInLine += formationParts[1];
        if (index > playersInLine) {
          line = 2;
          playersInLine += formationParts[2];
          if (index > playersInLine) {
            line = 3;
          }
        }
      }
    }
    const homePos = [10, 25, 40, 55];
    const awayPos = [90, 75, 60, 45];
    const position = isHome ? homePos[line] : awayPos[line];
    return `${position}%`;
  };

  const getPlayerLeft = (index: number, formation: string): `${number}%` => {
    const positions = [50, 20, 80, 40, 60, 15, 85, 30, 70, 25, 75];
    const position = positions[index] || 50;
    return `${position}%`;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1 }}>
        <TopNavigation
          title="Detalhes da Partida"
          alignment="center"
          accessoryLeft={renderBackAction}
        />

        <View style={styles.card}>
          <View style={styles.teamsRow}>
            <View style={styles.teamContainer}>
              {match.teams.home.logo && <Image source={{ uri: match.teams.home.logo }} style={styles.logo} />}
              <Text style={styles.teamName}>{match.teams.home.name}</Text>
            </View>

            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>{match.goals?.home ?? 0}</Text>
              <Text style={styles.scoreSeparator}>-</Text>
              <Text style={styles.scoreText}>{match.goals?.away ?? 0}</Text>
            </View>

            <View style={styles.teamContainer}>
              {match.teams.away.logo && <Image source={{ uri: match.teams.away.logo }} style={styles.logo} />}
              <Text style={styles.teamName}>{match.teams.away.name}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.statusText}>{match.fixture.status.long}</Text>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
        </View>

        <TabView selectedIndex={selectedIndex} onSelect={setSelectedIndex} style={{ flex: 1 }}>
          <Tab title="Info">
            <ScrollView style={styles.tabContent}>
              {match.league && (
                <View style={styles.card}>
                  <Text category="h6" style={styles.infoHeader}>Liga / Temporada</Text>
                  <Text style={styles.infoText}>{match.league.name} - {match.league.season}</Text>
                  <Text style={styles.infoText}>{match.league.round}</Text>
                </View>
              )}
              {match.fixture.venue && (
                <View style={styles.card}>
                  <Text category="h6" style={styles.infoHeader}>Local do Jogo</Text>
                  <Text style={styles.infoText}>{match.fixture.venue.name} ({match.fixture.venue.city})</Text>
                </View>
              )}
              {match.fixture.referee && (
                <View style={styles.card}>
                  <Text category="h6" style={styles.infoHeader}>Árbitro</Text>
                  <Text style={styles.infoText}>{match.fixture.referee}</Text>
                </View>
              )}
            </ScrollView>
          </Tab>

          <Tab title="Eventos">
            <ScrollView style={styles.tabContent}>
              {match.events?.length ? (
                match.events.slice().reverse().map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isHome={event.team?.id === match.teams.home.id}
                  />
                ))
              ) : (
                <Text appearance="hint">Nenhum evento registrado.</Text>
              )}
            </ScrollView>
          </Tab>

          <Tab title="Escalações">
            <ScrollView style={styles.tabContent}>
              {match.lineups && match.lineups.length > 0 ? (
                <View style={styles.card}>
                  <Text style={styles.infoHeader}>Escalações</Text>

                  <View style={styles.pitch}>
                    <ImageBackground
                      source={require('@/assets/images/football-pitch.jpg')}
                      style={{ width: '100%', height: 500, borderRadius: 16 }}
                      imageStyle={{ borderRadius: 16 }}
                    >
                      {(() => {
                        const homeTeamLineup = match.lineups.find(l => l.team.id === homeTeam.id);
                        const awayTeamLineup = match.lineups.find(l => l.team.id === awayTeam.id);
                        if (!homeTeamLineup || !awayTeamLineup) return null;

                        return (
                          <>
                            {/* Técnico time da casa */} 
                            {homeTeamLineup.coach && ( 
                              <View style={[styles.coachSpot, { top: 0, left: 10 }]}>
                              <Avatar size="small" source={{ uri: homeTeamLineup.coach.photo }} />
                              <Text style={styles.playerName}>{homeTeamLineup.coach.name}</Text> </View> )
                            }
                            {awayTeamLineup.coach && ( 
                              <View style={[styles.coachSpot, { bottom: 7, right: 10 }]}>
                              <Avatar size="small" source={{ uri: awayTeamLineup.coach.photo }} />
                              <Text style={styles.playerName}>{awayTeamLineup.coach.name}</Text> 
                              </View> )
                            }
                            {homeTeamLineup.startXI.map((playerObj, i) => (
                              <View
                                key={`home-${playerObj.player.id}`}
                                style={[
                                  styles.playerSpot,
                                  {
                                    top: getPlayerTop(i, homeTeamLineup.formation, true),
                                    left: getPlayerLeft(i, homeTeamLineup.formation),
                                  },
                                ]}
                              >
                                <LineupPlayer
                                  playerObj={playerObj}
                                  getPlayerPhoto={getPlayerPhoto}
                                  onPress={handlePlayerPress}
                                />
                              </View>
                            ))}

                            {awayTeamLineup.startXI.map((playerObj, i) => (
                              <View
                                key={`away-${playerObj.player.id}`}
                                style={[
                                  styles.playerSpot,
                                  {
                                    top: getPlayerTop(i, awayTeamLineup.formation, false),
                                    left: getPlayerLeft(i, awayTeamLineup.formation),
                                  },
                                ]}
                              >
                                <LineupPlayer
                                  playerObj={playerObj}
                                  getPlayerPhoto={getPlayerPhoto}
                                  onPress={handlePlayerPress}
                                />
                              </View>
                            ))}
                          </>
                        );
                      })()}
                    </ImageBackground>
                  </View>
                </View>
              ) : (
                <Text appearance="hint">Nenhuma escalação disponível.</Text>
              )}
            </ScrollView>
          </Tab>

          {/* Aba de Estatísticas */}
          <Tab title="Estatísticas">
            <ScrollView style={styles.tabContent}>
              {match.statistics && match.statistics.length > 0 ? (
                <View>
                  {(() => {
                    const homeStats = match.statistics.find(s => s.team.id === homeTeam.id)?.statistics;
                    const awayStats = match.statistics.find(s => s.team.id === awayTeam.id)?.statistics;

                    if (!homeStats || !awayStats) {
                      return <Text appearance="hint">Dados de estatísticas incompletos.</Text>;
                    }

                    const allStatTypes = [...new Set([
                      ...homeStats.map(s => s.type), 
                      ...awayStats.map(s => s.type)
                    ])];
                    
                    return allStatTypes.map((type) => {
                      const statHome = homeStats.find(s => s.type === type);
                      const statAway = awayStats.find(s => s.type === type);

                      return (
                        <StatsRow
                          key={type}
                          statHome={statHome}
                          statAway={statAway}
                        />
                      );
                    });
                  })()}
                </View>
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
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
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
  infoText: { fontSize: 16, fontWeight: '700', color: '#9a9a9aff' },
  infoHeader: { fontWeight: '700', color: '#222' },
   teamSelectorContainer: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: '#E4E9F2',
      borderRadius: 8,
      overflow: 'hidden',
    },
    teamSelectorButton: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    },
    teamSelectorActive: {
      backgroundColor: '#3366FF',
    },
    teamSelectorText: {
      fontWeight: '600',
      color: '#3366FF',
    },
    teamSelectorActiveText: {
      color: '#FFFFFF',
    },
    lineupGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: 8,
    },
    substituteText: {
      paddingVertical: 4,
      fontSize: 14,
    },
    pitch: {
      marginTop: 16,
      position: 'relative',
    },
    playerSpot: {
      position: 'absolute',
      alignItems: 'center',
      width: 60,
      transform: [{ translateX: -30 }],
    },
    playerName: { fontSize: 10, fontWeight: '600', color: '#fff', textAlign: 'center' },
    coachSpot: { position: 'absolute', alignItems: 'center', width: 60 },
});
