import { Tabs } from 'expo-router';
import { makeTabBar } from '@/components/TabBar';
import { colors } from '@/theme';

const TabBar = makeTabBar({
  index: { icon: 'home', label: 'Home' },
  gym: { icon: 'map-pin', label: 'My gym' },
  checkin: { icon: 'maximize', label: 'Check in', center: true },
  shop: { icon: 'shopping-bag', label: 'Shop' },
  profile: { icon: 'user', label: 'Profile' },
});

export default function MemberTabs() {
  return (
    <Tabs tabBar={(p) => <TabBar {...p} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="gym" />
      <Tabs.Screen name="checkin" />
      <Tabs.Screen name="shop" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
