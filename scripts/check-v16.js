/* فحص دخاني سريع للنسخة المعاد بناؤها — v16 */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  await pg.waitForTimeout(1500);
  console.log('title:', await pg.title());
  console.log('h1/h2 count:', await pg.locator('h1, h2').count());
  console.log('worlds text on home:', await pg.locator('text=عالم').count());
  console.log('errors:', errs.length ? errs.slice(0, 5) : 'NONE');
  await b.close();
})().catch(e => { console.error('EXC:', e.message); process.exit(1); });
