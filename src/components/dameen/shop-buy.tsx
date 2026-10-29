/* صفحة المنتج الكاملة + بوابة الطلب بثلاث خطوات مع خيارات التسليم لكل شحنة + شاشة النجاح */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ShieldCheck, ShoppingCart, Truck, Gift, CheckCircle2, ArrowLeft, MapPin,
  CreditCard, Lock, Store as StoreIcon, PartyPopper, KeyRound, Star, Heart, Navigation,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ar, CITIES, money, PAY_METHODS, PAY_LABELS, worldOf, type Product } from './data';
import { cartCalc, eff, useDameen, useMe, type Order } from './state';
import { EmptyState, ProductCard, QtyStepper, SectionTitle, Stars } from './ui';
import { Crumbs } from './shop-home';

/* ============ شارات التسليم الخاصة بالمنتج ============ */
export function DlBadge({ p }: { p: Product }) {
  const M: Record<string, { ic: string; l: string; d: string }> = {
    chilled: { ic: '🧊', l: 'توصيل مبرد — حساس للحرارة', d: 'مندوب مجهز بحافظة برودة (Cooling Box) داخل نفس المدينة، أو شحن مبرد بين المدن عبر شركات مبردة متعاقدة (OTO/Torod) حسب موقعك.' },
    instant: { ic: '🛵', l: 'توصيل فوري', d: 'يبحث النظام عن مندوب فوري فور تأكيد الطلب داخل مدينة المتجر فقط — التسليم المتوقع خلال ٤٥ دقيقة حفاظاً على حرارة الطبق.' },
    field: { ic: '🎪', l: 'خدمة ديكور وتنسيق ميداني', d: 'بلا شحن تجاري: فريق المتجر يوصل ويركّب في موقع المناسبة (أو تستلم من مقر المتجر)، مع حجز موعد مسبق ودردشة تنسيق بعد الدفع لإرسال موقعك.' },
    digital: { ic: '⚡', l: 'منتج رقمي — تسليم فوري', d: 'الكود/الملف يوصلك لحظة الدفع في «مكتبتك الرقمية» عبر رابط مؤقت آمن (S3 Signed) صالح ١٠ دقائق — ٠ ر.س شحن ولا انتظار.' },
    ship: { ic: '📦', l: 'قابل للشحن', d: 'تُصدر له بوليصة آلية عبر شركاء ضمين اللوجستيين (OTO/Torod).' },
  };
  const m = M[p.ptype];
  if (!m && !p.fragile) return null;
  return (
    <div className="flex gap-2.5 items-start bg-sand/60 border border-dashed border-border rounded-xl p-2.5 mb-2.5">
      {m && <span className="text-lg leading-none mt-0.5">{m.ic}</span>}
      <div className="min-w-0 text-[11px] leading-relaxed">
        {m && <b className="block text-[12px] text-ink">{m.l}</b>}
        {m && <span className="text-muted-foreground">{m.d}</span>}
        {p.fragile && <div className="text-amber-800 font-bold mt-1">⚠️ قابل للكسر — تنبيه تلقائي في بوليصة الشحن + رسوم حماية ١٥ ر.س تُضاف لسعر الشحن</div>}
        {p.customOk && <div className="text-amber-700 font-bold mt-1">✏️ قابل للتعديل حسب طلبك — بعد الدفع تفتح دردشة التعديلات مع التاجر (طلب أي مبلغ إضافي يكون بضمان ضمين)</div>}
        {p.giftOk && <div className="text-amber-700 font-bold mt-1">🎁 قابل للإهداء — يكفي جوال المستلم ومدينته عند إتمام الطلب</div>}
      </div>
    </div>
  );
}

/* ============ أسئلة التاجر المخصصة (إجابة إجبارية قبل السلة) ============ */
function ProdQuestions({ p, answers, setAnswers, color }: { p: Product; answers: Record<number, string>; setAnswers: (a: Record<number, string>) => void; color: string }) {
  if (!p.qs || p.qs.length === 0) return null;
  return (
    <div className="rounded-xl border border-gold/40 bg-gold/5 p-3 mb-2.5">
      <b className="text-[12.5px] block mb-2">❓ أسئلة من التاجر — أجب عنها قبل الإضافة للسلة</b>
      <div className="space-y-2.5">
        {p.qs.map((q, i) => (
          <div key={i}>
            <Label className="text-[11.5px] font-bold">{q.q}</Label>
            {q.t === 'opts' ? (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {q.o.map(o => (
                  <button
                    key={o}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all ${answers[i] === o ? 'text-white border-transparent shadow' : 'bg-card text-ink border-border hover:border-brand'}`}
                    style={answers[i] === o ? { background: color } : undefined}
                    onClick={() => setAnswers({ ...answers, [i]: o })}
                  >{o}</button>
                ))}
              </div>
            ) : (
              <Input className="mt-1.5 text-xs h-9" placeholder="اكتب جوابك هنا…" value={answers[i] || ''} onChange={e => setAnswers({ ...answers, [i]: e.target.value })} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ صفحة المنتج ============ */
export function ProductPage({ id }: { id: string }) {
  const { go, addToCart, setCartOpen, products, stores, session, toggleFav, favorites, rateProduct } = useDameen();
  const me = useMe();
  const p = products.find(x => x.id === id);
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('desc');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [myStars, setMyStars] = useState(0);
  const [myTxt, setMyTxt] = useState('');
  if (!p) return <EmptyState title="المنتج غير موجود" cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => go({ name: 'home' })}>العودة للرئيسية</Button>} />;
  const st = stores.find(x => x.id === p.store)!;
  const w = worldOf(p.store);
  const cur = eff(p);
  const fav = favorites.includes(p.id);
  const similar = products.filter(x => x.id !== p.id && stores.find(s => s.id === x.store)?.sec === st.sec && !stores.find(s => s.id === x.store)?.susp).slice(0, 4);
  const gal = p.imgs.length > 1 ? p.imgs : [p.imgs[0], p.imgs[0]];
  const myRating = session && p.ratings.find(r => r.by === session.phone);
  const answeredAll = !p.qs || p.qs.every((q, i) => String(answers[i] || '').trim());

  const tryAdd = (buyNow?: boolean) => {
    if (p.qs && p.qs.length && !answeredAll) {
      const el = document.getElementById('pqwrap');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const ans = p.qs && p.qs.length ? p.qs.map((q, i) => ({ q: q.q, a: String(answers[i] || '').trim() })) : undefined;
    addToCart(p.id, qty, ans);
    if (buyNow) { setCartOpen(true); }
  };

  return (
    <div>
      <Crumbs items={[{ t: w.name, go: () => go({ name: 'section', id: w.id }) }, { t: st.name, go: () => go({ name: 'store', id: st.id }) }, { t: p.name }]} />
      <div className="grid md:grid-cols-2 gap-6 mt-3">
        {/* المعرض */}
        <div>
          <div className="rounded-2xl overflow-hidden border border-border bg-sand aspect-square">
            <img src={gal[img] || ''} alt={p.name} className="w-full h-full object-cover" />
          </div>
          {p.imgs.length > 1 && (
            <div className="flex gap-2 mt-2">
              {p.imgs.map((im, i) => (
                <button key={i} className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === img ? 'border-brand' : 'border-transparent opacity-60 hover:opacity-100'}`} onClick={() => setImg(i)}>
                  <img src={im} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="mt-3 rounded-xl bg-brand/5 border border-brand/20 p-3 flex gap-2.5 items-start">
            <ShieldCheck size={22} className="text-brand shrink-0 mt-0.5" />
            <p className="text-[11.5px] leading-relaxed text-ink">
              <b className="block">حماية ضمين مفعّلة على هذا المنتج</b>
              مبلغك يُحجز في خزنة مستقلة، ونافذة فحص القسم «{w.name}» هي <b>{w.win}</b> بعد الاستلام — للطلب أو الاسترجاع قبل التحرير.
            </p>
          </div>
        </div>

        {/* التفاصيل */}
        <div>
          <div className="flex items-start gap-2">
            <h1 className="text-xl font-black text-ink flex-1 leading-snug">{p.name}</h1>
            <button aria-label="المفضلة" className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${fav ? 'bg-red-50 border-red-200 text-red-500' : 'border-border text-muted-foreground hover:text-red-400'}`} onClick={() => toggleFav(p.id)}>
              <Heart size={16} className={fav ? 'fill-red-500 text-red-500' : ''} />
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-1.5 text-[12px] text-muted-foreground">
            <Stars rt={p.rt} rc={p.rc} size={13} />
            <span>· بيع {ar(p.sold)} مرة</span>
            <span>· {p.stock > 0 ? `متوفر (${ar(p.stock)})` : 'نفدت الكمية'}</span>
          </div>
          <div className="flex items-baseline gap-2.5 mt-3">
            <span className="text-3xl font-black text-brand">{money(cur)}</span>
            {p.off > 0 && <><s className="text-sm text-muted-foreground">{money(p.price)}</s><span className="text-[11px] font-extrabold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">وفّر {ar(p.off)}٪</span></>}
          </div>
          {p.pts > 0 && <div className="text-[11.5px] font-bold text-amber-700 mt-2">🌟 يمنح هذا المنتج {ar(p.pts)} نقطة ولاء للعميل عند تحرير الطلب</div>}

          <div className="mt-3"><DlBadge p={p} /></div>

          <div id="pqwrap"><ProdQuestions p={p} answers={answers} setAnswers={setAnswers} color={st.color} /></div>
          {p.qs && p.qs.length > 0 && !answeredAll && (
            <p className="text-[11px] font-bold text-red-600 mb-2">أجب عن أسئلة التاجر أعلاه لتفعيل زر الشراء</p>
          )}

          <p className="text-[12px] text-muted-foreground mt-2">
            يبيعه متجر <button className="font-extrabold hover:underline" style={{ color: st.color }} onClick={() => go({ name: 'store', id: st.id })}>{st.name}</button> ★ {ar(st.rt, 1)} · شحنة ضمن {w.win} حماية · يشحن من 📍 {st.city}
          </p>

          <div className="flex gap-2.5 items-center mt-4 flex-wrap">
            <QtyStepper qty={qty} set={q => setQty(Math.max(1, Math.min(q, p.stock || 1)))} max={p.stock} />
            <Button className="flex-1 min-w-40 bg-brand hover:bg-brand-2 font-extrabold h-11" disabled={!p.stock || !answeredAll} onClick={() => tryAdd(false)}>
              <ShoppingCart size={16} className="me-1" /> أضف إلى السلة
            </Button>
            <Button className="flex-1 min-w-36 bg-gold text-brand hover:brightness-105 font-extrabold h-11" disabled={!p.stock || !answeredAll} onClick={() => tryAdd(true)}>
              اشترِ الآن
            </Button>
          </div>

          <Tabs value={tab} onValueChange={setTab} className="mt-4">
            <TabsList className="w-full">
              <TabsTrigger value="desc" className="flex-1 text-xs">الوصف</TabsTrigger>
              <TabsTrigger value="specs" className="flex-1 text-xs">المواصفات</TabsTrigger>
              <TabsTrigger value="revs" className="flex-1 text-xs">التقييمات ({ar(p.rc)})</TabsTrigger>
            </TabsList>
            <TabsContent value="desc" className="text-[13.5px] leading-loose text-ink mt-3">{p.desc}</TabsContent>
            <TabsContent value="specs" className="mt-3">
              {Object.keys(p.specs || {}).length === 0 ? <p className="text-xs text-muted-foreground">لا مواصفات مفصلة لهذا المنتج</p> : (
                <div className="rounded-xl border border-border overflow-hidden">
                  {Object.entries(p.specs).map(([k, v], i) => (
                    <div key={k} className={`flex justify-between gap-3 px-3 py-2 text-xs ${i % 2 ? 'bg-sand/40' : 'bg-card'}`}>
                      <span className="text-muted-foreground font-semibold">{k}</span>
                      <b className="text-ink">{v}</b>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="revs" className="mt-3 space-y-3">
              {session && !myRating && (
                <div className="rounded-xl border border-border bg-card p-3">
                  <b className="text-xs">أضف تقييمك للمنتج</b>
                  <div className="flex gap-1 my-2" dir="ltr">
                    {[1, 2, 3, 4, 5].map(i => (
                      <button key={i} aria-label={`${i} نجوم`} onClick={() => setMyStars(i)}><Star size={22} className={i <= myStars ? 'fill-gold text-gold' : 'text-border'} /></button>
                    ))}
                  </div>
                  <Textarea className="text-xs min-h-16" placeholder="شارك تجربتك بالتفصيل…" value={myTxt} onChange={e => setMyTxt(e.target.value)} />
                  <Button size="sm" className="mt-2 bg-brand hover:bg-brand-2 font-bold" onClick={() => { if (!myStars) return; rateProduct(p.id, myStars, myTxt); setMyStars(0); setMyTxt(''); }}>إرسال التقييم</Button>
                </div>
              )}
              {me && p.ratings.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">لا تقييمات بعد — كن أول من يشارك تجربته</p>}
              {p.ratings.slice().reverse().map((r, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-full bg-sand flex items-center justify-center text-sm">👤</span>
                    <b className="text-xs">{r.name || 'عميل'}</b>
                    <Stars rt={r.stars} size={11} />
                  </div>
                  {r.txt && <p className="text-xs text-ink leading-relaxed mt-1.5">{r.txt}</p>}
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-10">
          <SectionTitle title={`منتجات مشابهة من ${w.name}`} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{similar.map((sp, i) => <ProductCard key={sp.id} p={sp} index={i} />)}</div>
        </div>
      )}
    </div>
  );
}

/* ============ بوابة الطلب ============ */
export function CheckoutPage() {
  const d = useDameen();
  const { cart, products, stores, session, go, placeOrder, cartSel, coupons, ptsVal, freeDlPts } = d;
  const me = useMe();
  const [step, setStep] = useState(session ? 1 : 0);
  const [lgId, setLgId] = useState('0500000001');
  const [lgPw, setLgPw] = useState('1234');
  const [addrIdx, setAddrIdx] = useState(() => {
    const def = me?.addrs.findIndex(a => a.def) ?? -1;
    return def >= 0 ? def : (me?.addrs.length ? 0 : -1);
  });
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null);
  const [pay, setPay] = useState('mada');
  const [newAddr, setNewAddr] = useState({ t: '', c: '', a: '' });
  const [book, setBook] = useState<Record<string, { dl: string; date: string; setup: string; tear: string; note: string; geo: { lat: number; lng: number } | null }>>({});
  const [gift, setGift] = useState<Record<string, { on: boolean; name: string; phone: string; city: string }>>({});
  const [ans, setAns] = useState<Record<string, string[]>>({});

  if (cart.length === 0) {
    return <EmptyState icon="🛒" title="سلتك فارغة" sub="أضف منتجات قبل إتمام الطلب" cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => go({ name: 'home' })}>ابدأ التسوق ←</Button>} />;
  }
  const city = addrIdx >= 0 && me?.addrs[addrIdx] ? me.addrs[addrIdx].a.split('،')[0].trim() : cartSel.city;
  const t = cartCalc(cart, products, stores, city, cartSel.coupon, coupons, cartSel.pts, cartSel.freeDl, me, ptsVal, freeDlPts);
  const groups = Object.values(t.groups);
  const blocked = groups.filter(g => g.quote.blocked);

  const setB = (sid: string, k: string, v: string | { lat: number; lng: number } | null) => setBook(b => ({ ...b, [sid]: { ...(b[sid] || { dl: 'field', date: '', setup: '', tear: '', note: '', geo: null }), [k]: v } }));
  const setG = (sid: string, k: string, v: string | boolean) => setGift(g => ({ ...g, [sid]: { ...(g[sid] || { on: false, name: '', phone: '', city: '' }), [k]: v } }));

  const getGeo = () => {
    if (!navigator.geolocation) return;
    const set = (p: GeolocationPosition) => { setGeo({ lat: +p.coords.latitude.toFixed(4), lng: +p.coords.longitude.toFixed(4) }); };
    navigator.geolocation.getCurrentPosition(set, () => {}, { timeout: 8000 });
  };
  const getEventGeo = (sid: string) => {
    if (!navigator.geolocation) return;
    const set = (p: GeolocationPosition) => setB(sid, 'geo', { lat: +p.coords.latitude.toFixed(4), lng: +p.coords.longitude.toFixed(4) });
    navigator.geolocation.getCurrentPosition(set, () => {}, { timeout: 8000 });
  };

  const doPlace = () => {
    const r = placeOrder({ addr: me?.addrs[addrIdx]?.a || city, city, pay, book, gift, ans });
    if (r) go({ name: 'success', id: r.id });
    else setStep(1);
  };

  const steps = ['الحساب', 'الموقع والتسليم', 'الدفع'];
  return (
    <div className="max-w-3xl mx-auto">
      <SectionTitle title="🔒 بوابة الطلب الآمن" sub="مبلغك يُحجز في خزنة ضمين المستقلة — لا يصل للتاجر إلا بعد رضاك" />
      {/* مؤشر الخطوات */}
      <div className="flex items-center gap-2 mb-5">
        {steps.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1.5 rounded-full ${i < step ? 'bg-brand' : i === step ? 'bg-gold' : 'bg-border'}`} />
            <div className={`text-[10.5px] font-bold mt-1 text-center ${i <= step ? 'text-ink' : 'text-muted-foreground'}`}>{i + 1}. {s}</div>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="bg-brand/5 border border-brand/20 rounded-xl p-3 text-xs leading-relaxed">
            <b>🛡️ خطوة واحدة قبل الحجز</b>
            <p className="text-muted-foreground mt-1">سلتك محفوظة كما هي — سجّل دخولك أو أنشئ حساباً لإكمال الحجز في خزنة ضمين.</p>
          </div>
          <div>
            <Label className="text-xs font-bold">رقم الجوال أو البريد</Label>
            <Input value={lgId} onChange={e => setLgId(e.target.value)} className="mt-1" dir="ltr" />
          </div>
          <div>
            <Label className="text-xs font-bold">كلمة المرور</Label>
            <Input type="password" value={lgPw} onChange={e => setLgPw(e.target.value)} className="mt-1" dir="ltr" />
          </div>
          <Button className="w-full bg-brand hover:bg-brand-2 font-extrabold" onClick={() => { if (d.login(lgId, lgPw) && useDameen.getState().session?.role === 'customer') { setStep(1); setAddrIdx(0); } }}>دخول ومتابعة ←</Button>
          <p className="text-[11px] text-muted-foreground text-center">جديد على ضمين؟ <button className="text-brand font-extrabold" onClick={() => d.openAuth('reg')}>أنشئ حساباً</button> ثم عُد لإتمام طلبك.</p>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          {/* العنوان */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <b className="text-sm flex items-center gap-1.5"><MapPin size={15} className="text-brand" /> عنوان التسليم</b>
            <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">🚚 التوصيل عبر شركاء ضمين اللوجستيين (OTO / Torod) فقط — لا يوجد استلام شخصي «يد بيد»، ويُتابع الطلب بالحالات لحفظ حقوق الطرفين.</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <Button variant="outline" size="sm" className="text-xs" onClick={getGeo}>🛰️ تحديد موقعي تلقائياً</Button>
              {geo && <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">✓ تم تحديد الموقع ({ar(geo.lat)}، {ar(geo.lng)})</span>}
            </div>
            <div className="mt-3 space-y-2">
              {me?.addrs.map((a, i) => (
                <button key={i} className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border-2 text-start transition-all ${addrIdx === i ? 'border-brand bg-brand/5' : 'border-border hover:border-brand/40'}`} onClick={() => setAddrIdx(i)}>
                  <span className={`w-4 h-4 rounded-full border-2 shrink-0 ${addrIdx === i ? 'border-brand bg-brand' : 'border-border'}`} />
                  <span className="flex-1 min-w-0">
                    <b className="text-xs">{a.t} {a.def && <span className="text-[9px] bg-emerald-100 text-emerald-700 rounded-full px-1.5 py-0.5">افتراضي</span>}</b>
                    <span className="block text-[11px] text-muted-foreground">{a.a}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-xl border border-dashed border-border p-3">
              <b className="text-xs">➕ عنوان جديد</b>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input className="text-xs h-9" placeholder="الاسم المختصر (المنزل)" value={newAddr.t} onChange={e => setNewAddr({ ...newAddr, t: e.target.value })} />
                <Select value={newAddr.c} onValueChange={v => setNewAddr({ ...newAddr, c: v })}>
                  <SelectTrigger className="text-xs h-9"><SelectValue placeholder="المدينة" /></SelectTrigger>
                  <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Input className="text-xs h-9 mt-2" placeholder="الحي، الشارع، رقم المبنى…" value={newAddr.a} onChange={e => setNewAddr({ ...newAddr, a: e.target.value })} />
              <Button variant="outline" size="sm" className="mt-2 text-xs" onClick={() => { if (newAddr.t && newAddr.a) { useDameen.setState(s => ({ users: { ...s.users, [s.session!.phone]: { ...s.users[s.session!.phone], addrs: [...s.users[s.session!.phone].addrs, { t: newAddr.t, a: (newAddr.c ? newAddr.c + '، ' : '') + newAddr.a }] } } })); setAddrIdx((me?.addrs.length) || 0); setNewAddr({ t: '', c: '', a: '' }); } }}>حفظ العنوان</Button>
            </div>
          </div>

          {/* خيارات التسليم لكل شحنة */}
          {groups.map(grp => {
            const s = stores.find(x => x.id === grp.sid)!;
            const q = grp.quote;
            const w = worldOf(grp.sid);
            const blocks: React.ReactNode[] = [];
            if (w.id === 'family' && s.qs && s.qs.length) {
              blocks.push(
                <div key="qs">
                  <b className="text-[11.5px] block mb-1.5">❓ أسئلة «{s.name}» قبل إعداد طلبك</b>
                  <div className="space-y-1.5">
                    {s.qs.map((qq, i) => (
                      <div key={i}>
                        <Label className="text-[11px] font-bold">{qq}</Label>
                        <Input className="text-xs h-9 mt-1" value={(ans[grp.sid] || [])[i] || ''} onChange={e => { const cur = [...(ans[grp.sid] || [])]; cur[i] = e.target.value; setAns({ ...ans, [grp.sid]: cur }); }} />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5">تصلك إجاباتك مع الطلب مباشرة — أسئلة يحددها المتجر لقسم المأكولات والضيافة.</p>
                </div>
              );
            }
            if (q.mode === 'chilled') blocks.push(<p key="ch" className="text-[11px] leading-relaxed">🧊 هذه الشحنة تضم منتجات حساسة للحرارة — {city === s.city ? 'سيُرسل مندوب مجهز بحافظة برودة (Cooling Box) داخل المدينة نفسها' : 'ستُشحن مبردة بين المدن عبر شركات الشحن المبرد المتعاقدة عبر بوابة OTO/Torod'} بعد تأكيد الطلب.</p>);
            if (q.mode === 'instant' && !q.blocked) blocks.push(<p key="in" className="text-[11px] leading-relaxed">🛵 أطباق طازجة — سيبحث النظام عن مندوب فوري فور تأكيد طلبك داخل {city} فقط (نطاق {ar(s.rangeKm || 20)} كم حول مدينة المتجر «{s.city}»)، ووقت التوصيل المتوقع ٤٥ دقيقة.</p>);
            if (q.blocked) blocks.push(<p key="bl" className="text-[11px] leading-relaxed text-red-600 font-bold">⛔ {q.blocked}</p>);
            if (q.mode === 'digital') blocks.push(<p key="dg" className="text-[11px] leading-relaxed">⚡ منتجات رقمية — يُسلّم الكود/الملف فور الدفع إلى «مكتبتك الرقمية» عبر رابط مؤقت آمن (S3 Signed) صالح ١٠ دقائق، بدون شحن وبدون انتظار.</p>);
            if (q.fragile) blocks.push(<p key="fr" className="text-[11px] leading-relaxed">⚠️ شحنة قابلة للكسر — تُنقل العلامة آلياً لشركة الشحن (OTO/Torod) مع تنبيه تغليف خاص إلزامي في البوليصة، ورسوم حماية ١٥ ر.س مدرجة ضمن الشحن.</p>);
            if (grp.items.some(x => x.p.customOk)) blocks.push(<p key="cu" className="text-[11px] leading-relaxed">✏️ هذا المتجر يقبل التعديلات حسب طلبك — بعد الدفع تفتح دردشة التعديلات مباشرة مع التاجر، ويقدر يطلب مبلغاً إضافياً لأي إضافة (يُحجز بضمان ضمين).</p>);
            if (w.id === 'deco' && grp.items.some(x => x.p.giftOk)) {
              const g = gift[grp.sid] || { on: false, name: '', phone: '', city: '' };
              blocks.push(
                <div key="gift">
                  <div className="flex items-center justify-between">
                    <b className="text-[11.5px]">🎁 إهداء لشخص آخر</b>
                    <button className={`w-10 h-5.5 h-[22px] rounded-full transition-colors relative ${g.on ? 'bg-brand' : 'bg-border'}`} onClick={() => setG(grp.sid, 'on', !g.on)} aria-label="تفعيل الإهداء">
                      <span className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-all ${g.on ? 'start-0.5' : 'end-0.5'}`} />
                    </button>
                  </div>
                  {g.on && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <Label className="text-[11px] font-bold">جوال المستلم (05xxxxxxxx)</Label>
                        <Input className="text-xs h-9 mt-1" dir="ltr" placeholder="05xxxxxxxx" value={g.phone} onChange={e => setG(grp.sid, 'phone', e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-[11px] font-bold">مدينة المستلم</Label>
                        <Input className="text-xs h-9 mt-1" placeholder="الرياض" value={g.city} onChange={e => setG(grp.sid, 'city', e.target.value)} />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-[11px] font-bold">اسم المستلم (اختياري — يُطبع على بطاقة الإهداء)</Label>
                        <Input className="text-xs h-9 mt-1" value={g.name} onChange={e => setG(grp.sid, 'name', e.target.value)} />
                      </div>
                    </div>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1.5">يكفي جوال المستلم ومدينته — تصدر البوليصة باسمه فتوصله الهدية مباشرة، وكل التواصل عبر ضمين فقط.</p>
                </div>
              );
            }
            if (q.mode === 'field') {
              const b = book[grp.sid] || { dl: 'field', date: '', setup: '', tear: '', note: '', geo: null };
              blocks.push(
                <div key="field">
                  <b className="text-[11.5px] block mb-1.5">🎪 حجز موعد المناسبة (إلزامي لخدمة التنسيق الميداني)</b>
                  <div className="space-y-1.5">
                    <div>
                      <Label className="text-[11px] font-bold">🚚 طريقة تسليم المناسبة</Label>
                      <Select value={b.dl} onValueChange={v => setB(grp.sid, 'dl', v)}>
                        <SelectTrigger className="text-xs h-9 mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="field">فريق المتجر يوصل ويركّب في موقع المناسبة</SelectItem>
                          <SelectItem value="pickup">استلام من مقر المتجر — بلا توصيل (التنسيق عبر دردشة ضمين بعد الدفع)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-[11px] font-bold">تاريخ المناسبة</Label>
                        <Input type="date" className="text-xs h-9 mt-1" value={b.date} onChange={e => setB(grp.sid, 'date', e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-[11px] font-bold">وقت التركيب</Label>
                        <Input type="time" className="text-xs h-9 mt-1" value={b.setup} onChange={e => setB(grp.sid, 'setup', e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-[11px] font-bold">وقت الفك / الاسترجاع</Label>
                        <Input type="time" className="text-xs h-9 mt-1" value={b.tear} onChange={e => setB(grp.sid, 'tear', e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-[11px] font-bold">ملاحظة لفريق التنسيق</Label>
                        <Input className="text-xs h-9 mt-1" placeholder="مثال: الدخول من البوابة الشمالية" value={b.note} onChange={e => setB(grp.sid, 'note', e.target.value)} />
                      </div>
                    </div>
                    <div className="flex gap-2 items-center flex-wrap">
                      <Button variant="outline" size="sm" className="text-xs" onClick={() => getEventGeo(grp.sid)}>📍 مشاركة موقع المناسبة (GPS)</Button>
                      {b.geo ? <span className="text-[11px] font-bold text-emerald-700">✓ وصل الموقع لفريق التنسيق ({ar(b.geo.lat)}، {ar(b.geo.lng)})</span> : <span className="text-[10px] text-muted-foreground">لتوجيه فريق التنسيق بدقة يوم المناسبة</span>}
                    </div>
                  </div>
                </div>
              );
            }
            if (blocks.length === 0) return null;
            return (
              <div key={grp.sid} className="rounded-2xl border bg-card p-4" style={{ borderColor: s.color + '55' }}>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2.5">
                  <b className="text-[12.5px]">🚚 خيارات التسليم — {s.name}</b>
                  <span className="text-[10px] font-bold rounded-full px-2 py-0.5" style={{ background: s.color + '18', color: s.color }}>{q.label}</span>
                </div>
                <div className="space-y-3">{blocks.map((b, i) => <div key={i}>{i > 0 && <div className="border-t border-dashed border-border my-2.5" />}{b}</div>)}</div>
              </div>
            );
          })}

          <div className="flex gap-2">
            <Button variant="outline" className="font-bold" onClick={() => setStep(Math.max(session ? 1 : 0, step - 1))}>→ رجوع</Button>
            <Button
              className="flex-1 bg-brand hover:bg-brand-2 font-extrabold"
              disabled={addrIdx < 0 || blocked.length > 0}
              onClick={() => {
                const missing = groups.find(g => g.quote.mode === 'field' && (!book[g.sid] || !book[g.sid].date || !book[g.sid].setup));
                if (missing) { toast.error('أكمل حجز موعد المناسبة (التاريخ ووقت التركيب) لشحنة ' + (stores.find(s => s.id === missing.sid)?.name || '')); return; }
                setStep(2);
              }}
            >
              {blocked.length > 0 ? '⛔ أزل الشحنة المحجوبة أولاً' : 'متابعة للدفع ←'}
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <b className="text-sm flex items-center gap-1.5"><CreditCard size={15} className="text-brand" /> طريقة الدفع</b>
            <p className="text-[11px] text-muted-foreground mt-1">يُخصم المبلغ منك ويُحجز في خزنة ضمين المستقلة — لا يصل للتاجر مباشرة.</p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {PAY_METHODS.map(m => (
                <button key={m.id} className={`p-2.5 rounded-xl border-2 text-start transition-all ${pay === m.id ? 'border-brand bg-brand/5 shadow-sm' : 'border-border hover:border-brand/40'}`} onClick={() => setPay(m.id)}>
                  <b className="text-xs block">{m.name}</b>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                    {m.id === 'bal' ? `رصيدك ${ar(me?.bal || 0)} ر.س` : m.desc}
                    {m.id === 'tabby' && t.total > 0 ? ` — ٤ دفعات × ${money(Math.round(t.total / 4 * 100) / 100)}` : ''}
                    {m.id === 'tamara' && t.total > 0 ? ` — ٣ دفعات × ${money(Math.round(t.total / 3 * 100) / 100)}` : ''}
                  </span>
                </button>
              ))}
            </div>
            {pay === 'bal' && (me?.bal || 0) < t.total && <p className="text-[11px] text-red-600 font-bold mt-2">⚠️ رصيد محفظتك لا يكفي — اختر طريقة أخرى.</p>}
            {pay === 'visa' && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                <Input className="text-xs h-9" placeholder="٤٢٤٢ ٤٢٤٢ ٤٢٤٢ ٤٢٤٢" dir="ltr" />
                <Input className="text-xs h-9" placeholder="١٢/٢٨ · ١٢٣" dir="ltr" />
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 space-y-1.5 text-sm">
            <b className="text-[12.5px] block mb-1">🧮 كيف يتوزع مبلغك؟</b>
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">المنتجات والشحن (بعد الخصومات)</span><b>{money(t.net)}</b></div>
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">ضريبة القيمة المضافة ١٥٪</span><b>{money(t.tax)}</b></div>
            <div className="flex justify-between border-t border-border pt-1.5"><span className="font-extrabold">إجمالي الحجز في الخزنة</span><b className="text-brand text-lg">{money(t.total)}</b></div>
            <div className="flex justify-between text-[11px] text-muted-foreground"><span>التسليم إلى</span><span className="font-bold max-w-60 text-end">{me?.addrs[addrIdx]?.a || city}</span></div>
            <p className="text-[10.5px] text-muted-foreground leading-relaxed pt-1">قيمة المنتجات: صافي التاجر بعد عمولة ضمين (تحددها الإدارة لكل تصنيف) · رسوم الشحن: تُحوّل للشريك اللوجستي · الضريبة ١٥٪: لصالح هيئة الزكاة والضريبة — والتحرير لا يتم إلا بعد استلامك ورضاك.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="font-bold" onClick={() => setStep(1)}>→ رجوع</Button>
            <Button className="flex-1 bg-gold text-brand hover:brightness-105 font-black h-11" disabled={pay === 'bal' && (me?.bal || 0) < t.total} onClick={doPlace}>
              <Lock size={15} className="me-1" /> ادفع واحجز في الخزنة
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ شاشة النجاح ============ */
export function SuccessPage({ id }: { id: number }) {
  const { orders, go, stores } = useDameen();
  const o = orders.find(x => x.id === id);
  if (!o) return <EmptyState title="الطلب غير موجود" cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => go({ name: 'orders' })}>طلباتي ←</Button>} />;
  const wb = o.groups.filter(g => g.logi?.wb).length;
  const digi = o.groups.some(g => g.digi);
  const chatG = o.groups.findIndex(g => g.custom || (g.ship && g.ship.mode === 'field'));
  const g0 = chatG >= 0 ? o.groups[chatG] : null;
  return (
    <div className="max-w-xl mx-auto text-center py-8">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }} className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-4xl mb-4">✅</motion.div>
      <h1 className="text-2xl font-black text-ink">تم حجز مبلغك في خزنة ضمين!</h1>
      <p className="text-sm text-muted-foreground mt-2 leading-loose">
        رقم طلبك <b className="text-brand">#{ar(o.id)}</b><br />
        أُرسلت طلباتك إلى {ar(o.groups.length)} متجر — كل شحنة ببوليصة مستقلة.
        {wb > 0 && <>📄 أُصدرت {ar(wb)} بوليصة شحن آلية وأُرسلت طلبات الاستلام للمناديب.</>}
        {digi && <><br />⚡ مشترياتك الرقمية سُلّمت فوراً إلى «مكتبتك الرقمية».</>}
        <br />💡 يمكنك فتح نزاع خلال نافذة الحماية قبل التحرير التلقائي.
      </p>
      <div className="mt-5 space-y-2">
        {g0 && (
          <Button className="w-full bg-brand hover:bg-brand-2 font-extrabold" onClick={() => go({ name: 'orders' })}>
            💬 دردشة التنسيق/التعديلات مع {stores.find(s => s.id === g0.store)?.name}
          </Button>
        )}
        {digi && <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-extrabold" onClick={() => go({ name: 'dlib' })}>📚 مكتبتي الرقمية — الكود/الملف جاهز</Button>}
        <Button variant="outline" className="w-full font-bold" onClick={() => go({ name: 'orders' })}>📦 تتبع طلبي</Button>
        <Button variant="ghost" className="w-full font-bold" onClick={() => go({ name: 'home' })}>مواصلة التسوق</Button>
      </div>
    </div>
  );
}

/* ملخص الطلب الصغير (يستخدمه التاجر والإدارة) */
export function OrderTotals({ o }: { o: Order }) {
  return (
    <div className="text-[11px] text-muted-foreground space-y-0.5 mt-1.5">
      <div>📍 {o.addr}</div>
      <div>💳 {PAY_LABELS[o.pay] || 'دفع إلكتروني'}{o.paidBy ? ` (${o.paidBy})` : ''}{o.inst ? ` — ${ar(o.inst.n)} دفعات × ${ar(o.inst.each)} ر.س` : ''}</div>
      {o.coupon && o.coupon.amt > 0 && <div>🎟️ كوبون {o.coupon.code} − {money(o.coupon.amt)}</div>}
      {o.ptsUsed > 0 && <div>🌟 نقاط − {money(o.ptsAmt)}</div>}
      {o.freeDl && <div>🚚 توصيل مجاني (نقاط)</div>}
      <div>🧾 ض.ق.م ١٥٪: {money(o.tax)} · الإجمالي {money(o.total)}</div>
    </div>
  );
}
