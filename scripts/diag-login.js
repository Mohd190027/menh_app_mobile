const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(800);
  // try to open login
  const btns = await pg.$$('button, a');
  let opened = false;
  for (const b2 of btns) {
    const t = (await b2.textContent()) || '';
    if (t.includes('تسجيل الدخول') || t.includes('دخول')) { await b2.click().catch(()=>{}); await pg.waitForTimeout(500); if (await pg.$('.modal, .auth, [id*=auth]')) { opened = true; break; } }
  }
  await pg.waitForTimeout(800);
  const state = await pg.evaluate(() => {
    const el = document.querySelector('#modal, .modal, #authwrap, [id^="auth"]');
    return { found: !!el, visible: el ? getComputedStyle(el).display : null, bodyHas: document.body.innerHTML.length };
  }).catch(e => 'EVAL FAIL: ' + e.message);
  console.log('OPENED:', opened, 'STATE:', JSON.stringify(state));
  console.log('ERRORS:', errs.length ? errs.join('\n') : 'none');
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/diag-login.png', fullPage: false });
  await b.close();
})();
