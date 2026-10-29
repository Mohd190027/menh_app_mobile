/* صفحات العميل الكاملة: الطلبات بشحنات مستقلة (بوليصة/OTP/حجز/إهداء/رقمي/تعديلات)، محادثة آمنة بحارس،
 * المكتبة الرقمية بروابط موقعة، المفضلة، الحساب (عناوين/نقاط/محفظة)، النزاعات */
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Package, ShieldCheck, MessageSquare, Send, Scale, Wallet, LogOut, Truck,
  CheckCircle2, Star, Heart, Copy, Eye, Download, Link as LinkIcon, MapPin, Timer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ar, COMPS, money, worldOf } from './data';
import { useDameen, useMe, useMyOrders, type ChatMsg, type Order, type OrderGroup } from './state';
import { Countdown, EmptyState, GroupSteps, ProductCard, SectionTitle, StatusChip, Stars } from './ui';
import { OrderTotals } from './shop-buy';

const fDate = (at: number) => new Date(at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' }) + '، ' + new Date(at).toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' });
const ago = (at: number) => {
  const s = (Date.now() - at) / 1000;
  if (s < 60) return 'قبل لحظات';
  if (s < 3600) return 'قبل ' + ar(Math.floor(s / 60)) + ' د';
  if (s < 86400) return 'قبل ' + ar(Math.floor(s / 3600)) + ' س';
  return 'قبل ' + ar(Math.floor(s / 86400)) + ' يوم';
};

/* ============ محادثة الطلب الآمنة (بحارس كامل + رسائل موقع/مبالغ) ============ */
export function ChatDialog({ oid, gi, open, onOpenChange }: { oid: number; gi: number; open: boolean; onOpenChange: (v: boolean) => void }) {
  const { orders, session, sendMsg, sendMyLoc, payExtra, stores, users } = useDameen();
  const o = orders.find(x => x.id === oid);
  const g = o?.groups[gi];
  const [txt, setTxt] = useState('');
  const [otp, setOtp] = useState('');
  const [extraAmt, setExtraAmt] = useState(25);
  const [extraNote, setExtraNote] = useState('');
  const [extraOpen, setExtraOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [g?.chat.length, open]);
  if (!o || !g || !g.chat) return null;
  const st = stores.find(s => s.id === g.store)!;
  const cust = users[o.customer];
  const role = session?.role === 'admin' ? 'admin' : session?.role === 'merchant' && g.store === session.store ? 'merchant' : o.customer === session?.phone ? 'customer' : null;
  const archived = g.chatArchived || ['received', 'released', 'refunded', 'disputed'].includes(g.status);
  const canWrite = (role === 'customer' || role === 'merchant') && !g.chatDeleted && !archived;
  const send = () => {
    if (sendMsg(oid, gi, role === 'merchant' ? 'merchant' : 'customer', txt)) setTxt('');
  };
  const shareLoc = () => {
    const fb = () => sendMyLoc(oid, gi, null, me2addr());
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        p => sendMyLoc(oid, gi, { lat: +p.coords.latitude.toFixed(4), lng: +p.coords.longitude.toFixed(4) }, 'موقعي الحالي'),
        fb, { timeout: 8000 });
    } else fb();
  };
  const me2addr = () => {
    const u = useDameen.getState().users[o.customer];
    return (u?.addrs.find(a => a.def) || u?.addrs[0])?.a || 'موقعي';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0 flex flex-col max-h-[85vh]" dir="rtl" aria-describedby={undefined}>
        <DialogHeader className="p-3.5 border-b border-border flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-sm flex items-center gap-2 flex-wrap">
            <MessageSquare size={16} className="text-brand" /> محادثة الطلب #{ar(o.id)} — {st.name}
            {g.chatDeleted ? <span className="text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 rounded-full px-2 py-0.5">محذوفة لمخالفة</span>
              : archived ? <span className="text-[10px] font-bold bg-muted text-muted-foreground rounded-full px-2 py-0.5">🗄️ مؤرشفة</span>
              : <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">نشطة</span>}
          </DialogTitle>
        </DialogHeader>
        <div className="px-4 py-2 border-b border-border bg-sand/40 flex items-center gap-3 flex-wrap text-[10.5px] font-bold">
          <span className="inline-flex items-center gap-1 text-emerald-800">👩 {cust?.name.split(' ')[0] || 'العميل'}</span>
          <span className="inline-flex items-center gap-1" style={{ color: st.color }}>🏪 {st.name}</span>
          <span className="inline-flex items-center gap-1 text-brand">🛡️ الإدارة تُتابع تلقائياً</span>
          {(g.viol.customer + g.viol.merchant) > 0 && <span className="text-red-600">{ar(g.viol.customer + g.viol.merchant)} رسالة محجوبة أمنياً</span>}
        </div>
        <div ref={box} className="flex-1 overflow-y-auto p-3.5 space-y-2 min-h-48">
          {g.chat.map((m, mi) => <ChatBubble key={mi} m={m} o={o} g={g} role={role} onPayExtra={() => payExtra(oid, gi, mi)} />)}
        </div>
        {canWrite ? (
          <div className="border-t border-border p-3 space-y-2">
            <div className="flex gap-2 flex-wrap">
              {role === 'customer' && <Button variant="outline" size="sm" className="text-[11px] h-8" onClick={shareLoc}>📍 مشاركة موقعي مع المتجر</Button>}
              {role === 'merchant' && <Button size="sm" className="text-[11px] h-8 bg-gold text-brand hover:brightness-105" onClick={() => setExtraOpen(v => !v)}>💰 طلب مبلغ إضافي (تعديل)</Button>}
            </div>
            {extraOpen && role === 'merchant' && (
              <div className="rounded-xl border border-gold/40 bg-gold/10 p-2.5 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10.5px] font-bold">المبلغ (ر.س)</Label>
                    <Input type="number" className="h-8 text-xs mt-1" value={extraAmt} onChange={e => setExtraAmt(+e.target.value || 0)} />
                  </div>
                  <div>
                    <Label className="text-[10.5px] font-bold">السبب (يظهر للعميل)</Label>
                    <Input className="h-8 text-xs mt-1" placeholder="مثال: إضافة اسم مطرز" value={extraNote} onChange={e => setExtraNote(e.target.value)} />
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">يُرسل طلب الدفع داخل المحادثة — يدفع العميل بضمان ضمين، ويُحجز المبلغ مع بقية قيمة الطلب في الخزنة حتى الاستلام والتحرير.</p>
                <Button size="sm" className="w-full bg-gold text-brand font-extrabold" onClick={() => { useDameen.getState().askExtra(oid, gi, Math.max(1, extraAmt), extraNote); setExtraOpen(false); setExtraNote(''); }}>إرسال طلب الدفع للعميل</Button>
              </div>
            )}
            <div className="flex gap-2">
              <Textarea className="text-xs min-h-10" rows={1} placeholder="اكتب تفاصيل طلبك… (تُحجب الأرقام والروابط تلقائياً)" value={txt} onChange={e => setTxt(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
              <Button className="bg-brand hover:bg-brand-2 font-bold shrink-0 self-end" size="sm" onClick={send}><Send size={15} /></Button>
            </div>
          </div>
        ) : (
          <div className="border-t border-border p-3 text-[11px] text-muted-foreground leading-relaxed">
            {g.chatDeleted ? '🚫 حُذفت المحادثة نهائياً بعد رصد ٣ مخالفات لسياسة التواصل خارج التطبيق — للاعتراض راسل دعم ضمين.'
              : archived ? '🗄️ أُرشفت المحادثة فور تسليم الشحنة — للاعتراض افتح نزاعاً خلال نافذة الحماية.'
              : role === 'admin' ? '🛡️ أنت بوضع المراقبة — الإدارة تطلع ولا تشارك'
              : '🔒 سجّل دخولك كأحد طرفي الطلب للمشاركة'}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ChatBubble({ m, o, g, role, onPayExtra }: { m: ChatMsg; o: Order; g: OrderGroup; role: string | null; onPayExtra: () => void }) {
  const { users, stores } = useDameen();
  if (m.r === 'sys' || m.r === 'dameen') {
    return <div className="text-center text-[10.5px] font-semibold text-muted-foreground bg-sand/70 border border-dashed border-border rounded-xl px-3 py-2">🔔 {m.t} <span className="block text-[9px] opacity-70 mt-0.5">{ago(m.at)}</span></div>;
  }
  const mine = (m.r === 'customer' && role === 'customer') || (m.r === 'merchant' && role === 'merchant');
  const st = stores.find(s => s.id === g.store)!;
  const who = m.r === 'customer' ? '👩 ' + (users[o.customer]?.name.split(' ')[0] || 'العميل') : '🏪 ' + st.name;
  return (
    <div className={`flex ${mine ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${m.r === 'customer' ? 'bg-emerald-50 border border-emerald-100 text-ink' : 'bg-white border text-ink'}`} style={m.r === 'merchant' ? { borderColor: st.color + '55', background: st.color + '0d' } : undefined}>
        <span className="block text-[9.5px] font-bold text-muted-foreground mb-0.5">
          {who}
          {m.loc && ' · 📍 مشاركة موقع'}
          {m.payreq && ' · 💰 طلب مبلغ إضافي'}
        </span>
        {m.loc ? (
          <span className="inline-flex items-center gap-1.5 font-bold text-brand">
            <MapPin size={13} /> {m.loc.txt}
            {m.loc.geo && <span className="text-[10px] text-muted-foreground">({ar(m.loc.geo.lat)}، {ar(m.loc.geo.lng)})</span>}
          </span>
        ) : m.payreq ? (
          <div className="space-y-1.5">
            <b className="block">تعديل بـ {money(m.payreq.amt)}</b>
            {m.payreq.note && <span className="block text-[11px] text-muted-foreground">{m.payreq.note}</span>}
            {m.payreq.paid
              ? <span className="inline-block text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5">✓ سُدد وحُجز في الخزنة — {m.payreq.via || 'محفظة ضمين'}</span>
              : role === 'customer'
                ? <Button size="sm" className="h-7 text-[11px] bg-gold text-brand hover:brightness-105" onClick={onPayExtra}>🔒 ادفع {money(m.payreq.amt)} بضمان ضمين</Button>
                : <span className="inline-block text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">بانتظار دفع العميل</span>}
          </div>
        ) : m.t}
        <span className="block text-[9px] text-muted-foreground opacity-70 mt-1">{ago(m.at)}</span>
      </div>
    </div>
  );
}

/* ============ صندوق OTP للخدمات الميدانية ============ */
export function OtpBox({ o, g, gi }: { o: Order; g: OrderGroup; gi: number }) {
  const [code, setCode] = useState('');
  return (
    <div className="rounded-xl border-1.5 border-dashed border-brand/40 bg-brand/5 p-3 mt-2.5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <b className="text-[12px]">🎯 تأكيد إتمام الخدمة بكود OTP</b>
        {g.otp
          ? <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">الكود وصل جوالك: <b className="tracking-widest">{ar(g.otp)}</b></span>
          : <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5">بانتظار كود فريق التنسيق بعد التركيب</span>}
      </div>
      <p className="text-[10.5px] text-muted-foreground leading-relaxed mt-1.5">لا تُحرر مستحقات متجر الديكور والفعاليات إلا بإدخال كود التأكيد منك عند اكتمال التركيب في موقع المناسبة — حماية للطرفين، وبقية مبلغك محجوز بالخزنة حتى ذلك الحين.</p>
      <div className="flex gap-2 items-center flex-wrap mt-2">
        <Input className="w-32 text-center tracking-widest font-extrabold h-9" maxLength={4} placeholder="٠٠٠٠" dir="ltr" value={code} onChange={e => setCode(e.target.value)} />
        <Button size="sm" className="bg-brand hover:bg-brand-2 font-bold" onClick={() => { if (useDameen.getState().checkOTP(o.id, gi, code)) setCode(''); }}>✅ تأكيد إتمام الخدمة</Button>
        {!!g.otpBad && <span className="text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 rounded-full px-2 py-0.5">{ar(g.otpBad)} محاولة خاطئة</span>}
      </div>
    </div>
  );
}

/* ============ شريط البوليصة ============ */
function WaybillStrip({ o, g }: { o: Order; g: OrderGroup }) {
  const st = useDameen(s => s.stores.find(x => x.id === g.store)!);
  const [open, setOpen] = useState(false);
  if (!g.logi) return null;
  const l = g.logi;
  const modeTxt = l.mode === 'chilled' ? '🧊 جارٍ جدولة توصيل مبرد مع أقرب شركة توصيل مبرد متعاقدة (موعد مسبق)'
    : l.mode === 'instant' ? '🛵 جارٍ البحث عن مندوب فوري — وقت التوصيل المتوقع: ٤٥ دقيقة'
    : '🚚 تتبع بالحالات فقط — بلا خريطة مباشرة حفاظاً على خصوصية الطرفين';
  return (
    <div className="mt-2.5 rounded-xl border border-border bg-sand/50 p-2.5">
      <div className="flex items-center justify-between flex-wrap gap-1.5">
        <b className="text-[11.5px]">{l.wb ? '📄 بوليصة ' + ar(l.wb) + ' · ' : ''}{l.courier}</b>
        <button className="text-[10px] font-bold text-brand" onClick={() => setOpen(v => !v)}>{open ? 'إخفاء التتبع ▴' : 'تتبع الشحنة ▾'}</button>
      </div>
      <div className="text-[10.5px] text-muted-foreground mt-1">{modeTxt} · من {st.city} إلى {o.city}</div>
      {open && (
        <div className="mt-2 space-y-1.5 border-t border-dashed border-border pt-2">
          {l.events.map((e, i) => (
            <div key={i} className="flex gap-2 items-start text-[10.5px]">
              <span className="w-4 h-4 rounded-full bg-brand text-cream text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">{ar(i + 1)}</span>
              <span className="text-ink leading-relaxed">{e.t} <span className="text-muted-foreground text-[9px] block">{ago(e.at)}</span></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============ بطاقة شحنة (مستقلة لكل متجر) ============ */
export function GroupCard({ o, g, gi, merchantView = false }: { o: Order; g: OrderGroup; gi: number; merchantView?: boolean }) {
  const { stores, products, session, confirmReceive, rateOrder, openDispute, acceptOrder, shipOrder, sendOTP } = useDameen();
  const st = stores.find(x => x.id === g.store)!;
  const w = worldOf(g.store);
  const [chatOpen, setChatOpen] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);
  const [myStars, setMyStars] = useState(0);
  const [myTxt, setMyTxt] = useState('');
  const [dispOpen, setDispOpen] = useState(false);
  const [sub, setSub] = useState('damaged');
  const [desc, setDesc] = useState('');
  const [want, setWant] = useState('');
  const [got, setGot] = useState('');
  const isCust = session?.phone === o.customer;

  return (
    <div className="mt-3 rounded-2xl border border-border bg-card p-3.5">
      {/* رأس الشحنة */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-sm" style={{ background: st.color }}>{st.name.charAt(0)}</span>
          <div>
            <b className="text-[13px]" style={{ color: st.color }}>{st.name}</b>
            <div className="text-[10px] text-muted-foreground">شحنة مستقلة · 🛡️ حماية {w.win} بعد الاستلام</div>
          </div>
        </div>
        <StatusChip status={g.status} />
      </div>

      {/* العناصر */}
      <div className="flex flex-wrap gap-1.5 mt-2.5">
        {g.items.map(it => {
          const p = products.find(x => x.id === it.pid);
          return (
            <span key={it.pid} className="inline-flex items-center gap-1.5 bg-sand/60 border border-border rounded-full px-2 py-1 text-[10.5px] font-semibold">
              {p?.imgs[0] && <img src={p.imgs[0]} alt="" className="w-4 h-4 rounded-full object-cover" />}
              {ar(it.qty)}× {p?.name || '—'}
            </span>
          );
        })}
      </div>

      <WaybillStrip o={o} g={g} />

      {/* حجز المناسبة */}
      {g.booking && (
        <div className="mt-2.5 text-[10.5px] leading-relaxed bg-amber-50/50 border border-dashed border-amber-300 rounded-xl p-2.5">
          <b>🎪 حجز المناسبة:</b> {g.booking.date} · التركيب {g.booking.setup}
          {g.booking.tear ? ' · الفك ' + g.booking.tear : ''}
          {g.booking.dl === 'pickup' ? ' · 🚶 استلام من مقر المتجر بلا توصيل' : ' · 🚚 فريق المتجر يوصل ويركّب'}
          {g.booking.geo ? ' · 📍 موقع المناسبة محدد لفريق التنسيق' : ''}
          {g.booking.note ? ' · ' + g.booking.note : ''}
        </div>
      )}

      {/* الإهداء */}
      {g.gift && (
        <div className="mt-2.5 text-[10.5px] bg-rose-50/60 border border-rose-200 rounded-xl p-2.5">
          🎁 إهداء إلى: <b>{g.gift.name || 'مستلم'}</b> · {ar(g.gift.phone)} · {g.gift.city} — صدرت البوليصة باسم المستلم فتوصله الهدية مباشرة
        </div>
      )}

      {/* رقمي */}
      {g.digi && (
        <div className="mt-2.5 text-[10.5px] bg-violet-50/60 border border-violet-200 rounded-xl p-2.5 flex items-center justify-between flex-wrap gap-1.5">
          <span>⚡ طلب رقمي — سُلّم فوراً إلى مكتبتك الرقمية والكود/الملف جاهز للعرض والتحميل</span>
          {isCust && <Button size="sm" variant="outline" className="h-7 text-[10.5px] font-bold" onClick={() => useDameen.getState().go({ name: 'dlib' })}>📚 افتح مكتبتي</Button>}
        </div>
      )}

      {/* قابل للتعديل */}
      {g.custom && (
        <div className="mt-2.5 text-[10.5px] bg-amber-50/60 border border-amber-200 rounded-xl p-2.5">
          ✏️ طلب قابل للتعديل — راسل متجرك عبر محادثة الطلب بأي تعديل (أي مبلغ إضافي يُحجز بضمان ضمين حتى الاستلام)
        </div>
      )}

      {/* مبلغ إضافي محجوز */}
      {(g.extra || 0) > 0 && (
        <div className="mt-2.5 text-[10.5px] bg-brand/5 border border-brand/25 rounded-xl p-2.5">
          💰 أُضيف للشحنة مبلغ تعديلات محجوز بالخزنة: <b>{money(g.extra)}</b>
        </div>
      )}

      {/* أسئلة وأجوبة */}
      {g.ans && g.ans.length > 0 && (
        <div className="mt-2.5 text-[10.5px] text-muted-foreground leading-relaxed">
          ❓ إجاباتك للمتجر: {g.ans.map((x, i) => <span key={i}>{x.q} ← <b className="text-ink">{x.a}</b>{i < g.ans!.length - 1 ? ' · ' : ''}</span>)}
        </div>
      )}
      {g.pans && g.pans.length > 0 && (
        <div className="mt-1.5 text-[10.5px] text-muted-foreground leading-relaxed">
          ❓ أسئلة المنتجات: {g.pans.map((x, i) => <span key={i}>{x.pn} — {x.ans.map((y, j) => <span key={j}>{y.q} ← <b className="text-ink">{y.a}</b>{j < x.ans.length - 1 ? ' · ' : ''}</span>)}{i < g.pans!.length - 1 ? ' · ' : ''}</span>)}
        </div>
      )}

      {/* المحادثة */}
      {g.chat && g.chat.length > 0 && (
        <div className="mt-2.5 flex gap-2 items-center flex-wrap">
          <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold" onClick={() => setChatOpen(true)}>
            💬 محادثة الطلب{g.chatDeleted ? ' — محذوفة لمخالفة' : g.chatArchived ? ' — مؤرشفة' : ' (' + ar(g.chat.length) + ' رسالة)'}
          </Button>
          {(g.viol.customer + g.viol.merchant) > 0 && <span className="text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 rounded-full px-2 py-0.5">{ar(g.viol.customer + g.viol.merchant)} رسالة محجوبة أمنياً</span>}
        </div>
      )}

      {/* خطوات الشحنة */}
      {!['disputed', 'refunded'].includes(g.status) && <GroupSteps status={g.status} />}

      {/* إجراءات العميل */}
      {isCust && g.status === 'received' && (
        <div className="mt-3 space-y-2.5">
          {g.complaintUntil && <Countdown until={g.complaintUntil} />}
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" className="bg-gold text-brand hover:brightness-105 font-extrabold" onClick={() => setRateOpen(true)}>⭐ قيّم وحرر فوراً</Button>
            <Button size="sm" variant="destructive" className="font-bold" onClick={() => setDispOpen(true)}>⚠️ فتح نزاع</Button>
          </div>
        </div>
      )}
      {isCust && g.status === 'shipped' && (
        g.ship?.mode === 'field'
          ? <div className="mt-2"><OtpBox o={o} g={g} gi={gi} /></div>
          : <Button size="sm" className="mt-2.5 bg-brand hover:bg-brand-2 font-bold" onClick={() => confirmReceive(o.id, gi)}>📦 استلمت الشحنة — ابدأ الفحص</Button>
      )}
      {isCust && g.status === 'pending' && <div className="text-[10.5px] text-muted-foreground mt-2">بانتظار قبول المتجر للطلب…</div>}
      {isCust && g.status === 'preparing' && <div className="text-[10.5px] text-muted-foreground mt-2">🧵 المتجر يحضّر طلبك الآن</div>}

      {/* إجراءات التاجر */}
      {merchantView && g.status === 'pending' && <Button size="sm" className="mt-2.5 bg-brand hover:bg-brand-2 font-bold" onClick={() => acceptOrder(o.id, gi)}>✅ قبول الطلب والتحضير</Button>}
      {merchantView && g.status === 'preparing' && <Button size="sm" className="mt-2.5 bg-brand hover:bg-brand-2 font-bold" onClick={() => shipOrder(o.id, gi)}>🚚 شحن الطلب (بوليصة آلية)</Button>}
      {merchantView && g.status === 'shipped' && g.ship?.mode === 'field' && !g.otp && (
        <Button size="sm" className="mt-2.5 bg-gold text-brand hover:brightness-105 font-extrabold" onClick={() => sendOTP(o.id, gi)}>🎯 اكتمل التركيب — أرسل كود التأكيد</Button>
      )}
      {merchantView && g.status === 'shipped' && g.ship?.mode === 'field' && !!g.otp && !g.otpOk && (
        <div className="text-[10.5px] text-muted-foreground mt-2">🎯 بانتظار إدخال العميل كود التأكيد — لا تُحرر مستحقاتك إلا بعده</div>
      )}

      {/* تفصيل التحرير */}
      {g.status === 'released' && g.payout && (
        <div className="mt-2.5 bg-brand/5 border border-dashed border-brand/30 rounded-xl p-2.5 text-[10.5px]">
          <b className="text-brand">🔓 تفصيل التحرير</b> — إجمالي الشحنة {money(g.payout.sub)} · عمولة ضمين: {money(g.payout.comm)} · صافي التاجر: {money(g.payout.net)}
          {g.rated && <span> · تقييمك: <Stars rt={g.rated.stars} size={10} /></span>}
        </div>
      )}
      {g.status === 'refunded' && <div className="text-[10.5px] text-muted-foreground mt-2.5">💸 استُرجع كامل مبلغ الشحنة ({money(g.sub)}) إلى محفظة ضمين — استخدمه في طلبك القادم.</div>}

      <div className="text-[11px] text-muted-foreground mt-2.5">إجمالي الشحنة: <b className="text-ink">{money(Math.round((g.sub + g.dl + (g.extra || 0)) * 100) / 100)}</b>{g.dl ? ` (شحن ${money(g.dl)})` : ''}</div>

      {/* نافذة التقييم */}
      <Dialog open={rateOpen} onOpenChange={setRateOpen}>
        <DialogContent className="max-w-sm" dir="rtl" aria-describedby={undefined}>
          <DialogHeader><DialogTitle className="text-sm">⭐ التقييم والتحرير الفوري</DialogTitle></DialogHeader>
          <p className="text-[11px] text-muted-foreground leading-relaxed">تقييمك يحرر المبلغ للتاجر فوراً ويمنحك <b>+١٠ نقاط</b> إضافية — يمكنك أيضاً الانتظار حتى تنتهي نافذة الحماية تلقائياً.</p>
          <div className="flex gap-1 justify-center my-2" dir="ltr">
            {[1, 2, 3, 4, 5].map(i => (
              <button key={i} aria-label={`${i} نجوم`} onClick={() => setMyStars(i)}><Star size={26} className={i <= myStars ? 'fill-gold text-gold' : 'text-border'} /></button>
            ))}
          </div>
          <Textarea className="text-xs" placeholder="كيف كانت تجربتك مع المنتج والتغليف والسرعة؟" value={myTxt} onChange={e => setMyTxt(e.target.value)} />
          <Button className="bg-gold text-brand hover:brightness-105 font-extrabold" onClick={() => { if (!myStars) { toast.error('اختر النجوم أولاً'); return; } rateOrder(o.id, gi, myStars, myTxt); setRateOpen(false); }}>🚀 أرسل التقييم وحرر المبلغ</Button>
        </DialogContent>
      </Dialog>

      {/* نافذة النزاع */}
      <Dialog open={dispOpen} onOpenChange={setDispOpen}>
        <DialogContent className="max-w-md" dir="rtl" aria-describedby={undefined}>
          <DialogHeader><DialogTitle className="text-sm">⚠️ فتح نزاع على الشحنة</DialogTitle></DialogHeader>
          <div className="bg-brand/5 border border-brand/20 rounded-xl p-2.5 text-[11px] leading-relaxed">
            <b>🛡️ لا تقلق — مبلغك ما زال محجوزاً</b>
            <p className="text-muted-foreground mt-1">افتح النزاع خلال نافذة الحماية وسيبقى المبلغ معلقاً حتى تصدر الإدارة حكمها بدردشة ثلاثية الأطراف.</p>
          </div>
          <div>
            <Label className="text-xs font-bold">سبب النزاع</Label>
            <Select value={sub} onValueChange={setSub}>
              <SelectTrigger className="mt-1 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.entries(COMPS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {sub === 'notmatch' && (
            <div className="grid grid-cols-2 gap-2">
              <div><Label className="text-[11px] font-bold">ماذا طلبت؟</Label><Input className="h-9 text-xs mt-1" placeholder="مثال: بوكس أخضر زيتي" value={want} onChange={e => setWant(e.target.value)} /></div>
              <div><Label className="text-[11px] font-bold">ماذا وصلك؟</Label><Input className="h-9 text-xs mt-1" placeholder="مثال: كحلي غامق" value={got} onChange={e => setGot(e.target.value)} /></div>
            </div>
          )}
          <div>
            <Label className="text-xs font-bold">{sub === 'damaged' ? 'صف الضرر بدقة' : sub === 'notmatch' ? 'تفاصيل إضافية' : 'اشرح ما حدث بدقة'}</Label>
            <Textarea className="text-xs mt-1" value={desc} onChange={e => setDesc(e.target.value)} placeholder="كل التفاصيل تساعد الإدارة على الحكم العادل…" />
          </div>
          <Button variant="destructive" className="font-extrabold" onClick={() => {
            if (!desc.trim()) { toast.error('اشرح المشكلة أولاً'); return; }
            openDispute(o.id, gi, COMPS[sub], desc.trim(), sub === 'notmatch' ? want : undefined, sub === 'notmatch' ? got : undefined);
            setDispOpen(false); setDesc('');
          }}>⚖️ افتح النزاع</Button>
        </DialogContent>
      </Dialog>

      <ChatDialog oid={o.id} gi={gi} open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}

/* ============ بطاقة طلب كاملة ============ */
export function OrderCard({ o }: { o: Order }) {
  const { users } = useDameen();
  const cust = users[o.customer];
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-sand/30 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <b className="text-[15px] text-ink">طلب #{ar(o.id)}</b>
          <div className="text-[10.5px] text-muted-foreground">{fDate(o.at)}</div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {o.coupon && o.coupon.amt > 0 && <span className="text-[10px] font-bold bg-gold/20 text-amber-800 rounded-full px-2 py-0.5">كوبون −{money(o.coupon.amt)}</span>}
          {o.ptsUsed > 0 && <span className="text-[10px] font-bold bg-gold/20 text-amber-800 rounded-full px-2 py-0.5">نقاط −{money(o.ptsAmt)}</span>}
          {o.freeDl && <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">🚚 توصيل مجاني (نقاط)</span>}
        </div>
      </div>
      <OrderTotals o={o} />
      {o.groups.map((g, gi) => <GroupCard key={g.store + gi} o={o} g={g} gi={gi} />)}
    </motion.div>
  );
}

/* ============ صفحة طلباتي ============ */
export function OrdersPage() {
  const { session, openAuth, go } = useDameen();
  const orders = useMyOrders();
  const [f, setF] = useState('all');
  if (!session) {
    return <EmptyState icon="🔐" title="سجّل دخولك لمتابعة طلباتك" sub="ستجد هنا كل شحنة بحالتها وعدّاد الحماية" cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => openAuth('login')}>تسجيل الدخول</Button>} />;
  }
  const mine = session.role === 'customer' ? orders : orders;
  const filtered = f === 'all' ? mine : mine.filter(o => o.groups.some(g =>
    f === 'current' ? ['pending', 'preparing', 'shipped', 'received'].includes(g.status)
    : f === 'disputed' ? g.status === 'disputed'
    : g.status === f));
  return (
    <div>
      <SectionTitle title="🧾 طلباتي" sub={`${ar(mine.length)} طلبات — كل متجر شحنة مستقلة بحمايتها`} action={
        <Select value={f} onValueChange={setF}>
          <SelectTrigger className="w-40 text-xs h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الطلبات</SelectItem>
            <SelectItem value="current">الجارية</SelectItem>
            <SelectItem value="received">قيد الفحص</SelectItem>
            <SelectItem value="released">المحررة</SelectItem>
            <SelectItem value="disputed">النزاعات</SelectItem>
          </SelectContent>
        </Select>
      } />
      {filtered.length === 0 ? (
        <EmptyState icon="📦" title="لا طلبات هنا" sub="أول طلب لك سيظهر بحالاته المباشرة" cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => go({ name: 'home' })}>ابدأ التسوق</Button>} />
      ) : (
        <div className="space-y-4">{filtered.map(o => <OrderCard key={o.id} o={o} />)}</div>
      )}
    </div>
  );
}

/* ============ المكتبة الرقمية ============ */
export function DLibPage() {
  const { session, openAuth, go, stores, users } = useDameen();
  const me = useMe();
  const [reveal, setReveal] = useState<Record<number, boolean>>({});
  const [linkFor, setLinkFor] = useState<number | null>(null);
  if (!session) {
    return <EmptyState icon="🔐" title="سجّل دخولك لعرض مكتبتك" sub="كل أصل رقمي تشتريه في ضمين يُسلَّم فوراً هنا" cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => openAuth('login')}>تسجيل الدخول</Button>} />;
  }
  const lib = me?.dlib || [];
  if (lib.length === 0) {
    return (
      <div>
        <SectionTitle title="📚 مكتبتي الرقمية" />
        <EmptyState icon="⚡" title="لا مشتريات رقمية بعد" sub="تصفح «عالم الألعاب والأجهزة والمنتجات الرقمية» — التسليم فوري بعد الدفع بضمان ضمين" cta={<Button className="bg-violet-600 hover:bg-violet-700 text-white font-bold" onClick={() => go({ name: 'section', id: 'gaming' })}>🛒 تسوّق الرقميات</Button>} />
      </div>
    );
  }
  return (
    <div>
      <SectionTitle title="📚 مكتبتي الرقمية" sub={`${ar(lib.length)} أصل رقمي — تسليم فوري بضمان ضمين`} />
      <p className="text-[11px] text-muted-foreground leading-relaxed mb-4 -mt-2">
        ⚡ كل لعبة رقمية أو كود اشتراك أو كتاب إلكتروني تشتريه يُسلَّم هنا فور الدفع — الأكواد تُعرض مباشرة، والملفات عبر روابط مؤقتة آمنة موقّعة (S3 Signed) صالحة ١٠ دقائق لكل عملية، وتبقى مشترياتك محفوظة دائماً.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {lib.map((it, i) => {
          const s = stores.find(x => x.id === it.store);
          const p = useDameen.getState().products.find(x => x.id === it.pid);
          return (
            <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
              <div className="h-28 bg-sand relative">
                {p?.imgs[0] && <img src={p.imgs[0]} alt={it.name} className="w-full h-full object-cover" />}
                <span className="absolute top-2 end-2 text-[9px] font-bold bg-violet-600 text-white rounded-full px-2 py-0.5">⚡ رقمي</span>
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <b className="text-[12px] leading-snug">{it.name}</b>
                <div className="text-[10px] text-muted-foreground mt-1 mb-2">{s?.name} · طلب #{ar(it.oid)} · {fDate(it.at)}</div>
                {it.kind === 'code' ? (
                  <>
                    <div className="font-mono text-[12px] font-extrabold text-center bg-sand/70 border border-dashed border-border rounded-lg py-2 tracking-wider" dir="ltr">
                      {reveal[i] ? it.val : '••••-••••-••••-••••'}
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      <Button variant="outline" size="sm" className="flex-1 h-8 text-[10.5px] font-bold" onClick={() => setReveal(r => ({ ...r, [i]: !r[i] }))}><Eye size={12} className="me-1" />{reveal[i] ? 'إخفاء' : 'إظهار'}</Button>
                      <Button variant="outline" size="sm" className="flex-1 h-8 text-[10.5px] font-bold" onClick={() => { const done = () => toast.success('نُسخ الكود إلى الحافظة ✓'); if (navigator.clipboard?.writeText) navigator.clipboard.writeText(it.val).then(done, done); else done(); }}><Copy size={12} className="me-1" />نسخ</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-[10.5px] text-muted-foreground mb-2">📁 {it.val}{it.size ? ' · ' + it.size : ''}</div>
                    <Button size="sm" className="mt-auto bg-violet-600 hover:bg-violet-700 text-white font-bold h-8 text-[10.5px]" onClick={() => setLinkFor(i)}><LinkIcon size={12} className="me-1" />تحميل عبر رابط مؤقت آمن</Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10.5px] text-muted-foreground text-center mt-5">🔒 الروابط المؤقتة موقّعة رقمياً وتنتهي بعد ١٠ دقائق — والمحتوى محفوظ في مكتبتك دائماً.</p>
      {linkFor !== null && <SignedLinkDialog item={lib[linkFor]} onClose={() => setLinkFor(null)} />}
    </div>
  );
}

/* رابط موقّع مؤقت مع عدّاد ١٠ دقائق */
function SignedLinkDialog({ item, onClose }: { item: { val: string; size: string; name: string; oid: number; store: string }; onClose: () => void }) {
  const [exp] = useState(() => Date.now() + 600000);
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const left = Math.max(0, exp - now);
  const mm = String(Math.floor(left / 60000)).padStart(2, '0');
  const ss = String(Math.floor((left % 60000) / 1000)).padStart(2, '0');
  const tok = Math.random().toString(36).slice(2, 10).toUpperCase();
  const url = `https://files.dameen.sa/${encodeURIComponent(item.val)}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=DMN%2F2026%2Fme-central-1%2Fs3%2Faws4_request&X-Amz-Expires=600&token=${tok}`;
  const download = () => {
    const txt = 'ضمين — تسليم رقمي آمن\n====================\nالمنتج: ' + item.name + '\nرقم الطلب: #' + item.oid + '\nالملف: ' + item.val + '\n\nرابط مؤقت موقع رقمياً (S3 Signed URL) صالح ١٠ دقائق.\nشكراً لتسوقك بضمان ضمين 💚';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['\ufeff' + txt], { type: 'text/plain;charset=utf-8' }));
    a.download = String(item.val).replace(/\.[^.]+$/, '') + '-dameen.txt';
    document.body.appendChild(a); a.click(); a.remove();
    toast.success('بدأ التنزيل عبر الرابط المؤقت ✓');
  };
  return (
    <Dialog open onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md" dir="rtl" aria-describedby={undefined}>
        <DialogHeader><DialogTitle className="text-sm">🔗 رابط مؤقت آمن (S3 Signed URL)</DialogTitle></DialogHeader>
        <div className="bg-sand/60 border border-dashed border-border rounded-xl p-3">
          <b className="text-[12px]">{item.val}</b>
          <p className="text-[10px] text-muted-foreground mt-1 break-all" dir="ltr" style={{ fontFamily: 'monospace' }}>{url}</p>
        </div>
        <div className="flex justify-between text-xs"><span className="text-muted-foreground">⏳ صلاحية الرابط</span><b className="tabular-nums" dir="ltr">{ar(mm)}:{ar(ss)}</b></div>
        <div className="flex justify-between text-xs"><span className="text-muted-foreground">📁 الملف</span><b>{item.val}{item.size ? ' · ' + item.size : ''}</b></div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white font-extrabold" disabled={left <= 0} onClick={download}><Download size={14} className="me-1" />⬇️ تنزيل الملف الآن</Button>
        <p className="text-[10.5px] text-muted-foreground text-center leading-relaxed">ينتهي الرابط تلقائياً بعد ١٠ دقائق — ويمكنك توليد رابط جديد من مكتبتك وقت الحاجة.</p>
      </DialogContent>
    </Dialog>
  );
}

/* ============ المفضلة ============ */
export function FavoritesPage() {
  const { favorites, products } = useDameen();
  const ps = favorites.map(id => products.find(p => p.id === id)).filter(Boolean);
  return (
    <div>
      <SectionTitle title="❤️ مفضلتي" sub={`${ar(ps.length)} منتج`} />
      {ps.length === 0
        ? <EmptyState icon="🤍" title="لا منتجات في مفضلتك بعد" sub="اضغط ♡ على أي منتج يعجبك" />
        : <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{ps.map((p, i) => <ProductCard key={p!.id} p={p!} index={i} />)}</div>}
    </div>
  );
}

/* ============ حسابي ============ */
export function AccountPage() {
  const { session, logout, go } = useDameen();
  const me = useMe();
  const { users } = useDameen();
  if (!session || !me) return null;
  const f = (l: { t: string; v: number; at: number }, i: number) => (
    <div key={i} className="flex items-center justify-between text-[11px] py-1.5 border-b border-dashed border-border last:border-0">
      <span className="text-muted-foreground">{l.t} <span className="text-[9px] block">{fDate(l.at)}</span></span>
      <b className={l.v >= 0 ? 'text-brand' : 'text-red-600'}>{l.v >= 0 ? '+' : ''}{ar(l.v)}</b>
    </div>
  );
  return (
    <div className="max-w-3xl mx-auto">
      <SectionTitle title="👤 حسابي" />
      <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 mb-4">
        <span className="w-16 h-16 rounded-2xl bg-gold text-brand text-2xl font-black flex items-center justify-center">{me.name.charAt(0)}</span>
        <div className="flex-1">
          <b className="text-lg text-ink">{me.name}</b>
          <div className="text-xs text-muted-foreground" dir="ltr">{ar(me.phone)}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">{me.email || 'بدون بريد'} · {session.role === 'customer' ? 'عميل ضمين' : session.role === 'merchant' ? 'تاجر ضمين' : 'إدارة ضمين'}</div>
        </div>
        <Button variant="outline" size="sm" className="text-red-600 font-bold" onClick={logout}><LogOut size={14} className="me-1" />خروج</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <b className="text-sm flex items-center gap-1.5 mb-2"><Star size={15} className="fill-gold text-gold" /> نقاط الولاء</b>
          <div className="text-2xl font-black text-brand">{ar(me.pts)} <span className="text-xs font-bold text-muted-foreground">نقطة</span></div>
          <p className="text-[10.5px] text-muted-foreground mt-1 leading-relaxed">كل ١٠٠ نقطة = {money(100 * useDameen.getState().ptsVal)} خصماً — أو استبدل {ar(useDameen.getState().freeDlPts)} نقطة بتوصيل مجاني لأي طلب.</p>
          <div className="mt-3 max-h-40 overflow-y-auto">
            {me.ptsLog.length ? me.ptsLog.slice(0, 10).map(f) : <p className="text-[11px] text-muted-foreground">لا حركات نقاط بعد</p>}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <b className="text-sm flex items-center gap-1.5 mb-2"><Wallet size={15} className="text-brand" /> محفظة ضمين</b>
          <div className="text-2xl font-black text-brand">{money(me.bal)}</div>
          <p className="text-[10.5px] text-muted-foreground mt-1 leading-relaxed">رصيد قابل للاستخدام في أي طلب — تُضاف إليه استرجاعات النزاعات وتُدفع به التعديلات.</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline" className="text-xs font-bold" onClick={() => go({ name: 'orders' })}>سجل الطلبات</Button>
            <Button size="sm" variant="outline" className="text-xs font-bold" onClick={() => go({ name: 'disputes' })}>نزاعاتي</Button>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 md:col-span-2">
          <b className="text-sm flex items-center gap-1.5 mb-2"><MapPin size={15} className="text-brand" /> عناويني ({ar(me.addrs.length)})</b>
          {me.addrs.length === 0
            ? <p className="text-[11px] text-muted-foreground">لا عناوين محفوظة — تُطلب عند أول طلب من بوابة الدفع.</p>
            : (
              <div className="grid md:grid-cols-2 gap-2">
                {me.addrs.map((a, i) => (
                  <div key={i} className="rounded-xl border border-border p-2.5 text-[11.5px]">
                    <b>{a.t} {a.def && <span className="text-[9px] bg-emerald-100 text-emerald-700 rounded-full px-1.5 py-0.5">افتراضي</span>}</b>
                    <div className="text-muted-foreground mt-0.5">{a.a}</div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

/* ============ نزاعاتي ============ */
export function DisputesPage() {
  const { session, disputes, openAuth, stores } = useDameen();
  const me = useMe();
  const [openId, setOpenId] = useState<string | null>(null);
  const [txt, setTxt] = useState('');
  if (!session) {
    return <EmptyState icon="🔐" title="سجّل دخولك لعرض نزاعاتك" sub="كل نزاعاتك وأحكامها تظهر هنا" cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => openAuth('login')}>تسجيل الدخول</Button>} />;
  }
  const mine = disputes.filter(d => session.role === 'customer' ? d.customer === session.phone : session.store === d.store);
  return (
    <div>
      <SectionTitle title="⚖️ نزاعاتي" sub={`${ar(mine.filter(d => d.status === 'open').length)} مفتوح · ${ar(mine.filter(d => d.status === 'resolved').length)} محسوم`} />
      {mine.length === 0 ? (
        <EmptyState icon="🕊️" title="لا نزاعات" sub="نتمنى ألا تحتاجها أبداً — استمر في التسوق الآمن" />
      ) : (
        <div className="space-y-3 max-w-2xl">
          {mine.map(d => {
            const st = stores.find(s => s.id === d.store);
            return (
              <div key={d.id} className={`rounded-2xl border bg-card p-4 ${d.status === 'open' ? 'border-red-200 border-s-4 border-s-red-500' : 'border-emerald-200 border-s-4 border-s-emerald-500'}`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <b className="text-[13px]">⚖️ {d.subject}</b>
                    <div className="text-[10.5px] text-muted-foreground">طلب #{ar(d.order)} · {st?.name} · {ago(d.openedAt)}</div>
                  </div>
                  {d.status === 'open'
                    ? <span className="text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 rounded-full px-2 py-0.5">بانتظار حكم الإدارة — المبلغ معلق</span>
                    : <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${d.ruling?.act === 'release' ? 'bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>{d.ruling?.act === 'release' ? 'حُكم لصالح التاجر' : 'استُرجع للعميل'}</span>}
                </div>
                {d.ruling && (
                  <div className={`mt-2.5 rounded-xl p-2.5 text-[11px] leading-relaxed ${d.ruling.act === 'release' ? 'bg-emerald-50' : 'bg-sand/60'}`}>
                    <b>تسبيب الحكم:</b> {d.ruling.text}
                  </div>
                )}
                <Button size="sm" variant={d.status === 'open' ? 'destructive' : 'outline'} className="mt-2.5 font-bold" onClick={() => { setOpenId(openId === d.id ? null : d.id); setTxt(''); }}>
                  💬 {d.status === 'open' ? 'متابعة النزاع والدردشة' : 'عرض المحادثة'}
                </Button>
                {openId === d.id && (
                  <div className="mt-3 border-t border-dashed border-border pt-3 space-y-2">
                    <div className="max-h-56 overflow-y-auto space-y-2">
                      {d.messages.map((m, i) => (
                        <div key={i} className={`rounded-xl px-3 py-2 text-[11.5px] leading-relaxed ${m.r === 'sys' ? 'bg-sand/70 border border-dashed border-border text-center' : m.r === 'customer' ? 'bg-emerald-50 border border-emerald-100' : 'bg-white border border-border'}`}>
                          {m.r === 'sys' ? '🔔 ' : m.r === 'customer' ? '👩 ' : '🏪 '}
                          {m.img && <img src={m.img} alt="دليل" className="max-h-32 rounded-lg my-1.5 mx-auto object-cover" />}
                          {m.t}
                          <span className="block text-[9px] text-muted-foreground mt-0.5">{ago(m.at)}</span>
                        </div>
                      ))}
                    </div>
                    {d.status === 'open' && (
                      <div className="flex gap-2">
                        <Input className="text-xs h-9" placeholder="أضف ردك أو أدلتك… (تُحجب الأرقام والروابط)" value={txt} onChange={e => setTxt(e.target.value)} />
                        <Button size="sm" className="bg-brand hover:bg-brand-2 font-bold shrink-0" onClick={() => { if (useDameen.getState().pushDispMsg(d.id, session.role === 'merchant' ? 'merchant' : 'customer', txt)) setTxt(''); }}>إرسال</Button>
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
