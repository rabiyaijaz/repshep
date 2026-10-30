import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Share, StyleSheet, TextInput, View } from 'react-native';
import { AuthShell, Steps } from '@/components/AuthShell';
import { FakeQR } from '@/components/FakeQR';
import { Button, Checkbox, Field, T } from '@/components/ui';
import { pkr, useStore, type Package } from '@/store';
import { colors, font, radius, space } from '@/theme';

// Figma [Sign Up] 107:8443 → 107:8607 → 107:8541
export default function SignUpGym() {
  const { gym, setGym, setRole } = useStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [d, setD] = useState({ name: 'Savyora Gym', phone: gym.phone, email: gym.email, location: gym.location, city: gym.city, password: 'password' });
  const [terms, setTerms] = useState(true);
  const [packages, setPackages] = useState<Package[]>(gym.packages);
  const [newPkg, setNewPkg] = useState({ name: '', price: '' });
  const [billing, setBilling] = useState('');
  const [timings, setTimings] = useState(gym.timings.join('\n'));
  const [facilities, setFacilities] = useState(gym.facilities);
  const set = (k: keyof typeof d) => (v: string) => setD((x) => ({ ...x, [k]: v }));

  const finish = () => {
    setGym((g) => ({
      ...g,
      name: d.name.replace(/ gym$/i, ''),
      phone: d.phone,
      email: d.email,
      location: d.location,
      city: d.city,
      packages,
      timings: timings.split('\n').filter(Boolean),
      facilities,
    }));
    setRole('gym');
    router.replace('/gym');
  };

  return (
    <AuthShell mode="signup" footer={step !== 3} signUpHref="/signup-gym">
      <T v="h1" style={{ fontSize: 32, lineHeight: 38 }}>
        Sign Up
      </T>
      <Steps step={step} />

      {step === 1 && (
        <>
          <Field label="Official Gym Name" value={d.name} onChangeText={set('name')} />
          <Field label="Business Whatsapp Number" value={d.phone} onChangeText={set('phone')} icon="phone" keyboardType="phone-pad" />
          <Field label="Business Email" value={d.email} onChangeText={set('email')} icon="mail" keyboardType="email-address" />
          <Field label="Location" value={d.location} onChangeText={set('location')} icon="map-pin" />
          <Field label="City" value={d.city} onChangeText={set('city')} icon="map" />
          <Field label="Password" value={d.password} onChangeText={set('password')} secure />
          <Checkbox
            checked={terms}
            onChange={setTerms}
            label={
              <T v="body">
                I accept the <T v="bodyStrong">Terms & Conditions</T>.
              </T>
            }
          />
          <Button label="Create Account" kind="accent" trailing="arrow-right" disabled={!terms || !d.name || !d.phone} onPress={() => setStep(2)} />
        </>
      )}

      {step === 2 && (
        <>
          <T v="bodyM">Set up gym features →</T>
          <View style={styles.box}>
            <T v="micro" color={colors.inkSoft}>
              Add Your Packages
            </T>
            {packages.map((p, i) => (
              <View key={p.name + i} style={styles.pkgRow}>
                <View style={{ flex: 1 }}>
                  <T v="bodyM">{p.name}</T>
                  <T v="caption" color={colors.inkSoft}>
                    {pkr(p.price)}
                  </T>
                </View>
                <Pressable accessibilityLabel={`Remove ${p.name}`} onPress={() => setPackages((ps) => ps.filter((_, j) => j !== i))} hitSlop={8}>
                  <Feather name="trash-2" size={16} color={colors.error} />
                </Pressable>
              </View>
            ))}
            <View style={styles.addPkg}>
              <TextInput placeholder="Package name" placeholderTextColor={colors.muted} value={newPkg.name} onChangeText={(name) => setNewPkg((x) => ({ ...x, name }))} style={[styles.inlineInput, { flex: 1 }]} />
              <TextInput placeholder="PKR" placeholderTextColor={colors.muted} keyboardType="number-pad" value={newPkg.price} onChangeText={(price) => setNewPkg((x) => ({ ...x, price }))} style={[styles.inlineInput, { width: 70 }]} />
            </View>
            <Button
              label="Click to Add"
              kind="white"
              small
              disabled={!newPkg.name || !Number(newPkg.price)}
              onPress={() => {
                setPackages((ps) => [...ps, { name: newPkg.name, price: Number(newPkg.price) }]);
                setNewPkg({ name: '', price: '' });
              }}
            />
          </View>
          <Field label="Billing period (days, optional)" value={billing} onChangeText={setBilling} placeholder="Type here..." keyboardType="number-pad" />
          <Field label="Add Timings" value={timings} onChangeText={setTimings} multiline />
          <Field label="Facilities" value={facilities} onChangeText={setFacilities} multiline />
          <T v="caption" color={colors.inkSoft}>
            Members see these hours and prices on the gym invitation. You can edit packages later.
          </T>
          <Button label="Next" kind="accent" trailing="arrow-right" onPress={() => setStep(3)} />
        </>
      )}

      {step === 3 && (
        <>
          <T v="bodyM">Bring your members in →</T>
          <View style={styles.qrWrap}>
            <FakeQR value={gym.code} />
          </View>
          <Field label="Gym Invitation link" value={gym.link} icon="share-2" onPress={() => Share.share({ message: `Join ${d.name} on RepShep: ${gym.link}` }).catch(() => {})} />
          <Field label="Gym Invitation code" value={gym.code} icon="share-2" onPress={() => Share.share({ message: `Join ${d.name} on RepShep with code ${gym.code}` }).catch(() => {})} />
          <T v="caption" color={colors.inkSoft}>
            Members can send join requests to your gym through this link or code.
          </T>
          <Button label="Activate gym profile" trailing="arrow-right" onPress={finish} />
        </>
      )}
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.white, borderRadius: radius.sm, padding: space.sm, gap: space.sm },
  pkgRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.surface, paddingBottom: space.xs },
  addPkg: { flexDirection: 'row', gap: space.xs },
  inlineInput: { fontFamily: font.medium, fontSize: 14, color: colors.ink, backgroundColor: colors.bg, borderRadius: radius.xs, paddingHorizontal: 10, paddingVertical: 8 },
  qrWrap: { alignSelf: 'center', backgroundColor: colors.white, padding: space.md, borderRadius: radius.md },
});
