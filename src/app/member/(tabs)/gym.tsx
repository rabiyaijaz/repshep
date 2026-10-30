import { Feather } from '@expo/vector-icons';
import { Linking, StyleSheet, View } from 'react-native';
import { Button, Card, IconBubble, Screen, T, TopBar } from '@/components/ui';
import { ME, pkr, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

// What members see on the gym invitation: hours, prices, facilities.
export default function MyGym() {
  const { gym, member } = useStore();
  const me = member(ME)!;
  return (
    <Screen>
      <TopBar />
      <Card tone="dark" style={{ borderRadius: radius.lg, gap: space.xs, padding: space.lg }}>
        <T v="h1" color={colors.white}>
          {gym.name} Gym
        </T>
        <View style={styles.row}>
          <Feather name="map-pin" size={14} color={colors.accent} />
          <T v="caption" color={colors.accent} style={{ flex: 1 }}>
            {gym.location}, {gym.city}
          </T>
        </View>
        <View style={[styles.row, { marginTop: space.sm }]}>
          <Button label="WhatsApp gym" kind="accent" small icon="message-circle" onPress={() => Linking.openURL(`https://wa.me/${gym.phone.replace(/[^0-9]/g, '')}`)} />
          <Button label="Directions" kind="white" small icon="navigation" onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(`${gym.location} ${gym.city}`)}`)} />
        </View>
      </Card>

      <T v="h3" style={{ marginTop: space.xs }}>
        Timings
      </T>
      <Card style={{ borderRadius: radius.md, gap: space.sm }}>
        {gym.timings.map((t) => {
          const [who, hours] = t.split('·').map((s) => s.trim());
          return (
            <View key={t} style={styles.between}>
              <View style={styles.row}>
                <IconBubble icon="clock" />
                <T v="bodyM">{who}</T>
              </View>
              <T v="body">{hours}</T>
            </View>
          );
        })}
      </Card>

      <T v="h3" style={{ marginTop: space.xs }}>
        Packages
      </T>
      <Card style={{ borderRadius: radius.md, gap: space.sm }}>
        {gym.packages.map((p) => (
          <View key={p.name} style={styles.between}>
            <View style={styles.row}>
              <T v="bodyM">{p.name}</T>
              {p.name === me.plan && (
                <View style={styles.yours}>
                  <T v="micro" color={colors.white}>
                    Your plan
                  </T>
                </View>
              )}
            </View>
            <T v="bodyStrong">{pkr(p.price)}</T>
          </View>
        ))}
      </Card>

      <T v="h3" style={{ marginTop: space.xs }}>
        Facilities
      </T>
      <View style={styles.tags}>
        {gym.facilities.split(',').map((f) => (
          <View key={f} style={styles.tag}>
            <Feather name="check" size={14} color={colors.primary} />
            <T v="bodyStrong">{f.trim().replace(/^./, (c) => c.toUpperCase())}</T>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  yours: { backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.accent, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 8 },
});
