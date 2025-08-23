import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Button, IndexPath, Input, Layout, Select, SelectItem, Text } from '@ui-kitten/components';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const favoriteTeams = [
  'Flamengo',
  'Palmeiras',
  'São Paulo',
  'Corinthians',
  'Vasco da Gama',
  'Grêmio',
];

export default function ProfileScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [username, setUsername] = useState('Usuário');
  const [selectedTeamIndex, setSelectedTeamIndex] = useState<IndexPath | undefined>();
  const [status, setStatus] = useState('');

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('@userProfile');
      if (savedData) {
        const profile = JSON.parse(savedData);
        setUsername(profile.username || 'Usuário');
        setImageUri(profile.imageUri || null);
        if (profile.favoriteTeam) {
          const teamIndex = favoriteTeams.indexOf(profile.favoriteTeam);
          if (teamIndex > -1) {
            setSelectedTeamIndex(new IndexPath(teamIndex));
          }
        }
      }
    } catch (error) {
      console.error('Falha ao carregar os dados do perfil.', error);
    }
  };

  const saveProfileData = async () => {
    try {
      const favoriteTeam = selectedTeamIndex ? favoriteTeams[selectedTeamIndex.row] : null;
      const profileData = {
        username,
        imageUri,
        favoriteTeam,
      };
      await AsyncStorage.setItem('@userProfile', JSON.stringify(profileData));
      setStatus('Perfil salvo com sucesso!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Falha ao salvar os dados do perfil.', error);
      setStatus('Erro ao salvar o perfil.');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text category="h4" style={styles.title}>
          Meu Perfil
        </Text>

        <TouchableOpacity onPress={pickImage}>
          <Avatar
            source={
              imageUri
                ? { uri: imageUri }
                : { uri: 'https://i.pravatar.cc/150?img=12' } // Imagem padrão
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Text appearance="hint" style={styles.hint}>Toque na imagem para alterar</Text>

        <Input
          label="Nome de Usuário"
          placeholder="Digite seu nome"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        <Select
          label="Time Favorito"
          style={styles.input}
          placeholder="Selecione seu time"
          value={selectedTeamIndex ? favoriteTeams[selectedTeamIndex.row] : ''}
          selectedIndex={selectedTeamIndex}
          onSelect={(index) => setSelectedTeamIndex(index as IndexPath)}
        >
          {favoriteTeams.map((team) => (
            <SelectItem key={team} title={team} />
          ))}
        </Select>

        <Button onPress={saveProfileData} style={styles.button}>
          Salvar Perfil
        </Button>
        
        {status ? <Text style={styles.statusText}>{status}</Text> : null}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
  },
  hint: {
    marginBottom: 24,
  },
  input: {
    width: '100%',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    marginTop: 8,
  },
  statusText: {
    marginTop: 16,
    color: '#3366FF',
    fontWeight: 'bold',
  },
});