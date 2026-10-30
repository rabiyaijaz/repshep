import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, space } from '@/theme';
import { T, type IconName } from './ui';

// Shared frame for Login / Sign Up: grey card with the Log In · Sign Up switch,
// then the blue "Continue with" social panel (Figma 107:6444, 107:8443).
export function AuthShell({
  mode,
  children,
  footer = true,
  signUpHref = '/signup-gym',
}: {
  mode: 'login' | 'signup';
  children: ReactNode;
  footer?: boolean;
  signUpHref?: '/signup-gym' | '/signup-member';
}) {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={{ padding: space.sm, gap: space.sm }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.switch}>
            {(['login', 'signup'] as const).map((m) => (
              <Pressable
                key={m}
                accessibilityRole="tab"
                accessibilityState={{ selected: mode === m }}
                onPress={() => mode !== m && router.replace(m === 'login' ? '/login' : signUpHref)}
                style={[styles.switchItem, mode === m && styles.switchOn]}
              >
                <T v="bodyStrong" color={mode === m ? colors.white : colors.ink}>
                  {m === 'login' ? 'Log In' : 'Sign Up'}
                </T>
              </Pressable>
            ))}
          </View>
          {children}
        </View>

        {footer && (
          <View style={styles.social}>
            {mode === 'login' ? (
              <T v="h3" color={colors.white}>
                Continue with:
              </T>
            ) : (
              <View style={styles.socialHead}>
                <T v="body" color={colors.white}>
                  Already have an account?
                </T>
                <Pressable onPress={() => router.replace('/login')}>
                  <T v="bodyStrong" color={colors.white}>
                    Log In
                  </T>
                </Pressable>
              </View>
            )}
            <View style={styles.socialRow}>
              {(['chrome', 'facebook', 'x'] as IconName[]).map((i) => (
                <Pressable key={i} style={styles.socialBtn} accessibilityLabel={`Continue with ${i === 'chrome' ? 'Google' : i === 'x' ? 'X' : 'Facebook'}`}>
                  <Feather name={i} size={18} color={colors.ink} />
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Steps({ step }: { step: 1 | 2 | 3 }) {
  return (
    <View style={styles.steps}>
      {[1, 2, 3].map((s) => (
        <View key={s} style={{ flex: 1, gap: 6, alignItems: 'center' }}>
          <View style={[styles.stepBar, { backgroundColor: s === step ? colors.primary : s < step ? colors.accent : colors.line }]} />
          <T v="micro" color={s === step ? colors.primary : colors.inkSoft}>
            Step {s}
          </T>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.md, gap: space.sm },
  switch: { flexDirection: 'row', backgroundColor: colors.bg, borderRadius: radius.pill, padding: 6, marginBottom: space.md },
  switchItem: { flex: 1, height: 34, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  switchOn: { backgroundColor: colors.teal },
  social: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: space.lg, gap: space.md },
  socialHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  socialRow: { flexDirection: 'row', gap: space.xs },
  socialBtn: { flex: 1, height: 52, borderRadius: radius.pill, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  steps: { flexDirection: 'row', gap: 6, marginBottom: space.xs },
  stepBar: { height: 6, alignSelf: 'stretch', borderRadius: 3 },
});
