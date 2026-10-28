/* هيكل ضمين: الشريط العلوي، البحث الفوري، التنبيهات، الحساب، التنقل السفلي، التذييل، نافذة الدخول، سلة جانبية */
'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Search, Bell, ShoppingCart, Heart, Home, LayoutGrid, Package, User,
  LogOut, Store as StoreIcon, Settings, ChevronDown, Trash2, Lock, ArrowLeft, Sparkles,
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ar, CITIES, DEMO_LOGINS, PAY_METHODS, money } from './data';
import { cartTotals, curPrice, useDameen } from './state';
import { QtyStepper, WorldChip, EmptyState } from './ui';

/* ============ الشعار ============ */
export function Logo({ light = true }: { light?: boolean }) {
  const { go } = useDameen();
  return (
    <button className="flex items-center gap-2 shrink-0" onClick={() => go({ name: 'home' })} aria-label="ضمين - الرئيسية">
      <span className={`w-9 h-9 rounded-xl flex items-center justify-center shadow ${light ? 'bg-gold text-brand' : 'bg-brand text-gold'}`}>
        <ShieldCheck size={19} strokeWidth={2.4} />
      </span>
      <span className={`font-black text-xl tracking-tight ${light ? 'text-cream' : 'text-ink'}`}>ضمين</span>
    </button>
  );
}

/* ============ البحث الفوري ============ */
function InstantSearch() {
  const { products, stores, go } = useDameen();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const hits = useMemo(() => {
    const k = q.trim();
    if (k.length < 1) return [];
    return products
      .map(p => ({ p, st: stores.find(s => s.id === p.store) }))
      .filter(({ p, st }) => !st?.susp && (p.name.includes(k) || p.cat.includes(k) || (st?.name || '').includes(k)))
      .slice(0, 6);
  }, [q, products, stores]);
  return (
    <div className="relative flex-1 max-w-md">
      <form onSubmit={e => { e.preventDefault(); if (q.trim()) { go({ name: 'search', q: q.trim() }); setOpen(false); } }}>
        <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-white/50" />
        <Input
          value={q}
          onChange={e => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="ابحث عن منتج أو متجر…"
          className="bg-white/10 border-white/20 text-cream placeholder:text-white/45 rounded-full h-9 ps-9 pe-3 focus-visible:ring-gold/60"
          aria-label="البحث"
        />
      </form>
      {open && q.trim().length > 0 && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 inset-x-0 z-50 bg-card text-ink rounded-2xl shadow-2xl border border-border overflow-hidden">
            {hits.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">لا نتائج لـ«{q}» — جرّب كلمة أخرى</div>
            ) : hits.map(({ p, st }) => (
              <button
                key={p.id}
                className="w-full flex items-center gap-3 p-2.5 hover:bg-accent text-start transition-colors"
                onClick={() => { go({ name: 'product', id: p.id }); setOpen(false); setQ(''); }}
              >
                {p.imgs[0] ? <img src={p.imgs[0]} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <span className="w-10 h-10 rounded-lg bg-sand flex items-center justify-center">🛍️</span>}
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-bold truncate">{p.name}</span>
                  <span className="block text-[11px] text-muted-foreground">{st?.name} · {p.cat}</span>
                </span>
                <span className="text-sm font-extrabold text-brand shrink-0">{money(curPrice(p))}</span>
              </button>
            ))}
            <button className="w-full p-2 text-xs font-bold text-brand bg-accent/60 hover:bg-accent" onClick={() => { go({ name: 'search', q: q.trim() }); setOpen(false); }}>
              كل النتائج عن «{q}» ←
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* رابط تنقلي داخل الشريط */
function NavLink({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      className={`text-[13px] font-bold px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${active ? 'bg-white/15 text-gold' : 'text-cream/85 hover:text-cream hover:bg-white/10'}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* ============ الشريط العلوي ============ */
export function TopBar() {
  const { session, route, go, cart, notifs, setCartOpen, openAuth, markNotifsRead, logout, worlds } = useDameen();
  const role = session?.role;
  const myNotifs = notifs.filter(n => n.to === role);
  const unread = myNotifs.filter(n => !n.read).length;
  return (
    <header className="sticky top-0 z-50 bg-brand text-cream shadow-md">
      <div className="max-w-6xl mx-auto px-3 md:px-6 h-14 flex items-center gap-2 md:gap-4">
        <Logo />
        {role !== 'merchant' && role !== 'admin' && (
          <div className="hidden md:flex flex-1 justify-center"><InstantSearch /></div>
        )}
        <nav className="hidden md:flex items-center gap-0.5 ms-auto" aria-label="التنقل الرئيسي">
          {role === 'customer' && (
            <>
              <NavLink active={route.name === 'home'} onClick={() => go({ name: 'home' })}>الرئيسية</NavLink>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={`text-[13px] font-bold px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 ${route.name === 'section' ? 'bg-white/15 text-gold' : 'text-cream/85 hover:bg-white/10'}`}>
                    العوالم <ChevronDown size={13} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-60">
                  {worlds.map(w => (
                    <DropdownMenuItem key={w.id} onClick={() => go({ name: 'section', id: w.id })} className="gap-2">
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: w.color }}>{w.icon}</span>
                      <span className="flex flex-col"><span className="font-bold text-xs">{w.name}</span><span className="text-[10px] text-muted-foreground">حماية {w.win}</span></span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <NavLink active={route.name === 'favorites'} onClick={() => go({ name: 'favorites' })}>المفضلة</NavLink>
              <NavLink active={route.name === 'orders'} onClick={() => go({ name: 'orders' })}>طلباتي</NavLink>
              <NavLink active={route.name === 'disputes'} onClick={() => go({ name: 'disputes' })}>نزاعاتي</NavLink>
            </>
          )}
          {role === 'merchant' && (
            <>
              <NavLink active={route.name === 'merchant' && route.tab === 'overview'} onClick={() => go({ name: 'merchant', tab: 'overview' })}>لوحة التاجر</NavLink>
              <NavLink active={route.name === 'merchant' && route.tab === 'products'} onClick={() => go({ name: 'merchant', tab: 'products' })}>منتجاتي</NavLink>
              <NavLink active={route.name === 'merchant' && route.tab === 'orders'} onClick={() => go({ name: 'merchant', tab: 'orders' })}>الطلبات</NavLink>
              <NavLink active={route.name === 'merchant' && route.tab === 'wallet'} onClick={() => go({ name: 'merchant', tab: 'wallet' })}>المحفظة</NavLink>
            </>
          )}
          {role === 'admin' && (
            <>
              <NavLink active={route.name === 'admin' && route.tab === 'overview'} onClick={() => go({ name: 'admin', tab: 'overview' })}>مركز الإدارة</NavLink>
              <NavLink active={route.name === 'admin' && route.tab === 'stores'} onClick={() => go({ name: 'admin', tab: 'stores' })}>المتاجر</NavLink>
              <NavLink active={route.name === 'admin' && route.tab === 'cats'} onClick={() => go({ name: 'admin', tab: 'cats' })}>الأقسام</NavLink>
              <NavLink active={route.name === 'admin' && route.tab === 'disputes'} onClick={() => go({ name: 'admin', tab: 'disputes' })}>التحكيم</NavLink>
              <NavLink active={route.name === 'admin' && route.tab === 'revenue'} onClick={() => go({ name: 'admin', tab: 'revenue' })}>الإيرادات</NavLink>
            </>
          )}
        </nav>
        <div className="flex items-center gap-1 ms-auto md:ms-0">
          {(role === 'customer' || !role) && (
            <>
              <button aria-label="البحث" className="md:hidden w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center" onClick={() => go({ name: 'search', q: '' })}>
                <Search size={17} />
              </button>
              <button aria-label="السلة" className="relative w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center" onClick={() => setCartOpen(true)}>
                <ShoppingCart size={18} />
                {cart.length > 0 && <span className="absolute -top-0.5 -end-0.5 bg-gold text-brand text-[10px] font-black w-4.5 h-4.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center">{ar(cart.length)}</span>}
              </button>
            </>
          )}
          {session && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button aria-label="التنبيهات" className="relative w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center">
                  <Bell size={17} />
                  {unread > 0 && <span className="absolute top-1 end-1 w-2 h-2 bg-gold rounded-full animate-pulse" />}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80" onOpenChange={o => { if (o) setTimeout(markNotifsRead, 1200); }}>
                <DropdownMenuLabel className="font-extrabold">التنبيهات</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {myNotifs.length === 0 && <div className="p-4 text-sm text-muted-foreground text-center">لا تنبيهات بعد</div>}
                {myNotifs.slice(0, 6).map(n => (
                  <DropdownMenuItem key={n.id} className="items-start gap-2 py-2.5" disabled>
                    <span className="text-xl shrink-0">{n.ic}</span>
                    <span className="flex flex-col gap-0.5">
                      <span className={`text-xs ${n.read ? 'font-semibold' : 'font-extrabold'}`}>{n.t}</span>
                      <span className="text-[11px] text-muted-foreground leading-relaxed">{n.b}</span>
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 ps-1.5 pe-2.5 h-9 rounded-full bg-white/10 hover:bg-white/15 transition-colors" aria-label="حسابي">
                  <span className="w-6.5 h-6.5 w-[26px] h-[26px] rounded-full bg-gold text-brand text-xs font-black flex items-center justify-center">{session.name.charAt(0)}</span>
                  <span className="hidden sm:block text-xs font-bold max-w-24 truncate">{session.name}</span>
                  <ChevronDown size={13} className="text-cream/70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>
                  <div className="font-extrabold text-sm">{session.name}</div>
                  <div className="text-[11px] text-muted-foreground font-normal">{ar(session.phone)} · {session.role === 'customer' ? 'عميل' : session.role === 'merchant' ? 'تاجر' : 'الإدارة'}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {session.role === 'customer' && (
                  <>
                    <DropdownMenuItem onClick={() => go({ name: 'account' })} className="gap-2"><User size={15} /> حسابي وإعداداتي</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => go({ name: 'orders' })} className="gap-2"><Package size={15} /> طلباتي</DropdownMenuItem>
                  </>
                )}
                {session.role === 'merchant' && <DropdownMenuItem onClick={() => go({ name: 'merchant', tab: 'overview' })} className="gap-2"><StoreIcon size={15} /> لوحة التاجر</DropdownMenuItem>}
                {session.role === 'admin' && <DropdownMenuItem onClick={() => go({ name: 'admin', tab: 'overview' })} className="gap-2"><Settings size={15} /> مركز الإدارة</DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="gap-2 text-red-600 focus:text-red-600"><LogOut size={15} /> تسجيل الخروج</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button className="bg-gold text-brand text-[13px] font-black px-4 h-9 rounded-full hover:brightness-105 active:scale-95 transition-all shadow" onClick={() => openAuth('login')}>
              تسجيل الدخول
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

/* ============ التنقل السفلي (جوال - عميل) ============ */
export function BottomNav() {
  const { route, go, cart } = useDameen();
  const items = [
    { id: 'home', t: 'الرئيسية', icon: Home, r: { name: 'home' as const } },
    { id: 'section', t: 'العوالم', icon: LayoutGrid, r: { name: 'section', id: 'fashion' } },
    { id: 'favorites', t: 'المفضلة', icon: Heart, r: { name: 'favorites' } },
    { id: 'orders', t: 'طلباتي', icon: Package, r: { name: 'orders' } },
    { id: 'account', t: 'حسابي', icon: User, r: { name: 'account' } },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]" aria-label="التنقل السفلي">
      <div className="grid grid-cols-5">
        {items.map(it => {
          const active = route.name === it.id || (it.id === 'section' && route.name === 'section');
          const Icon = it.icon;
          return (
            <button key={it.id} className="relative flex flex-col items-center gap-0.5 py-2" onClick={() => go(it.r)}>
              {active && <motion.span layoutId="bnav" className="absolute top-0 w-8 h-0.5 rounded-full bg-brand" />}
              <Icon size={19} className={active ? 'text-brand' : 'text-muted-foreground'} />
              <span className={`text-[10px] font-bold ${active ? 'text-brand' : 'text-muted-foreground'}`}>{it.t}</span>
              {it.id === 'orders' && cart.length > 0 && <span className="absolute top-1 end-[22%] bg-gold text-brand text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{ar(cart.length)}</span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ============ التذييل ============ */
export function Footer() {
  const { go, worlds } = useDameen();
  return (
    <footer className="mt-auto bg-brand text-cream/80">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 pb-24 md:pb-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-9 h-9 rounded-xl bg-gold text-brand flex items-center justify-center"><ShieldCheck size={19} strokeWidth={2.4} /></span>
            <span className="font-black text-xl text-cream">ضمين</span>
          </div>
          <p className="text-xs leading-relaxed text-cream/65">
            منصة التسوق السعودية بضمان الإسكرو — نحجز مبلغك في خزنة مستقلة حتى استلامك ورضاك، والعمولة تُحسم من التاجر فقط.
          </p>
        </div>
        <div>
          <h4 className="font-extrabold text-cream text-sm mb-3">العوالم</h4>
          <ul className="space-y-2 text-xs">
            {worlds.map(w => (
              <li key={w.id}>
                <button className="hover:text-gold transition-colors" onClick={() => go({ name: 'section', id: w.id })}>{w.icon} {w.name}</button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-extrabold text-cream text-sm mb-3">الأمان</h4>
          <ul className="space-y-2 text-xs text-cream/65 leading-relaxed">
            <li>🔒 خزنة ضمان مستقلة</li>
            <li>⏱️ تحرير تلقائي بانتهاء الحماية</li>
            <li>⚖️ تحكيم ثلاثي الأطراف</li>
            <li>🚚 شحن آلي عبر OTO وTorod</li>
          </ul>
        </div>
        <div>
          <h4 className="font-extrabold text-cream text-sm mb-3">الدفع</h4>
          <div className="flex flex-wrap gap-1.5">
            {PAY_METHODS.map(m => (
              <span key={m.id} className="text-[10px] font-bold bg-white/10 border border-white/15 rounded-md px-2 py-1">{m.badge}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 text-[11px] text-cream/50 flex flex-col md:flex-row items-center justify-between gap-2 pb-24 md:pb-4">
          <span>ضمين © {ar(2026)} — تسوّق مضمون بثقة</span>
          <span>ضريبة القيمة المضافة ١٥٪ مضمّنة · الشحن مجاني فوق ٢٠٠ ر.س</span>
        </div>
      </div>
    </footer>
  );
}

/* ============ نافذة الدخول والتسجيل ============ */
export function AuthModal() {
  const { ui, closeAuth, login, register, registerStoreReq, worlds } = useDameen();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [reg, setReg] = useState({ name: '', phone: '', city: '' });
  const [st, setSt] = useState({ own: '', store: '', sec: 'fashion', phone: '', email: '', cr: '', iban: '' });
  const doLogin = () => { if (!login(id, pw)) setErr('تعذر الدخول — تحقق من المعرّف وكلمة المرور (1234)'); };
  return (
    <Dialog open={ui.authOpen} onOpenChange={v => { if (!v) closeAuth(); }}>
      <DialogContent className="max-w-md p-0 overflow-hidden gap-0" dir="rtl" aria-describedby={undefined}>
        <div className="bg-brand text-cream p-5 flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-gold text-brand flex items-center justify-center shadow-lg"><ShieldCheck size={26} strokeWidth={2.2} /></span>
          <div>
            <DialogTitle className="text-cream font-black text-lg">أهلاً بك في ضمين</DialogTitle>
            <p className="text-xs text-cream/70">سجّل دخولك — مالك محجوز حتى ترضى 🛡️</p>
          </div>
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {ui.authTab === 'login' && (
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-bold">رقم الجوال أو البريد</Label>
                <Input value={id} onChange={e => { setId(e.target.value); setErr(''); }} placeholder="05xxxxxxxx أو name@mail.com" className="mt-1" dir="ltr" />
              </div>
              <div>
                <Label className="text-xs font-bold">كلمة المرور</Label>
                <Input type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(''); }} placeholder="••••" className="mt-1" dir="ltr" onKeyDown={e => e.key === 'Enter' && doLogin()} />
              </div>
              {err && <p className="text-xs text-red-600 font-semibold">{err}</p>}
              <Button className="w-full bg-brand hover:bg-brand-2 font-extrabold h-10" onClick={doLogin}>🔑 دخول</Button>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground"><span className="flex-1 h-px bg-border" />أو جرّب مباشرة بحساب جاهز<span className="flex-1 h-px bg-border" /></div>
              <div className="grid grid-cols-3 gap-2">
                {DEMO_LOGINS.map(d => (
                  <button key={d.phone} className="border border-border rounded-xl p-2.5 hover:border-brand hover:bg-accent/60 transition-colors text-center" onClick={() => useDameen.getState().loginAs(d.phone)}>
                    <div className="text-xl mb-1">{d.label.split(' ')[0]}</div>
                    <div className="text-[10px] font-bold text-ink leading-tight">{d.label.split(' ').slice(1).join(' ')}</div>
                    <div className="text-[9px] text-muted-foreground mt-0.5">{d.name}</div>
                  </button>
                ))}
              </div>
              <Button variant="outline" className="w-full font-bold h-10" onClick={() => useDameen.getState().openAuth('reg')}>✨ حساب جديد — سجّل خلال دقيقة</Button>
            </div>
          )}
          {ui.authTab === 'reg' && (
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-bold">الاسم الكامل</Label>
                <Input value={reg.name} onChange={e => setReg({ ...reg, name: e.target.value })} placeholder="مثال: نورة العبدالله" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-bold">رقم الجوال</Label>
                <Input value={reg.phone} onChange={e => setReg({ ...reg, phone: e.target.value })} placeholder="05xxxxxxxx" className="mt-1" dir="ltr" />
              </div>
              <div>
                <Label className="text-xs font-bold">المدينة</Label>
                <Select value={reg.city} onValueChange={v => setReg({ ...reg, city: v })}>
                  <SelectTrigger className="mt-1 w-full"><SelectValue placeholder="اختر مدينتك" /></SelectTrigger>
                  <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-brand hover:bg-brand-2 font-extrabold h-10" onClick={() => register(reg.name, reg.phone, reg.city)}>إنشاء حسابي 🎉</Button>
              <button className="w-full text-xs font-bold text-brand hover:underline" onClick={() => useDameen.getState().openAuth('store')}>
                🏪 لديك متجر؟ سجّل متجرك في ضمين ←
              </button>
            </div>
          )}
          {ui.authTab === 'store' && (
            <div className="space-y-3">
              <div className="bg-gold/10 border border-gold/30 rounded-xl p-3 text-[11px] leading-relaxed text-ink">
                🏪 انضمام متجرك لضمين: تُراجع الإدارة طلبك ثم يظهر متجرك للعملاء فور الموافقة — عمولة ضمين ٢٫٥٪ فقط تُحسم عند التحرير.
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs font-bold">اسمك</Label>
                  <Input value={st.own} onChange={e => setSt({ ...st, own: e.target.value })} className="mt-1" placeholder="هند الشهري" />
                </div>
                <div>
                  <Label className="text-xs font-bold">جوالك</Label>
                  <Input value={st.phone} onChange={e => setSt({ ...st, phone: e.target.value })} className="mt-1" placeholder="05xxxxxxxx" dir="ltr" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-bold">اسم المتجر</Label>
                <Input value={st.store} onChange={e => setSt({ ...st, store: e.target.value })} className="mt-1" placeholder="عطور تلال الطائف" />
              </div>
              <div>
                <Label className="text-xs font-bold">العالم</Label>
                <Select value={st.sec} onValueChange={v => setSt({ ...st, sec: v })}>
                  <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{worlds.map(w => <SelectItem key={w.id} value={w.id}>{w.icon} {w.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs font-bold">البريد</Label>
                  <Input value={st.email} onChange={e => setSt({ ...st, email: e.target.value })} className="mt-1" placeholder="name@mail.com" dir="ltr" />
                </div>
                <div>
                  <Label className="text-xs font-bold">السجل التجاري</Label>
                  <Input value={st.cr} onChange={e => setSt({ ...st, cr: e.target.value })} className="mt-1" placeholder="10xxxxxxxx" dir="ltr" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-bold">الآيبان</Label>
                <Input value={st.iban} onChange={e => setSt({ ...st, iban: e.target.value })} className="mt-1" placeholder="SAxxxxxxxxxxxx" dir="ltr" />
              </div>
              <Button
                className="w-full bg-gold text-brand hover:brightness-105 font-extrabold h-10"
                onClick={() => { if (st.own && st.store && st.phone) registerStoreReq(st); }}
              >
                إرسال طلب الانضمام 📋
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ============ السلة الجانبية ============ */
export function CartDrawer() {
  const { ui, setCartOpen, cart, products, setQty, removeLine, session, go, openAuth } = useDameen();
  const t = cartTotals(cart, products);
  const line = (pid: string) => {
    const p = products.find(x => x.id === pid)!;
    const l = cart.find(x => x.pid === pid)!;
    return (
      <div key={pid} className="flex gap-3 p-3 border border-border rounded-2xl bg-card">
        {p.imgs[0] ? <img src={p.imgs[0]} alt={p.name} className="w-16 h-16 rounded-xl object-cover shrink-0" /> : <span className="w-16 h-16 rounded-xl bg-sand flex items-center justify-center text-2xl">🛍️</span>}
        <div className="flex-1 min-w-0">
          <button className="font-bold text-sm text-ink line-clamp-1 text-start hover:text-brand" onClick={() => { setCartOpen(false); go({ name: 'product', id: p.id }); }}>{p.name}</button>
          <div className="my-1"><WorldChip storeId={p.store} /></div>
          <div className="flex items-center justify-between gap-2">
            <QtyStepper small qty={l.qty} set={q => setQty(pid, q)} max={p.stock} />
            <span className="font-extrabold text-sm text-brand">{money(curPrice(p) * l.qty)}</span>
          </div>
        </div>
        <button aria-label="حذف" className="text-muted-foreground hover:text-red-500 self-start" onClick={() => removeLine(pid)}><Trash2 size={15} /></button>
      </div>
    );
  };
  return (
    <Sheet open={ui.cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="left" className="w-full sm:max-w-md p-0 flex flex-column gap-0" dir="rtl">
        <SheetHeader className="p-4 border-b border-border bg-brand text-cream rounded-none">
          <SheetTitle className="text-cream flex items-center gap-2 text-base">
            <ShoppingCart size={17} /> سلتك {cart.length > 0 && <span className="bg-gold text-brand text-[11px] font-black px-2 py-0.5 rounded-full">{ar(cart.length)} منتج</span>}
          </SheetTitle>
        </SheetHeader>
        {cart.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon="🛒"
              title="سلتك فارغة"
              sub="تجوّل في عوالم ضمين الأربعة وأضف ما يعجبك — مبلغك يبقى محجوزاً حتى ترضى."
              cta={<Button className="bg-brand hover:bg-brand-2 font-bold" onClick={() => { setCartOpen(false); go({ name: 'home' }); }}>ابدأ التسوق ←</Button>}
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {cart.map(l => line(l.pid))}
            </div>
            <div className="border-t border-border p-4 space-y-3 bg-sand/50">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">المجموع</span><span className="font-bold">{money(t.subtotal)}</span></div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الشحن</span>
                  {t.shipping === 0
                    ? <span className="font-bold text-emerald-700">مجاني 🎉</span>
                    : <span className="font-bold">{money(t.shipping)}</span>}
                </div>
                <div className="flex justify-between"><span className="text-muted-foreground">ضريبة القيمة المضافة ١٥٪</span><span className="font-bold">{money(t.vat)}</span></div>
                <div className="flex justify-between border-t border-border pt-1.5"><span className="font-extrabold">الإجمالي</span><span className="font-black text-brand text-lg">{money(t.total)}</span></div>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed flex items-start gap-1.5">
                <Lock size={13} className="shrink-0 mt-0.5 text-brand" />
                سيُحجز الإجمالي في خزنة ضمين المستقلة — لا يستلم التاجر شيئاً حتى تأكيد استلامك.
              </p>
              <Button
                className="w-full bg-brand hover:bg-brand-2 font-extrabold h-11 text-base"
                onClick={() => {
                  if (!session) { setCartOpen(false); openAuth('login'); return; }
                  setCartOpen(false); go({ name: 'checkout' });
                }}
              >
                إتمام الطلب الآمن <ArrowLeft size={16} />
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export const TrustChips = () => (
  <div className="flex flex-wrap gap-2">
    {['🔒 خزنة ضمان مستقلة', '⏱️ تحرير تلقائي', '⚖️ تحكيم ثلاثي', '🚚 شحن آلي OTO/Torod', '⚡ تسليم رقمي فوري'].map(t => (
      <span key={t} className="text-[11px] font-bold bg-white/10 border border-white/15 text-cream/90 rounded-full px-3 py-1">{t}</span>
    ))}
  </div>
);

export const Sparkline = () => <Sparkles size={14} className="text-gold" />;
