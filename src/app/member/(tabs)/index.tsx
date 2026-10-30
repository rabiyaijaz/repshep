import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { MembershipCard } from '@/components/MembershipCard';
import { AttentionRow, Button, Card, IconBubble, Screen, SectionTitle, T, TopBar } from '@/components/ui';
import { ME, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

// Member home. Not in Figma yet — built from the gym home + member card patterns.
export default function MemberHome() {
  const { member, gym, pokes, orders, joinState, setRole, renew } = useStore();
  const me = member(ME)!;
  const unread = pokes.filter((p) => p.memberId === ME && p.status === 'delivered' && !p.read);
  const ready = orders.filter((o) => o.memberId === ME && o.status === 'ready');
  const first = me.name.split(' ')[0];

  if (joinState === 'pending') {
    return (
      <Screen>
        <TopBar />
        <Card tone="primary" style={styles.hero}>
          <IconBubble icon="clock" />
          <T v="h2" color={colors.white}>
            Request sent to {gym.name} Gym
          </T>
          <T v="body" color={colors.accent}>
            You’ll get access to check-ins, your card and rewards as soon as the gym accepts.
          </T>
        </Card>
        <Card style={{ borderRadius: radius.md, gap: space.xs }}>
          <T v="bodyM">While you wait</T>
          <T v="body" color={colors.inkSoft}>
            Look at timings, packages and facilities on the My gym tab.
          </T>
          <Button label="See gym details" kind="white" small onPress={() => router.push('/member/gym')} />
        </Card>
        <Card tone="white" style={{ borderRadius: radius.md, gap: space.xs, borderWidth: 1, borderColor: colors.line }}>
          <T v="caption" color={colors.muted}>
            PROTOTYPE
          </T>
          <T v="body">Switch to the gym side to accept this request.</T>
          <Button
            label="Open gym requests"
            small
            onPress={() => {
              setRole('gym');
              router.replace('/gym/requests');
            }}
          />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar bellDot={unread.length > 0} onBell={() => router.push('/member/inbox')} />
      <View>
        <T v="body" color={colors.inkSoft}>
          Assalam o Alaikum,
        </T>
        <T v="h1">{first}</T>
      </View>

      <Card tone="dark" style={styles.gymCard}>
        <View style={styles.row}>
          <IconBubble icon="map-pin" />
          <View>
            <T v="h3" color={colors.white}>
              {gym.name}
            </T>
            <T v="caption" color={colors.accent}>
              Open now · {gym.timings[2]?.split('·')[1]?.trim()}
            </T>
          </View>
        </View>
        <Button label="See gym" kind="accent" small onPress={() => router.push('/member/gym')} />
      </Card>

      <View style={styles.stats}>
        <Card style={styles.stat}>
          <T v="h2">{me.daysAway === 0 ? 'Today' : `${me.daysAway}d`}</T>
          <T v="caption" color={colors.inkSoft}>
            Last visit
          </T>
        </Card>
        <Card style={styles.stat}>
          <T v="h2">{me.visitsThisMonth}</T>
          <T v="caption" color={colors.inkSoft}>
            Visits this month
          </T>
        </Card>
        <Card style={styles.stat}>
          <T v="h2" color={colors.primary}>
            {me.points}
          </T>
          <T v="caption" color={colors.inkSoft}>
            Points
          </T>
        </Card>
      </View>

      <Button
        label={me.daysAway === 0 ? 'Checked in today' : 'Check in'}
        icon="maximize"
        disabled={me.daysAway === 0}
        onPress={() => router.push('/member/checkin')}
        style={{ height: 56 }}
      />

      {(unread.length > 0 || ready.length > 0 || me.status === 'expiring' || me.dues > 0) && <SectionTitle arrow>For you</SectionTitle>}
      {unread.map((p) => (
        <AttentionRow key={p.id} icon="message-square" title={`Message from ${gym.name}`} sub={p.message} onPress={() => router.push('/member/inbox')} />
      ))}
      {ready.map((o) => (
        <AttentionRow key={o.id} icon="shopping-cart" title="Your order is ready" sub={`${o.item} · pick up at the front desk`} onPress={() => router.push('/member/shop')} />
      ))}
      {me.dues > 0 && <AttentionRow icon="credit-card" title={`PKR ${me.dues.toLocaleString()} due`} sub="Pay at the front desk" />}

      <SectionTitle>Membership</SectionTitle>
      <MembershipCard
        m={me}
        gymName={`${gym.name} Gym`}
        action={me.status === 'expiring' || me.status === 'expired' ? 'Renew' : undefined}
        onAction={() => renew(ME)}
      />

      <SectionTitle arrow>Upcoming</SectionTitle>
      <Card style={{ gap: space.sm, borderRadius: radius.md }}>
        <View style={styles.row}>
          <IconBubble icon="calendar" />
          <T v="h3">Personal Training</T>
        </View>
        <View style={styles.between}>
          <T v="caption" color={colors.inkSoft}>
            Trainer: Hamza Khan
          </T>
          <T v="caption" color={colors.inkSoft}>
            Today · 7pm–10pm
          </T>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { padding: space.xl, gap: space.sm, borderRadius: radius.lg },
  gymCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.lg, borderRadius: radius.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stats: { flexDirection: 'row', gap: space.xs },
  stat: { flex: 1, borderRadius: radius.md, gap: 2 },
});
