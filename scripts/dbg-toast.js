/* تشخيص التوست المعترض */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1360, height: 900 } });
  await pg.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await pg.waitForTimeout(1000);
  await pg.getByRole('button', { name: 'تسجيل الدخول', exact: true }).first().click();
  await pg.locator('[placeholder*="name@mail.com"]').fill('0500000001');
  await pg.locator('[placeholder="••••"]').fill('1234');
  await pg.getByRole('button', { name: '🔑 دخول' }).click();
  await pg.waitForTimeout(1000);
  await pg.getByRole('button', { name: 'طلباتي', exact: true }).first().click();
  await pg.waitForTimeout(1000);
  // راقب التوستات 12 ثانية
  for (let i = 0; i < 6; i++) {
    const info = await pg.evaluate(() => {
      const toasts = [...document.querySelectorAll('[data-sonner-toast]')].map(t => ({
        txt: t.textContent.slice(0, 60),
        rect: t.getBoundingClientRect().toJSON(),
      }));
      return toasts;
    });
    console.log('t=' + i * 2 + 's toasts:', JSON.stringify(info));
    await pg.waitForTimeout(2000);
  }
  await b.close();
})().catch(e => { console.error('EXC:', e.message); process.exit(1); });
