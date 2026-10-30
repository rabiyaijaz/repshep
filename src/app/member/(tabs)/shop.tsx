import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AttentionRow, Badge, Button, Card, Empty, IconBubble, Screen, T, TopBar, useToast } from '@/components/ui';
import { ME, pkr, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

// Order from the gym counter; pick up and pay at the front desk.
export default function MemberShop() {
  const { orders, products, placeOrder, member } = useStore();
  const mine = orders.filter((o) => o.memberId === ME && o.status !== 'collected');
  const inStock = products.filter((p) => p.inStock);
  const { show, node } = useToast();

  return (
    <>
      <Screen>
        <TopBar />
        <T v="h2">Gym shop</T>
        <T v="body" color={colors.inkSoft}>
          Order now, pay and pick up at the front desk
        </T>

        {mine.length > 0 && (
          <Card tone="primary" style={{ borderRadius: radius.md, gap: space.xs }}>
            <T v="bodyM" color={colors.accent}>
              Your orders
            </T>
            {mine.map((o) => (
              <View key={o.id} style={styles.between}>
                <T v="body" color={colors.white} style={{ flex: 1 }}>
                  {o.item}
                  {o.reward ? ' · reward' : ''}
                </T>
                <Badge label={o.status === 'ready' ? 'Ready for pickup' : 'Preparing'} bg={o.status === 'ready' ? colors.accent : colors.white} fg={colors.ink} />
              </View>
            ))}
          </Card>
        )}

        <AttentionRow icon="gift" title={`${member(ME)?.points ?? 0} reward points`} sub="Swap points for shakes, towels and PT" onPress={() => router.push('/member/rewards')} />

        {inStock.length === 0 && <Empty icon="shopping-bag" title="Nothing in stock right now" />}
        {inStock.map((p) => (
          <Card key={p.id} style={[styles.between, { borderRadius: radius.md }]}>
            <View style={styles.row}>
              <IconBubble icon={p.icon} />
              <View style={{ flexShrink: 1 }}>
                <T v="bodyM">{p.name}</T>
                <T v="caption" color={colors.inkSoft}>
                  {pkr(p.price)}
                </T>
              </View>
            </View>
            <Button
              label="Order"
              small
              onPress={() => {
                placeOrder(ME, p.name, p.price);
                show(`${p.name} ordered`);
              }}
            />
          </Card>
        ))}
      </Screen>
      {node}
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexShrink: 1 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
});
