import { Team, Teams } from '@/enums/TeamsEnum';
import { Autocomplete, AutocompleteItem, Card, Icon, Layout, Text, TopNavigation } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Team[]>(Teams); // times filtrados
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const filter = useCallback((team: Team, q: string) => {
    return team.name.toLowerCase().includes(q.toLowerCase());
  }, []);

  const onSelect = useCallback((index: number) => {
    const team = data[index];
    if (team) {
      setSelectedTeam(team);
      setQuery(team.name);
    }
  }, [data]);

  const onChangeText = useCallback((text: string) => {
    setQuery(text);
    setData(Teams.filter(team => filter(team, text)));
  }, [filter]);

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
        {item.icon && (
          <Icon
            name={item.icon}
            fill="#3366FF"
            style={{ width: 24, height: 24, marginRight: 8 }}
          />
        )}
        <Text category="h6">{item.title}</Text>
      </View>
      <Text appearance="hint" category="s1">{item.subtitle}</Text>
    </Card>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={styles.container}>
        <TopNavigation alignment="center" title={<Text category="h5">Brubyscore</Text>} />

        <Autocomplete
          placeholder="Buscar time..."
          value={query}
          onSelect={onSelect}
          onChangeText={onChangeText}
        >
          {data.map((team) => (
            <AutocompleteItem
              key={team.id}
              title={team.name}
            />
          ))}
        </Autocomplete>
        

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
});
