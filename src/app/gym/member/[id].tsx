import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useGymSheets } from '@/components/GymSheets';
import { MembershipCard } from '@/components/MembershipCard';
import { ActionTile, Avatar, Badge, Button, Card, Divider, Empty, Screen, Segmented, StatusBadge, T, TopBar } from '@/components/ui';
import { useStore } from '@/store';
import { colors, radius, space } from '@/theme';

type Tab = 'poke' | 'history' | 'failed';

// Member detail — Figma [Walkthrough] 27 (107:10785).
export default function MemberDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { member, checkIn, renew, pokes, payments, activity } = useStore();
  const { open, toast } = useGymSheets();
  const [tab, setTab] = useState<Tab>('history');
  const m = member(id);
  if (!m) {
    return (
      <Screen>
        <TopBar back />
        <Empty icon="user-x" title="Member not found" />
      </Screen>
    );
  }

  const myPokes = pokes.filter((p) => p.memberId === m.id);
  const failed = myPokes.filter((p) => p.status === 'failed');
  const history = [
    ...payments.filter((p) => p.memberId === m.id).map((p) => ({ id: p.id, title: `PKR ${p.amount.toLocaleString()} · ${p.method}`, sub: p.category, at: p.at })),
    // Nudges are listed from `pokes` above, so skip their activity-log copies.
    ...activity.filter((a) => a.who === m.name && !a.title.includes('nudge')).map((a) => ({ id: a.id, title: a.title, sub: a.detail, at: a.at })),
  ];

  return (
    <Screen>
      <TopBar back />
      <View style={styles.head}>
        <Avatar name={m.name} size={64} photo={m.photo} />
        <View style={{ flex: 1 }}>
          <T v="h2">{m.name}</T>
          <T v="body" color={colors.inkSoft}>
            {m.phone}
          </T>
        </View>
        <StatusBadge status={m.status} />
      </View>
      <Divider color={colors.line} />
      <View style={styles.stats}>
        <View>
          <T v="h3">{m.daysAway === 0 ? 'Today' : `${m.daysAway} days ago`}</T>
          <T v="body" color={colors.inkSoft}>
            Last visit
          </T>
        </View>
        <View>
          <T v="h3">{m.visitsThisMonth}</T>
          <T v="body" color={colors.inkSoft}>
            Visits this month
          </T>
        </View>
      </View>

      <Button
        label={m.daysAway === 0 ? 'Checked in today' : 'Check in'}
        disabled={m.daysAway === 0 || m.status === 'frozen'}
        onPress={() => {
          checkIn(m.id);
          toast(`${m.name.split(' ')[0]} checked in · +5 points`);
        }}
        style={{ height: 56 }}
      />
      <View style={styles.actions}>
        <ActionTile icon="credit-card" label="Add payment" onPress={() => open('payment', m.id)} />
        <ActionTile icon="message-square" label="Poke Member" onPress={() => open('poke', m.id)} />
        <ActionTile icon="pause-circle" label="Freeze" onPress={() => toast('Freezing is coming soon')} />
      </View>

      <Segmented<Tab>
        value={tab}
        onChange={setTab}
        options={[
          { key: 'poke', label: 'Needs a poke' },
          { key: 'history', label: 'History' },
          { key: 'failed', label: `Failed${failed.length ? ` · ${failed.length}` : ''}` },
        ]}
      />
      <Card style={{ borderRadius: radius.md, gap: space.sm }}>
        {tab === 'poke' &&
          (m.daysAway >= 2 ? (
            <View style={styles.rowBetween}>
              <T v="body">
                {m.daysAway} days away · {m.daysAway >= 7 ? 'At risk' : 'Check gently'}
              </T>
              <Button label="Poke Member" small onPress={() => open('poke', m.id)} />
            </View>
          ) : (
            <T v="body" color={colors.inkSoft}>
              Visited recently — no nudge needed.
            </T>
          ))}
        {tab === 'history' &&
          (history.length + myPokes.length === 0 ? (
            <T v="body" color={colors.inkSoft}>
              No activity yet.
            </T>
          ) : (
            <>
              {myPokes.map((p) => (
                <View key={p.id} style={{ gap: 2 }}>
                  <View style={styles.rowBetween}>
                    <T v="bodyStrong">{p.channel} nudge</T>
                    <Badge label={p.status === 'failed' ? 'Failed' : 'Delivered'} bg={p.status === 'failed' ? colors.error : colors.accent} fg={p.status === 'failed' ? colors.white : colors.ink} />
                  </View>
                  <T v="caption" color={colors.inkSoft} numberOfLines={2}>
                    {p.message}
                  </T>
                  <T v="micro" color={colors.muted}>
                    {p.at}
                  </T>
                </View>
              ))}
              {history.map((h) => (
                <View key={h.id} style={{ gap: 2 }}>
                  <T v="bodyStrong">{h.title}</T>
                  {h.sub ? (
                    <T v="caption" color={colors.inkSoft}>
                      {h.sub}
                    </T>
                  ) : null}
                  <T v="micro" color={colors.muted}>
                    {h.at}
                  </T>
                </View>
              ))}
            </>
          ))}
        {tab === 'failed' &&
          (failed.length === 0 ? (
            <T v="body" color={colors.inkSoft}>
              Nothing failed. Nice.
            </T>
          ) : (
            failed.map((p) => (
              <View key={p.id} style={{ gap: 2 }}>
                <T v="bodyStrong">WhatsApp reminder failed</T>
                <T v="caption" color={colors.inkSoft}>
                  {p.at}
                </T>
              </View>
            ))
          ))}
      </Card>

      <MembershipCard
        m={m}
        action="Renew"
        onAction={() => {
          renew(m.id);
          toast('Membership renewed to 14 Oct 2026');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  stats: { flexDirection: 'row', gap: space.xl },
  actions: { flexDirection: 'row', gap: space.xs },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.xs },
});
