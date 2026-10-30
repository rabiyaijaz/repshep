import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaFrameContext, SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { useStore } from '@/store';
import { colors, font, radius, space } from '@/theme';
import { LogoMark } from './Logo';
import { OverlayHostContext } from './overlayHost';
import { T, type IconName } from './ui';

// iPhone 15/16 Pro logical size — same as the Figma frames (393 × 852).
const W = 393;
const H = 852;
const BEZEL = 12;
const INSETS = { top: 54, bottom: 34, left: 0, right: 0 };
const FRAME = { x: 0, y: 0, width: W, height: H };

// On a desktop browser, show the app inside a phone with a side panel for demoing.
// On phones and native builds it renders the app untouched.
export function DeviceFrame({ children }: { children: ReactNode }) {
  const { width, height } = useWindowDimensions();
  const [host, setHost] = useState<HTMLElement | null>(null);
  if (Platform.OS !== 'web' || width < 600) return <>{children}</>;

  const outerW = W + BEZEL * 2;
  const outerH = H + BEZEL * 2;
  const scale = Math.min(1, (height - 48) / outerH);
  const showPanel = width >= 900;

  return (
    <View style={styles.page}>
      <View style={[styles.stage, { gap: showPanel ? 56 : 0 }]}>
        <View style={{ width: outerW * scale, height: outerH * scale }}>
          <View
            style={[
              styles.phone,
              { width: outerW, height: outerH, left: (-outerW * (1 - scale)) / 2, top: (-outerH * (1 - scale)) / 2, transform: [{ scale }] },
            ]}
          >
            <View style={styles.button} />
            <View style={[styles.button, { top: 180, height: 60 }]} />
            <View style={[styles.button, { top: 250, height: 60 }]} />
            <View style={[styles.button, styles.power]} />
            <View ref={(r) => setHost(r as unknown as HTMLElement | null)} style={styles.screen}>
              <OverlayHostContext.Provider value={host}>
                <SafeAreaFrameContext.Provider value={FRAME}>
                  <SafeAreaInsetsContext.Provider value={INSETS}>{children}</SafeAreaInsetsContext.Provider>
                </SafeAreaFrameContext.Provider>
              </OverlayHostContext.Provider>
              <StatusBarMock />
              <View style={styles.homeBar} pointerEvents="none" />
            </View>
          </View>
        </View>
        {showPanel && <DemoPanel />}
      </View>
    </View>
  );
}

function StatusBarMock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  const time = `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')}`;
  return (
    <View style={styles.status} pointerEvents="none">
      <T v="bodyM" style={{ fontFamily: font.semibold, width: 80, textAlign: 'center' }}>
        {time}
      </T>
      <View style={styles.island} />
      <View style={styles.statusRight}>
        <View style={styles.signal}>
          {[4, 6, 8, 10].map((h) => (
            <View key={h} style={[styles.signalBar, { height: h }]} />
          ))}
        </View>
        <Feather name="wifi" size={14} color={colors.ink} />
        <View style={styles.battery}>
          <View style={styles.batteryFill} />
        </View>
      </View>
    </View>
  );
}

// Demo controls beside the phone: jump straight to either side or restart.
function DemoPanel() {
  const { setRole, setJoinState } = useStore();
  const go = (label: string, icon: IconName, sub: string, run: () => void) => (
    <Pressable key={label} onPress={run} style={({ hovered }: { hovered?: boolean }) => [styles.panelBtn, hovered && { backgroundColor: colors.surface }]}>
      <View style={styles.panelIcon}>
        <Feather name={icon} size={16} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <T v="bodyM">{label}</T>
        <T v="caption" color={colors.inkSoft}>
          {sub}
        </T>
      </View>
      <Feather name="chevron-right" size={18} color={colors.muted} />
    </Pressable>
  );

  return (
    <View style={styles.panel}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
        <LogoMark size={40} />
        <View>
          <T v="h3">
            <T v="h3" color={colors.primary}>
              REP
            </T>
            SHEP
          </T>
          <T v="caption" color={colors.inkSoft}>
            Interactive prototype
          </T>
        </View>
      </View>
      <T v="body" color={colors.inkSoft}>
        Gym and member sides share one set of data, so a poke, payment, booking or order on one side shows up on the other.
      </T>
      <View style={{ gap: space.xs }}>
        {go('Gym side', 'home', 'Savyora Gym dashboard', () => {
          setRole('gym');
          router.replace('/gym');
        })}
        {go('Member side', 'user', 'Rabiya’s app', () => {
          setJoinState('approved');
          setRole('member');
          router.replace('/member');
        })}
        {go('Start from splash', 'play', 'Onboarding, login and sign-up', () => router.replace('/'))}
        {go('Reset demo data', 'rotate-ccw', 'Reloads the page', () => window.location.reload())}
      </View>
      <T v="caption" color={colors.muted}>
        Tip: Esc closes sheets. Data lives in memory and resets on reload.
      </T>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, minHeight: '100%' as unknown as number, backgroundColor: '#E9E8F7', alignItems: 'center', justifyContent: 'center', padding: 24 },
  stage: { flexDirection: 'row', alignItems: 'center' },
  phone: { position: 'absolute', backgroundColor: '#141414', borderRadius: 64, padding: BEZEL, shadowColor: '#1d1d6b', shadowOpacity: 0.35, shadowRadius: 50, shadowOffset: { width: 0, height: 30 } },
  button: { position: 'absolute', left: -3, top: 120, width: 4, height: 32, borderRadius: 2, backgroundColor: '#2a2a2a' },
  power: { left: undefined, right: -3, top: 200, height: 90 },
  screen: { flex: 1, borderRadius: 52, overflow: 'hidden', backgroundColor: colors.bg },
  status: { position: 'absolute', top: 0, left: 0, right: 0, height: INSETS.top, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, zIndex: 40 },
  island: { width: 124, height: 36, borderRadius: 20, backgroundColor: '#000', marginTop: -2 },
  statusRight: { width: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  signal: { flexDirection: 'row', alignItems: 'flex-end', gap: 1.5 },
  signalBar: { width: 3, borderRadius: 1, backgroundColor: colors.ink },
  battery: { width: 24, height: 12, borderRadius: 3.5, borderWidth: 1.2, borderColor: colors.ink, padding: 1.5 },
  batteryFill: { flex: 1, borderRadius: 1.5, backgroundColor: colors.ink, width: '80%' as unknown as number },
  homeBar: { position: 'absolute', bottom: 8, alignSelf: 'center', width: 134, height: 5, borderRadius: 3, backgroundColor: colors.ink, zIndex: 40 },
  panel: { width: 300, gap: space.md, backgroundColor: colors.white, borderRadius: radius.lg, padding: space.lg, shadowColor: '#1d1d6b', shadowOpacity: 0.08, shadowRadius: 30, shadowOffset: { width: 0, height: 10 } },
  panelBtn: { flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.sm, borderRadius: radius.sm, backgroundColor: colors.bg },
  panelIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
});
