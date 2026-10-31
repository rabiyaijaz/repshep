import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Wordmark, LogoMark } from '@/components/Logo';
import { colors } from '@/theme';

// Splash: hero photo fading into the logo lockup (Figma "Splash screen").
// The photo is cropped from the Figma frame and already fades into the background colour.
export default function Splash() {
  useEffect(() => {
    const t = setTimeout(() => router.replace('/welcome'), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <Pressable style={styles.root} onPress={() => router.replace('/welcome')} accessibilityLabel="Continue">
      <Image source={require('../../assets/images/splash-photo.jpg')} style={styles.photo} resizeMode="cover" />
      <View style={styles.brand}>
        <LogoMark size={44} />
        <Wordmark size={28} mark={false} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  photo: { width: '100%', height: '56%' },
  brand: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
});
