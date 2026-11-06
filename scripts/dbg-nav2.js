const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 940 } });
  const pg = await ctx.newPage();
  await pg.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await pg.evaluate(() => { localStorage.setItem('dameen_v1', JSON.stringify({ ses: { phone: '0500000002', role: 'merchant' }, cart: [], gfav: [] })); });
  await pg.reload({ waitUntil: 'networkidle' });
  await pg.waitForTimeout(1000);
  const st = await pg.evaluate(() => {
    let SESv, USERSv;
    try { SESv = SES; } catch(e) { SESv = 'ERR:' + e.message; }
    try { USERSv = USERS ? Object.keys(USERS).slice(0,5) : null; } catch(e) { USERSv = 'ERR:' + e.message; }
    return {
      saved: localStorage.getItem('dameen_v1'),
      SES: SESv,
      userKeys: USERSv,
      user002: typeof USERS !== 'undefined' ? JSON.stringify(USERS['0500000002']) : null,
    };
  });
  console.log(JSON.stringify(st, null, 2));
  await browser.close();
})();
