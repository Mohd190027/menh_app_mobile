/* توليد src/components/dameen/data.ts من dameen-data.json المستخرج */
const fs = require('fs');
const D = JSON.parse(fs.readFileSync('/home/z/my-project/scripts/dameen-data.json', 'utf8'));

// خريطة اسم المالك
const ownerName = {};
D.users.forEach(u => { ownerName[u.phone] = u.name; });

const stores = D.stores.map(s => ({
  id: s.id, name: s.name, sec: s.sec, owner: s.owner,
  ownerName: ownerName[s.owner] || 'صاحب المتجر', color: s.color, cover: s.cover,
  desc: s.desc, rt: s.rt, sales: s.sales, susp: s.susp, city: s.city, freeMin: s.freeMin,
}));

const products = D.products.map(p => ({
  id: p.id, store: p.store, name: p.name, cat: p.cat, price: p.price, off: p.off,
  stock: p.stock, sold: p.sold, rt: p.rt, rc: p.rc, imgs: p.imgs, desc: p.desc,
  digi: p.digi, ptype: p.ptype, giftOk: p.giftOk,
}));

// بذور الطلبات (atMin/receivedMin = دقائق مضت)
const seedOrders = [
  { id: 'DM-1018', customer: '0500000001', customerName: 'نورة العبدالله', store: 's6', items: [{ pid: 'p19', qty: 1 }], status: 'refunded', atMin: 8640 },
  { id: 'DM-1021', customer: '0500000001', customerName: 'نورة العبدالله', store: 's1', items: [{ pid: 'p1', qty: 1 }, { pid: 'p3', qty: 1 }], status: 'released', atMin: 5760 },
  { id: 'DM-1022', customer: '0500000001', customerName: 'نورة العبدالله', store: 's3', items: [{ pid: 'p8', qty: 1 }, { pid: 'p9', qty: 2 }], status: 'shipped', atMin: 1440 },
  { id: 'DM-1023', customer: '0500000001', customerName: 'نورة العبدالله', store: 's5', items: [{ pid: 'p16', qty: 2 }], status: 'protected', atMin: 35, receivedMin: 25 },
  { id: 'DM-1024', customer: '0500000001', customerName: 'نورة العبدالله', store: 's4', items: [{ pid: 'p12', qty: 1 }], status: 'disputed', atMin: 2880 },
  { id: 'DM-1025', customer: 'مها القحطاني', customerName: 'مها القحطاني', store: 's1', items: [{ pid: 'p2', qty: 1 }], status: 'protected', atMin: 55, receivedMin: 40 },
  { id: 'DM-1026', customer: 'الجوهرة السبيعي', customerName: 'الجوهرة السبيعي', store: 's1', items: [{ pid: 'p1', qty: 2 }], status: 'released', atMin: 4320 },
  { id: 'DM-1027', customer: 'رنا العتيبي', customerName: 'رنا العتيبي', store: 's1', items: [{ pid: 'p3', qty: 1 }, { pid: 'p2', qty: 1 }], status: 'shipped', atMin: 600 },
  { id: 'DM-1028', customer: 'غادة المطيري', customerName: 'غادة المطيري', store: 's8', items: [{ pid: 'p22', qty: 1 }], status: 'new', atMin: 90 },
  { id: 'DM-1029', customer: 'سلطان الحربي', customerName: 'سلطان الحربي', store: 's9', items: [{ pid: 'p27', qty: 1 }], status: 'protected', atMin: 240, receivedMin: 200 },
];

// تحقق صارم: كل pid و store و sec موجودة
const pids = new Set(products.map(p => p.id));
const sids = new Set(stores.map(s => s.id));
const secIds = new Set(D.sections.map(s => s.id));
let errs = [];
seedOrders.forEach(o => {
  if (!sids.has(o.store)) errs.push('seed ' + o.id + ' store ' + o.store);
  o.items.forEach(i => { if (!pids.has(i.pid)) errs.push('seed ' + o.id + ' pid ' + i.pid); });
});
products.forEach(p => { if (!sids.has(p.store)) errs.push('prod ' + p.id + ' store ' + p.store); });
stores.forEach(s => { if (!secIds.has(s.sec)) errs.push('store ' + s.id + ' sec ' + s.sec); });
D.reqs.forEach(r => { if (r.kind === 'store' && !secIds.has(r.sec)) errs.push('req ' + r.id + ' sec ' + r.sec); });
if (errs.length) { console.error('INVALID:', errs); process.exit(1); }

const ts = `/* بيانات ضمين — مولّدة آلياً من التطبيق الأصلي (extract-data.js + gen-data.js)
 * العوالم الأربعة + ١٠ متاجر + ${products.length} منتجاً + حسابات التجربة + طلبات البذور */
export interface World { id: string; name: string; icon: string; color: string; winMin: number; win: string; desc: string; img: string; }
export interface Store { id: string; name: string; sec: string; owner: string; ownerName: string; color: string; cover: string; desc: string; rt: number; sales: number; susp: boolean; city: string; freeMin: number; }
export interface Product { id: string; store: string; name: string; cat: string; price: number; off: number; stock: number; sold: number; rt: number; rc: number; imgs: string[]; desc: string; digi: boolean; ptype: string; giftOk: boolean; }
export interface RegRequest { id: string; kind: 'store' | 'admin'; own: string; store: string; email: string; phone: string; cr: string; sec: string; status: 'pending' | 'approved' | 'rejected'; reason?: string; }
export interface Account { phone: string; name: string; role: 'customer' | 'merchant' | 'admin'; store: string | null; pts: number; bal: number; email: string; }
export interface SeedItem { pid: string; qty: number; }
export interface SeedOrder { id: string; customer: string; customerName: string; store: string; items: SeedItem[]; status: 'new' | 'shipped' | 'protected' | 'released' | 'refunded' | 'disputed'; atMin: number; receivedMin?: number; }
export interface CatInfo { n: string; comm: number; }

export const WORLDS: World[] = ${JSON.stringify(D.sections, null, 1)};

export const CATS: Record<string, CatInfo[]> = ${JSON.stringify(D.cats, null, 1)};

export const STORES: Store[] = ${JSON.stringify(stores, null, 1)};

export const PRODUCTS: Product[] = ${JSON.stringify(products, null, 1)};

export const ACCOUNTS: Account[] = ${JSON.stringify(D.users.filter(u => ['0500000001', '0500000002', '0500000003'].includes(u.phone)), null, 1)};

export const DEMO_LOGINS = [
  { phone: '0500000001', label: '🛍️ تجربة كعميل', name: 'نورة العبدالله' },
  { phone: '0500000002', label: '🏪 تجربة كتاجر', name: 'ريم الدوسري' },
  { phone: '0500000003', label: '🛡️ تجربة كإدارة', name: 'فهد العتيبي' },
];

export const REQUESTS: RegRequest[] = ${JSON.stringify(D.reqs, null, 1)};

export const SEED_ORDERS: SeedOrder[] = ${JSON.stringify(seedOrders, null, 1)};

export const CITIES = ['الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الطائف', 'أبها', 'تبوك', 'بريدة', 'حائل', 'جيزان'];

export const PAY_METHODS = [
  { id: 'mada', name: 'مدى', desc: 'خصم فوري آمن', badge: 'مدى' },
  { id: 'visa', name: 'فيزا', desc: 'بطاقات فيزا', badge: 'VISA' },
  { id: 'applepay', name: 'Apple Pay', desc: 'دفع بلمسة واحدة', badge: ' Pay' },
  { id: 'tabby', name: 'تابي', desc: 'قسّمها على ٤ دفعات بدون فوائد', badge: 'تابي' },
  { id: 'tamara', name: 'تمارا', desc: '٣ دفعات شهرية بدون فوائد', badge: 'تمارا' },
  { id: 'wallet', name: 'محفظة ضمين', desc: 'رصيدك المحفوظ لدى ضمين', badge: 'ضمين' },
];

export const FAQS = [
  { q: 'كيف تحمي ضمين أموالي؟', a: 'عند الطلب يُحجز مبلغك في خزنة ضمين المستقلة ولا يستلم التاجر شيئاً حتى تؤكد استلامك ورضاك، أو تنتهي نافذة الحماية تلقائياً.' },
  { q: 'متى يستلم التاجر مستحقاته؟', a: 'لحظة تأكيدك الاستلام أو انتهاء نافذة الحماية — يُحرر صافي المبلغ (٩٧٫٥٪) للتاجر وتذهب عمولة ضمين (٢٫٥٪) مباشرة للإدارة.' },
  { q: 'ماذا لو لم يعجبني المنتج؟', a: 'افتح نزاعاً خلال نافذة الحماية من صفحة طلباتك — فريق التحكيم الثلاثي يراجع الأدلة من الطرفين ويصدر حكمه بالاسترجاع أو التحرير.' },
  { q: 'هل الشحن مجاني؟', a: 'الشحن موحد ١٥ ر.س ويصبح مجانياً عندما يتجاوز طلبك ٢٠٠ ر.س، مع شحن آلي عبر شركاء OTO وTorod وتتبع لحظي لكل شحنة.' },
];

export const REVIEWS_POOL = [
  { name: 'نورة', stars: 5, txt: 'جودة ممتازة والتغليف كان أنيق جداً، وصل قبل الموعد المحدد. تجربة مريحة لأن مبلغي كان محجوزاً حتى استلمت.' },
  { name: 'عبدالعزيز', stars: 5, txt: 'تعامل سريع والمتجر متعاون عبر محادثة ضمين. أنصح بالتجربة.' },
  { name: 'الجوهرة', stars: 4, txt: 'المنتج مطابق للوصف تماماً. تأخر الشحن يوماً واحداً فقط لكن التتبع كان واضحاً.' },
  { name: 'ماجد', stars: 5, txt: 'أول مرة أشتري وأنا مطمئن — نظام الحجز يخلّيك تشتري بثقة والتحرير كان فورياً بعد التقييم.' },
  { name: 'أروى', stars: 4, txt: 'حلو ومرتب، والدفع بالتقسيط عبر تابي سهّل عليّ كثير.' },
  { name: 'فهد', stars: 5, txt: 'وصلني بحالة ممتازة والفاتورة مفصلة. ضمين فعلاً يحمي المشتري.' },
];

export const worldOf = (storeId: string): World => {
  const s = STORES.find(x => x.id === storeId);
  return WORLDS.find(w => w.id === (s ? s.sec : 'fashion')) || WORLDS[0];
};

/* أرقام عربية هندية */
export const ar = (n: number, frac = 0): string =>
  Number(n).toLocaleString('ar-EG', { maximumFractionDigits: frac === 0 ? 0 : 2 });
export const money = (n: number): string => {
  const v = Math.round(n * 100) / 100;
  return (Number.isInteger(v) ? ar(v) : ar(v, 2)) + ' ر.س';
};
`;

fs.mkdirSync('/home/z/my-project/src/components/dameen', { recursive: true });
fs.writeFileSync('/home/z/my-project/src/components/dameen/data.ts', ts);
console.log('data.ts written:', ts.length, 'chars | products:', products.length, '| stores:', stores.length);
