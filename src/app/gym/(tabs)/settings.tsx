import { router } from 'expo-router';
import { Share } from 'react-native';
import { useGymSheets } from '@/components/GymSheets';
import { AttentionRow, Card, Screen, T, TopBar } from '@/components/ui';
import { pkr, useStore } from '@/store';
import { colors, radius, space } from '@/theme';

export default function Settings() {
  const { gym, setRole } = useStore();
  const { open, toast } = useGymSheets();

  const shareInvite = async () => {
    try {
      await Share.share({ message: `Join ${gym.name} Gym on RepShep: ${gym.link} · code ${gym.code}` });
    } catch {
      toast(`Code ${gym.code} · ${gym.link}`);
    }
  };

  return (
    <Screen>
      <TopBar />
      <T v="h2">Settings</T>
      <AttentionRow icon="home" title={`${gym.name} Gym`} sub={`${gym.city} · ${gym.phone}`} onPress={() => open('gym')} />
      <AttentionRow icon="share-2" title="Invite members" sub={`Code ${gym.code} · ${gym.link}`} onPress={shareInvite} />
      <AttentionRow icon="message-circle" title="Communication channels" sub={gym.whatsappConnected ? 'App + WhatsApp connected' : 'App ready · WhatsApp not connected'} onPress={() => open('channels')} />
      <AttentionRow icon="sliders" title="Poking rules" sub={`At risk after ${gym.rules.atRiskDays} days · max ${gym.rules.maxPerWeek}/week`} onPress={() => open('rules')} />
      <AttentionRow icon="calendar" title="Schedule" sub="PT slots and classes members can book" onPress={() => router.push('/gym/schedule')} />
      <AttentionRow icon="trending-up" title="Earnings" sub={`${pkr(gym.monthEarnings)} this month`} onPress={() => router.push('/gym/earnings')} />
      <AttentionRow icon="activity" title="Team activity" sub="Payments, nudges and check-ins" onPress={() => router.push('/gym/activity')} />

      <T v="h3" style={{ marginTop: space.xs }}>
        Packages & timings
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
      <AttentionRow icon="edit-2" title="Edit packages & timings" sub="Members see these on your invitation" onPress={() => open('packages')} />

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
