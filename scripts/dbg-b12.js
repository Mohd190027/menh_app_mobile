const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await (await b.newContext()).newPage();
  pg.on('pageerror', e => console.log('PAGEERROR:', e.message));
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(800);
  const r = await pg.evaluate(() => {
    SES = { phone: '0500000009', role: 'merchant', store: 's7' };
    render(); go('m-set');
    const s = myStore();
    return { s: !!s, name: s && s.name, sec: s && s.sec, txt: document.body.innerText.includes('حالة المتجر') };
  });
  console.log(JSON.stringify(r));
  await b.close();
})();
