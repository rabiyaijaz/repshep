import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useGymSheets } from '@/components/GymSheets';
import { Badge, Button, Card, Empty, IconBubble, Screen, SectionTitle, Segmented, T, Toggle, TopBar } from '@/components/ui';
import { pkr, useStore, type Order } from '@/store';
import { colors, radius, space } from '@/theme';

const label: Record<Order['status'], { text: string; bg: string; fg: string }> = {
  preparing: { text: 'New', bg: colors.primary, fg: colors.white },
  ready: { text: 'Ready for pickup', bg: colors.accent, fg: colors.ink },
  collected: { text: 'Collected', bg: colors.line, fg: colors.inkSoft },
};

// Shop: orders members placed (incl. reward redemptions) and the products they can buy.
export default function Shop() {
  const { orders, products, member, setOrderStatus, toggleStock, recordPayment } = useStore();
  const { open, toast } = useGymSheets();
  const [tab, setTab] = useState<'orders' | 'products'>('orders');
  const openOrders = orders.filter((o) => o.status !== 'collected');
  const done = orders.filter((o) => o.status === 'collected');

  return (
    <Screen>
      <TopBar />
      <SectionTitle action={tab === 'products' ? 'Add product' : undefined} onAction={() => open('product')}>
        Shop
      </SectionTitle>
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { key: 'orders', label: `Orders${openOrders.length ? ` · ${openOrders.length}` : ''}` },
          { key: 'products', label: 'Products' },
        ]}
      />

      {tab === 'orders' && (
        <>
          {orders.length === 0 && <Empty icon="shopping-bag" title="No orders yet" sub="Orders members place in the app land here." />}
          {[...openOrders, ...done].map((o) => {
            const who = member(o.memberId)?.name ?? 'Member';
            return (
              <Card key={o.id} style={{ borderRadius: radius.md, gap: space.sm, opacity: o.status === 'collected' ? 0.6 : 1 }}>
                <View style={styles.row}>
                  <IconBubble icon={o.reward ? 'gift' : 'shopping-cart'} />
                  <View style={{ flex: 1 }}>
                    <T v="bodyM">{o.item}</T>
                    <T v="caption" color={colors.inkSoft}>
                      {who} · {o.reward ? 'Reward · paid with points' : pkr(o.price)}
                    </T>
                  </View>
                  <Badge label={label[o.status].text} bg={label[o.status].bg} fg={label[o.status].fg} />
                </View>
                {o.status === 'preparing' && (
                  <Button
                    label="Mark ready & notify"
                    small
                    onPress={() => {
                      setOrderStatus(o.id, 'ready');
                      toast(`${who.split(' ')[0]} notified: order ready`);
                    }}
                  />
                )}
                {o.status === 'ready' && (
                  <Button
                    label={o.reward ? 'Mark collected' : `Collected · take ${pkr(o.price)}`}
                    kind="white"
                    small
                    onPress={() => {
                      setOrderStatus(o.id, 'collected');
                      if (!o.reward) recordPayment(o.memberId, o.price, 'Cash', 'Shop order');
                      toast(o.reward ? 'Reward collected' : 'Collected and payment recorded');
                    }}
                  />
                )}
              </Card>
            );
          })}
        </>
      )}

      {tab === 'products' && (
        <Card style={{ borderRadius: radius.md }}>
          {products.map((p) => (
            <View key={p.id} style={styles.product}>
              <Toggle value={p.inStock} onChange={() => toggleStock(p.id)} label={p.name} sub={`${pkr(p.price)} · ${p.inStock ? 'In stock' : 'Hidden — out of stock'}`} />
            </View>
          ))}
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  product: { borderBottomWidth: 1, borderBottomColor: colors.line, paddingVertical: 4 },
});
