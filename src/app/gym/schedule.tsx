import { StyleSheet, View } from 'react-native';
import { useGymSheets } from '@/components/GymSheets';
import { Avatar, Button, Card, Empty, IconBubble, Screen, SectionTitle, T, TopBar } from '@/components/ui';
import { useStore } from '@/store';
import { colors, radius, space } from '@/theme';

// Classes and PT slots. Members book these from their Classes screen.
export default function Schedule() {
  const { sessions, member, removeSession } = useStore();
  const { open, toast } = useGymSheets();
  return (
    <Screen>
      <TopBar back />
      <SectionTitle action="Add session" onAction={() => open('session')}>
        Schedule
      </SectionTitle>
      <T v="body" color={colors.inkSoft}>
        Sessions members can book in the app
      </T>
      {sessions.length === 0 && <Empty icon="calendar" title="No sessions yet" sub="Add PT slots or classes for members to book." />}
      {sessions.map((s) => {
        const full = s.attendees.length >= s.capacity;
        return (
          <Card key={s.id} style={{ borderRadius: radius.md, gap: space.sm }}>
            <View style={styles.row}>
              <IconBubble icon="calendar" />
              <View style={{ flex: 1 }}>
                <T v="h3">{s.title}</T>
                <T v="caption" color={colors.inkSoft}>
                  {s.day} · {s.time} · Trainer: {s.trainer}
                </T>
              </View>
              <T v="bodyStrong" color={full ? colors.danger : colors.primary}>
                {s.attendees.length}/{s.capacity}
              </T>
            </View>
            {s.attendees.length > 0 ? (
              <View style={styles.people}>
                {s.attendees.map((id) => (
                  <View key={id} style={styles.person}>
                    <Avatar name={member(id)?.name ?? '?'} size={22} />
                    <T v="caption">{member(id)?.name}</T>
                  </View>
                ))}
              </View>
            ) : (
              <T v="caption" color={colors.inkSoft}>
                No bookings yet
              </T>
            )}
            <Button
              label="Cancel session"
              kind="white"
              small
              onPress={() => {
                removeSession(s.id);
                toast(`${s.title} cancelled`);
              }}
            />
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  people: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  person: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.white, borderRadius: radius.pill, paddingVertical: 4, paddingHorizontal: 8 },
});
