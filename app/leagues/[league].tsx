import { useStandings } from '@/hooks/useStandings';
import { Icon, Layout, Spinner, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;

export default function LeagueDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();

  let leagueParam = params.league;
  if (Array.isArray(leagueParam)) leagueParam = leagueParam[0];
  const league = decodeURIComponent(leagueParam || '');

  const leagueMap: Record<string, number> = {
    'Premier League': 39,
    'Ligue 1': 61,
    'Bundesliga': 78,
    'La Liga': 140,
  };
  const leagueId = leagueMap[league] || 39;
  const season = 2023;

  const { standings, leagueData, loading } = useStandings(leagueId, season);

  const renderBackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/');
        }
      }}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1 }}>
        <TopNavigation
          title={league}
          alignment="center"
          accessoryLeft={renderBackAction}
        />

        <Layout style={{ flex: 1, padding: 16 }}>
          {loading ? (
            <Layout style={styles.center}>
              <Spinner size="large" />
            </Layout>
          ) : (
            <>
              {/* Header da competição */}
              {leagueData && (
                <BlurView intensity={50} tint="light" style={styles.competitionHeader}>
                  <View style={styles.headerContent}>
                    <View>
                      <Text category="h5" style={{ color: "#fff" }}>{leagueData.name}</Text>
                      <Text style={{ color: "#fff" }}>{leagueData.country}</Text>
                      <Text style={{ color: "#fff" }}>Temporada: {leagueData.season}</Text>
                    </View>
                    {leagueData.logo && (
                      <Image source={{ uri: leagueData.logo }} style={styles.logo} />
                    )}
                  </View>
                </BlurView>
              )}

              {/* Se não tiver standings */}
              {standings.length === 0 ? (
                <Text>Nenhum time encontrado para essa liga.</Text>
              ) : (
                <ScrollView style={{ flex: 1 }}>
                  <ScrollView horizontal>
                    <View style={[styles.table, { minWidth: 700 }]}>
                      {/* Cabeçalho tabela */}
                      <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.cell, { width: 30 }]}>#</Text>
                        <Text style={[styles.cell, { width: 180 }]}>Time</Text>
                        <Text style={[styles.cell, { width: 60 }]}>PJ</Text>
                        <Text style={[styles.cell, { width: 60 }]}>V</Text>
                        <Text style={[styles.cell, { width: 60 }]}>E</Text>
                        <Text style={[styles.cell, { width: 60 }]}>D</Text>
                        <Text style={[styles.cell, { width: 60 }]}>GF</Text>
                        <Text style={[styles.cell, { width: 60 }]}>GC</Text>
                        <Text style={[styles.cell, { width: 60 }]}>SG</Text>
                        <Text style={[styles.cell, { width: 60 }]}>Pts</Text>
                      </View>

                      {/* Linhas */}
                      {standings.map((team) => (
                        <View style={styles.tableRow} key={team.team.id}>
                          <Text style={[styles.cell, { width: 30 }]}>{team.rank}</Text>
                          <View style={[styles.cell, { width: 180, flexDirection: 'row', alignItems: 'center' }]}>
                            {team.team.logo && <Image source={{ uri: team.team.logo }} style={styles.teamLogo} />}
                            <Text>{team.team.name}</Text>
                          </View>
                          <Text style={[styles.cell, { width: 60 }]}>{team.played}</Text>
                          <Text style={[styles.cell, { width: 60 }]}>{team.win}</Text>
                          <Text style={[styles.cell, { width: 60 }]}>{team.draw}</Text>
                          <Text style={[styles.cell, { width: 60 }]}>{team.lose}</Text>
                          <Text style={[styles.cell, { width: 60 }]}>{team.goalsFor}</Text>
                          <Text style={[styles.cell, { width: 60 }]}>{team.goalsAgainst}</Text>
                          <Text style={[styles.cell, { width: 60 }]}>{team.goalDiff}</Text>
                          <Text style={[styles.cell, { width: 60 }]}>{team.points}</Text>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </ScrollView>
              )}
            </>
          )}
        </Layout>
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  competitionHeader: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 100,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  logo: { width: 60, height: 60, resizeMode: 'contain' },
  table: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 6 },
  tableHeader: { backgroundColor: '#43e6ffff', borderTopLeftRadius: 7, borderTopRightRadius: 7 },
  cell: { paddingHorizontal: 4, fontSize: 12 },
  teamLogo: { width: 20, height: 20, marginRight: 4 },
});
