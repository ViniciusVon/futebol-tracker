import { PlayerWithStats } from '@/types/match';
import { Button, Card, Modal, Text } from '@ui-kitten/components';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface PlayerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedPlayer: PlayerWithStats | null;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({ visible, onClose, selectedPlayer }) => {
  return (
    <Modal
      visible={visible}
      backdropStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onBackdropPress={onClose}
    >
      <Card disabled={true} style={styles.card}>
        <Text category="h6" style={styles.modalTitle}>
          {selectedPlayer?.player?.name}
        </Text>

        <Image
          source={{ uri: selectedPlayer?.player?.photo }}
          style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 12, alignSelf: 'center' }}
        />

        <Text style={styles.modalInfo}>Minutos: {selectedPlayer?.statistics[0].games.minutes}</Text>
        <Text style={styles.modalInfo}>Posição: {selectedPlayer?.statistics[0].games.position}</Text>
        <Text style={styles.modalInfo}>Rating: {selectedPlayer?.statistics[0].games.rating}</Text>
        <Text style={styles.modalInfo}>Gols: {selectedPlayer?.statistics[0].goals.total ?? 0}</Text>
        <Text style={styles.modalInfo}>Assistências: {selectedPlayer?.statistics[0].goals.assists ?? 0}</Text>

        <Button style={{ marginTop: 16 }} onPress={onClose}>
          Fechar
        </Button>
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: "100%"
    },
    modalContent: {
        backgroundColor: '#fff',
        color: "#fff",
        padding: 20,
        borderRadius: 16,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: "#fff" , display: "flex", justifyContent: "center", textAlign: "center"},
    modalInfo: { fontSize: 12, fontWeight: '700', marginBottom: 12, color: "#fff" },
    card: { width: 300}
})