import { api } from '@/services/api';
import { Icon, Layout, Spinner, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;

export default function PlayerDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [playerData, setPlayerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (!playerData) {
    return (
      <Layout style={[styles.center, { flex: 1 }]}>
        <Text>Nenhum jogador encontrado</Text>
      </Layout>
    );
  }

  const { player, statistics } = playerData;
  const stats = statistics[0];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1 }}>
        <TopNavigation
          title={() => <Text category="h5">{player.name}</Text>}
          alignment="center"
          accessoryLeft={renderBackAction}
        />

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Foto e time */}
          <View style={styles.header}>
            <Image source={{ uri: player.photo }} style={styles.playerPhoto} />
            <View style={{ marginLeft: 16 }}>
              <Text category="h6">{player.name}</Text>
              <Text appearance="hint">
                {stats.games.position} | Camisa: {stats.games.number}
              </Text>
              <Text appearance="hint">Rating: {stats.games.rating}</Text>
              {stats.games.captain && <Text appearance="success">Capitão</Text>}
            </View>
          </View>

          {/* Estatísticas */}
          <View style={styles.section}>
            <Text category="s1" style={styles.sectionTitle}>
              Estatísticas do Jogo
            </Text>
            <View style={styles.row}>
              <Text>Minutos jogados:</Text>
              <Text>{stats.games.minutes}</Text>
            </View>
            <View style={styles.row}>
              <Text>Gols marcados:</Text>
              <Text>{stats.goals.total || 0}</Text>
            </View>
            <View style={styles.row}>
              <Text>Assistências:</Text>
              <Text>{stats.goals.assists || 0}</Text>
            </View>
            <View style={styles.row}>
              <Text>Chutes:</Text>
              <Text>{stats.shots.total}</Text>
            </View>
            <View style={styles.row}>
              <Text>Passes:</Text>
              <Text>
                {stats.passes.total} ({stats.passes.accuracy})
              </Text>
            </View>
            <View style={styles.row}>
              <Text>Tackles:</Text>
              <Text>{stats.tackles.total || 0}</Text>
            </View>
            <View style={styles.row}>
              <Text>Cartões amarelos:</Text>
              <Text>{stats.cards.yellow}</Text>
            </View>
            <View style={styles.row}>
              <Text>Cartões vermelhos:</Text>
              <Text>{stats.cards.red}</Text>
            </View>
          </View>
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  playerPhoto: { width: 80, height: 80, borderRadius: 40 },
  section: { marginBottom: 24 },
  sectionTitle: { fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
});
