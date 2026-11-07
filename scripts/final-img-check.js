/* الفحص النهائي: كل الصور في كل الصفحات تُحمَّل (naturalWidth>0) */
const { chromium } = require('playwright');
const BASE = 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch();
  let totalImgs = 0, totalBad = 0;

  const check = async (label, phone, pages) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 940 } });
    if (phone) {
      await ctx.addInitScript((ph) => {
        try { localStorage.setItem('dameen_v1', JSON.stringify({ ses: { phone: ph }, cart: [], gfav: [] })); } catch(e){}
      }, phone);
    }
    const pg = await ctx.newPage();
    await pg.goto(BASE, { waitUntil: 'networkidle' });
    await pg.waitForTimeout(800);
    for (const v of pages) {
      await pg.evaluate(x => { window.go(x); }, v);
      await pg.waitForTimeout(700);
      // افتح أول منتج من الرئيسية للتأكد من صفحة المنتج
      if (v === 'PRODUCTPAGE') {
        await pg.evaluate(() => window.go('product', 'p25'));
        await pg.waitForTimeout(700);
      }
      const r = await pg.evaluate(() => {
        const imgs = [...document.querySelectorAll('img')];
        const bad = imgs.filter(im => im.complete && im.naturalWidth === 0).map(im => im.src.slice(0, 80));
        return { n: imgs.length, bad };
      });
      totalImgs += r.n; totalBad += r.bad.length;
      console.log(`  ${label}${v === 'PRODUCTPAGE' ? '/منتج' : '/' + v}: ${r.n} صورة ${r.bad.length ? '✗ مكسورة: ' + r.bad.join(', ') : 'كلها تُحمّل ✓'}`);
    }
    await ctx.close();
  };

  await check('زائر', null, ['home', 'PRODUCTPAGE']);
  // فتح متاجر رئيسية
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 940 } });
    const pg = await ctx.newPage();
    await pg.goto(BASE, { waitUntil: 'networkidle' });
    await pg.waitForTimeout(800);
    for (const sid of ['s1','s3','s5','s6','s9','s10']) {
      await pg.evaluate(x => window.go('store', x), sid);
      await pg.waitForTimeout(600);
      const r = await pg.evaluate(() => {
        const imgs = [...document.querySelectorAll('img')];
        return { n: imgs.length, bad: imgs.filter(im => im.complete && im.naturalWidth === 0).map(im => im.src.slice(0,80)) };
      });
      totalImgs += r.n; totalBad += r.bad.length;
      console.log(`  متجر ${sid}: ${r.n} صورة ${r.bad.length ? '✗ ' + r.bad.join(',') : '✓'}`);
    }
    await ctx.close();
  }
  await check('عميل', '0500000001', ['cart', 'orders', 'disputes', 'account', 'favs']);
  await check('تاجر', '0500000002', ['m-prods', 'm-orders', 'm-wallet', 'm-set']);
  await check('موظف', '0500000013', ['e-stores', 'e-disputes']);
  await check('إدارة', '0500000003', ['a-stores', 'a-disputes', 'a-cats']);

  await browser.close();
  console.log(`\n════ الإجمالي: ${totalImgs} صورة مفحوصة | مكسورة: ${totalBad} ${totalBad === 0 ? '— ممتاز ✓' : ''} ════`);
})();
