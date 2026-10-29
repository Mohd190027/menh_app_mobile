/* لوحة التاجر الكاملة: نظرة عامة KPIs · منتجات (نقاط إلزامية/أسئلة/IP رقمي/عروض) · طلبات الشحنات (قبول/شحن/OTP/طلب مبالغ) · محفظة (تمويل نقاط) · نزاعات · إعدادات (هوية/شحن/أسئلة/كوبونات) */
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Package, Store as StoreIcon, Wallet, Scale, Settings, Plus, Star, Pencil, Trash2, Tag, Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ar, CITIES, money, worldOf, type Product, type ProdQ } from './data';
import { eff, heldFor, useDameen, type Order } from './state';
import { EmptyState, SectionTitle, StatCard, Stars } from './ui';
import { ChatDialog, GroupCard } from './user';
import { OrderTotals } from './shop-buy';

const TABS = [
  { id: 'overview', t: 'لوحة التحكم', icon: Package },
  { id: 'products', t: 'منتجاتي', icon: StoreIcon },
  { id: 'orders', t: 'الطلبات', icon: Package },
  { id: 'wallet', t: 'المحفظة', icon: Wallet },
  { id: 'disputes', t: 'النزاعات', icon: Scale },
  { id: 'settings', t: 'الإعدادات', icon: Settings },
];

export function MerchantPanel({ tab }: { tab: string }) {
  const { session, go, stores, orders } = useDameen();
  const my = stores.find(s => s.id === session?.store);
  if (!session || session.role !== 'merchant' || !my) {
    return <EmptyState icon="🔐" title="لوحة التاجر" sub="سجّل دخولك بحساب تاجر للوصول إلى لوحة متجرك" cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => useDameen.getState().openAuth('login')}>تسجيل الدخول</Button>} />;
  }
  const myOrders = orders.filter(o => o.groups.some(g => g.store === my.id));
  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <SectionTitle title={`🏪 ${my.name}`} sub={worldOf(my.id).name + ' · حماية ' + worldOf(my.id).win + ' بعد الاستلام'} />
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4" dir="rtl">
        {TABS.map(t => {
          const on = tab === t.id;
          const Icon = t.icon;
          return (
            <button key={t.id} className={`flex items-center gap-1.5 text-[12px] font-bold px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${on ? 'bg-brand text-cream shadow' : 'bg-card border border-border text-muted-foreground hover:border-brand/40'}`} onClick={() => go({ name: 'merchant', tab: t.id })}>
              <Icon size={14} /> {t.t}
            </button>
          );
        })}
      </div>
      {tab === 'overview' && <MerchantOverview sid={my.id} orders={myOrders} />}
      {tab === 'products' && <MerchantProducts store={my.id} />}
      {tab === 'orders' && <MerchantOrders orders={myOrders} sid={my.id} />}
      {tab === 'wallet' && <MerchantWallet sid={my.id} orders={myOrders} />}
      {tab === 'disputes' && <MerchantDisputes sid={my.id} />}
      {tab === 'settings' && <MerchantSettings sid={my.id} />}
    </div>
  );
}

/* ============ النظرة العامة ============ */
function MerchantOverview({ sid, orders }: { sid: string; orders: Order[] }) {
  const { storeWallets, go, products } = useDameen();
  const groups = orders.flatMap(o => o.groups.filter(g => g.store === sid).map(g => ({ o, g })));
  const pending = groups.filter(x => x.g.status === 'pending').length;
  const preparing = groups.filter(x => x.g.status === 'preparing').length;
  const active = groups.filter(x => ['pending', 'preparing', 'shipped', 'received'].includes(x.g.status)).length;
  const revenue = groups.filter(x => x.g.status === 'released').reduce((a, x) => a + (x.g.payout?.net || 0), 0);
  const myProducts = products.filter(p => p.store === sid);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<Package size={18} />} label="طلبات بانتظار قبولك" value={ar(pending)} tone="gold" sub={pending > 0 ? 'بادر بالقبول لتبدأ التحضير' : 'لا طلبات معلقة'} />
        <StatCard icon={<Package size={18} />} label="قيد التحضير" value={ar(preparing)} tone="teal" />
        <StatCard icon={<Wallet size={18} />} label="محفظتك المتاحة" value={money(storeWallets[sid] || 0)} tone="brand" sub={'محجوز لصالحك ' + money(heldFor(orders, sid))} />
        <StatCard icon={<StoreIcon size={18} />} label="منتجاتك" value={ar(myProducts.length)} tone="brand" sub={ar(myProducts.filter(p => p.off > 0).length) + ' عليها عرض'} />
      </div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <b className="text-sm mb-3 block">⏳ طابور الطلبات النشطة ({ar(active)})</b>
        {groups.filter(x => ['pending', 'preparing'].includes(x.g.status)).length === 0 ? (
          <p className="text-xs text-muted-foreground">لا طلبات بانتظارك — كل شيء تحت السيطرة 🌟</p>
        ) : (
          <div className="space-y-2">
            {groups.filter(x => ['pending', 'preparing'].includes(x.g.status)).slice(0, 5).map(({ o, g }) => (
              <div key={o.id + g.store} className="flex items-center justify-between gap-2 flex-wrap text-xs border border-dashed border-border rounded-xl p-2.5">
                <div>
                  <b>طلب #{ar(o.id)}</b> <span className="text-muted-foreground">· {ar(g.items.reduce((a, i) => a + i.qty, 0))} منتج · {money(g.sub)}</span>
                </div>
                <Button size="sm" className="h-7 text-[11px] bg-brand hover:bg-brand-2 font-bold" onClick={() => go({ name: 'merchant', tab: 'orders' })}>
                  {g.status === 'pending' ? 'قبول ←' : 'شحن ←'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <b className="text-sm block mb-2">💰 محفظتك</b>
          <div className="text-2xl font-black text-brand">{money(storeWallets[sid] || 0)}</div>
          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">محجوز لصالحك {money(heldFor(orders, sid))} · صافي مُحرر تراكمي {money(Math.round(revenue * 100) / 100)}</p>
          <Button size="sm" variant="outline" className="mt-2 text-xs font-bold" onClick={() => go({ name: 'merchant', tab: 'wallet' })}>سجل المحفظة ←</Button>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <b className="text-sm block mb-2">🧾 العمولة والنقاط</b>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            عمولة ضمين تُحددها الإدارة لكل تصنيف وتُقتطع من صافيك لحظة التحرير فقط (ولا تُضاف على العميل أبداً).
            قيمة النقطة الآن {money(useDameen.getState().ptsVal)} — تمويل نقاط منتجاتك يُخصم من محفظتك ويتحول لمحفظة الإدارة.
          </p>
          <Button size="sm" variant="outline" className="mt-2 text-xs font-bold" onClick={() => go({ name: 'merchant', tab: 'settings' })}>إعدادات المتجر ←</Button>
        </div>
      </div>
    </div>
  );
}

/* ============ منتجاتي ============ */
function MerchantProducts({ store }: { store: string }) {
  const { products, worlds, cats, stores } = useDameen();
  const ps = products.filter(p => p.store === store);
  const st = stores.find(s => s.id === store)!;
  const secId = st.sec;
  const [formOpen, setFormOpen] = useState(false);
  const [edit, setEdit] = useState<Product | null>(null);
  const [offerFor, setOfferFor] = useState<Product | null>(null);
  const [offVal, setOffVal] = useState(0);
  const [revsFor, setRevsFor] = useState<Product | null>(null);

  return (
    <div>
      <SectionTitle title={`🧺 منتجاتي (${ar(ps.length)})`} action={
        <Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => { setEdit(null); setFormOpen(true); }}><Plus size={15} className="me-1" /> منتج جديد</Button>
      } />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard icon={<Package size={16} />} label="منتج معروض" value={ar(ps.length)} />
        <StatCard icon={<Tag size={16} />} label="عليه عرض نشط" value={ar(ps.filter(p => p.off > 0).length)} tone="gold" />
        <StatCard icon={<Star size={16} />} label="يمنح نقاطاً" value={ar(ps.filter(p => (p.pts || 0) > 0).length)} tone="teal" />
        <StatCard icon={<Package size={16} />} label="نفد مخزونه" value={ar(ps.filter(p => !p.stock).length)} tone="red" />
      </div>
      {ps.length === 0 ? (
        <EmptyState icon="🧺" title="لا منتجات بعد" sub="أضف منتجك الأول وزوّده بنقاط ولاء تجذب العملاء" cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => setFormOpen(true)}>＋ منتج جديد</Button>} />
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {ps.map(p => (
            <div key={p.id} className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col sm:flex-row">
              <div className="sm:w-36 h-36 bg-sand relative shrink-0">
                {p.imgs[0] && <img src={p.imgs[0]} alt={p.name} className="w-full h-full object-cover" />}
                {p.off > 0 && <span className="absolute top-1.5 start-1.5 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">خصم {ar(p.off)}٪</span>}
                {(p.pts || 0) > 0 && <span className="absolute bottom-1.5 start-1.5 bg-gold text-brand text-[9px] font-black px-1.5 py-0.5 rounded-full">🌟 {ar(p.pts)} نقطة</span>}
              </div>
              <div className="p-3 flex-1 flex flex-col gap-1.5">
                <b className="text-[13px] leading-snug">{p.name}</b>
                <div className="flex items-baseline gap-2">
                  <b className="text-brand">{money(eff(p))}</b>
                  {p.off > 0 && <s className="text-[10px] text-muted-foreground">{money(p.price)}</s>}
                </div>
                <div className="flex flex-wrap gap-1 text-[9.5px] font-bold">
                  <span className="bg-sand/70 border border-border rounded-full px-1.5 py-0.5">📦 مخزون {ar(p.stock)}</span>
                  <span className="bg-sand/70 border border-border rounded-full px-1.5 py-0.5">🛒 بيع {ar(p.sold)}</span>
                  <span className="bg-gold/15 text-amber-800 rounded-full px-1.5 py-0.5">★ {ar(p.rt, 1)}</span>
                  {p.ptype === 'chilled' && <span className="bg-sky-50 text-sky-700 rounded-full px-1.5 py-0.5">🧊 مبرد</span>}
                  {p.ptype === 'instant' && <span className="bg-amber-50 text-amber-700 rounded-full px-1.5 py-0.5">🛵 فوري</span>}
                  {p.ptype === 'field' && <span className="bg-orange-50 text-orange-700 rounded-full px-1.5 py-0.5">🎪 ميداني</span>}
                  {p.ptype === 'digital' && <span className="bg-violet-50 text-violet-700 rounded-full px-1.5 py-0.5">⚡ رقمي فوري</span>}
                  {p.fragile && <span className="bg-red-50 text-red-600 rounded-full px-1.5 py-0.5">⚠️ قابل للكسر</span>}
                  {p.customOk && <span className="bg-orange-50 text-orange-700 rounded-full px-1.5 py-0.5">✏️ تعديلات</span>}
                  {p.giftOk && <span className="bg-rose-50 text-rose-600 rounded-full px-1.5 py-0.5">🎁 إهداء</span>}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto pt-1.5">
                  <Button variant="outline" size="sm" className="h-7 text-[10.5px] font-bold" onClick={() => { setOfferFor(p); setOffVal(p.off); }}>🏷️ عروض</Button>
                  <Button variant="outline" size="sm" className="h-7 text-[10.5px] font-bold" onClick={() => setRevsFor(p)}>⭐ التقييمات {p.rc ? `(${ar(p.rc)})` : ''}</Button>
                  <Button variant="outline" size="sm" className="h-7 text-[10.5px] font-bold" onClick={() => { setEdit(p); setFormOpen(true); }}>✏️ تعديل</Button>
                  <Button variant="outline" size="sm" className="h-7 text-[10.5px] text-red-600 font-bold" onClick={() => useDameen.getState().delProduct(p.id)}><Trash2 size={11} /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <ProductForm
          store={store}
          secId={secId}
          cats={cats[secId] || []}
          edit={edit}
          worldImg={worlds.find(w => w.id === secId)?.img || ''}
          onClose={() => { setFormOpen(false); setEdit(null); }}
        />
      )}

      {/* نافذة العروض */}
      {offerFor && (
        <Dialog open onOpenChange={() => setOfferFor(null)}>
          <DialogContent className="max-w-sm" dir="rtl" aria-describedby={undefined}>
            <DialogHeader><DialogTitle className="text-sm">🏷️ عرض «{offerFor.name}»</DialogTitle></DialogHeader>
            <p className="text-[11px] text-muted-foreground leading-relaxed">اختر نسبة جاهزة أو اكتب أي نسبة من ١ إلى ٩٠٪ — يُحدّث السعر للعملاء فوراً.</p>
            <div className="flex flex-wrap gap-1.5">
              {[5, 10, 15, 20, 25, 30, 40, 50, 60].map(v => (
                <button key={v} className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${offVal === v ? 'bg-brand text-cream border-brand' : 'border-border hover:border-brand'}`} onClick={() => setOffVal(v)}>{ar(v)}٪</button>
              ))}
              <button className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-red-200 text-red-600" onClick={() => setOffVal(0)}>إلغاء العرض</button>
            </div>
            <div>
              <Label className="text-[11px] font-bold">نسبة الخصم (٪)</Label>
              <Input type="number" min={0} max={90} className="h-9 text-xs mt-1" value={offVal} onChange={e => setOffVal(Math.min(90, Math.max(0, +e.target.value || 0)))} />
            </div>
            <div className="rounded-xl bg-sand/60 border border-border p-2.5 text-xs space-y-1">
              <div className="flex justify-between"><span className="text-muted-foreground">السعر الحالي</span><b>{money(eff(offerFor))}</b></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{offVal ? 'بعد الخصم الجديد' : 'بلا خصم'}</span><b className={offVal ? 'text-brand text-base' : ''}>{money(Math.round(offerFor.price * (1 - offVal / 100) * 100) / 100)}</b></div>
              {offVal > 0 && <div className="text-[10.5px] text-red-600 font-bold">العميل يوفّر {money(Math.round(offerFor.price * offVal / 100 * 100) / 100)} ({ar(offVal)}٪)</div>}
            </div>
            <Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => { useDameen.getState().setOffer(offerFor.id, offVal); setOfferFor(null); }}>حفظ العرض</Button>
          </DialogContent>
        </Dialog>
      )}

      {/* تقييمات المنتج */}
      {revsFor && (
        <Dialog open onOpenChange={() => setRevsFor(null)}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto" dir="rtl" aria-describedby={undefined}>
            <DialogHeader><DialogTitle className="text-sm">⭐ تقييمات «{revsFor.name}»</DialogTitle></DialogHeader>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-black text-amber-700">{ar(revsFor.rt, 1)}</div>
                <Stars rt={revsFor.rt} size={12} />
                <div className="text-[10px] text-muted-foreground mt-1">{ar(revsFor.rc)} تقييم · {ar(revsFor.sold)} عملية بيع</div>
              </div>
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map(n => {
                  const c = revsFor.ratings.filter(r => r.stars === n).length;
                  const mx = Math.max(1, ...[5, 4, 3, 2, 1].map(x => revsFor.ratings.filter(r => r.stars === x).length));
                  return (
                    <div key={n} className="flex items-center gap-1.5 text-[10px]">
                      <span className="w-7">{ar(n)}★</span>
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden"><div className="h-full bg-gold" style={{ width: (c / mx * 100) + '%' }} /></div>
                      <span className="w-5 text-muted-foreground">{ar(c)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {revsFor.ratings.length === 0 ? <p className="text-xs text-muted-foreground text-center py-4">لا تقييمات بعد</p> : (
              <div className="space-y-2 mt-1">
                {revsFor.ratings.slice().reverse().map((r, i) => (
                  <div key={i} className="rounded-xl border border-border p-2.5">
                    <div className="flex items-center gap-2"><b className="text-xs">{r.name}</b><Stars rt={r.stars} size={10} /></div>
                    {r.txt && <p className="text-[11px] text-ink leading-relaxed mt-1">{r.txt}</p>}
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

/* ============ نموذج المنتج الكامل ============ */
function ProductForm({ store, secId, cats, edit, worldImg, onClose }: {
  store: string; secId: string; cats: { n: string; comm: number }[]; edit: Product | null; worldImg: string; onClose: () => void;
}) {
  const { saveProduct, storeWallets, ptsVal } = useDameen();
  const [name, setName] = useState(edit?.name || '');
  const [cat, setCat] = useState(edit?.cat || cats[0]?.n || '');
  const [price, setPrice] = useState(edit?.price || 0);
  const [off, setOff] = useState(edit?.off || 0);
  const [stock, setStock] = useState(edit?.stock || 10);
  const [pts, setPts] = useState(edit?.pts || 0);
  const [desc, setDesc] = useState(edit?.desc || '');
  const [specs, setSpecs] = useState(edit ? Object.entries(edit.specs).map(([k, v]) => k + ': ' + v).join('\n') : '');
  const [ptype, setPtype] = useState<string>(edit?.ptype || (secId === 'deco' ? 'ship' : 'std'));
  const [fragile, setFragile] = useState(!!edit?.fragile);
  const [giftOk, setGiftOk] = useState(!!edit?.giftOk);
  const [customOk, setCustomOk] = useState(!!edit?.customOk);
  const [dKind, setDKind] = useState<'code' | 'file'>(edit?.digi?.kind === 'file' ? 'file' : 'code');
  const [dVal, setDVal] = useState(edit?.digi?.val || '');
  const [dSize, setDSize] = useState(edit?.digi?.size || '');
  const [ipOK, setIpOK] = useState(!!edit?.ipOK);
  const [img, setImg] = useState(edit?.imgs[0] || '');
  const [qs, setQs] = useState<ProdQ[]>(edit?.qs || []);
  const [qOpen, setQOpen] = useState(false);
  const [qT, setQT] = useState<'opts' | 'txt'>('opts');
  const [qTxt, setQTxt] = useState('');
  const [qOpts, setQOpts] = useState(['', '', '', '']);

  const oldPts = edit?.pts || 0;
  const dPts = Math.max(0, Math.min(500, pts)) - oldPts;
  const cost = Math.round(dPts * ptsVal * 100) / 100;

  const submit = () => {
    const specsObj: Record<string, string> = {};
    specs.split('\n').forEach(l => { const i = l.indexOf(':'); if (i > 0) specsObj[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
    const ok = saveProduct({
      id: edit?.id, name: name.trim(), cat, price, off, stock, pts,
      ptype, fragile, giftOk, customOk,
      digi: ptype === 'digital' ? { kind: dKind, val: dVal, size: dSize } : null,
      ipOK, desc: desc.trim(), specs: specsObj, qs, img: img || worldImg,
    });
    if (ok) onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[88vh] overflow-y-auto" dir="rtl" aria-describedby={undefined}>
        <DialogHeader><DialogTitle className="text-sm">{edit ? 'تعديل منتج' : 'منتج جديد'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs font-bold">اسم المنتج</Label>
            <Input className="text-xs h-9 mt-1" value={name} onChange={e => setName(e.target.value)} placeholder="مثال: عباية كتان مطرزة" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs font-bold">التصنيف (وعمولته)</Label>
              <Select value={cat} onValueChange={setCat}>
                <SelectTrigger className="text-xs h-9 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{cats.map(c => <SelectItem key={c.n} value={c.n}>{c.n} — عمولة {ar(c.comm)}٪</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold">السعر (ر.س)</Label>
              <Input type="number" className="text-xs h-9 mt-1" value={price || ''} onChange={e => setPrice(+e.target.value || 0)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs font-bold">خصم ٪ (0 = بلا عرض)</Label>
              <Input type="number" className="text-xs h-9 mt-1" value={off} onChange={e => setOff(Math.min(90, Math.max(0, +e.target.value || 0)))} />
            </div>
            <div>
              <Label className="text-xs font-bold">المخزون</Label>
              <Input type="number" className="text-xs h-9 mt-1" value={stock} onChange={e => setStock(+e.target.value || 0)} />
            </div>
          </div>

          {secId === 'family' && (
            <div>
              <Label className="text-xs font-bold">🚚 طريقة التوصيل — تحدد سلوك الشحن تلقائياً</Label>
              <Select value={ptype} onValueChange={v => setPtype(v)}>
                <SelectTrigger className="text-xs h-9 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="std">شحن عادي عبر شركاء ضمين (OTO/Torod)</SelectItem>
                  <SelectItem value="chilled">🧊 حساس للحرارة — توصيل مبرد مجدول (كيك، ألبان، كريمات)</SelectItem>
                  <SelectItem value="instant">🛵 طازج — توصيل فوري بمناديب خلال ٤٥ دقيقة (أطباق مطبخ)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {secId === 'deco' && (
            <div>
              <Label className="text-xs font-bold">🚚 طبيعة الشحن والاحتياجات الخاصة</Label>
              <Select value={ptype} onValueChange={v => setPtype(v)}>
                <SelectTrigger className="text-xs h-9 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ship">منتج قابل للشحن — بوليصة آلية (هدايا، شوكولاتة، ورد)</SelectItem>
                  <SelectItem value="field">خدمة ديكور وتنسيق ميداني — فريقك يوصل ويركّب + حجز مواعيد المناسبات</SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-2 space-y-1.5">
                <label className="flex items-center gap-2 text-[11px] font-bold cursor-pointer"><Switch checked={giftOk} onCheckedChange={setGiftOk} /> 🎁 تفعيل «إهداء لشخص آخر» — يُطلب جوال المستلم ومدينته فقط</label>
                <label className="flex items-center gap-2 text-[11px] font-bold cursor-pointer"><Switch checked={fragile} onCheckedChange={setFragile} /> ⚠️ قابل للكسر — تنبيه في البوليصة + رسوم حماية ١٥ ر.س</label>
                <label className="flex items-center gap-2 text-[11px] font-bold cursor-pointer"><Switch checked={customOk} onCheckedChange={setCustomOk} /> ✏️ يقبل التعديل حسب طلب العميل — دردشة تعديلات بعد الدفع مع طلب مبالغ إضافية</label>
              </div>
            </div>
          )}
          {secId === 'gaming' && (
            <div>
              <Label className="text-xs font-bold">🎮 طبيعة المنتج والشحن — تُبرمج آلية التسليم تلقائياً</Label>
              <Select value={edit?.digi ? 'digital' : (fragile ? 'fragile' : ptype)} onValueChange={v => { if (v === 'fragile') { setFragile(true); setPtype('std'); } else { setFragile(false); setPtype(v); } }}>
                <SelectTrigger className="text-xs h-9 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="std">📦 جهاز أو ملحق ملموس — شحن قياسي عبر شركاء ضمين</SelectItem>
                  <SelectItem value="fragile">⚠️ جهاز ملموس قابل للكسر — تغليف خاص + رسوم حماية ١٥ ر.س</SelectItem>
                  <SelectItem value="digital">⚡ أصل رقمي (كود/ملف) — تسليم فوري بلا شحن إلى «مكتبة العميل»</SelectItem>
                </SelectContent>
              </Select>
              {(edit?.digi || (ptype === 'digital' && !fragile)) && (
                <div className="mt-2 rounded-xl border border-violet-200 bg-violet-50/50 p-2.5 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[11px] font-bold">نوع الأصل الرقمي</Label>
                      <Select value={dKind} onValueChange={v => setDKind(v as 'code' | 'file')}>
                        <SelectTrigger className="text-xs h-8 mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="code">كود (تفعيل/اشتراك)</SelectItem><SelectItem value="file">ملف (PDF/ZIP)</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-[11px] font-bold">{dKind === 'code' ? 'قيمة الكود' : 'اسم الملف'}</Label>
                      <Input className="text-xs h-8 mt-1" dir="ltr" value={dVal} onChange={e => setDVal(e.target.value)} placeholder={dKind === 'code' ? 'XXXX-XXXX-XXXX' : 'file.pdf'} />
                    </div>
                  </div>
                  {dKind === 'file' && (
                    <div>
                      <Label className="text-[11px] font-bold">حجم الملف</Label>
                      <Input className="text-xs h-8 mt-1" value={dSize} onChange={e => setDSize(e.target.value)} placeholder="مثال: ٤٫٢ م.ب" />
                    </div>
                  )}
                  <label className="flex gap-2 items-start text-[10.5px] font-bold leading-relaxed bg-amber-50/70 border border-dashed border-amber-400 rounded-xl p-2 cursor-pointer">
                    <input type="checkbox" checked={ipOK} onChange={e => setIpOK(e.target.checked)} className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>⚖️ <b>إقرار الملكية الفكرية (إلزامي):</b> أتعهد أنني أملك كامل حقوق الملكية الفكرية للملفات والأكواد المرفوعة أو أنني موزّع معتمد مرخّص، وأتحمل كامل المسؤولية القانونية عن أي مخالفة، وأوافق على أن تحذف الإدارة أي محتوى مخالف وتوقف حسابي.</span>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* النقاط */}
          <div className="rounded-xl border border-gold/40 bg-gold/5 p-2.5">
            <Label className="text-xs font-bold">🌟 نقاط ولاء يمنحها المنتج للعميل (إجبارية)</Label>
            <Input type="number" min={0} max={500} step={5} className="text-xs h-9 mt-1.5" value={pts} onChange={e => setPts(Math.min(500, Math.max(0, Math.round(+e.target.value || 0))))} placeholder="مثال: 50" />
            <div className="text-[10.5px] leading-relaxed mt-1.5 font-semibold">
              {!pts && !oldPts ? 'أدخل نقاطاً (١ فأكثر) — إجبارية لحفظ المنتج وتُمنح للعميل عند تحرير طلبه'
                : dPts === 0 ? 'لا تغيير على تمويل النقاط (' + ar(pts) + ' نقطة للعميل)'
                : dPts > 0
                  ? <>تُخصم من محفظتك <b className="text-amber-700">− {money(cost)}</b> وتُحوَّل لمحفظة الإدارة ({ar(dPts)} نقطة × {money(ptsVal)})</>
                  : <>يُسترجع لمحفظتك <b className="text-brand">+ {money(-cost)}</b> ({ar(-dPts)} نقطة × {money(ptsVal)})</>}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">الإدارة تحدد قيمة النقطة حالياً {money(ptsVal)} — محفظتك الحالية {money(storeWallets[store] || 0)}</p>
          </div>

          <div>
            <Label className="text-xs font-bold">الوصف</Label>
            <Textarea className="text-xs mt-1" value={desc} onChange={e => setDesc(e.target.value)} placeholder="وصف تسويقي جاذب ب٣ أسطر…" />
          </div>
          <div>
            <Label className="text-xs font-bold">المواصفات (كل سطر: المفتاح: القيمة)</Label>
            <Textarea className="text-xs mt-1" value={specs} onChange={e => setSpecs(e.target.value)} placeholder={'الخامة: كتان\nاللون: كحلي'} />
          </div>

          {/* أسئلة المنتج */}
          <div>
            <Label className="text-xs font-bold">❓ أسئلة تظهر للعميل وقت تصفح المنتج (اختيارية)</Label>
            <p className="text-[10px] text-muted-foreground mt-0.5 mb-1.5">سؤال باختيارات جاهزة أو سؤال يكتب العميل جوابه — الإجابة إجبارية قبل الإضافة للسلة وتصلك مع الطلب.</p>
            {qs.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {qs.map((q, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 bg-card border border-border rounded-xl px-2.5 py-1.5">
                    <div className="min-w-0"><b className="text-[11.5px] block truncate">{q.q}</b><span className="text-[10px] text-muted-foreground">{q.t === 'opts' ? 'اختيارات: ' + q.o.join(' · ') : 'العميل يكتب جوابه'}</span></div>
                    <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 shrink-0" onClick={() => setQs(qs.filter((_, j) => j !== i))}>🗑 حذف</Button>
                  </div>
                ))}
              </div>
            )}
            {qOpen ? (
              <div className="rounded-xl border border-border bg-sand/40 p-2.5 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10.5px] font-bold">نوع السؤال</Label>
                    <Select value={qT} onValueChange={v => setQT(v as 'opts' | 'txt')}>
                      <SelectTrigger className="text-[11px] h-8 mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="opts">اختيارات جاهزة</SelectItem><SelectItem value="txt">كتابة حرة</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10.5px] font-bold">نص السؤال</Label>
                    <Input className="text-[11px] h-8 mt-1" value={qTxt} onChange={e => setQTxt(e.target.value)} placeholder="ما اللون المطلوب للتطريز؟" />
                  </div>
                </div>
                {qT === 'opts' && (
                  <div className="grid grid-cols-2 gap-2">
                    {qOpts.map((o, i) => (
                      <Input key={i} className={`text-[11px] h-8 ${i < 2 ? '' : ''}`} placeholder={`الخيار ${ar(i + 1)}${i < 2 ? ' (إلزامي)' : ' (اختياري)'}`} value={o} onChange={e => setQOpts(qOpts.map((x, j) => j === i ? e.target.value : x))} />
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-[11px] h-8" onClick={() => setQOpen(false)}>إلغاء</Button>
                  <Button size="sm" className="text-[11px] h-8 bg-brand hover:bg-brand-2 font-bold" onClick={() => {
                    if (qTxt.trim().length < 3) { toast.error('اكتب نص السؤال (٣ أحرف فأكثر)'); return; }
                    let o: string[] = [];
                    if (qT === 'opts') {
                      o = qOpts.map(x => x.trim()).filter(Boolean);
                      if (o.length < 2) { toast.error('للأسئلة الاختيارية أدخل خيارين على الأقل'); return; }
                      if (new Set(o).size !== o.length) { toast.error('لا تكرر نفس الخيار'); return; }
                    }
                    setQs([...qs, { t: qT, q: qTxt.trim(), o }]);
                    setQOpen(false); setQTxt(''); setQOpts(['', '', '', '']);
                  }}>＋ إضافة السؤال ✓</Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="text-[11px] h-8 font-bold" onClick={() => setQOpen(true)}>＋ إضافة سؤال للمنتج</Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label className="text-xs font-bold">رابط صورة المنتج</Label>
              <Input className="text-xs h-9 mt-1" dir="ltr" value={img} onChange={e => setImg(e.target.value)} placeholder="https://…" />
            </div>
            {img && <img src={img} alt="" className="w-14 h-14 rounded-xl object-cover border border-border mt-5" />}
          </div>

          <Button className="w-full bg-brand hover:bg-brand-2 font-extrabold h-10" onClick={submit}>{edit ? 'حفظ التعديلات' : 'إضافة المنتج'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ============ طلباتي (تاجر) ============ */
function MerchantOrders({ orders, sid }: { orders: Order[]; sid: string }) {
  return (
    <div>
      <SectionTitle title="📦 الطلبات" sub="كل شحنة بحالتها — قَبِّل وحضّر واشحن" />
      {orders.length === 0 ? (
        <EmptyState icon="📦" title="لا طلبات بعد" sub="أول طلب من عملاء ضمين سيظهر هنا" />
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="rounded-2xl border border-border bg-sand/30 p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <b className="text-[14px]">طلب #{ar(o.id)}</b>
                  <div className="text-[10.5px] text-muted-foreground">{new Date(o.at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}</div>
                </div>
                <span className="text-[10px] font-bold bg-card border border-border rounded-full px-2 py-0.5">📍 {o.city}</span>
              </div>
              <OrderTotals o={o} />
              {o.groups.map((g, gi) => g.store === sid ? <GroupCard key={gi} o={o} g={g} gi={gi} merchantView /> : null)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============ المحفظة ============ */
function MerchantWallet({ sid, orders }: { sid: string; orders: Order[] }) {
  const { storeWallets, ptsFunding, go, stores } = useDameen();
  const st = stores.find(s => s.id === sid)!;
  const groups = orders.flatMap(o => o.groups.filter(g => g.store === sid).map(g => ({ o, g })));
  const payouts = groups.filter(x => x.g.status === 'released' && x.g.payout);
  const fund = ptsFunding.filter(f => f.store === sid);
  const held = heldFor(orders, sid);
  return (
    <div className="max-w-3xl space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard icon={<Wallet size={16} />} label="المتاح للسحب" value={money(storeWallets[sid] || 0)} tone="brand" />
        <StatCard icon={<Package size={16} />} label="محجوز لصالحك" value={money(held)} tone="gold" sub="يتحرر بعد رضا العميل" />
        <StatCard icon={<Star size={16} />} label="تمويل نقاطك" value={money(fund.reduce((a, f) => a + f.amt, 0))} tone="teal" sub={ar(fund.reduce((a, f) => a + f.pts, 0)) + ' نقطة مُموّلة'} />
      </div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <b className="text-sm block mb-1">🏦 حساب التحويل</b>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {st.iban ? <>يُحوَّل صافي محفظتك عند طلب السحب إلى الآيبان <b dir="ltr" className="font-mono">{st.iban.slice(0, 10)}••</b> خلال ٢٤ ساعة.</> : 'أضف الآيبان من طلب التسجيل — تُحوَّل أرباحك خلال ٢٤ ساعة من طلب السحب.'}
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <b className="text-sm block mb-2">💰 عمليات التحرير ({ar(payouts.length)})</b>
        {payouts.length === 0 ? <p className="text-xs text-muted-foreground">لا عمليات تحرير بعد</p> : (
          <div className="space-y-2">
            {payouts.map(({ o, g }, i) => (
              <div key={i} className="flex items-center justify-between gap-2 flex-wrap text-[11.5px] border border-dashed border-border rounded-xl p-2.5">
                <div>
                  <b>طلب #{ar(o.id)}</b>
                  <div className="text-[10px] text-muted-foreground">إجمالي {money(g.payout!.sub)} · عمولة ضمين {money(g.payout!.comm)}{g.payout!.ship?.merchant ? ' + دعمك للشحن ' + money(g.payout!.ship.merchant) : ''}</div>
                </div>
                <b className="text-brand text-base">+{money(g.payout!.net)}</b>
              </div>
            ))}
          </div>
        )}
      </div>
      {fund.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <b className="text-sm block mb-2">🌟 سجل تمويل النقاط</b>
          <div className="space-y-1.5">
            {fund.map((f, i) => (
              <div key={i} className="flex items-center justify-between text-[11.5px] border-b border-dashed border-border last:border-0 pb-1.5">
                <span>{f.pname} <span className="text-[10px] text-muted-foreground">({f.pts > 0 ? '+' : ''}{ar(f.pts)} نقطة)</span></span>
                <b className="text-amber-700">{f.amt > 0 ? '−' : '+'}{money(Math.abs(f.amt))}</b>
              </div>
            ))}
          </div>
        </div>
      )}
      <Button variant="outline" className="font-bold" onClick={() => go({ name: 'merchant', tab: 'overview' })}>→ عودة للوحة التحكم</Button>
    </div>
  );
}

/* ============ نزاعاتي (تاجر) ============ */
function MerchantDisputes({ sid }: { sid: string }) {
  const { disputes, stores, users } = useDameen();
  const [openId, setOpenId] = useState<string | null>(null);
  const [txt, setTxt] = useState('');
  const ds = disputes.filter(d => d.store === sid);
  return (
    <div className="max-w-2xl">
      <SectionTitle title={`⚖️ نزاعات متجري (${ar(ds.length)})`} />
      {ds.length === 0 ? (
        <EmptyState icon="🕊️" title="لا نزاعات على متجرك" sub="استمر في الجودة والسرعة 🌟" />
      ) : (
        <div className="space-y-3">
          {ds.map(d => {
            const st = stores.find(s => s.id === d.store);
            return (
              <div key={d.id} className={`rounded-2xl border bg-card p-4 ${d.status === 'open' ? 'border-red-200 border-s-4 border-s-red-500' : 'border-emerald-200 border-s-4 border-s-emerald-500'}`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <b className="text-[13px]">⚖️ {d.subject}</b>
                    <div className="text-[10.5px] text-muted-foreground">طلب #{ar(d.order)} · {users[d.customer]?.name.split(' ')[0] || 'عميل'}</div>
                  </div>
                  {d.status === 'open'
                    ? <span className="text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 rounded-full px-2 py-0.5">بانتظار حكم الإدارة — المبلغ معلق</span>
                    : <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${d.ruling?.act === 'release' ? 'bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>{d.ruling?.act === 'release' ? 'حُكم لصالحك' : 'استُرجع للعميل'}</span>}
                </div>
                {d.ruling && <div className="mt-2.5 rounded-xl bg-sand/60 p-2.5 text-[11px] leading-relaxed"><b>تسبيب الحكم:</b> {d.ruling.text}</div>}
                <Button size="sm" variant={d.status === 'open' ? 'destructive' : 'outline'} className="mt-2.5 font-bold" onClick={() => { setOpenId(openId === d.id ? null : d.id); setTxt(''); }}>💬 {d.status === 'open' ? 'الرد على العميل وإضافة أدلتك' : 'عرض المحادثة'}</Button>
                {openId === d.id && (
                  <div className="mt-3 border-t border-dashed border-border pt-3 space-y-2">
                    <div className="max-h-56 overflow-y-auto space-y-2">
                      {d.messages.map((m, i) => (
                        <div key={i} className={`rounded-xl px-3 py-2 text-[11.5px] leading-relaxed ${m.r === 'sys' ? 'bg-sand/70 border border-dashed border-border text-center' : m.r === 'customer' ? 'bg-emerald-50 border border-emerald-100' : 'bg-white border border-border'}`}>
                          {m.r === 'sys' ? '🔔 ' : m.r === 'customer' ? '👩 ' : '🏪 '}
                          {m.img && <img src={m.img} alt="دليل" className="max-h-32 rounded-lg my-1.5 mx-auto object-cover" />}
                          {m.t}
                        </div>
                      ))}
                    </div>
                    {d.status === 'open' && (
                      <div className="flex gap-2">
                        <Input className="text-xs h-9" placeholder="أضف ردك وأدلتك… (تُحجب الأرقام والروابط)" value={txt} onChange={e => setTxt(e.target.value)} />
                        <Button size="sm" className="bg-brand hover:bg-brand-2 font-bold shrink-0" onClick={() => { if (useDameen.getState().pushDispMsg(d.id, 'merchant', txt)) setTxt(''); }}>إرسال</Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============ إعدادات المتجر ============ */
function MerchantSettings({ sid }: { sid: string }) {
  const { stores, worlds, cats, products, storeWallets, coupons, saveStore, saveStoreLoc, saveStoreShip, addStoreQ, delStoreQ, addCoupon, delCoupon, go } = useDameen();
  const s = stores.find(x => x.id === sid)!;
  const sec = worlds.find(w => w.id === s.sec)!;
  const ps = products.filter(p => p.store === sid);
  const myCats = [...new Set(ps.map(p => p.cat))].map(cn => ({ n: cn, c: cats[s.sec].find(c => c.n === cn)?.comm ?? 2.5 }));
  const ccs = myCats.map(c => c.c);
  const ccTxt = ccs.length ? (Math.min(...ccs) === Math.max(...ccs) ? ar(ccs[0]) + '٪' : ar(Math.min(...ccs)) + '–' + ar(Math.max(...ccs)) + '٪') : '—';
  const mine = Object.entries(coupons).filter(([, c]) => c.store === sid);
  const [nm, setNm] = useState(s.name);
  const [ds, setDs] = useState(s.desc);
  const [city, setCity] = useState(s.city);
  const [area, setArea] = useState(s.area);
  const [dlMode, setDlMode] = useState(s.dlMode);
  const [freeMin, setFreeMin] = useState(s.freeMin);
  const [rangeKm, setRangeKm] = useState(s.rangeKm);
  const [q, setQ] = useState('');
  const [cCode, setCCode] = useState('');
  const [cType, setCType] = useState<'pct' | 'flat'>('pct');
  const [cV, setCV] = useState(10);
  const [cMax, setCMax] = useState(50);
  const [cMin, setCMin] = useState(0);
  const [cUses, setCUses] = useState(0);

  const Row = ({ ic, title, sub, children }: { ic: string; title: string; sub: string; children?: React.ReactNode }) => (
    <div className="flex items-center gap-3 py-2.5 border-b border-dashed border-border last:border-0">
      <span className="text-lg shrink-0">{ic}</span>
      <div className="flex-1 min-w-0"><b className="text-[12.5px] block">{title}</b><span className="text-[10.5px] text-muted-foreground leading-relaxed block">{sub}</span></div>
      {children}
    </div>
  );

  return (
    <div className="grid md:grid-cols-2 gap-4 items-start">
      {/* ملف المتجر */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <b className="text-sm block">🏪 ملف المتجر</b>
        <Row ic="🗂️" title="القسم" sub={sec.name + ' — نافذة حماية ' + sec.win + ' بعد الاستلام'}><span className="text-[10px] font-bold rounded-full px-2 py-0.5" style={{ background: sec.color + '18', color: sec.color }}>ثابت</span></Row>
        <Row ic="👤" title="المالك" sub={(useDameen.getState().users[s.owner]?.name || 'عضو ضمين') + ' · ' + ar(s.owner)}><span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded-full px-2 py-0.5">عضو ضمين</span></Row>
        <Row ic="⭐" title="تقييم المتجر" sub={ar(s.rt, 1) + ' من ٥ — ' + ar(s.sales) + ' عملية بيع مكتملة'}><Stars rt={s.rt} size={11} /></Row>
        <Row ic="🧺" title="المنتجات المعروضة" sub={ar(ps.length) + ' منتج · ' + ar(ps.filter(p => p.off > 0).length) + ' عليه عرض · ' + ar(ps.filter(p => (p.pts || 0) > 0).length) + ' يمنح نقاطاً'} />
        <Row ic="💰" title="المحفظة" sub={'متاح ' + money(storeWallets[sid] || 0)}><Button size="sm" variant="outline" className="h-7 text-[10.5px] font-bold" onClick={() => go({ name: 'merchant', tab: 'wallet' })}>عرض</Button></Row>
        {s.iban && <Row ic="🏦" title="الآيبان — تحويل أرباحك" sub="يُحوَّل إليه صافي محفظتك عند طلب السحب خلال ٢٤ ساعة"><span dir="ltr" className="text-[10px] font-mono font-bold">{s.iban.slice(0, 10)}••</span></Row>}
        <div className="border-t border-dashed border-border pt-3 space-y-2">
          <b className="text-[12.5px] block">✏️ بيانات قابلة للتعديل</b>
          <div>
            <Label className="text-[11px] font-bold">اسم المتجر</Label>
            <Input className="text-xs h-9 mt-1" value={nm} onChange={e => setNm(e.target.value)} />
          </div>
          <div>
            <Label className="text-[11px] font-bold">وصف المتجر (يظهر لكل العملاء)</Label>
            <Textarea className="text-xs mt-1 min-h-16" value={ds} onChange={e => setDs(e.target.value)} />
          </div>
          <Button size="sm" className="bg-brand hover:bg-brand-2 font-bold" onClick={() => saveStore({ name: nm, desc: ds })}>حفظ البيانات</Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* العمولة والنقاط */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <b className="text-sm block mb-1">🧾 العمولة ونظام النقاط</b>
          <Row ic="🧾" title="عمولة ضمين على تصنيفاتك" sub={myCats.length ? myCats.map(c => c.n + ' ' + ar(c.c) + '٪').join(' · ') : 'لم تضف منتجات بعد'}><span className="text-[10px] font-bold bg-gold/20 text-amber-800 rounded-full px-2 py-0.5">{ccTxt}</span></Row>
          <Row ic="🌟" title="قيمة النقطة (تحددها الإدارة)" sub={money(useDameen.getState().ptsVal) + ' للنقطة — تُخصم من محفظتك عند إضافة نقاط وتُحوَّل لمحفظة الإدارة'} />
        </div>

        {/* الموقع */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <b className="text-sm block">📍 موقع المتجر — حماية من الالتفاف</b>
          <div>
            <Label className="text-[11px] font-bold">مدينة النشاط (الوحيدة الظاهرة للعملاء)</Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="text-xs h-9 mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[11px] font-bold">الحي والشارع (محجوب دائماً عن العملاء)</Label>
            <Input className="text-xs h-9 mt-1" value={area} onChange={e => setArea(e.target.value)} placeholder="مثال: حي الياسمين، شارع الأمير سلطان" />
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">🔒 ما يراه العميل: 📍 {city} فقط — العنوان التفصيلي يُنقل داخل السيرفر إلى شريك الشحن لإصدار البوليصة دون أن يظهر في أي واجهة.</p>
          <Button size="sm" className="bg-brand hover:bg-brand-2 font-bold" onClick={() => saveStoreLoc(city, area)}>حفظ الموقع</Button>
        </div>

        {/* خيارات التوصيل */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <b className="text-sm block">🚚 خيارات التوصيل وسقف الشحن المجاني</b>
          <div>
            <Label className="text-[11px] font-bold">من يتحمل رسوم التوصيل؟</Label>
            <Select value={dlMode} onValueChange={v => setDlMode(v as 'customer' | 'half' | 'free')}>
              <SelectTrigger className="text-xs h-9 mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">توصيل على العميل (١٠٠٪)</SelectItem>
                <SelectItem value="half">توصيل مناصفة (٥٠٪ / ٥٠٪)</SelectItem>
                <SelectItem value="free">توصيل مجاني (١٠٠٪ عليك)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[11px] font-bold">سقف الشحن المجاني — أدنى قيمة طلب (0 = معطَّل)</Label>
            <Input type="number" min={0} className="text-xs h-9 mt-1" value={freeMin} onChange={e => setFreeMin(Math.max(0, +e.target.value || 0))} />
          </div>
          {s.sec === 'family' && (
            <div>
              <Label className="text-[11px] font-bold">🛵 نطاق التوصيل الفوري (كم داخل {city} فقط)</Label>
              <Input type="number" min={1} max={60} className="text-xs h-9 mt-1" value={rangeKm} onChange={e => setRangeKm(Math.min(60, Math.max(1, +e.target.value || 20)))} />
              <p className="text-[10px] text-muted-foreground leading-relaxed mt-1">الأطباق الطازجة تُوصل بمناديب فوريين داخل مدينتك فقط — يُمنع أي طلب من خارج النطاق تلقائياً حفاظاً على حرارة الوجبة.</p>
            </div>
          )}
          <p className="text-[10px] text-muted-foreground leading-relaxed">⚖️ ما تتحمله من رسوم الشحن يُقتطع من صافيك فقط لحظة التحرير — ولا يمس عمولة المنصة أبداً. ويرى العميل شريط تقدم في السلة يشجعه على بلوغ سقفك.</p>
          <Button size="sm" className="bg-brand hover:bg-brand-2 font-bold" onClick={() => saveStoreShip({ dlMode, freeMin, rangeKm: s.sec === 'family' ? rangeKm : undefined })}>حفظ خيارات التوصيل</Button>
        </div>

        {/* أسئلة المتجر (عائلة) */}
        {s.sec === 'family' && (
          <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
            <b className="text-sm block">❓ أسئلة متجري عند الطلب</b>
            <p className="text-[10px] text-muted-foreground leading-relaxed">تظهر للعميل عند إتمام الطلب وتصلك إجاباته مع الشحنة (متاحة لقسم المأكولات والضيافة).</p>
            {s.qs.map((qq, i) => (
              <div key={i} className="flex items-center justify-between gap-2 bg-sand/50 border border-border rounded-xl px-2.5 py-1.5">
                <b className="text-[11.5px]">{qq}</b>
                <Button variant="outline" size="sm" className="h-6 text-[10px] px-2" onClick={() => delStoreQ(i)}>حذف</Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input className="text-xs h-9" placeholder="مثال: الكريمة أم التمر على الكيكة؟" value={q} onChange={e => setQ(e.target.value)} />
              <Button size="sm" variant="outline" className="font-bold shrink-0" onClick={() => { if (q.trim().length >= 3) { addStoreQ(q.trim()); setQ(''); } else toast.error('اكتب سؤالاً أوضح'); }}>＋ إضافة</Button>
            </div>
          </div>
        )}

        {/* كوبونات المتجر */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <b className="text-sm block">🎟️ كوبونات متجرك</b>
          <p className="text-[10px] text-muted-foreground leading-relaxed">أصدر كوبونات خاصة بعملاء متجرك — يُطبق الكوبون عند الطلب على قيمة منتجاتك في السلة، والعمولة تُحسب بعد الخصم، ولا يمس الخصم رسوم الشحن.</p>
          {mine.length > 0 && (
            <div className="space-y-1.5">
              {mine.map(([k, c]) => (
                <div key={k} className="flex items-center justify-between gap-2 bg-sand/50 border border-border rounded-xl px-2.5 py-1.5 text-[11px]">
                  <div><b className="font-mono">{k}</b> — {c.type === 'pct' ? ar(c.v) + '٪ (حتى ' + money(c.max) + ')' : money(c.v)}{c.min ? ' · حد أدنى ' + money(c.min) : ''}{c.maxUses ? ' · سقف ' + ar(c.maxUses) + ' استخدام' : ''}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-bold">{ar(c.uses)} استخدام</span>
                    <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 text-red-600" onClick={() => delCoupon(k)}>حذف</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-[10.5px] font-bold">الكود</Label><Input className="text-xs h-8 mt-1" dir="ltr" value={cCode} onChange={e => setCCode(e.target.value.toUpperCase())} placeholder="MYSTORE10" /></div>
            <div><Label className="text-[10.5px] font-bold">النوع</Label>
              <Select value={cType} onValueChange={v => setCType(v as 'pct' | 'flat')}>
                <SelectTrigger className="text-xs h-8 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="pct">نسبة ٪</SelectItem><SelectItem value="flat">مبلغ ثابت</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label className="text-[10.5px] font-bold">{cType === 'pct' ? 'النسبة ٪' : 'المبلغ (ر.س)'}</Label><Input type="number" className="text-xs h-8 mt-1" value={cV} onChange={e => setCV(+e.target.value || 0)} /></div>
            <div><Label className="text-[10.5px] font-bold">{cType === 'pct' ? 'سقف الخصم (ر.س)' : '—'}</Label><Input type="number" disabled={cType !== 'pct'} className="text-xs h-8 mt-1" value={cMax} onChange={e => setCMax(+e.target.value || 0)} /></div>
            <div><Label className="text-[10.5px] font-bold">حد أدنى للطلب (ر.س)</Label><Input type="number" className="text-xs h-8 mt-1" value={cMin} onChange={e => setCMin(+e.target.value || 0)} /></div>
            <div><Label className="text-[10.5px] font-bold">سقف الاستخدامات (0=بلا)</Label><Input type="number" className="text-xs h-8 mt-1" value={cUses} onChange={e => setCUses(+e.target.value || 0)} /></div>
          </div>
          <Button size="sm" className="bg-gold text-brand hover:brightness-105 font-extrabold" onClick={() => { if (addCoupon(cCode, { type: cType, v: cV, max: cType === 'pct' ? cMax : cV, store: sid, min: cMin, maxUses: cUses || 0 })) { setCCode(''); } }}>＋ إصدار كوبون</Button>
        </div>
      </div>
    </div>
  );
}
