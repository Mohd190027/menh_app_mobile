/* صفحة المنتج، بوابة الدفع الموزعة خطوات، وشاشة النجاح */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, ShoppingCart, Truck, Gift, CheckCircle2, ArrowLeft, MapPin,
  CreditCard, Lock, Store as StoreIcon, PartyPopper, KeyRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ar, CITIES, money, PAY_METHODS, REVIEWS_POOL, worldOf } from './data';
import { cartTotals, curPrice, useDameen } from './state';
import { EmptyState, ProductCard, QtyStepper, SectionTitle, Stars } from './ui';
import { Crumbs } from './shop-home';

/* ============ صفحة المنتج ============ */
export function ProductPage({ id }: { id: string }) {
  const { go, addToCart, setCartOpen, products, stores } = useDameen();
  const p = products.find(x => x.id === id);
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  if (!p) return <EmptyState title="المنتج غير موجود" cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => go({ name: 'home' })}>العودة للرئيسية</Button>} />;
  const st = stores.find(x => x.id === p.store)!;
  const w = worldOf(p.store);
  const cur = curPrice(p);
  const similar = products
    .filter(x => x.store === p.store && x.id !== p.id)
    .concat(products.filter(x => x.store !== p.store && stores.find(s => s.id === x.store)?.sec === w.sec && !x.digi))
    .slice(0, 4);
  const buyNow = () => { addToCart(p.id, qty); setCartOpen(false); go({ name: 'checkout' }); };
  return (
    <div className="py-2">
      <Crumbs items={[
        { t: 'الرئيسية', go: () => go({ name: 'home' }) },
        { t: w.name, go: () => go({ name: 'section', id: w.id }) },
        { t: st.name, go: () => go({ name: 'store', id: st.id }) },
        { t: p.name },
      ]} />
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
        {/* المعرض */}
        <div className="space-y-3">
          <div className="relative rounded-3xl overflow-hidden bg-sand shadow-sm h-72 md:h-[26rem]">
            {p.imgs[img] ? (
              <img src={p.imgs[img]} alt={p.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">🛍️</div>
            )}
            {p.off > 0 && <span className="absolute top-3 start-3 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">وفّر {ar(p.off)}٪</span>}
            {p.digi && <span className="absolute top-3 end-3 bg-violet-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">⚡ تسليم رقمي فوري</span>}
          </div>
          {p.imgs.length > 1 && (
            <div className="flex gap-2">
              {p.imgs.map((im, i) => (
                <button key={i} onClick={() => setImg(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === img ? 'border-brand ring-2 ring-gold/50' : 'border-border opacity-70 hover:opacity-100'}`}>
                  <img src={im} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* صندوق الشراء */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-white px-2.5 py-1 rounded-full" style={{ background: w.color }}>{w.icon} {w.name}</span>
            <button className="text-[11px] font-bold text-brand hover:underline inline-flex items-center gap-1" onClick={() => go({ name: 'store', id: st.id })}>
              <StoreIcon size={12} /> {st.name}
            </button>
            <span className="text-[11px] text-muted-foreground">· {p.cat}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-ink leading-snug">{p.name}</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <Stars rt={p.rt} rc={p.rc} />
            <span className="text-[11px] text-muted-foreground">بيع {ar(p.sold)} قطعة</span>
            <span className={`text-[11px] font-bold ${p.stock > 3 ? 'text-emerald-700' : 'text-red-600'}`}>
              {p.stock > 3 ? `متوفر (${ar(p.stock)} قطعة)` : `آخر ${ar(p.stock)} قطع!`}
            </span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-black text-brand">{money(cur)}</span>
            {p.off > 0 && <span className="text-base text-muted-foreground line-through mb-1">{money(p.price)}</span>}
          </div>

          <div className="bg-gold/10 border border-gold/35 rounded-2xl p-3.5 flex items-start gap-3">
            <ShieldCheck size={22} className="text-yellow-700 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <b className="text-ink">نافذة الحماية: {w.win} بعد الاستلام</b>
              <p className="text-muted-foreground mt-0.5">مبلغك محجوز في خزنة ضمين — افحص طلبك براحتك، ولمّا ترضى حرّره بتقييمك. لم يعجبك؟ افتح نزاعاً خلال النافذة.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold text-muted-foreground">الكمية</span>
            <QtyStepper qty={qty} set={q => setQty(Math.max(1, Math.min(q, p.stock)))} max={p.stock} />
            <Button className="flex-1 min-w-40 bg-brand hover:bg-brand-2 font-extrabold h-11 rounded-2xl" onClick={() => addToCart(p.id, qty)}>
              <ShoppingCart size={16} /> أضف إلى السلة
            </Button>
          </div>
          <Button variant="outline" className="w-full border-gold text-yellow-800 hover:bg-gold/10 font-extrabold h-11 rounded-2xl" onClick={buyNow}>
            اشترِ الآن بضمان ضمين <ArrowLeft size={15} />
          </Button>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-muted-foreground">
            <span className="flex items-center gap-1.5 bg-card border border-border rounded-xl p-2.5"><Truck size={14} className="text-brand" /> شحن آلي OTO/Torod — مجاني فوق ٢٠٠</span>
            {p.digi
              ? <span className="flex items-center gap-1.5 bg-card border border-border rounded-xl p-2.5">⚡ يصلك فوراً بعد الدفع في مكتبتك</span>
              : <span className="flex items-center gap-1.5 bg-card border border-border rounded-xl p-2.5"><MapPin size={14} className="text-brand" /> من {st.city} — بوليصة لكل شحنة</span>}
            {p.giftOk
              ? <span className="flex items-center gap-1.5 bg-card border border-border rounded-xl p-2.5"><Gift size={14} className="text-brand" /> قابل للإهداء بتغليف خاص</span>
              : <span className="flex items-center gap-1.5 bg-card border border-border rounded-xl p-2.5"><Lock size={14} className="text-brand" /> محادثة مراقبة بلا أرقام خارجية</span>}
            <span className="flex items-center gap-1.5 bg-card border border-border rounded-xl p-2.5"><CreditCard size={14} className="text-brand" /> مدى وتابي وتمارا وApple Pay</span>
          </div>
        </div>
      </div>

      {/* التبويبات */}
      <div className="mt-10">
        <Tabs defaultValue="details">
          <TabsList className="bg-sand rounded-2xl p-1 h-auto">
            <TabsTrigger value="details" className="rounded-xl px-4 data-[state=active]:bg-card data-[state=active]:text-brand font-bold text-xs">التفاصيل</TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-xl px-4 data-[state=active]:bg-card data-[state=active]:text-brand font-bold text-xs">التقييمات ({ar(p.rc)})</TabsTrigger>
            <TabsTrigger value="ship" className="rounded-xl px-4 data-[state=active]:bg-card data-[state=active]:text-brand font-bold text-xs">الشحن والحماية</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-4 bg-card rounded-3xl border border-border p-5">
            <p className="text-sm text-muted-foreground leading-loose">{p.desc}</p>
            <div className="flex gap-2 mt-4 flex-wrap text-[11px] font-bold">
              <span className="bg-sand rounded-full px-3 py-1.5">التصنيف: {p.cat}</span>
              <span className="bg-sand rounded-full px-3 py-1.5">البائع: {st.name}</span>
              <span className="bg-sand rounded-full px-3 py-1.5">{p.digi ? 'منتج رقمي — تسليم فوري' : 'شحن فعلي موثق'}</span>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4 space-y-3">
            <div className="bg-card rounded-3xl border border-border p-5 flex items-center gap-6 flex-wrap">
              <div className="text-center">
                <div className="text-4xl font-black text-brand">{ar(p.rt, 1)}</div>
                <Stars rt={p.rt} />
                <div className="text-[11px] text-muted-foreground mt-1">{ar(p.rc)} تقييماً موثّقاً</div>
              </div>
              <div className="flex-1 space-y-1.5 min-w-48">
                {[5, 4, 3, 2, 1].map(s => {
                  const pct = s === 5 ? 72 : s === 4 ? 19 : s === 3 ? 6 : s === 2 ? 2 : 1;
                  return (
                    <div key={s} className="flex items-center gap-2 text-[11px]">
                      <span className="w-6 font-bold text-muted-foreground">{ar(s)}★</span>
                      <div className="flex-1 h-2 bg-sand rounded-full overflow-hidden"><div className="h-full bg-gold rounded-full" style={{ width: pct + '%' }} /></div>
                      <span className="w-8 text-muted-foreground tabular-nums">{ar(pct)}٪</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {REVIEWS_POOL.slice(0, 4).map((r, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-ink">{r.name}</span>
                  <Stars rt={r.stars} size={12} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">{r.txt}</p>
                <span className="text-[10px] text-emerald-700 font-bold mt-2 inline-block">✓ عملية مضمونة عبر ضمين</span>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="ship" className="mt-4 bg-card rounded-3xl border border-border p-5 space-y-3 text-sm">
            <div className="flex items-start gap-3 p-3 bg-sand/70 rounded-2xl">
              <Truck size={18} className="text-brand mt-0.5" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                الشحن موحد <b className="text-ink">١٥ ر.س</b> ومجاني عندما يتجاوز طلبك ٢٠٠ ر.س — تصدر بوليصة تتبع آلية عبر شركاء ضمين (OTO وTorod) لكل شحنة على حدة.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gold/10 border border-gold/30 rounded-2xl">
              <ShieldCheck size={18} className="text-yellow-700 mt-0.5" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                بعد الاستلام تبدأ نافذة الحماية الخاصة بعالم <b className="text-ink">{w.name}</b>: <b className="text-ink">{w.win}</b> — بعدها يُحرر المبلغ تلقائياً للتاجر ما لم تفتح نزاعاً.
              </p>
            </div>
            {p.digi && (
              <div className="flex items-start gap-3 p-3 bg-violet-50 border border-violet-200 rounded-2xl">
                <ZapBadge />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  منتج رقمي: يُسلّم فور إتمام الدفع إلى مكتبتك الرقمية — الكود/الملف جاهز خلال ثوانٍ، ويبقى مبلغك محجوزاً حتى نهاية نافذة الحماية.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* مشابهة */}
      {similar.length > 0 && (
        <div className="mt-10">
          <SectionTitle title="قد يعجبك أيضاً" sub={`المزيد من ${w.name}`} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {similar.map((sp, i) => <ProductCard key={sp.id} p={sp} index={i} />)}
          </div>
        </div>
      )}
    </div>
  );
}

const ZapBadge = () => <span className="text-lg">⚡</span>;

/* ============ بوابة الدفع ============ */
export function CheckoutPage() {
  const { session, cart, products, placeOrder, go, openAuth } = useDameen();
  const t = cartTotals(cart, products);
  const [step, setStep] = useState(1);
  const [addr, setAddr] = useState({ name: '', phone: '', city: '', street: '', notes: '' });
  const [pay, setPay] = useState('mada');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  if (!session) {
    return (
      <div className="py-10 max-w-md mx-auto">
        <EmptyState
          icon="🔐"
          title="سجّل دخولك لإتمام الطلب"
          sub="حتى نحجز مبلغك باسمك في خزنة ضمين ونفتح لك نافذة الحماية — الحساب يُنشأ خلال دقيقة."
          cta={<Button className="bg-brand hover:bg-brand-2 font-extrabold" onClick={() => openAuth('login')}>تسجيل الدخول</Button>}
        />
      </div>
    );
  }
  if (cart.length === 0) {
    return (
      <div className="py-10 max-w-md mx-auto">
        <EmptyState icon="🛒" title="سلتك فارغة" sub="أضف منتجات أولاً ثم عد لإتمام الطلب." cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => go({ name: 'home' })}>تصفّح العوالم</Button>} />
      </div>
    );
  }

  const steps = ['العنوان', 'الدفع', 'المراجعة'];
  const walletOk = (session.bal || 0) >= t.total;
  const vErr = (m: string) => <p className="text-[11px] text-red-600 font-bold mt-1">{m}</p>;

  const next1 = () => {
    if (!addr.name.trim() || addr.phone.trim().length < 9 || !addr.city || !addr.street.trim()) {
      setErr('أكمل الاسم والجوال والمدينة والشارع أولاً'); return;
    }
    setErr(''); setStep(2);
  };
  const doPay = () => {
    setBusy(true);
    setTimeout(() => {
      const id = placeOrder({ address: `${addr.city}، ${addr.street}${addr.notes ? ' — ' + addr.notes : ''}`, city: addr.city, pay });
      setBusy(false);
      if (id) go({ name: 'success', id });
    }, 1200);
  };

  return (
    <div className="py-2 max-w-4xl mx-auto">
      <SectionTitle title="إتمام الطلب" sub="مبلغك سيُحجز في خزنة ضمين المستقلة حتى استلامك" />
      {/* مؤشر الخطوات */}
      <div className="flex items-center justify-center gap-0 mb-8 select-none" dir="rtl">
        {steps.map((s, i) => {
          const n = i + 1;
          const active = step === n, done = step > n;
          return (
            <div key={s} className="flex items-center">
              {i > 0 && <span className={`w-10 md:w-16 h-0.5 ${step > i ? 'bg-brand' : 'bg-border'}`} />}
              <div className="flex flex-col items-center gap-1">
                <span className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm transition-all ${done ? 'bg-brand text-cream' : active ? 'bg-gold text-brand ring-4 ring-gold/25' : 'bg-sand text-muted-foreground'}`}>
                  {done ? <CheckCircle2 size={16} /> : ar(n)}
                </span>
                <span className={`text-[10px] font-bold ${active || done ? 'text-brand' : 'text-muted-foreground'}`}>{s}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-3xl border border-border p-5 space-y-4">
              <h3 className="font-extrabold flex items-center gap-2"><MapPin size={17} className="text-brand" /> عنوان التوصيل</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold">الاسم الكامل</Label>
                  <Input className="mt-1" value={addr.name} onChange={e => setAddr({ ...addr, name: e.target.value })} placeholder={session.name} />
                </div>
                <div>
                  <Label className="text-xs font-bold">رقم الجوال</Label>
                  <Input className="mt-1" dir="ltr" value={addr.phone} onChange={e => setAddr({ ...addr, phone: e.target.value })} placeholder="05xxxxxxxx" />
                </div>
                <div>
                  <Label className="text-xs font-bold">المدينة</Label>
                  <Select value={addr.city} onValueChange={v => setAddr({ ...addr, city: v })}>
                    <SelectTrigger className="mt-1 w-full"><SelectValue placeholder="اختر المدينة" /></SelectTrigger>
                    <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-bold">الحي والشارع</Label>
                  <Input className="mt-1" value={addr.street} onChange={e => setAddr({ ...addr, street: e.target.value })} placeholder="حي الياسمين، شارع الأمير سلطان" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-bold">وصف العنوان / ملاحظات المندوب (اختياري)</Label>
                <Input className="mt-1" value={addr.notes} onChange={e => setAddr({ ...addr, notes: e.target.value })} placeholder="مبنى ١٢ — الدور الثاني" />
              </div>
              {err && vErr(err)}
              <Button className="w-full bg-brand hover:bg-brand-2 font-extrabold h-11" onClick={next1}>متابعة إلى الدفع <ArrowLeft size={15} /></Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-3xl border border-border p-5 space-y-4">
              <h3 className="font-extrabold flex items-center gap-2"><CreditCard size={17} className="text-brand" /> وسيلة الدفع</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {PAY_METHODS.map(m => {
                  const disabled = m.id === 'wallet' && !walletOk;
                  const active = pay === m.id;
                  return (
                    <button
                      key={m.id}
                      disabled={disabled}
                      onClick={() => setPay(m.id)}
                      className={`text-start p-3.5 rounded-2xl border-2 transition-all ${active ? 'border-brand bg-brand/5 shadow-sm' : 'border-border hover:border-brand/40'} ${disabled ? 'opacity-45 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-ink">{m.name}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${active ? 'bg-brand text-cream' : 'bg-sand text-muted-foreground'}`}>{m.badge}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                        {m.id === 'wallet' ? (walletOk ? `رصيدك: ${money(session.bal || 0)} — يُخصم من محفظتك` : `رصيدك (${money(session.bal || 0)}) لا يكفي الإجمالي`) : m.desc}
                        {m.id === 'tabby' && t.total > 0 ? ` — ٤ دفعات × ${money(t.total / 4)}` : ''}
                        {m.id === 'tamara' && t.total > 0 ? ` — ٣ دفعات × ${money(t.total / 3)}` : ''}
                      </p>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="font-bold" onClick={() => setStep(1)}>رجوع</Button>
                <Button className="flex-1 bg-brand hover:bg-brand-2 font-extrabold h-11" onClick={() => setStep(3)}>مراجعة الطلب <ArrowLeft size={15} /></Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-3xl border border-border p-5 space-y-4">
              <h3 className="font-extrabold">راجع طلبك قبل الدفع</h3>
              <div className="bg-sand/60 rounded-2xl p-3.5 text-xs space-y-1.5">
                <div className="flex justify-between"><span className="text-muted-foreground">التوصيل إلى</span><span className="font-bold">{addr.city}، {addr.street}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">وسيلة الدفع</span><span className="font-bold">{PAY_METHODS.find(m => m.id === pay)?.name}</span></div>
              </div>
              <div className="space-y-2">
                {cart.map(l => {
                  const p = products.find(x => x.id === l.pid)!;
                  return (
                    <div key={l.pid} className="flex items-center gap-3 text-xs">
                      {p.imgs[0] ? <img src={p.imgs[0]} alt="" className="w-11 h-11 rounded-xl object-cover" /> : <span className="w-11 h-11 rounded-xl bg-sand flex items-center justify-center">🛍️</span>}
                      <span className="flex-1 font-bold text-ink line-clamp-1">{p.name}</span>
                      <span className="text-muted-foreground">×{ar(l.qty)}</span>
                      <span className="font-extrabold text-brand">{money(curPrice(p) * l.qty)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 pt-1">
                <Button variant="outline" className="font-bold" onClick={() => setStep(2)}>رجوع</Button>
                <Button className="flex-1 bg-gold text-brand hover:brightness-105 font-black h-12 text-base" disabled={busy} onClick={doPay}>
                  {busy ? 'جارٍ حجز المبلغ في الخزنة…' : `ادفع ${money(t.total)} بضمان ضمين`}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
                <Lock size={12} className="text-brand" /> لن يستلم التاجر شيئاً حتى تأكيد استلامك — هذه هي ضمانة ضمين
              </p>
            </motion.div>
          )}
        </div>

        {/* ملخص جانبي */}
        <aside className="bg-card rounded-3xl border border-border p-5 h-fit lg:sticky lg:top-20 space-y-3">
          <h3 className="font-extrabold text-sm">ملخص الطلب</h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">المجموع ({ar(cart.length)} منتج)</span><span className="font-bold">{money(t.subtotal)}</span></div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">الشحن</span>
              {t.shipping === 0 ? <span className="font-bold text-emerald-700">مجاني 🎉</span> : <span className="font-bold">{money(t.shipping)}</span>}
            </div>
            <div className="flex justify-between"><span className="text-muted-foreground">ضريبة القيمة المضافة ١٥٪</span><span className="font-bold">{money(t.vat)}</span></div>
            <div className="flex justify-between border-t border-border pt-2 text-sm"><span className="font-extrabold">الإجمالي</span><span className="font-black text-brand">{money(t.total)}</span></div>
          </div>
          <div className="bg-brand/5 border border-brand/20 rounded-2xl p-3 text-[11px] leading-relaxed text-muted-foreground flex items-start gap-2">
            <ShieldCheck size={15} className="text-brand shrink-0 mt-0.5" />
            يُحجز الإجمالي في خزنة ضمين المستقلة. عند الاستلام تبدأ نافذة الحماية، وبعد رضاك يُحرر صافي التاجر (٩٧٫٥٪) وتذهب عمولة ضمين (٢٫٥٪) للإدارة.
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ============ شاشة النجاح ============ */
export function SuccessPage({ id }: { id: string }) {
  const { orders, go, session } = useDameen();
  const o = orders.find(x => x.id === id);
  const [showCode, setShowCode] = useState(false);
  if (!o) return <EmptyState title="الطلب غير موجود" cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => go({ name: 'orders' })}>طلباتي</Button>} />;
  const w = worldOf(o.store);
  return (
    <div className="py-6 max-w-lg mx-auto text-center">
      <motion.div
        initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        className="w-24 h-24 mx-auto rounded-full bg-brand flex items-center justify-center shadow-xl"
      >
        <CheckCircle2 size={52} className="text-gold" strokeWidth={2.2} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h1 className="text-2xl font-black text-ink mt-5 flex items-center justify-center gap-2">
          تم الدفع بنجاح <PartyPopper size={22} className="text-gold" />
        </h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          طلبك رقم <b className="text-brand">#{ar(o.id.replace('DM-', ''))}</b> قيد التجهيز الآن —
          مبلغك <b className="text-ink">{money(o.total)}</b> محجوز في خزنة ضمين حتى استلامك.
        </p>
      </motion.div>
      <div className="bg-card rounded-3xl border border-border p-5 mt-6 text-start space-y-3">
        <div className="space-y-2">
          {o.items.map(it => (
            <div key={it.pid} className="flex justify-between text-xs">
              <span className="font-bold text-ink line-clamp-1">{it.name} ×{ar(it.qty)}</span>
              <span className="font-extrabold text-brand">{money(it.price * it.qty)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-2 flex justify-between text-sm">
          <span className="font-extrabold">الإجمالي المحجوز</span>
          <span className="font-black text-brand">{money(o.total)}</span>
        </div>
        <div className="bg-gold/10 border border-gold/30 rounded-2xl p-3 text-[11px] leading-relaxed text-muted-foreground">
          🛡️ عند الاستلام تبدأ نافذة الحماية الخاصة بعالم <b className="text-ink">{w.name}</b> ({w.win}) —
          افحص طلبك وقيّم لتحرير مستحقات التاجر، أو افتح نزاعاً إن لم يعجبك.
        </div>
        {o.code && (
          <div className="bg-violet-50 border border-violet-200 rounded-2xl p-3.5 text-center">
            <div className="text-xs font-extrabold text-violet-800 mb-2 flex items-center justify-center gap-1.5"><KeyRound size={14} /> مشترياتك الرقمية جاهزة</div>
            {showCode
              ? <div className="font-black text-lg tracking-widest text-violet-900" dir="ltr">{o.code}</div>
              : <Button size="sm" variant="outline" className="border-violet-300 text-violet-800 font-bold" onClick={() => setShowCode(true)}>اكشف كود الاستلام</Button>}
          </div>
        )}
      </div>
      <div className="flex gap-3 mt-6">
        <Button className="flex-1 bg-brand hover:bg-brand-2 font-extrabold h-11" onClick={() => go({ name: 'orders' })}>تتبع طلبك</Button>
        <Button variant="outline" className="flex-1 font-bold h-11" onClick={() => go({ name: 'home' })}>متابعة التسوق</Button>
      </div>
      {!session && <p className="text-[11px] text-muted-foreground mt-4">سجّل دخولك لمتابعة طلباتك</p>}
    </div>
  );
}
