import { Team } from '@/types/match';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export interface Goals {
  home: number;
  away: number;
}

export interface MatchHeaderProps {
  homeTeam: Team;
  awayTeam: Team;
  goals: Goals;
  status: string;
  date: string;
}

export const MatchHeader: React.FC<MatchHeaderProps> = ({
  homeTeam,
  awayTeam,
  goals,
  status,
  date,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.teamsRow}>
        <View style={styles.teamContainer}>
          {homeTeam.logo && <Image source={{ uri: homeTeam.logo }} style={styles.logo} />}
          <Text style={styles.teamName}>{homeTeam.name ?? '-'}</Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{goals.home ?? '-'}</Text>
          <Text style={styles.scoreSeparator}>-</Text>
          <Text style={styles.scoreText}>{goals.away ?? '-'}</Text>
        </View>

        <View style={styles.teamContainer}>
          {awayTeam.logo && <Image source={{ uri: awayTeam.logo }} style={styles.logo} />}
          <Text style={styles.teamName}>{awayTeam.name ?? '-'}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.statusText}>{status ?? '-'}</Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamContainer: { alignItems: 'center', flex: 1 },
  logo: { width: 48, height: 48, marginBottom: 8, resizeMode: 'contain' },
  teamName: { fontSize: 16, fontWeight: '600', textAlign: 'center', color: '#333' },
  scoreContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  scoreText: { fontSize: 32, fontWeight: '700', color: '#222' },
  scoreSeparator: { fontSize: 24, marginHorizontal: 4, color: '#888' },
  infoRow: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
  statusText: { fontSize: 14, fontWeight: '500', color: '#555' },
  dateText: { fontSize: 14, fontWeight: '400', color: '#777' },
});
