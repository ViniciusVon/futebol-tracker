import {
  BottomNavigation,
  BottomNavigationTab,
  Layout,
} from '@ui-kitten/components';
import { Slot, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CustomTabLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const selectedIndex = (() => {
    switch (pathname) {
      case '/':
        return 0;
      case '/leagues':
        return 1;
      case '/profile':
        return 2;
      case '/settings':
        return 3;
      default:
        return 0;
    }
  })();

  const handleSelect = (index: number) => {
    switch (index) {
      case 0:
        router.replace('/');
        break;
      case 1:
        router.replace('/leagues');
        break;
      case 2:
        router.replace('/profile');
        break;
      case 3:
        router.replace('/settings');
        break;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1 }}>
        <Slot />
      </Layout>

      <BottomNavigation selectedIndex={selectedIndex} onSelect={handleSelect}>
        <BottomNavigationTab title="Início" />
        <BottomNavigationTab title="Ligas" />
        <BottomNavigationTab title="Perfil" />
        <BottomNavigationTab title="Configurações" />
      </BottomNavigation>
    </SafeAreaView>
  );
}
