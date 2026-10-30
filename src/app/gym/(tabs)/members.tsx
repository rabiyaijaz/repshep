import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useGymSheets } from '@/components/GymSheets';
import { Avatar, Divider, Empty, Screen, SectionTitle, StatusBadge, T, TopBar } from '@/components/ui';
import { useStore, type MemberStatus } from '@/store';
import { colors, font, radius, space } from '@/theme';

type Filter = 'all' | MemberStatus | 'dues';
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'expiring', label: 'Expiring' },
  { key: 'expired', label: 'Expired' },
  { key: 'frozen', label: 'Frozen' },
  { key: 'dues', label: 'Dues' },
];

// Members list — Figma [Walkthrough] 26 (107:10580).
export default function Members() {
  const params = useLocalSearchParams<{ filter?: Filter }>();
  const { members } = useStore();
  const { open } = useGymSheets();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>(params.filter ?? 'all');
  // Home's "Needs attention" rows deep-link here with a filter; follow it when it changes.
  useEffect(() => {
    if (params.filter) setFilter(params.filter);
  }, [params.filter]);

  const list = useMemo(
    () =>
      members.filter((m) => {
        if (q && !`${m.name} ${m.phone}`.toLowerCase().includes(q.toLowerCase())) return false;
        if (filter === 'all') return true;
        if (filter === 'dues') return m.dues > 0;
        return m.status === filter;
      }),
    [members, q, filter],
  );

  return (
    <Screen>
      <TopBar back />
      <SectionTitle action="Add Member" onAction={() => open('addMember')}>
        Members
      </SectionTitle>
      <T v="body" color={colors.inkSoft}>
        Changes, messaged and follow-ups
      </T>
      <View style={styles.search}>
        <Feather name="search" size={18} color={colors.ink} />
        <TextInput value={q} onChangeText={setQ} placeholder="Search..." placeholderTextColor={colors.ink} style={styles.searchInput} accessibilityLabel="Search members" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.xs }}>
        {FILTERS.map((f) => (
          <Pressable key={f.key} onPress={() => setFilter(f.key)} style={[styles.chip, filter === f.key && styles.chipOn]}>
            <T v="caption" color={filter === f.key ? colors.white : colors.ink}>
              {f.label}
            </T>
          </Pressable>
        ))}
      </ScrollView>

      {list.length === 0 && <Empty icon="users" title="No members match" sub="Try another name or filter." />}
      {list.map((m) => (
        <Pressable key={m.id} onPress={() => router.push({ pathname: '/gym/member/[id]', params: { id: m.id } })} accessibilityRole="button">
          <View style={styles.row}>
            <Avatar name={m.name} />
            <View style={{ flex: 1, gap: 2 }}>
              <View style={styles.nameRow}>
                <T v="h3">{m.name}</T>
                <StatusBadge status={m.status} />
              </View>
              <T v="body" color={colors.inkSoft}>
                {m.daysAway} days since last visit · {m.plan}
              </T>
              <T v="body" color={colors.inkSoft}>
                Expiry: {m.expiry}
                {m.dues > 0 ? ` · Dues PKR ${m.dues.toLocaleString()}` : ''}
              </T>
            </View>
            <Feather name="chevron-right" size={20} color={colors.ink} />
          </View>
          <Divider />
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: space.sm, backgroundColor: colors.surface, borderRadius: radius.sm, paddingHorizontal: space.md, height: 52 },
  searchInput: { flex: 1, fontFamily: font.medium, fontSize: 16, color: colors.ink },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.surface },
  chipOn: { backgroundColor: colors.teal },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.xs, paddingVertical: space.md },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs, flexWrap: 'wrap' },
});
