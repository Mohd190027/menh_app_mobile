/* اختبار zoomImg: صورة الدليل بحجمها الكامل داخل النافذة (كانت 124px) */
const { chromium } = require('playwright');
let fails = [];
const ok = (n, c) => { console.log((c ? '  ✓ ' : '  ✗ ') + n); if (!c) fails.push(n); };

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript(() => { try { localStorage.setItem('dameen_v1', JSON.stringify({ ses: { phone: '0500000001' }, cart: [], gfav: [] })); } catch(e){} });
  const pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 120)));
  await pg.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await pg.waitForTimeout(900);
  await pg.evaluate(() => window.go('disputes'));
  await pg.waitForTimeout(700);
  // افتح أول نزاع فيه صور دليل
  await pg.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const b = btns.find(x => /تفاصيل|فتح|متابعة/.test(x.innerText));
    if (b) b.click();
  });
  await pg.waitForTimeout(700);
  const ev = pg.locator('img.ev').first();
  if (await ev.count()) {
    await ev.scrollIntoViewIfNeeded();
    await ev.click();
    await pg.waitForTimeout(600);
    const z = await pg.evaluate(() => {
      const c = document.querySelector('.mback .mcard');
      const im = c && c.querySelector('img');
      if (!im) return null;
      const r = im.getBoundingClientRect();
      return { h: Math.round(r.height), w: Math.round(r.width), oy: getComputedStyle(c).overflowY, nat: im.naturalWidth };
    });
    ok('نافذة التكبير فتحت وصورة حقيقية: ' + (z && z.nat), !!z && z.nat > 0);
    ok('الصورة بحجم كامل (>200px ارتفاع، ليست 124px): ' + (z && z.h), z && z.h > 200);
    ok('نافذة التكبير قابلة للتمرير أيضاً: ' + (z && z.oy), z && z.oy === 'auto');
    await pg.screenshot({ path: '/tmp/render/g-zoom.png' });
  } else {
    // بديل: صور دليل EVP في صفحة النزاعات
    const ev2 = pg.locator('.evpill img').first();
    if (await ev2.count()) {
      await ev2.click(); await pg.waitForTimeout(500);
      const z = await pg.evaluate(() => { const im = document.querySelector('.mback .mcard img'); const r = im.getBoundingClientRect(); return { h: Math.round(r.height), w: Math.round(r.width) }; });
      ok('صورة الدليل بحجم كامل: ' + JSON.stringify(z), z.h > 200);
    } else console.log('  (لا صور أدلة ظاهرة في هذا النزاع)');
  }
  ok('لا أخطاء JS', errs.length === 0);
  await browser.close();
  console.log('════ ' + (fails.length ? 'فشل: ' + fails.join(' | ') : 'zoomImg سليمة ✓') + ' ════');
})();
