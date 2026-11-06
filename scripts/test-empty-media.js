/* حالة الإفراغ: متجر بلا منتجات + فحص هندسي سريع لصفحة الاستوديو */
const { chromium } = require('playwright');
let fails = [];
const ok = (n, c) => { console.log((c ? '  ✓ ' : '  ✗ ') + n); if (!c) fails.push(n); };
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 940 } });
  await ctx.addInitScript(() => { try { localStorage.setItem('dameen_v1', JSON.stringify({ ses: { phone: '0500000002' }, cart: [], gfav: [] })); } catch(e){} });
  const pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 150)));
  await pg.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await pg.waitForTimeout(900);
  /* إفراغ منتجات المتجر في هذه الجلسة فقط */
  await pg.evaluate(() => { for (let i = PRODUCTS.length - 1; i >= 0; i--) if (PRODUCTS[i].store === 's1') PRODUCTS.splice(i, 1); go('m-media'); });
  await pg.waitForTimeout(500);
  const t = await pg.evaluate(() => document.querySelector('#app').innerText);
  ok('الحالة الفارغة: عنوان الصفحة', t.includes('استوديو الوسائط الترويجية'));
  ok('الحالة الفارغة: رسالة «لا منتجات بعد في متجرك»', t.includes('لا منتجات بعد في متجرك'));
  ok('الحالة الفارغة: زر الذهاب للمنتجات', await pg.locator('button:has-text("🧺 الذهاب للمنتجات")').count() === 1);
  await pg.screenshot({ path: '/tmp/render/n-media-empty.png' });
  /* إعادة المنتجات ثم فحص هندسي للصفحة الممتلئة */
  await pg.reload({ waitUntil: 'networkidle' });
  await pg.waitForTimeout(900);
  await pg.evaluate(() => go('m-media'));
  await pg.waitForTimeout(600);
  const geo = await pg.evaluate(() => {
    const probs = [];
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.right > window.innerWidth + 8 && !el.closest('.bubwrap, .nav')) {
        const cs = getComputedStyle(el);
        if (cs.position !== 'fixed') probs.push('خارج يمين: ' + (el.innerText || el.className || '').toString().slice(0, 40));
      }
    });
    const imgs = [...document.querySelectorAll('img')].filter(im => im.complete && im.naturalWidth === 0).map(im => im.src.slice(0, 70));
    return { probs, imgs };
  });
  ok('فحص هندسي: لا عناصر خارج الحدود', geo.probs.length === 0);
  if (geo.probs.length) console.log('   ', geo.probs.slice(0, 4).join(' | '));
  ok('فحص هندسي: لا صور مكسورة', geo.imgs.length === 0);
  if (geo.imgs.length) console.log('   ', geo.imgs.slice(0, 4).join(' | '));
  ok('لا أخطاء JS', errs.length === 0);
  if (errs.length) console.log('   ', errs.slice(0, 3));
  await ctx.close();
  await browser.close();
  console.log('════ ' + (fails.length ? 'فشل: ' + fails.join(' | ') : 'كل الفحوص ناجحة ✓') + ' ════');
})();
