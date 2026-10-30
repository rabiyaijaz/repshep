import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

// Prototype data layer. Gym and member sides share one in-memory store so actions
// on one side (poke, payment, check-in, join approval) show up on the other.

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
};
export type Activity = { id: string; title: string; detail: string; at: string; who: string };
export type JoinRequest = { id: string; name: string; phone: string; plan: string };
export type Order = { id: string; memberId: string; item: string; price: number; status: 'ready' | 'preparing' | 'collected' };
export type Package = { name: string; price: number };

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
};

export const ME = 'm-rabiya';

const initialMembers: Member[] = [
  { id: ME, name: 'Rabiya Ijaz', phone: '+92 3005980047', plan: 'Strength Training', status: 'active', daysAway: 2, expiry: '14 Sep 2026', visitsThisMonth: 9, points: 40, dues: 0, photo: true },
  { id: 'm-sardar', name: 'Sardar Ali', phone: '+92 3005980047', plan: 'Strength Training', status: 'active', daysAway: 11, expiry: '30 Sep 2026', visitsThisMonth: 3, points: 25, dues: 0 },
  { id: 'm-shahid', name: 'Shahid Afridi', phone: '+92 3005980047', plan: 'Strength Training', status: 'expiring', daysAway: 2, expiry: '14 Sep 2026', visitsThisMonth: 12, points: 60, dues: 0 },
  { id: 'm-abubakr', name: 'Abu Bakr', phone: '+92 3005980047', plan: 'Strength Training', status: 'expired', daysAway: 11, expiry: '30 Sep 2026', visitsThisMonth: 1, points: 10, dues: 5000 },
  { id: 'm-abdul', name: 'Abdul Batool', phone: '+92 3005980047', plan: 'Strength Training', status: 'frozen', daysAway: 11, expiry: '30 Sep 2026', visitsThisMonth: 0, points: 5, dues: 0 },
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
};

const now = () => 'Today · just now';
let seq = 100;
const uid = (p: string) => `${p}-${++seq}`;

function useStoreValue() {
  const [role, setRole] = useState<Role | null>(null);
  const [joinState, setJoinState] = useState<'none' | 'pending' | 'approved'>('approved');
  const [gym, setGym] = useState<Gym>(initialGym);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pokes, setPokes] = useState<Poke[]>([
    { id: 'p-1', memberId: 'm-ahmed', channel: 'In-app', status: 'delivered', at: now(), message: 'Hi Ahmed! We’ve missed you at Savyora Gym. Fancy a session this week?' },
    { id: 'p-2', memberId: 'm-bilal', channel: 'WhatsApp', status: 'failed', at: 'Yesterday · 6:12 PM', message: 'Hi Bilal! We’ve missed you at Savyora Gym.' },
  ]);
  const [activity, setActivity] = useState<Activity[]>([
    { id: 'a-1', title: 'PKR 6,000 payment recorded · Cash · Membership', detail: 'PT session booked · 18:00', at: now(), who: 'Ahmed Khan' },
  ]);
  const [requests, setRequests] = useState<JoinRequest[]>([
    { id: 'r-1', name: 'Hamza Tariq', phone: '+92 300 1112233', plan: 'Strength Training' },
    { id: 'r-2', name: 'Maryam Shah', phone: '+92 321 4445566', plan: 'Strength + Cardio' },
    { id: 'r-3', name: 'Usman Ghani', phone: '+92 312 7778899', plan: 'Strength + Cardio + Boxing' },
  ]);
  const [orders, setOrders] = useState<Order[]>([
    { id: 'o-1', memberId: ME, item: 'Whey protein · 1 kg', price: 9500, status: 'ready' },
  ]);

  const log = (title: string, who: string, detail = '') =>
    setActivity((a) => [{ id: uid('a'), title, detail, at: now(), who }, ...a]);

  const member = (id: string) => members.find((m) => m.id === id);
  const patchMember = (id: string, patch: Partial<Member>) =>
    setMembers((ms) => ms.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  return {
    role, setRole, joinState, setJoinState,
    gym, setGym, members, payments, pokes, activity, requests, orders, member,

    addMember(m: Pick<Member, 'name' | 'phone' | 'email' | 'plan' | 'expiry'>) {
      const id = uid('m');
      setMembers((ms) => [{ id, status: 'active', daysAway: 0, visitsThisMonth: 0, points: 0, dues: 0, ...m }, ...ms]);
      log(`New member added · ${m.plan}`, m.name);
      return id;
    },

    recordPayment(memberId: string, amount: number, method: string, category: string) {
      const m = member(memberId);
      setPayments((p) => [{ id: uid('pay'), memberId, amount, method, category, at: now() }, ...p]);
      patchMember(memberId, { dues: Math.max(0, (m?.dues ?? 0) - amount) });
      setGym((g) => ({ ...g, monthEarnings: g.monthEarnings + amount, todayEarnings: g.todayEarnings + amount }));
      log(`PKR ${amount.toLocaleString()} payment recorded · ${method} · ${category}`, m?.name ?? 'Member');
    },

    poke(memberId: string, channel: string, message: string) {
      const m = member(memberId);
      // WhatsApp can't deliver until the business number is connected.
      const failed = channel.includes('WhatsApp') && !gym.whatsappConnected && !channel.includes('In-app');
      setPokes((p) => [{ id: uid('p'), memberId, channel, message, status: failed ? 'failed' : 'delivered', at: now() }, ...p]);
      log(`${channel} nudge · ${failed ? 'Failed' : 'Delivered'}`, m?.name ?? 'Member', message);
    },

    retryPoke(id: string) {
      setPokes((p) => p.map((x) => (x.id === id ? { ...x, status: 'delivered', channel: 'In-app', at: now() } : x)));
    },

    markPokesRead(memberId: string) {
      setPokes((p) => p.map((x) => (x.memberId === memberId ? { ...x, read: true } : x)));
    },

    checkIn(memberId: string) {
      const m = member(memberId);
      if (!m) return;
      patchMember(memberId, { daysAway: 0, visitsThisMonth: m.visitsThisMonth + 1, points: m.points + 5 });
      setGym((g) => ({ ...g, checkInsToday: g.checkInsToday + 1 }));
      log('Checked in', m.name, '+5 reward points');
    },

    renew(memberId: string) {
      const m = member(memberId);
      patchMember(memberId, { status: 'active', expiry: '14 Oct 2026' });
      log('Membership renewed', m?.name ?? 'Member', m?.plan ?? '');
    },

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
        log('Join request accepted', r.name, r.plan);
        return;
      }
      setMembers((ms) => [{ id: uid('m'), name: r.name, phone: r.phone, plan: r.plan, status: 'active', daysAway: 0, expiry: '30 Oct 2026', visitsThisMonth: 0, points: 0, dues: 0 }, ...ms]);
      log('Join request accepted', r.name, r.plan);
    },
    declineRequest(id: string) {
      setRequests((rs) => rs.filter((x) => x.id !== id));
    },

    placeOrder(memberId: string, item: string, price: number) {
      setOrders((o) => [{ id: uid('o'), memberId, item, price, status: 'preparing' }, ...o]);
    },
    setOrderStatus(id: string, status: Order['status']) {
      setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
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

export function useNeedsPoke() {
  const { members } = useStore();
  return useMemo(() => members.filter((m) => m.status !== 'frozen' && m.daysAway >= 2).sort((a, b) => b.daysAway - a.daysAway), [members]);
}
