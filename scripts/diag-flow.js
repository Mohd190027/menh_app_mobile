const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(600);

  // 1. find and click the top login button exactly like a user would
  const clicked = await pg.evaluate(() => {
    const cands = [...document.querySelectorAll('button, a, div[onclick]')].filter(x => ((x.textContent || '') + (x.getAttribute('onclick') || '')).includes('openAuth'));
    if (!cands.length) return 'NO openAuth trigger found';
    cands[cands.length - 1].click();
    return 'clicked: ' + cands.map(c => c.textContent.trim().slice(0, 20)).join(' | ');
  });
  await pg.waitForTimeout(400);
  const modalOpen = await pg.evaluate(() => !!document.querySelector('#modals .mback'));
  console.log('TRIGGER:', clicked, '| MODAL OPEN:', modalOpen);

  // 2. submit login as customer via UI
  const prefilled = await pg.evaluate(() => ({
    id: document.querySelector('#lg-id')?.value,
    pw: document.querySelector('#lg-pw')?.value,
  }));
  console.log('PREFILLED:', JSON.stringify(prefilled));
  await pg.evaluate(() => doLogin());
  await pg.waitForTimeout(600);
  const after = await pg.evaluate(() => ({
    ses: typeof SES !== 'undefined' ? JSON.stringify(SES) : 'undefined',
    modals: document.querySelector('#modals').innerHTML.length,
    toast: document.querySelector('.toast, #toasts')?.textContent?.slice(0, 60) || null,
  }));
  console.log('AFTER LOGIN:', JSON.stringify(after));
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/diag-after-login.png' });

  // 3. test merchant + admin too
  for (const [id, expect] of [['0500000002', 'merchant'], ['0500000003', 'admin']]) {
    const r = await pg.evaluate(([id]) => {
      closeModal && closeModal();
      openAuth();
      document.querySelector('#lg-id').value = id;
      document.querySelector('#lg-pw').value = '1234';
      doLogin();
      return { role: SES ? SES.role : null, page: typeof PG !== 'undefined' ? PG : (typeof CUR !== 'undefined' ? CUR : null) };
    }, [id]);
    await pg.waitForTimeout(300);
    console.log('LOGIN', id, '=>', JSON.stringify(r));
  }
  console.log('ERRORS:', errs.length ? '\n' + errs.join('\n') : 'none');
  await b.close();
})();
