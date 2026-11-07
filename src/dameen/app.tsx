'use client';
/* ضمين — app.tsx
 * جذر التطبيق: نفس هيكل body الأصلي حرفياً (#top / main#app / #fab / #modals / #toasts / #fup)
 * + الراوتر (نفس خريطة R في render) + الإقلاع (الاستعادة + المؤقّت + الحفظ + التثبيت).
 */
import { useEffect } from 'react';
import { DB, clock, toast, impAnim } from './core';
import { VIEW, appSave, appRestore, useAppTick, go, render, renderTop, __dbg } from './store';
import { Top, Fab } from './top';
import { ModalHost } from './ui';
import { initInstall, appMode } from './install';
import { doRelease } from './pages/orders';
import { PgHome, PgSearch, PgSection, PgStore, PgProduct, PgFavs, PgDLib } from './pages/shop';
import { PgCart } from './pages/cart';
import { PgOrders } from './pages/orders';
import { PgDisputes } from './pages/disputes';
import { PgAccount } from './pages/account';
import { PgMDash, PgMProds, PgMMedia } from './pages/merchant1';
import { PgMOrders, PgMWallet, PgMDisputes, PgMSet } from './pages/merchant2';
import { PgAHub, PgEHub, PgAStoresPage, PgADisputes, PgACats, PgARev } from './pages/admin';

/* استعادة الجلسة قبل أول رسم — نفس توقيت appRestore() في الأصل (السطر ٣١١٨) */
if (typeof window !== 'undefined') appRestore();

/* جسر الاختبارات: نفس واجهة الأصل للمفات (go/render) */
if (typeof window !== 'undefined' && !(window as any).__d) {
  (window as any).__d = { go, render: () => render(), renderTop: () => renderTop(), appSave, appRestore, dbg: __dbg };
}

/* خريطة الصفحات — نفس R في render() (السطر ٣٣٩) */
function Page() {
  switch (VIEW.page) {
    case 'home': return <PgHome />;
    case 'search': return <PgSearch />;
    case 'section': return <PgSection />;
    case 'store': return <PgStore />;
    case 'product': return <PgProduct />;
    case 'cart': return <PgCart />;
    case 'orders': return <PgOrders />;
    case 'dlib': return <PgDLib />;
    case 'disputes': return <PgDisputes />;
    case 'account': return <PgAccount />;
    case 'favs': return <PgFavs />;
    case 'm-dash': return <PgMDash />;
    case 'm-prods': return <PgMProds />;
    case 'm-media': return <PgMMedia />;
    case 'm-orders': return <PgMOrders />;
    case 'm-wallet': return <PgMWallet />;
    case 'm-disputes': return <PgMDisputes />;
    case 'm-set': return <PgMSet />;
    case 'a-hub': return <PgAHub />;
    case 'a-stores': return <PgAStoresPage />;
    case 'a-disputes': return <PgADisputes />;
    case 'a-cats': return <PgACats />;
    case 'a-rev': return <PgARev />;
    case 'e-hub': return <PgEHub />;
    case 'e-stores': return <PgAStoresPage />;
    case 'e-disputes': return <PgADisputes />;
    default: return <PgHome />;
  }
}

export default function DameenApp() {
  const t = useAppTick();

  /* المؤقّت العالمي (السطر ١٧٣٥): تحرير تلقائي عند انتهاء نافذة الحماية + نبض العدادات [data-cd] */
  useEffect(() => {
    const iv = setInterval(() => {
      let changed = false;
      DB.orders.forEach(o => o.groups.forEach(g => {
        if (g.status === 'received' && g.complaintUntil && Date.now() >= g.complaintUntil) { doRelease(o, g, 'انتهاء نافذة الحماية'); changed = true; }
      }));
      document.querySelectorAll('[data-cd]').forEach(el => {
        const tt = +((el as HTMLElement).dataset).cd - Date.now(); const b = el.querySelector('b');
        if (b) b.textContent = '⏳ ' + clock(tt) + ' '; else el.textContent = '⏳ ' + clock(tt);
        if (tt <= 0) changed = true;
      });
      if (changed) render();
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  /* الإقلاع (٣١٢١-٣١٢٥): إغلاق القوائم عند النقر + الحفظ عند الإغلاق/الإخفاء + المانيفست + ترحيب التطبيق */
  useEffect(() => {
    initInstall();
    const closer = () => document.querySelectorAll('.dd.open').forEach(d => d.classList.remove('open'));
    document.addEventListener('click', closer);
    window.addEventListener('beforeunload', appSave);
    document.addEventListener('visibilitychange', () => { if (document.hidden) appSave(); });
    if (appMode()) setTimeout(() => toast('أهلاً بك في تطبيق ضمين 👋', 'ok'), 1200);
    return () => document.removeEventListener('click', closer);
  }, []);

  /* render() في الأصل يشغّل impAnim عند الرئيسية (السطر ٣٤٤) */
  useEffect(() => { if (VIEW.page === 'home') setTimeout(impAnim, 60); }, [t]);

  /* هيكل body الأصلي حرفياً */
  return (
    <>
      <div id="top"><Top /></div>
      <main id="app" className="wrap" key={t}><Page /></main>
      <Fab />
      <ModalHost />
      <div id="toasts"></div>
      <input type="file" id="fup" hidden accept="image/*" />
    </>
  );
}
