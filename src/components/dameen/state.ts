/* حالة ضمين الكاملة — zustand + persist: الجلسة والسلة المجمعة بالمتاجر والطلبات بشحناتها المستقلة
 * محرك اللوجستيات + الكوبونات + النقاط + OTP + المبالغ الإضافية + حارس المحادثة + المكتبة الرقمية + التقييمات */
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import {
  CATS as CATS0, COUPONS as COUPONS0, PTS_FUNDING, REQUESTS, REV_MONTHS, SEED_DISPUTES, SEED_NOTIFS, SEED_ORDERS,
  STORES as STORES0, STORE_WALLETS, USERS as USERS0, WORLDS as WORLDS0, PRODUCTS as PRODUCTS0,
  CITY_DL, COURIERS, chatGuard, worldOf,
  type Coupon, type Dispute, type Product, type RegRequest, type Store, type User, type World,
} from './data';

export type Role = 'customer' | 'merchant' | 'admin';
export type GStatus = 'pending' | 'preparing' | 'shipped' | 'received' | 'released' | 'refunded' | 'disputed';

export interface Session { phone: string; name: string; role: Role; store: string | null; }

export interface CartLine { pid: string; qty: number; ans?: { q: string; a: string }[]; }

export interface ShipQuote {
  mode: 'std' | 'digital' | 'field' | 'instant' | 'chilled';
  cost: number; charge: number; subsidy: number; source: string; why: string;
  label: string; fragile: boolean; blocked: string | null;
}

export interface ChatMsg {
  r: 'customer' | 'merchant' | 'dameen' | 'sys'; t: string; at: number; img?: string | null;
  loc?: { geo: { lat: number; lng: number } | null; txt: string } | null;
  payreq?: { amt: number; note: string; paid: boolean; via?: string } | null;
}

export interface OrderGroup {
  store: string;
  items: { pid: string; qty: number; price: number }[];
  sub: number; dl: number; extra: number;
  status: GStatus;
  digi: boolean; custom: boolean;
  gift: { name: string; phone: string; city: string } | null;
  booking: { dl: string; date: string; setup: string; tear: string; note: string; geo: { lat: number; lng: number } | null } | null;
  ship: ShipQuote | null;
  logi: { wb: string | null; courier: string; mode: string; events: { t: string; at: number }[] } | null;
  chat: ChatMsg[];
  chatArchived?: boolean; chatDeleted?: boolean;
  viol: { customer: number; merchant: number };
  payout?: { sub: number; comm: number; net: number; ship?: { charge: number; merchant: number; pts: number } };
  rated?: { stars: number; txt: string };
  complaintUntil?: number;
  otp?: string; otpBad?: number; otpOk?: boolean;
  ans?: { q: string; a: string }[];
  pans?: { pn: string; ans: { q: string; a: string }[] }[];
}

export interface Order {
  id: number; customer: string; at: number; pay: string; addr: string; city: string;
  coupon: { code: string | null; amt: number } | null;
  ptsUsed: number; ptsAmt: number; freeDl: boolean;
  net: number; tax: number; total: number;
  paidBy?: string; inst?: { by: string; n: number; each: number };
  groups: OrderGroup[];
}

export interface Notif { id: string; to: string; ic: string; t: string; b: string; at: number; read: boolean; go: string[]; }

export type Route =
  | { name: 'home' }
  | { name: 'section'; id: string }
  | { name: 'store'; id: string }
  | { name: 'product'; id: string }
  | { name: 'search'; q: string }
  | { name: 'checkout' }
  | { name: 'success'; id: number }
  | { name: 'orders' } | { name: 'favorites' } | { name: 'account' } | { name: 'disputes' } | { name: 'dlib' }
  | { name: 'merchant'; tab: string }
  | { name: 'admin'; tab: string };

/* ============ مساعدات ============ */
export const r2 = (n: number) => Math.round(n * 100) / 100;
export const eff = (p: Product) => r2(p.price * (1 - (p.off || 0) / 100));
export const stOK = (s: Store) => !s.susp;

const hash = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };

export function mkLogi(mode: string, seed: string) {
  const cs = COURIERS[mode] || COURIERS.std;
  const courier = cs[hash(String(seed)) % cs.length];
  const wb = 'WB-' + (100000 + hash('wb' + seed) % 899999);
  return { wb, courier, mode, events: [
    { t: 'أُصدرت بوليصة الشحن آلياً عبر الربط اللوجستي (' + courier + ')', at: Date.now() },
    { t: 'أُرسل طلب استلام (Pickup Request) للمندوب', at: Date.now() + 1 },
  ] };
}

/* ============ محرك اللوجستيات ============ */
export function shipQuote(items: { p: Product; qty: number }[], st: Store, city: string, fd: boolean): ShipQuote {
  const ptypes = items.map(x => x.p.ptype || 'std');
  const gsub = r2(items.reduce((a, x) => a + eff(x.p) * x.qty, 0));
  let mode: ShipQuote['mode'] = 'std', cost = CITY_DL(st.city || 'الرياض', city),
    label = 'شحن سريع عبر شركاء ضمين (OTO/Torod)', fragile = false, blocked: string | null = null;
  if (ptypes.every(t => t === 'digital')) { mode = 'digital'; cost = 0; label = 'تسليم رقمي فوري — ٠ ر.س شحن'; }
  else if (ptypes.every(t => t === 'field')) { mode = 'field'; cost = 0; label = 'توصيل وتركيب فريق المتجر'; }
  else if (ptypes.includes('instant')) {
    if ((st.city || 'الرياض') !== city) { mode = 'instant'; cost = 0; label = 'توصيل فوري محلي'; blocked = 'خارج نطاق التوصيل الفوري — «' + st.name + '» يوصل داخل مدينة ' + st.city + ' فقط (نطاق ' + (st.rangeKm || 20) + ' كم) حفاظاً على حرارة الوجبة'; }
    else { mode = 'instant'; cost = 10; label = 'مندوب فوري — ٤٥ دقيقة تقريباً داخل ' + city; }
  } else if (ptypes.includes('chilled')) {
    mode = 'chilled'; const same = (st.city || 'الرياض') === city; cost = r2(cost + 8);
    label = same ? 'توصيل مبرد بمندوب مجهز بحافظة برودة (Cooling Box) داخل المدينة' : 'شحن مبرد بين المدن عبر شركات مبردة متعاقدة (OTO/Torod)';
  }
  if (mode === 'std' && items.some(x => x.p.fragile)) { fragile = true; cost = r2(cost + 15); label = 'شحن سريع + قابل للكسر (تغليف خاص ورسوم حماية ١٥ ر.س)'; }
  let charge = cost, subsidy = 0, source = 'customer', why = '';
  if (mode === 'field' || mode === 'digital') { charge = 0; subsidy = cost; source = 'merchant'; why = mode === 'field' ? 'خدمة ميدانية بفريق المتجر' : 'تسليم رقمي فوري'; }
  else if (st.dlMode === 'free') { charge = 0; subsidy = cost; source = 'merchant'; why = 'توصيل مجاني من المتجر'; }
  else if ((st.freeMin || 0) > 0 && gsub >= st.freeMin) { charge = 0; subsidy = cost; source = 'merchant'; why = 'تخطيت سقف الشحن المجاني'; }
  else if (st.dlMode === 'half') { charge = r2(cost / 2); subsidy = r2(cost / 2); source = 'merchant'; why = 'مناصفة مع المتجر'; }
  if (fd && mode !== 'field' && mode !== 'digital' && charge > 0) { charge = 0; subsidy = cost; source = 'pts'; why = 'استبدال نقاط الولاء'; }
  return { mode, cost, charge, subsidy, source, why, label, fragile, blocked };
}

/* ============ حاسبة السلة ============ */
export interface CartGroup { sid: string; items: { p: Product; qty: number; ans?: { q: string; a: string }[] }[]; sub: number; quote: ShipQuote; }

export function cartCalc(
  lines: CartLine[], products: Product[], stores: Store[], city: string,
  couponCode: string | null, coupons: Record<string, Coupon>,
  ptsSel: number, freeDl: boolean, user: User | null, ptsVal: number, fdPts: number,
) {
  const items = lines.map(c => ({ ...c, p: products.find(x => x.id === c.pid)! })).filter(c => c.p);
  const groups: Record<string, CartGroup> = {};
  items.forEach(c => { (groups[c.p.store] = groups[c.p.store] || { sid: c.p.store, items: [], sub: 0, quote: null as unknown as ShipQuote }).items.push(c); });
  const fd = freeDl && !!user && (user.pts || 0) >= fdPts;
  const quotes: Record<string, ShipQuote> = {};
  let dlCharge = 0, dlCost = 0;
  Object.entries(groups).forEach(([sid, its]) => {
    const st = stores.find(s => s.id === sid);
    if (!st) return;
    const q = shipQuote(its.items, st, city, fd);
    quotes[sid] = q; its.quote = q; its.sub = r2(its.items.reduce((a, x) => a + eff(x.p) * x.qty, 0));
    dlCharge += q.charge; dlCost += q.cost;
  });
  dlCharge = r2(dlCharge); dlCost = r2(dlCost);
  const sub = r2(items.reduce((a, c) => a + eff(c.p) * c.qty, 0));
  let cpn = 0, cpnBad = '';
  if (couponCode && coupons[couponCode]) {
    const cc = coupons[couponCode];
    const csub = cc.store === 'all' ? sub : Object.entries(groups).reduce((a, [sid, its]) => sid === cc.store ? a + r2(its.items.reduce((x, y) => x + eff(y.p) * y.qty, 0)) : a, 0);
    if (cc.store !== 'all' && !Object.keys(groups).includes(cc.store)) cpnBad = 'كوبون «' + couponCode + '» خاص بمتجر «' + (stores.find(s => s.id === cc.store)?.name || '') + '» وليس ضمن سلتك';
    else if (sub < (cc.min || 0)) cpnBad = 'كوبون «' + couponCode + '» يشترط طلباً بقيمة ' + cc.min + ' ر.س على الأقل';
    else if (cc.maxUses && (cc.uses || 0) >= cc.maxUses) cpnBad = 'كوبون «' + couponCode + '» استُنفد (' + cc.maxUses + ' استخدام)';
    else cpn = r2(Math.min(cc.type === 'pct' ? csub * cc.v / 100 : cc.v, cc.max || csub, csub));
  }
  const avail = user ? Math.max(0, (user.pts || 0) - (fd ? fdPts : 0)) : 0;
  const ptsMax = user ? Math.floor(avail / 100) * 100 : 0;
  let ptsUse = Math.min(ptsSel, ptsMax, Math.floor(Math.max(sub - cpn, 0) / (ptsVal * 100)) * 100);
  ptsUse = Math.max(0, Math.floor(ptsUse / 100) * 100);
  const ptsAmt = r2(ptsUse * ptsVal);
  const net = r2(Math.max(0, sub + dlCharge - cpn - ptsAmt));
  const tax = r2(net * 0.15);
  const total = r2(net + tax);
  return { groups, quotes, sub, cpn, cpnBad, ptsMax, ptsUse, ptsAmt, fd, fdN: fdPts, dlCost, dlCharge, net, tax, total, city };
}

export const routeKey = (r: Route) => r.name + ('id' in r ? r.id : '') + ('q' in r ? r.q : '') + ('tab' in r ? r.tab : '');

/* ============ بناء طلبات البذور ============ */
const NOW = Date.now();
function seedGroup(g: import('./data').SeedGroup, atMin: number): OrderGroup {
  const st = STORES0.find(s => s.id === g.store)!;
  const win = worldOf(g.store);
  const received = ['received', 'released', 'refunded', 'disputed'].includes(g.status);
  const grp: OrderGroup = {
    store: g.store,
    items: g.items.map(i => ({ pid: i.pid, qty: i.qty, price: eff(PRODUCTS0.find(p => p.id === i.pid)!) })),
    sub: g.sub, dl: g.dl || 0, extra: g.extra || 0,
    status: g.status, digi: !!g.digi, custom: !!g.custom,
    gift: g.gift || null, booking: g.booking || null,
    ship: g.ship ? { ...g.ship, mode: g.ship.mode as ShipQuote['mode'], blocked: g.ship.blocked ?? null } : null,
    logi: g.ship && g.ship.mode === 'digital'
      ? { wb: null, courier: 'تسليم رقمي فوري (ضمين ديجيتال)', mode: 'digital', events: [{ t: 'سُلّم المحتوى الرقمي فور الدفع إلى مكتبة العميل — عبر رابط مؤقت موقّع (S3 Signed URL)', at: NOW - atMin * 60000 }] }
      : g.ship && g.ship.mode === 'field'
        ? { wb: null, courier: g.booking?.dl === 'pickup' ? 'استلام من مقر المتجر — بلا توصيل' : 'توصيل وتركيب فريق المتجر', mode: 'field', events: [{ t: g.booking?.dl === 'pickup' ? 'استلام من المقر — بلا بوليصة شحن، والتنسيق عبر دردشة ضمين بعد الدفع' : 'خدمة ميدانية — بلا بوليصة آلية، الحجز بموعد المناسبة', at: NOW - atMin * 60000 }] }
        : mkLogi(g.ship?.mode || 'std', g.store + g.sub),
    chat: [{ r: 'sys', t: 'فُتحت محادثة الطلب — للتفاصيل والطلبات الخاصة فقط. ممنوع تبادل الأرقام أو الروابط أو أي وسيلة تواصل خارج ضمين (الإدارة تُتابع تلقائياً وحجب المخالف فوري).', at: NOW - atMin * 60000 }],
    viol: { customer: 0, merchant: 0 },
    payout: g.payout ? { ...g.payout } : undefined,
    rated: g.rated ? { stars: g.rated.stars, txt: '' } : undefined,
    complaintUntil: received && g.status !== 'released' && g.status !== 'refunded' ? NOW + win.winMin * 60000 : undefined,
    otp: undefined, otpBad: 0, otpOk: undefined,
  };
  if (received) grp.chatArchived = true;
  return grp;
}

function buildOrder(s: import('./data').SeedOrder): Order {
  const at = NOW - s.atMin * 60000;
  const sub = r2(s.groups.reduce((a, g) => a + g.sub + (g.extra || 0), 0));
  const dl = r2(s.groups.reduce((a, g) => a + (g.dl || 0), 0));
  const net = s.net ?? r2(sub + dl);
  const tax = s.tax ?? r2(net * 0.15);
  return {
    id: s.id, customer: s.customer, at, pay: s.pay, addr: s.addr, city: s.city || 'الرياض',
    coupon: s.coupon || null, ptsUsed: s.ptsUsed || 0, ptsAmt: s.ptsAmt || 0, freeDl: !!s.freeDl,
    net, tax, total: s.total ?? r2(net + tax),
    groups: s.groups.map(g => seedGroup(g, s.atMin)),
  };
}

/* ============ المخزن ============ */
interface DameenState {
  session: Session | null;
  route: Route;
  cart: CartLine[];
  favorites: string[];
  orders: Order[];
  disputes: Dispute[];
  notifs: Notif[];
  requests: RegRequest[];
  stores: Store[];
  products: Product[];
  worlds: World[];
  users: Record<string, User>;
  cats: Record<string, { n: string; comm: number }[]>;
  coupons: Record<string, Coupon>;
  storeWallets: Record<string, number>;
  ptsFunding: { store: string; pname: string; pts: number; amt: number; at: number }[];
  aRevenue: number; vat: number; logiWallet: number; aPtsWallet: number;
  ptsVal: number; freeDlPts: number;
  revMonths: { m: string; v: number }[];
  oidNext: number;
  ui: { authOpen: boolean; authTab: 'login' | 'reg' | 'store'; cartOpen: boolean; };
  cartSel: { coupon: string | null; pts: number; freeDl: boolean; city: string };

  go: (r: Route) => void;
  openAuth: (tab?: 'login' | 'reg' | 'store') => void;
  closeAuth: () => void;
  setCartOpen: (v: boolean) => void;
  setCartSel: (p: Partial<{ coupon: string | null; pts: number; freeDl: boolean; city: string }>) => void;
  login: (id: string, pw: string) => boolean;
  loginAs: (phone: string) => void;
  logout: () => void;
  register: (name: string, phone: string, city: string) => void;
  registerStoreReq: (d: { own: string; store: string; sec: string; phone: string; email: string; cr: string; iban: string }) => void;

  addToCart: (pid: string, qty?: number, ans?: { q: string; a: string }[]) => boolean;
  setQty: (pid: string, qty: number) => void;
  removeLine: (pid: string) => void;
  toggleFav: (pid: string) => void;

  placeOrder: (d: { addr: string; city: string; pay: string; book: Record<string, { dl: string; date: string; setup: string; tear: string; note: string; geo: { lat: number; lng: number } | null }>; gift: Record<string, { on: boolean; name: string; phone: string; city: string }>; ans: Record<string, string[]> }) => { id: number; chatG: number; wb: number } | null;

  acceptOrder: (oid: number, gi: number) => void;
  shipOrder: (oid: number, gi: number) => void;
  confirmReceive: (oid: number, gi: number) => void;
  rateOrder: (oid: number, gi: number, stars: number, txt: string) => void;
  doRelease: (oid: number, gi: number, by: string, bonus?: boolean) => void;
  doRefund: (oid: number, gi: number, by: string) => void;
  tick: () => void;

  openDispute: (oid: number, gi: number, reason: string, desc: string, want?: string, got?: string) => void;
  ruleDispute: (did: string, act: 'refund' | 'release', text: string) => void;
  pushDispMsg: (did: string, r: 'customer' | 'merchant', t: string) => boolean;

  sendMsg: (oid: number, gi: number, r: 'customer' | 'merchant', t: string) => boolean;
  sendMyLoc: (oid: number, gi: number, geo: { lat: number; lng: number } | null, txt: string) => void;
  askExtra: (oid: number, gi: number, amt: number, note: string) => void;
  payExtra: (oid: number, gi: number, mi: number) => void;
  sendOTP: (oid: number, gi: number) => void;
  checkOTP: (oid: number, gi: number, code: string) => boolean;

  rateProduct: (pid: string, stars: number, txt: string) => void;

  approveReq: (id: string) => void;
  rejectReq: (id: string, reason: string) => void;
  toggleSuspend: (sid: string) => void;
  saveStore: (d: { name: string; desc: string }) => void;
  saveStoreLoc: (city: string, area: string) => void;
  saveStoreShip: (d: { dlMode: 'customer' | 'half' | 'free'; freeMin: number; rangeKm?: number }) => void;
  addStoreQ: (q: string) => void;
  delStoreQ: (i: number) => void;
  saveProduct: (d: {
    id?: string; name: string; cat: string; price: number; off: number; stock: number; pts: number;
    ptype: string; fragile: boolean; giftOk: boolean; customOk: boolean;
    digi: { kind: 'code' | 'file'; val: string; size: string } | null; ipOK: boolean;
    desc: string; specs: Record<string, string>; qs: { t: 'opts' | 'txt'; q: string; o: string[] }[]; img?: string;
  }) => boolean;
  setOffer: (pid: string, off: number) => void;
  delProduct: (pid: string) => void;
  addCoupon: (code: string, c: Omit<Coupon, 'uses'>) => boolean;
  delCoupon: (code: string) => void;
  saveCat: (sec: string, i: number, n: string, comm: number) => boolean;
  addCat: (sec: string, n: string, comm: number) => boolean;
  delCat: (sec: string, i: number) => void;
  saveWorld: (id: string, name: string, desc: string) => void;
  setPtsVal: (v: number) => void;
  setFreeDlPts: (v: number) => void;
  markNotifsRead: () => void;
}

const mkNotif = (to: string, ic: string, t: string, b: string, go: string[] = []): Notif =>
  ({ id: 'n' + Math.random().toString(36).slice(2, 9), to, ic, t, b, at: Date.now(), read: false, go });

export const useDameen = create<DameenState>()(
  persist(
    (set, get) => ({
      session: null,
      route: { name: 'home' },
      cart: [],
      favorites: (USERS0['0500000001']?.favs) || [],
      orders: SEED_ORDERS.map(buildOrder),
      disputes: SEED_DISPUTES.map(d => ({ ...d, messages: d.messages.map(m => ({ ...m })) })),
      notifs: SEED_NOTIFS.map(n => ({ ...n, id: 'seed-' + n.ic + n.at, go: n.go || [] })),
      requests: REQUESTS,
      stores: STORES0,
      products: PRODUCTS0,
      worlds: WORLDS0,
      users: USERS0,
      cats: CATS0,
      coupons: COUPONS0,
      storeWallets: STORE_WALLETS,
      ptsFunding: PTS_FUNDING,
      aRevenue: 12840.5, vat: 527.4, logiWallet: 418.6, aPtsWallet: 0,
      ptsVal: 0.1, freeDlPts: 250,
      revMonths: REV_MONTHS,
      oidNext: 1025,
      ui: { authOpen: false, authTab: 'login', cartOpen: false },
      cartSel: { coupon: null, pts: 0, freeDl: false, city: 'الرياض' },

      go: r => { set({ route: r }); window.scrollTo({ top: 0 }); },
      openAuth: tab => set(s => ({ ui: { ...s.ui, authOpen: true, authTab: tab || s.ui.authTab } })),
      closeAuth: () => set(s => ({ ui: { ...s.ui, authOpen: false } })),
      setCartOpen: v => set(s => ({ ui: { ...s.ui, cartOpen: v } })),
      setCartSel: p => set(s => ({ cartSel: { ...s.cartSel, ...p } })),

      login: (id, pw) => {
        const k = id.trim();
        const u = get().users[k] || Object.values(get().users).find(x => x.email && x.email === k);
        if (!u) { toast.error('لا يوجد حساب بهذا المعرّف — جرّب حسابات التجربة بالأسفل'); return false; }
        if (pw !== '1234') { toast.error('كلمة المرور غير صحيحة'); return false; }
        set(s => ({
          session: { phone: u.phone, name: u.name, role: u.role, store: u.store },
          ui: { ...s.ui, authOpen: false },
          cartSel: { ...s.cartSel, city: (u.addrs.find(a => a.def) || u.addrs[0])?.a.split('،')[0]?.trim() || s.cartSel.city },
          route: u.role === 'merchant' ? { name: 'merchant', tab: 'overview' } : u.role === 'admin' ? { name: 'admin', tab: 'overview' } : { name: 'home' },
        }));
        toast.success('أهلاً بك ' + u.name + ' 👋');
        return true;
      },
      loginAs: phone => { get().login(phone, '1234'); },
      logout: () => { set({ session: null, route: { name: 'home' } }); toast('تم تسجيل الخروج — تجوّل بحرية 👋'); },
      register: (name, phone, city) => {
        if (!name.trim() || phone.trim().length < 9 || !city) { toast.error('أكمل بيانات الحساب أولاً'); return; }
        const ph = phone.trim();
        set(s => ({
          users: { ...s.users, [ph]: { phone: ph, name: name.trim(), role: 'customer', store: null, pts: 0, bal: 0, email: '', addrs: [], favs: [], dlib: [], ptsLog: [] } },
          session: { phone: ph, name: name.trim(), role: 'customer', store: null },
          ui: { ...s.ui, authOpen: false },
          cartSel: { ...s.cartSel, city },
          route: { name: 'home' },
        }));
        toast.success('أهلاً بك في ضمين يا ' + name.trim() + ' 🎉');
      },
      registerStoreReq: d => {
        set(s => ({
          requests: [{ id: 'rq-' + (s.requests.length + 100), kind: 'store', own: d.own, store: d.store, email: d.email, phone: d.phone, cr: d.cr, sec: d.sec, iban: d.iban, code: '', role: '', status: 'pending', at: Date.now() }, ...s.requests],
          ui: { ...s.ui, authOpen: false },
        }));
        toast.success('وصل طلب متجرك للإدارة — سنبّهك عند البتّ فيه 📋');
      },

      addToCart: (pid, qty = 1, ans) => {
        const p = get().products.find(x => x.id === pid);
        if (!p) return false;
        if (!p.stock) { toast.error('نفدت الكمية حالياً'); return false; }
        set(s => {
          const ex = s.cart.find(l => l.pid === pid);
          return {
            cart: ex ? s.cart.map(l => (l.pid === pid ? { ...l, qty: Math.min(l.qty + qty, p.stock), ans: ans && ans.length ? ans : l.ans } : l)) : [...s.cart, { pid, qty: Math.min(qty, p.stock), ans }],
            ui: { ...s.ui, cartOpen: true },
          };
        });
        toast.success('أُضيف «' + p.name + '» إلى سلتك 🛒');
        return true;
      },
      setQty: (pid, qty) => set(s => ({ cart: qty <= 0 ? s.cart.filter(l => l.pid !== pid) : s.cart.map(l => (l.pid === pid ? { ...l, qty } : l)) })),
      removeLine: pid => set(s => ({ cart: s.cart.filter(l => l.pid !== pid) })),
      toggleFav: pid => set(s => ({ favorites: s.favorites.includes(pid) ? s.favorites.filter(f => f !== pid) : [...s.favorites, pid] })),

      placeOrder: d => {
        const st = get();
        const u = st.session ? st.users[st.session.phone] : null;
        if (!u || !st.session) { get().openAuth('login'); return null; }
        if (st.cart.length === 0) return null;
        const c = cartCalc(st.cart, st.products, st.stores, d.city, st.cartSel.coupon, st.coupons, st.cartSel.pts, st.cartSel.freeDl, u, st.ptsVal, st.freeDlPts);
        for (const [sid] of Object.entries(c.groups)) {
          const q = c.quotes[sid];
          if (q.blocked) { toast.error(q.blocked); return null; }
          if (q.mode === 'field') { const b = d.book[sid]; if (!b || !b.date || !b.setup) { toast.error('أكمل حجز موعد المناسبة (التاريخ ووقت التركيب) لشحنة ' + st.stores.find(s => s.id === sid)!.name); return null; } }
          const gft = d.gift[sid];
          if (gft && gft.on && (!/^05\d{8}$/.test((gft.phone || '').replace(/\s/g, '')) || !(gft.city || '').trim())) { toast.error('أكمل بيانات الإهداء — جوال مستلم يبدأ بـ 05 + مدينته'); return null; }
        }
        if (d.pay === 'bal' && (u.bal || 0) < c.total) { toast.error('رصيد المحفظة لا يكفي — اختر طريقة أخرى'); return null; }
        const now = Date.now();
        const id = st.oidNext;
        let wb = 0;
        const groups: OrderGroup[] = Object.entries(c.groups).map(([sid, its]) => {
          const store = st.stores.find(s => s.id === sid)!;
          const q = c.quotes[sid];
          const bk = d.book[sid];
          const pans: { pn: string; ans: { q: string; a: string }[] }[] = [];
          its.items.forEach(x => { if (x.ans && x.ans.length) pans.push({ pn: x.p.name, ans: x.ans }); });
          const grp: OrderGroup = {
            store: sid,
            items: its.items.map(x => ({ pid: x.p.id, qty: x.qty, price: eff(x.p) })),
            sub: its.sub, dl: q.charge, extra: 0,
            status: 'pending', digi: false, custom: its.items.some(x => x.p.customOk),
            gift: d.gift[sid]?.on ? { name: (d.gift[sid].name || '').trim(), phone: (d.gift[sid].phone || '').trim(), city: (d.gift[sid].city || '').trim() } : null,
            booking: q.mode === 'field' && bk ? bk : null,
            ship: q,
            logi: q.mode === 'field'
              ? { wb: null, courier: bk?.dl === 'pickup' ? 'استلام من مقر المتجر — بلا توصيل' : 'توصيل وتركيب فريق المتجر', mode: 'field', events: [{ t: bk?.dl === 'pickup' ? 'استلام من المقر — بلا بوليصة شحن، والتنسيق عبر دردشة ضمين بعد الدفع' : 'خدمة ميدانية — بلا بوليصة آلية، الحجز بموعد المناسبة', at: now }] }
              : q.mode === 'digital'
                ? { wb: null, courier: 'تسليم رقمي فوري (ضمين ديجيتال)', mode: 'digital', events: [{ t: 'سُلّم المحتوى الرقمي فور الدفع إلى مكتبة العميل — عبر رابط مؤقت موقّع (S3 Signed URL)', at: now }] }
                : mkLogi(q.mode, sid + id),
            chat: [{ r: 'sys', t: 'فُتحت محادثة الطلب — للتفاصيل والطلبات الخاصة فقط. ممنوع تبادل الأرقام أو الروابط أو أي وسيلة تواصل خارج ضمين (الإدارة تُتابع تلقائياً وحجب المخالف فوري).', at: now }],
            viol: { customer: 0, merchant: 0 },
            ans: store.qs?.length ? store.qs.map((qq, i) => ({ q: qq, a: (d.ans[sid] || [])[i] || '' })).filter(x => x.a) : undefined,
            pans: pans.length ? pans : undefined,
          };
          if (q.fragile && grp.logi) grp.logi.events.unshift({ t: '⚠️ علامة «قابل للكسر» نُقلت آلياً لشركة الشحن (' + grp.logi.courier + ') — تغليف خاص إلزامي في البوليصة + رسوم حماية ١٥ ر.س ضمن الشحن', at: now });
          if (q.mode === 'digital') {
            grp.status = 'received'; grp.digi = true; grp.complaintUntil = now + worldOf(sid).winMin * 60000;
            grp.chat.push({ r: 'sys', t: '⚡ سُلّم المحتوى الرقمي فوراً — الكود/الملف في «مكتبتك الرقمية»، ومبلغك محجوز بضمان ضمين حتى نهاية نافذة الحماية.', at: now });
          }
          if (grp.custom) grp.chat.push({ r: 'sys', t: '✏️ دردشة التعديلات مفتوحة — حدد طلبك بدقة، ويقدر التاجر يطلب مبلغاً إضافياً لأي تعديل يتفقان عليه (يُحجز بضمان ضمين حتى الاستلام).', at: now });
          if (q.mode !== 'field' && q.mode !== 'digital') wb++;
          return grp;
        });
        const order: Order = {
          id, customer: u.phone, at: now, pay: d.pay, addr: d.addr, city: d.city,
          coupon: c.cpn ? { code: st.cartSel.coupon, amt: c.cpn } : null,
          ptsUsed: c.ptsUse, ptsAmt: c.ptsAmt, freeDl: c.fd,
          net: c.net, tax: c.tax, total: c.total,
          paidBy: d.pay === 'bal' ? 'محفظة ضمين' : undefined,
          inst: d.pay === 'tabby' ? { by: 'تابي', n: 4, each: r2(c.total / 4) } : d.pay === 'tamara' ? { by: 'تمارا', n: 3, each: r2(c.total / 3) } : undefined,
          groups,
        };
        let chatG = -1;
        groups.forEach((g, gi) => { if (chatG < 0 && (g.custom || (g.ship && g.ship.mode === 'field'))) chatG = gi; });
        set(s => {
          const users2 = { ...s.users };
          const me2 = { ...users2[u.phone] };
          if (d.pay === 'bal') me2.bal = r2((me2.bal || 0) - c.total);
          if (c.ptsUse) { me2.pts = (me2.pts || 0) - c.ptsUse; me2.ptsLog = [{ t: 'استبدال نقاط في الطلب #' + id, v: -c.ptsUse, at: now }, ...me2.ptsLog]; }
          if (c.fd) { me2.pts = (me2.pts || 0) - c.fdN; me2.ptsLog = [{ t: 'استبدال نقاط بتوصيل مجاني في الطلب #' + id, v: -c.fdN, at: now }, ...me2.ptsLog]; }
          const dlibAdd = groups.flatMap(g => g.items.filter(it => it.pid && (s.products.find(p => p.id === it.pid)?.digi)).map(it => {
            const p2 = s.products.find(p => p.id === it.pid)!;
            return { pid: it.pid, name: p2.name, store: g.store, kind: (p2.digi?.kind || 'code') as 'code' | 'file', val: p2.digi?.val || '', size: p2.digi?.size || '', at: now, oid: id };
          }));
          me2.dlib = [...dlibAdd, ...me2.dlib];
          users2[u.phone] = me2;
          const coupons2 = { ...s.coupons };
          if (st.cartSel.coupon && coupons2[st.cartSel.coupon]) coupons2[st.cartSel.coupon] = { ...coupons2[st.cartSel.coupon], uses: (coupons2[st.cartSel.coupon].uses || 0) + 1 };
          const notifs2 = [...groups.map(g => {
            const own = s.stores.find(x => x.id === g.store)?.owner;
            return own ? mkNotif(own, g.digi ? '⚡' : '📦', 'طلب جديد' + (g.digi ? ' رقمي — سُلّم فوراً للعميل' : ' بانتظار قبولك'), 'عميل جديد أرسل طلباً بقيمة ' + r2(g.sub) + ' ر.س', ['m-orders']) : null;
          }).filter(Boolean) as Notif[], ...s.notifs].slice(0, 40);
          notifs2.unshift(mkNotif(u.phone, '🔒', 'تم حجز مبلغ طلبك', 'مبلغ ' + r2(c.total) + ' ر.س محجوز بأمان في خزنة ضمين', ['orders']));
          if (dlibAdd.length) notifs2.unshift(mkNotif(u.phone, '⚡', 'مشترياتك الرقمية جاهزة', 'الكود/الملف في «مكتبتك الرقمية» — تسليم فوري بضمان ضمين', ['dlib']));
          if (chatG >= 0) notifs2.unshift(mkNotif(u.phone, '💬', 'فُتحت دردشة مع ' + s.stores.find(x => x.id === groups[chatG].store)?.name, 'شارك تفاصيلك وموقعك عبر الدردشة — التواصل داخل ضمين فقط', ['orders']));
          return {
            orders: [order, ...s.orders], cart: [], oidNext: id + 1,
            users: users2, coupons: coupons2, notifs: notifs2,
            vat: r2(s.vat + c.tax),
            cartSel: { coupon: null, pts: 0, freeDl: false, city: s.cartSel.city },
          };
        });
        return { id, chatG, wb };
      },

      acceptOrder: (oid, gi) => {
        set(s => ({ orders: s.orders.map(o => o.id !== oid ? o : { ...o, groups: o.groups.map((g, i) => i === gi ? { ...g, status: 'preparing' } : g) }) }));
        toast.success('قُبل الطلب — انطلق في التحضير 🧵');
      },
      shipOrder: (oid, gi) => {
        const o = get().orders.find(x => x.id === oid);
        const g = o?.groups[gi];
        if (!o || !g) return;
        const now = Date.now();
        set(s => ({
          orders: s.orders.map(x => x.id !== oid ? x : { ...x, groups: x.groups.map((gg, i) => i === gi ? { ...gg, status: 'shipped', logi: gg.logi ? { ...gg.logi, events: [...gg.logi.events, { t: 'شحن الطلب — تحديث حالة تلقائي عبر Webhook من ' + gg.logi.courier, at: now }] } : gg.logi } : gg) }),
          notifs: [mkNotif(o.customer, '🚚', 'طلبك في الطريق', 'بوليصة شحن آلية صدرت للطلب #' + oid + (g.logi?.wb ? ' — ' + g.logi.wb : ''), ['orders']), ...s.notifs].slice(0, 40),
        }));
        toast.success('أُصدرت بوليصة الشحن وأُبلغ العميل 🚚');
      },
      confirmReceive: (oid, gi) => {
        const o = get().orders.find(x => x.id === oid);
        const g = o?.groups[gi];
        if (!o || !g) return;
        const now = Date.now();
        const win = worldOf(g.store);
        set(s => ({
          orders: s.orders.map(x => x.id !== oid ? x : {
            ...x, groups: x.groups.map((gg, i) => i === gi ? {
              ...gg, status: 'received', receivedAt: now, complaintUntil: now + win.winMin * 60000,
              chatArchived: true,
              chat: [...gg.chat, { r: 'sys', t: '🗄️ أُرشفت المحادثة فور تسليم الشحنة — للاعتراض على الشحنة افتح نزاعاً خلال نافذة الحماية.', at: now }],
              logi: gg.logi ? { ...gg.logi, events: [...gg.logi.events, { t: 'أكّد العميل التسليم — تحديث حالة تلقائي عبر Webhook', at: now }] } : gg.logi,
            } : gg),
          }),
          notifs: [
            mkNotif(o.customer, '🛡️', 'بدأت نافذة الحماية', 'افحص طلبك #' + oid + ' — لديك ' + win.win + ' قبل التحرير التلقائي', ['orders']),
            mkNotif(s.stores.find(x => x.id === g.store)?.owner || '', '📦', 'أكّد العميل الاستلام', 'بدأت نافذة حماية طلب #' + oid + ' — يُحرر المبلغ تلقائياً بانتهائها', ['m-orders']),
            ...s.notifs,
          ].slice(0, 40),
        }));
        toast.success('بدأت نافذة الفحص — ' + win.win + ' 🛡️');
      },

      doRelease: (oid, gi, by, bonus = false) => {
        const st = get();
        const o = st.orders.find(x => x.id === oid);
        const g = o?.groups[gi];
        if (!o || !g || g.status !== 'received') return;
        const now = Date.now();
        const comm = r2(g.items.reduce((a, it) => {
          const pd = st.products.find(p => p.id === it.pid);
          const store2 = st.stores.find(x => x.id === g.store);
          return a + it.price * it.qty * (pd && store2 ? (st.cats[store2.sec].find(c => c.n === pd.cat)?.comm ?? 2.5) : 2.5) / 100;
        }, 0));
        const sh = g.ship || { mode: 'std', cost: g.dl, charge: g.dl, subsidy: 0, source: 'customer', why: '', label: '', fragile: false, blocked: null };
        const mShip = sh.source === 'merchant' ? r2(sh.subsidy || 0) : 0;
        const ptsShip = sh.source === 'pts' ? r2(sh.cost || 0) : 0;
        let net = r2(g.sub - comm - mShip); if (net < 0) net = 0;
        const giftPts = g.items.reduce((a, it) => a + ((st.products.find(p => p.id === it.pid)?.pts || 0) * it.qty), 0);
        const pts = Math.floor(net / 10) + (bonus ? 10 : 0);
        set(s => {
          const users2 = { ...s.users };
          const cu = { ...users2[o.customer] };
          cu.pts = (cu.pts || 0) + pts + giftPts;
          cu.ptsLog = [
            { t: 'تحرير طلب #' + oid + (bonus ? ' + مكافأة تقييم' : ''), v: pts, at: now },
            ...(giftPts ? [{ t: 'نقاط هدية على منتجات الطلب #' + oid, v: giftPts, at: now }] : []),
            ...cu.ptsLog,
          ].slice(0, 40);
          users2[o.customer] = cu;
          const rm = [...s.revMonths];
          rm[rm.length - 1] = { ...rm[rm.length - 1], v: r2(rm[rm.length - 1].v + comm) };
          return {
            orders: s.orders.map(x => x.id !== oid ? x : { ...x, groups: x.groups.map((gg, i) => i === gi ? { ...gg, status: 'released', payout: { sub: gg.sub, comm, net, ship: { charge: sh.charge || 0, merchant: mShip, pts: ptsShip } } } : gg) }),
            users: users2,
            aRevenue: r2(s.aRevenue + comm),
            revMonths: rm,
            logiWallet: r2(s.logiWallet + (sh.charge || 0) + mShip + ptsShip),
            aPtsWallet: ptsShip ? r2(s.aPtsWallet - ptsShip) : s.aPtsWallet,
            storeWallets: { ...s.storeWallets, [g.store]: r2((s.storeWallets[g.store] || 0) + net) },
            notifs: [
              mkNotif(o.customer, '🔓', 'تم تحرير مبلغ طلبك', 'صافي ' + net + ' ر.س حُوِّل إلى ' + (s.stores.find(x => x.id === g.store)?.name || '') + ' — كسبت ' + pts + ' نقطة ولاء', ['orders']),
              mkNotif(s.stores.find(x => x.id === g.store)?.owner || '', '💰', 'تحرير دفعة جديدة', 'استلمت ' + net + ' ر.س صافي الطلب #' + oid + ' (عمولة ضمين ' + comm + (mShip ? ' + دعمك للشحن ' + mShip : '') + ')', ['m-wallet']),
              ...s.notifs,
            ].slice(0, 40),
          };
        });
      },
      doRefund: (oid, gi, by) => {
        const st = get();
        const o = st.orders.find(x => x.id === oid);
        const g = o?.groups[gi];
        if (!o || !g) return;
        const now = Date.now();
        const back = r2(g.sub + ((g.ship && g.ship.charge) || g.dl || 0) + (g.extra || 0));
        set(s => {
          const users2 = { ...s.users };
          const cu = { ...users2[o.customer] };
          cu.bal = r2((cu.bal || 0) + back);
          users2[o.customer] = cu;
          return {
            orders: s.orders.map(x => x.id !== oid ? x : { ...x, groups: x.groups.map((gg, i) => i === gi ? { ...gg, status: 'refunded' } : gg) }),
            users: users2,
            notifs: [
              mkNotif(o.customer, '💸', 'استُرجع مبلغ طلبك', 'أُعيد ' + back + ' ر.س إلى محفظة ضمين الخاصة بك (المنتجات + الشحن)', ['account']),
              mkNotif(s.stores.find(x => x.id === g.store)?.owner || '', '↩️', 'استرجاع مبلغ شحنة', 'حكم التحكيم لطلب #' + oid + ': استرجاع كامل المبلغ للعميل', ['m-disputes']),
              ...s.notifs,
            ].slice(0, 40),
          };
        });
      },
      rateOrder: (oid, gi, stars, txt) => {
        set(s => ({ orders: s.orders.map(o => o.id !== oid ? o : { ...o, groups: o.groups.map((g, i) => i === gi ? { ...g, rated: { stars, txt } } : g) }) }));
        get().doRelease(oid, gi, 'تقييم العميل', true);
        toast.success('شكراً! حُرر المبلغ للتاجر وكسبت نقاطك ⭐');
      },
      tick: () => {
        const st = get();
        const now = Date.now();
        const due: { oid: number; gi: number }[] = [];
        st.orders.forEach(o => o.groups.forEach((g, gi) => {
          if (g.status === 'received' && g.complaintUntil && now >= g.complaintUntil) due.push({ oid: o.id, gi });
        }));
        if (due.length) due.forEach(({ oid, gi }) => get().doRelease(oid, gi, 'انتهاء نافذة الحماية'));
      },

      openDispute: (oid, gi, reason, desc, want, got) => {
        const st = get();
        const o = st.orders.find(x => x.id === oid);
        const g = o?.groups[gi];
        if (!o || !g) return;
        const now = Date.now();
        const txt = want && got ? 'طلبت: ' + want + ' — لكن وصلني: ' + got + '. ' + desc : desc;
        const did = 'd' + Math.random().toString(36).slice(2, 7);
        const dis: Dispute = {
          id: did, order: oid, store: g.store, customer: o.customer, subject: reason,
          status: 'open', openedAt: now, ruling: null,
          messages: [
            { r: 'sys', t: 'فتحت العميلة نزاعاً على الطلب #' + oid + ' (' + (st.stores.find(s => s.id === g.store)?.name || '') + ') بسبب: ' + reason, at: now },
            { r: 'customer', t: txt, at: now + 1000 },
          ],
        };
        set(s => ({
          disputes: [dis, ...s.disputes],
          orders: s.orders.map(x => x.id !== oid ? x : { ...x, groups: x.groups.map((gg, i) => i === gi ? { ...gg, status: 'disputed' } : gg) }),
          notifs: [
            mkNotif('0500000003', '⚖️', 'نزاع جديد', 'الطلب #' + oid + ' يحتاج حكماً: ' + reason, ['a-disputes']),
            mkNotif(s.stores.find(x => x.id === g.store)?.owner || '', '⚖️', 'نزاع مفتوح على طلبك', 'العميل فتح نزاعاً على شحنة في الطلب #' + oid + ' — أضف ردك وأدلتك', ['m-disputes']),
            ...s.notifs,
          ].slice(0, 40),
        }));
        toast('فُتح النزاع — فريق التحكيم معك ⚖️');
      },
      ruleDispute: (did, act, text) => {
        const st = get();
        const d = st.disputes.find(x => x.id === did);
        if (!d) return;
        const now = Date.now();
        const o = st.orders.find(x => x.id === d.order);
        const gi = o ? o.groups.findIndex(g => g.store === d.store) : -1;
        set(s => ({
          disputes: s.disputes.map(x => x.id !== did ? x : {
            ...x, status: 'resolved' as const,
            ruling: { act, text },
            messages: [...x.messages, { r: 'sys' as const, t: 'أصدرت الإدارة حكمها: ' + (act === 'refund' ? 'استرجاع كامل المبلغ للعميل' : 'تحرير المبلغ للتاجر') + '. التسبيب: ' + text, at: now }],
          }),
        }));
        if (o && gi >= 0) {
          if (act === 'refund') get().doRefund(o.id, gi, 'حكم التحكيم');
          else { get().doRelease(o.id, gi, 'حكم التحكيم'); set(s => ({ orders: s.orders.map(x => x.id !== o.id ? x : { ...x, groups: x.groups.map((g, i) => i === gi ? { ...g, status: 'released' } : g) }) })); }
        }
        toast.success(act === 'refund' ? 'صدر الحكم لصالح العميل وأُعيد المبلغ ⚖️' : 'صدر الحكم لصالح التاجر وحُرّر المبلغ ⚖️');
      },
      pushDispMsg: (did, r, t) => {
        const v = chatGuard(t);
        const st = get();
        const d = st.disputes.find(x => x.id === did);
        if (!d) return false;
        if (!v.ok) { toast.error('حُجبت رسالتك (' + v.why + ') — التواصل خارج ضمين ممنوع ⚠️'); return false; }
        set(s => ({
          disputes: s.disputes.map(x => (x.id === did ? { ...x, messages: [...x.messages, { r, t, at: Date.now() }] } : x)),
        }));
        const other = r === 'customer' ? st.stores.find(x => x.id === d.store)?.owner : d.customer;
        if (other) set(s2 => ({ notifs: [mkNotif(other, '💬', 'رسالة جديدة في النزاع ' + d.id, (r === 'customer' ? 'العميلة' : 'التاجر') + ' راسلك في نزاع الطلب #' + d.order, []), ...s2.notifs].slice(0, 40) }));
        return true;
      },

      sendMsg: (oid, gi, r, t) => {
        const st = get();
        const o = st.orders.find(x => x.id === oid);
        const g = o?.groups[gi];
        if (!o || !g) return false;
        if (g.chatDeleted) { toast.error('المحادثة محذوفة نهائياً'); return false; }
        if (g.chatArchived) { toast('أُرشفت المحادثة فور التسليم — للاعتراض افتح نزاعاً خلال نافذة الحماية'); return false; }
        const txt = (t || '').trim();
        if (!txt) { toast.error('اكتب رسالتك أولاً'); return false; }
        const v = chatGuard(txt);
        const now = Date.now();
        if (!v.ok) {
          const n = (g.viol[r] || 0) + 1;
          const sysMsg: ChatMsg = { r: 'sys', t: '🚫 حُجبت رسالة (' + v.why + ') — تحذير ' + n + ' من ٣: التواصل خارج ضمين ممنوع، وأي رقم أو رابط أو وسيلة تواصل تُحجب تلقائياً.', at: now };
          const del = n >= 3;
          set(s => ({
            orders: s.orders.map(x => x.id !== oid ? x : { ...x, groups: x.groups.map((gg, i) => i === gi ? {
              ...gg,
              viol: { ...gg.viol, [r]: n },
              chat: del ? [{ r: 'sys', t: 'حُذفت المحادثة نهائياً — رُصدت ٣ محاولات لمخالفة سياسة التواصل خارج التطبيق. للاعتراض راسل دعم ضمين.', at: now }] : [...gg.chat, sysMsg],
              chatDeleted: del || gg.chatDeleted,
            } : gg) }),
            notifs: [
              mkNotif('0500000003', del ? '⛔' : '🛡️', del ? 'حُذفت محادثة طلب' : 'محاولة تواصل خارج التطبيق', 'رُصدت رسالة محجوبة (' + v.why + ') في محادثة طلب #' + oid + (del ? ' — وتجاوزت ٣ مخالفات فحُذفت' : ''), ['a-over']),
              ...s.notifs,
            ].slice(0, 40),
          }));
          toast.error(del ? 'حُذفت المحادثة بعد ٣ مخالفات ⛔' : 'حُجبت رسالتك (' + v.why + ') — التواصل خارج ضمين ممنوع ⚠️');
          return false;
        }
        set(s => ({ orders: s.orders.map(x => x.id !== oid ? x : { ...x, groups: x.groups.map((gg, i) => i === gi ? { ...gg, chat: [...gg.chat, { r, t: txt, at: now }] } : gg) }) }));
        const other = r === 'customer' ? st.stores.find(x => x.id === g.store)?.owner : o.customer;
        if (other) set(s2 => ({ notifs: [mkNotif(other, '💬', 'رسالة جديدة في طلب #' + oid, (r === 'customer' ? (st.users[o.customer]?.name.split(' ')[0] || 'العميل') : (st.stores.find(x => x.id === g.store)?.name || '')) + ' راسلك بخصوص طلبك', ['orders']), ...s2.notifs].slice(0, 40) }));
        return true;
      },
      sendMyLoc: (oid, gi, geo, txt) => {
        const st = get();
        const o = st.orders.find(x => x.id === oid);
        const g = o?.groups[gi];
        if (!o || !g) return;
        const now = Date.now();
        set(s => ({
          orders: s.orders.map(x => x.id !== oid ? x : { ...x, groups: x.groups.map((gg, i) => i === gi ? { ...gg, chat: [...gg.chat, { r: 'customer', t: '📍 مشاركة موقع', at: now, loc: { geo, txt } }] } : gg) }),
          notifs: [mkNotif(s.stores.find(x => x.id === g.store)?.owner || '', '📍', 'العميل شارك موقعه', 'وصل موقع العميل في محادثة طلب #' + oid + ' — لتوجيه الفريق بدقة', ['m-orders']), ...s.notifs].slice(0, 40),
        }));
        toast.success(geo ? 'شاركت موقعك الحالي مع المتجر ✓' : 'شاركت عنوانك المحفوظ كرسالة موقع');
      },
      askExtra: (oid, gi, amt, note) => {
        const st = get();
        const o = st.orders.find(x => x.id === oid);
        const g = o?.groups[gi];
        if (!o || !g) return;
        const now = Date.now();
        set(s => ({
          orders: s.orders.map(x => x.id !== oid ? x : { ...x, groups: x.groups.map((gg, i) => i === gi ? { ...gg, chat: [...gg.chat, { r: 'merchant', t: '💰 طلب مبلغ إضافي (تعديل)', at: now, payreq: { amt, note, paid: false } }] } : gg) }),
          notifs: [mkNotif(o.customer, '💰', 'طلب التاجر مبلغاً إضافياً', 'قدّم متجر ' + (s.stores.find(x => x.id === g.store)?.name || '') + ' تعديلاً بـ' + amt + ' ر.س على طلبك #' + oid + ' — راجعه في محادثة الطلب', ['orders']), ...s.notifs].slice(0, 40),
        }));
        toast.success('أُرسل طلب الدفع إلى العميل ✓');
      },
      payExtra: (oid, gi, mi) => {
        const st = get();
        const o = st.orders.find(x => x.id === oid);
        const g = o?.groups[gi];
        if (!o || !g) return;
        const m = g.chat[mi];
        if (!m || !m.payreq || m.payreq.paid) return;
        const u = st.session ? st.users[st.session.phone] : null;
        if (!u) return;
        const amt = m.payreq.amt;
        const via = (u.bal || 0) >= amt ? 'محفظة ضمين' : 'بطاقة مدى (Moyasar)';
        const now = Date.now();
        set(s => {
          const users2 = { ...s.users };
          const cu = { ...users2[o.customer] };
          if (via === 'محفظة ضمين') cu.bal = r2((cu.bal || 0) - amt);
          users2[o.customer] = cu;
          return {
            users: users2,
            orders: s.orders.map(x => x.id !== oid ? x : {
              ...x, total: r2(x.total + amt),
              groups: x.groups.map((gg, i) => i === gi ? {
                ...gg, extra: r2((gg.extra || 0) + amt),
                chat: gg.chat.map((mm, j) => j === mi ? { ...mm, payreq: { ...mm.payreq!, paid: true, via } } : mm).concat([{ r: 'sys', t: '💰 حُجز مبلغ التعديل ' + amt + ' ر.س في خزنة ضمين — ضمن الحماية حتى الاستلام.', at: now }]),
              } : gg),
            }),
            notifs: [mkNotif(s.stores.find(x => x.id === g.store)?.owner || '', '💰', 'دفع العميل مبلغ التعديل', 'حُجز ' + amt + ' ر.س إضافية في طلب #' + oid + ' — ضمن حماية ضمين حتى التحرير', ['m-orders']), ...s.notifs].slice(0, 40),
          };
        });
        toast.success('حُجز مبلغ التعديل في الخزنة بضمان ضمين ✓');
      },
      sendOTP: (oid, gi) => {
        const st = get();
        const o = st.orders.find(x => x.id === oid);
        const g = o?.groups[gi];
        if (!o || !g) return;
        const otp = String(Math.floor(1000 + Math.random() * 9000));
        const now = Date.now();
        set(s => ({
          orders: s.orders.map(x => x.id !== oid ? x : { ...x, groups: x.groups.map((gg, i) => i === gi ? { ...gg, otp, chat: [...gg.chat, { r: 'sys', t: '🎯 أرسل فريق التنسيق كود تأكيد إتمام الخدمة — أدخله بعد اكتمال التركيب ليُحرر مستحق المتجر.', at: now }] } : gg) }),
          notifs: [mkNotif(o.customer, '🎯', 'كود تأكيد إتمام الخدمة', 'كودك لطلب #' + oid + ': ' + otp + ' — أدخله في التطبيق بعد اكتمال التركيب في موقع المناسبة', ['orders']), ...s.notifs].slice(0, 40),
        }));
        toast.success('أُرسل كود التأكيد للعميل (محاكاة SMS) ✓');
      },
      checkOTP: (oid, gi, code) => {
        const st = get();
        const o = st.orders.find(x => x.id === oid);
        const g = o?.groups[gi];
        if (!o || !g) return false;
        if (!g.otp) { toast('لم يرسل المتجر كود التأكيد بعد'); return false; }
        const norm = String(code).replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).trim();
        if (norm !== g.otp) {
          set(s => ({ orders: s.orders.map(x => x.id !== oid ? x : { ...x, groups: x.groups.map((gg, i) => i === gi ? { ...gg, otpBad: (gg.otpBad || 0) + 1 } : gg) }) }));
          toast.error('الكود غير صحيح — تأكد منه مع فريق التنسيق');
          return false;
        }
        const now = Date.now();
        set(s => ({
          orders: s.orders.map(x => x.id !== oid ? x : { ...x, groups: x.groups.map((gg, i) => i === gi ? { ...gg, otpOk: true, status: 'received', complaintUntil: now } : gg) }),
        }));
        get().doRelease(oid, gi, 'كود تأكيد العميل (OTP)');
        toast.success('تم تأكيد إتمام الخدمة وحُرر مستحق المتجر 🎯');
        return true;
      },

      rateProduct: (pid, stars, txt) => {
        const st = get();
        if (!st.session) { toast('سجّل دخولك لتقييم المنتج'); get().openAuth('login'); return; }
        set(s => ({
          products: s.products.map(p => {
            if (p.id !== pid) return p;
            const rc = p.rc + 1;
            return { ...p, rc, rt: r2((p.rt * (rc - 1) + stars) / rc), ratings: [...p.ratings, { by: st.session!.phone, name: st.session!.name.split(' ')[0], stars, txt, at: Date.now() }] };
          }),
        }));
        toast.success('شكراً لتقييمك 💚');
      },

      approveReq: id => {
        const st = get();
        const req = st.requests.find(r => r.id === id);
        if (!req) return;
        const now = Date.now();
        set(s => {
          const stores2 = req.kind === 'store' && req.store
            ? [...s.stores, {
                id: 's' + (s.stores.length + 1), name: req.store, sec: req.sec || 'fashion', owner: req.phone,
                color: (s.worlds.find(w => w.id === (req.sec || 'fashion')) || s.worlds[0]).color,
                cover: '', logo: '', desc: 'متجر جديد — بانتظار أول منتجاته وهويته',
                rt: 0, sales: 0, susp: false, open: true, city: 'الرياض', area: '',
                dlMode: 'customer' as const, freeMin: 0, rangeKm: 20, qs: [], cr: req.cr || '', iban: req.iban || '',
              }]
            : s.stores;
          const users2 = { ...s.users };
          if (req.kind === 'store') {
            const st2 = stores2.find((x: Store) => x.owner === req.phone);
            users2[req.phone] = users2[req.phone] || { phone: req.phone, name: req.own, role: 'merchant', store: st2 ? st2.id : null, pts: 0, bal: 0, email: req.email || '', addrs: [], favs: [], dlib: [], ptsLog: [] };
            users2[req.phone] = { ...users2[req.phone], store: st2 ? st2.id : users2[req.phone].store };
          } else {
            users2[req.phone] = users2[req.phone] || { phone: req.phone, name: req.own, role: 'admin', store: null, pts: 0, bal: 0, email: req.email || '', addrs: [], favs: [], dlib: [], ptsLog: [] };
          }
          const storeWallets2 = req.kind === 'store' && req.store ? { ...s.storeWallets, ['s' + s.stores.length + 1]: 0 } : s.storeWallets;
          return {
            stores: stores2, users: users2, storeWallets: storeWallets2,
            requests: s.requests.map(r => (r.id === id ? { ...r, status: 'approved' as const } : r)),
            notifs: [mkNotif(req.phone, '🎉', req.kind === 'store' ? 'اعتُمد متجرك وأصبح جاهزاً!' : 'مرحباً بك في فريق إدارة ضمين', req.kind === 'store' ? '«' + req.store + '» فُتح في ' + ((s.worlds.find(w => w.id === req.sec) || s.worlds[0]).name) + ' — أضف منتجاتك من لوحة التاجر وابدأ البيع (كلمة المرور التجريبية 1234)' : 'فُتحت لك صلاحيات مركز الإدارة كاملة — سجّل دخولك بالجوال وكلمة المرور وابدأ', req.kind === 'store' ? ['m-dash'] : ['a-over']), ...s.notifs].slice(0, 40),
          };
        });
        toast.success('أُوافق على الطلب — ' + (req.store || req.own) + ' صار في ضمين ✅');
      },
      rejectReq: (id, reason) => {
        set(s => ({ requests: s.requests.map(r => (r.id === id ? { ...r, status: 'rejected' as const, why: reason } : r)) }));
        toast('رُفض الطلب وأُرسل السبب لمقدمه');
      },
      toggleSuspend: sid => {
        const st = get();
        const s0 = st.stores.find(x => x.id === sid);
        set(s => ({ stores: s.stores.map(x => (x.id === sid ? { ...x, susp: !x.susp } : x)) }));
        if (s0) set(s2 => ({ notifs: [mkNotif(s0.owner, s0.susp ? '✅' : '⛔', s0.susp ? 'أُلغي إيقاف متجرك' : 'أُوقف متجرك مؤقتاً', s0.susp ? 'عاد متجرك للعمل بشكل طبيعي' : 'راجع فريق الامتثال في ضمين', ['m-set']), ...s2.notifs].slice(0, 40) }));
        toast(s0?.susp ? 'أُعيد تشغيل المتجر — صار مرئياً للعملاء ✅' : 'أُوقف المتجر — اختفى من واجهات العملاء ⏸️');
      },
      saveStore: d => {
        const st = get();
        if (!st.session?.store) return;
        set(s => ({ stores: s.stores.map(x => (x.id === st.session!.store ? { ...x, name: d.name || x.name, desc: d.desc || x.desc } : x)) }));
        toast.success('حُفظت بيانات متجرك ✓');
      },
      saveStoreLoc: (city, area) => {
        const st = get();
        if (!st.session?.store) return;
        set(s => ({ stores: s.stores.map(x => (x.id === st.session!.store ? { ...x, city, area } : x)) }));
        toast.success('حُفظ الموقع — يظهر للعملاء مدينة النشاط فقط ✓');
      },
      saveStoreShip: d => {
        const st = get();
        if (!st.session?.store) return;
        set(s => ({ stores: s.stores.map(x => (x.id === st.session!.store ? { ...x, dlMode: d.dlMode, freeMin: d.freeMin, ...(d.rangeKm != null ? { rangeKm: d.rangeKm } : {}) } : x)) }));
        toast.success('حُفظت خيارات التوصيل ✓');
      },
      addStoreQ: q => {
        const st = get();
        if (!st.session?.store) return;
        set(s => ({ stores: s.stores.map(x => (x.id === st.session!.store ? { ...x, qs: [...x.qs, q] } : x)) }));
        toast.success('أُضيف السؤال — سيظهر للعملاء عند الطلب ✓');
      },
      delStoreQ: i => {
        const st = get();
        if (!st.session?.store) return;
        set(s => ({ stores: s.stores.map(x => (x.id === st.session!.store ? { ...x, qs: x.qs.filter((_, j) => j !== i) } : x)) }));
        toast('حُذف السؤال');
      },

      saveProduct: d => {
        const st = get();
        const sid = st.session?.store;
        if (!sid) return false;
        const store = st.stores.find(x => x.id === sid)!;
        const secId = store.sec;
        if (!(d.pts >= 1)) { toast.error('🌟 نقاط الولاء إجبارية — حدد نقاطاً (١ فأكثر) يمنحها المنتج للعميل عند التحرير'); return false; }
        const old = d.id ? (st.products.find(p => p.id === d.id)?.pts || 0) : 0;
        const dPts = d.pts - old;
        const cost = r2(dPts * st.ptsVal);
        if (cost > 0 && (st.storeWallets[sid] || 0) < cost) { toast.error('محفظتك لا تكفي لتمويل ' + d.pts + ' نقطة (' + cost + ' ر.س) — قلّل النقاط أو راجع محفظتك'); return false; }
        let ptype = d.ptype || 'std';
        let fragile = d.fragile, digi = d.digi;
        if (secId === 'gaming') {
          if (ptype === 'digital') {
            if (!d.ipOK) { toast.error('⚖️ إقرار الملكية الفكرية إلزامي قبل رفع الملفات والأكواد الرقمية'); return false; }
            if (!digi || (digi.val || '').trim().length < 3) { toast.error('أدخل قيمة الكود أو اسم الملف الرقمي'); return false; }
          } else if (ptype === 'fragile') { fragile = true; ptype = 'std'; }
          else ptype = 'std';
        } else if (secId === 'deco') {
          if (!['ship', 'field'].includes(ptype)) ptype = 'ship';
        } else {
          if (!['chilled', 'instant'].includes(ptype)) ptype = 'std';
        }
        const now = Date.now();
        set(s => {
          const storeWallets2 = dPts !== 0 ? { ...s.storeWallets, [sid]: r2((s.storeWallets[sid] || 0) - cost) } : s.storeWallets;
          const aPtsWallet2 = dPts !== 0 ? r2(s.aPtsWallet + cost) : s.aPtsWallet;
          const ptsFunding2 = dPts !== 0 ? [{ store: sid, amt: cost, pts: dPts, pname: d.name, at: now }, ...s.ptsFunding] : s.ptsFunding;
          let products2: Product[];
          if (d.id) {
            products2 = s.products.map(p => p.id !== d.id ? p : {
              ...p, name: d.name, cat: d.cat, price: d.price, off: d.off, stock: d.stock, pts: d.pts,
              ptype: ptype as Product['ptype'], fragile, giftOk: d.giftOk, customOk: d.customOk,
              digi: digi || p.digi, ipOK: d.ipOK || p.ipOK, desc: d.desc, specs: d.specs, qs: d.qs,
              imgs: d.img ? [d.img, ...p.imgs.slice(1)] : p.imgs,
            });
          } else {
            const p: Product = {
              id: 'p' + (now % 100000), store: sid, name: d.name, cat: d.cat, price: d.price, off: d.off,
              stock: d.stock, sold: 0, rt: 0, rc: 0, imgs: [d.img || (s.worlds.find(w => w.id === secId)?.img || '')],
              desc: d.desc || d.name, fragile, ptype: ptype as Product['ptype'], giftOk: d.giftOk, customOk: d.customOk,
              pts: d.pts, digi: digi, ipOK: d.ipOK, qs: d.qs, specs: d.specs, ratings: [],
            };
            products2 = [p, ...s.products];
          }
          return { products: products2, storeWallets: storeWallets2, aPtsWallet: aPtsWallet2, ptsFunding: ptsFunding2 };
        });
        toast.success((d.id ? 'حُفظ تعديل المنتج ✓' : 'أُضيف المنتج لمتجرك ✓') + (dPts ? ' — ' + (dPts > 0 ? 'خُصمت' : 'استُرجعت') + ' ' + Math.abs(cost) + ' ر.س تمويل نقاط' : ''));
        return true;
      },
      setOffer: (pid, off) => {
        set(s => ({ products: s.products.map(p => (p.id === pid ? { ...p, off } : p)) }));
        toast.success(off ? 'فُعّل خصم ' + off + '٪ — السعر الجديد ظاهر للعملاء' : 'أُلغي العرض');
      },
      delProduct: pid => {
        set(s => ({ products: s.products.filter(p => p.id !== pid) }));
        toast('حُذف المنتج من متجرك');
      },
      addCoupon: (code, c) => {
        const st = get();
        const k = code.trim().toUpperCase();
        if (k.length < 3) { toast.error('اكتب كوداً من ٣ أحرف فأكثر'); return false; }
        if (st.coupons[k]) { toast.error('هذا الكود مستخدم مسبقاً في ضمين'); return false; }
        set(s => ({ coupons: { ...s.coupons, [k]: { ...c, uses: 0 } } }));
        toast.success('أُصدر كوبون «' + k + '» ✓');
        return true;
      },
      delCoupon: code => {
        set(s => ({ coupons: Object.fromEntries(Object.entries(s.coupons).filter(([k]) => k !== code)) }));
        toast('حُذف الكوبون «' + code + '»');
      },

      saveCat: (sec, i, n, comm) => {
        const st = get();
        if (n.length < 2) { toast.error('اسم التصنيف قصير'); return false; }
        if (!(comm >= 0 && comm <= 20)) { toast.error('العمولة يجب أن تكون بين ٠ و ٢٠٪'); return false; }
        const old = st.cats[sec][i];
        if (st.cats[sec].some((x, j) => j !== i && x.n === n)) { toast.error('يوجد تصنيف بنفس الاسم في هذا العالم'); return false; }
        set(s => ({
          cats: { ...s.cats, [sec]: s.cats[sec].map((x, j) => j === i ? { n, comm } : x) },
          products: n !== old.n ? s.products.map(p => {
            const sto = s.stores.find(x => x.id === p.store);
            return sto && sto.sec === sec && p.cat === old.n ? { ...p, cat: n } : p;
          }) : s.products,
        }));
        toast.success('حُفظ التصنيف «' + n + '» — عمولته ' + comm + '٪ ✓');
        return true;
      },
      addCat: (sec, n, comm) => {
        const st = get();
        if (n.length < 2) { toast.error('اكتب اسم التصنيف'); return false; }
        if (!(comm >= 0 && comm <= 20)) { toast.error('العمولة يجب أن تكون بين ٠ و ٢٠٪'); return false; }
        if (st.cats[sec].some(x => x.n === n)) { toast.error('التصنيف موجود مسبقاً في هذا العالم'); return false; }
        set(s => ({ cats: { ...s.cats, [sec]: [...s.cats[sec], { n, comm }] } }));
        toast.success('أُضيف التصنيف «' + n + '» بعمولة ' + comm + '٪ ✓');
        return true;
      },
      delCat: (sec, i) => {
        const st = get();
        const c = st.cats[sec][i];
        const pc = st.products.filter(p => {
          const sto = st.stores.find(x => x.id === p.store);
          return sto && sto.sec === sec && p.cat === c.n;
        }).length;
        if (pc) { toast.error('لا يمكن الحذف — انقل منتجاته (' + pc + ') لتصنيف آخر أولاً'); return; }
        set(s => ({ cats: { ...s.cats, [sec]: s.cats[sec].filter((_, j) => j !== i) } }));
        toast.success('حُذف التصنيف «' + c.n + '» ✓');
      },
      saveWorld: (id, name, desc) => {
        set(s => ({ worlds: s.worlds.map(w => (w.id === id ? { ...w, name: name || w.name, desc: desc || w.desc } : w)) }));
        toast.success('حُفظ اسم العالم ووصفه وانتشر في كل الواجهات ✓');
      },
      setPtsVal: v => {
        if (!(v >= 0.01 && v <= 1)) { toast.error('أدخل قيمة النقطة بين ٠٫٠١ و ١ ر.س'); return; }
        set({ ptsVal: +v.toFixed(2) });
        toast.success('صارت قيمة النقطة ' + v.toFixed(2) + ' ر.س — تسري على تمويلات التجار الجديدة');
      },
      setFreeDlPts: v => {
        if (!(v >= 50 && v <= 2000)) { toast.error('أدخل نقاط التوصيل بين ٥٠ و ٢٠٠٠'); return; }
        set({ freeDlPts: Math.round(v) });
        toast.success('صار استبدال التوصيل المجاني بـ' + Math.round(v) + ' نقطة للعميل');
      },
      markNotifsRead: () => set(s => ({ notifs: s.notifs.map(n => ({ ...n, read: true })) })),
    }),
    {
      name: 'dameen-react-v2',
      partialize: s => ({
        session: s.session, cart: s.cart, favorites: s.favorites, orders: s.orders, disputes: s.disputes,
        notifs: s.notifs, requests: s.requests, stores: s.stores, products: s.products, worlds: s.worlds,
        users: s.users, cats: s.cats, coupons: s.coupons, storeWallets: s.storeWallets, ptsFunding: s.ptsFunding,
        aRevenue: s.aRevenue, vat: s.vat, logiWallet: s.logiWallet, aPtsWallet: s.aPtsWallet,
        ptsVal: s.ptsVal, freeDlPts: s.freeDlPts, revMonths: s.revMonths, oidNext: s.oidNext,
      }),
    }
  )
);

/* مختارات جاهزة */
export const useMe = () => {
  const session = useDameen(s => s.session);
  const users = useDameen(s => s.users);
  return session ? users[session.phone] || null : null;
};

export const useMyOrders = () => {
  const session = useDameen(s => s.session);
  const orders = useDameen(s => s.orders);
  if (!session) return [];
  if (session.role === 'customer') return orders.filter(o => o.customer === session.phone);
  if (session.role === 'merchant') return orders.filter(o => o.groups.some(g => g.store === session.store));
  return orders;
};

export const visibleStores = (stores: Store[], worldId?: string) =>
  stores.filter(s => stOK(s) && (!worldId || s.sec === worldId));
export const visibleProducts = (products: Product[], stores: Store[], worldId?: string) =>
  products.filter(p => {
    const st = stores.find(s => s.id === p.store);
    return st && stOK(st) && st.open !== false && (!worldId || st.sec === worldId);
  });

export const heldFor = (orders: Order[], sid: string) =>
  r2(orders.reduce((a, o) => a + o.groups.filter(g => g.store === sid && ['pending', 'preparing', 'shipped', 'received', 'disputed'].includes(g.status)).reduce((x, g) => x + g.sub + ((g.ship && g.ship.charge) ?? g.dl) + (g.extra || 0), 0), 0));

export const vaultNow = (orders: Order[]) =>
  r2(orders.reduce((a, o) => a + o.groups.filter(g => ['pending', 'preparing', 'shipped', 'received', 'disputed'].includes(g.status)).reduce((x, g) => x + g.sub + ((g.ship && g.ship.charge) ?? g.dl) + (g.extra || 0), 0), 0));
