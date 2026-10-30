import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AttentionRow, Avatar, Card, Screen, StatusBadge, T, TopBar } from '@/components/ui';
import { ME, pkr, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

export default function Profile() {
  const { member, payments, gym, setRole } = useStore();
  const me = member(ME)!;
  const mine = payments.filter((p) => p.memberId === ME);

  return (
    <Screen>
      <TopBar />
      <View style={styles.head}>
        <Avatar name={me.name} size={64} photo={me.photo} />
        <View style={{ flex: 1 }}>
          <T v="h2">{me.name}</T>
          <T v="body" color={colors.inkSoft}>
            {me.phone}
          </T>
        </View>
        <StatusBadge status={me.status} />
      </View>

      <T v="h3" style={{ marginTop: space.xs }}>
        Payments
      </T>
      <Card style={{ borderRadius: radius.md, gap: space.sm }}>
        {mine.length === 0 ? (
          <T v="body" color={colors.inkSoft}>
            No payments recorded yet. Payments made at the front desk show up here.
          </T>
        ) : (
          mine.map((p) => (
            <View key={p.id} style={styles.between}>
              <View>
                <T v="bodyM">{p.category}</T>
                <T v="caption" color={colors.inkSoft}>
                  {p.method} · {p.at}
                </T>
              </View>
              <T v="bodyStrong">{pkr(p.amount)}</T>
            </View>
          ))
        )}
        <T v="caption" color={me.dues > 0 ? colors.danger : colors.inkSoft}>
          Outstanding: {pkr(me.dues)}
        </T>
      </Card>

      <AttentionRow icon="message-square" title="Messages" sub={`Reminders from ${gym.name}`} onPress={() => router.push('/member/inbox')} />
      <AttentionRow icon="bell" title="Notifications" sub="In-app + WhatsApp" />
      <AttentionRow icon="globe" title="Language" sub="English + Urdu" />
      <AttentionRow
        icon="repeat"
        title="Switch to gym side"
        sub="Prototype only"
        onPress={() => {
          setRole('gym');
          router.replace('/gym');
        }}
      />
      <AttentionRow
        icon="log-out"
        tone="warn"
        title="Log out"
        onPress={() => {
          setRole(null);
          router.replace('/welcome');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
