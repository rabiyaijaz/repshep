import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useGymSheets } from '@/components/GymSheets';
import { Avatar, Badge, Button, Card, Divider, Empty, Screen, Segmented, T, TopBar } from '@/components/ui';
import { useNeedsPoke, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

type Tab = 'needs' | 'history' | 'failed';

// Poke hub — Figma [Walkthrough] 30 / 28 / 24 (107:8791, 107:9426, 107:9264).
export default function Poke() {
  const { pokes, member, retryPoke } = useStore();
  const needs = useNeedsPoke();
  const { open, toast } = useGymSheets();
  const [tab, setTab] = useState<Tab>('needs');
  const failed = pokes.filter((p) => p.status === 'failed');
  const sent = pokes.filter((p) => p.status === 'delivered');

  return (
    <Screen>
      <TopBar back />
      <Card tone="primary" style={styles.hero}>
        <T v="h3" color={colors.accent}>
          Ready for a friendly nudge
        </T>
        <T v="display" color={colors.white} style={{ fontSize: 40, lineHeight: 48 }}>
          {needs.length} <T v="display" color="#A9A9C9" style={{ fontSize: 40, lineHeight: 48 }}>members</T>
        </T>
        <T v="body" color={colors.white}>
          Paused memberships are excluded
        </T>
      </Card>
      <View style={styles.row}>
        <Button label="Poking rules" kind="accent" style={{ flex: 1 }} onPress={() => toast('Rules: nudge after 7 days away, max 1 per week')} />
        <Button label="Channel setup" style={{ flex: 1 }} onPress={() => open('channels')} />
      </View>
      <Segmented<Tab>
        value={tab}
        onChange={setTab}
        options={[
          { key: 'needs', label: 'Needs a poke' },
          { key: 'history', label: 'History' },
          { key: 'failed', label: 'Failed' },
        ]}
      />

      <Card style={{ borderRadius: radius.md, paddingVertical: space.xs }}>
        {tab === 'needs' &&
          (needs.length === 0 ? (
            <Empty icon="smile" title="Everyone’s showing up" />
          ) : (
            needs.map((m, i) => (
              <View key={m.id}>
                <Pressable onPress={() => router.push({ pathname: '/gym/member/[id]', params: { id: m.id } })} style={styles.item}>
                  <View style={styles.row}>
                    <Avatar name={m.name} />
                    <T v="h3">{m.name}</T>
                  </View>
                  <View style={styles.between}>
                    <T v="body" color={colors.inkSoft}>
                      {m.daysAway} days away · {m.daysAway >= 7 ? 'At risk' : 'Check gently'}
                    </T>
                    <Pressable onPress={() => open('poke', m.id)} hitSlop={8}>
                      <T v="bodyM" color={colors.primary}>
                        Poke Member
                      </T>
                    </Pressable>
                  </View>
                </Pressable>
                {i < needs.length - 1 && <Divider style={{ width: '70%' }} />}
              </View>
            ))
          ))}

        {tab === 'history' &&
          (sent.length === 0 ? (
            <Empty icon="send" title="No nudges sent yet" />
          ) : (
            sent.map((p) => (
              <View key={p.id} style={[styles.item, { gap: 6 }]}>
                <View style={styles.between}>
                  <T v="bodyM">{member(p.memberId)?.name}</T>
                  <Badge label="Delivered" bg={colors.accent} fg={colors.ink} />
                </View>
                <T v="caption" color={colors.inkSoft}>
                  {p.channel} nudge · {p.at}
                </T>
                <T v="body">{p.message}</T>
              </View>
            ))
          ))}

        {tab === 'failed' &&
          (failed.length === 0 ? (
            <Empty icon="check-circle" title="No failed nudges" />
          ) : (
            failed.map((p) => (
              <View key={p.id} style={[styles.item, { gap: 6 }]}>
                <View style={styles.row}>
                  <Avatar name={member(p.memberId)?.name ?? '?'} />
                  <T v="h3">{member(p.memberId)?.name}</T>
                </View>
                <T v="body" color={colors.inkSoft}>
                  WhatsApp reminder failed · demo delivery error
                </T>
                <Button
                  label="Review & Retry"
                  small
                  onPress={() => {
                    retryPoke(p.id);
                    toast('Resent in-app');
                  }}
                />
              </View>
            ))
          ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { padding: space.xl, gap: space.xs, borderRadius: radius.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  item: { paddingVertical: space.md, gap: space.sm },
});
