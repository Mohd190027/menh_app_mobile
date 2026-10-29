/* صفحات التسوق: الرئيسية، صفحة العالم، صفحة المتجر، البحث */
'use client';

import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, CreditCard, BadgeCheck, Store as StoreIcon, Package, ChevronLeft, ChevronRight,
  Search as SearchIcon, Lock, MapPin, Ban,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ar, FAQS, money } from './data';
import { eff, useDameen, visibleProducts, visibleStores } from './state';
import { EmptyState, ProductCard, SectionTitle, Stars, StoreCardBig } from './ui';
import { TrustChips } from './chrome';

/* ============ الرئيسية ============ */
export function HomePage() {
  const { go, worlds, stores, products } = useDameen();
  const trending = useMemo(
    () => [...visibleProducts(products, stores)].sort((a, b) => b.sold - a.sold).slice(0, 10),
    [products, stores]
  );
  const rail = useRef<HTMLDivElement>(null);
  const scrollRail = (dir: number) => rail.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });

  return (
    <div className="space-y-12 py-2">
      {/* البطل */}
      <section className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-1.5 text-[11px] font-extrabold bg-gold/15 text-yellow-800 border border-gold/40 rounded-full px-3 py-1.5">
            <ShieldCheck size={13} /> منصة التسوق بضمان الإسكرو
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="text-3xl md:text-[2.6rem] leading-[1.25] font-black text-ink"
          >
            تسوّق بضمين…
            <span className="text-brand block">مالك محجوز حتى ترضى</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
            نحجز مبلغك في خزنة مستقلة، ولا يستلم التاجر شيئاً حتى تستلم وتقيّم — والعمولة تُحسم من التاجر فقط.
            أربعة عوالم مختارة بعناية: الأزياء، المأكولات، الهدايا، والألعاب.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap gap-3">
            <Button className="bg-brand hover:bg-brand-2 font-extrabold h-11 px-6 rounded-full" onClick={() => go({ name: 'section', id: 'fashion' })}>
              ابدأ التسوق <ChevronLeft size={16} />
            </Button>
            <Button variant="outline" className="border-brand/30 text-brand hover:bg-accent font-bold h-11 px-6 rounded-full" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>
              كيف يحميك ضمين؟
            </Button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <TrustChips />
          </motion.div>
        </div>

        {/* بطاقة الإسكرو التعريفية */}
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.4 }} className="relative">
          <div className="bg-card rounded-3xl border border-border shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-ink">رحلة مبلغك في ضمين</span>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full">مثال حي</span>
            </div>
            <div className="flex items-center justify-between gap-1" dir="rtl">
              {[
                { ic: <CreditCard size={18} />, t: 'تدفع ٢٤٨ ر.س', s: 'مدى · تابي' },
                { ic: <ShieldCheck size={20} />, t: 'تُحجز في الخزنة', s: 'لا يمسّها التاجر' },
                { ic: <BadgeCheck size={18} />, t: 'تُحرر بعد رضاك', s: 'لحظة التقييم' },
              ].map((st, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 text-center relative">
                  {i > 0 && <span className="absolute top-5 -start-1/2 w-full border-t-2 border-dashed border-gold/50" />}
                  <span className={`w-10 h-10 rounded-2xl flex items-center justify-center ${i === 1 ? 'bg-gold text-brand pulse-ring' : 'bg-brand/10 text-brand'}`}>{st.ic}</span>
                  <span className="text-[11px] font-extrabold text-ink leading-tight">{st.t}</span>
                  <span className="text-[10px] text-muted-foreground">{st.s}</span>
                </div>
              ))}
            </div>
            <div className="bg-sand rounded-2xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">صافي التاجر (٩٧٫٥٪)</span><span className="font-extrabold text-emerald-700">{money(242)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">عمولة ضمين (٢٫٥٪)</span><span className="font-extrabold text-brand">{money(6.2)}</span></div>
              <div className="flex justify-between border-t border-border pt-2"><span className="font-bold">حمايتك</span><span className="font-extrabold text-gold">نافذة فحص كاملة 🛡️</span></div>
            </div>
          </div>
          <span className="absolute -top-3 -start-3 bg-card border border-border shadow-lg rounded-xl px-3 py-1.5 text-[11px] font-black text-brand animate-floaty">💳 مدى · Apple Pay</span>
          <span className="absolute -bottom-3 -end-3 bg-card border border-border shadow-lg rounded-xl px-3 py-1.5 text-[11px] font-black text-brand animate-floaty" style={{ animationDelay: '1.2s' }}>🧾 تقسيط تابي وتمارا</span>
        </motion.div>
      </section>

      {/* العوالم */}
      <section id="worlds">
        <SectionTitle title="عوالم ضمين الأربعة" sub="اختر عالمك — لكل عالم نافذة حماية تناسبه" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
          {worlds.map((w, i) => {
            const st = visibleStores(stores, w.id);
            const pr = visibleProducts(products, stores, w.id);
            return (
              <motion.button
                key={w.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                onClick={() => go({ name: 'section', id: w.id })}
                className="group relative h-52 md:h-56 rounded-3xl overflow-hidden text-start shadow-sm hover:shadow-xl transition-all"
              >
                <img src={w.img} alt={w.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
                <div className="absolute top-3 start-3 flex items-center gap-2">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow" style={{ background: w.color }}>{w.icon}</span>
                  <span className="text-[10px] font-bold bg-gold/90 text-brand px-2 py-1 rounded-full">🛡️ الحماية {w.win}</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                  <h3 className="font-black text-lg leading-snug">{w.name}</h3>
                  <p className="text-[11px] text-white/80 mt-0.5 line-clamp-1">{w.desc}</p>
                  <div className="flex items-center gap-2 mt-2 text-[11px]">
                    <span className="bg-white/15 backdrop-blur rounded-full px-2.5 py-1 font-bold">{ar(st.length)} متاجر</span>
                    <span className="bg-white/15 backdrop-blur rounded-full px-2.5 py-1 font-bold">{ar(pr.length)} منتج</span>
                    <span className="ms-auto font-black text-gold group-hover:-translate-x-1 transition-transform">تسوّق الآن ←</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* الأكثر مبيعاً */}
      <section>
        <SectionTitle
          title="يتجدّد الآن بين متاجر ضمين"
          sub="الأكثر مبيعاً هذا الأسبوع — انقر أي منتج لتفاصيله"
          action={
            <div className="hidden md:flex gap-1.5">
              <button aria-label="تمرير يميناً" className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-accent" onClick={() => scrollRail(1)}><ChevronRight size={16} /></button>
              <button aria-label="تمرير يساراً" className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-accent" onClick={() => scrollRail(-1)}><ChevronLeft size={16} /></button>
            </div>
          }
        />
        <div ref={rail} className="flex gap-3.5 overflow-x-auto no-scrollbar snap-x pb-1 -mx-1 px-1">
          {trending.map((p, i) => (
            <div key={p.id} className="w-44 md:w-48 shrink-0 snap-start"><ProductCard p={p} index={i} /></div>
          ))}
        </div>
      </section>

      {/* كيف يعمل */}
      <section id="how" className="bg-card rounded-3xl border border-border p-6 md:p-8">
        <SectionTitle title="كيف يعمل ضمين؟" sub="ثلاث خطوات تحمي طرفي كل عملية" />
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { n: '١', ic: <CreditCard size={20} />, t: 'اطلب وادفع', d: 'يُحجز مبلغك في خزنة ضمين المستقلة — لا يلمسه التاجر إطلاقاً حتى رضاك.' },
            { n: '٢', ic: <ShieldCheck size={20} />, t: 'افحص طلبك', d: 'خلال نافذة الحماية الخاصة بالعالم، افحص طلبك بكل راحة وتواصل مع التاجر عبر محادثة مراقبة.' },
            { n: '٣', ic: <BadgeCheck size={20} />, t: 'نحرر المبلغ', d: 'بالرضا أو تلقائياً بانتهاء النافذة — صافي التاجر يُحرر لحظتها، وعمولة ضمين ٢٫٥٪ فقط.' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="relative bg-sand/60 rounded-2xl p-5 border border-border">
              <span className="absolute top-4 end-4 text-4xl font-black text-brand/10">{s.n}</span>
              <span className="w-11 h-11 rounded-2xl bg-brand text-cream flex items-center justify-center mb-3">{s.ic}</span>
              <h3 className="font-extrabold text-ink mb-1.5">{s.t}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* شريط الأرقام */}
      <section className="bg-brand rounded-3xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-cream">
        {[
          { v: ar(visibleStores(stores).length) + '+', l: 'متجر موثوق' },
          { v: ar(visibleProducts(products, stores).length) + '+', l: 'منتج مضمون' },
          { v: '٤', l: 'عوالم متكاملة' },
          { v: '٩٨٪', l: 'رضا العملاء' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center">
            <div className="text-3xl font-black text-gold tabular-nums">{s.v}</div>
            <div className="text-xs text-cream/70 font-bold mt-1">{s.l}</div>
          </motion.div>
        ))}
      </section>

      {/* الأسئلة الشائعة */}
      <section>
        <SectionTitle title="أسئلة يسألها الجميع" />
        <Accordion type="single" collapsible className="bg-card rounded-3xl border border-border px-5 divide-y divide-border">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={'q' + i} className="border-0">
              <AccordionTrigger className="text-start font-extrabold text-sm py-4 hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}

/* ============ شريط التفصيل ============ */
export function Crumbs({ items }: { items: { t: string; go?: () => void }[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-4 flex-wrap" aria-label="مسار التنقل">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronLeft size={12} className="text-border" />}
          {it.go ? <button className="hover:text-brand font-semibold" onClick={it.go}>{it.t}</button> : <span className="font-bold text-ink">{it.t}</span>}
        </span>
      ))}
    </nav>
  );
}

/* ============ صفحة العالم ============ */
export function SectionPage({ id }: { id: string }) {
  const { go, worlds, stores, products } = useDameen();
  const w = worlds.find(x => x.id === id) || worlds[0];
  const st = visibleStores(stores, w.id);
  const pr = visibleProducts(products, stores, w.id);
  return (
    <div className="py-2">
      <Crumbs items={[{ t: 'الرئيسية', go: () => go({ name: 'home' }) }, { t: 'العوالم', go: () => go({ name: 'home' }) }, { t: w.name }]} />
      <div className="relative h-44 md:h-56 rounded-3xl overflow-hidden mb-7 shadow-sm">
        <img src={w.img} alt={w.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-black/75 via-black/40 to-black/20" />
        <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-end text-white">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: w.color }}>{w.icon}</span>
            <span className="text-[11px] font-bold bg-gold/90 text-brand px-2.5 py-1 rounded-full">🛡️ نافذة الحماية: {w.win}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">{w.name}</h1>
          <p className="text-xs md:text-sm text-white/85 mt-1">{w.desc}</p>
        </div>
      </div>
      <section className="mb-8">
        <SectionTitle title="متاجر هذا العالم" sub={`${ar(st.length)} متاجر تعمل الآن`} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {st.map((s, i) => <StoreCardBig key={s.id} s={s} index={i} />)}
        </div>
      </section>
      <section>
        <SectionTitle title="منتجات العالم" sub={`${ar(pr.length)} منتجاً بين يديك`} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {pr.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>
      </section>
    </div>
  );
}

/* ============ صفحة المتجر ============ */
export function StorePage({ id }: { id: string }) {
  const { go, stores, products } = useDameen();
  const s = stores.find(x => x.id === id);
  if (!s) return <EmptyState title="المتجر غير موجود" cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => go({ name: 'home' })}>العودة للرئيسية</Button>} />;
  const pr = s.susp ? [] : products.filter(p => p.store === s.id);
  const w = useDameen.getState().worlds.find(x => x.id === s.sec)!;
  return (
    <div className="py-2">
      <Crumbs items={[{ t: 'الرئيسية', go: () => go({ name: 'home' }) }, { t: w.name, go: () => go({ name: 'section', id: w.id }) }, { t: s.name }]} />
      {s.susp && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-3 text-xs font-bold mb-4">
          <Ban size={15} /> هذا المتجر موقوف مؤقتاً من الإدارة — منتجاته مخفية حتى عودته.
        </div>
      )}
      <div className="relative h-40 md:h-48 rounded-3xl overflow-hidden mb-4 shadow-sm">
        {s.cover ? <img src={s.cover} alt={s.name} className="absolute inset-0 w-full h-full object-cover" /> : <div className="absolute inset-0 bg-sand" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
      </div>
      <div className="bg-card rounded-3xl border border-border p-5 mb-7 -mt-14 mx-auto max-w-3xl relative shadow-md">
        <div className="flex items-start gap-4">
          <span className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shrink-0" style={{ background: s.color }}>
            {s.name.replace(/^دَى?/, '').trim().charAt(0) || 'ض'}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-ink">{s.name}</h1>
              <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full" style={{ background: w.color }}>{w.icon} {w.name}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{s.desc}</p>
            <div className="flex items-center gap-4 mt-2.5 flex-wrap">
              <Stars rt={s.rt} />
              <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1"><StoreIcon size={12} /> {ar(s.sales)} عملية ناجحة</span>
              <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1"><MapPin size={12} /> {s.city}</span>
              <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1"><Package size={12} /> {ar(pr.length)} منتج</span>
            </div>
          </div>
        </div>
      </div>
      {!s.susp && (
        <section>
          <SectionTitle title="منتجات المتجر" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {pr.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}

/* ============ صفحة البحث ============ */
export function SearchPage({ q }: { q: string }) {
  const { go, products, stores } = useDameen();
  const [k, setK] = useState(q);
  const hits = useMemo(() => {
    const t = k.trim();
    if (!t) return visibleProducts(products, stores);
    return visibleProducts(products, stores).filter(p => {
      const st = stores.find(s => s.id === p.store);
      return p.name.includes(t) || p.cat.includes(t) || (st?.name || '').includes(t) || (st?.city || '').includes(t);
    });
  }, [k, products, stores]);
  return (
    <div className="py-2 max-w-3xl mx-auto">
      <div className="relative mb-6">
        <SearchIcon size={17} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={k}
          onChange={e => { setK(e.target.value); go({ name: 'search', q: e.target.value }); }}
          placeholder="ابحث عن منتج أو متجر أو مدينة…"
          className="h-12 rounded-2xl ps-10 text-sm font-semibold shadow-sm"
          aria-label="البحث في ضمين"
        />
      </div>
      <SectionTitle title={k.trim() ? `نتائج «${k.trim()}»` : 'كل المنتجات'} sub={`${ar(hits.length)} نتيجة`} />
      {hits.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="لا نتائج مطابقة"
          sub="جرّب كلمة أقصر أو تصفّح العوالم الأربعة — ربما ما تبحث عنه في عالم آخر."
          cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => go({ name: 'home' })}>تصفّح العوالم</Button>}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {hits.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>
      )}
    </div>
  );
}

/* تصدير للاستخدام في صفحة المنتج */
export const priceOf = eff;
export const LockIcon = Lock;
