#!/usr/bin/env node
/* أداة تشخيص فروق المطابقة: parity-diff.js <routeId> [top|app]
 * تعيد فتح المسار على الجانبين وتطبع أول فرق حقيقي بين innerHTML المطبعين */
const { chromium } = require('playwright');
const fs = require('fs');

const ROUTES = require('./parity-routes.js');
const r = ROUTES.find(x => x.id === process.argv[2]);
const WHICH = process.argv[3] || 'app';
if (!r) { console.log('المسارات المتاحة:', ROUTES.map(x => x.id).join(' ')); process.exit(1); }

const NORM_FILE = '/home/z/my-project/scripts/norm.js';
const NORM = fs.readFileSync(NORM_FILE, 'utf8');

async function shoot(ctx, url, isReact) {
  const page = await ctx.newPage();
  await page.addInitScript(() => { try { Date.now = () => 1790000000000; } catch (e) {} });
  await page.addInitScript(seed => { try { localStorage.setItem('dameen_v1', seed); } catch (e) {} },
    JSON.stringify(r.ses ? { ses: r.ses, cart: [], gfav: [] } : { cart: [], gfav: [] }));
  await page.goto(url, { waitUntil: 'networkidle' });
  if (isReact) { await page.waitForSelector('main#app', { timeout: 15000 }); await page.waitForFunction('!!window.__d', null, { timeout: 15000 }); }
  await page.waitForTimeout(400);
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
  await page.evaluate(([p, a]) => { (window.__d ? window.__d.go : window.go)(p, a); }, [r.page, r.arg]);
  await page.waitForTimeout(700);
  const html = await page.evaluate(sel => { const el = document.querySelector(sel); return el ? el.innerHTML : ''; }, WHICH === 'top' ? '#top' : WHICH === 'modals' ? '#modals' : '#app');
  await page.close();
  return html;
}

function firstDiff(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  const ctx = 160;
  return {
    at: i,
    orig: a.slice(Math.max(0, i - ctx), i + ctx).replace(/\n/g, '⏎'),
    react: b.slice(Math.max(0, i - ctx), i + ctx).replace(/\n/g, '⏎'),
  };
}

(async () => {
  const browser = await chromium.launch();
  const c1 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const c2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  let normA;
  const rawA = await shoot(c1, 'http://localhost:3000/dameen.html', false);
  const rawB = await shoot(c2, 'http://localhost:3000/', true);
  // تطبيع داخل متصفح فارغ
  const p = await browser.newPage();
  const a = await p.evaluate(`(${NORM})(${JSON.stringify(rawA)})`);
  const b = await p.evaluate(`(${NORM})(${JSON.stringify(rawB)})`);
  fs.writeFileSync(`/tmp/parity-${WHICH}-orig.html`, a);
  fs.writeFileSync(`/tmp/parity-${WHICH}-react.html`, b);
  if (a === b) console.log('✓ متطابق تماماً (' + WHICH + ')');
  else {
    const d = firstDiff(a, b);
    console.log(`✗ فرق عند المحرف ${d.at} من ${a.length}/${b.length}`);
    console.log('--- الأصل:   …' + d.orig + '…');
    console.log('--- React:   …' + d.react + '…');
    console.log('(الملفات الكاملة: /tmp/parity-' + WHICH + '-{orig,react}.html)');
  }
  await browser.close();
})();
