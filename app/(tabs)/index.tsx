import { Card, Icon, Layout, Text, TopNavigation } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';

const options = [
  {
    key: 'match',
    title: 'Ver Partida',
    subtitle: 'Detalhes do Jogo ao Vivo',
    route: '/matches/215662',
    icon: 'person-outline',
  },
  {
    key: 'team',
    title: 'Ver Time do Barcelona',
    subtitle: 'Perfil do Time',
    route: '/teams/529',
    icon: 'person-outline',
  },
  {
    key: 'season',
    title: 'Ver Temporada do Barcelona',
    subtitle: 'Temporadas do Time',
    route: '/seasons/529',
    icon: 'person-outline',
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
      <View style={styles.cardHeader}>
        {item.icon && <Icon name={item.icon} style={styles.icon} />}
        <Text category="h6">{item.title}</Text>
      </View>
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
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: '#3366FF',
  },
});
