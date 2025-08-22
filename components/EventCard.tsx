import { Event } from '@/types/match';
import { Icon } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type EventCardProps = {
  event: Event;
  isHome: boolean;
};

export const EventCard: React.FC<EventCardProps> = ({ event, isHome }) => {
  let iconName = 'info-outline';
  if (event.type === 'Goal') iconName = 'checkmark-circle-2';
  if (event.type === 'Card') {
    iconName = event.detail === 'Yellow Card' ? 'alert-triangle-outline' : 'close-circle-outline';
  }
  if (event.type?.toLowerCase().includes('subst')) iconName = 'swap-outline';

  const iconColor =
    event.type === 'Goal' ? 'green' :
    event.type === 'Card' && event.detail === 'Red Card' ? 'red' :
    event.type === 'Card' && event.detail === 'Yellow Card' ? 'yellow' :
    '#333';

  return (
    <View style={[styles.eventCard, { alignSelf: isHome ? 'flex-start' : 'flex-end' }]}>
      <View style={[styles.eventContent, { flexDirection: isHome ? 'row' : 'row-reverse' }]}>
        <Text style={styles.eventTime}>{event.time?.elapsed ?? '-'}'</Text>
        <Icon name={iconName} fill={iconColor} style={{ width: 20, height: 20, marginRight: isHome ? 6 : 0, marginLeft: isHome ? 0 : 6 }} />
        <View style={{ alignItems: isHome ? 'flex-start' : 'flex-end' }}>
          <Text style={styles.eventPlayer}>{event.player?.name ?? '-'}</Text>
          {event.assist?.name && <Text style={styles.eventAssist}>↳ {event.assist.name}</Text>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  eventCard: { backgroundColor: '#fff', borderRadius: 12, padding: 10, marginVertical: 6, width: '70%' },
  eventContent: { flexDirection: 'row', alignItems: 'center' },
  eventTime: { fontWeight: 'bold', fontSize: 12, color: '#666', marginBottom: 4 },
  eventPlayer: { fontSize: 14, fontWeight: '600', color: '#222' },
  eventAssist: { fontSize: 12, color: '#777' },
});
