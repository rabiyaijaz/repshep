import { StyleSheet, View } from 'react-native';
import { useGymSheets } from '@/components/GymSheets';
import { Avatar, Button, Card, Empty, Screen, T, TopBar } from '@/components/ui';
import { useStore } from '@/store';
import { colors, radius, space } from '@/theme';

// Join requests from members who used the gym code/link.
export default function Requests() {
  const { requests, acceptRequest, declineRequest } = useStore();
  const { toast } = useGymSheets();
  return (
    <Screen>
      <TopBar back />
      <T v="h2">Member requests</T>
      <T v="body" color={colors.inkSoft}>
        People who joined with your invitation code
      </T>
      {requests.length === 0 && <Empty icon="inbox" title="No pending requests" sub="New join requests show up here." />}
      {requests.map((r) => (
        <Card key={r.id} style={{ borderRadius: radius.md, gap: space.sm }}>
          <View style={styles.row}>
            <Avatar name={r.name} size={40} />
            <View style={{ flex: 1 }}>
              <T v="h3">{r.name}</T>
              <T v="caption" color={colors.inkSoft}>
                {r.phone} · {r.plan}
              </T>
            </View>
          </View>
          <View style={styles.row}>
            <Button label="Decline" kind="white" small style={{ flex: 1 }} onPress={() => declineRequest(r.id)} />
            <Button
              label="Accept"
              small
              style={{ flex: 1 }}
              onPress={() => {
                acceptRequest(r.id);
                toast(`${r.name} is now a member`);
              }}
            />
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: space.sm } });
