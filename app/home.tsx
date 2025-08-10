import { Card, Layout, Text, TopNavigation } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';

const options = [
  {
    key: 'match',
    title: 'Ver Partida',
    subtitle: 'Detalhes do Jogo ao Vivo',
    route: '/matches/215662',
    icon: 'soccer',
  },
  {
    key: 'team',
    title: 'Ver Time do Palmeiras',
    subtitle: 'Perfil do Time',
    route: '/teams/121',
    icon: 'people',
  },
];

export default function Home() {
  const router = useRouter();

  const renderItem = ({ item }: any) => (
    <Card
      style={styles.card}
      onPress={() => router.push(item.route)}
      status="basic"
    >
      <Text category="h6">{item.title}</Text>
      <Text appearance="hint" category="s1">
        {item.subtitle}
      </Text>
    </Card>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={styles.container}>
        <TopNavigation
          alignment="center"
          title={() => <Text category="h5">Futebol Tracker</Text>}
        />
        <FlatList
          data={options}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.listContainer}
        />
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
  },
});
