/* صفحات العميل: الطلبات (بخط زمني وعدّاد حماية ومحادثة ونزاع)، المفضلة، الحساب، النزاعات */
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package, ShieldCheck, MessageSquare, Send, AlertTriangle, Scale, Wallet,
  LogOut, Truck, CheckCircle2, KeyRound, Star, Bell, Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ar, money, worldOf } from './data';
import { useDameen, useMyOrders } from './state';
import { Countdown, EmptyState, ProductCard, SectionTitle, StatusChip } from './ui';

const fDate = (at: number) => new Date(at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });

/* ============ محادثة الطلب (ثلاثية الأطراف) ============ */
export function ChatDialog({ oid, open, onOpenChange }: { oid: string; open: boolean; onOpenChange: (v: boolean) => void }) {
  const { orders, session, pushChat } = useDameen();
  const o = orders.find(x => x.id === oid);
  const [txt, setTxt] = useState('');
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [o?.chat.length, open]);
  if (!o) return null;
  const role = session?.role || 'customer';
  const send = () => {
    const t = txt.trim();
    if (!t) return;
    if (/[0-9]{7,}/.test(t)) { pushChat(oid, 'sys', '🚫 ممنوع تبادل الأرقام والروابط خارج التطبيق — التنبيه الأول'); setTxt(''); return; }
    pushChat(oid, role === 'merchant' ? 'merchant' : 'customer', t);
    setTxt('');
    setTimeout(() => {
      pushChat(oid, 'dameen', 'وصلنا رسالتك — فريق ضمين يتابع معك ولن يُحرر المبلغ قبل اكتمال حقوقك 🛡️');
    }, 1100);
  };
  const bubble = (m: { r: string; t: string; at: number }, i: number) => {
    if (m.r === 'sys') {
      return <div key={i} className="text-center text-[10px] font-bold text-muted-foreground bg-sand rounded-full px-3 py-1.5 mx-auto w-fit max-w-full">{m.t}</div>;
    }
    const mine = m.r === (role === 'merchant' ? 'merchant' : 'customer');
    const isD = m.r === 'dameen';
    return (
      <div key={i} className={`flex ${mine ? 'justify-start' : 'justify-end'}`}>
        <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${isD
          ? 'bg-gold/15 border border-gold/40 text-yellow-900'
          : mine ? 'bg-brand text-cream' : 'bg-sand text-ink'}`}>
          <div className="text-[9px] font-black mb-0.5 opacity-70">{m.r === 'dameen' ? '🛡️ فريق ضمين' : m.r === 'merchant' ? '🏪 التاجر' : '🛍️ العميل'}</div>
          {m.t}
        </div>
      </div>
    );
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 h-[32rem]" dir="rtl" aria-describedby={undefined}>
        <DialogHeader className="p-4 border-b border-border bg-brand text-cream rounded-t-lg">
          <DialogTitle className="text-cream text-sm flex items-center gap-2">
            <MessageSquare size={15} /> محادثة الطلب {o.id}
            <span className="text-[10px] font-bold bg-gold text-brand px-2 py-0.5 rounded-full">مراقَبة ثلاثية</span>
          </DialogTitle>
        </DialogHeader>
        <div ref={box} className="flex-1 overflow-y-auto p-3.5 space-y-2.5 bg-background">
          {o.chat.map(bubble)}
        </div>
        <div className="p-3 border-t border-border flex gap-2">
          <input
            className="flex-1 bg-card border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-gold/50"
            placeholder="اكتب رسالتك… (بلا أرقام خارجية)"
            value={txt}
            onChange={e => setTxt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            aria-label="رسالة المحادثة"
          />
          <Button size="icon" className="bg-brand hover:bg-brand-2 rounded-xl h-9 w-9 shrink-0" onClick={send} aria-label="إرسال"><Send size={14} /></Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ============ نافذة فتح نزاع ============ */
function DisputeDialog({ oid, children }: { oid: string; children: React.ReactNode }) {
  const { openDispute } = useDameen();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [desc, setDesc] = useState('');
  const [err, setErr] = useState('');
  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md" dir="rtl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base"><Scale size={17} className="text-brand" /> فتح نزاع على الطلب {oid}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-3 text-[11px] leading-relaxed text-muted-foreground">
              🛡️ خلال نافذة الحماية يمكنك اعتراض على الطلب — يبقى مبلغك محجوزاً ويراجع فريق التحكيم الثلاثي الأدلة من الطرفين ويصدر حكمه خلال ٤٨ ساعة.
            </div>
            <div>
              <span className="text-xs font-bold">سبب النزاع</span>
              <Select value={reason} onValueChange={v => { setReason(v); setErr(''); }}>
                <SelectTrigger className="mt-1 w-full"><SelectValue placeholder="اختر السبب" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="المنتج وصل تالفاً">المنتج وصل تالفاً</SelectItem>
                  <SelectItem value="غير مطابق للوصف">غير مطابق للوصف</SelectItem>
                  <SelectItem value="الطلب لم يصل">الطلب لم يصل</SelectItem>
                  <SelectItem value="أجزاء ناقصة">أجزاء ناقصة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <span className="text-xs font-bold">اشرح المشكلة للفريق</span>
              <Textarea className="mt-1 text-xs" rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder="وصف دقيق يساعد فريق التحكيم…" />
            </div>
            {err && <p className="text-[11px] text-red-600 font-bold">{err}</p>}
            <Button
              className="w-full bg-red-600 hover:bg-red-700 font-extrabold"
              onClick={() => {
                if (!reason || desc.trim().length < 5) { setErr('اختر السبب واكتب شرحاً موجزاً'); return; }
                openDispute(oid, reason, desc.trim());
                setOpen(false); setReason(''); setDesc('');
              }}
            >
              إرسال النزاع للتحكيم ⚖️
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ============ بطاقة طلب ============ */
export function OrderCard({ o, index = 0 }: { o: ReturnType<typeof useMyOrders>[number]; index?: number }) {
  const { go, session, confirmReceive, releaseOrder, shipOrder, products } = useDameen();
  const [chat, setChat] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const role = session?.role;
  const w = worldOf(o.store);
  const st = useDameen.getState().stores.find(s => s.id === o.store);
  const status = o.status;
  const steps = [
    { t: 'تم الدفع', done: true },
    { t: 'التجهيز', done: status !== 'new' },
    { t: 'في الطريق', done: ['shipped', 'protected', 'released', 'refunded', 'disputed'].includes(status) },
    { t: 'الاستلام + الحماية', done: ['protected', 'released', 'disputed'].includes(status) },
    { t: status === 'refunded' ? 'مسترجع' : status === 'disputed' ? 'قيد التحكيم' : 'محرر', done: status === 'released' || status === 'refunded' },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.05, 0.3) }} className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
      <div className="p-4 md:p-5 space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-ink">#{ar(o.id.replace('DM-', ''))}</span>
              <StatusChip status={status} />
              {o.protectionUntil && status === 'protected' && <Countdown until={o.protectionUntil} />}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              {fDate(o.at)} · من متجر <button className="font-bold text-brand hover:underline" onClick={() => go({ name: 'store', id: o.store })}>{st?.name}</button>
              {role === 'merchant' && <span> · للعميل: <b>{o.customerName}</b></span>}
            </div>
          </div>
          <span className="font-black text-brand text-lg">{money(o.total)}</span>
        </div>

        <div className="space-y-2">
          {o.items.map(it => {
            const p = products.find(x => x.id === it.pid);
            return (
              <div key={it.pid} className="flex items-center gap-3">
                {p?.imgs[0]
                  ? <img src={p.imgs[0]} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  : <span className="w-12 h-12 rounded-xl bg-sand flex items-center justify-center shrink-0">🛍️</span>}
                <span className="flex-1 text-xs font-bold text-ink line-clamp-1">{it.name}</span>
                <span className="text-[11px] text-muted-foreground">×{ar(it.qty)}</span>
                <span className="text-xs font-extrabold text-ink">{money(it.price * it.qty)}</span>
              </div>
            );
          })}
        </div>

        {/* الخط الزمني */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1" dir="rtl">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center shrink-0">
              {i > 0 && <span className={`w-6 md:w-10 h-0.5 ${steps[i - 1].done ? 'bg-brand' : 'bg-border'}`} />}
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${s.done ? 'bg-brand text-cream' : 'bg-sand text-muted-foreground'}`}>
                {s.done ? <CheckCircle2 size={12} /> : ar(i + 1)}
              </span>
              <span className={`text-[9px] font-bold ms-1 whitespace-nowrap ${s.done ? 'text-brand' : 'text-muted-foreground'}`}>{s.t}</span>
            </div>
          ))}
        </div>

        {o.dispute && (
          <div className={`rounded-2xl p-3 text-xs leading-relaxed border ${o.dispute.status === 'resolved' ? 'bg-emerald-50 border-emerald-200' : 'bg-orange-50 border-orange-200'}`}>
            <b className="flex items-center gap-1.5"><AlertTriangle size={13} /> نزاع: {o.dispute.reason}</b>
            <p className="text-muted-foreground mt-1">{o.dispute.desc}</p>
            {o.dispute.verdict && <p className="font-extrabold text-ink mt-1.5">⚖️ {o.dispute.verdict}</p>}
          </div>
        )}

        {o.code && (status === 'released' || status === 'protected') && (
          <div className="bg-violet-50 border border-violet-200 rounded-2xl p-3 flex items-center justify-between gap-3">
            <span className="text-[11px] font-extrabold text-violet-800 flex items-center gap-1.5"><KeyRound size={13} /> كود الاستلام الرقمي</span>
            {showCode
              ? <span className="font-black tracking-widest text-violet-900" dir="ltr">{o.code}</span>
              : <Button size="sm" variant="outline" className="h-7 text-[11px] border-violet-300 text-violet-800 font-bold" onClick={() => setShowCode(true)}>اكشف الكود</Button>}
          </div>
        )}

        {/* الإجراءات */}
        <div className="flex flex-wrap gap-2 pt-1">
          {role === 'customer' && status === 'shipped' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-brand hover:bg-brand-2 font-extrabold h-9"><Truck size={14} /> استلمت الطلب — ابدأ الحماية</Button>
              </AlertDialogTrigger>
              <AlertDialogContent dir="rtl">
                <AlertDialogHeader>
                  <AlertDialogTitle>تأكيد استلام الطلب؟</AlertDialogTitle>
                  <AlertDialogDescription>
                    ستبدأ نافذة الحماية الخاصة بعالم {w.name} ({w.win}) — افحص طلبك براحتك، ولمّا ترضى حرّر المبلغ للتاجر بتقييمك.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>لي بعد</AlertDialogCancel>
                  <AlertDialogAction className="bg-brand hover:bg-brand-2 font-bold" onClick={() => confirmReceive(o.id)}>نعم، استلمته ✓</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {role === 'customer' && status === 'protected' && (
            <>
              <Button className="bg-gold text-brand hover:brightness-105 font-black h-9" onClick={() => releaseOrder(o.id)}>
                <Star size={14} /> راضٍ — حرّر المبلغ للتاجر
              </Button>
              <DisputeDialog oid={o.id}>
                <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50 font-bold h-9"><Scale size={14} /> فتح نزاع</Button>
              </DisputeDialog>
            </>
          )}
          {role === 'merchant' && status === 'new' && (
            <Button className="bg-brand hover:bg-brand-2 font-extrabold h-9" onClick={() => shipOrder(o.id)}><Truck size={14} /> ابدأ الشحن — بوليصة آلية</Button>
          )}
          <Button variant="outline" className="font-bold h-9" onClick={() => setChat(true)}><MessageSquare size={14} /> محادثة الطلب</Button>
        </div>
      </div>
      <ChatDialog oid={o.id} open={chat} onOpenChange={setChat} />
    </motion.div>
  );
}

/* ============ صفحة الطلبات ============ */
export function OrdersPage() {
  const orders = useMyOrders();
  const { go, session } = useDameen();
  const [f, setF] = useState('all');
  const filters = [
    { id: 'all', t: 'الكل' },
    { id: 'new', t: 'قيد التجهيز' },
    { id: 'shipped', t: 'في الطريق' },
    { id: 'protected', t: 'تحت الحماية' },
    { id: 'released', t: 'محررة' },
    { id: 'disputed', t: 'نزاعات' },
  ];
  const list = f === 'all' ? orders : orders.filter(o => o.status === f);
  return (
    <div className="py-2 max-w-3xl mx-auto">
      <SectionTitle
        title={session?.role === 'merchant' ? 'طلبات متجرك' : 'طلباتي'}
        sub={`${ar(orders.length)} طلباً — كل مبلغ منها محجوز بضمان ضمين`}
      />
      {!session ? (
        <EmptyState icon="🔐" title="سجّل دخولك لرؤية طلباتك" sub="طلباتك وحمايتها ونقاطك تنتظرك." cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => useDameen.getState().openAuth('login')}>تسجيل الدخول</Button>} />
      ) : (
        <>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 mb-4">
            {filters.map(x => (
              <button
                key={x.id}
                onClick={() => setF(x.id)}
                className={`text-[11px] font-extrabold px-3.5 py-1.5 rounded-full border whitespace-nowrap transition-all ${f === x.id ? 'bg-brand text-cream border-brand' : 'bg-card text-muted-foreground border-border hover:border-brand/40'}`}
              >
                {x.t} {x.id !== 'all' && `(${ar(orders.filter(o => o.status === x.id).length)})`}
              </button>
            ))}
          </div>
          {list.length === 0 ? (
            <EmptyState icon="📦" title="لا طلبات هنا بعد" sub="اول طلب لك في ضمين محمي كاملاً — جرّب عوالمنا الأربعة." cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => go({ name: 'home' })}>ابدأ التسوق</Button>} />
          ) : (
            <div className="space-y-3.5">
              {list.map((o, i) => <OrderCard key={o.id} o={o} index={i} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ============ المفضلة ============ */
export function FavoritesPage() {
  const { favorites, products, go } = useDameen();
  const list = useMemo(() => products.filter(p => favorites.includes(p.id)), [favorites, products]);
  return (
    <div className="py-2">
      <SectionTitle title="مفضلتي" sub={`${ar(list.length)} منتجاً محفوظاً — اضغط القلب في أي بطاقة لإضافته`} />
      {list.length === 0 ? (
        <EmptyState
          icon="💜"
          title="لا مفضلات بعد"
          sub="اضغط أيقونة القلب على أي منتج لحفظه هنا والرجوع إليه لاحقاً."
          cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => go({ name: 'home' })}>تصفّح المنتجات</Button>}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {list.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>
      )}
    </div>
  );
}

/* ============ الحساب ============ */
export function AccountPage() {
  const { session, logout, go, orders } = useDameen();
  const [notif, setNotif] = useState({ ord: true, off: true, dis: true, rev: true });
  if (!session) {
    return (
      <div className="py-10 max-w-md mx-auto">
        <EmptyState icon="👤" title="هذه صفحتك الشخصية" sub="سجّل دخولك لتدير نقاطك ومحفظتك وتنبيهاتك في مكان واحد." cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => useDameen.getState().openAuth('login')}>تسجيل الدخول</Button>} />
      </div>
    );
  }
  const protected_ = orders.filter(o => o.status === 'protected').length;
  const nextAt = 500;
  return (
    <div className="py-2 max-w-3xl mx-auto space-y-5">
      {/* الملف */}
      <div className="bg-card rounded-3xl border border-border p-5 flex items-center gap-4 shadow-sm">
        <span className="w-16 h-16 rounded-2xl bg-brand text-gold text-2xl font-black flex items-center justify-center shadow">{session.name.charAt(0)}</span>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-lg text-ink">{session.name}</h1>
          <p className="text-xs text-muted-foreground" dir="ltr">{ar(session.phone)}</p>
          <span className="inline-flex items-center gap-1 text-[10px] font-black text-brand bg-brand/10 border border-brand/20 rounded-full px-2.5 py-0.5 mt-1.5">
            <ShieldCheck size={11} /> عضو ضمين — {session.role === 'customer' ? 'عميل' : session.role === 'merchant' ? 'تاجر' : 'إدارة'}
          </span>
        </div>
        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 font-bold h-9" onClick={logout}><LogOut size={14} /> خروج</Button>
      </div>

      {/* النقاط والمحفظة */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-brand to-brand-2 text-cream rounded-3xl p-5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cream/80 flex items-center gap-1.5"><Star size={14} className="text-gold" /> نقاط الولاء</span>
            <span className="text-[10px] bg-gold text-brand font-black px-2 py-0.5 rounded-full">١٪ من كل تحرير</span>
          </div>
          <div className="text-4xl font-black mt-2 tabular-nums">{ar(session.pts)} <span className="text-sm font-bold text-cream/70">نقطة</span></div>
          <div className="mt-3">
            <div className="h-2 bg-black/25 rounded-full overflow-hidden">
              <div className="h-full bg-gold rounded-full transition-all" style={{ width: Math.min(100, (session.pts / nextAt) * 100) + '%' }} />
            </div>
            <p className="text-[10px] text-cream/75 mt-1.5">باقي {ar(Math.max(0, nextAt - session.pts))} نقطة لقسيمة خصم ٢٥ ر.س</p>
          </div>
        </div>
        <div className="bg-card rounded-3xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5"><Wallet size={14} className="text-brand" /> محفظة ضمين</span>
            <span className="text-[10px] bg-sand font-black text-ink px-2 py-0.5 rounded-full">استرجاعاتك تصل هنا</span>
          </div>
          <div className="text-4xl font-black mt-2 text-brand tabular-nums">{money(session.bal)}</div>
          <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">رصيد المحفظة قابل للاستخدام في أي طلب عبر «محفظة ضمين» ببوابة الدفع.</p>
        </div>
      </div>

      {/* إحصاءات سريعة */}
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { v: ar(orders.filter(o => o.customer === session.phone).length), l: 'طلب' },
          { v: ar(protected_), l: 'تحت الحماية' },
          { v: ar(session.pts), l: 'نقطة ولاء' },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border py-3.5">
            <div className="text-xl font-black text-brand tabular-nums">{s.v}</div>
            <div className="text-[10px] font-bold text-muted-foreground mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      {/* التنبيهات */}
      <div className="bg-card rounded-3xl border border-border p-5 space-y-1 shadow-sm">
        <h3 className="font-extrabold text-sm flex items-center gap-2 mb-2"><Bell size={15} className="text-brand" /> تنبيهاتي</h3>
        {[
          { k: 'ord', t: 'تحديثات الطلبات والشحن', d: 'بوليصات الشحن وحالة التجهيز' },
          { k: 'off', t: 'العروض والخصومات', d: 'خصومات المتاجر التي تحبها' },
          { k: 'dis', t: 'النزاعات والتحكيم', d: 'ردود فريق ضمين على نزاعاتك' },
          { k: 'rev', t: 'التقييمات والنقاط', d: 'تذكير بالتقييم ونقاط الولاء' },
        ].map(n => (
          <div key={n.k} className="flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0">
            <div>
              <div className="text-xs font-extrabold text-ink">{n.t}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{n.d}</div>
            </div>
            <Switch checked={notif[n.k as keyof typeof notif]} onCheckedChange={v => setNotif({ ...notif, [n.k]: v })} aria-label={n.t} />
          </div>
        ))}
      </div>

      <button className="w-full text-xs font-bold text-brand hover:underline" onClick={() => go({ name: 'disputes' })}>
        نزاعاتي وحالات التحكيم ←
      </button>
    </div>
  );
}

/* ============ النزاعات ============ */
export function DisputesPage() {
  const orders = useMyOrders();
  const { session } = useDameen();
  const list = orders.filter(o => o.dispute);
  return (
    <div className="py-2 max-w-3xl mx-auto">
      <SectionTitle title="نزاعاتي" sub="كل نزاع يبقى مبلغه محجوزاً حتى حكم الفريق الثلاثي" />
      {!session ? (
        <EmptyState icon="🔐" title="سجّل دخولك أولاً" cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => useDameen.getState().openAuth('login')}>تسجيل الدخول</Button>} />
      ) : list.length === 0 ? (
        <EmptyState
          icon="⚖️"
          title="لا نزاعات مفتوحة"
          sub="هذا جيد! إن لم يعجبك طلب مستقبلاً، افتح نزاعاً من بطاقة الطلب خلال نافذة الحماية."
        />
      ) : (
        <div className="space-y-3.5">
          {list.map((o, i) => (
            <div key={o.id} className="bg-card rounded-3xl border border-border p-5 shadow-sm">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-black text-ink">#{ar(o.id.replace('DM-', ''))}</span>
                <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${o.dispute!.status === 'open' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                  {o.dispute!.status === 'open' ? '⚖️ قيد التحكيم — مبلغك محجوز' : '✓ محسوم'}
                </span>
              </div>
              <div className="mt-3 text-xs space-y-1.5">
                <p><b className="text-ink">السبب:</b> <span className="text-muted-foreground">{o.dispute!.reason}</span></p>
                <p><b className="text-ink">الشرح:</b> <span className="text-muted-foreground leading-relaxed">{o.dispute!.desc}</span></p>
                {o.dispute!.verdict && <p className="font-extrabold text-brand mt-1">⚖️ {o.dispute!.verdict}</p>}
              </div>
              <div className="mt-4"><OrderCard o={o} index={i} /></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
