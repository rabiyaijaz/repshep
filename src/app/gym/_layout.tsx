import { Stack } from 'expo-router';
import { GymSheetsProvider } from '@/components/GymSheets';
import { colors } from '@/theme';

// Tabs live in (tabs); detail pages (member, poke, activity, requests) push on top.
export default function GymLayout() {
  return (
    <GymSheetsProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
    </GymSheetsProvider>
  );
}
