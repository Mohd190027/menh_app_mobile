'use client';

/**
 * ضمين — React Shell
 * نفس التصميم بالضبط دون أي تغيير: تُشغَّل النسخة الأصلية نفسها
 * (نفس CSS / نفس الهيكل / نفس الجافاسكربت حرفياً) داخل React.
 * لا يُعاد كتابة أي جزء — صفر حذف.
 */
import { useEffect, useRef, useState } from 'react';

/* هيكل body الأصلي من dameen.html (حرفياً) */
const ORIGINAL_BODY = `
<div id="top"></div>
<main id="app" class="wrap"></main>
<button id="fab" class="fab" style="display:none" onclick="go('cart')"></button>
<div id="modals"></div>
<div id="toasts"></div>
<input type="file" id="fup" hidden accept="image/*">
`;

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // تحميل CSS الأصلي مرة واحدة
    if (!document.getElementById('dameen-css')) {
      const link = document.createElement('link');
      link.id = 'dameen-css';
      link.rel = 'stylesheet';
      link.href = '/dameen/dameen.css';
      document.head.appendChild(link);
    }
    // حقن هيكل body الأصلي حرفياً
    if (ref.current && !ref.current.dataset.injected) {
      ref.current.innerHTML = ORIGINAL_BODY;
      ref.current.dataset.injected = '1';
    }
    // تحميل الجافاسكربت الأصلي حرفياً (مرة واحدة)
    if (!document.getElementById('dameen-js')) {
      const s = document.createElement('script');
      s.id = 'dameen-js';
      s.src = '/dameen/dameen.js';
      s.async = false;
      document.body.appendChild(s);
      s.onload = () => setReady(true);
      // في حال وجود كاش أو خطأ ناعم
      s.onerror = () => setReady(true);
    }
  }, []);

  return <div ref={ref} />;
}
