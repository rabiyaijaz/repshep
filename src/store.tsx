import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ComponentProps } from 'react';
import type { Feather } from '@expo/vector-icons';

// Prototype data layer. Gym and member sides share one in-memory store so actions
// on one side (poke, payment, check-in, booking, order, renewal) show up on the other.

type IconName = ComponentProps<typeof Feather>['name'];
export type Role = 'gym' | 'member';
export type MemberStatus = 'active' | 'expiring' | 'expired' | 'frozen';

export type Member = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  plan: string;
  status: MemberStatus;
  daysAway: number;
  expiry: string;
  visitsThisMonth: number;
  points: number;
  dues: number;
  photo?: boolean;
  statusBeforeFreeze?: MemberStatus;
  renewalRequested?: boolean;
};

export type Payment = { id: string; memberId: string; amount: number; method: string; category: string; at: string };
export type Poke = {
  id: string;
  memberId: string;
  channel: string;
  message: string;
  status: 'delivered' | 'failed';
  at: string;
  read?: boolean;
  reply?: string;
};
export type Activity = { id: string; title: string; detail: string; at: string; who: string };
export type JoinRequest = { id: string; name: string; phone: string; plan: string };
export type Order = { id: string; memberId: string; item: string; price: number; status: 'preparing' | 'ready' | 'collected'; reward?: boolean };
export type Package = { name: string; price: number };
export type Visit = { id: string; memberId: string; at: string };
export type Session = { id: string; title: string; trainer: string; day: string; time: string; capacity: number; attendees: string[] };
export type Product = { id: string; name: string; price: number; icon: IconName; inStock: boolean };
export type Reward = { id: string; name: string; cost: number; icon: IconName };
export type Prefs = { appNotifications: boolean; whatsapp: boolean; language: string };

export type Gym = {
  name: string;
  phone: string;
  email: string;
  location: string;
  city: string;
  code: string;
  link: string;
  packages: Package[];
  timings: string[];
  facilities: string;
  monthEarnings: number;
  todayEarnings: number;
  checkInsToday: number;
  whatsappConnected: boolean;
  rules: { atRiskDays: number; maxPerWeek: number; quietHours: boolean };
};

export const ME = 'm-rabiya';

const initialMembers: Member[] = [
  { id: ME, name: 'Rabiya Ijaz', phone: '+92 3005980047', email: 'rabiya@example.com', plan: 'Strength Training', status: 'active', daysAway: 2, expiry: '14 Sep 2026', visitsThisMonth: 9, points: 40, dues: 0, photo: true },
  { id: 'm-sardar', name: 'Sardar Ali', phone: '+92 3005980047', plan: 'Strength Training', status: 'active', daysAway: 11, expiry: '30 Sep 2026', visitsThisMonth: 3, points: 25, dues: 0 },
  { id: 'm-shahid', name: 'Shahid Afridi', phone: '+92 3005980047', plan: 'Strength Training', status: 'expiring', daysAway: 2, expiry: '14 Sep 2026', visitsThisMonth: 12, points: 60, dues: 0 },
  { id: 'm-abubakr', name: 'Abu Bakr', phone: '+92 3005980047', plan: 'Strength Training', status: 'expired', daysAway: 11, expiry: '30 Sep 2026', visitsThisMonth: 1, points: 10, dues: 5000 },
  { id: 'm-abdul', name: 'Abdul Batool', phone: '+92 3005980047', plan: 'Strength Training', status: 'frozen', statusBeforeFreeze: 'active', daysAway: 11, expiry: '30 Sep 2026', visitsThisMonth: 0, points: 5, dues: 0 },
  { id: 'm-zainab', name: 'Zainab Khan', phone: '+92 301 5550134', plan: 'Strength + Cardio', status: 'active', daysAway: 8, expiry: '02 Oct 2026', visitsThisMonth: 4, points: 30, dues: 3000 },
  { id: 'm-ahmed', name: 'Ahmed Khan', phone: '+92 333 1234567', plan: 'Strength Training', status: 'active', daysAway: 1, expiry: '20 Oct 2026', visitsThisMonth: 14, points: 80, dues: 0 },
  { id: 'm-bilal', name: 'Bilal Afridi', phone: '+92 345 7654321', plan: 'Strength + Cardio + Boxing', status: 'active', daysAway: 9, expiry: '25 Oct 2026', visitsThisMonth: 2, points: 15, dues: 0 },
];

const initialGym: Gym = {
  name: 'Savyora',
  phone: '+92 3005980047',
  email: 'hristov123@gmail.com',
  location: 'Nasir Bagh Road · near Naseer Teaching Hospital & Rabbani Hospital',
  city: 'Peshawar',
  code: 'SAVYORA',
  link: 'https://repshep-team/909',
  packages: [
    { name: 'Registration', price: 5000 },
    { name: 'Strength Training', price: 5000 },
    { name: 'Strength + Cardio', price: 8000 },
    { name: 'Strength + Cardio + Boxing', price: 10000 },
  ],
  timings: ['Male only · 7 AM–10 AM', 'Female only · 10 AM–12 PM', 'Male + female · 7 PM–2 AM'],
  facilities: 'Modern equipment, strength training, female trainer, hot showers, clean & hygienic environment',
  monthEarnings: 286500,
  todayEarnings: 10500,
  checkInsToday: 24,
  whatsappConnected: false,
  rules: { atRiskDays: 7, maxPerWeek: 1, quietHours: true },
};

const initialSessions: Session[] = [
  { id: 's-1', title: 'Personal Training', trainer: 'Hamza Khan', day: 'Today', time: '7pm–10pm', capacity: 6, attendees: ['m-ahmed'] },
  { id: 's-2', title: 'Ladies Strength Circuit', trainer: 'Sana Malik', day: 'Tomorrow', time: '10am–11am', capacity: 10, attendees: ['m-zainab'] },
  { id: 's-3', title: 'Boxing Basics', trainer: 'Hamza Khan', day: 'Saturday', time: '8pm–9pm', capacity: 8, attendees: ['m-bilal', 'm-sardar'] },
];

const initialProducts: Product[] = [
  { id: 'pr-1', name: 'Whey protein · 1 kg', price: 9500, icon: 'package', inStock: true },
  { id: 'pr-2', name: 'Creatine · 300 g', price: 4200, icon: 'package', inStock: true },
  { id: 'pr-3', name: 'Shaker bottle', price: 1200, icon: 'droplet', inStock: true },
  { id: 'pr-4', name: 'Lifting gloves', price: 1800, icon: 'shield', inStock: false },
  { id: 'pr-5', name: 'Gym towel', price: 900, icon: 'square', inStock: true },
];

export const REWARDS: Reward[] = [
  { id: 'rw-1', name: 'Free protein shake', cost: 30, icon: 'coffee' },
  { id: 'rw-2', name: 'Gym towel', cost: 60, icon: 'square' },
  { id: 'rw-3', name: 'One free PT session', cost: 120, icon: 'award' },
  { id: 'rw-4', name: '10% off next renewal', cost: 200, icon: 'percent' },
];

// "Today · 6:42 PM" for anything created while the app is open.
export function stamp(d = new Date()) {
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `Today · ${h}:${m} ${ap}`;
}

let seq = 100;
const uid = (p: string) => `${p}-${++seq}`;

function useStoreValue() {
  const [role, setRole] = useState<Role | null>(null);
  const [joinState, setJoinState] = useState<'none' | 'pending' | 'approved'>('approved');
  const [gym, setGym] = useState<Gym>(initialGym);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [payments, setPayments] = useState<Payment[]>([
    { id: 'pay-1', memberId: 'm-ahmed', amount: 6000, method: 'Cash', category: 'Strength Training', at: 'Today · 9:10 AM' },
    { id: 'pay-2', memberId: 'm-shahid', amount: 4500, method: 'JazzCash', category: 'Strength Training', at: 'Today · 8:02 AM' },
    { id: 'pay-3', memberId: ME, amount: 5000, method: 'Bank transfer', category: 'Strength Training', at: '14 Aug · 7:40 PM' },
    { id: 'pay-4', memberId: 'm-bilal', amount: 10000, method: 'Cash', category: 'Strength + Cardio + Boxing', at: '12 Sep · 8:15 PM' },
  ]);
  const [pokes, setPokes] = useState<Poke[]>([
    { id: 'p-1', memberId: 'm-ahmed', channel: 'In-app', status: 'delivered', at: 'Today · 9:30 AM', message: 'Hi Ahmed! We’ve missed you at Savyora Gym. Fancy a session this week?', reply: 'I’ll be in today' },
    { id: 'p-2', memberId: 'm-bilal', channel: 'WhatsApp', status: 'failed', at: 'Yesterday · 6:12 PM', message: 'Hi Bilal! We’ve missed you at Savyora Gym.' },
  ]);
  const [activity, setActivity] = useState<Activity[]>([
    { id: 'a-1', title: 'PKR 6,000 payment recorded · Cash · Membership', detail: 'PT session booked · 18:00', at: 'Today · 9:10 AM', who: 'Ahmed Khan' },
  ]);
  const [requests, setRequests] = useState<JoinRequest[]>([
    { id: 'r-1', name: 'Hamza Tariq', phone: '+92 300 1112233', plan: 'Strength Training' },
    { id: 'r-2', name: 'Maryam Shah', phone: '+92 321 4445566', plan: 'Strength + Cardio' },
    { id: 'r-3', name: 'Usman Ghani', phone: '+92 312 7778899', plan: 'Strength + Cardio + Boxing' },
  ]);
  const [orders, setOrders] = useState<Order[]>([{ id: 'o-1', memberId: ME, item: 'Whey protein · 1 kg', price: 9500, status: 'ready' }]);
  const [visits, setVisits] = useState<Visit[]>([
    { id: 'v-1', memberId: ME, at: '28 Oct · 7:05 PM' },
    { id: 'v-2', memberId: ME, at: '26 Oct · 7:32 PM' },
    { id: 'v-3', memberId: ME, at: '24 Oct · 6:58 PM' },
    { id: 'v-4', memberId: 'm-ahmed', at: 'Yesterday · 6:20 PM' },
  ]);
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [prefs, setPrefs] = useState<Prefs>({ appNotifications: true, whatsapp: true, language: 'English + Urdu' });

  const log = (title: string, who: string, detail = '') => setActivity((a) => [{ id: uid('a'), title, detail, at: stamp(), who }, ...a]);
  const member = (id: string) => members.find((m) => m.id === id);
  const patchMember = (id: string, patch: Partial<Member>) => setMembers((ms) => ms.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  const nameOf = (id: string) => member(id)?.name ?? 'Member';

  return {
    role, setRole, joinState, setJoinState,
    gym, setGym, members, payments, pokes, activity, requests, orders, visits, sessions, products, prefs, setPrefs, member,

    /* ---------- Members ---------- */
    addMember(m: Pick<Member, 'name' | 'phone' | 'email' | 'plan' | 'expiry'>) {
      const id = uid('m');
      setMembers((ms) => [{ id, status: 'active', daysAway: 0, visitsThisMonth: 0, points: 0, dues: 0, ...m }, ...ms]);
      log(`New member added · ${m.plan}`, m.name);
      return id;
    },
    updateMember(id: string, patch: Partial<Pick<Member, 'name' | 'phone' | 'email' | 'plan' | 'expiry'>>) {
      patchMember(id, patch);
      log('Member details updated', patch.name ?? nameOf(id));
    },
    freeze(id: string) {
      const m = member(id);
      if (!m || m.status === 'frozen') return;
      patchMember(id, { status: 'frozen', statusBeforeFreeze: m.status });
      log('Membership frozen', m.name, 'Paused memberships are excluded from nudges');
    },
    unfreeze(id: string) {
      const m = member(id);
      if (!m) return;
      patchMember(id, { status: m.statusBeforeFreeze ?? 'active', statusBeforeFreeze: undefined });
      log('Membership unfrozen', m.name);
    },
    requestRenewal(id: string) {
      patchMember(id, { renewalRequested: true });
      log('Renewal requested from the app', nameOf(id), member(id)?.plan ?? '');
    },
    renew(id: string) {
      const m = member(id);
      patchMember(id, { status: 'active', expiry: '14 Oct 2026', renewalRequested: false });
      log('Membership renewed', m?.name ?? 'Member', m?.plan ?? '');
    },

    /* ---------- Money ---------- */
    recordPayment(memberId: string, amount: number, method: string, category: string) {
      const m = member(memberId);
      setPayments((p) => [{ id: uid('pay'), memberId, amount, method, category, at: stamp() }, ...p]);
      patchMember(memberId, { dues: Math.max(0, (m?.dues ?? 0) - amount) });
      setGym((g) => ({ ...g, monthEarnings: g.monthEarnings + amount, todayEarnings: g.todayEarnings + amount }));
      log(`PKR ${amount.toLocaleString()} payment recorded · ${method} · ${category}`, m?.name ?? 'Member');
    },

    /* ---------- Nudges ---------- */
    poke(memberId: string, channel: string, message: string) {
      // WhatsApp-only can't deliver until the business number is connected.
      const failed = channel === 'WhatsApp' && !gym.whatsappConnected;
      setPokes((p) => [{ id: uid('p'), memberId, channel, message, status: failed ? 'failed' : 'delivered', at: stamp() }, ...p]);
      log(`${channel} nudge · ${failed ? 'Failed' : 'Delivered'}`, nameOf(memberId), message);
    },
    retryPoke(id: string) {
      setPokes((p) => p.map((x) => (x.id === id ? { ...x, status: 'delivered', channel: 'In-app', at: stamp() } : x)));
    },
    markPokesRead(memberId: string) {
      setPokes((p) => (p.some((x) => x.memberId === memberId && !x.read) ? p.map((x) => (x.memberId === memberId ? { ...x, read: true } : x)) : p));
    },
    replyToPoke(id: string, reply: string) {
      const pk = pokes.find((x) => x.id === id);
      setPokes((p) => p.map((x) => (x.id === id ? { ...x, reply } : x)));
      if (pk) log(`Replied: “${reply}”`, nameOf(pk.memberId), 'Reply to your nudge');
    },

    /* ---------- Check-ins ---------- */
    checkIn(memberId: string) {
      const m = member(memberId);
      if (!m) return;
      patchMember(memberId, { daysAway: 0, visitsThisMonth: m.visitsThisMonth + 1, points: m.points + 5 });
      setVisits((v) => [{ id: uid('v'), memberId, at: stamp() }, ...v]);
      setGym((g) => ({ ...g, checkInsToday: g.checkInsToday + 1 }));
      log('Checked in', m.name, '+5 reward points');
    },

    /* ---------- Join requests ---------- */
    // Member side: a sign-up with the gym code lands in the gym's join requests.
    requestJoin(name: string, phone: string, plan: string) {
      setRequests((rs) => [{ id: 'r-me', name, phone, plan }, ...rs.filter((x) => x.id !== 'r-me')]);
      setJoinState('pending');
    },
    acceptRequest(id: string) {
      const r = requests.find((x) => x.id === id);
      if (!r) return;
      setRequests((rs) => rs.filter((x) => x.id !== id));
      if (id === 'r-me') {
        patchMember(ME, { name: r.name, phone: r.phone, plan: r.plan, status: 'active' });
        setJoinState('approved');
      } else {
        setMembers((ms) => [{ id: uid('m'), name: r.name, phone: r.phone, plan: r.plan, status: 'active', daysAway: 0, expiry: '30 Oct 2026', visitsThisMonth: 0, points: 0, dues: 0 }, ...ms]);
      }
      log('Join request accepted', r.name, r.plan);
    },
    declineRequest(id: string) {
      setRequests((rs) => rs.filter((x) => x.id !== id));
      if (id === 'r-me') setJoinState('none');
    },

    /* ---------- Classes ---------- */
    addSession(s: Omit<Session, 'id' | 'attendees'>) {
      setSessions((ss) => [...ss, { ...s, id: uid('s'), attendees: [] }]);
      log(`Session added · ${s.title}`, s.trainer, `${s.day} · ${s.time}`);
    },
    removeSession(id: string) {
      setSessions((ss) => ss.filter((s) => s.id !== id));
    },
    toggleBooking(sessionId: string, memberId: string) {
      const s = sessions.find((x) => x.id === sessionId);
      if (!s) return;
      const booked = s.attendees.includes(memberId);
      if (!booked && s.attendees.length >= s.capacity) return;
      setSessions((ss) =>
        ss.map((x) => (x.id === sessionId ? { ...x, attendees: booked ? x.attendees.filter((a) => a !== memberId) : [...x.attendees, memberId] } : x)),
      );
      log(booked ? `Cancelled ${s.title}` : `Booked ${s.title}`, nameOf(memberId), `${s.day} · ${s.time}`);
    },

    /* ---------- Shop & rewards ---------- */
    addProduct(name: string, price: number) {
      setProducts((ps) => [...ps, { id: uid('pr'), name, price, icon: 'package', inStock: true }]);
    },
    toggleStock(id: string) {
      setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p)));
    },
    placeOrder(memberId: string, item: string, price: number) {
      setOrders((o) => [{ id: uid('o'), memberId, item, price, status: 'preparing' }, ...o]);
      log(`Shop order · ${item}`, nameOf(memberId), `PKR ${price.toLocaleString()} · pay at pickup`);
    },
    setOrderStatus(id: string, status: Order['status']) {
      setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
    },
    redeem(memberId: string, rewardId: string) {
      const r = REWARDS.find((x) => x.id === rewardId);
      const m = member(memberId);
      if (!r || !m || m.points < r.cost) return false;
      patchMember(memberId, { points: m.points - r.cost });
      setOrders((o) => [{ id: uid('o'), memberId, item: r.name, price: 0, status: 'preparing', reward: true }, ...o]);
      log(`Redeemed ${r.name} · ${r.cost} points`, m.name);
      return true;
    },
  };
}

type Store = ReturnType<typeof useStoreValue>;
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const value = useStoreValue();
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const s = useContext(StoreContext);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
}

export const initials = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export const pkr = (n: number) => `PKR ${n.toLocaleString('en-US')}`;

// Members worth a nudge: away 2+ days and not paused. "At risk" uses the gym's poking rule.
export function useNeedsPoke() {
  const { members } = useStore();
  return useMemo(() => members.filter((m) => m.status !== 'frozen' && m.daysAway >= 2).sort((a, b) => b.daysAway - a.daysAway), [members]);
}
