import { StyleSheet, View } from 'react-native';
import { FakeQR } from '@/components/FakeQR';
import { Button, Card, Screen, T, TopBar, useToast } from '@/components/ui';
import { ME, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

// Member check-in pass: the gym's front desk scans this code.
export default function CheckIn() {
  const { member, gym, checkIn, joinState } = useStore();
  const me = member(ME)!;
  const { show, node } = useToast();
  const done = me.daysAway === 0;
  const frozen = me.status === 'frozen';
  const pending = joinState !== 'approved' || frozen;

  return (
    <>
      <Screen>
        <TopBar />
        <T v="h2">Check in</T>
        <T v="body" color={colors.inkSoft}>
          Show this code at the {gym.name} front desk
        </T>
        <Card tone="primary" style={styles.pass}>
          <View style={styles.qr}>
            <FakeQR value={`${gym.code}-${me.id}`} size={190} color={pending ? colors.line : colors.ink} />
          </View>
          <T v="h3" color={colors.white}>
            {me.name}
          </T>
          <T v="caption" color={colors.accent}>
            {frozen ? 'Membership paused — ask the front desk to unfreeze' : pending ? 'Waiting for the gym to accept your request' : `${me.plan} · valid till ${me.expiry}`}
          </T>
        </Card>
        {done ? (
          <Card style={{ borderRadius: radius.md, alignItems: 'center', gap: 4 }}>
            <T v="bodyM">You’re checked in for today</T>
            <T v="caption" color={colors.inkSoft}>
              +5 points added · {me.points} points total
            </T>
          </Card>
        ) : (
          <Button
            label="Simulate front-desk scan"
            kind="accent"
            disabled={pending}
            onPress={() => {
              checkIn(ME);
              show('Checked in · +5 points');
            }}
          />
        )}
        <T v="caption" color={colors.muted} style={{ textAlign: 'center' }}>
          Your code refreshes every visit and only works at {gym.name}.
        </T>
      </Screen>
      {node}
    </>
  );
}

const styles = StyleSheet.create({
  pass: { alignItems: 'center', padding: space.xl, gap: space.xs, borderRadius: radius.lg },
  qr: { backgroundColor: colors.white, padding: space.md, borderRadius: radius.md, marginBottom: space.sm },
});
