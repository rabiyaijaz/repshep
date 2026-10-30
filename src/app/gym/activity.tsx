import { View } from 'react-native';
import { Card, Empty, IconBubble, Screen, T, TopBar } from '@/components/ui';
import { useStore } from '@/store';
import { colors, radius, space } from '@/theme';

// Team activity — Figma [Walkthrough] 21 (107:6803).
export default function Activity() {
  const { activity } = useStore();
  return (
    <Screen>
      <TopBar back />
      <T v="h2">Team activity</T>
      <T v="body" color={colors.inkSoft}>
        Changes, messaged and follow-ups
      </T>
      {activity.length === 0 && <Empty icon="activity" title="Nothing yet today" />}
      {activity.map((a) => (
        <Card key={a.id} style={{ borderRadius: radius.md, flexDirection: 'row', gap: space.sm }}>
          <IconBubble icon="activity" />
          <View style={{ flex: 1, gap: 4 }}>
            <T v="bodyM">{a.title}</T>
            {a.detail ? (
              <T v="body" color={colors.inkSoft} numberOfLines={2}>
                {a.detail}
              </T>
            ) : null}
            <T v="caption" color={colors.muted}>
              {a.at} · {a.who}
            </T>
          </View>
        </Card>
      ))}
    </Screen>
  );
}
