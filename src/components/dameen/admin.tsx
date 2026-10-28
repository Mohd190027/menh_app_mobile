/* لوحة الإدارة: المركز، صفحة المتاجر المستقلة (طلبات التسجيل + جميع المتاجر)، الأقسام، التحكيم، الإيرادات */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Store as StoreIcon, Package, Wallet, Scale, LayoutGrid, ShieldCheck, Check, X,
  Pencil, Ban, PlayCircle, Eye, MessageSquare, TrendingUp, Users, Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ar, CATS, money } from './data';
import { useDameen } from './state';
import { ChatDialog } from './user';
import { EmptyState, SectionTitle, StatCard, Stars } from './ui';

const TABS = [
  { id: 'overview', t: 'مركز الإدارة', icon: ShieldCheck },
  { id: 'stores', t: 'المتاجر', icon: StoreIcon },
  { id: 'cats', t: 'الأقسام', icon: LayoutGrid },
  { id: 'disputes', t: 'التحكيم', icon: Scale },
  { id: 'revenue', t: 'الإيرادات', icon: TrendingUp },
];

export function AdminPanel({ tab }: { tab: string }) {
  const { session, go, orders, stores, requests, worlds } = useDameen();
  if (!session || session.role !== 'admin') {
    return (
      <div className="py-10 max-w-md mx-auto">
        <EmptyState icon="🛡️" title="مركز إدارة ضمين" sub="هذه اللوحة لحساب الإدارة فقط — سجّل دخولك بحساب الإدارة التجريبي." cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => useDameen.getState().openAuth('login')}>تسجيل الدخول كإدارة</Button>} />
      </div>
    );
  }
  const released = orders.filter(o => o.status === 'released');
  const protected_ = orders.filter(o => o.status === 'protected');
  const disputed = orders.filter(o => o.status === 'disputed');
  const pending = requests.filter(r => r.status === 'pending');
  const commission = released.reduce((a, o) => a + o.subtotal * 0.025, 0);
  const sales = released.reduce((a, o) => a + o.subtotal, 0);
  const vat = released.reduce((a, o) => a + o.vat, 0);
  const fDate = (at: number) => new Date(at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });

  return (
    <div className="py-2">
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div>
          <h1 className="font-black text-xl text-ink">🛡️ مركز إدارة ضمين</h1>
          <p className="text-[11px] text-muted-foreground mt-1">نظرة شاملة على المتاجر والطلبات والتحكيم والإيرادات</p>
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {TABS.map(t => {
            const Icon = t.icon;
            const on = tab === t.id;
            const badge = t.id === 'stores' ? pending.length : t.id === 'disputes' ? disputed.length : 0;
            return (
              <button key={t.id} onClick={() => go({ name: 'admin', tab: t.id })}
                className={`text-[11px] font-extrabold px-3 py-2 rounded-xl border whitespace-nowrap inline-flex items-center gap-1.5 transition-all ${on ? 'bg-brand text-cream border-brand shadow-sm' : 'bg-card text-muted-foreground border-border hover:border-brand/40'}`}>
                <Icon size={13} /> {t.t}
                {badge > 0 && <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${on ? 'bg-gold text-brand' : 'bg-red-100 text-red-700'}`}>{ar(badge)}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== المركز ===== */}
      {tab === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={<StoreIcon size={19} />} label="متاجر تعمل" value={ar(stores.filter(s => !s.susp).length)} sub={`${ar(stores.filter(s => s.susp).length)} موقوف`} />
            <StatCard icon={<Clock size={19} />} label="طلبات تحت الحماية" value={ar(protected_.length)} sub="مبالغ محجوزة بالخزنة" tone="gold" />
            <StatCard icon={<Wallet size={19} />} label="إيرادات ضمين" value={money(commission)} sub="عمولة ٢٫٥٪ من المحرر" tone="teal" />
            <StatCard icon={<Scale size={19} />} label="نزاعات مفتوحة" value={ar(disputed.length)} sub="بانتظار حكم الفريق" tone="red" />
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <motion.div whileHover={{ y: -2 }} className="bg-card rounded-3xl border border-border p-5 cursor-pointer shadow-sm" onClick={() => go({ name: 'admin', tab: 'stores' })}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-extrabold text-sm flex items-center gap-2"><StoreIcon size={15} className="text-brand" /> المتاجر وطلبات التسجيل</h3>
                <span className="text-[10px] font-black text-brand bg-brand/10 px-2 py-1 rounded-full">فتح الصفحة ←</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-sand/70 rounded-2xl py-3"><div className="text-lg font-black text-ink">{ar(stores.length)}</div><div className="text-[10px] font-bold text-muted-foreground">إجمالي المتاجر</div></div>
                <div className="bg-gold/15 rounded-2xl py-3"><div className="text-lg font-black text-yellow-800">{ar(pending.length)}</div><div className="text-[10px] font-bold text-muted-foreground">طلبات معلقة</div></div>
                <div className="bg-brand/10 rounded-2xl py-3"><div className="text-lg font-black text-brand">{ar(stores.filter(s => s.susp).length)}</div><div className="text-[10px] font-bold text-muted-foreground">موقوفة</div></div>
              </div>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} className="bg-card rounded-3xl border border-border p-5 cursor-pointer shadow-sm" onClick={() => go({ name: 'admin', tab: 'disputes' })}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-extrabold text-sm flex items-center gap-2"><Scale size={15} className="text-brand" /> طابور التحكيم</h3>
                <span className="text-[10px] font-black text-brand bg-brand/10 px-2 py-1 rounded-full">إصدار الأحكام ←</span>
              </div>
              {disputed.length === 0
                ? <p className="text-xs text-muted-foreground py-4 text-center">لا نزاعات مفتوحة — كل الأطراف راضية ✓</p>
                : disputed.slice(0, 2).map(o => (
                  <div key={o.id} className="flex items-center justify-between text-[11px] bg-orange-50 border border-orange-200 rounded-xl p-2.5 mb-2">
                    <span className="font-extrabold text-orange-800">#{ar(o.id.replace('DM-', ''))} · {o.dispute?.reason}</span>
                    <span className="text-muted-foreground">{o.customerName}</span>
                  </div>
                ))}
            </motion.div>
          </div>

          <div className="bg-card rounded-3xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border font-extrabold text-sm">آخر النشاطات</div>
            {orders.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center gap-3 p-3.5 border-b border-border last:border-0 text-xs">
                <span className="text-lg">{o.status === 'protected' ? '🛡️' : o.status === 'disputed' ? '⚖️' : o.status === 'released' ? '✅' : o.status === 'shipped' ? '🚚' : '📦'}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-ink">#{ar(o.id.replace('DM-', ''))} — {o.customerName}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{fDate(o.at)} · {stores.find(s => s.id === o.store)?.name}</div>
                </div>
                <span className="font-black text-brand">{money(o.total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== صفحة المتاجر المستقلة ===== */}
      {tab === 'stores' && <AdminStores />}

      {/* ===== الأقسام ===== */}
      {tab === 'cats' && <AdminCats />}

      {/* ===== التحكيم ===== */}
      {tab === 'disputes' && <AdminDisputes />}

      {/* ===== الإيرادات ===== */}
      {tab === 'revenue' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={<TrendingUp size={19} />} label="مبيعات محررة" value={money(sales)} sub={`${ar(released.length)} طلباً`} />
            <StatCard icon={<Wallet size={19} />} label="عمولة ضمين (٢٫٥٪)" value={money(commission)} tone="teal" />
            <StatCard icon={<Package size={19} />} label="ضريبة محصلة (١٥٪)" value={money(vat)} tone="gold" />
            <StatCard icon={<Users size={19} />} label="مستخدمون نشطون" value={ar(1240)} sub="عملاء وتجار" tone="teal" />
          </div>
          <div className="bg-card rounded-3xl border border-border p-5">
            <h3 className="font-extrabold text-sm mb-3">معادلة الخزنة — أين يذهب كل ريال؟</h3>
            <div className="space-y-2 text-xs">
              {[
                { l: 'صافي التجار (٩٧٫٥٪)', v: sales * 0.975, c: 'bg-brand' },
                { l: 'عمولة ضمين (٢٫٥٪)', v: commission, c: 'bg-gold' },
                { l: 'ضريبة القيمة المضافة (١٥٪ على المبيعات)', v: vat, c: 'bg-brand-2' },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-44 shrink-0 text-muted-foreground font-semibold">{r.l}</span>
                  <div className="flex-1 h-7 bg-sand rounded-xl overflow-hidden"><div className={`h-full ${r.c} rounded-xl flex items-center justify-end pe-2 text-[10px] font-black text-cream`} style={{ width: Math.min(100, (r.v / Math.max(sales, 1)) * 100) + '%' }}>{money(r.v)}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-3xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border font-extrabold text-sm">آخر العمليات المحررة</div>
            {released.length === 0 ? <div className="p-6 text-center text-xs text-muted-foreground">لا عمليات محررة بعد</div> : released.map(o => (
              <div key={o.id} className="flex items-center justify-between p-3.5 border-b border-border last:border-0 text-xs">
                <div>
                  <span className="font-extrabold text-ink">#{ar(o.id.replace('DM-', ''))}</span>
                  <span className="text-muted-foreground"> · {o.customerName} · {fDate(o.at)}</span>
                </div>
                <div className="text-end">
                  <div className="font-black text-brand">{money(o.subtotal)}</div>
                  <div className="text-[10px] text-muted-foreground">عمولة {money(o.subtotal * 0.025)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== المتاجر: طلبات التسجيل + جميع المتاجر ===== */
function AdminStores() {
  const { requests, stores, worlds, approveReq, rejectReq, toggleSuspend, go } = useDameen();
  const pending = requests.filter(r => r.status === 'pending');
  const done = requests.filter(r => r.status !== 'pending');
  const [t, setT] = useState<'reqs' | 'stores'>('stores');
  const [rej, setRej] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h2 className="font-black text-lg text-ink">🏪 المتاجر</h2>
          <p className="text-[11px] text-muted-foreground">طلبات التسجيل وإدارة كل متاجر ضمين</p>
        </div>
        <div className="flex bg-card border border-border rounded-2xl p-1 gap-1">
          <button onClick={() => setT('stores')} className={`text-[11px] font-extrabold px-3.5 py-1.5 rounded-xl transition-all ${t === 'stores' ? 'bg-brand text-cream' : 'text-muted-foreground'}`}>
            🏪 جميع المتاجر ({ar(stores.length)})
          </button>
          <button onClick={() => setT('reqs')} className={`text-[11px] font-extrabold px-3.5 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 ${t === 'reqs' ? 'bg-brand text-cream' : 'text-muted-foreground'}`}>
            📋 طلبات التسجيل ({ar(pending.length)})
            {pending.length > 0 && <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${t === 'reqs' ? 'bg-gold text-brand' : 'bg-red-100 text-red-700'}`}>{ar(pending.length)}</span>}
          </button>
        </div>
      </div>

      {/* طلبات التسجيل */}
      {t === 'reqs' && (
        <div className="space-y-3">
          {pending.length === 0 && <EmptyState icon="📋" title="لا طلبات معلقة" sub="كل طلبات التسجيل بُتّ فيها — أي طلب جديد سيظهر هنا فوراً." />}
          {pending.map((r, i) => {
            const w = worlds.find(x => x.id === r.sec);
            return (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card rounded-3xl border border-border p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-start gap-3">
                    <span className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg text-white shrink-0" style={{ background: w?.color || '#1D4432' }}>{w?.icon || '🏪'}</span>
                    <div>
                      <h3 className="font-black text-ink">{r.store || 'حساب إدارة جديد'}</h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {r.own} · <span dir="ltr">{ar(r.phone)}</span> {r.email && <>· {r.email}</>}
                      </p>
                      <div className="flex gap-1.5 mt-2 flex-wrap text-[10px] font-bold">
                        <span className="bg-sand text-ink rounded-full px-2.5 py-1">{r.kind === 'store' ? 'طلب متجر' : 'طلب حساب إدارة'}</span>
                        {w && <span className="bg-sand text-ink rounded-full px-2.5 py-1">{w.name}</span>}
                        {r.cr && <span className="bg-sand text-ink rounded-full px-2.5 py-1" dir="ltr">س.ت {ar(r.cr)}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-brand hover:bg-brand-2 font-extrabold h-9" onClick={() => approveReq(r.id)}><Check size={15} /> موافقة وفتح فوري</Button>
                    <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 font-bold h-9" onClick={() => { setRej(r.id); setReason(''); }}><X size={15} /> رفض</Button>
                  </div>
                </div>
                <Dialog open={rej === r.id} onOpenChange={v => { if (!v) setRej(null); }}>
                  <DialogContent className="max-w-sm" dir="rtl" aria-describedby={undefined}>
                    <DialogHeader><DialogTitle className="text-base">رفض طلب «{r.store || r.own}»</DialogTitle></DialogHeader>
                    <div>
                      <Label className="text-xs font-bold">سبب الرفض (يصل لمقدم الطلب)</Label>
                      <Select value={reason} onValueChange={setReason}>
                        <SelectTrigger className="mt-1 w-full"><SelectValue placeholder="اختر السبب" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="بيانات السجل التجاري غير مكتملة">بيانات السجل التجاري غير مكتملة</SelectItem>
                          <SelectItem value="الآيبان لا يطابق اسم مقدم الطلب">الآيبان لا يطابق اسم مقدم الطلب</SelectItem>
                          <SelectItem value="نشاط لا تدعمه ضمين حالياً">نشاط لا تدعمه ضمين حالياً</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button className="w-full mt-3 bg-red-600 hover:bg-red-700 font-extrabold" disabled={!reason} onClick={() => { rejectReq(r.id, reason); setRej(null); }}>إرسال الرفض</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            );
          })}
          {done.length > 0 && (
            <div className="bg-sand/50 rounded-3xl p-4">
              <h4 className="text-xs font-extrabold mb-2 text-muted-foreground">طلبات بُتّ فيها سابقاً</h4>
              {done.map(r => (
                <div key={r.id} className="flex items-center justify-between text-[11px] py-1.5">
                  <span className="font-bold text-ink">{r.store || r.own}</span>
                  <span className={`font-black ${r.status === 'approved' ? 'text-emerald-700' : 'text-red-600'}`}>
                    {r.status === 'approved' ? '✓ قُبل' : `✕ رُفض — ${r.reason || ''}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* جميع المتاجر */}
      {t === 'stores' && (
        <div className="bg-card rounded-3xl border border-border overflow-hidden">
          {stores.map(s => {
            const w = worlds.find(x => x.id === s.sec);
            return (
              <div key={s.id} className="flex items-center gap-3 p-4 border-b border-border last:border-0 flex-wrap">
                <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shrink-0" style={{ background: s.color }}>
                  {s.name.replace(/^دَى?/, '').trim().charAt(0) || 'ض'}
                </span>
                <div className="flex-1 min-w-40">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-ink">{s.name}</span>
                    <span className="text-[9px] font-bold text-white px-2 py-0.5 rounded-full" style={{ background: w?.color }}>{w?.icon} {w?.name}</span>
                    {s.susp && <span className="text-[9px] font-black bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">موقوف</span>}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{s.ownerName} · {s.city} · {ar(s.sales)} عملية · تقييم {ar(s.rt, 1)} ★</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button size="sm" variant="ghost" className="h-8 text-[11px] font-bold text-brand hover:bg-accent" onClick={() => go({ name: 'store', id: s.id })}><Eye size={13} /> زيارة</Button>
                  {s.susp
                    ? <Button size="sm" variant="outline" className="h-8 text-[11px] font-bold border-emerald-300 text-emerald-700 hover:bg-emerald-50" onClick={() => toggleSuspend(s.id)}><PlayCircle size={13} /> تشغيل</Button>
                    : <Button size="sm" variant="outline" className="h-8 text-[11px] font-bold border-red-200 text-red-600 hover:bg-red-50" onClick={() => toggleSuspend(s.id)}><Ban size={13} /> إيقاف</Button>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ===== الأقسام ===== */
function AdminCats() {
  const { worlds, saveWorld } = useDameen();
  const [edit, setEdit] = useState<string | null>(null);
  const [d, setD] = useState({ name: '', desc: '' });
  const w0 = worlds.find(w => w.id === edit);
  return (
    <div className="space-y-4">
      <SectionTitle title="عوالم ضمين" sub="غيّر أسماء العوالم وأوصافها — تنتشر فوراً في كل الواجهات" />
      {worlds.map(w => (
        <div key={w.id} className="bg-card rounded-3xl border border-border p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-start gap-3">
              <span className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl text-white" style={{ background: w.color }}>{w.icon}</span>
              <div>
                <h3 className="font-black text-ink">{w.name}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5 max-w-lg">{w.desc}</p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  <span className="text-[10px] font-bold bg-gold/15 text-yellow-800 rounded-full px-2.5 py-1">🛡️ الحماية: {w.win}</span>
                  {(CATS[w.id] || []).map(c => (
                    <span key={c.n} className="text-[10px] font-bold bg-sand text-ink rounded-full px-2.5 py-1">{c.n} — عمولة {ar(c.comm, 1)}٪</span>
                  ))}
                </div>
              </div>
            </div>
            <Button size="sm" variant="outline" className="h-8 text-[11px] font-bold" onClick={() => { setEdit(w.id); setD({ name: w.name, desc: w.desc }); }}><Pencil size={13} /> تغيير الاسم والوصف</Button>
          </div>
        </div>
      ))}
      <Dialog open={!!edit} onOpenChange={v => { if (!v) setEdit(null); }}>
        <DialogContent className="max-w-sm" dir="rtl" aria-describedby={undefined}>
          <DialogHeader><DialogTitle className="text-base">تعديل «{w0?.name}»</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-bold">اسم العالم</Label>
              <Input className="mt-1" value={d.name} onChange={e => setD({ ...d, name: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold">الوصف</Label>
              <Textarea className="mt-1 text-xs" rows={2} value={d.desc} onChange={e => setD({ ...d, desc: e.target.value })} />
            </div>
            <Button className="w-full bg-brand hover:bg-brand-2 font-extrabold" onClick={() => { if (edit) saveWorld(edit, d.name, d.desc); setEdit(null); }}>حفظ ونشر فوري</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ===== التحكيم ===== */
function AdminDisputes() {
  const { orders, resolveDispute, stores } = useDameen();
  const [chat, setChat] = useState<string | null>(null);
  const disputed = orders.filter(o => o.status === 'disputed');
  const resolved = orders.filter(o => o.dispute?.status === 'resolved');
  return (
    <div className="space-y-4">
      <SectionTitle title="⚖️ طابور التحكيم" sub="مبالغ النزاعات محجوزة حتى إصدار الحكم — راجع المحادثة ثم احكم" />
      {disputed.length === 0 && (
        <EmptyState icon="⚖️" title="لا نزاعات مفتوحة" sub="عندما يفتح عميل نزاعاً سيظهر هنا مع أدلته ومحادثته مع التاجر." />
      )}
      {disputed.map((o, i) => (
        <motion.div key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card rounded-3xl border-2 border-orange-200 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
            <div>
              <span className="font-black text-ink">#{ar(o.id.replace('DM-', ''))}</span>
              <span className="text-[11px] text-muted-foreground"> · {o.customerName} ضد {stores.find(s => s.id === o.store)?.name} · {money(o.total)}</span>
            </div>
            <span className="text-[10px] font-black bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-full">مبلغ محجوز بالخزنة</span>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3.5 text-xs space-y-1 mb-4">
            <p><b>السبب:</b> {o.dispute?.reason}</p>
            <p className="text-muted-foreground leading-relaxed">{o.dispute?.desc}</p>
            <p className="text-[10px] text-muted-foreground mt-1">أول رسالة اعتراض: «وصلنا اعتراضك — المنتج فُحص بعناية قبل الشحن وصُوّر قبل الإغلاق.»</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="h-9 font-bold" onClick={() => setChat(o.id)}><MessageSquare size={14} /> مراجعة المحادثة</Button>
            <Button size="sm" className="h-9 bg-emerald-600 hover:bg-emerald-700 font-extrabold" onClick={() => resolveDispute(o.id, 'refund')}>حكم لصالح العميل — استرجاع كامل</Button>
            <Button size="sm" className="h-9 bg-brand hover:bg-brand-2 font-extrabold" onClick={() => resolveDispute(o.id, 'release')}>حكم لصالح التاجر — تحرير المبلغ</Button>
          </div>
        </motion.div>
      ))}
      {resolved.length > 0 && (
        <div className="bg-card rounded-3xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border font-extrabold text-sm">أحكام صادرة</div>
          {resolved.map(o => (
            <div key={o.id} className="flex items-center justify-between p-3.5 border-b border-border last:border-0 text-xs flex-wrap gap-2">
              <span className="font-extrabold text-ink">#{ar(o.id.replace('DM-', ''))} — {o.dispute?.reason}</span>
              <span className="font-black text-brand">{o.dispute?.verdict}</span>
            </div>
          ))}
        </div>
      )}
      {chat && <ChatDialog oid={chat} open={!!chat} onOpenChange={v => { if (!v) setChat(null); }} />}
    </div>
  );
}
