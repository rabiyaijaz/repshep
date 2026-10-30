import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Wordmark, LogoMark } from '@/components/Logo';
import { colors } from '@/theme';

// Splash: hero photo fading into the logo lockup (Figma "Splash screen").
export default function Splash() {
  useEffect(() => {
    const t = setTimeout(() => router.replace('/welcome'), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <Pressable style={styles.root} onPress={() => router.replace('/welcome')} accessibilityLabel="Continue">
      <Image source={require('../../assets/images/splash2.jpg')} style={styles.photo} resizeMode="cover" />
      <LinearGradient colors={['transparent', colors.bg]} style={styles.fade} />
      <View style={styles.brand}>
        <LogoMark size={44} />
        <Wordmark size={28} mark={false} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  photo: { width: '100%', height: '62%' },
  fade: { position: 'absolute', left: 0, right: 0, top: '38%', height: '25%' },
  brand: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: -40 },
});
