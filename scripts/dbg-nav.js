const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 940 } });
  const pg = await ctx.newPage();
  pg.on('pageerror', e => console.log('PAGEERROR:', String(e).slice(0, 200)));
  pg.on('console', m => { if (m.type() === 'error') console.log('CONSOLE ERR:', m.text().slice(0, 200)); });
  await pg.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await pg.evaluate(() => { localStorage.setItem('dameen_v1', JSON.stringify({ ses: { phone: '0500000002', role: 'merchant' }, cart: [], gfav: [] })); });
  await pg.reload({ waitUntil: 'networkidle' });
  await pg.waitForTimeout(1000);
  const st1 = await pg.evaluate(() => ({ page: window.VIEW && window.VIEW.page, ses: window.SES, bub: document.querySelectorAll('.bub').length, h1: (document.querySelector('#app h1')||{}).innerText }));
  console.log('بعد التحميل:', JSON.stringify(st1));
  await pg.evaluate(() => window.go('m-prods'));
  await pg.waitForTimeout(1000);
  const st2 = await pg.evaluate(() => ({ page: window.VIEW && window.VIEW.page, bub: document.querySelectorAll('.bub').length, h1: (document.querySelector('#app h1')||{}).innerText, modal: document.querySelectorAll('.mback').length }));
  console.log('بعد go(m-prods):', JSON.stringify(st2));
  await browser.close();
})();
