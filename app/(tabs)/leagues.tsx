import { leaguesSections } from '@/enums/LeaguesEnum';
import { Divider, Icon, Layout, ListItem, Text, TopNavigation } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, SectionList, StyleSheet, View } from 'react-native';

export default function LeaguesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <Layout style={styles.container}>
        <TopNavigation
          alignment="center"
          title={() => <Text category="h5">Ligas Disponíveis</Text>}
        />

        <SectionList
          sections={leaguesSections}
          keyExtractor={(item) => item.name}
          stickySectionHeadersEnabled={false}
          renderItem={({ item }) => (
            <ListItem
              style={styles.listItem}
              title={() => (
                <Text category="s1" style={{ fontWeight: '600', color: '#000' }}>
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
                router.push({
                  pathname: '/leagues/[id]',
                  params: { id: item.id, name: item.name },
                })
              }
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text category="h6" style={styles.countryTitle}>
              {title}
            </Text>
          )}
          ItemSeparatorComponent={() => <Divider />}
          renderSectionFooter={() => <View style={styles.sectionFooter} />}
          style={styles.list}
        />
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingHorizontal: 12 },
  countryTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#ffffffff',
    paddingHorizontal: 4,
    marginTop: 24,
    marginBottom: 8,
  },
  listItem: {
    backgroundColor: '#FFF',
    color: '#000'
  },
  logo: { width: 28, height: 28, resizeMode: 'contain', marginRight: 12 },
  icon: { width: 20, height: 20 },
  sectionFooter: {
    height: 12,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    color: '#000'
  },
});