import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState, type ComponentProps, type ReactNode } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, font, radius, space, type } from '@/theme';
import { initials, useStore, type MemberStatus } from '@/store';
import { Wordmark } from './Logo';

export type IconName = ComponentProps<typeof Feather>['name'];

/* ---------- Text ---------- */

type Variant = keyof typeof type;
export function T({ v = 'body', color = colors.ink, style, ...rest }: TextProps & { v?: Variant; color?: string }) {
  return <Text {...rest} style={[type[v] as TextStyle, { color }, style]} />;
}

/* ---------- Layout ---------- */

export function Screen({
  children,
  scroll = true,
  tabBar = true,
  style,
}: {
  children: ReactNode;
  scroll?: boolean;
  tabBar?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const pad = { paddingHorizontal: space.sm, paddingBottom: tabBar ? 120 : space.xl, gap: space.sm };
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {scroll ? (
        <ScrollView contentContainerStyle={[pad, style]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, pad, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function TopBar({ back, onBell, bellDot }: { back?: boolean; onBell?: () => void; bellDot?: boolean }) {
  const { role } = useStore();
  return (
    <View style={styles.topBar}>
      {back ? (
        <Pressable
          accessibilityLabel="Go back"
          onPress={() => (router.canGoBack() ? router.back() : router.replace(role === 'member' ? '/member' : '/gym'))}
          style={styles.backBtn}
        >
          <Feather name="arrow-left" size={18} color={colors.white} />
        </Pressable>
      ) : (
        <Wordmark />
      )}
      {back && (
        <View style={styles.topCenter} pointerEvents="none">
          <Wordmark />
        </View>
      )}
      <View style={styles.topRight}>
        <Pressable accessibilityLabel="Notifications" onPress={onBell} hitSlop={8}>
          <Feather name="bell" size={22} color={colors.ink} />
          {bellDot && <View style={styles.dot} />}
        </Pressable>
        <Feather name="more-vertical" size={20} color={colors.ink} />
      </View>
    </View>
  );
}

export function SectionTitle({ children, action, onAction, arrow }: { children: ReactNode; action?: string; onAction?: () => void; arrow?: boolean }) {
  return (
    <View style={styles.sectionRow}>
      <T v="h3">
        {children}
        {arrow ? ' →' : ''}
      </T>
      {action && (
        <Pressable onPress={onAction} style={styles.inlineLink} hitSlop={8}>
          <Feather name="plus" size={16} color={colors.primary} />
          <T v="bodyStrong" color={colors.primary}>
            {action}
          </T>
        </Pressable>
      )}
    </View>
  );
}

/* ---------- Buttons ---------- */

type BtnKind = 'primary' | 'accent' | 'dark' | 'surface' | 'white';
const btnColors: Record<BtnKind, { bg: string; fg: string }> = {
  primary: { bg: colors.primary, fg: colors.white },
  accent: { bg: colors.accent, fg: colors.ink },
  dark: { bg: colors.black, fg: colors.white },
  surface: { bg: colors.surface, fg: colors.ink },
  white: { bg: colors.white, fg: colors.ink },
};

export function Button({
  label,
  onPress,
  kind = 'primary',
  icon,
  trailing,
  disabled,
  small,
  style,
}: {
  label: string;
  onPress?: () => void;
  kind?: BtnKind;
  icon?: IconName;
  trailing?: IconName;
  disabled?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const c = btnColors[kind];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        small && styles.btnSmall,
        { backgroundColor: c.bg, opacity: disabled ? 0.45 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {icon && <Feather name={icon} size={16} color={c.fg} />}
      <T v={small ? 'caption' : 'bodyM'} color={c.fg}>
        {label}
      </T>
      {trailing && <Feather name={trailing} size={16} color={c.fg} />}
    </Pressable>
  );
}

// Grey pill with an icon, label underneath (Add Member / Add payment / Poke Member).
export function ActionTile({ icon, label, onPress }: { icon: IconName; label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.actionTile} accessibilityRole="button" accessibilityLabel={label}>
      {({ pressed }) => (
        <>
          <View style={[styles.actionPill, pressed && { backgroundColor: colors.stone }]}>
            <Feather name={icon} size={18} color={colors.ink} />
          </View>
          <T v="body" color={colors.inkSoft}>
            {label}
          </T>
        </>
      )}
    </Pressable>
  );
}

/* ---------- Data display ---------- */

const statusStyle: Record<MemberStatus, { bg: string; label: string }> = {
  active: { bg: colors.primary, label: 'Active' },
  expiring: { bg: colors.error, label: 'Expiring' },
  expired: { bg: colors.danger, label: 'Expired' },
  frozen: { bg: colors.frozen, label: 'Frozen' },
};

export function StatusBadge({ status }: { status: MemberStatus }) {
  const s = statusStyle[status];
  return <Badge label={s.label} bg={s.bg} />;
}

export function Badge({ label, bg = colors.primary, fg = colors.white }: { label: string; bg?: string; fg?: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <T v="caption" color={fg}>
        {label}
      </T>
    </View>
  );
}

export function Avatar({ name, size = 32, photo }: { name: string; size?: number; photo?: boolean }) {
  if (photo) {
    return <Image source={require('../../assets/images/avatar.png')} style={{ width: size, height: size, borderRadius: size * 0.22 }} />;
  }
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <T v="caption" style={{ fontSize: size * 0.4, lineHeight: size * 0.5 }}>
        {initials(name)}
      </T>
    </View>
  );
}

export function IconBubble({ icon, tone = 'accent' }: { icon: IconName; tone?: 'accent' | 'warn' | 'primary' }) {
  const bg = tone === 'warn' ? colors.warnSoft : tone === 'primary' ? colors.primary : colors.accent;
  const fg = tone === 'primary' ? colors.white : colors.ink;
  return (
    <View style={[styles.bubble, { backgroundColor: bg }]}>
      <Feather name={icon} size={16} color={fg} />
    </View>
  );
}

// Grey rounded row with bubble icon, title, sub and chevron (Needs attention list).
export function AttentionRow({
  icon,
  title,
  sub,
  tone,
  onPress,
}: {
  icon: IconName;
  title: string;
  sub?: string;
  tone?: 'accent' | 'warn' | 'primary';
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.attention, pressed && { opacity: 0.8 }]} accessibilityRole="button">
      <IconBubble icon={icon} tone={tone} />
      <View style={{ flex: 1 }}>
        <T v="h3" style={{ fontSize: 18 }}>
          {title}
        </T>
        {sub ? (
          <T v="body" color={colors.inkSoft}>
            {sub}
          </T>
        ) : null}
      </View>
      <Feather name="chevron-right" size={20} color={colors.ink} />
    </Pressable>
  );
}

export function Card({ children, style, tone = 'surface' }: { children: ReactNode; style?: StyleProp<ViewStyle>; tone?: 'surface' | 'white' | 'primary' | 'dark' }) {
  const bg = { surface: colors.surface, white: colors.white, primary: colors.primary, dark: colors.black }[tone];
  return <View style={[styles.card, { backgroundColor: bg }, style]}>{children}</View>;
}

export function Divider({ color = colors.ink, style }: { color?: string; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ height: 1, backgroundColor: color }, style]} />;
}

/* ---------- Segmented control (Needs a poke / History / Failed) ---------- */

export function Segmented<K extends string>({ options, value, onChange }: { options: { key: K; label: string }[]; value: K; onChange: (k: K) => void }) {
  return (
    <View style={styles.segment}>
      {options.map((o) => {
        const on = o.key === value;
        return (
          <Pressable key={o.key} onPress={() => onChange(o.key)} style={[styles.segItem, on && styles.segOn]} accessibilityRole="tab" accessibilityState={{ selected: on }}>
            <T v="bodyStrong" color={on ? colors.white : colors.ink}>
              {o.label}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ---------- Form ---------- */

export function Field({
  label,
  value,
  onChangeText,
  icon,
  placeholder,
  secure,
  multiline,
  keyboardType,
  onPress,
}: {
  label: string;
  value: string;
  onChangeText?: (s: string) => void;
  icon?: IconName;
  placeholder?: string;
  secure?: boolean;
  multiline?: boolean;
  keyboardType?: ComponentProps<typeof TextInput>['keyboardType'];
  onPress?: () => void;
}) {
  const [hidden, setHidden] = useState(!!secure);
  const body = (
    <View style={styles.field}>
      <View style={{ flex: 1 }}>
        <T v="micro" color={colors.inkSoft}>
          {label}
        </T>
        {onPress ? (
          <T v="bodyM" style={{ marginTop: 2 }}>
            {value}
          </T>
        ) : (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.muted}
            secureTextEntry={hidden}
            multiline={multiline}
            keyboardType={keyboardType}
            accessibilityLabel={label}
            style={[styles.input, multiline && { minHeight: 72, textAlignVertical: 'top' }]}
          />
        )}
      </View>
      {secure ? (
        <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8} accessibilityLabel={hidden ? 'Show password' : 'Hide password'}>
          <Feather name={hidden ? 'eye-off' : 'eye'} size={18} color={colors.ink} />
        </Pressable>
      ) : icon ? (
        <Feather name={icon} size={18} color={colors.ink} />
      ) : null}
    </View>
  );
  return onPress ? (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${label}: ${value}`}>
      {body}
    </Pressable>
  ) : (
    body
  );
}

// Field that cycles through options on tap (keeps the prototype dependency-free).
export function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Field label={label} value={value} icon={open ? 'chevron-up' : 'chevron-down'} onPress={() => setOpen((o) => !o)} />
      {open && (
        <View style={styles.menu}>
          {options.map((o) => (
            <Pressable
              key={o}
              onPress={() => {
                onChange(o);
                setOpen(false);
              }}
              style={styles.menuItem}
            >
              <T v="bodyStrong" color={o === value ? colors.primary : colors.ink}>
                {o}
              </T>
              {o === value && <Feather name="check" size={16} color={colors.primary} />}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode }) {
  return (
    <Pressable onPress={() => onChange(!checked)} style={styles.checkRow} accessibilityRole="checkbox" accessibilityState={{ checked }}>
      <View style={[styles.checkbox, checked && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
        {checked && <Feather name="check" size={12} color={colors.white} />}
      </View>
      {typeof label === 'string' ? <T v="body">{label}</T> : label}
    </Pressable>
  );
}

/* ---------- Bottom sheet ---------- */

export function Sheet({ visible, onClose, title, children }: { visible: boolean; onClose: () => void; title?: string; children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetWrap}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, space.md) }]}>
          <View style={styles.handle} />
          <ScrollView contentContainerStyle={{ gap: space.xs }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {title ? (
              <T v="h3" style={{ marginBottom: space.xs }}>
                {title}
              </T>
            ) : null}
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ---------- Toast ---------- */

export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 2600);
    return () => clearTimeout(t);
  }, [msg]);
  const node = msg ? (
    <View style={styles.toast} pointerEvents="box-none">
      <View style={styles.toastInner}>
        <Feather name="check-circle" size={18} color={colors.accent} />
        <T v="bodyStrong" color={colors.white} style={{ flex: 1 }}>
          {msg}
        </T>
        <Pressable onPress={() => setMsg(null)}>
          <T v="caption" color={colors.accent}>
            Dismiss
          </T>
        </Pressable>
      </View>
    </View>
  ) : null;
  return { show: setMsg, node };
}

export function Empty({ icon, title, sub }: { icon: IconName; title: string; sub?: string }) {
  return (
    <View style={styles.empty}>
      <IconBubble icon={icon} />
      <T v="bodyM">{title}</T>
      {sub ? (
        <T v="body" color={colors.inkSoft} style={{ textAlign: 'center' }}>
          {sub}
        </T>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  topBar: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topCenter: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  backBtn: { width: 44, height: 32, borderRadius: radius.pill, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: -1, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.xs },
  inlineLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  btn: { height: 52, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.xs, paddingHorizontal: space.lg },
  btnSmall: { height: 36, paddingHorizontal: space.md },
  actionTile: { flex: 1, alignItems: 'center', gap: space.xs },
  actionPill: { alignSelf: 'stretch', height: 56, borderRadius: radius.pill, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill, alignSelf: 'flex-start' },
  avatar: { backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  bubble: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  attention: { flexDirection: 'row', alignItems: 'center', gap: space.sm, backgroundColor: colors.surface, borderRadius: radius.md, padding: space.md },
  card: { borderRadius: radius.lg, padding: space.md },
  segment: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.pill, padding: 6 },
  segItem: { flex: 1, height: 36, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: colors.teal },
  field: { flexDirection: 'row', alignItems: 'center', gap: space.sm, backgroundColor: colors.white, borderRadius: radius.sm, paddingHorizontal: space.sm, paddingVertical: 10 },
  input: { fontFamily: font.medium, fontSize: 16, color: colors.ink, padding: 0, marginTop: 2 },
  menu: { backgroundColor: colors.white, borderRadius: radius.sm, marginTop: 4, overflow: 'hidden', borderWidth: 1, borderColor: colors.surface },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.sm, paddingVertical: 12 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  sheetWrap: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(23,23,23,0.55)' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, paddingHorizontal: space.md, paddingTop: space.sm, maxHeight: '90%' },
  handle: { alignSelf: 'center', width: 134, height: 5, borderRadius: 3, backgroundColor: colors.ink, marginBottom: space.md },
  toast: { position: 'absolute', left: space.sm, right: space.sm, bottom: 110, alignItems: 'center' },
  toastInner: { flexDirection: 'row', alignItems: 'center', gap: space.sm, backgroundColor: colors.ink, borderRadius: radius.md, paddingHorizontal: space.md, paddingVertical: space.sm, alignSelf: 'stretch' },
  empty: { alignItems: 'center', gap: space.xs, padding: space.xl },
});
