import { router } from 'expo-router';
import { useGymSheets } from '@/components/GymSheets';
import { AttentionRow, Card, Screen, T, TopBar } from '@/components/ui';
import { pkr, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

export default function Settings() {
  const { gym, setRole } = useStore();
  const { open } = useGymSheets();
  return (
    <Screen>
      <TopBar />
      <T v="h2">Settings</T>
      <AttentionRow icon="home" title={`${gym.name} Gym`} sub={`${gym.city} · ${gym.phone}`} onPress={() => open('gym')} />
      <AttentionRow icon="message-circle" title="Communication channels" sub={gym.whatsappConnected ? 'App + WhatsApp connected' : 'App ready · WhatsApp not connected'} onPress={() => open('channels')} />
      <AttentionRow icon="link" title="Invitation code" sub={`${gym.code} · ${gym.link}`} />
      <AttentionRow icon="activity" title="Team activity" sub="Payments, nudges and check-ins" onPress={() => router.push('/gym/activity')} />

      <T v="h3" style={{ marginTop: space.xs }}>
        Packages
      </T>
      <Card style={{ borderRadius: radius.md, gap: space.xs }}>
        {gym.packages.map((p) => (
          <T key={p.name} v="body">
            {p.name} · <T v="bodyStrong">{pkr(p.price)}</T>
          </T>
        ))}
        <T v="caption" color={colors.inkSoft} style={{ marginTop: space.xs }}>
          {gym.timings.join('\n')}
        </T>
      </Card>

      <AttentionRow
        icon="repeat"
        title="Switch to member side"
        sub="Prototype only · see it as Rabiya"
        onPress={() => {
          setRole('member');
          router.replace('/member');
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
  );
}
