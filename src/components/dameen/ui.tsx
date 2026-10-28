/* مكوّنات ضمين المشتركة: بطاقات، نجوم، عدّاد الحماية، حالات، حالات فارغة */
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, ShieldCheck, Store as StoreIcon, MapPin, PackageX, Sparkles } from 'lucide-react';
import { ar, money, worldOf, type Product, type Store } from './data';
import { curPrice, useDameen } from './state';

/* عنوان قسم مع إجراء جانبي */
export function SectionTitle({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-ink">{title}</h2>
        {sub && <p className="text-sm text-muted-foreground mt-1">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* نجوم التقييم */
export function Stars({ rt, rc, size = 14 }: { rt: number; rc?: number; size?: number }) {
  const full = Math.round(rt);
  return (
    <span className="inline-flex items-center gap-1" dir="ltr">
      <span className="inline-flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} size={size} className={i <= full ? 'fill-gold text-gold' : 'text-border'} />
        ))}
      </span>
      <span className="text-xs font-bold text-ink">{ar(rt, 1)}</span>
      {rc !== undefined && <span className="text-[11px] text-muted-foreground">({ar(rc)} تقييم)</span>}
    </span>
  );
}

/* حالة الطلب */
const STATUS_MAP: Record<string, { t: string; c: string }> = {
  new: { t: 'قيد التجهيز', c: 'bg-amber-100 text-amber-800 border-amber-200' },
  shipped: { t: 'في الطريق', c: 'bg-sky-50 text-teal-700 border-teal-200' },
  protected: { t: 'تحت الحماية', c: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  released: { t: 'محرر ✓', c: 'bg-brand/10 text-brand border-brand/25' },
  refunded: { t: 'مسترجع', c: 'bg-rose-50 text-rose-700 border-rose-200' },
  disputed: { t: 'نزاع قيد التحكيم', c: 'bg-orange-50 text-orange-700 border-orange-200' },
};
export function StatusChip({ status }: { status: string }) {
  const m = STATUS_MAP[status] || STATUS_MAP.new;
  return <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${m.c}`}>{m.t}</span>;
}

/* عدّاد نافذة الحماية الحي */
export function Countdown({ until }: { until: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const left = until - now;
  if (left <= 0) return <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">انتهت نافذة الحماية — سيُحرر المبلغ تلقائياً</span>;
  const h = Math.floor(left / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const txt = h > 0 ? `${ar(h)}:${ar(m)} ساعة` : m > 0 ? `${ar(m)}:${ar(s, 1)} دقيقة` : `${ar(s)} ثانية`;
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
      <ShieldCheck size={13} className="animate-pulse" />
      <span dir="ltr" className="tabular-nums">{txt}</span> متبقٍ من الحماية
    </span>
  );
}

/* عدّاد الكمية */
export function QtyStepper({ qty, set, max = 99, small }: { qty: number; set: (q: number) => void; max?: number; small?: boolean }) {
  const btn = `flex items-center justify-center rounded-lg border border-border text-ink hover:bg-accent transition-colors ${small ? 'w-7 h-7' : 'w-9 h-9'}`;
  return (
    <div className="inline-flex items-center gap-2 bg-white rounded-xl border border-border p-1" dir="ltr">
      <button aria-label="إنقاص" className={btn} onClick={() => set(qty - 1)}>−</button>
      <span className={`font-extrabold tabular-nums ${small ? 'w-6 text-sm' : 'w-8 text-center'}`}>{ar(qty)}</span>
      <button aria-label="زيادة" className={btn} disabled={qty >= max} onClick={() => set(qty + 1)} style={{ opacity: qty >= max ? 0.4 : 1 }}>+</button>
    </div>
  );
}

/* شعار العالم المصغر */
export function WorldChip({ storeId }: { storeId: string }) {
  const w = worldOf(storeId);
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white/95 px-2 py-0.5 rounded-full" style={{ background: w.color }}>
      <span>{w.icon}</span>{w.name}
    </span>
  );
}

/* بطاقة منتج */
export function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
  const { go, addToCart, toggleFav, favorites } = useDameen();
  const stores = useDameen(s => s.stores);
  const st = stores.find(x => x.id === p.store);
  const fav = favorites.includes(p.id);
  const cur = curPrice(p);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.3 }}
      className="group bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
      onClick={() => go({ name: 'product', id: p.id })}
    >
      <div className="relative h-40 md:h-44 overflow-hidden bg-sand">
        {p.imgs[0] ? (
          <img src={p.imgs[0]} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🛍️</div>
        )}
        {p.off > 0 && (
          <span className="absolute top-2 start-2 bg-red-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow">خصم {ar(p.off)}٪</span>
        )}
        {p.digi && (
          <span className="absolute top-2 end-2 bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">⚡ رقمي فوري</span>
        )}
        <button
          aria-label="المفضلة"
          className={`absolute bottom-2 end-2 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm transition-all ${fav ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white/90 border-border text-muted-foreground hover:text-red-400'}`}
          onClick={e => { e.stopPropagation(); toggleFav(p.id); }}
        >
          <Heart size={15} className={fav ? 'fill-red-500 text-red-500' : ''} />
        </button>
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {st && <WorldChip storeId={p.store} />}
          {p.stock <= 3 && <span className="text-[10px] font-bold text-red-600">آخر {ar(p.stock)} قطع</span>}
        </div>
        <h3 className="font-bold text-sm text-ink leading-snug line-clamp-2 min-h-10">{p.name}</h3>
        <Stars rt={p.rt} size={12} />
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div>
            <div className="font-extrabold text-brand text-base">{money(cur)}</div>
            {p.off > 0 && <div className="text-[11px] text-muted-foreground line-through">{money(p.price)}</div>}
          </div>
          <button
            aria-label="أضف للسلة"
            className="w-9 h-9 rounded-xl bg-brand text-cream flex items-center justify-center hover:bg-brand-2 active:scale-90 transition-all shadow-sm"
            onClick={e => { e.stopPropagation(); addToCart(p.id, 1); }}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* بطاقة متجر كبيرة (صفحة العالم) */
export function StoreCardBig({ s, index = 0 }: { s: Store; index?: number }) {
  const { go } = useDameen();
  const products = useDameen(st => st.products);
  const n = products.filter(p => p.store === s.id).length;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.4), duration: 0.3 }}
      className="group relative h-52 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all"
      onClick={() => go({ name: 'store', id: s.id })}
    >
      {s.cover ? (
        <img src={s.cover} alt={s.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="absolute inset-0 bg-sand" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <div className="absolute top-3 start-3 flex items-center gap-2">
        <span className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-lg" style={{ background: s.color }}>
          {s.name.replace(/^دَى?/, '').trim().charAt(0) || 'ض'}
        </span>
        <span className="text-[11px] font-bold bg-white/90 text-ink px-2 py-1 rounded-full">{ar(n)} منتج</span>
      </div>
      <div className="absolute bottom-0 inset-x-0 p-4 text-white">
        <h3 className="font-extrabold text-lg flex items-center gap-2"><StoreIcon size={16} />{s.name}</h3>
        <p className="text-xs text-white/80 line-clamp-1 mt-0.5">{s.desc}</p>
        <div className="flex items-center gap-3 mt-2 text-[11px] text-white/90">
          <span className="inline-flex items-center gap-1"><Star size={12} className="fill-gold text-gold" />{ar(s.rt, 1)}</span>
          <span className="inline-flex items-center gap-1"><MapPin size={12} />{s.city}</span>
          <span className="inline-flex items-center gap-1"><Sparkles size={12} />{ar(s.sales)} عملية</span>
        </div>
      </div>
    </motion.div>
  );
}

/* حالة فارغة */
export function EmptyState({ icon, title, sub, cta }: { icon?: string; title: string; sub?: string; cta?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-card rounded-2xl border border-dashed border-border">
      <div className="w-16 h-16 rounded-2xl bg-sand flex items-center justify-center text-3xl mb-4">{icon || <PackageX className="text-brand" />}</div>
      <h3 className="font-extrabold text-ink">{title}</h3>
      {sub && <p className="text-sm text-muted-foreground mt-1 max-w-sm leading-relaxed">{sub}</p>}
      {cta && <div className="mt-5">{cta}</div>}
    </div>
  );
}

/* بطاقة إحصائية للوحات */
export function StatCard({ icon, label, value, sub, tone = 'brand' }: { icon: React.ReactNode; label: string; value: string; sub?: string; tone?: 'brand' | 'gold' | 'red' | 'teal' }) {
  const tones: Record<string, string> = {
    brand: 'bg-brand/10 text-brand',
    gold: 'bg-gold/15 text-yellow-700',
    red: 'bg-red-50 text-red-600',
    teal: 'bg-teal-50 text-teal-700',
  };
  return (
    <div className="bg-card rounded-2xl border border-border p-4 shadow-sm flex items-start gap-3">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tones[tone]}`}>{icon}</div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground font-semibold">{label}</div>
        <div className="text-lg font-extrabold text-ink tabular-nums">{value}</div>
        {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}
