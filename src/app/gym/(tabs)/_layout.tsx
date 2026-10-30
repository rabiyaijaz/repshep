import { Tabs } from 'expo-router';
import { makeTabBar } from '@/components/TabBar';
import { colors } from '@/theme';

const TabBar = makeTabBar({
  index: { icon: 'home', label: 'Home' },
  members: { icon: 'users', label: 'Members' },
  scan: { icon: 'maximize', label: 'Check-in scanner', center: true },
  shop: { icon: 'shopping-bag', label: 'Shop orders' },
  settings: { icon: 'settings', label: 'Settings' },
});

export default function GymTabs() {
  return (
    <Tabs tabBar={(p) => <TabBar {...p} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="members" />
      <Tabs.Screen name="scan" />
      <Tabs.Screen name="shop" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
