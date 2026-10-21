const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(600);
  // login as merchant via UI clicks
  await pg.evaluate(() => openAuth());
  await pg.waitForTimeout(300);
  await pg.fill('#lg-id', '0500000002');
  await pg.fill('#lg-pw', '1234');
  await pg.evaluate(() => doLogin());
  await pg.waitForTimeout(700);
  const merchantView = await pg.evaluate(() => ({
    view: typeof VIEW !== 'undefined' ? VIEW : null,
    appLen: document.getElementById('app')?.innerHTML.length,
    h1: document.querySelector('#app h1, #app h2, #app .ph')?.textContent?.slice(0, 40) || null,
    visible: document.getElementById('app')?.innerText?.slice(0, 100),
  }));
  console.log('MERCHANT VIEW:', JSON.stringify(merchantView, null, 1));
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/diag-merchant-view.png' });
  console.log('ERRORS:', errs.length ? '\n' + errs.join('\n') : 'none');
  await b.close();
})();
