import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AttentionRow, Avatar, Button, Card, Divider, Field, Pills, Screen, Sheet, StatusBadge, T, Toggle, TopBar, useToast } from '@/components/ui';
import { ME, pkr, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

export default function Profile() {
  const { member, payments, visits, gym, prefs, setPrefs, setRole, updateMember } = useStore();
  const me = member(ME)!;
  const mine = payments.filter((p) => p.memberId === ME);
  const myVisits = visits.filter((v) => v.memberId === ME).slice(0, 5);
  const [editing, setEditing] = useState(false);
  const [d, setD] = useState({ name: me.name, phone: me.phone, email: me.email ?? '' });
  const { show, node } = useToast();

  return (
    <>
      <Screen>
        <TopBar />
        <View style={styles.head}>
          <Avatar name={me.name} size={64} photo={me.photo} />
          <View style={{ flex: 1 }}>
            <T v="h2">{me.name}</T>
            <T v="body" color={colors.inkSoft}>
              {me.phone}
            </T>
          </View>
          <View style={{ alignItems: 'flex-end', gap: space.xs }}>
            <StatusBadge status={me.status} />
            <Pressable
              onPress={() => {
                setD({ name: me.name, phone: me.phone, email: me.email ?? '' });
                setEditing(true);
              }}
              hitSlop={8}
            >
              <T v="caption" color={colors.primary}>
                Edit profile
              </T>
            </Pressable>
          </View>
        </View>

        <T v="h3" style={{ marginTop: space.xs }}>
          Payments
        </T>
        <Card style={{ borderRadius: radius.md, gap: space.sm }}>
          {mine.length === 0 ? (
            <T v="body" color={colors.inkSoft}>
              No payments recorded yet. Payments made at the front desk show up here.
            </T>
          ) : (
            mine.map((p) => (
              <View key={p.id} style={styles.between}>
                <View style={{ flex: 1 }}>
                  <T v="bodyM">{p.category}</T>
                  <T v="caption" color={colors.inkSoft}>
                    {p.method} · {p.at}
                  </T>
                </View>
                <T v="bodyStrong">{pkr(p.amount)}</T>
              </View>
            ))
          )}
          <Divider color={colors.line} />
          <T v="bodyStrong" color={me.dues > 0 ? colors.danger : colors.inkSoft}>
            Outstanding: {pkr(me.dues)}
          </T>
        </Card>

        <T v="h3" style={{ marginTop: space.xs }}>
          Recent visits
        </T>
        <Card style={{ borderRadius: radius.md, gap: space.xs }}>
          {myVisits.length === 0 ? (
            <T v="body" color={colors.inkSoft}>
              No visits yet.
            </T>
          ) : (
            myVisits.map((v) => (
              <View key={v.id} style={styles.between}>
                <T v="body">{v.at}</T>
                <T v="caption" color={colors.primary}>
                  +5 points
                </T>
              </View>
            ))
          )}
        </Card>

        <T v="h3" style={{ marginTop: space.xs }}>
          Notifications
        </T>
        <Card style={{ borderRadius: radius.md }}>
          <Toggle value={prefs.appNotifications} onChange={(v) => setPrefs((p) => ({ ...p, appNotifications: v }))} label="App notifications" sub="Order updates, class reminders, messages" />
          <Toggle value={prefs.whatsapp} onChange={(v) => setPrefs((p) => ({ ...p, whatsapp: v }))} label={`WhatsApp from ${gym.name}`} sub="Reminders when you’ve been away" />
        </Card>

        <T v="h3" style={{ marginTop: space.xs }}>
          Message language
        </T>
        <Pills options={['English', 'Urdu', 'English + Urdu']} value={prefs.language} onChange={(language) => setPrefs((p) => ({ ...p, language }))} />

        <AttentionRow icon="message-square" title="Messages" sub={`Reminders from ${gym.name}`} onPress={() => router.push('/member/inbox')} />
        <AttentionRow icon="calendar" title="Classes" sub="Book PT and group sessions" onPress={() => router.push('/member/classes')} />
        <AttentionRow icon="gift" title="Rewards" sub={`${me.points} points to spend`} onPress={() => router.push('/member/rewards')} />
        <AttentionRow
          icon="repeat"
          title="Switch to gym side"
          sub="Prototype only"
          onPress={() => {
            setRole('gym');
            router.replace('/gym');
          }}
        />
        <AttentionRow
          icon="log-out"
          tone="warn"
          title="Log out"
          onPress={() => {
            setRole(null);
            router.replace('/welcome');
          }}
        />
      </Screen>

      <Sheet visible={editing} onClose={() => setEditing(false)} title="Edit profile">
        <Field label="Full Name" value={d.name} onChangeText={(name) => setD((x) => ({ ...x, name }))} />
        <Field label="Whatsapp Number" value={d.phone} onChangeText={(phone) => setD((x) => ({ ...x, phone }))} icon="phone" keyboardType="phone-pad" />
        <Field label="Email" value={d.email} onChangeText={(email) => setD((x) => ({ ...x, email }))} icon="mail" keyboardType="email-address" />
        <Button
          label="Save"
          disabled={d.name.trim().length < 2}
          onPress={() => {
            updateMember(ME, { name: d.name.trim(), phone: d.phone, email: d.email || undefined });
            setEditing(false);
            show('Profile updated');
          }}
        />
      </Sheet>
      {node}
    </>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
});
