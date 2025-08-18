import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  IconRegistry,
  Layout,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
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
      case 0: router.replace('/'); break;
      case 1: router.replace('/leagues'); break;
      case 2: router.replace('/profile'); break;
      case 3: router.replace('/settings'); break;
    }
  };

  const HomeIcon = (props: any) => <Icon {...props} name="home-outline" />;
  const LeagueIcon = (props: any) => <Icon {...props} name="globe-outline" />;
  const ProfileIcon = (props: any) => <Icon {...props} name="person-outline" />;
  const SettingsIcon = (props: any) => <Icon {...props} name="settings-2-outline" />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <IconRegistry icons={EvaIconsPack} />

      <Layout style={{ flex: 1 }}>
        <Slot />
      </Layout>

      <BottomNavigation selectedIndex={selectedIndex} onSelect={handleSelect}>
        <BottomNavigationTab title="Início" icon={HomeIcon} />
        <BottomNavigationTab title="Ligas" icon={LeagueIcon} />
        <BottomNavigationTab title="Perfil" icon={ProfileIcon} />
        <BottomNavigationTab title="Configurações" icon={SettingsIcon} />
      </BottomNavigation>
    </SafeAreaView>
  );
}
