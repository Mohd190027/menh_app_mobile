/* توليد data.ts الكامل من dameen-data.json — كل الحقول والأنواع والمساعدات */
const fs = require('fs');
const d = JSON.parse(fs.readFileSync('/home/z/my-project/scripts/dameen-data.json', 'utf8'));
const NOW = Date.now();
const rel = o => { const c = { ...o }; if ('atMin' in c) { c.at = NOW - c.atMin * 60000; delete c.atMin; } if ('openedAtMin' in c) { c.openedAt = NOW - c.openedAtMin * 60000; delete c.openedAtMin; } return c; };
d.products = d.products.map(p => ({ ...p, ratings: (p.ratings || []).map(rel) }));
d.users = d.users.map(u => ({ ...u, dlib: (u.dlib || []).map(rel), ptsLog: (u.ptsLog || []).map(rel) }));
d.reqs = d.reqs.map(rel);
d.orders = d.orders.map(o => ({ ...o, groups: (o.groups || []).map(g => { const c = { ...g }; delete c.chatN; return c; }) }));
d.disputes = d.disputes.map(x => rel({ ...x, messages: (x.messages || []).map(rel) }));
d.db.ptsFunding = (d.db.ptsFunding || []).map(rel);
d.db.notifs = (d.db.notifs || []).map(rel);

const j = v => JSON.stringify(v, null, 1).replace(/\n {1}/g, '\n').replace(/\n {2}/g, '\n  ').replace(/\n {3}/g, '\n   ').replace(/\n {4}/g, '\n    ').replace(/\n {5}/g, '\n     ').replace(/\n {6}/g, '\n      ').replace(/\n {7}/g, '\n       ').replace(/\n {8}/g, '\n        ');

const out = `/* بيانات ضمين الكاملة — مولّدة من التطبيق الأصلي (extract-full.js + gen-full.js)
 * العوالم الأربعة + ١٠ متاجر بكل حقولها + ٣٢ منتجاً بكل خصائصها + ١٢ حساباً + طلبات البذور بشحناتها + النزاعات + الكوبونات والخزنة */
export interface World { id: string; name: string; icon: string; color: string; winMin: number; win: string; desc: string; img: string; }
export interface StoreQ { q: string; }
export interface Store {
  id: string; name: string; sec: string; owner: string; color: string; cover: string; logo: string;
  desc: string; rt: number; sales: number; susp: boolean; open: boolean; city: string; area: string;
  dlMode: 'customer' | 'half' | 'free'; freeMin: number; rangeKm: number; qs: string[]; cr: string; iban: string;
}
export interface Digi { kind: 'code' | 'file'; val: string; size: string; }
export interface ProdQ { t: 'opts' | 'txt'; q: string; o: string[]; }
export interface Rating { by: string; name: string; stars: number; txt: string; at: number; }
export interface Product {
  id: string; store: string; name: string; cat: string; price: number; off: number;
  stock: number; sold: number; rt: number; rc: number; imgs: string[]; desc: string;
  fragile: boolean; ptype: 'std' | 'ship' | 'instant' | 'chilled' | 'field' | 'digital' | 'fragile';
  giftOk: boolean; customOk: boolean; pts: number; digi: Digi | null; ipOK?: boolean;
  qs: ProdQ[]; specs: Record<string, string>; ratings: Rating[];
}
export interface Addr { t: string; a: string; def?: boolean; }
export interface DLibItem { pid: string; name: string; store: string; kind: 'code' | 'file'; val: string; size: string; at: number; oid: number; }
export interface PtsLog { t: string; v: number; at: number; }
export interface User {
  phone: string; name: string; role: 'customer' | 'merchant' | 'admin'; store: string | null;
  pts: number; bal: number; email: string; addrs: Addr[]; favs: string[];
  dlib: DLibItem[]; ptsLog: PtsLog[];
}
export interface RegRequest {
  id: string; kind: 'store' | 'admin'; own: string; store: string; email: string; phone: string;
  cr: string; sec: string; iban: string; code: string; role: string;
  status: 'pending' | 'approved' | 'rejected'; why?: string; at: number;
}
export interface SeedShip { mode: string; cost: number; charge: number; subsidy: number; source: string; why: string; label: string; fragile: boolean; blocked?: string | null; }
export interface SeedGroup {
  store: string; status: 'pending' | 'preparing' | 'shipped' | 'received' | 'released' | 'refunded' | 'disputed';
  sub: number; dl: number; extra: number; digi: boolean; custom: boolean;
  gift: { name: string; phone: string; city: string } | null;
  booking: { dl: string; date: string; setup: string; tear: string; note: string; geo: { lat: number; lng: number } | null } | null;
  items: { pid: string; qty: number }[];
  ship: SeedShip | null;
  payout: { sub: number; comm: number; net: number } | null;
  rated: { stars: number } | null;
}
export interface SeedOrder {
  id: number; customer: string; atMin: number; pay: string; addr: string; city?: string;
  coupon: { code: string | null; amt: number } | null;
  ptsUsed?: number; ptsAmt?: number; freeDl?: boolean; net?: number; tax?: number; total?: number;
  groups: SeedGroup[];
}
export interface DispMsg { r: 'customer' | 'merchant' | 'sys'; t: string; at: number; img?: string | null; }
export interface Dispute {
  id: string; order: number; store: string; customer: string; subject: string;
  status: 'open' | 'resolved'; openedAt: number;
  ruling: { act: 'refund' | 'release'; text: string } | null;
  messages: DispMsg[];
}
export interface Coupon { type: 'pct' | 'flat'; v: number; max: number; store: string; min: number; uses: number; maxUses?: number; }
export interface CatInfo { n: string; comm: number; }

export const WORLDS: World[] = ${j(d.sections)};

export const CATS: Record<string, CatInfo[]> = ${j(d.cats)};

export const STORES: Store[] = ${j(d.stores)};

export const USERS: Record<string, User> = {
${d.users.map(u => `  ${JSON.stringify(u.phone)}: ${j(u).replace(/\n/g, '\n  ')},`).join('\n')}
};

export const PRODUCTS: Product[] = ${j(d.products)};

export const REQUESTS: RegRequest[] = ${j(d.reqs)};

export const SEED_ORDERS: SeedOrder[] = ${j(d.orders)};

export const SEED_DISPUTES: Dispute[] = ${j(d.disputes)};

export const COUPONS: Record<string, Coupon> = ${j(d.db.coupons)};

export const REV_MONTHS: { m: string; v: number }[] = ${j(d.db.revMonths)};

export const STORE_WALLETS: Record<string, number> = ${j(d.db.storeWallets)};

export const PTS_FUNDING: { store: string; pname: string; pts: number; amt: number; at: number }[] = ${j(d.db.ptsFunding)};

export const SEED_NOTIFS: { to: string; ic: string; t: string; b: string; at: number; read: boolean; go: string[] }[] = ${j(d.db.notifs)};

export const DEMO_LOGINS = [
  { phone: '0500000001', label: '🛍️ تجربة كعميل', name: 'نورة العبدالله' },
  { phone: '0500000002', label: '🏪 تجربة كتاجر', name: 'ريم الدوسري' },
  { phone: '0500000003', label: '🛡️ تجربة كإدارة', name: 'فهد العتيبي' },
];

export const CITIES = ['الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الأحساء', 'الطائف', 'بريدة', 'أبها', 'تبوك'];

export const PAY_METHODS = [
  { id: 'mada', name: 'مدى', desc: 'خصم فوري آمن — بوابة Moyasar', badge: 'مدى' },
  { id: 'visa', name: 'فيزا / ماستركارد', desc: 'بوابة HyperPay', badge: 'VISA' },
  { id: 'apple', name: 'Apple Pay', desc: 'دفع بلمسة واحدة', badge: ' Pay' },
  { id: 'tabby', name: 'تابي', desc: 'قسّمها على ٤ دفعات بلا فوائد', badge: 'تابي' },
  { id: 'tamara', name: 'تمارا', desc: '٣ دفعات شهرية بلا فوائد', badge: 'تمارا' },
  { id: 'bal', name: 'محفظة ضمين', desc: 'رصيدك المحفوظ لدى ضمين', badge: 'ضمين' },
];

export const PAY_LABELS: Record<string, string> = { mada: 'مدى', visa: 'فيزا/ماستركارد', apple: 'Apple Pay', tabby: 'تقسيط تابي', tamara: 'تقسيط تمارا', bal: 'محفظة ضمين' };

export const FAQS = [
  { q: 'ما هو ضمين؟', a: 'منصة إسكرو سعودية — يدفع العميل وتُحجز قيمة الطلب في خزنة مستقلة، ولا يستلم التاجر مستحقاته إلا بعد استلام العميل ورضاه خلال نافذة حماية تختلف بحسب القسم.' },
  { q: 'كم نافذة الحماية لكل عالم؟', a: 'الأزياء ساعتان · المأكولات ٣٠ دقيقة · الهدايا والمناسبات ٢٤ ساعة · الألعاب والرقميات ٣ ساعات — وبعدها يُحرر المبلغ تلقائياً للتاجر.' },
  { q: 'كيف تُحمى المحادثات؟', a: 'محادثة ضمين الآمنة تُحجب فيها الأرقام والروابط ووسائل التواصل الخارجية تلقائياً — وبعد ٣ مخالفات تُحذف المحادثة مع تنبيه الإدارة، حماية للطرفين من التحايل على الضمان.' },
  { q: 'وماذا عن الشحن؟', a: 'شحنة مستقلة لكل متجر ببوليصة آلية عبر شركاء ضمين (OTO/Torod)، ورسوم ديناميكية من مدينة المتجر إلى مدينتك، مع أوضاع خاصة: فوري للأطباق الطازجة، مبرد للحساس للحرارة، ميداني لتنسيق المناسبات، ورقمي فوري بلا شحن.' },
];

export const COMPS: Record<string, string> = {
  damaged: 'المنتج وصل تالفاً',
  notmatch: 'لا يطابق الوصف',
  missing: 'عناصر ناقصة',
  late: 'تأخر شديد في الوصول',
  other: 'سبب آخر',
};

export const COURIERS: Record<string, string[]> = {
  std: ['OTO Express', 'Torod Shipping', 'سمسا عبر OTO'],
  chilled: ['OTO Fresh — سلسلة التبريد', 'Torod Cooler المتعاقدة'],
  instant: ['Torod Now — مندوب فوري', 'مرسول فوري'],
};

export const CITY_DL = (a: string, b: string) => (a === b ? 12 : 22);

export const PTI = (p: { ptype?: string }) =>
  ({ chilled: '🧊 توصيل مبرد', instant: '🛵 توصيل فوري', field: '🎪 خدمة ميدانية', digital: '⚡ رقمي فوري', ship: '📦 قابل للشحن' } as Record<string, string>)[p.ptype || ''] || '';

/* عمولة ضمين على تصنيف داخل عالم */
export const catComm = (sec: string, cat: string): number => {
  const list = CATS[sec] || [];
  const c = list.find(x => x.n === cat);
  return c ? c.comm : 2.5;
};

/* حارس المحادثة — منع التواصل خارج التطبيق */
const BYPASS_WORDS = ['واتساب', 'واتس اب', 'واتس', 'جوال', 'تحويل', 'حساب خارجي', 'رقمي', 'رقمك', 'رقم الهاتف', 'هاتفي', 'سناب', 'سناب شات', 'انستقرام', 'انستغرام', 'تويتر', 'تيليجرام', 'تليجرام', 'ايميل', 'بريد إلكتروني', 'stc pay', 'stcpay', 'حوالة', 'كاش خارجي'];
export function chatGuard(txt: string): { ok: boolean; why?: string } {
  const t = String(txt || '');
  if (/(https?:\\/\\/|www\\.|\\S+\\.(com|net|org|io|me|co)(\\s|$|\\/))/i.test(t)) return { ok: false, why: 'رابط خارجي' };
  const digits = t.replace(/[٠-٩]/g, dd => String('٠١٢٣٤٥٦٧٨٩'.indexOf(dd))).replace(/[\\s\\-–—ـ.,_/]/g, '');
  if (/(05\\d{8}|9665\\d{8}|009665\\d{8}|\\d{9,})/.test(digits)) return { ok: false, why: 'رقم جوال' };
  const norm = t.replace(/[أإآ]/g, 'ا').toLowerCase();
  for (const w of BYPASS_WORDS) { if (norm.includes(w.replace(/[أإآ]/g, 'ا').toLowerCase())) return { ok: false, why: 'مصطلح تواصل خارجي' }; }
  return { ok: true };
}

export const worldOf = (storeId: string): World => {
  const s = STORES.find(x => x.id === storeId);
  return WORLDS.find(w => w.id === s?.sec) || WORLDS[0];
};

/* تحويل الأرقام إلى هندية */
export const arDigits = '٠١٢٣٤٥٦٧٨٩';
export const ar = (n: number | string, frac = 0): string => {
  const s = typeof n === 'number' ? n.toFixed(frac) : String(n);
  return s.replace(/\\d/g, d => arDigits[+d]).replace(/\\./g, '٫');
};

export const money = (n: number): string => ar(Math.round(n * 100) / 100, 2) + ' ر.س';
`;

fs.writeFileSync('/home/z/my-project/src/components/dameen/data.ts', out);
console.log('data.ts generated:', out.length, 'chars,', out.split('\n').length, 'lines');
