import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogoMark, Mascot, Wordmark } from '@/components/Logo';
import { Button, T } from '@/components/ui';
import { useStore } from '@/store';
import { colors, font, radius, space } from '@/theme';

// Figma "Gym vs Member" + "Link/code" screens.
export default function Welcome() {
  const { gym } = useStore();
  const [joinMode, setJoinMode] = useState(false);
  const [code, setCode] = useState('');
  const valid = code.trim().toUpperCase() === gym.code || code.includes('repshep-team');

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <LogoMark size={44} />
        <Wordmark size={32} mark={false} />
        <T v="bodyL">Your complete gym-stack.</T>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <T v="bodyL" color={colors.white} style={{ width: 110 }}>
            Repshep,{'\n'}Recover,{'\n'}Repeat!
          </T>
          <View style={styles.mascot}>
            <Mascot width={168} height={233} />
          </View>
        </View>

        <View style={styles.panel}>
          <T v="h2" style={{ textAlign: 'center' }}>
            Let’s get started
          </T>

          {joinMode ? (
            <>
              <View style={styles.codeField}>
                <View style={{ flex: 1 }}>
                  <T v="micro" color={colors.inkSoft}>
                    Gym invitation code/link
                  </T>
                  <TextInput
                    value={code}
                    onChangeText={setCode}
                    placeholder={gym.code}
                    placeholderTextColor={colors.muted}
                    autoCapitalize="characters"
                    accessibilityLabel="Gym invitation code or link"
                    style={styles.codeInput}
                  />
                </View>
                <Feather name="link" size={18} color={colors.ink} />
              </View>
              {code.length > 2 && !valid && (
                <T v="caption" color={colors.danger}>
                  We couldn’t find that gym. Try the code “{gym.code}”.
                </T>
              )}
              <Button
                label="Join with link/code"
                disabled={!valid}
                onPress={() => router.push({ pathname: '/signup-member', params: { code: gym.code } })}
              />
              <Button label="Go back" kind="dark" onPress={() => setJoinMode(false)} />
            </>
          ) : (
            <>
              <Button label="Sign up as gym" onPress={() => router.push('/signup-gym')} />
              <Button label="Sign up as gym member" kind="dark" onPress={() => router.push('/signup-member')} />
              <Pressable onPress={() => setJoinMode(true)} style={styles.linkRow}>
                <T v="body">
                  Have an invitation link?{' '}
                  <T v="body" style={{ textDecorationLine: 'underline' }}>
                    Join here.
                  </T>
                </T>
              </Pressable>
              <Pressable onPress={() => router.push('/login')} style={styles.linkRow}>
                <T v="body" color={colors.inkSoft}>
                  Already have an account?{' '}
                  <T v="bodyStrong" color={colors.primary}>
                    Log in
                  </T>
                </T>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: space.sm },
  header: { alignItems: 'center', gap: 6, paddingVertical: space.md },
  hero: { flex: 1, backgroundColor: colors.primary, borderRadius: radius.lg, overflow: 'hidden', marginBottom: space.sm },
  heroTop: { flex: 1, minHeight: 150, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: space.lg, paddingTop: space.lg, overflow: 'hidden' },
  mascot: { alignSelf: 'flex-start', marginTop: space.md },
  panel: { backgroundColor: colors.accent, borderRadius: radius.lg, padding: space.lg, gap: space.sm },
  codeField: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radius.sm, paddingHorizontal: space.sm, paddingVertical: 10, gap: space.sm },
  codeInput: { fontFamily: font.medium, fontSize: 16, color: colors.ink, padding: 0, marginTop: 2 },
  linkRow: { alignItems: 'center', paddingVertical: 2 },
});
