import { Divider, Icon, Layout, List, ListItem, Text, TopNavigation } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, View } from 'react-native';

const leaguesByCountry = {
  Inglaterra: [
    { name: 'Premier League', logo: 'https://media.api-sports.io/football/leagues/39.png' },
  ],
  França: [
    { name: 'Ligue 1', logo: 'https://media.api-sports.io/football/leagues/61.png' },
  ],
  Alemanha: [
    { name: 'Bundesliga', logo: 'https://media.api-sports.io/football/leagues/78.png' },
  ],
  Espanha: [
    { name: 'La Liga', logo: 'https://media.api-sports.io/football/leagues/140.png' },
  ],
};


export default function LeaguesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <Layout style={styles.container}>
        <TopNavigation
          alignment="center"
          title={() => <Text category="h5">Ligas Disponíveis</Text>}
        />

        {Object.entries(leaguesByCountry).map(([country, leagues]) => (
            <View key={country} style={styles.group}>
              <Text category="h6" style={styles.countryTitle}>
                {country}
              </Text>
              <List
                data={leagues}
                keyExtractor={(item) => item.name}
                ItemSeparatorComponent={Divider}
                renderItem={({ item }) => (
                  <ListItem
                    title={() => (
                      <Text category="s1" style={{ fontWeight: '600' }}>
                        {item.name}
                      </Text>
                    )}
                    accessoryLeft={() => (
                      <Image source={{ uri: item.logo }} style={styles.logo} />
                    )}
                    accessoryRight={() => (
                      <Icon name="chevron-right-outline" fill="#8F9BB3" style={styles.icon} />
                    )}
                    onPress={() =>
                      router.push(`/leagues/${encodeURIComponent(item.name)}`)
                    }
                  />
                )}
                style={styles.card}
              />

            </View>
        ))}
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  group: { marginBottom: 24 },
  countryTitle: { fontWeight: '700', fontSize: 16, marginBottom: 8, color: '#001effff' },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    color: "#000"
  },
  logo: { width: 28, height: 28, resizeMode: 'contain', marginRight: 8 },
  icon: { width: 20, height: 20 },
});
