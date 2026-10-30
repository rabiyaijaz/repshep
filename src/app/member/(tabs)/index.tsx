import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { MembershipCard } from '@/components/MembershipCard';
import { AttentionRow, Button, Card, IconBubble, Screen, SectionTitle, T, TopBar, useToast } from '@/components/ui';
import { ME, pkr, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

// Member home. Not in Figma yet — built from the gym home + member card patterns.
export default function MemberHome() {
  const { member, gym, pokes, orders, sessions, joinState, setRole, requestRenewal, toggleBooking } = useStore();
  const { show, node } = useToast();
  const me = member(ME)!;
  const unread = pokes.filter((p) => p.memberId === ME && p.status === 'delivered' && !p.read);
  const ready = orders.filter((o) => o.memberId === ME && o.status === 'ready');
  const first = me.name.split(' ')[0];
  const frozen = me.status === 'frozen';
  const needsRenewal = me.status === 'expiring' || me.status === 'expired';
  const myNext = sessions.find((s) => s.attendees.includes(ME));
  const suggestion = myNext ?? sessions[0];

  if (joinState !== 'approved') {
    const pending = joinState === 'pending';
    return (
      <Screen>
        <TopBar />
        <Card tone="primary" style={styles.hero}>
          <IconBubble icon={pending ? 'clock' : 'x-circle'} tone={pending ? 'accent' : 'warn'} />
          <T v="h2" color={colors.white}>
            {pending ? `Request sent to ${gym.name} Gym` : 'Your join request was declined'}
          </T>
          <T v="body" color={colors.accent}>
            {pending
              ? 'You’ll get access to check-ins, your card and rewards as soon as the gym accepts.'
              : 'Check the invitation code with your gym, or try another gym.'}
          </T>
        </Card>
        {pending ? (
          <>
            <Card style={{ borderRadius: radius.md, gap: space.xs }}>
              <T v="bodyM">While you wait</T>
              <T v="body" color={colors.inkSoft}>
                Look at timings, packages and facilities on the My gym tab.
              </T>
              <Button label="See gym details" kind="white" small onPress={() => router.navigate('/member/gym')} />
            </Card>
            <Card tone="white" style={{ borderRadius: radius.md, gap: space.xs, borderWidth: 1, borderColor: colors.line }}>
              <T v="caption" color={colors.muted}>
                PROTOTYPE
              </T>
              <T v="body">Switch to the gym side to accept or decline this request.</T>
              <Button
                label="Open gym requests"
                small
                onPress={() => {
                  setRole('gym');
                  router.replace('/gym/requests');
                }}
              />
            </Card>
          </>
        ) : (
          <Button label="Enter another code" onPress={() => router.replace('/welcome')} />
        )}
      </Screen>
    );
  }

  return (
    <>
      <Screen>
        <TopBar />
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
                {gym.timings[gym.timings.length - 1] ?? 'See timings'}
              </T>
            </View>
          </View>
          <Button label="See gym" kind="accent" small onPress={() => router.navigate('/member/gym')} />
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
          <Pressable style={{ flex: 1 }} onPress={() => router.push('/member/rewards')} accessibilityRole="button" accessibilityLabel={`${me.points} points, open rewards`}>
            <Card style={[styles.stat, { flex: 0 }]}>
              <T v="h2" color={colors.primary}>
                {me.points}
              </T>
              <T v="caption" color={colors.inkSoft}>
                Points →
              </T>
            </Card>
          </Pressable>
        </View>

        <Button
          label={frozen ? 'Membership paused' : me.daysAway === 0 ? 'Checked in today' : 'Check in'}
          icon="maximize"
          disabled={me.daysAway === 0 || frozen}
          onPress={() => router.navigate('/member/checkin')}
          style={{ height: 56 }}
        />

        {(unread.length > 0 || ready.length > 0 || me.dues > 0 || frozen) && <SectionTitle arrow>For you</SectionTitle>}
        {frozen && <AttentionRow icon="pause-circle" tone="warn" title="Your membership is paused" sub="Ask the front desk to unfreeze it when you’re back" />}
        {unread.map((p) => (
          <AttentionRow key={p.id} icon="message-square" title={`Message from ${gym.name}`} sub={p.message} onPress={() => router.push('/member/inbox')} />
        ))}
        {ready.map((o) => (
          <AttentionRow key={o.id} icon="shopping-cart" title="Your order is ready" sub={`${o.item} · pick up at the front desk`} onPress={() => router.navigate('/member/shop')} />
        ))}
        {me.dues > 0 && <AttentionRow icon="credit-card" title={`${pkr(me.dues)} due`} sub="Pay at the front desk · see Profile for history" onPress={() => router.navigate('/member/profile')} />}

        <SectionTitle>Membership</SectionTitle>
        <MembershipCard
          m={me}
          gymName={`${gym.name} Gym`}
          note={me.renewalRequested ? 'Renewal requested — the gym will confirm' : undefined}
          action={needsRenewal && !me.renewalRequested ? 'Request renewal' : undefined}
          onAction={() => {
            requestRenewal(ME);
            show('Renewal request sent to the gym');
          }}
        />

        <SectionTitle arrow>{myNext ? 'Your next session' : 'Upcoming'}</SectionTitle>
        {suggestion ? (
          <Card style={{ gap: space.sm, borderRadius: radius.md }}>
            <View style={styles.row}>
              <IconBubble icon="calendar" />
              <View style={{ flex: 1 }}>
                <T v="h3">{suggestion.title}</T>
                <T v="caption" color={colors.inkSoft}>
                  {suggestion.day} · {suggestion.time} · {suggestion.trainer}
                </T>
              </View>
            </View>
            <View style={styles.row}>
              <Button
                label={myNext ? 'Cancel booking' : suggestion.attendees.length >= suggestion.capacity ? 'Full' : 'Book'}
                kind={myNext ? 'white' : 'primary'}
                small
                disabled={!myNext && suggestion.attendees.length >= suggestion.capacity}
                style={{ flex: 1 }}
                onPress={() => {
                  toggleBooking(suggestion.id, ME);
                  show(myNext ? 'Booking cancelled' : `Booked · ${suggestion.day} ${suggestion.time}`);
                }}
              />
              <Button label="All classes" kind="surface" small style={{ flex: 1 }} onPress={() => router.push('/member/classes')} />
            </View>
          </Card>
        ) : (
          <T v="body" color={colors.inkSoft}>
            No sessions scheduled yet.
          </T>
        )}
      </Screen>
      {node}
    </>
  );
}

const styles = StyleSheet.create({
  hero: { padding: space.xl, gap: space.sm, borderRadius: radius.lg },
  gymCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.lg, borderRadius: radius.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  stats: { flexDirection: 'row', gap: space.xs },
  stat: { flex: 1, borderRadius: radius.md, gap: 2 },
});
