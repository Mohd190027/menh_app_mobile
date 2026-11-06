#!/usr/bin/env node
/* حصانة مطابقة React ↔ الأصل — نفس التصميم بالضبط
 * لكل مسار × دور: قارن #top و#app و#modals و#fab (innerHTML مطبيع) + لقطة بكسلية.
 * الأصل: http://localhost:3000/dameen.html   |   React: http://localhost:3000/
 */
const { chromium } = require('playwright');
const fs = require('fs');

const OUT = '/home/z/my-project/scripts/shots/rx-parity';
fs.mkdirSync(OUT, { recursive: true });

/* المطارات: صفحة + وسيط + جلسة مزروعة (نفس dameen_v1 على الجانبين) */
const ROUTES = [
  // زائر
  { id: 'guest-home', ses: null, page: 'home' },
  { id: 'guest-search', ses: null, page: 'search', arg: 'عباية' },
  { id: 'guest-section', ses: null, page: 'section', arg: 'fashion' },
  { id: 'guest-store', ses: null, page: 'store', arg: 's1' },
  { id: 'guest-product', ses: null, page: 'product', arg: 'p1' },
  { id: 'guest-cart', ses: null, page: 'cart' },
  { id: 'guest-favs', ses: null, page: 'favs' },
  { id: 'guest-disputes', ses: null, page: 'disputes' },
  { id: 'guest-account', ses: null, page: 'account' },
  { id: 'guest-dlib', ses: null, page: 'dlib' },
  { id: 'guest-orders', ses: null, page: 'orders' },
  // عميلة
  { id: 'cust-home', ses: { phone: '0500000001' }, page: 'home' },
  { id: 'cust-section', ses: { phone: '0500000001' }, page: 'section', arg: 'gaming' },
  { id: 'cust-store', ses: { phone: '0500000001' }, page: 'store', arg: 's6' },
  { id: 'cust-product', ses: { phone: '0500000001' }, page: 'product', arg: 'p19' },
  { id: 'cust-orders', ses: { phone: '0500000001' }, page: 'orders' },
  { id: 'cust-account', ses: { phone: '0500000001' }, page: 'account' },
  { id: 'cust-favs', ses: { phone: '0500000001' }, page: 'favs' },
  { id: 'cust-disputes', ses: { phone: '0500000001' }, page: 'disputes' },
  { id: 'cust-dlib', ses: { phone: '0500000001' }, page: 'dlib' },
  // تاجرة
  { id: 'mer-home', ses: { phone: '0500000002' }, page: 'home' },
  { id: 'mer-dash', ses: { phone: '0500000002' }, page: 'm-dash' },
  { id: 'mer-prods', ses: { phone: '0500000002' }, page: 'm-prods' },
  { id: 'mer-media', ses: { phone: '0500000002' }, page: 'm-media' },
  { id: 'mer-orders', ses: { phone: '0500000002' }, page: 'm-orders' },
  { id: 'mer-wallet', ses: { phone: '0500000002' }, page: 'm-wallet' },
  { id: 'mer-disputes', ses: { phone: '0500000002' }, page: 'm-disputes' },
  { id: 'mer-set', ses: { phone: '0500000002' }, page: 'm-set' },
  // الإدارة العليا
  { id: 'adm-hub', ses: { phone: '0500000003' }, page: 'a-hub' },
  { id: 'adm-stores', ses: { phone: '0500000003' }, page: 'a-stores', arg: 'stores' },
  { id: 'adm-reqs', ses: { phone: '0500000003' }, page: 'a-stores', arg: 'reqs' },
  { id: 'adm-disputes', ses: { phone: '0500000003' }, page: 'a-disputes' },
  { id: 'adm-cats', ses: { phone: '0500000003' }, page: 'a-cats' },
  { id: 'adm-rev', ses: { phone: '0500000003' }, page: 'a-rev' },
  // موظف الإدارة
  { id: 'stf-hub', ses: { phone: '0500000013' }, page: 'e-hub' },
  { id: 'stf-stores', ses: { phone: '0500000013' }, page: 'e-stores' },
  { id: 'stf-disputes', ses: { phone: '0500000013' }, page: 'e-disputes' },
];

/* تطبيع DOM داخل الصفحة: حذف سمات on* + توحيد style + حذف عقد المسافات الخالصة
 * + طمس النصوص الزمنية غير الحتمية (عدادات ⏳ والساعات) */
const NORM = require('fs').readFileSync('/home/z/my-project/scripts/norm.js','utf8');

async function shoot(ctx, url, isReact, r) {
  const page = await ctx.newPage();
  await page.addInitScript(() => { try { Date.now = () => 1790000000000; } catch (e) {} });
  await page.addInitScript(seed => {
    try { localStorage.setItem('dameen_v1', seed); } catch (e) {}
  }, JSON.stringify(r.ses ? { ses: r.ses, cart: [], gfav: [] } : { cart: [], gfav: [] }));
  await page.goto(url, { waitUntil: 'networkidle' });
  if (isReact) { await page.waitForSelector('#app main, main#app', { timeout: 15000 }); await page.waitForFunction('!!window.__d', null, { timeout: 15000 }); }
  await page.waitForTimeout(400);
  // تجميد الحركات CSS للقطات الحتمية (على الجانبين معاً)
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent}' });
  await page.evaluate(([p, a]) => (isReactFlag => { (isReactFlag ? window.__d.go : window.go)(p, a); })(typeof window.__d !== 'undefined'), [r.page, r.arg]);
  await page.waitForTimeout(1750);
  const data = await page.evaluate(`(${NORM})`, r);
  const res = await page.evaluate(`(() => {
    const n = ${NORM};
    const fab = document.querySelector('#fab');
    return {
      top: n(document.querySelector('#top')),
      app: n(document.querySelector('#app')),
      modals: n(document.querySelector('#modals')),
      fabDisplay: fab ? getComputedStyle(fab).display : 'none',
      appH: document.querySelector('#app') ? document.querySelector('#app').scrollHeight : 0,
      text: (document.querySelector('#app') ? document.querySelector('#app').innerText : '').replace(/[٠-٩]{2}:[٠-٩]{2}:[٠-٩]{2}/g, '⏱').replace(/\\s+/g, ' ').trim()
    };
  })()`);
  // إجبار الصور الكسولة على الظهور ثم انتظار اكتمالها جميعاً (لقطات حتمية)
  await page.evaluate(() => { const h = document.body.scrollHeight; window.scrollTo(0, h); });
  await page.waitForTimeout(250);
  await page.evaluate(() => window.scrollTo(0, 0));
  try { await page.waitForFunction(() => [...document.images].every(i => i.complete), null, { timeout: 8000 }); } catch (e) {}
  try { await page.evaluate(() => document.fonts.ready.then(() => true)); } catch (e) {}
  // فرض تحميل كل أوجه الخطوط ومجموعاتها (الأرقام العربية تُحمَّل كسولاً وتختلف مقاييسها مع البديل)
  try { await page.evaluate(async () => {
    const fams = ['"IBM Plex Sans Arabic"', 'Alexandria'];
    const weights = [300, 400, 500, 600, 700, 800, 900];
    for (const f of fams) for (const w of weights) { try { await document.fonts.load(`${w} 14px ${f}`, 'ضمين ٠١٢٣٤٥٦٧٨٩ ر.س'); } catch (e) {} }
    await document.fonts.ready;
  }); } catch (e) {}
  try { await page.waitForFunction(() => document.fonts.status === 'loaded', null, { timeout: 8000 }); } catch (e) {}
  await page.waitForTimeout(700);
  const shot = `${OUT}/${r.id}.${isReact ? 'react' : 'orig'}.png`;
  await page.screenshot({ path: shot });
  await page.close();
  return { ...res, shot };
}

(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const r of ROUTES) {
    const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    let o, x;
    try {
      o = await shoot(ctx1, 'http://localhost:3000/dameen.html', false, r);
      x = await shoot(ctx2, 'http://localhost:3000/', true, r);
    } catch (e) {
      results.push({ id: r.id, error: String(e).slice(0, 300) });
      await ctx1.close(); await ctx2.close();
      continue;
    }
    const cmp = {
      top: o.top === x.top,
      app: o.app === x.app,
      modals: o.modals === x.modals,
      fab: o.fabDisplay === x.fabDisplay,
      text: o.text === x.text,
    };
    results.push({ id: r.id, ...cmp, ok: Object.values(cmp).every(Boolean), appH: [o.appH, x.appH] });
    await ctx1.close(); await ctx2.close();
  }
  await browser.close();
  fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(results, null, 1));
  const bad = results.filter(x => !x.ok || x.error);
  console.log('==================== تقرير المطابقة ====================');
  for (const r of results) {
    if (r.error) console.log('✗', r.id, 'ERROR:', r.error.slice(0, 120));
    else if (!r.ok) console.log('✗', r.id, Object.entries(r).filter(([k, v]) => ['top', 'app', 'modals', 'fab', 'text'].includes(k) && v === false).map(([k]) => k).join(' '), 'FAIL | heights:', r.appH.join('/'));
    else console.log('✓', r.id);
  }
  console.log('========================================================');
  console.log('ناجح:', results.length - bad.length, '/', results.length);
})();
