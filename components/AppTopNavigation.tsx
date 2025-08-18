import {
    Icon,
    IconElement,
    Layout,
    MenuItem,
    OverflowMenu,
    TopNavigation,
    TopNavigationAction,
} from '@ui-kitten/components';
import React from 'react';
import { StyleSheet } from 'react-native';

interface AppTopNavigationProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const AppTopNavigation = ({
  title,
  subtitle,
  showBackButton = true,
  onBackPress,
}: AppTopNavigationProps): React.ReactElement => {

  const [menuVisible, setMenuVisible] = React.useState(false);

  const toggleMenu = (): void => setMenuVisible(!menuVisible);

  // Ícones
  const BackIcon = (props?: any): IconElement => <Icon {...props} name="arrow-back" />;
  const EditIcon = (props?: any): IconElement => <Icon {...props} name="edit" />;
  const MenuIcon = (props?: any): IconElement => <Icon {...props} name="more-vertical" />;
  const InfoIcon = (props?: any): IconElement => <Icon {...props} name="info" />;
  const LogoutIcon = (props?: any): IconElement => <Icon {...props} name="log-out" />;

  const renderBackAction = (): React.ReactElement => {
    if (!showBackButton) return <></>;
    return <TopNavigationAction icon={BackIcon} onPress={onBackPress} />;
    };

  const renderMenuAction = (): React.ReactElement => (
    <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
  );

  const renderRightActions = (): React.ReactElement => (
    <>
      <TopNavigationAction icon={EditIcon} />
      <OverflowMenu
        anchor={renderMenuAction}
        visible={menuVisible}
        onBackdropPress={toggleMenu}
      >
        <MenuItem accessoryLeft={InfoIcon} title="About" />
        <MenuItem accessoryLeft={LogoutIcon} title="Logout" />
      </OverflowMenu>
    </>
  );

  return (
    <Layout style={styles.container} level="1">
      <TopNavigation
        alignment="center"
        title={title}
        subtitle={subtitle}
        accessoryLeft={renderBackAction}
        accessoryRight={renderRightActions}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { minHeight: 128 },
});
