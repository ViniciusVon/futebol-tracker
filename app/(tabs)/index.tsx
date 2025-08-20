import { Team, Teams } from '@/enums/TeamsEnum';
import { Autocomplete, AutocompleteItem, Card, Icon, Layout, Text, TopNavigation } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const filteredTeams = Teams.filter(team =>
    team.name.toLowerCase().includes(query.toLowerCase())
  );

  const options = selectedTeam ? [
    {
      key: 'team',
      title: `Ver Time do ${selectedTeam.name}`,
      subtitle: 'Perfil do Time',
      route: `/teams/${selectedTeam.id}`,
      icon: 'person-outline',
    },
    {
      key: 'season',
      title: `Ver Temporada do ${selectedTeam.name}`,
      subtitle: 'Temporadas do Time',
      route: `/seasons/${selectedTeam.id}`,
      icon: 'person-outline',
    },
  ] : [];

  const renderItem = ({ item }: any) => (
    <Card style={styles.card} onPress={() => router.push(item.route)} status="basic">
      <View style={styles.cardHeader}>
        {item.icon && <Icon name={item.icon} style={styles.icon} />}
        <Text category="h6">{item.title}</Text>
      </View>
      <Text appearance="hint" category="s1">{item.subtitle}</Text>
    </Card>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={styles.container}>
        <TopNavigation alignment="center" title={() => <Text category="h5">Brubyscore</Text>} />

        <View>
          <Autocomplete
            placeholder="Buscar time..."
            value={query}
            onChangeText={setQuery}
            onSelect={(index: number) => {
              requestAnimationFrame(() => {
                setSelectedTeam(filteredTeams[index]);
                setQuery(filteredTeams[index].name);
              });
            }}
          >
            {filteredTeams.map(team => (
              <AutocompleteItem key={team.id} title={team.name} />
            ))}
          </Autocomplete>
        </View>

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
  container: { flex: 1, padding: 8 },
  listContainer: { paddingTop: 16, paddingBottom: 32 },
  card: { marginBottom: 12, borderRadius: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  icon: { width: 24, height: 24, marginRight: 8, tintColor: '#3366FF' },
});
