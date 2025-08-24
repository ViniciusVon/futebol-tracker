import { useStandings } from '@/hooks/useStandings';
import {
  Icon,
  IconProps,
  IndexPath,
  Layout,
  Select,
  SelectItem,
  Spinner,
  Tab,
  TabView,
  Text,
  TopNavigation,
  TopNavigationAction
} from '@ui-kitten/components';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

interface LeagueData {
  name: string;
  country: string;
  season: number;
  logo: string;
}
interface Team {
  id: number;
  name: string;
  logo: string;
}
interface GameStats {
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals: { for: number; against: number; };
}
interface Standing {
  rank: number;
  team: Team;
  all: GameStats;
  goalsDiff: number;
  points: number;
  group?: string;
}

const BackIcon = (props: IconProps) => <Icon {...props} name="arrow-back" />;

const LeagueHeader = ({ leagueData }: { leagueData: LeagueData }) => (
  <BlurView intensity={50} tint="light" style={styles.competitionHeader}>
    <View style={styles.headerContent}>
      <View>
        <Text category="h5" style={styles.headerText}>{leagueData.name}</Text>
        <Text style={styles.headerText}>{leagueData.country}</Text>
        <Text style={styles.headerText}>Temporada: {leagueData.season}</Text>
      </View>
      {leagueData.logo && <Image source={{ uri: leagueData.logo }} style={styles.logo} />}
    </View>
  </BlurView>
);

const StandingsTable = ({ standings }: { standings: Standing[] }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <View style={styles.tableContainer}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={[styles.cell, styles.rankCell]}>#</Text>
        <Text style={[styles.cell, styles.teamCell]}>Time</Text>
        <Text style={styles.cell}>PJ</Text><Text style={styles.cell}>V</Text>
        <Text style={styles.cell}>E</Text><Text style={styles.cell}>D</Text>
        <Text style={styles.cell}>GF</Text><Text style={styles.cell}>GC</Text>
        <Text style={styles.cell}>SG</Text>
        <Text style={[styles.cell, styles.pointsCell]}>Pts</Text>
      </View>
      {standings.map((team) => (
        <View style={styles.tableRow} key={team.team.id}>
          <Text style={[styles.cell, styles.rankCell]}>{team.rank}</Text>
          <View style={[styles.cell, styles.teamCell, { flexDirection: 'row', alignItems: 'center' }]}>
            <Image source={{ uri: team.team.logo }} style={styles.teamLogo} />
            <Text numberOfLines={1} style={{ color: '#000' }}>{team.team.name}</Text>
          </View>
          <Text style={styles.cell}>{team.all.played}</Text>
          <Text style={styles.cell}>{team.all.win}</Text>
          <Text style={styles.cell}>{team.all.draw}</Text>
          <Text style={styles.cell}>{team.all.lose}</Text>
          <Text style={styles.cell}>{team.all.goals.for}</Text>
          <Text style={styles.cell}>{team.all.goals.against}</Text>
          <Text style={styles.cell}>{team.goalsDiff}</Text>
          <Text style={[styles.cell, styles.pointsCell, { fontWeight: 'bold' }]}>{team.points}</Text>
        </View>
      ))}
    </View>
  </ScrollView>
);

export default function LeagueDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const leagueId = Number(params.id);
  const leagueName = params.name as string || 'Liga';

  const seasons = useMemo(() => Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 2 - i), []);
  const [seasonIndex, setSeasonIndex] = useState(new IndexPath(0));
  const [season, setSeason] = useState(seasons[0]);

  const { standings, leagueData, loading } = useStandings(leagueId, season);
  const [tabIndex, setTabIndex] = useState(0);

  const renderBackAction = () => (<TopNavigationAction icon={BackIcon} onPress={() => router.canGoBack() ? router.back() : router.replace('/')} />);

  const isGroupedCompetition = standings.length > 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FC' }}>
      <Layout style={{ flex: 1 }}>
        <TopNavigation title={leagueName} alignment="center" accessoryLeft={renderBackAction} />
        
        <ScrollView style={styles.contentContainer}>
          <View style={styles.headerSection}>
            <Select
              style={{ marginBottom: 16 }}
              value={season.toString()}
              selectedIndex={seasonIndex}
              onSelect={(index) => {
                const newIndex = index as IndexPath;
                setSeasonIndex(newIndex);
                setSeason(seasons[newIndex.row]);
              }}
            >
              {seasons.map((s) => (<SelectItem key={s} title={s.toString()} />))}
            </Select>
            {loading ? (
              <Layout style={styles.center}><Spinner size="large" /></Layout>
            ) : (
              <>
                {leagueData && <LeagueHeader leagueData={leagueData} />}
                
                <TabView
                  selectedIndex={tabIndex}
                  onSelect={(index) => setTabIndex(index as number)}
                >
                  <Tab title="CLASSIFICAÇÃO">
                    <Layout style={styles.tabContainer}>
                      {standings.map((group, index) => (
                        <View key={index} style={{ marginBottom: 24 }}>
                          {isGroupedCompetition && (
                            <Text category="h6" style={styles.groupTitle}>
                              {group[0]?.group || `Grupo ${index + 1}`}
                            </Text>
                          )}
                          <StandingsTable standings={group} />
                        </View>
                      ))}
                    </Layout>
                  </Tab>
                </TabView>

                {(!standings || standings[0]?.length === 0) && (
                  <Text style={styles.centerText}>Nenhuma classificação encontrada.</Text>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', minHeight: 300 },
  centerText: { textAlign: 'center', marginTop: 20 },
  contentContainer: {
    flex: 1,
  },
  headerSection: {
    padding: 16,
  },
  competitionHeader: { marginBottom: 16, borderRadius: 12, overflow: 'hidden', minHeight: 100 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerText: { color: "#000", fontWeight: '600' },
  logo: { width: 60, height: 60, resizeMode: 'contain' },
  tableContainer: { 
    borderRadius: 8, 
    overflow: 'hidden', 
    backgroundColor: '#FFF',
    minWidth: 500
  },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F0F0F0', alignItems: 'center', height: 40 },
  tableHeader: { backgroundColor: '#E4E9F2', height: 35 },
  cell: { width: 45, textAlign: 'center', fontSize: 12, paddingHorizontal: 4, color: '#000' },
  rankCell: { width: 30, fontWeight: 'bold' },
  teamCell: { width: 180, textAlign: 'left', paddingLeft: 8 },
  pointsCell: { width: 50 },
  teamLogo: { width: 24, height: 24, resizeMode: 'contain', marginRight: 8 },
  tabContainer: {
    paddingTop: 16,
    backgroundColor: 'transparent'
  },
  groupTitle: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  playoffsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 300,
    backgroundColor: 'transparent'
  },
  playoffsIcon: {
    width: 48,
    height: 48,
    marginBottom: 16,
  },
});