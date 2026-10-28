/* حالة ضمين — zustand + persist: الجلسة والسلة والمفضلة والطلبات والإدارة */
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import {
  ACCOUNTS, PRODUCTS as PRODUCTS0, REQUESTS, SEED_ORDERS, STORES as STORES0, WORLDS as WORLDS0,
  worldOf, type Product, type Store, type World, type RegRequest, type SeedOrder, type Account,
} from './data';

export type Role = 'customer' | 'merchant' | 'admin';
export type OrderStatus = 'new' | 'shipped' | 'protected' | 'released' | 'refunded' | 'disputed';

export interface Session {
  phone: string; name: string; role: Role; store: string | null;
  pts: number; bal: number; email: string;
}

export interface CartLine { pid: string; qty: number; }

export interface OrderItem { pid: string; name: string; qty: number; price: number; }
export interface ChatMsg { r: 'customer' | 'merchant' | 'dameen' | 'sys'; t: string; at: number; }

export interface Order {
  id: string; customer: string; customerName: string; store: string;
  items: OrderItem[]; subtotal: number; shipping: number; vat: number; total: number;
  status: OrderStatus; at: number; receivedAt?: number; protectionUntil?: number;
  address: string; city: string; pay: string;
  timeline: { t: string; at: number }[];
  chat: ChatMsg[];
  dispute?: { reason: string; desc: string; status: 'open' | 'resolved'; verdict?: string };
  code?: string;
}

export interface Notif { id: string; to: Role; ic: string; t: string; b: string; at: number; read: boolean; }

export type Route =
  | { name: 'home' }
  | { name: 'section'; id: string }
  | { name: 'store'; id: string }
  | { name: 'product'; id: string }
  | { name: 'search'; q: string }
  | { name: 'checkout' }
  | { name: 'success'; id: string }
  | { name: 'orders' }
  | { name: 'favorites' }
  | { name: 'account' }
  | { name: 'disputes' }
  | { name: 'merchant'; tab: string }
  | { name: 'admin'; tab: string };

/* ============ مساعدات ============ */
export const curPrice = (p: Product) => Math.round(p.price * (1 - (p.off || 0) / 100) * 100) / 100;

export const cartTotals = (lines: CartLine[], products: Product[]) => {
  const subtotal = Math.round(lines.reduce((a, l) => {
    const p = products.find(x => x.id === l.pid);
    return a + (p ? curPrice(p) * l.qty : 0);
  }, 0));
  const shipping = subtotal === 0 || subtotal >= 200 ? 0 : 15;
  const vat = Math.round(subtotal * 0.15);
  return { subtotal, shipping, vat, total: subtotal + shipping + vat };
};

export const routeKey = (r: Route) => r.name + ('id' in r ? r.id : '') + ('q' in r ? r.q : '') + ('tab' in r ? r.tab : '');

const P0 = (pid: string) => PRODUCTS0.find(p => p.id === pid)!;

function buildOrder(s: SeedOrder): Order {
  const items = s.items.map(i => ({ pid: i.pid, name: P0(i.pid).name, qty: i.qty, price: curPrice(P0(i.pid)) }));
  const subtotal = Math.round(items.reduce((a, i) => a + i.price * i.qty, 0));
  const shipping = subtotal >= 200 ? 0 : 15;
  const vat = Math.round(subtotal * 0.15);
  const at = Date.now() - s.atMin * 60000;
  const receivedAt = s.receivedMin ? Date.now() - s.receivedMin * 60000 : undefined;
  const protectionUntil = receivedAt ? receivedAt + worldOf(s.store).winMin * 60000 : undefined;
  const timeline: { t: string; at: number }[] = [{ t: 'تم الدفع — المبلغ محجوز في خزنة ضمين', at }];
  if (s.status !== 'new') timeline.push({ t: 'قيد التجهيز لدى التاجر', at: at + 20 * 60000 });
  if (['shipped', 'protected', 'released', 'refunded', 'disputed'].includes(s.status))
    timeline.push({ t: 'في الطريق إليك — بوليصة شحن آلية', at: at + 60 * 60000 });
  if (receivedAt && ['protected', 'released', 'disputed'].includes(s.status))
    timeline.push({ t: 'استُلم الطلب — بدأت نافذة الحماية', at: receivedAt });
  if (s.status === 'released') timeline.push({ t: 'حُرّر المبلغ للتاجر بعد رضاك ✓', at: at + (s.atMin - 30) * 60000 });
  if (s.status === 'refunded') timeline.push({ t: 'استُرجع المبلغ كاملاً إلى محفظتك', at: at + (s.atMin - 40) * 60000 });
  const chat: ChatMsg[] = [
    { r: 'sys', t: '🔒 محادثة ضمين الآمنة — يمنع تبادل الأرقام والروابط خارج التطبيق، والإدارة تراقب لحظياً.', at },
  ];
  if (s.status === 'disputed') {
    chat.push({ r: 'merchant', t: 'وصلنا اعتراضك — المنتج فُحص بعناية قبل الشحن وصُوّر قبل الإغلاق.', at: at + 3600000 });
    chat.push({ r: 'dameen', t: 'فتح فريق التحكيم الثلاثي ملف النزاع — أرفقي صور المنتج وسنصدر الحكم خلال ٤٨ ساعة.', at: at + 7200000 });
  }
  return {
    id: s.id, customer: s.customer, customerName: s.customerName, store: s.store,
    items, subtotal, shipping, vat, total: subtotal + shipping + vat,
    status: s.status, at, receivedAt, protectionUntil,
    address: 'الرياض، حي الياسمين، شارع الأمير سلطان، مبنى ١٢', city: 'الرياض', pay: 'mada',
    timeline, chat,
    dispute: s.status === 'disputed'
      ? { reason: 'المنتج وصل تالفاً', desc: 'العلبة ممزقة والمنتج به خدوش واضحة — أرفقت الصور لفريق التحكيم.', status: 'open' }
      : undefined,
    code: P0(s.items[0].pid).digi ? 'DX4A-' + (1000 + (s.atMin % 9000)) : undefined,
  };
}

const seedNotifs: Notif[] = [
  { id: 'n1', to: 'customer', ic: '🛡️', t: 'نافذة الحماية بدأت', b: 'طلبك DM-1023 تحت الحماية — لديك وقت للاعتراض قبل التحرير التلقائي', at: Date.now() - 25 * 60000, read: false },
  { id: 'n2', to: 'customer', ic: '🚚', t: 'طلبك في الطريق', b: 'صدرت بوليصة شحن آلية لطلب DM-1022 عبر شركاء ضمين', at: Date.now() - 1400 * 60000, read: true },
  { id: 'n3', to: 'merchant', ic: '📦', t: 'طلب جديد', b: 'طلب جديد من مها القحطاني — جهّزي الشحنة خلال ساعتين', at: Date.now() - 55 * 60000, read: false },
  { id: 'n4', to: 'admin', ic: '📋', t: 'طلب تسجيل جديد', b: '«عطور تلال الطائف» ينتظر موافقتك في صفحة المتاجر', at: Date.now() - 120 * 60000, read: false },
  { id: 'n5', to: 'admin', ic: '⚖️', t: 'نزاع مفتوح', b: 'الطلب DM-1024 يحتاج حكماً من فريق التحكيم', at: Date.now() - 2800 * 60000, read: true },
];

/* ============ المخزن ============ */
interface DameenState {
  session: Session | null;
  route: Route;
  cart: CartLine[];
  favorites: string[];
  orders: Order[];
  notifs: Notif[];
  requests: RegRequest[];
  stores: Store[];
  products: Product[];
  worlds: World[];
  ui: { authOpen: boolean; authTab: 'login' | 'reg' | 'store'; cartOpen: boolean };

  go: (r: Route) => void;
  openAuth: (tab?: 'login' | 'reg' | 'store') => void;
  closeAuth: () => void;
  setCartOpen: (v: boolean) => void;
  login: (id: string, pw: string) => boolean;
  loginAs: (phone: string) => void;
  logout: () => void;
  register: (name: string, phone: string, city: string) => void;
  registerStoreReq: (d: { own: string; store: string; sec: string; phone: string; email: string; cr: string; iban: string }) => void;

  addToCart: (pid: string, qty?: number) => void;
  setQty: (pid: string, qty: number) => void;
  removeLine: (pid: string) => void;
  clearCart: () => void;
  toggleFav: (pid: string) => void;

  placeOrder: (d: { address: string; city: string; pay: string }) => string | null;
  shipOrder: (oid: string) => void;
  confirmReceive: (oid: string) => void;
  releaseOrder: (oid: string) => void;
  openDispute: (oid: string, reason: string, desc: string) => void;
  resolveDispute: (oid: string, verdict: 'refund' | 'release') => void;
  pushChat: (oid: string, r: ChatMsg['r'], t: string) => void;

  approveReq: (id: string) => void;
  rejectReq: (id: string, reason: string) => void;
  toggleSuspend: (sid: string) => void;
  saveWorld: (id: string, name: string, desc: string) => void;
  addProduct: (d: { name: string; cat: string; price: number; off: number; stock: number; desc: string; img?: string }) => void;
  markNotifsRead: () => void;
}

const findAccount = (id: string): Account | undefined => {
  const k = id.trim();
  return ACCOUNTS.find(a => a.phone === k || a.email === k || a.name === k);
};

export const useDameen = create<DameenState>()(
  persist(
    (set, get) => ({
      session: null,
      route: { name: 'home' },
      cart: [],
      favorites: ['p1', 'p8'],
      orders: SEED_ORDERS.map(buildOrder),
      notifs: seedNotifs,
      requests: REQUESTS,
      stores: STORES0,
      products: PRODUCTS0,
      worlds: WORLDS0,
      ui: { authOpen: false, authTab: 'login', cartOpen: false },

      go: r => {
        set({ route: r });
        window.scrollTo({ top: 0 });
      },
      openAuth: tab => set(s => ({ ui: { ...s.ui, authOpen: true, authTab: tab || s.ui.authTab } })),
      closeAuth: () => set(s => ({ ui: { ...s.ui, authOpen: false } })),
      setCartOpen: v => set(s => ({ ui: { ...s.ui, cartOpen: v } })),

      login: (id, pw) => {
        const acc = findAccount(id);
        if (!acc) { toast.error('لا يوجد حساب بهذا المعرّف — جرّب حسابات التجربة بالأسفل'); return false; }
        if (pw !== '1234') { toast.error('كلمة المرور غير صحيحة'); return false; }
        const cur = get().session;
        // الدخول بحساب قائم يحافظ على نقاطه ورصيده المحدثين (لا يعيدهما للقيم الأولية)
        const keep = cur && cur.phone === acc.phone && cur.role === acc.role ? { pts: cur.pts, bal: cur.bal } : { pts: acc.pts, bal: acc.bal };
        set(s => ({
          session: { phone: acc.phone, name: acc.name, role: acc.role, store: acc.store, pts: keep.pts, bal: keep.bal, email: acc.email },
          ui: { ...s.ui, authOpen: false },
          route: acc.role === 'merchant' ? { name: 'merchant', tab: 'overview' } : acc.role === 'admin' ? { name: 'admin', tab: 'overview' } : { name: 'home' },
        }));
        toast.success(`أهلاً بك ${acc.name} 👋`);
        return true;
      },
      loginAs: phone => { get().login(phone, '1234'); },
      logout: () => {
        set({ session: null, route: { name: 'home' } });
        toast('تم تسجيل الخروج — تجوّل بحرية 👋');
      },
      register: (name, phone, city) => {
        if (!name.trim() || phone.trim().length < 9 || !city) { toast.error('أكمل بيانات الحساب أولاً'); return; }
        set(s => ({
          session: { phone: phone.trim(), name: name.trim(), role: 'customer', store: null, pts: 0, bal: 0, email: '' },
          ui: { ...s.ui, authOpen: false },
          route: { name: 'home' },
        }));
        toast.success(`أهلاً بك في ضمين يا ${name.trim()} 🎉`);
      },
      registerStoreReq: d => {
        set(s => ({
          requests: [{ id: 'rq-' + (s.requests.length + 100), kind: 'store', own: d.own, store: d.store, email: d.email, phone: d.phone, cr: d.cr, sec: d.sec, status: 'pending' }, ...s.requests],
          ui: { ...s.ui, authOpen: false },
        }));
        toast.success('وصل طلب متجرك للإدارة — سنبّهك عند البتّ فيه 📋');
      },

      addToCart: (pid, qty = 1) => {
        const p = get().products.find(x => x.id === pid);
        if (!p) return;
        set(s => {
          const ex = s.cart.find(l => l.pid === pid);
          return {
            cart: ex ? s.cart.map(l => (l.pid === pid ? { ...l, qty: Math.min(l.qty + qty, p.stock) } : l)) : [...s.cart, { pid, qty: Math.min(qty, p.stock) }],
            ui: { ...s.ui, cartOpen: true },
          };
        });
        toast.success(`أُضيف «${p.name}» إلى سلتك 🛒`);
      },
      setQty: (pid, qty) => set(s => ({ cart: qty <= 0 ? s.cart.filter(l => l.pid !== pid) : s.cart.map(l => (l.pid === pid ? { ...l, qty } : l)) })),
      removeLine: pid => set(s => ({ cart: s.cart.filter(l => l.pid !== pid) })),
      clearCart: () => set({ cart: [] }),
      toggleFav: pid => set(s => ({ favorites: s.favorites.includes(pid) ? s.favorites.filter(f => f !== pid) : [...s.favorites, pid] })),

      placeOrder: d => {
        const { session, cart, products, stores } = get();
        if (!session) { get().openAuth('login'); return null; }
        if (cart.length === 0) return null;
        const lines = cart.map(l => {
          const p = products.find(x => x.id === l.pid)!;
          return { pid: l.pid, name: p.name, qty: l.qty, price: curPrice(p) };
        });
        const singleStore = cart.every(l => products.find(p => p.id === l.pid)!.store === products.find(p => p.id === cart[0].pid)!.store)
          ? products.find(p => p.id === cart[0].pid)!.store : products.find(p => p.id === cart[0].pid)!.store;
        const t = cartTotals(cart, products);
        const now = Date.now();
        const id = 'DM-' + (1030 + get().orders.filter(o => o.id.startsWith('DM-')).length);
        const order: Order = {
          id, customer: session.phone, customerName: session.name, store: singleStore,
          items: lines, subtotal: t.subtotal, shipping: t.shipping, vat: t.vat, total: t.total,
          status: 'new', at: now, address: d.address, city: d.city, pay: d.pay,
          timeline: [{ t: 'تم الدفع — المبلغ محجوز في خزنة ضمين', at: now }],
          chat: [{ r: 'sys', t: '🔒 محادثة ضمين الآمنة — يمنع تبادل الأرقام والروابط خارج التطبيق.', at: now }],
          code: products.find(p => p.id === cart[0].pid)?.digi ? 'DX4A-' + Math.floor(1000 + Math.random() * 9000) : undefined,
        };
        set(s => ({
          orders: [order, ...s.orders],
          cart: [],
          notifs: [
            { id: 'n' + now, to: 'customer', ic: '🧾', t: 'تم استلام طلبك', b: `طلبك ${id} محجوز المبلغ — بانتظار تجهيز التاجر`, at: now, read: false },
            { id: 'n' + (now + 1), to: 'merchant', ic: '📦', t: 'طلب جديد', b: `طلب جديد ${id} من ${session.name}`, at: now, read: false },
            ...s.notifs,
          ].slice(0, 30),
        }));
        return id;
      },

      shipOrder: oid => {
        const now = Date.now();
        set(s => ({
          orders: s.orders.map(o => (o.id === oid ? { ...o, status: 'shipped', timeline: [...o.timeline, { t: 'في الطريق إليك — بوليصة شحن آلية', at: now }] } : o)),
          notifs: [{ id: 'n' + now, to: 'customer', ic: '🚚', t: 'طلبك في الطريق', b: `بوليصة شحن آلية صدرت للطلب ${oid}`, at: now, read: false }, ...s.notifs].slice(0, 30),
        }));
        toast.success('أُصدرت بوليصة الشحن وأُبلغ العميل 🚚');
      },

      confirmReceive: oid => {
        const o = get().orders.find(x => x.id === oid);
        if (!o) return;
        const now = Date.now();
        const until = now + worldOf(o.store).winMin * 60000;
        set(s => ({
          orders: s.orders.map(x => (x.id === oid ? { ...x, status: 'protected', receivedAt: now, protectionUntil: until, timeline: [...x.timeline, { t: 'استُلم الطلب — بدأت نافذة الحماية', at: now }] } : x)),
          notifs: [{ id: 'n' + now, to: 'customer', ic: '🛡️', t: 'بدأت نافذة الحماية', b: `افحص طلبك ${oid} — لديك ${worldOf(o.store).win} قبل التحرير التلقائي`, at: now, read: false }, ...s.notifs].slice(0, 30),
        }));
        toast.success(`بدأت نافذة الفحص — ${worldOf(o.store).win} 🛡️`);
      },

      releaseOrder: oid => {
        const { session, orders } = get();
        const o = orders.find(x => x.id === oid);
        if (!o || !session) return;
        const now = Date.now();
        const earned = Math.max(1, Math.round(o.total * 0.01));
        set(s => ({
          orders: s.orders.map(x => (x.id === oid ? { ...x, status: 'released', timeline: [...x.timeline, { t: 'حُرّر المبلغ للتاجر بعد رضاك ✓', at: now }] } : x)),
          session: { ...s.session!, pts: s.session!.pts + earned },
          notifs: [{ id: 'n' + now, to: 'merchant', ic: '💰', t: 'تحرير مستحقات', b: `حُرّر صافي مبلغ الطلب ${oid} إلى محفظتك`, at: now, read: false }, ...s.notifs].slice(0, 30),
        }));
        toast.success(`حُرّر المبلغ للتاجر وكسبت ${earned} نقطة ولاء 🎉`);
      },

      openDispute: (oid, reason, desc) => {
        const now = Date.now();
        set(s => ({
          orders: s.orders.map(o => (o.id === oid ? {
            ...o, status: 'disputed',
            dispute: { reason, desc, status: 'open' },
            timeline: [...o.timeline, { t: `فُتح نزاع: ${reason} — قيد التحكيم`, at: now }],
            chat: [...o.chat, { r: 'dameen', t: 'استلمنا اعتراضك — فريق التحكيم يراجع الأدلة من الطرفين وسنصدر الحكم خلال ٤٨ ساعة.', at: now }],
          } : o)),
          notifs: [{ id: 'n' + now, to: 'admin', ic: '⚖️', t: 'نزاع جديد', b: `الطلب ${oid} يحتاج حكماً: ${reason}`, at: now, read: false }, ...s.notifs].slice(0, 30),
        }));
        toast('فُتح النزاع — فريق التحكيم معك ⚖️');
      },

      resolveDispute: (oid, verdict) => {
        const now = Date.now();
        set(s => ({
          orders: s.orders.map(o => {
            if (o.id !== oid) return o;
            const won = verdict === 'refund';
            return {
              ...o, status: won ? 'refunded' : 'released',
              dispute: { ...o.dispute!, status: 'resolved', verdict: won ? 'الحكم لصالح العميل — استرجاع كامل' : 'الحكم لصالح التاجر — تحرير المبلغ' },
              timeline: [...o.timeline, { t: won ? 'حكم التحكيم: استُرجع المبلغ كاملاً إلى محفظتك' : 'حكم التحكيم: حُرّر المبلغ للتاجر', at: now }],
              chat: [...o.chat, { r: 'dameen', t: won ? 'صدر الحكم لصالح العميل — سيُعاد المبلغ كاملاً إلى محفظتك خلال دقائق.' : 'صدر الحكم لصالح التاجر — حُرّر المبلغ لمستحقاته. شكراً لصبرك.', at: now }],
            };
          }),
        }));
        toast.success(verdict === 'refund' ? 'صدر الحكم لصالح العميل وأُعيد المبلغ ⚖️' : 'صدر الحكم لصالح التاجر وحُرّر المبلغ ⚖️');
      },

      pushChat: (oid, r, t) => set(s => ({
        orders: s.orders.map(o => (o.id === oid ? { ...o, chat: [...o.chat, { r, t, at: Date.now() }] } : o)),
      })),

      approveReq: id => {
        const req = get().requests.find(r => r.id === id);
        if (!req) return;
        const now = Date.now();
        set(s => {
          const stores2 = req.kind === 'store' && req.store
            ? [...s.stores, {
                id: 'ns' + (s.stores.length + 1), name: req.store, sec: req.sec || 'fashion', owner: req.phone, ownerName: req.own,
                color: (s.worlds.find(w => w.id === (req.sec || 'fashion')) || s.worlds[0]).color,
                cover: (s.worlds.find(w => w.id === (req.sec || 'fashion')) || s.worlds[0]).img,
                desc: 'متجر جديد انضم لتوّه إلى عائلة ضمين', rt: 4.7, sales: 0, susp: false, city: 'الرياض', freeMin: 0,
              }]
            : s.stores;
          return {
            stores: stores2,
            requests: s.requests.map(r => (r.id === id ? { ...r, status: 'approved' as const } : r)),
            notifs: [{ id: 'n' + now, to: 'customer' as const, ic: '✅', t: 'طلب تسجيل مقبول', b: `أهلاً بـ«${req.store || req.own}» في عائلة ضمين`, at: now, read: false }, ...s.notifs].slice(0, 30),
          };
        });
        toast.success(`أُوافق على الطلب — ${req.store || req.own} صار في ضمين ✅`);
      },
      rejectReq: (id, reason) => {
        set(s => ({ requests: s.requests.map(r => (r.id === id ? { ...r, status: 'rejected' as const, reason } : r)) }));
        toast('رُفض الطلب وأُرسل السبب لمقدمه');
      },
      toggleSuspend: sid => {
        const s = get().stores.find(x => x.id === sid);
        set(st => ({ stores: st.stores.map(x => (x.id === sid ? { ...x, susp: !x.susp } : x)) }));
        toast(s?.susp ? 'أُعيد تشغيل المتجر — صار مرئياً للعملاء ✅' : 'أُوقف المتجر — اختفى من واجهات العملاء ⏸️');
      },
      saveWorld: (id, name, desc) => {
        set(s => ({ worlds: s.worlds.map(w => (w.id === id ? { ...w, name: name || w.name, desc: desc || w.desc } : w)) }));
        toast.success('حُفظ اسم العالم ووصفه وانتشر في كل الواجهات ✓');
      },
      addProduct: d => {
        const { session, stores, worlds } = get();
        if (!session?.store) return;
        const store = stores.find(x => x.id === session.store);
        const world = worlds.find(w => w.id === store?.sec) || worlds[0];
        const now = Date.now();
        set(s => ({
          products: [{
            id: 'np' + (s.products.length + 1), store: session.store, name: d.name, cat: d.cat,
            price: d.price, off: d.off, stock: d.stock, sold: 0, rt: 4.5, rc: 0,
            imgs: [d.img || world.img], desc: d.desc || 'منتج جديد من متجرنا داخل ضمين',
            digi: false, ptype: '', giftOk: false,
          }, ...s.products],
        }));
        toast.success('نُشر منتجك في متجرك وعالمه فوراً 🧺');
      },
      markNotifsRead: () => set(s => ({ notifs: s.notifs.map(n => ({ ...n, read: true })) })),
    }),
    {
      name: 'dameen-react-v1',
      partialize: s => ({
        session: s.session, cart: s.cart, favorites: s.favorites, orders: s.orders,
        notifs: s.notifs, requests: s.requests, stores: s.stores, products: s.products, worlds: s.worlds,
      }),
    }
  )
);

/* مختارات جاهزة */
export const useMyOrders = () => {
  const session = useDameen(s => s.session);
  const orders = useDameen(s => s.orders);
  if (!session) return [];
  if (session.role === 'customer') return orders.filter(o => o.customer === session.phone);
  if (session.role === 'merchant') return orders.filter(o => o.store === session.store);
  return orders;
};

export const visibleStores = (stores: Store[], worldId?: string) =>
  stores.filter(s => !s.susp && (!worldId || s.sec === worldId));
export const visibleProducts = (products: Product[], stores: Store[], worldId?: string) =>
  products.filter(p => {
    const st = stores.find(s => s.id === p.store);
    return st && !st.susp && (!worldId || st.sec === worldId);
  });
