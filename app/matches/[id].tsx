import { EventCard } from '@/components/EventCard';
import { LineupPlayer } from '@/components/LineupPlayer';
import { PlayerModal } from '@/components/PlayerModal';
import { TeamSwitch } from '@/components/TeamSwitch';
import { api } from '@/services/api';
import { Match, PlayerWithStats } from '@/types/match';
import { Icon, Layout, Spinner, Tab, TabView, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;

export default function MatchDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithStats | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);

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

  const date = new Date(match.fixture.date);
  const formattedDate = date.toLocaleString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1 }}>
        <TopNavigation
          title="Detalhes da Partida"
          alignment="center"
          accessoryLeft={renderBackAction}
        />

        {/* Placar e Times */}
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
          {/* Aba de Informações */}
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

          {/* Aba de Eventos */}
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

          {/* Aba de Escalações */}
          <Tab title="Escalações">
            <ScrollView style={styles.tabContent}>
              {match.lineups?.length ? (
                match.lineups[selectedTeamIndex].startXI.map((playerObj, i) => (
                 <LineupPlayer
                    key={playerObj.player.id}
                    playerObj={playerObj}
                    getPlayerPhoto={(id) => {
                      const pl = match.players?.flatMap(team => team.players)
                                  .find(p => p.player.id === id);
                      return pl?.player.photo || '';
                    }}
                    onPress={() => {
                      const playerWithStats = match.players
                        ?.flatMap(team => team.players)
                        .find(p => p.player.id === playerObj.player.id);

                      if (playerWithStats) {
                        setSelectedPlayer(playerWithStats);
                        setModalVisible(true);
                      }
                    }}
                  />
                ))
              ) : (
                <Text appearance="hint">Nenhuma escalação disponível.</Text>
              )}
            </ScrollView>
          </Tab>

          {/* Aba de Estatísticas */}
          <Tab title="Estatísticas">
            <ScrollView style={styles.tabContent}>
              {match.statistics?.length ? (
                <TeamSwitch
                  teams={match.statistics}
                  selectedIndex={selectedTeamIndex}
                  onSelect={setSelectedTeamIndex}
                />
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
});
