import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useGymSheets } from '@/components/GymSheets';
import { Button, Card, Divider, Empty, Pills, Screen, T, TopBar } from '@/components/ui';
import { pkr, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

// Drill-down from "Monthly earnings →": totals, split by method, every payment.
export default function Earnings() {
  const { gym, payments, member, members } = useStore();
  const { open } = useGymSheets();
  const [method, setMethod] = useState('All');
  const methods = ['All', ...Array.from(new Set(payments.map((p) => p.method)))];
  const list = method === 'All' ? payments : payments.filter((p) => p.method === method);
  const byMethod = useMemo(() => {
    const t: Record<string, number> = {};
    for (const p of payments) t[p.method] = (t[p.method] ?? 0) + p.amount;
    return Object.entries(t).sort((a, b) => b[1] - a[1]);
  }, [payments]);
  const outstanding = members.reduce((s, m) => s + m.dues, 0);
  const max = byMethod[0]?.[1] ?? 1;

  return (
    <Screen>
      <TopBar back />
      <Card tone="primary" style={styles.hero}>
        <T v="h3" color={colors.accent}>
          September earnings
        </T>
        <T v="display" color={colors.white}>
          {pkr(gym.monthEarnings)}
        </T>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <T v="h3" color={colors.accent}>
              {pkr(gym.todayEarnings)}
            </T>
            <T v="caption" color={colors.white}>
              Recorded today
            </T>
          </View>
          <View style={{ flex: 1 }}>
            <T v="h3" color={colors.warnSoft}>
              {pkr(outstanding)}
            </T>
            <T v="caption" color={colors.white}>
              Outstanding dues
            </T>
          </View>
        </View>
      </Card>
      <Button label="Record a payment" icon="plus" onPress={() => open('payment')} />

      <T v="h3">By payment method</T>
      <Card style={{ borderRadius: radius.md, gap: space.sm }}>
        {byMethod.map(([m, total]) => (
          <View key={m} style={{ gap: 4 }}>
            <View style={styles.between}>
              <T v="bodyStrong">{m}</T>
              <T v="bodyStrong">{pkr(total)}</T>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.bar, { width: `${Math.max(6, (total / max) * 100)}%` }]} />
            </View>
          </View>
        ))}
      </Card>

      <T v="h3">Payments</T>
      <Pills options={methods} value={method} onChange={setMethod} />
      <Card style={{ borderRadius: radius.md }}>
        {list.length === 0 && <Empty icon="credit-card" title="No payments yet" />}
        {list.map((p, i) => (
          <View key={p.id}>
            <View style={[styles.between, { paddingVertical: space.sm }]}>
              <View style={{ flex: 1 }}>
                <T v="bodyM">{member(p.memberId)?.name ?? 'Member'}</T>
                <T v="caption" color={colors.inkSoft}>
                  {p.category} · {p.method} · {p.at}
                </T>
              </View>
              <T v="bodyStrong">{pkr(p.amount)}</T>
            </View>
            {i < list.length - 1 && <Divider color={colors.line} />}
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { padding: space.xl, gap: space.xs, borderRadius: radius.lg },
  row: { flexDirection: 'row', gap: space.md, marginTop: space.sm },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  barTrack: { height: 8, borderRadius: 4, backgroundColor: colors.white },
  bar: { height: 8, borderRadius: 4, backgroundColor: colors.primary },
});
