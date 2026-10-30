import { StyleSheet, View } from 'react-native';
import { Button, Card, Empty, IconBubble, Screen, T, TopBar, useToast } from '@/components/ui';
import { ME, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

// Book PT slots and classes the gym scheduled.
export default function Classes() {
  const { sessions, toggleBooking, member } = useStore();
  const { show, node } = useToast();
  const frozen = member(ME)?.status === 'frozen';

  return (
    <>
      <Screen>
        <TopBar back />
        <T v="h2">Classes</T>
        <T v="body" color={colors.inkSoft}>
          Book a spot — the gym sees who’s coming
        </T>
        {sessions.length === 0 && <Empty icon="calendar" title="Nothing scheduled" sub="Your gym hasn’t added sessions yet." />}
        {sessions.map((s) => {
          const mine = s.attendees.includes(ME);
          const left = s.capacity - s.attendees.length;
          return (
            <Card key={s.id} style={{ borderRadius: radius.md, gap: space.sm }}>
              <View style={styles.row}>
                <IconBubble icon="calendar" tone={mine ? 'primary' : 'accent'} />
                <View style={{ flex: 1 }}>
                  <T v="h3">{s.title}</T>
                  <T v="caption" color={colors.inkSoft}>
                    {s.day} · {s.time} · {s.trainer}
                  </T>
                </View>
                <T v="caption" color={left > 0 ? colors.inkSoft : colors.danger}>
                  {left > 0 ? `${left} spot${left > 1 ? 's' : ''} left` : 'Full'}
                </T>
              </View>
              <Button
                label={mine ? 'Booked · tap to cancel' : left > 0 ? 'Book' : 'Full'}
                kind={mine ? 'accent' : 'primary'}
                small
                disabled={frozen || (!mine && left <= 0)}
                onPress={() => {
                  toggleBooking(s.id, ME);
                  show(mine ? 'Booking cancelled' : `Booked ${s.title}`);
                }}
              />
            </Card>
          );
        })}
        {frozen && (
          <T v="caption" color={colors.danger}>
            Booking is off while your membership is paused.
          </T>
        )}
      </Screen>
      {node}
    </>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: space.sm } });
