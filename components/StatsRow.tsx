import { Statistic } from '@/types/match';
import { Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface StatsRowProps {
  statHome?: Statistic;
  statAway?: Statistic;
}

const parseValue = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  const numericString = String(value).replace('%', '');
  const number = parseFloat(numericString);
  return isNaN(number) ? 0 : number;
};

export const StatsRow: React.FC<StatsRowProps> = ({ statHome, statAway }) => {
  const valueHome = parseValue(statHome?.value);
  const valueAway = parseValue(statAway?.value);
  const total = valueHome + valueAway;

  const homeFlex = total > 0 ? valueHome / total : 0.5;
  const awayFlex = total > 0 ? valueAway / total : 0.5;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.valueText}>{statHome?.value ?? '0'}</Text>
        <Text style={styles.typeText}>{statHome?.type}</Text>
        <Text style={styles.valueText}>{statAway?.value ?? '0'}</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarHome, { flex: homeFlex }]} />
        <View style={[styles.progressBarAway, { flex: awayFlex }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  valueText: {
    fontSize: 16,
    fontWeight: 'bold',
    width: '20%',
    textAlign: 'center',
  },
  typeText: {
    fontSize: 14,
    color: '#666',
    width: '60%',
    textAlign: 'center',
  },
  progressBarContainer: {
    flexDirection: 'row',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarHome: {
    backgroundColor: '#3366FF',
  },
  progressBarAway: {
    backgroundColor: '#FF3D71',
  },
});