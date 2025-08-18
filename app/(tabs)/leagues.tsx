import { Icon, Layout, List, ListItem, Text, TopNavigation } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const leaguesByCountry = {
  Inglaterra: ['Premier League'],
  França: ['Ligue 1'],
  Alemanha: ['Bundesliga'],
  Espanha: ['La Liga'],
};

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;

export default function LeaguesScreen() {
  const router = useRouter();

  return (
    <Layout style={styles.container}>
      <TopNavigation title="Ligas Disponíveis" alignment="center" />
      {Object.entries(leaguesByCountry).map(([country, leagues]) => (
        <View key={country} style={styles.group}>
          <Text category="s1" style={styles.countryTitle}>{country}</Text>
          <List
            data={leagues}
            renderItem={({ item }) => (
              <ListItem
                title={item}
                onPress={() =>
                  router.push({
                    pathname: '/leagues/[league]',
                    params: { league: item }, // <-- passa o parâmetro como objeto
                  })
                }
              />
            )}
          />
        </View>
      ))}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  group: { marginBottom: 24 },
  countryTitle: { fontWeight: '700', fontSize: 16, marginBottom: 8 },
});
