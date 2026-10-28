/* لوحة التاجر: نظرة عامة، منتجاتي (مع إضافة منتج)، الطلبات، المحفظة */
'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Store as StoreIcon, Package, Wallet, LayoutDashboard, Plus, Star, Truck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ar, CATS, money, worldOf } from './data';
import { useDameen, useMyOrders } from './state';
import { EmptyState, ProductCard, SectionTitle, StatCard } from './ui';
import { OrderCard } from './user';

const TABS = [
  { id: 'overview', t: 'نظرة عامة', icon: LayoutDashboard },
  { id: 'products', t: 'منتجاتي', icon: Package },
  { id: 'orders', t: 'الطلبات', icon: Truck },
  { id: 'wallet', t: 'المحفظة', icon: Wallet },
];

export function MerchantPanel({ tab }: { tab: string }) {
  const { session, go, stores, products, worlds } = useDameen();
  const orders = useMyOrders();
  const store = stores.find(s => s.id === session?.store);
  if (!session || !store) {
    return (
      <div className="py-10 max-w-md mx-auto">
        <EmptyState icon="🏪" title="لوحة التاجر" sub="سجّل دخولك بحساب تاجر للوصول إلى لوحة متجرك." cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => useDameen.getState().openAuth('login')}>تسجيل الدخول كتاجر</Button>} />
      </div>
    );
  }
  const w = worlds.find(x => x.id === store.sec)!;
  const myProducts = products.filter(p => p.store === store.id);
  const released = orders.filter(o => o.status === 'released');
  const active = orders.filter(o => ['new', 'shipped', 'protected'].includes(o.status));
  const net = released.reduce((a, o) => a + o.subtotal * 0.975, 0);
  const comm = released.reduce((a, o) => a + o.subtotal * 0.025, 0);
  const fDate = (at: number) => new Date(at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });

  return (
    <div className="py-2">
      {/* رأس اللوحة */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <span className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow" style={{ background: store.color }}>
          {store.name.replace(/^دَى?/, '').trim().charAt(0)}
        </span>
        <div className="flex-1 min-w-40">
          <h1 className="font-black text-lg text-ink">{store.name}</h1>
          <p className="text-[11px] text-muted-foreground">{w.icon} {w.name} · {ar(myProducts.length)} منتج · تقييم {ar(store.rt, 1)} ★</p>
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {TABS.map(t => {
            const Icon = t.icon;
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => go({ name: 'merchant', tab: t.id })}
                className={`text-[11px] font-extrabold px-3 py-2 rounded-xl border whitespace-nowrap inline-flex items-center gap-1.5 transition-all ${on ? 'bg-brand text-cream border-brand shadow-sm' : 'bg-card text-muted-foreground border-border hover:border-brand/40'}`}
              >
                <Icon size={13} /> {t.t}
                {t.id === 'orders' && active.length > 0 && <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${on ? 'bg-gold text-brand' : 'bg-sand text-ink'}`}>{ar(active.length)}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* نظرة عامة */}
      {tab === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={<Wallet size={19} />} label="صافي محفظتك" value={money(net)} sub={`${ar(released.length)} طلباً محرراً`} />
            <StatCard icon={<Truck size={19} />} label="طلبات نشطة" value={ar(active.length)} sub="تجهيز + شحن + حماية" tone="gold" />
            <StatCard icon={<Package size={19} />} label="منتجاتي" value={ar(myProducts.length)} sub={`${ar(myProducts.filter(p => p.stock <= 3).length)} قارب على النفاد`} tone="teal" />
            <StatCard icon={<Star size={19} />} label="تقييم متجرك" value={ar(store.rt, 1) + ' ★'} sub={`${ar(store.sales)} عملية ناجحة`} tone="gold" />
          </div>

          <div className="bg-card rounded-3xl border border-border p-5">
            <h3 className="font-extrabold text-sm mb-3">كيف يتوزع كل تحرير؟</h3>
            <div className="flex h-11 rounded-2xl overflow-hidden border border-border text-[10px] font-black">
              <div className="bg-brand text-cream flex items-center justify-center flex-[97.5]">صافيك ٩٧٫٥٪</div>
              <div className="bg-gold text-brand flex items-center justify-center flex-[2.5]">٢٫٥٪</div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2.5 leading-relaxed">
              عند تحرير أي طلب (برضا العميل أو تلقائياً بانتهاء نافذة الحماية) يصل صافي المبلغ محفظتك لحظياً، وعمولة ضمين ٢٫٥٪ فقط — لا رسوم خفية ولا انتظار.
            </p>
          </div>

          <div>
            <SectionTitle title="آخر الطلبات" action={<Button variant="outline" size="sm" className="font-bold h-8 text-[11px]" onClick={() => go({ name: 'merchant', tab: 'orders' })}>كل الطلبات <ArrowLeft size={12} /></Button>} />
            <div className="space-y-3">
              {orders.slice(0, 3).map((o, i) => <OrderCard key={o.id} o={o} index={i} />)}
            </div>
          </div>
        </div>
      )}

      {/* منتجاتي */}
      {tab === 'products' && <MerchantProducts store={store.id} world={w.id} />}

      {/* الطلبات */}
      {tab === 'orders' && <MerchantOrders />}

      {/* المحفظة */}
      {tab === 'wallet' && (
        <div className="space-y-5 max-w-3xl">
          <div className="bg-gradient-to-br from-brand to-brand-2 text-cream rounded-3xl p-6 shadow-md">
            <div className="text-xs font-bold text-cream/75 flex items-center gap-1.5"><Wallet size={14} /> صافي مستحقاتك المحررة</div>
            <div className="text-4xl font-black mt-2 tabular-nums">{money(net)}</div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-[11px]">
              <div className="bg-black/20 rounded-2xl p-3"><div className="text-cream/70">إجمالي المبيعات المحررة</div><div className="font-black text-lg mt-0.5">{money(released.reduce((a, o) => a + o.subtotal, 0))}</div></div>
              <div className="bg-black/20 rounded-2xl p-3"><div className="text-cream/70">عمولة ضمين (٢٫٥٪)</div><div className="font-black text-lg mt-0.5">{money(comm)}</div></div>
            </div>
          </div>
          <div className="bg-card rounded-3xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border font-extrabold text-sm">سجل التحويلات</div>
            {released.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">لا تحويلات بعد — أول تحرير سيظهر هنا لحظياً.</div>
            ) : (
              released.map(o => (
                <div key={o.id} className="flex items-center justify-between gap-3 p-4 border-b border-border last:border-0 text-xs">
                  <div>
                    <div className="font-extrabold text-ink">#{ar(o.id.replace('DM-', ''))} — {o.customerName}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{fDate(o.at)} · تحرير بعد رضا العميل</div>
                  </div>
                  <div className="text-end">
                    <div className="font-black text-emerald-700">+{money(o.subtotal * 0.975)}</div>
                    <div className="text-[10px] text-muted-foreground">عمولة −{money(o.subtotal * 0.025)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ منتجاتي + إضافة منتج ============ */
function MerchantProducts({ store, world }: { store: string; world: string }) {
  const { products, addProduct } = useDameen();
  const mine = useMemo(() => products.filter(p => p.store === store), [products, store]);
  const [open, setOpen] = useState(false);
  const cats = CATS[world] || [];
  const [d, setD] = useState({ name: '', cat: '', price: '', off: '', stock: '', desc: '', img: '' });
  const [err, setErr] = useState('');
  const save = () => {
    const price = +d.price, off = +d.off || 0, stock = +d.stock || 0;
    if (!d.name.trim() || !d.cat || !price || !stock) { setErr('أكمل الاسم والتصنيف والسعر والمخزون'); return; }
    if (off < 0 || off > 90) { setErr('نسبة الخصم بين ٠ و ٩٠'); return; }
    addProduct({ name: d.name.trim(), cat: d.cat, price, off, stock, desc: d.desc.trim(), img: d.img.trim() || undefined });
    setOpen(false); setD({ name: '', cat: '', price: '', off: '', stock: '', desc: '', img: '' }); setErr('');
  };
  return (
    <div>
      <SectionTitle
        title="منتجاتي"
        sub={`${ar(mine.length)} منتجاً معروضاً للعملاء الآن`}
        action={<Button className="bg-brand hover:bg-brand-2 font-extrabold h-9" onClick={() => setOpen(true)}><Plus size={15} /> إضافة منتج</Button>}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {mine.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto" dir="rtl" aria-describedby={undefined}>
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-base"><Plus size={16} className="text-brand" /> إضافة منتج جديد</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-bold">اسم المنتج</Label>
              <Input className="mt-1" value={d.name} onChange={e => setD({ ...d, name: e.target.value })} placeholder="عباية كتان «نسيم»" />
            </div>
            <div>
              <Label className="text-xs font-bold">التصنيف</Label>
              <Select value={d.cat} onValueChange={v => setD({ ...d, cat: v })}>
                <SelectTrigger className="mt-1 w-full"><SelectValue placeholder="اختر التصنيف" /></SelectTrigger>
                <SelectContent>{cats.map(c => <SelectItem key={c.n} value={c.n}>{c.n} (عمولة {ar(c.comm, 1)}٪)</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs font-bold">السعر (ر.س)</Label>
                <Input className="mt-1" dir="ltr" type="number" value={d.price} onChange={e => setD({ ...d, price: e.target.value })} placeholder="349" />
              </div>
              <div>
                <Label className="text-xs font-bold">خصم ٪</Label>
                <Input className="mt-1" dir="ltr" type="number" value={d.off} onChange={e => setD({ ...d, off: e.target.value })} placeholder="0" />
              </div>
              <div>
                <Label className="text-xs font-bold">المخزون</Label>
                <Input className="mt-1" dir="ltr" type="number" value={d.stock} onChange={e => setD({ ...d, stock: e.target.value })} placeholder="10" />
              </div>
            </div>
            {+d.price > 0 && +d.off >= 0 && (
              <div className="text-[11px] font-bold text-brand bg-brand/5 border border-brand/20 rounded-xl px-3 py-2">
                سعر البيع بعد الخصم: {money(+d.price * (1 - (+d.off || 0) / 100))}
              </div>
            )}
            <div>
              <Label className="text-xs font-bold">الوصف</Label>
              <Textarea className="mt-1 text-xs" rows={2} value={d.desc} onChange={e => setD({ ...d, desc: e.target.value })} placeholder="وصف موجز يظهر للعملاء في صفحة المنتج" />
            </div>
            <div>
              <Label className="text-xs font-bold">رابط صورة (اختياري)</Label>
              <Input className="mt-1" dir="ltr" value={d.img} onChange={e => setD({ ...d, img: e.target.value })} placeholder="https://…" />
            </div>
            {err && <p className="text-[11px] text-red-600 font-bold">{err}</p>}
            <Button className="w-full bg-brand hover:bg-brand-2 font-extrabold" onClick={save}>نشر المنتج في متجري</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============ طلبات التاجر ============ */
function MerchantOrders() {
  const orders = useMyOrders();
  const [f, setF] = useState('all');
  const filters = [
    { id: 'all', t: 'الكل' }, { id: 'new', t: 'جديدة — تجهيز' },
    { id: 'shipped', t: 'في الطريق' }, { id: 'protected', t: 'تحت الحماية' }, { id: 'released', t: 'محررة' },
  ];
  const list = f === 'all' ? orders : orders.filter(o => o.status === f);
  return (
    <div>
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 mb-4">
        {filters.map(x => (
          <button key={x.id} onClick={() => setF(x.id)}
            className={`text-[11px] font-extrabold px-3.5 py-1.5 rounded-full border whitespace-nowrap transition-all ${f === x.id ? 'bg-brand text-cream border-brand' : 'bg-card text-muted-foreground border-border hover:border-brand/40'}`}>
            {x.t} {x.id !== 'all' && `(${ar(orders.filter(o => o.status === x.id).length)})`}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <EmptyState icon="📦" title="لا طلبات في هذه الحالة" sub="طلبات عملائك ستظهر هنا لحظة وصولها." />
      ) : (
        <div className="space-y-3.5 max-w-3xl">
          {list.map((o, i) => <OrderCard key={o.id} o={o} index={i} />)}
        </div>
      )}
    </div>
  );
}

export const MerchantIcon = StoreIcon;
export const MotionDiv = motion.div;
