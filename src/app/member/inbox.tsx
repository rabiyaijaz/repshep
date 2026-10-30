import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Empty, Field, Screen, T, TopBar } from '@/components/ui';
import { LogoMark } from '@/components/Logo';
import { ME, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

const REPLIES = ['I’ll be in today', 'This week, inshallah', 'Need help with my plan'];

// Nudges the gym sent ("pokes"), with quick replies.
export default function Inbox() {
  const { pokes, gym, markPokesRead, replyToPoke } = useStore();
  const mine = pokes.filter((p) => p.memberId === ME && p.status === 'delivered');
  const [custom, setCustom] = useState<Record<string, string>>({});

  // Opening the inbox marks the gym's messages as read (clears the bell dot).
  useEffect(() => {
    markPokesRead(ME);
  }, [mine.length, markPokesRead]);

  return (
    <Screen>
      <TopBar back />
      <T v="h2">Messages</T>
      <T v="body" color={colors.inkSoft}>
        Check-ins and reminders from {gym.name}
      </T>
      {mine.length === 0 && <Empty icon="inbox" title="No messages yet" sub="Your gym’s reminders and offers show up here." />}
      {mine.map((p) => (
        <Card key={p.id} style={{ borderRadius: radius.md, gap: space.sm }}>
          <View style={styles.row}>
            <LogoMark size={28} />
            <View style={{ flex: 1 }}>
              <T v="bodyM">{gym.name} Gym</T>
              <T v="micro" color={colors.muted}>
                {p.at} · {p.channel}
              </T>
            </View>
          </View>
          <T v="bodyL">{p.message}</T>
          {p.reply ? (
            <View style={styles.reply}>
              <T v="bodyStrong" color={colors.white}>
                {p.reply}
              </T>
            </View>
          ) : (
            <>
              <View style={styles.chips}>
                {REPLIES.map((r) => (
                  <Button key={r} label={r} kind="white" small onPress={() => replyToPoke(p.id, r)} />
                ))}
              </View>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Field label="Write a reply" value={custom[p.id] ?? ''} onChangeText={(v) => setCustom((x) => ({ ...x, [p.id]: v }))} placeholder="Type here..." />
                </View>
                <Button label="Send" small disabled={!custom[p.id]?.trim()} onPress={() => replyToPoke(p.id, custom[p.id].trim())} />
              </View>
            </>
          )}
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  reply: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderRadius: radius.md, borderBottomRightRadius: 4, paddingHorizontal: space.md, paddingVertical: space.xs },
});
