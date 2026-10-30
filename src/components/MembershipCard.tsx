import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';
import { Button, Divider, T } from './ui';
import { pkr, type Member } from '@/store';
import { colors, radius, space } from '@/theme';

// Blue dotted membership card (Figma 107:10785). Used on the gym's member page
// and on the member's own home screen.
export function MembershipCard({
  m,
  gymName,
  action,
  onAction,
  onMore,
  note,
}: {
  m: Member;
  gymName?: string;
  action?: string;
  onAction?: () => void;
  onMore?: () => void;
  note?: string;
}) {
  return (
    <View style={styles.card}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <Pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <Circle cx="9" cy="9" r="1.4" fill="#ffffff" opacity="0.14" />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#dots)" />
      </Svg>
      <View style={styles.rowBetween}>
        <View>
          {gymName && (
            <T v="caption" color={colors.accent}>
              {gymName}
            </T>
          )}
          <T v="h2" color={colors.white}>
            {m.plan}
          </T>
        </View>
        {onMore && (
          <Pressable onPress={onMore} hitSlop={10} accessibilityLabel="Membership options">
            <Feather name="more-vertical" size={20} color={colors.white} />
          </Pressable>
        )}
      </View>
      <View style={[styles.rowBetween, { marginTop: space.md }]}>
        <T v="bodyL" color={colors.white}>
          Reward points
        </T>
        <T v="h3" style={{ fontSize: 18 }} color={colors.accent}>
          {m.points} points
        </T>
      </View>
      <View style={styles.rowBetween}>
        <T v="bodyL" color={colors.white}>
          Outstanding dues
        </T>
        <T v="bodyL" color={m.dues > 0 ? colors.warnSoft : colors.white}>
          {pkr(m.dues)}
        </T>
      </View>
      <Divider color={colors.white} style={{ marginVertical: space.sm, opacity: 0.7 }} />
      <View style={styles.rowBetween}>
        <T v="bodyM" color={colors.accent}>
          Membership Card
        </T>
        <T v="caption" color={colors.white}>
          Expiry: {m.expiry}
        </T>
      </View>
      {note ? (
        <T v="bodyStrong" color={colors.accent} style={{ marginTop: space.sm, textAlign: 'center' }}>
          {note}
        </T>
      ) : null}
      {action && <Button label={action} kind="accent" onPress={onAction} style={{ marginTop: space.md, height: 56 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: space.xl, overflow: 'hidden', gap: space.xs },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
