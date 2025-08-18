import { api } from '@/services/api';
import {
  Card,
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
import { Image, SafeAreaView, StyleSheet } from 'react-native';

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

export default function TeamsDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [teamDetail, setTeamDetail] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/teams', { params: { id } });
        setTeamDetail(res.data.response[0]);
      } catch (err) {
        console.error('Erro ao buscar dados do time:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

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
    <SafeAreaView style={{ flex: 1}}>
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
          <Tab title="Time">
            <Layout style={styles.tabContent}>
              <Card style={styles.card} status="basic">
                <Image source={{ uri: team.logo }} style={styles.logo} />
                <Text category="h5" style={styles.name}>
                  {team.name}
                </Text>

                <Layout style={styles.infoRow}>
                  <Text category="s1" appearance="hint">
                    País:
                  </Text>
                  <Text category="s1">{team.country}</Text>
                </Layout>

                <Layout style={styles.infoRow}>
                  <Text category="s1" appearance="hint">
                    Fundado:
                  </Text>
                  <Text category="s1">{team.founded ?? '---'}</Text>
                </Layout>

                <Layout style={styles.infoRow}>
                  <Text category="s1" appearance="hint">
                    Tipo:
                  </Text>
                  <Text category="s1">
                    {team.national ? 'Seleção Nacional' : 'Clube'}
                  </Text>
                </Layout>
              </Card>
            </Layout>
          </Tab>

          <Tab title="Estádio">
            <Layout style={styles.tabContent}>
              <Card style={styles.card} status="basic">
                <Text category="h6" style={{ marginBottom: 12 }}>
                  Estádio
                </Text>
                <Image source={{ uri: venue.image }} style={styles.venueImage} />
                <Text category="s1" style={{ fontWeight: '600' }}>
                  {venue.name}
                </Text>
                <Text appearance="hint">{venue.address}</Text>
                <Text appearance="hint">{venue.city}</Text>

                <Layout style={styles.infoRow}>
                  <Text category="s1" appearance="hint">
                    Capacidade:
                  </Text>
                  <Text category="s1">{venue.capacity.toLocaleString()}</Text>
                </Layout>

                <Layout style={styles.infoRow}>
                  <Text category="s1" appearance="hint">
                    Superfície:
                  </Text>
                  <Text category="s1">{venue.surface}</Text>
                </Layout>
              </Card>
            </Layout>
          </Tab>
        </TabView>
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  venueImage: {
    width: '100%',
    height: 150,
    marginBottom: 12,
    borderRadius: 8,
  },
  name: {
    marginBottom: 12,
    color: '#222B45',
    textAlign: 'center',
  },
  infoRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
