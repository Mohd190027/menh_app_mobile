const { chromium } = require('playwright');
const SHOTS = '/tmp/render';
(async () => {
  const browser = await chromium.launch();
  // سطح المكتب: الرئيسية
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 940 } });
    const pg = await ctx.newPage();
    await pg.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await pg.waitForTimeout(900);
    await pg.screenshot({ path: SHOTS + '/f-home.png', clip: { x: 0, y: 0, width: 1280, height: 900 } });
    // عالم المأكولات والضيافة — الصورة التي كانت مكسورة
    const tri = await pg.evaluate(() => {
      const t = [...document.querySelectorAll('.tri')].find(x => x.innerText.includes('المأكولات'));
      if (t) { t.scrollIntoView(); return t.getBoundingClientRect(); } return null;
    });
    if (tri) { await pg.waitForTimeout(500); await pg.screenshot({ path: SHOTS + '/f-trio.png', clip: { x: Math.max(0, tri.x - 20), y: Math.max(0, tri.y - 20), width: 700, height: 420 } }); }
    // متجر قيمز زون (الغلاف كان مكسوراً)
    await pg.evaluate(() => window.go('store', 's9'));
    await pg.waitForTimeout(800);
    await pg.screenshot({ path: SHOTS + '/f-store9.png', clip: { x: 0, y: 0, width: 1280, height: 560 } });
    // منتج سماعة صقر برو (صوره كانت مكسورة)
    await pg.evaluate(() => window.go('product', 'p25'));
    await pg.waitForTimeout(800);
    await pg.screenshot({ path: SHOTS + '/f-p25.png', clip: { x: 0, y: 0, width: 1280, height: 720 } });
    await ctx.close();
  }
  // جوال: الرئيسية
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const pg = await ctx.newPage();
    await pg.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await pg.waitForTimeout(900);
    await pg.screenshot({ path: SHOTS + '/f-mobile.png' });
    await ctx.close();
  }
  // تاجر: نموذج المنتج + استوديو الوسائط
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 940 } });
    await ctx.addInitScript(() => { try { localStorage.setItem('dameen_v1', JSON.stringify({ ses: { phone: '0500000002' }, cart: [], gfav: [] })); } catch(e){} });
    const pg = await ctx.newPage();
    await pg.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await pg.waitForTimeout(900);
    await pg.evaluate(() => window.go('m-prods'));
    await pg.waitForTimeout(600);
    await pg.click('button:has-text("منتج جديد")');
    await pg.waitForTimeout(900);
    await pg.screenshot({ path: SHOTS + '/f-mform.png', fullPage: true });
    await ctx.close();
  }
  console.log('اللقطات جاهزة');
  await browser.close();
})();
