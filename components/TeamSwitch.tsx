import { TeamStatistics } from '@/types/match';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

type TeamSwitchProps = {
  teams: TeamStatistics[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

export const TeamSwitch: React.FC<TeamSwitchProps> = ({ teams, selectedIndex, onSelect }) => (
  <View style={styles.teamSwitchRow}>
    {teams.map((teamStat, idx) => (
      <TouchableOpacity
        key={idx}
        style={[styles.teamSwitchButton, selectedIndex === idx && styles.teamSwitchButtonActive]}
        onPress={() => onSelect(idx)}
      >
        {teamStat.team.logo && <Image source={{ uri: teamStat.team.logo }} style={styles.teamLogoSwitch} />}
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  teamSwitchRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
  teamSwitchButton: { padding: 6, marginHorizontal: 6, borderRadius: 4, borderWidth: 1, borderColor: '#ccc' },
  teamSwitchButtonActive: { borderColor: '#007bff', backgroundColor: '#e6f0ff' },
  teamLogoSwitch: { width: 40, height: 40, resizeMode: 'contain' },
});
