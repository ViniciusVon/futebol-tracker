import { Avatar, Button, Layout, Text } from '@ui-kitten/components';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function ProfileScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <Layout style={styles.container}>
      <Text category="h4" style={styles.title}>
        Meu Perfil
      </Text>
      <Avatar
        source={
          imageUri
            ? { uri: imageUri }
            : { uri: 'https://i.pravatar.cc/150?img=12' }
        }
        style={styles.avatar}
      />
      <Button onPress={pickImage}>Escolher Foto</Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: { marginBottom: 16 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
});
