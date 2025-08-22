import { Player } from '@/types/match';
import { Avatar } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export interface PlayerObj {
  player: Player;
}

export interface LineupPlayerProps {
  playerObj: PlayerObj;
  getPlayerPhoto: (playerId: number) => string;
  onPress: (playerObj: PlayerObj) => void;
}

export const LineupPlayer: React.FC<LineupPlayerProps> = ({ playerObj, getPlayerPhoto, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(playerObj)}>
      <Avatar 
        size="small" 
        source={{ uri: playerObj.player.photo || getPlayerPhoto(playerObj.player.id) }} 
      />
      <Text style={styles.playerName}>{playerObj.player.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 2,
  },
  playerName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginTop: 2,
  },
});
