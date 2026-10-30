import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useGymSheets } from '@/components/GymSheets';
import { Avatar, Screen, T, TopBar } from '@/components/ui';
import { useStore } from '@/store';
import { colors, radius, space } from '@/theme';

// Front-desk check-in. The camera scanner is mocked: tap a member to simulate their QR scan.
export default function Scan() {
  const { members, checkIn, gym } = useStore();
  const { toast } = useGymSheets();
  const [last, setLast] = useState<string | null>(null);
  const due = members.filter((m) => m.daysAway > 0 && m.status !== 'frozen' && m.status !== 'expired');

  return (
    <Screen>
      <TopBar />
      <T v="h2">Check-in</T>
      <T v="body" color={colors.inkSoft}>
        Scan a member’s RepShep code at the front desk
      </T>
      <View style={styles.viewfinder}>
        {[styles.tl, styles.tr, styles.bl, styles.br].map((s, i) => (
          <View key={i} style={[styles.corner, s]} />
        ))}
        <Feather name="maximize" size={40} color={colors.accent} />
        <T v="bodyM" color={colors.white} style={{ marginTop: space.sm }}>
          {last ? `${last} checked in` : 'Point the camera at the code'}
        </T>
        <T v="caption" color={colors.accent}>
          {gym.checkInsToday} check-ins today
        </T>
      </View>
      <T v="h3" style={{ marginTop: space.xs }}>
        Quick check-in
      </T>
      {due.map((m) => (
        <Pressable
          key={m.id}
          style={styles.row}
          onPress={() => {
            checkIn(m.id);
            setLast(m.name);
            toast(`${m.name} checked in · +5 points`);
          }}
        >
          <Avatar name={m.name} />
          <View style={{ flex: 1 }}>
            <T v="bodyM">{m.name}</T>
            <T v="caption" color={colors.inkSoft}>
              {m.plan}
            </T>
          </View>
          <Feather name="log-in" size={18} color={colors.primary} />
        </Pressable>
      ))}
    </Screen>
  );
}

const C = 28;
const styles = StyleSheet.create({
  viewfinder: { height: 260, borderRadius: radius.lg, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', gap: 4 },
  corner: { position: 'absolute', width: C, height: C, borderColor: colors.accent },
  tl: { top: 24, left: 24, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
  tr: { top: 24, right: 24, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
  bl: { bottom: 24, left: 24, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
  br: { bottom: 24, right: 24, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, backgroundColor: colors.surface, borderRadius: radius.md, padding: space.sm },
});
