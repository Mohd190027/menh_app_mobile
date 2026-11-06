const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const seed = (ph) => `try{localStorage.setItem('dameen_v1',JSON.stringify({ses:{phone:'${ph}'},cart:[],gfav:[]}))}catch(e){}`;
  /* سطح المكتب */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 940 } });
    await ctx.addInitScript(() => { try { localStorage.setItem('dameen_v1', JSON.stringify({ ses: { phone: '0500000002' }, cart: [], gfav: [] })); } catch(e){} });
    const pg = await ctx.newPage();
    await pg.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await pg.waitForTimeout(900);
    await pg.evaluate(() => go('m-media'));
    await pg.waitForTimeout(700);
    await pg.screenshot({ path: '/tmp/render/n-media-desktop.png', fullPage: true });
    await ctx.close();
  }
  /* جوال */
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await ctx.addInitScript(() => { try { localStorage.setItem('dameen_v1', JSON.stringify({ ses: { phone: '0500000002' }, cart: [], gfav: [] })); } catch(e){} });
    const pg = await ctx.newPage();
    await pg.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await pg.waitForTimeout(900);
    await pg.evaluate(() => go('m-media'));
    await pg.waitForTimeout(700);
    await pg.screenshot({ path: '/tmp/render/n-media-mobile.png' });
    await ctx.close();
  }
  /* فورم المنتج الجديد ببطاقة التوجيه */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await ctx.addInitScript(() => { try { localStorage.setItem('dameen_v1', JSON.stringify({ ses: { phone: '0500000002' }, cart: [], gfav: [] })); } catch(e){} });
    const pg = await ctx.newPage();
    await pg.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await pg.waitForTimeout(900);
    await pg.evaluate(() => go('m-prods'));
    await pg.waitForTimeout(400);
    await pg.click('button:has-text("＋ منتج جديد")');
    await pg.waitForTimeout(600);
    await pg.screenshot({ path: '/tmp/render/n-form-card.png', fullPage: true });
    await ctx.close();
  }
  await browser.close();
  console.log('اللقطات جاهزة');
})();
