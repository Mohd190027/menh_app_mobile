/* لوحة الإدارة الكاملة: مركز (KPIs + طابور تحكيم + مراقبة محادثات) · المتاجر (طلبات التسجيل بتفاصيلها + إدارة المتاجر)
 * التحكيم (أحكام بتسبيب) · الأقسام (تصنيفات وعمولات وتغيير أسماء العوالم) · الإيرادات (معادلة الخزنة + النقاط + كوبونات الإدارة) */
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  ShieldCheck, Store as StoreIcon, Scale, Tags, TrendingUp, CheckCircle2, XCircle,
  PauseCircle, PlayCircle, Eye, MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ar, money, worldOf } from './data';
import { heldFor, r2, useDameen, useMe, vaultNow } from './state';
import { EmptyState, SectionTitle, StatCard, StatusChip } from './ui';
import { ChatDialog } from './user';

const TABS = [
  { id: 'overview', t: 'مركز الإدارة', icon: ShieldCheck },
  { id: 'stores', t: 'المتاجر', icon: StoreIcon },
  { id: 'disputes', t: 'التحكيم', icon: Scale },
  { id: 'cats', t: 'الأقسام', icon: Tags },
  { id: 'revenue', t: 'الإيرادات', icon: TrendingUp },
];

export function AdminPanel({ tab }: { tab: string }) {
  const { session, go } = useDameen();
  if (!session || session.role !== 'admin') {
    return <EmptyState icon="🔐" title="مركز إدارة ضمين" sub="هذه الصفحة مخصصة للإدارة — سجّل دخولك بحساب المشرف" cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => useDameen.getState().openAuth('login')}>تسجيل الدخول</Button>} />;
  }
  return (
    <div>
      <SectionTitle title="🛡️ مركز إدارة ضمين" sub="المشرف العام — كل الأرقام حية من واقع المنصة" />
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4" dir="rtl">
        {TABS.map(t => {
          const on = tab === t.id;
          const Icon = t.icon;
          return (
            <button key={t.id} className={`flex items-center gap-1.5 text-[12px] font-bold px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${on ? 'bg-brand text-cream shadow' : 'bg-card border border-border text-muted-foreground hover:border-brand/40'}`} onClick={() => go({ name: 'admin', tab: t.id })}>
              <Icon size={14} /> {t.t}
            </button>
          );
        })}
      </div>
      {tab === 'overview' && <AdminOverview />}
      {tab === 'stores' && <AdminStores />}
      {tab === 'disputes' && <AdminDisputes />}
      {tab === 'cats' && <AdminCats />}
      {tab === 'revenue' && <AdminRevenue />}
    </div>
  );
}

/* ============ المركز ============ */
function AdminOverview() {
  const { orders, disputes, stores, users, requests, aRevenue, go, storeWallets } = useDameen();
  const [chat, setChat] = useState<{ oid: number; gi: number } | null>(null);
  const open = disputes.filter(d => d.status === 'open');
  const pends = requests.filter(r => r.status === 'pending');
  const held = vaultNow(orders);
  const releasedTotal = orders.reduce((a, o) => a + o.groups.reduce((x, g) => x + (g.payout?.sub ?? 0), 0), 0);
  const chats: { o: (typeof orders)[0]; gi: number }[] = [];
  orders.forEach(o => o.groups.forEach((g, gi) => { if (g.chat && g.chat.length) chats.push({ o, gi }); }));
  chats.sort((a, b) => ((b.o.groups[b.gi].chat.slice(-1)[0]?.at ?? 0) - (a.o.groups[a.gi].chat.slice(-1)[0]?.at ?? 0)));
  const violTotal = orders.reduce((a, o) => a + o.groups.reduce((x, g) => x + g.viol.customer + g.viol.merchant, 0), 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard icon={<TrendingUp size={17} />} label="إجمالي عمولات ضمين" value={money(aRevenue)} tone="brand" sub="حسب عمولة كل تصنيف" />
        <StatCard icon={<ShieldCheck size={17} />} label="محجوز في الخزنة الآن" value={money(held)} tone="gold" sub="حماية المشترين" />
        <StatCard icon={<CheckCircle2 size={17} />} label="إجمالي الشحنات المحررة" value={money(r2(releasedTotal))} tone="teal" />
        <StatCard icon={<Scale size={17} />} label="نزاعات بانتظار حكمك" value={ar(open.length)} tone="red" />
        <button className="text-start" onClick={() => go({ name: 'admin', tab: 'stores' })}>
          <StatCard icon={<StoreIcon size={17} />} label="متجر في ضمين" value={ar(stores.length)} sub={`${ar(stores.filter(s => s.susp).length)} موقوف · ${ar(pends.length)} طلب تسجيل`} />
        </button>
        <StatCard icon={<Eye size={17} />} label="مستخدم مسجل" value={ar(Object.keys(users).length)} />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <b className="text-sm block mb-2">⚖️ طابور التحكيم</b>
          {open.length === 0 ? <p className="text-xs text-muted-foreground">لا نزاعات معلقة — كل شيء تحت السيطرة 🕊️</p> : (
            <div className="space-y-2">
              {open.map(d => (
                <div key={d.id} className="flex items-center justify-between gap-2 flex-wrap text-xs border border-dashed border-border rounded-xl p-2.5 cursor-pointer hover:border-brand/40" onClick={() => go({ name: 'admin', tab: 'disputes' })}>
                  <div><b>{d.subject}</b><div className="text-[10px] text-muted-foreground">{stores.find(s => s.id === d.store)?.name} · طلب #{ar(d.order)}</div></div>
                  <span className="text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 rounded-full px-2 py-0.5">يحتاج حكماً</span>
                </div>
              ))}
            </div>
          )}
          <Button variant="outline" size="sm" className="w-full mt-2.5 text-xs font-bold" onClick={() => go({ name: 'admin', tab: 'disputes' })}>كل النزاعات ←</Button>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <b className="text-sm block mb-2">🏪 المتاجر وطلبات التسجيل</b>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span>🏪 متاجر ضمين</span><span className={`font-bold rounded-full px-2 py-0.5 text-[10px] ${stores.filter(s => s.susp).length ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{ar(stores.length)} متجر · {ar(stores.filter(s => s.susp).length)} موقوف</span></div>
            <div className="flex justify-between"><span>📋 طلبات تسجيل بانتظار البت</span><span className={`font-bold rounded-full px-2 py-0.5 text-[10px] ${pends.length ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{ar(pends.length)} طلب</span></div>
            <div className="flex justify-between"><span>👛 محافظ التجار المتاحة</span><b>{money(r2(Object.values(storeWallets).reduce((a, b) => a + b, 0)))}</b></div>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-2.5 text-xs font-bold" onClick={() => go({ name: 'admin', tab: 'stores' })}>فتح صفحة المتاجر وطلبات التسجيل ←</Button>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <b className="text-sm">💬 مراقبة محادثات الطلبات</b>
          {violTotal ? <span className="text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 rounded-full px-2 py-0.5">{ar(violTotal)} مخالفة محجوبة</span> : <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">بلا مخالفات</span>}
        </div>
        <p className="text-[10.5px] text-muted-foreground leading-relaxed mb-2.5">محادثات العميل × التاجر مرتبطة بالطلب — تُحجب الأرقام والروابط ووسائل التواصل الخارجية تلقائياً، وتُحذف المحادثة بعد ٣ مخالفات مع تنبيه فوري للإدارة.</p>
        <div className="space-y-2">
          {chats.slice(0, 5).map(({ o, gi }) => {
            const g = o.groups[gi];
            const last = [...g.chat].reverse().find(m => m.r !== 'sys');
            const ltxt = last ? (last.loc ? '📍 ' + last.loc.txt : last.payreq ? '💰 طلب مبلغ إضافي بـ' + money(last.payreq.amt) : String(last.t)) : '';
            return (
              <div key={o.id + '-' + gi} className="flex items-center justify-between gap-2 flex-wrap text-xs border border-dashed border-border rounded-xl p-2.5 cursor-pointer hover:border-brand/40" onClick={() => setChat({ oid: o.id, gi })}>
                <div className="min-w-0 flex-1">
                  <b>طلب #{ar(o.id)} · {stores.find(s => s.id === g.store)?.name} × {users[o.customer]?.name.split(' ')[0] || 'عميل'}</b>
                  <div className="text-[10px] text-muted-foreground truncate">{ltxt.slice(0, 60)}{ltxt.length > 60 ? '…' : ''} · {ar(g.chat.length)} رسالة{g.chatDeleted ? ' · ⛔ محذوفة لمخالفة' : g.chatArchived ? ' · 🗄️ مؤرشفة' : ''}</div>
                </div>
                {(g.viol.customer + g.viol.merchant) > 0
                  ? <span className="text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 rounded-full px-2 py-0.5">{ar(g.viol.customer + g.viol.merchant)} 🚫</span>
                  : <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">سليمة</span>}
              </div>
            );
          })}
          {chats.length === 0 && <p className="text-xs text-muted-foreground">لا محادثات طلبات بعد</p>}
        </div>
      </div>
      {chat && <ChatDialog oid={chat.oid} gi={chat.gi} open onOpenChange={() => setChat(null)} />}
    </div>
  );
}

/* ============ المتاجر وطلبات التسجيل ============ */
function AdminStores() {
  const { requests, approveReq, rejectReq, stores, toggleSuspend, orders, storeWallets, users } = useDameen();
  const [t, setT] = useState<'reqs' | 'stores'>('stores');
  const [rej, setRej] = useState<string | null>(null);
  const [rejWhy, setRejWhy] = useState('');
  const pend = requests.filter(r => r.status === 'pending');
  const done = requests.filter(r => r.status !== 'pending');
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button className={`text-xs font-bold px-4 py-2 rounded-xl ${t === 'reqs' ? 'bg-brand text-cream' : 'bg-card border border-border'}`} onClick={() => setT('reqs')}>📋 طلبات التسجيل ({ar(pend.length)})</button>
        <button className={`text-xs font-bold px-4 py-2 rounded-xl ${t === 'stores' ? 'bg-brand text-cream' : 'bg-card border border-border'}`} onClick={() => setT('stores')}>🏪 جميع المتاجر ({ar(stores.length)})</button>
      </div>

      {t === 'reqs' && (
        <div className="space-y-3 max-w-3xl">
          <p className="text-[11px] text-muted-foreground leading-relaxed">كل من يسجّل متجراً جديداً أو يطلب الانضمام لفريق الإدارة تظهر بياناته كاملة هنا — توافق فتفتح حسابه فوراً ويُبلَّغ، أو ترفض بسببٍ يظهر لصاحب الطلب. تسجيل الدخول موحّد للجميع (جوال أو بريد + كلمة مرور).</p>
          {pend.length === 0 && <EmptyState icon="📭" title="لا طلبات معلقة" sub="ستظهر هنا طلبات فتح المتاجر فور ورودها" />}
          {pend.map(r => {
            const w = useDameen.getState().worlds.find(x => x.id === r.sec);
            const isS = r.kind === 'store';
            return (
              <div key={r.id} className="rounded-2xl border bg-card p-4" style={{ borderInlineStart: `4px solid ${isS ? (w?.color || '#1D4432') : '#1D4432'}` }}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <b className="text-[14px]">{isS ? '🏪 ' + r.store + ' — طلب متجر جديد' : '🛡️ ' + r.own + ' — طلب انضمام للإدارة'}</b>
                    <div className="text-[10.5px] text-muted-foreground">{r.own}{isS && w ? ' · ' + w.name : ''}</div>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5">بانتظار الموافقة</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3 text-[11px]">
                  {isS ? (
                    <>
                      <div className="bg-sand/50 rounded-lg p-2"><span className="text-muted-foreground block">العالم المختار</span><b style={{ color: w?.color }}>{w?.icon} {w?.name}</b></div>
                      <div className="bg-sand/50 rounded-lg p-2"><span className="text-muted-foreground block">السجل التجاري</span><b dir="ltr">{r.cr || '—'}</b></div>
                      <div className="bg-sand/50 rounded-lg p-2"><span className="text-muted-foreground block">الآيبان</span><b dir="ltr">{r.iban || '—'}</b></div>
                    </>
                  ) : (
                    <>
                      <div className="bg-sand/50 rounded-lg p-2"><span className="text-muted-foreground block">القسم الإشرافي</span><b>{r.role || '—'}</b></div>
                      <div className="bg-sand/50 rounded-lg p-2 col-span-2"><span className="text-muted-foreground block">رمز الدعوة</span><b dir="ltr">{r.code || '—'} {r.code === 'DMN-2026' ? <span className="text-[10px] bg-emerald-50 text-emerald-700 rounded-full px-1.5 py-0.5">سليم ✓</span> : <span className="text-[10px] bg-red-50 text-red-600 rounded-full px-1.5 py-0.5">غير صحيح</span>}</b></div>
                    </>
                  )}
                  <div className="bg-sand/50 rounded-lg p-2"><span className="text-muted-foreground block">الجوال (يستخدم للدخول)</span><b dir="ltr">{ar(r.phone)}</b></div>
                  <div className="bg-sand/50 rounded-lg p-2"><span className="text-muted-foreground block">البريد الإلكتروني</span><b dir="ltr">{r.email || '—'}</b></div>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <Button size="sm" className="bg-brand hover:bg-brand-2 font-bold" onClick={() => approveReq(r.id)}>✓ موافقة{isS ? ' وفتح المتجر' : ' وفتح الحساب'}</Button>
                  <Button size="sm" variant="destructive" className="font-bold" onClick={() => { setRej(r.id); setRejWhy(''); }}>✗ رفض الطلب</Button>
                </div>
              </div>
            );
          })}
          {done.length > 0 && (
            <>
              <div className="border-t border-border pt-3 mt-4" />
              <b className="text-[13px]">📁 الطلبات المنتهية</b>
              <div className="space-y-1.5">
                {done.map(r => (
                  <div key={r.id} className="flex items-center justify-between gap-2 flex-wrap text-xs border border-dashed border-border rounded-xl p-2.5">
                    <div><b>{r.kind === 'store' ? '🏪 ' + r.store : '🛡️ ' + r.own}</b><div className="text-[10px] text-muted-foreground">{r.kind === 'store' ? r.own : (r.role || 'فريق الإدارة')}</div></div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${r.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>{r.status === 'approved' ? 'مقبول ✓' : 'مرفوض ✗'}</span>
                      {r.status === 'rejected' && r.why && <span className="text-[10px] text-muted-foreground">السبب: {r.why}</span>}
                      {r.status === 'rejected' && <Button size="sm" variant="outline" className="h-6 text-[10px] px-2" onClick={() => approveReq(r.id)}>إعادة فتح وقبول</Button>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {/* نافذة الرفض */}
          <Dialog open={!!rej} onOpenChange={v => { if (!v) setRej(null); }}>
            <DialogContent className="max-w-sm" dir="rtl" aria-describedby={undefined}>
              <DialogHeader><DialogTitle className="text-sm">✗ رفض الطلب</DialogTitle></DialogHeader>
              <div>
                <Label className="text-xs font-bold">سبب الرفض (يظهر لصاحب الطلب مع إشعار)</Label>
                <Textarea className="text-xs mt-1" value={rejWhy} onChange={e => setRejWhy(e.target.value)} placeholder="مثال: وثيقة السجل التجاري غير واضحة — أعد إرفاقها" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="font-bold flex-1" onClick={() => setRej(null)}>تراجع</Button>
                <Button size="sm" variant="destructive" className="font-bold flex-1" onClick={() => { if (rej) { rejectReq(rej, rejWhy.trim() || 'لم يستوفِ الطلب شروط الاعتماد في ضمين'); setRej(null); } }}>تأكيد الرفض</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {t === 'stores' && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="space-y-2">
            {stores.map(s => {
              const w = worldOf(s.id);
              return (
                <div key={s.id} className="flex items-center gap-3 flex-wrap border-b border-dashed border-border last:border-0 pb-2.5">
                  <span className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shrink-0" style={{ background: s.color }}>{s.name.charAt(0)}</span>
                  <div className="flex-1 min-w-40">
                    <b className="text-[13px]">{s.name}</b>
                    <div className="text-[10px] text-muted-foreground">{w.name} · {users[s.owner]?.name || '—'} · ★ {ar(s.rt, 1)} · {ar(s.sales)} عملية · محجوز لصالحه {money(heldFor(orders, s.id))}</div>
                  </div>
                  <b className="text-brand text-[13px]">{money(storeWallets[s.id] || 0)}</b>
                  {s.susp ? (
                    <>
                      <span className="text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 rounded-full px-2 py-0.5">موقوف</span>
                      <Button size="sm" variant="outline" className="h-7 text-[10.5px] font-bold" onClick={() => toggleSuspend(s.id)}><PlayCircle size={12} className="me-1" />إلغاء الإيقاف</Button>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">يعمل</span>
                      <Button size="sm" variant="outline" className="h-7 text-[10.5px] font-bold text-red-600" onClick={() => toggleSuspend(s.id)}><PauseCircle size={12} className="me-1" />إيقاف</Button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ التحكيم ============ */
function AdminDisputes() {
  const { disputes, stores, users, orders, ruleDispute } = useDameen();
  const [openId, setOpenId] = useState<string | null>(null);
  const [act, setAct] = useState<'refund' | 'release'>('refund');
  const [text, setText] = useState('');
  const open = disputes.filter(d => d.status === 'open');
  const done = disputes.filter(d => d.status === 'resolved');
  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <b className="text-sm text-red-600">⏳ بانتظار الحكم — افتح الدردشة واطّلع على أدلة الطرفين</b>
        {open.length === 0 ? <div className="mt-2"><EmptyState icon="🕊️" title="لا قضايا مفتوحة" /></div> : (
          <div className="space-y-2.5 mt-2.5">
            {open.map(d => {
              const o = orders.find(x => x.id === d.order);
              const g = o?.groups.find(x => x.store === d.store);
              return (
                <div key={d.id} className="rounded-2xl border border-red-200 border-s-4 border-s-red-500 bg-card p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <b className="text-[13px]">{d.subject}</b>
                      <div className="text-[10.5px] text-muted-foreground">{users[d.customer]?.name || 'عميل'} × {stores.find(s => s.id === d.store)?.name} · طلب #{ar(d.order)}</div>
                    </div>
                    <span className="text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 rounded-full px-2 py-0.5">مبلغ معلق {money(g ? g.sub + g.dl + (g.extra || 0) : 0)}</span>
                  </div>
                  <Button size="sm" variant="destructive" className="mt-2.5 font-bold" onClick={() => { setOpenId(d.id); setAct('refund'); setText(''); }}>🛡️ فتح القضية وإصدار الحكم</Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="border-t border-border pt-4">
        <b className="text-sm text-brand">📁 أحكام صادرة</b>
        {done.length === 0 ? <p className="text-xs text-muted-foreground mt-2">لا أحكام سابقة</p> : (
          <div className="space-y-2.5 mt-2.5">
            {done.map(d => (
              <div key={d.id} className="rounded-2xl border border-emerald-200 border-s-4 border-s-emerald-500 bg-card p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div><b className="text-[12.5px]">{d.subject} — طلب #{ar(d.order)}</b><div className="text-[10px] text-muted-foreground">{d.ruling?.act === 'release' ? 'إفراج للتاجر' : 'استرجاع للعميل'}</div></div>
                  <Button size="sm" variant="outline" className="h-7 text-[10.5px]" onClick={() => { setOpenId(d.id); }}>عرض الملف</Button>
                </div>
                {d.ruling && <div className="mt-2 rounded-xl bg-sand/60 p-2.5 text-[11px] leading-relaxed"><b>التسبيب:</b> {d.ruling.text}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ملف القضية */}
      {openId && (() => {
        const d = disputes.find(x => x.id === openId)!;
        return (
          <Dialog open onOpenChange={() => setOpenId(null)}>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto" dir="rtl" aria-describedby={undefined}>
              <DialogHeader><DialogTitle className="text-sm">⚖️ ملف النزاع — {d.subject}</DialogTitle></DialogHeader>
              <div className="text-[11px] text-muted-foreground">{users[d.customer]?.name || 'عميل'} × {stores.find(s => s.id === d.store)?.name} · طلب #{ar(d.order)}</div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {d.messages.map((m, i) => (
                  <div key={i} className={`rounded-xl px-3 py-2 text-[11.5px] leading-relaxed ${m.r === 'sys' ? 'bg-sand/70 border border-dashed border-border text-center' : m.r === 'customer' ? 'bg-emerald-50 border border-emerald-100' : 'bg-white border border-border'}`}>
                    {m.r === 'sys' ? '🔔 ' : m.r === 'customer' ? '👩 ' : '🏪 '}
                    {m.img && <img src={m.img} alt="دليل" className="max-h-36 rounded-lg my-1.5 mx-auto object-cover" />}
                    {m.t}
                  </div>
                ))}
              </div>
              {d.status === 'open' && (
                <div className="border-t border-border pt-3 space-y-2">
                  <b className="text-xs block">إصدار الحكم:</b>
                  <div className="grid grid-cols-2 gap-2">
                    <button className={`text-[11px] font-bold p-2.5 rounded-xl border-2 ${act === 'refund' ? 'border-red-400 bg-red-50 text-red-700' : 'border-border'}`} onClick={() => setAct('refund')}>↩️ استرجاع كامل للعميل</button>
                    <button className={`text-[11px] font-bold p-2.5 rounded-xl border-2 ${act === 'release' ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-border'}`} onClick={() => setAct('release')}>🔓 تحرير المبلغ للتاجر</button>
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold">تسبيب الحكم (يظهر للطرفين)</Label>
                    <Textarea className="text-xs mt-1" value={text} onChange={e => setText(e.target.value)} placeholder="اكتب تسبيب الحكم بدقة…" />
                  </div>
                  <Button className="w-full bg-brand hover:bg-brand-2 font-extrabold" onClick={() => { if (text.trim().length < 5) { toast.error('اكتب تسبيب الحكم (٥ أحرف فأكثر)'); return; } ruleDispute(d.id, act, text.trim()); setOpenId(null); }}>⚖️ إصدار الحكم</Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        );
      })()}
    </div>
  );
}

/* ============ الأقسام والتصنيفات ============ */
function AdminCats() {
  const { worlds, cats, products, stores, saveCat, addCat, delCat, saveWorld } = useDameen();
  const [ren, setRen] = useState<string | null>(null);
  const [nm, setNm] = useState('');
  const [ds, setDs] = useState('');
  const [catDel, setCatDel] = useState<string | null>(null);
  const [newCat, setNewCat] = useState<Record<string, { n: string; c: number }>>({});
  const [editCat, setEditCat] = useState<Record<string, { n: string; c: number }>>({});
  return (
    <div className="space-y-3">
      <p className="text-[11px] text-muted-foreground leading-relaxed">أضف وعدّل واحذف تصنيفات العوالم الأربعة، وغيّر اسم أي عالم، وحدد عمولة كل تصنيف بنفسك — تُطبَّق العمولة لحظة تحرير أي شحنة على منتجات ذلك التصنيف، وتُحسم من التاجر فقط ولا تُضاف على العميل أبداً.</p>
      <div className="grid md:grid-cols-2 gap-3">
        {worlds.map(w => {
          const list = cats[w.id] || [];
          const nc = newCat[w.id] || { n: '', c: 2.5 };
          return (
            <div key={w.id} className="rounded-2xl border border-border bg-card p-4" style={{ borderTop: `3px solid ${w.color}` }}>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <b className="text-sm" style={{ color: w.color }}>{w.icon} {w.name}</b>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold rounded-full px-2 py-0.5" style={{ background: w.color + '18', color: w.color }}>{ar(list.length)} تصنيف</span>
                  <Button size="sm" variant="outline" className="h-6 text-[10px] px-2" onClick={() => { setRen(w.id); setNm(w.name); setDs(w.desc); }}>✏️ تغيير الاسم</Button>
                </div>
              </div>
              <div className="space-y-1.5">
                {list.map((c, i) => {
                  const ec = editCat[w.id + i] || { n: c.n, c: c.comm };
                  const pc = products.filter(p => { const st = stores.find(s => s.id === p.store); return st && st.sec === w.id && p.cat === c.n; }).length;
                  return (
                    <div key={i} className="flex items-center gap-1.5 flex-wrap border border-dashed border-border rounded-xl p-2">
                      <Input className="flex-1 min-w-28 text-xs h-8" value={ec.n} onChange={e => setEditCat({ ...editCat, [w.id + i]: { ...ec, n: e.target.value } })} />
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-muted-foreground">عمولة</span>
                        <Input type="number" min={0} max={20} step={0.25} className="w-16 text-xs h-8 text-center" value={ec.c} onChange={e => setEditCat({ ...editCat, [w.id + i]: { ...ec, c: +e.target.value || 0 } })} />
                        <span className="text-[10px] text-muted-foreground">٪</span>
                      </div>
                      <span className={`text-[9.5px] font-bold rounded-full px-1.5 py-0.5 ${pc ? 'bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>{ar(pc)} منتج</span>
                      <Button size="sm" className="h-7 text-[10px] px-2 bg-brand hover:bg-brand-2 font-bold" title="حفظ" onClick={() => saveCat(w.id, i, ec.n.trim(), ec.c)}>💾</Button>
                      <Button size="sm" variant="outline" className={`h-7 text-[10px] px-2 ${catDel === w.id + '-' + i ? 'text-red-600 border-red-300' : ''}`} onClick={() => { if (catDel === w.id + '-' + i) { delCat(w.id, i); setCatDel(null); } else { setCatDel(w.id + '-' + i); toast('اضغط «متأكد؟» مرة أخرى للحذف'); } }}>{catDel === w.id + '-' + i ? 'متأكد؟' : '🗑'}</Button>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-[1.7fr_.7fr_auto] gap-1.5 items-end mt-3">
                <div>
                  <Label className="text-[10px] font-bold">تصنيف جديد</Label>
                  <Input className="text-xs h-8 mt-1" value={nc.n} onChange={e => setNewCat({ ...newCat, [w.id]: { ...nc, n: e.target.value } })} placeholder="اسم التصنيف" />
                </div>
                <div>
                  <Label className="text-[10px] font-bold">عمولته ٪</Label>
                  <Input type="number" min={0} max={20} step={0.25} className="text-xs h-8 mt-1 text-center" value={nc.c} onChange={e => setNewCat({ ...newCat, [w.id]: { ...nc, c: +e.target.value || 0 } })} />
                </div>
                <Button size="sm" variant="outline" className="h-8 text-[11px] font-bold" onClick={() => { if (addCat(w.id, nc.n.trim(), nc.c)) setNewCat({ ...newCat, [w.id]: { n: '', c: 2.5 } }); }}>＋ إضافة</Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!ren} onOpenChange={v => { if (!v) setRen(null); }}>
        <DialogContent className="max-w-sm" dir="rtl" aria-describedby={undefined}>
          <DialogHeader><DialogTitle className="text-sm">✏️ تغيير اسم القسم</DialogTitle></DialogHeader>
          <div className="bg-brand/5 border border-brand/20 rounded-xl p-2.5 text-[11px] leading-relaxed">
            <b>الاسم الجديد يُطبَّق فوراً في كل ضمين</b>
            <p className="text-muted-foreground mt-1">القائمة العلوية، بطاقات الرئيسية، صفحات القسم، اختيار عالم التاجر الجديد، وبطاقات الطلبات — كلها تقرأ الاسم من هنا.</p>
          </div>
          <div>
            <Label className="text-xs font-bold">اسم القسم</Label>
            <Input className="text-xs h-9 mt-1" value={nm} onChange={e => setNm(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs font-bold">الوصف المختصر (يظهر تحت الاسم)</Label>
            <Input className="text-xs h-9 mt-1" value={ds} onChange={e => setDs(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="font-bold flex-1" onClick={() => setRen(null)}>تراجع</Button>
            <Button size="sm" className="bg-brand hover:bg-brand-2 font-bold flex-1" onClick={() => { if (ren) { saveWorld(ren, nm.trim(), ds.trim()); setRen(null); } }}>حفظ الاسم</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============ الإيرادات ============ */
function AdminRevenue() {
  const { orders, aRevenue, vat, logiWallet, aPtsWallet, storeWallets, stores, revMonths, ptsVal, freeDlPts, setPtsVal, setFreeDlPts, users, coupons, addCoupon, delCoupon, ptsFunding } = useDameen();
  const [pv, setPv] = useState(ptsVal);
  const [fd, setFd] = useState(freeDlPts);
  const [cCode, setCCode] = useState('');
  const [cV, setCV] = useState(10);
  const [cMin, setCMin] = useState(0);
  const mx = Math.max(...revMonths.map(m => m.v));
  let gmv = 0, relSub = 0, relNet = 0, relComm = 0, shipC = 0, shipM = 0, shipP = 0, refunds = 0;
  orders.forEach(o => o.groups.forEach(g => {
    const ch = (g.ship && g.ship.charge) ?? g.dl ?? 0;
    gmv += g.sub + ch + (g.extra || 0);
    if (g.status === 'refunded') refunds += g.sub + ch + (g.extra || 0);
    if (g.payout && g.status === 'released') {
      relSub += g.payout.sub; relNet += g.payout.net; relComm += g.payout.comm;
      if (g.payout.ship) { shipC += g.payout.ship.charge || 0; shipM += g.payout.ship.merchant || 0; shipP += g.payout.ship.pts || 0; }
    }
  }));
  const held = vaultNow(orders);
  const otpHeld = r2(orders.reduce((a, o) => a + o.groups.filter(g => g.ship && g.ship.mode === 'field' && g.status === 'shipped').reduce((x, g) => x + g.sub, 0), 0));
  const storesBal = r2(Object.values(storeWallets).reduce((a, b) => a + b, 0));
  const ptsLiab = r2(Object.values(users).reduce((a, u) => a + (u.pts || 0), 0) * ptsVal);
  const custBal = r2(Object.values(users).reduce((a, u) => a + (u.bal || 0), 0));
  const relFlow = r2(relSub + shipC);
  const balanced = Math.abs(gmv - held - relFlow - refunds) < 1;
  const fr: [string, string][] = [
    ['🛒 إجمالي قيمة الطلبات في المنصة (منتجات + شحن دفعه العملاء)', money(r2(gmv))],
    ['🔒 المحجوز في خزنة الضمان الآن (حماية المشترين)', money(held)],
    ['🎪 مستحقات خدمات ميدانية معلقة بانتظار كود تأكيد العميل (OTP)', money(otpHeld)],
    ['🔓 المحرر للتجار حتى اليوم (صافي حقهم)', money(r2(relNet))],
    ['🧾 عمولات ضمين المحصلة (تحولت لحساب التطبيق)', money(r2(relComm))],
    ['🚚 رسوم شحن دفعها العملاء (تحولت للوجستيات)', money(r2(shipC))],
    ['🤝 دعم شحن تحمله التجار (مجاني / مناصفة / سقف)', money(r2(shipM))],
    ['🌟 دعم شحن من نقاط الولاء (حساب الإدارة)', money(r2(shipP))],
    ['🏦 رصيد حساب الشريك اللوجستي (OTO/Torod)', money(logiWallet)],
    ['↩️ مسترجع للعملاء (محافظ ضمين لديهم)', money(r2(refunds))],
    ['🧾 ضريبة القيمة المضافة المحصلة (١٥٪)', money(vat)],
    ['⭐ التزامات النقاط لدى العملاء (نقاطهم × قيمة النقطة)', money(ptsLiab)],
    ['👛 أرصدة عملاء جاهزة للاستخدام من محافظهم', money(custBal)],
    ['🏪 محافظ التجار المتاحة للسحب', money(storesBal)],
    ['💰 محفظة الإدارة من تمويلات النقاط', money(aPtsWallet)],
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard icon={<TrendingUp size={16} />} label="إجمالي العمولات حتى اليوم" value={money(aRevenue)} tone="brand" />
        <StatCard icon={<ShieldCheck size={16} />} label="محجوز في الخزنة الآن" value={money(held)} tone="gold" />
        <StatCard icon={<StoreIcon size={16} />} label="صافي أرصدة التجار" value={money(storesBal)} tone="teal" />
        <StatCard icon={<Scale size={16} />} label="محفظة الإدارة من النقاط" value={money(aPtsWallet)} tone="gold" />
        <StatCard icon={<StoreIcon size={16} />} label="حساب الشريك اللوجستي (OTO/Torod)" value={money(logiWallet)} />
        <StatCard icon={<TrendingUp size={16} />} label="ضريبة القيمة المضافة المحصلة (١٥٪)" value={money(vat)} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <b className="text-sm block mb-2">📒 الملخص المالي الشامل — كل ما يخص المبالغ في ضمين</b>
        <div className="space-y-1">
          {fr.map(([l, v]) => (
            <div key={l} className="flex items-center justify-between gap-3 text-[11.5px] py-1 border-b border-dashed border-border last:border-0">
              <span className="text-muted-foreground">{l}</span><b className="shrink-0">{v}</b>
            </div>
          ))}
        </div>
        <div className="border-t border-border mt-3 pt-3 rounded-xl bg-brand/5 p-3">
          <b className="text-[11.5px]">⚖️ معادلة الخزنة — أين ذهب كل مبلغ؟</b>
          <p className="text-[11px] text-muted-foreground leading-loose mt-1">
            إجمالي الطلبات <b className="text-ink">{money(r2(gmv))}</b> = محجوز الآن لصالح الشحنات الجارية <b className="text-ink">{money(held)}</b> + محرر بضمان (منتجات <b className="text-ink">{money(r2(relSub))}</b> + شحن دفعه العملاء <b className="text-ink">{money(r2(shipC))}</b>) + مسترجع للعملاء <b className="text-ink">{money(r2(refunds))}</b>
            {balanced && <b className="text-brand"> — ✓ الدفاتر متوازنة</b>}
          </p>
          <p className="text-[10.5px] text-muted-foreground leading-relaxed mt-1">عمولة المنصة تُقتطع من نصيب التاجر فقط (وتُحدَّد لكل تصنيف من صفحة الأقسام) — ولا تُضاف على العميل أبداً، بينما دعم التجار ونقاطهم للشحن ({money(r2(shipM + shipP))}) يُقتطع من صافيهم ويُحوَّل للوجستيات.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <b className="text-sm block mb-3">عمولات آخر ٥ أشهر (ألف ر.س)</b>
        <div className="flex items-end justify-between gap-2 h-32" dir="rtl">
          {revMonths.map(m => (
            <div key={m.m} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <span className="text-[10px] font-bold text-brand">{ar(m.v)}</span>
              <div className="w-full rounded-t-lg bg-brand/80 hover:bg-brand transition-colors" style={{ height: Math.max(8, m.v / mx * 100) + '%' }} />
              <span className="text-[10px] font-bold text-muted-foreground">{m.m}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 space-y-2.5">
        <b className="text-sm block">🌟 إعدادات برنامج النقاط</b>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex-1 min-w-50">
            <b className="text-[11.5px] block">قيمة النقطة الواحدة (ر.س)</b>
            <span className="text-[10px] text-muted-foreground">يموّلها التاجر من محفظته — من ٠٫٠١ إلى ١</span>
          </div>
          <Input type="number" step={0.01} min={0.01} max={1} className="w-24 text-xs h-9 text-center" value={pv} onChange={e => setPv(+e.target.value || 0)} />
          <Button size="sm" className="bg-brand hover:bg-brand-2 font-bold" onClick={() => setPtsVal(pv)}>حفظ</Button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex-1 min-w-50">
            <b className="text-[11.5px] block">نقاط التوصيل المجاني</b>
            <span className="text-[10px] text-muted-foreground">النقاط التي يستبدلها العميل مقابل توصيل مجاني — من ٥٠ إلى ٢٠٠٠</span>
          </div>
          <Input type="number" step={10} min={50} max={2000} className="w-24 text-xs h-9 text-center" value={fd} onChange={e => setFd(+e.target.value || 0)} />
          <Button size="sm" className="bg-brand hover:bg-brand-2 font-bold" onClick={() => setFreeDlPts(fd)}>حفظ</Button>
        </div>
        {ptsFunding.length > 0 && (
          <div className="border-t border-dashed border-border pt-2">
            <b className="text-[11px] block mb-1.5">آخر تمويلات التجار</b>
            <div className="space-y-1">
              {ptsFunding.slice(0, 4).map((f, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <span><b>{stores.find(s => s.id === f.store)?.name}</b> — {f.pname}</span>
                  <span className="text-muted-foreground font-bold">{f.pts > 0 ? '+' : ''}{ar(f.pts)} نقطة</span>
                  <b className="text-amber-700">{money(f.amt)}</b>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <b className="text-sm block mb-2">🏪 أرصدة تجار الضمان</b>
        <div className="space-y-1.5">
          {stores.map(s => (
            <div key={s.id} className="flex items-center gap-2.5 text-[11.5px] border-b border-dashed border-border last:border-0 pb-1.5">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-extrabold shrink-0" style={{ background: s.color }}>{s.name.charAt(0)}</span>
              <div className="flex-1 min-w-0"><b className="block truncate">{s.name}</b><span className="text-[10px] text-muted-foreground">{worldOf(s.id).name} · محجوز لصالحه {money(heldFor(orders, s.id))}</span></div>
              <b className="text-brand">{money(storeWallets[s.id] || 0)}</b>
            </div>
          ))}
        </div>
      </div>

      {/* كوبونات الإدارة */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-2.5">
        <b className="text-sm block">🎟️ كوبونات الإدارة (شاملة لكل المتاجر)</b>
        <div className="space-y-1.5">
          {Object.entries(coupons).filter(([, c]) => c.store === 'all').map(([k, c]) => (
            <div key={k} className="flex items-center justify-between gap-2 bg-sand/50 border border-border rounded-xl px-2.5 py-1.5 text-[11px]">
              <div><b className="font-mono">{k}</b> — {c.type === 'pct' ? ar(c.v) + '٪ (حتى ' + money(c.max) + ')' : money(c.v)}{c.min ? ' · حد أدنى ' + money(c.min) : ''}{c.maxUses ? ' · سقف ' + ar(c.maxUses) : ''}</div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-bold">{ar(c.uses)} استخدام</span>
                <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 text-red-600" onClick={() => delCoupon(k)}>حذف</Button>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 items-end">
          <div><Label className="text-[10.5px] font-bold">الكود</Label><Input className="text-xs h-8 mt-1" dir="ltr" value={cCode} onChange={e => setCCode(e.target.value.toUpperCase())} placeholder="SAVE10" /></div>
          <div><Label className="text-[10.5px] font-bold">النسبة ٪ (حتى ٥٠ ر.س)</Label><Input type="number" className="text-xs h-8 mt-1" value={cV} onChange={e => setCV(+e.target.value || 0)} /></div>
          <div><Label className="text-[10.5px] font-bold">حد أدنى (ر.س)</Label><Input type="number" className="text-xs h-8 mt-1" value={cMin} onChange={e => setCMin(+e.target.value || 0)} /></div>
        </div>
        <Button size="sm" className="bg-gold text-brand hover:brightness-105 font-extrabold" onClick={() => { if (addCoupon(cCode, { type: 'pct', v: cV, max: 50, store: 'all', min: cMin })) { setCCode(''); } }}>＋ إصدار كوبون شامل</Button>
      </div>
    </div>
  );
}
