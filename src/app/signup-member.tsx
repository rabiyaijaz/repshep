import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { AuthShell } from '@/components/AuthShell';
import { Button, Card, Checkbox, Field, SelectField, T } from '@/components/ui';
import { pkr, useStore } from '@/store';
import { colors, space } from '@/theme';

// Member sign-up. Not drawn in Figma yet — built from the gym sign-up pattern.
export default function SignUpMember() {
  const params = useLocalSearchParams<{ code?: string }>();
  const { gym, requestJoin, setRole } = useStore();
  const plans = gym.packages.filter((p) => p.name !== 'Registration');
  const [d, setD] = useState({ name: 'Rabiya Ijaz', phone: '+92 3005980047', email: '', password: 'password', code: params.code ?? '' });
  const [plan, setPlan] = useState(plans[0]?.name ?? '');
  const [terms, setTerms] = useState(true);
  const set = (k: keyof typeof d) => (v: string) => setD((x) => ({ ...x, [k]: v }));
  const gymFound = d.code.trim().toUpperCase() === gym.code;

  const submit = () => {
    requestJoin(d.name, d.phone, plan);
    setRole('member');
    router.replace('/member');
  };

  return (
    <AuthShell mode="signup" signUpHref="/signup-member">
      <T v="h1" style={{ fontSize: 32, lineHeight: 38 }}>
        Sign Up
      </T>
      <T v="body" color={colors.inkSoft} style={{ marginBottom: space.xs }}>
        Join your gym on RepShep
      </T>
      <Field label="Full Name" value={d.name} onChangeText={set('name')} />
      <Field label="Whatsapp Number" value={d.phone} onChangeText={set('phone')} icon="phone" keyboardType="phone-pad" />
      <Field label="Email (optional)" value={d.email} onChangeText={set('email')} icon="mail" placeholder="you@example.com" keyboardType="email-address" />
      <Field label="Password" value={d.password} onChangeText={set('password')} secure />
      <Field label="Gym invitation code" value={d.code} onChangeText={set('code')} icon="link" placeholder={gym.code} />

      {gymFound && (
        <Card tone="white" style={{ gap: space.xs, borderRadius: 12 }}>
          <T v="bodyM">{gym.name} Gym</T>
          <T v="caption" color={colors.inkSoft}>
            {gym.location}
          </T>
          <SelectField
            label="Choose a plan"
            value={plan}
            options={plans.map((p) => p.name)}
            onChange={setPlan}
          />
          <T v="caption" color={colors.inkSoft}>
            {pkr(plans.find((p) => p.name === plan)?.price ?? 0)} / month · Registration {pkr(gym.packages.find((p) => p.name === 'Registration')?.price ?? 0)}
          </T>
        </Card>
      )}

      <View style={{ marginVertical: space.xs }}>
        <Checkbox checked={terms} onChange={setTerms} label="I accept the Terms & Conditions." />
      </View>
      <Button label={gymFound ? 'Send join request' : 'Enter your gym code'} kind="accent" trailing="arrow-right" disabled={!terms || !gymFound || !d.name} onPress={submit} />
    </AuthShell>
  );
}
