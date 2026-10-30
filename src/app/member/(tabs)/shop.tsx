import { StyleSheet, View } from 'react-native';
import { Badge, Button, Card, IconBubble, Screen, T, TopBar, useToast, type IconName } from '@/components/ui';
import { ME, pkr, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

const PRODUCTS: { item: string; price: number; icon: IconName }[] = [
  { item: 'Whey protein · 1 kg', price: 9500, icon: 'package' },
  { item: 'Creatine · 300 g', price: 4200, icon: 'package' },
  { item: 'Shaker bottle', price: 1200, icon: 'droplet' },
  { item: 'Lifting gloves', price: 1800, icon: 'shield' },
  { item: 'Gym towel', price: 900, icon: 'square' },
];

// Order from the gym counter; pick up and pay at the front desk.
export default function MemberShop() {
  const { orders, placeOrder } = useStore();
  const mine = orders.filter((o) => o.memberId === ME && o.status !== 'collected');
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
                <T v="body" color={colors.white}>
                  {o.item}
                </T>
                <Badge label={o.status === 'ready' ? 'Ready for pickup' : 'Preparing'} bg={o.status === 'ready' ? colors.accent : colors.white} fg={colors.ink} />
              </View>
            ))}
          </Card>
        )}

        {PRODUCTS.map((p) => (
          <Card key={p.item} style={[styles.between, { borderRadius: radius.md }]}>
            <View style={styles.row}>
              <IconBubble icon={p.icon} />
              <View>
                <T v="bodyM">{p.item}</T>
                <T v="caption" color={colors.inkSoft}>
                  {pkr(p.price)}
                </T>
              </View>
            </View>
            <Button
              label="Order"
              small
              onPress={() => {
                placeOrder(ME, p.item, p.price);
                show(`${p.item} ordered`);
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
