'use client';
/* ضمين — top.tsx
 * الشريط العلوي + الفاب + قائمة الأقسام المنسدلة — منقول من dameen.js
 * (renderTop ٣٦٢-٣٩٨، mnav ٣٩٩، secDD/ddPlace ٤٠١-٤٢٠، bellBtn ٤٢١-٤٢٢، roleDD ٤٢٣-٤٣٧)
 * بنفس البنية والفئات والنصوص حرفياً — المعالجات تصبح خصائص React.
 */
import { $, ar, esc, SECTIONS, DB, toast } from './core';
import { SES, VIEW, go, render, renderTop, useTopTick, useAppTick, me, cartCount, LASTSEC, GFav } from './store';
import { openAuth, openBell, switchRole, logout } from './auth';
import { appMode, installApp } from './install';
import { P, ST } from './core';

/* mnav (السطر ٣٩٩) */
const Mnav = ({ p, l }) => (
  <button className={'nlink ' + (VIEW.page === p ? 'on' : '')} onClick={() => go(p)}>{l}</button>
);

export function Top() {
  useTopTick();
  const sbox = (
    <div className="sbox">
      <input id="sq" placeholder="ابحث عن منتج أو متجر…" defaultValue={VIEW.q || ''}
        onKeyDown={e => { if (e.key === 'Enter') searchGo() }} />
      <span className="si">🔎</span>
    </div>
  );
  const sb = VIEW.page === 'home' ? null : sbox;
  const brand = (
    <div className="brand" onClick={() => go('home')}>
      <div className="lg">ض</div>
      <div className="bt"><b>ضمين</b><small>تسوّق مضمون بثقة</small></div>
    </div>
  );
  /* زائر: الرئيسية نظيفة بلا بحث — البحث يظهر داخل الأقسام والمتاجر */
  if (!SES) return (
    <div className="topin">{brand}{sb}<button className="btn" onClick={() => openAuth()}>تسجيل الدخول</button></div>
  );
  if (SES.role === 'merchant') return (
    <div className="topin">{brand}{sb}
      <nav className="nav">
        <Mnav p="m-dash" l="📊 لوحة التحكم" />
        <Mnav p="m-prods" l="🧺 المنتجات" />
        <Mnav p="m-media" l="🎬 الوسائط" />
        <Mnav p="m-orders" l="📦 الطلبات" />
        <Mnav p="m-wallet" l="💰 المحفظة" />
        <Mnav p="m-disputes" l="⚖️ النزاعات" />
        <Mnav p="m-set" l="⚙️ الإعدادات" />
      </nav>
      <BellBtn /><RoleDD />
    </div>
  );
  if (SES.role === 'admin') return (
    <div className="topin">{brand}{sb}
      <nav className="nav">
        <Mnav p="a-hub" l="📊 مركز الإدارة" />
        <Mnav p="a-stores" l="🏪 المتاجر" />
        <Mnav p="a-disputes" l="⚖️ التحكيم" />
        <Mnav p="a-cats" l="🗂️ الأقسام" />
        <Mnav p="a-rev" l="📈 الإيرادات" />
      </nav>
      <BellBtn /><RoleDD />
    </div>
  );
  if (SES.role === 'staff') return (
    <div className="topin">{brand}{sb}
      <nav className="nav">
        <Mnav p="e-hub" l="🧑‍💼 مركز الموظف" />
        <Mnav p="e-stores" l="🏪 المتاجر" />
        <Mnav p="e-disputes" l="⚖️ النزاعات" />
      </nav>
      <BellBtn /><RoleDD />
    </div>
  );
  /* عميل مسجّل: القائمة الكاملة */
  const u = me();
  return (
    <div className="topin">{brand}{sb}
      <nav className="nav">
        <button className={'nlink ' + (VIEW.page === 'home' ? 'on' : '')} onClick={() => homeGo()}>الرئيسية</button>
        <button className={'nlink ' + (['section', 'store', 'product'].includes(VIEW.page) ? 'on' : '')} data-secb={""}
          onClick={e => secDD(e, e.currentTarget)}>🗂️ الأقسام ▾</button>
        <div className="ddmenu secs" id="secdrop">
          <div className="sechd">عوالم ضمين — اختر قسماً</div>
          {SECTIONS.map(s => (
            <div className="hti" key={s.id} onClick={() => go('section', s.id)}>
              <b><span style={{ color: s.color }}>●</span> {s.name}</b>
              <span>{s.desc}</span>
            </div>
          ))}
        </div>
        <Mnav p="favs" l="❤️ المفضلة" />
        <Mnav p="orders" l="🧾 طلباتي" />
        <Mnav p="dlib" l="📚 مكتبتي" />
        <Mnav p="disputes" l="⚖️ نزاعاتي" />
        <button className="nlink" onClick={() => go('cart')}>🛒 السلة{cartCount() ? <span className="bdg">{ar(cartCount())}</span> : null}</button>
        <Mnav p="account" l="👤 حسابي" />
      </nav>
      <BellBtn /><RoleDD />
    </div>
  );
}

/* renderFab (السطر ٣٤٦) */
export function Fab() {
  useAppTick();
  const show = !SES && cartCount() > 0;
  if (!show) return <button id="fab" className="fab" style={{ display: 'none' }} onClick={() => go('cart')} />;
  return (
    <button id="fab" className="fab" style={{ display: 'grid' }} onClick={() => go('cart')}>
      🛒{cartCount() ? <span className="bdg">{ar(cartCount())}</span> : null}
    </button>
  );
}

/* searchGo (السطر ٣٥١) */
export function searchGo(){const q=($('#sq')||{}).value||'';if(q.trim())go('search',q.trim())}
/* زر الرئيسية: داخل قسم (منتج/متجر/بحث سياقي) يعيدك بداية القسم نفسه — وإلا الصفحة الرئيسية */
export function homeGo(){
const pg=VIEW.page;
if(pg==='product'){const p=P(VIEW.pid);const st=p?ST(p.store):null;if(st&&st.sec){go('section',st.sec);return}}
if(pg==='store'){const st=ST(VIEW.store);if(st&&st.sec){go('section',st.sec);return}}
if(pg==='search'&&LASTSEC){go('section',LASTSEC);return}
go('home');
}

/* قائمة الأقسام المنسدلة — لوحة ثابتة (fixed) لا تُقص بحركة الشريط (٤٠١-٤٢٠ حرفياً) */
export function secDD(e,btn){
e.stopPropagation();
const el=$('#secdrop');if(!el)return;
if(el.classList.contains('open')){el.classList.remove('open');return}
ddPlace(el,btn);
}
if(typeof window!=='undefined'&&!(window as any).__secInit){(window as any).__secInit=1;
document.addEventListener('click',e=>{const el=$('#secdrop');
if(el&&el.classList.contains('open')&&!el.contains(e.target)&&!((e.target as HTMLElement).closest&&(e.target as HTMLElement).closest('[data-secb]')))el.classList.remove('open');
});
window.addEventListener('scroll',()=>{const el=$('#secdrop');if(el)el.classList.remove('open')},true)}
function ddPlace(el,btn){
const r=btn.getBoundingClientRect(),vw=window.innerWidth;
el.style.top=(r.bottom+8)+'px';
el.classList.add('open');
const w=el.offsetWidth,margin=10,room=vw-2*margin;
let end=Math.max(margin,Math.min(vw-r.right,vw-w-margin));
if(w>room){el.style.insetInlineEnd='';el.style.width=room+'px';el.style.left=margin+'px'}
else{el.style.width='';el.style.left='';el.style.insetInlineEnd=end+'px'}
}

/* bellBtn (السطر ٤٢١) */
function BellBtn(){const n=DB.notifs.filter(x=>x.to===SES.phone&&!x.read).length;
return <button className="iconbtn" onClick={() => openBell()} title="الإشعارات">🔔{n?<span className="bdg">{ar(n)}</span>:null}</button>}

/* roleDD (السطر ٤٢٣) — ملحوظة React: الأصل يوقف الانتشار عند العنصر فيمنع وصول النقرة لمغلق القوائم العام على مستند الصفحة؛
 * وReact يعلّق الأحداث على المستند نفسه، فنستخدم stopImmediatePropagation لتحقيق الدلالة نفسها بالضبط */
function RoleDD(){const u=me();const roleTxt={customer:'عميل',merchant:'تاجر',admin:'الإدارة',staff:'موظف إدارة'}[SES.role];
return <div className="dd" onClick={e=>{e.stopPropagation();if(e.nativeEvent&&e.nativeEvent.stopImmediatePropagation)e.nativeEvent.stopImmediatePropagation();e.currentTarget.classList.toggle('open')}}>
<div className="avat">{u.name[0]}</div>
<div className="ddmenu">
<div style={{padding:'9px 11px'}}><b style={{fontSize:'13px'}}>{u.name}</b><div className="hint">{ar(SES.phone)} · {roleTxt}</div></div>
<div className="sep"></div>
{SES.role!=='customer'?<div className="it" onClick={()=>switchRole('customer')}>🛍️ التسوق كعميل</div>:null}
{SES.role!=='merchant'&&(u.role==='merchant'||u.role==='admin')?<div className="it" onClick={()=>switchRole('merchant')}>🏪 لوحة التاجر</div>:null}
{SES.role!=='admin'&&u.role==='admin'?<div className="it" onClick={()=>switchRole('admin')}>🛡️ مركز الإدارة</div>:null}
{SES.role!=='staff'&&u.role==='staff'?<div className="it" onClick={()=>switchRole('staff')}>🧑‍💼 لوحة الموظف</div>:null}
{appMode()?null:<div className="it" onClick={()=>installApp()}>📲 ثبّت التطبيق</div>}
<div className="it" onClick={()=>go('account')}>⚙️ حسابي وإعداداتي</div>
<div className="sep"></div>
<div className="it" style={{color:'var(--red)'}} onClick={()=>logout()}>⏻ تسجيل الخروج</div>
</div></div>}
