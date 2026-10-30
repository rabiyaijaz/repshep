import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useGymSheets } from '@/components/GymSheets';
import { ActionTile, AttentionRow, Button, Card, Divider, Empty, IconBubble, Screen, SectionTitle, T, TopBar } from '@/components/ui';
import { pkr, useNeedsPoke, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

// Gym home — Figma [Walkthrough] 20 (107:6532).
export default function GymHome() {
  const { gym, members, requests, orders, sessions } = useStore();
  const { open } = useGymSheets();
  const needsPoke = useNeedsPoke();
  const atRisk = needsPoke.filter((m) => m.daysAway >= gym.rules.atRiskDays).length;
  const withDues = members.filter((m) => m.dues > 0).length;
  const expiring = members.filter((m) => m.status === 'expiring' || m.status === 'expired').length;
  const renewals = members.filter((m) => m.renewalRequested);
  const openOrders = orders.filter((o) => o.status !== 'collected').length;
  const next = sessions[0];
  const allClear = !requests.length && !atRisk && !withDues && !openOrders && !expiring && !renewals.length;

  return (
    <Screen>
      <TopBar />

      <Card tone="dark" style={styles.gymCard}>
        <View style={styles.row}>
          <IconBubble icon="dollar-sign" />
          <T v="h2" color={colors.white}>
            {gym.name}
          </T>
        </View>
        <Button label="See Details" kind="accent" small onPress={() => open('gym')} />
      </Card>

      <Pressable onPress={() => router.push('/gym/earnings')} accessibilityRole="button" accessibilityLabel="Monthly earnings">
        <Card tone="primary" style={styles.earnings}>
          <View style={styles.rowBetween}>
            <T v="h3" color={colors.accent}>
              Monthly earnings →
            </T>
            <T v="caption" color={colors.white}>
              September
            </T>
          </View>
          <T v="display" color={colors.white} style={{ marginTop: space.md }}>
            {pkr(gym.monthEarnings)}
          </T>
          <T v="body" color={colors.accent}>
            {pkr(gym.todayEarnings)} recorded today
          </T>
          <Divider color={colors.white} style={{ marginVertical: space.md, opacity: 0.8 }} />
          <View style={[styles.row, { gap: space.xl }]}>
            <View>
              <T v="h3" color={colors.accent}>
                {gym.checkInsToday}
              </T>
              <T v="body" color={colors.white}>
                Check-ins today
              </T>
            </View>
            <View>
              <T v="h3" color={colors.accent}>
                {members.length}
              </T>
              <T v="body" color={colors.white}>
                Total members
              </T>
            </View>
          </View>
        </Card>
      </Pressable>

      <View style={styles.actions}>
        <ActionTile icon="plus" label="Add Member" onPress={() => open('addMember')} />
        <ActionTile icon="credit-card" label="Add payment" onPress={() => open('payment')} />
        <ActionTile icon="message-square" label="Poke Member" onPress={() => router.push('/gym/poke')} />
      </View>

      <SectionTitle arrow>Needs attention</SectionTitle>
      {allClear && <Empty icon="check-circle" title="All caught up" sub="Nothing needs you right now." />}
      {requests.length > 0 && (
        <AttentionRow icon="bell" title={`${requests.length} member request${requests.length > 1 ? 's' : ''}`} sub="See joining requests from members" onPress={() => router.push('/gym/requests')} />
      )}
      {renewals.length > 0 && (
        <AttentionRow
          icon="refresh-cw"
          title={`${renewals.length} renewal request${renewals.length > 1 ? 's' : ''}`}
          sub={`${renewals.map((m) => m.name.split(' ')[0]).join(', ')} asked to renew in the app`}
          onPress={() => router.push({ pathname: '/gym/member/[id]', params: { id: renewals[0].id } })}
        />
      )}
      {atRisk > 0 && (
        <AttentionRow icon="message-square" title={`${atRisk} member${atRisk > 1 ? 's' : ''} to reconnect`} sub={`Away ${gym.rules.atRiskDays}+ days. Make the first move`} onPress={() => router.push('/gym/poke')} />
      )}
      {withDues > 0 && (
        <AttentionRow icon="credit-card" title={`${withDues} outstanding balance${withDues > 1 ? 's' : ''}`} sub="Follow up gently" onPress={() => router.navigate({ pathname: '/gym/members', params: { filter: 'dues' } })} />
      )}
      {openOrders > 0 && (
        <AttentionRow icon="shopping-cart" title={`${openOrders} open shop order${openOrders > 1 ? 's' : ''}`} sub="Let them know it’s waiting" onPress={() => router.navigate('/gym/shop')} />
      )}
      {expiring > 0 && (
        <AttentionRow
          icon="clock"
          tone="warn"
          title={`${expiring} membership${expiring > 1 ? 's' : ''} expiring`}
          sub="A brief reminder goes a long way"
          onPress={() => router.navigate({ pathname: '/gym/members', params: { filter: 'expiring' } })}
        />
      )}

      <SectionTitle arrow>Upcoming</SectionTitle>
      {next ? (
        <Pressable onPress={() => router.push('/gym/schedule')} accessibilityRole="button">
          <Card style={{ gap: space.sm, borderRadius: radius.md }}>
            <View style={styles.rowBetween}>
              <View style={styles.row}>
                <IconBubble icon="calendar" />
                <T v="h3">{next.title}</T>
              </View>
              <Feather name="chevron-right" size={20} color={colors.ink} />
            </View>
            <View style={styles.rowBetween}>
              <T v="caption" color={colors.inkSoft}>
                Trainer: {next.trainer}
              </T>
              <T v="caption" color={colors.inkSoft}>
                {next.day} · {next.time}
              </T>
            </View>
            <T v="caption" color={colors.inkSoft}>
              {next.attendees.length}/{next.capacity} booked
            </T>
          </Card>
        </Pressable>
      ) : (
        <AttentionRow icon="plus" title="Add a session" sub="PT, classes or open gym slots" onPress={() => open('session')} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  gymCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.lg, borderRadius: radius.lg },
  earnings: { padding: space.xl, borderRadius: radius.lg },
  actions: { flexDirection: 'row', gap: space.xs },
});
