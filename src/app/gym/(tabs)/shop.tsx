import { StyleSheet, View } from 'react-native';
import { useGymSheets } from '@/components/GymSheets';
import { Badge, Button, Card, Empty, IconBubble, Screen, T, TopBar } from '@/components/ui';
import { pkr, useStore, type Order } from '@/store';
import { colors, radius, space } from '@/theme';

const label: Record<Order['status'], { text: string; bg: string; fg: string }> = {
  preparing: { text: 'Preparing', bg: colors.surface, fg: colors.ink },
  ready: { text: 'Ready for pickup', bg: colors.accent, fg: colors.ink },
  collected: { text: 'Collected', bg: colors.line, fg: colors.inkSoft },
};

// Shop orders placed by members (supplements, merch).
export default function Shop() {
  const { orders, member, setOrderStatus } = useStore();
  const { toast } = useGymSheets();
  return (
    <Screen>
      <TopBar />
      <T v="h2">Shop orders</T>
      <T v="body" color={colors.inkSoft}>
        Supplements and gear members ordered in the app
      </T>
      {orders.length === 0 && <Empty icon="shopping-bag" title="No orders yet" />}
      {orders.map((o) => (
        <Card key={o.id} style={{ borderRadius: radius.md, gap: space.sm }}>
          <View style={styles.row}>
            <IconBubble icon="shopping-cart" />
            <View style={{ flex: 1 }}>
              <T v="bodyM">{o.item}</T>
              <T v="caption" color={colors.inkSoft}>
                {member(o.memberId)?.name} · {pkr(o.price)}
              </T>
            </View>
            <Badge label={label[o.status].text} bg={label[o.status].bg} fg={label[o.status].fg} />
          </View>
          {o.status === 'preparing' && (
            <Button label="Mark ready & notify" small onPress={() => { setOrderStatus(o.id, 'ready'); toast('Member notified: order ready'); }} />
          )}
          {o.status === 'ready' && <Button label="Mark collected" kind="white" small onPress={() => setOrderStatus(o.id, 'collected')} />}
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: space.sm } });
