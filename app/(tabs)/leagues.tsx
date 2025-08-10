import { Layout, List, ListItem, Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet } from 'react-native';

const leagues = ['Premier League', 'Ligue 1', 'Bundesliga'];

export default function LeaguesScreen() {
  return (
    <Layout style={styles.container}>
      <Text category="h4" style={styles.title}>
        Ligas Disponíveis
      </Text>
      <List
        data={leagues}
        renderItem={({ item }) => (
          <ListItem
            title={item}
            onPress={() => alert(`Você escolheu ${item}`)}
          />
        )}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { marginBottom: 16 },
});
