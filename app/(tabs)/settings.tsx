import { Divider, Layout, Text, Toggle } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <Layout style={styles.container}>
      <Text category="h4" style={styles.header}>
        Configurações
      </Text>

      <Divider style={styles.divider} />

      <Toggle checked={darkMode} onChange={setDarkMode} style={styles.toggle}>
        Modo escuro
      </Toggle>

      {/* Adicione mais opções aqui */}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  toggle: {
    marginVertical: 8,
  },
});
