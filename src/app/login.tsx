import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { AuthShell } from '@/components/AuthShell';
import { Button, Checkbox, Field, Sheet, T } from '@/components/ui';
import { useStore, type Role } from '@/store';
import { colors, space } from '@/theme';

export default function Login() {
  const { setRole } = useStore();
  const [as, setAs] = useState<Role>('gym');
  const [email, setEmail] = useState('hristov123@gmail.com');
  const [password, setPassword] = useState('password');
  const [remember, setRemember] = useState(true);
  const [forgot, setForgot] = useState(false);
  const [sent, setSent] = useState(false);

  const go = () => {
    setRole(as);
    router.replace(as === 'gym' ? '/gym' : '/member');
  };

  return (
    <AuthShell mode="login">
      <T v="body" color={colors.inkSoft}>
        Welcome back!
      </T>
      <T v="h1" style={{ fontSize: 32, lineHeight: 38, marginBottom: space.xs }}>
        Login
      </T>
      <Field label="Your Email" value={email} onChangeText={setEmail} icon="mail" keyboardType="email-address" />
      <Field label="Your Password" value={password} onChangeText={setPassword} secure />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: space.xs }}>
        <Checkbox checked={remember} onChange={setRemember} label="Remember me" />
        <Pressable hitSlop={8} onPress={() => setForgot(true)}>
          <T v="bodyStrong">Forgot Password?</T>
        </Pressable>
      </View>
      <Sheet visible={forgot} onClose={() => setForgot(false)} title="Reset your password">
        {sent ? (
          <>
            <T v="body">
              We sent a reset link to <T v="bodyStrong">{email}</T>. Open it on this phone to set a new password.
            </T>
            <Button label="Back to login" onPress={() => setForgot(false)} />
          </>
        ) : (
          <>
            <T v="body" color={colors.inkSoft}>
              Enter the email you signed up with.
            </T>
            <Field label="Your Email" value={email} onChangeText={setEmail} icon="mail" keyboardType="email-address" />
            <Button label="Send reset link" disabled={!email.includes('@')} onPress={() => setSent(true)} />
          </>
        )}
      </Sheet>
      <Button label="Let’s Rep" kind="accent" trailing="arrow-right" onPress={go} />
      <Pressable onPress={() => setAs(as === 'gym' ? 'member' : 'gym')} style={{ alignItems: 'center', paddingTop: space.xs }}>
        <T v="caption" color={colors.inkSoft}>
          Logging in as a {as === 'gym' ? 'gym' : 'gym member'} ·{' '}
          <T v="caption" color={colors.primary}>
            Switch to {as === 'gym' ? 'member' : 'gym'}
          </T>
        </T>
      </Pressable>
    </AuthShell>
  );
}
