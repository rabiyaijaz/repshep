import { StyleSheet, View } from 'react-native';
import { Button, Card, IconBubble, Screen, T, TopBar, useToast } from '@/components/ui';
import { ME, REWARDS, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

// Spend reward points (5 per check-in). Redemptions go to the gym's shop orders.
export default function Rewards() {
  const { member, redeem, orders } = useStore();
  const { show, node } = useToast();
  const me = member(ME)!;
  const pending = orders.filter((o) => o.memberId === ME && o.reward && o.status !== 'collected');

  return (
    <>
      <Screen>
        <TopBar back />
        <Card tone="primary" style={styles.hero}>
          <T v="h3" color={colors.accent}>
            Reward points
          </T>
          <T v="display" color={colors.white}>
            {me.points}
          </T>
          <T v="body" color={colors.white}>
            You earn 5 points every check-in
          </T>
        </Card>

        {pending.length > 0 && (
          <Card tone="white" style={{ borderRadius: radius.md, gap: 4, borderWidth: 1, borderColor: colors.line }}>
            <T v="bodyM">Waiting at the front desk</T>
            {pending.map((o) => (
              <T key={o.id} v="body" color={colors.inkSoft}>
                {o.item} · {o.status === 'ready' ? 'ready to collect' : 'being prepared'}
              </T>
            ))}
          </Card>
        )}

        {REWARDS.map((r) => {
          const can = me.points >= r.cost;
          return (
            <Card key={r.id} style={[styles.row, { borderRadius: radius.md }]}>
              <IconBubble icon={r.icon} />
              <View style={{ flex: 1 }}>
                <T v="bodyM">{r.name}</T>
                <T v="caption" color={colors.inkSoft}>
                  {r.cost} points{can ? '' : ` · ${r.cost - me.points} more to go`}
                </T>
              </View>
              <Button
                label="Redeem"
                small
                disabled={!can}
                onPress={() => {
                  if (redeem(ME, r.id)) show(`${r.name} redeemed — collect at the front desk`);
                }}
              />
            </Card>
          );
        })}
      </Screen>
      {node}
    </>
  );
}

const styles = StyleSheet.create({
  hero: { padding: space.xl, gap: space.xs, borderRadius: radius.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
});
