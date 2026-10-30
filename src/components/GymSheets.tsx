import { createContext, useContext, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Badge, Button, Card, Field, SelectField, Sheet, T, useToast } from './ui';
import { pkr, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

// Bottom sheets from the gym dashboard (Figma 107:7229 Add Member, 107:7832 Record Payment,
// 107:8993 Poke a member, 107:9778 / 107:10319 Communication channels, 107:8101 Gym details).
type SheetKind = 'addMember' | 'payment' | 'poke' | 'channels' | 'gym';
type Ctx = { open: (kind: SheetKind, memberId?: string) => void; toast: (m: string) => void };
const SheetCtx = createContext<Ctx>({ open: () => {}, toast: () => {} });
export const useGymSheets = () => useContext(SheetCtx);

export function GymSheetsProvider({ children }: { children: ReactNode }) {
  const [kind, setKind] = useState<SheetKind | null>(null);
  const [memberId, setMemberId] = useState<string | undefined>();
  const { show, node } = useToast();
  const close = () => setKind(null);
  const open = (k: SheetKind, id?: string) => {
    setMemberId(id);
    setKind(k);
  };

  return (
    <SheetCtx.Provider value={{ open, toast: show }}>
      {children}
      {node}
      <Sheet visible={kind === 'addMember'} onClose={close}>
        {kind === 'addMember' && <AddMember onDone={(m, pay) => { close(); show(`${m} added`); if (pay) setTimeout(() => open('payment', pay), 350); }} />}
      </Sheet>
      <Sheet visible={kind === 'payment'} onClose={close}>
        {kind === 'payment' && <RecordPayment initialId={memberId} onDone={() => { close(); show('Payment recorded successfully'); }} />}
      </Sheet>
      <Sheet visible={kind === 'poke'} onClose={close}>
        {kind === 'poke' && <PokeMember initialId={memberId} onDone={(ok) => { close(); show(ok ? 'Nudge sent' : 'WhatsApp isn’t connected — saved under Failed'); }} />}
      </Sheet>
      <Sheet visible={kind === 'channels'} onClose={close}>
        {kind === 'channels' && <Channels onDone={(m) => { close(); show(m); }} />}
      </Sheet>
      <Sheet visible={kind === 'gym'} onClose={close}>
        {kind === 'gym' && <GymDetails onDone={() => { close(); show('Gym details saved'); }} />}
      </Sheet>
    </SheetCtx.Provider>
  );
}

function AddMember({ onDone }: { onDone: (name: string, payFor?: string) => void }) {
  const { gym, addMember } = useStore();
  const plans = gym.packages.filter((p) => p.name !== 'Registration').map((p) => p.name);
  const [d, setD] = useState({ name: '', phone: '', email: '', expiry: '19th October 2026' });
  const [plan, setPlan] = useState(plans[0] ?? '');
  const set = (k: keyof typeof d) => (v: string) => setD((x) => ({ ...x, [k]: v }));
  const ok = d.name.trim().length > 1 && d.phone.trim().length > 6;
  const create = (pay: boolean) => {
    const id = addMember({ name: d.name.trim(), phone: d.phone, email: d.email || undefined, plan, expiry: d.expiry });
    onDone(d.name.trim(), pay ? id : undefined);
  };
  return (
    <>
      <T v="h3">Add Member →</T>
      <Field label="Full Name" value={d.name} onChangeText={set('name')} placeholder="Abu Bakr Khan" />
      <Field label="Whatsapp Number" value={d.phone} onChangeText={set('phone')} icon="phone" placeholder="+92 300 0000000" keyboardType="phone-pad" />
      <Field label="Member email (optional)" value={d.email} onChangeText={set('email')} icon="mail" placeholder="name@gmail.com" keyboardType="email-address" />
      <SelectField label="Membership plan" value={plan} options={plans} onChange={setPlan} />
      <Field label="Membership expiry" value={d.expiry} onChangeText={set('expiry')} icon="calendar" />
      <Button label="Create member" trailing="arrow-right" disabled={!ok} onPress={() => create(false)} />
      <Button label="Save and record payment" kind="white" disabled={!ok} onPress={() => create(true)} />
    </>
  );
}

function MemberPicker({ value, onChange }: { value?: string; onChange: (id: string) => void }) {
  const { members } = useStore();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.xs }}>
      {members.map((m) => (
        <Pressable key={m.id} onPress={() => onChange(m.id)} style={[styles.chip, value === m.id && styles.chipOn]}>
          <Avatar name={m.name} size={22} />
          <T v="caption" color={value === m.id ? colors.white : colors.ink}>
            {m.name}
          </T>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function RecordPayment({ initialId, onDone }: { initialId?: string; onDone: () => void }) {
  const { members, gym, member, recordPayment } = useStore();
  const [id, setId] = useState(initialId ?? members.find((m) => m.name === 'Ahmed Khan')?.id ?? members[0].id);
  const m = member(id);
  const [category, setCategory] = useState(m?.plan ?? 'Strength Training');
  const [method, setMethod] = useState('Cash');
  const [amount, setAmount] = useState(String(gym.packages.find((p) => p.name === m?.plan)?.price ?? 6000));
  return (
    <>
      <T v="h3">Record Payment</T>
      {!initialId && <MemberPicker value={id} onChange={setId} />}
      <Card tone="white" style={styles.whoCard}>
        <T v="bodyM">{m?.name}</T>
        <T v="caption" color={m && m.dues > 0 ? colors.danger : colors.inkSoft}>
          Outstanding {pkr(m?.dues ?? 0)}
        </T>
      </Card>
      <SelectField label="Payment Category" value={category} options={[...gym.packages.map((p) => p.name), 'Shop order', 'Personal training']} onChange={setCategory} />
      <SelectField label="Payment method" value={method} options={['Cash', 'Bank transfer', 'JazzCash', 'Easypaisa', 'Card']} onChange={setMethod} />
      <Field label="Amount received (PKR)" value={amount} onChangeText={(v) => setAmount(v.replace(/[^0-9]/g, ''))} keyboardType="number-pad" />
      <Button
        label="Confirm Payment"
        disabled={!Number(amount)}
        onPress={() => {
          recordPayment(id, Number(amount), method, category);
          onDone();
        }}
      />
    </>
  );
}

function PokeMember({ initialId, onDone }: { initialId?: string; onDone: (delivered: boolean) => void }) {
  const { members, member, gym, poke } = useStore();
  const [id, setId] = useState(initialId ?? members.find((m) => m.name === 'Zainab Khan')?.id ?? members[0].id);
  const m = member(id);
  const first = m?.name.split(' ')[0] ?? '';
  const [channel, setChannel] = useState('In-app + WhatsApp');
  const [lang, setLang] = useState('English + Urdu');
  const [tone, setTone] = useState('Warm');
  const [msg, setMsg] = useState<string | null>(null);
  const [follow, setFollow] = useState('In 3 days');
  const text = msg ?? `Hi ${first}! We’ve missed you at ${gym.name} Gym. Fancy a session this week? Let us know if you need a hand getting back into your routine.`;
  return (
    <>
      <T v="h3">Poke a member</T>
      {!initialId && <MemberPicker value={id} onChange={(x) => { setId(x); setMsg(null); }} />}
      <View>
        <T v="bodyM">{m?.name}</T>
        <T v="caption" color={colors.inkSoft}>
          {m?.phone} · {m?.daysAway} days since last visit
        </T>
      </View>
      <SelectField label="Channel" value={channel} options={['In-app + WhatsApp', 'In-app', 'WhatsApp']} onChange={setChannel} />
      <SelectField label="Message language" value={lang} options={['English + Urdu', 'English', 'Urdu']} onChange={setLang} />
      <SelectField label="Tone" value={tone} options={['Warm', 'Short', 'Offer-led']} onChange={setTone} />
      <Field label="Message" value={text} onChangeText={setMsg} multiline />
      <SelectField label="Follow up if they don’t return" value={follow} options={['In 3 days', 'In a week', 'Don’t follow up']} onChange={setFollow} />
      <Button
        label="Send nudge"
        trailing="send"
        onPress={() => {
          poke(id, channel, text);
          onDone(channel !== 'WhatsApp' || gym.whatsappConnected);
        }}
      />
    </>
  );
}

function Channels({ onDone }: { onDone: (m: string) => void }) {
  const { gym, setGym } = useStore();
  const [preview, setPreview] = useState(false);
  if (preview || gym.whatsappConnected) {
    return (
      <>
        <T v="h3">Connect WhatsApp</T>
        <Field label="Business Whatsapp Number" value={gym.phone} icon="phone" onPress={() => {}} />
        <Card tone="white" style={{ gap: space.xs, borderRadius: radius.md }}>
          <View style={styles.rowBetween}>
            <T v="bodyM">Member return reminder</T>
            <Badge label={gym.whatsappConnected ? 'Approved' : 'Draft'} bg={gym.whatsappConnected ? colors.success : colors.surface} fg={gym.whatsappConnected ? colors.white : colors.ink} />
          </View>
          <T v="body" color={colors.inkSoft}>
            {`Hi {{first_name}}, we’ve missed you at ${gym.name} Gym. Need help getting back into your routine?`}
          </T>
          <T v="caption" color={colors.muted}>
            Template status: {gym.whatsappConnected ? 'approved' : 'draft'} · English / Urdu
          </T>
        </Card>
        {gym.whatsappConnected ? (
          <Button label="Disconnect" kind="white" onPress={() => { setGym((g) => ({ ...g, whatsappConnected: false })); onDone('WhatsApp disconnected'); }} />
        ) : (
          <Button label="Preview connected state" onPress={() => { setGym((g) => ({ ...g, whatsappConnected: true })); onDone('WhatsApp business connected'); }} />
        )}
      </>
    );
  }
  return (
    <>
      <T v="h3">Communication channels</T>
      <Card tone="white" style={{ gap: 4, borderRadius: radius.md }}>
        <View style={styles.rowBetween}>
          <T v="h3">App notifications</T>
          <Badge label="Ready" bg={colors.accent} fg={colors.ink} />
        </View>
        <T v="body" color={colors.inkSoft}>
          Compose, preview, simulate delivery and track followups from the member timeline
        </T>
      </Card>
      <Card tone="white" style={{ gap: space.xs, borderRadius: radius.md }}>
        <View style={styles.rowBetween}>
          <T v="h3">WhatsApp business</T>
          <Badge label="Not connected" bg={colors.error} />
        </View>
        <T v="body" color={colors.inkSoft}>
          1. Connect gym business number{'\n'}2. Review member consent{'\n'}3. Approve message templates{'\n'}4. Test delivery and staff escalation
        </T>
        <Button label="Preview connection flow" onPress={() => setPreview(true)} />
      </Card>
    </>
  );
}

function GymDetails({ onDone }: { onDone: () => void }) {
  const { gym, setGym } = useStore();
  const [d, setD] = useState({ name: `${gym.name} Gym`, phone: gym.phone, email: gym.email, location: gym.location, city: gym.city });
  const set = (k: keyof typeof d) => (v: string) => setD((x) => ({ ...x, [k]: v }));
  return (
    <>
      <T v="h3">Gym details</T>
      <Field label="Official Gym Name" value={d.name} onChangeText={set('name')} />
      <Field label="Business Whatsapp Number" value={d.phone} onChangeText={set('phone')} icon="phone" />
      <Field label="Business Email" value={d.email} onChangeText={set('email')} icon="mail" />
      <Field label="Location" value={d.location} onChangeText={set('location')} icon="map-pin" />
      <Field label="City" value={d.city} onChangeText={set('city')} icon="map" />
      <Button
        label="Save changes"
        onPress={() => {
          setGym((g) => ({ ...g, ...d, name: d.name.replace(/ gym$/i, '') }));
          onDone();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.white, borderRadius: radius.pill, paddingVertical: 6, paddingHorizontal: 10 },
  chipOn: { backgroundColor: colors.primary },
  whoCard: { borderRadius: radius.sm, paddingVertical: space.sm, gap: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.xs },
});
