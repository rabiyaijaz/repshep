import { Feather } from '@expo/vector-icons';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius } from '@/theme';
import type { IconName } from './ui';

// Floating pill tab bar from the Figma screens: 5 slots, the middle one is the
// blue scan/check-in button. Routes not listed in `icons` are hidden.
export function makeTabBar(icons: Record<string, { icon: IconName; label: string; center?: boolean }>) {
  return function TabBar({ state, navigateToTab, insets }: BottomTabBarProps) {
    return (
      <View style={[styles.wrap, { bottom: Math.max(insets.bottom, 12) }]} pointerEvents="box-none">
        <View style={styles.bar}>
          {state.routes.map((route, i) => {
            const cfg = icons[route.name];
            if (!cfg) return null;
            const focused = state.index === i;
            return (
              <Pressable
                key={route.key}
                accessibilityRole="tab"
                accessibilityLabel={cfg.label}
                accessibilityState={{ selected: focused }}
                onPress={() => navigateToTab(route.key)}
                style={[styles.item, cfg.center ? styles.center : focused && styles.focused]}
              >
                <Feather name={cfg.icon} size={20} color={cfg.center ? colors.white : focused ? colors.primary : colors.ink} />
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  item: { width: 52, height: 36, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  focused: { backgroundColor: colors.line },
  center: { width: 56, backgroundColor: colors.primary },
});
